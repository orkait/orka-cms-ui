/* eslint-disable @next/next/no-img-element */

import { faArrowLeft, faCode, faEraser, faFile, faFileArchive, faFileImage, faFilePdf, faFileUpload, faFileWord, faFolder, faGear, faGears, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { use, useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import customToast from "@/toast";
import { handleNetworkError, useEffectAsync } from "../utils/util";
import { fileAPI, api } from "@/service/api";
import { ListResponseType, SingleProductType, singleFileMetaType } from "@/types/type";
import Swal from "sweetalert2";
import env from "@/env";
import { produce } from "immer";
import { MediaContext, MediaContextDefaultValue } from "@/context/MediaContext";


export const fileSize = (sizeInBytes: number) => {
    // round to the nearest KB if less than 1MB
    if (sizeInBytes < 1024 * 1024) {
        return `${Math.round(sizeInBytes / 1024)} KB`;
    }
    // round to the nearest MB if less than 1GB
    if (sizeInBytes < 1024 * 1024 * 1024) {
        return `${Math.round(sizeInBytes / (1024 * 1024))} MB`;
    }
    // round to the nearest GB
    return `${Math.round(sizeInBytes / (1024 * 1024 * 1024))} GB`;
};



export const fileIcon = (extension: string | undefined) => {
    if (!extension) {
        return faFile;
    }

    extension = extension.toLowerCase();
    switch (extension) {
        case "png":
        case "jpg":
        case "jpeg":
        case "gif":
            return faFileImage;

        // compressed files
        case "zip":
        case "rar":
        case "7z":
        case "tar":
        case "gz":
        case "bz2":
            return faFileArchive;

        // text files
        case "txt":
        case "md":
        case "html":
        case "css":
        case "js":
            return faCode;

        // pdf files
        case "pdf":
            return faFilePdf;

        // word files
        case "doc":
        case "docx":
            return faFileWord;
        default:
            return faFile;
    }
};

const FileUploadCard = ({
    fileChangeHandler,
    localFile,
}: {
    fileChangeHandler: (e: any) => void;
    localFile: File | null;
}) => {
    return (
        <figure className="relative ">
            <input
                className="opacity-0 w-full h-full absolute top-0 left-0"
                type="file"
                onChange={fileChangeHandler}
            />
            {
                localFile ? (
                    <img
                        src={localFile ? URL.createObjectURL(localFile) : "https://placehold.co/300x200"}
                        alt="Shoes"
                        className="w-[300px] h-[200px] object-scale-down "
                        style={{
                            maxWidth: "300px",
                        }}

                    />
                ) : (
                    <div className="w-[300px] h-[200px] flex items-center justify-center border-[1px] border-white rounded-md ">
                        <div className="text-center text-lg font-bold border-2 border-dotted px-2">
                            Select a file
                        </div>
                    </div>
                )
            }
        </figure>
    )
}


const FolderCard = ({ folder }: { folder: singleFileMetaType }) => {

    const [showSettings, setShowSettings] = useState(false);
    const [localFile, setLocalFile] = useState(null);
    const { folders, path, setPath, setFolders } = useContext(MediaContext)

    return (
        <div className="flex flex-col text-center relative cursor-pointer hover:opacity-80 ">
            {
                showSettings ? (
                    <>
                        <div className="w-[300px] h-[200px] ">
                            <FileUploadCard
                                fileChangeHandler={async (e) => {
                                    e.preventDefault();

                                    // clear file array
                                    setLocalFile(null);

                                    const file = e.target.files[0];
                                    if (!file) return;
                                    setLocalFile(file);

                                    console.log("files changed")

                                    // upload file
                                    const formData = new FormData();
                                    formData.append("file", file);



                                    try {
                                        const fileUpload = await fileAPI.post(`/upload?path=${path}/`, formData, {
                                            headers: {
                                                Accept: "application/json",
                                                "Access-Control-Allow-Origin": "*",
                                                "Content-Type": "multipart/form-data",
                                            },
                                        })

                                        console.log(fileUpload.data);
                                    } catch (error) {
                                        console.log(error);
                                    }


                                }}
                                localFile={localFile} />
                        </div>
                    </>
                ) : (
                    <>
                        <img
                            src={folder.downloadLink || "https://placehold.co/300x200"}
                            style={{
                                maxWidth: "300px",
                            }}

                            className="w-[300px] h-[200px]  rounded-md "
                            onClick={() => {
                                setPath(folder.name);
                            }}
                            alt={folder.filename}
                        />
                    </>
                )
            }

            <div>
                {folder.filename}
            </div>
            <div className="absolute top-2 right-2 ">
                <div className="flex gap-2">
                    <FontAwesomeIcon
                        className={`cursor-pointer p-1 btn btn-circle btn-xs ${showSettings ? "btn-primary" : 'btn-secondary'}`}
                        icon={faGears}
                        size="xs"
                        onClick={() => setShowSettings(!showSettings)}
                    />

                    {
                        localFile && (
                            <>
                                <FontAwesomeIcon
                                    className="cursor-pointer p-1  btn-warning btn btn-circle btn-xs "
                                    icon={faEraser}
                                    onClick={() => {
                                        setLocalFile(null);
                                    }}
                                />
                            </>
                        )
                    }

                    {
                        folder.downloadLink && (
                            <FontAwesomeIcon
                                className="cursor-pointer btn-error btn btn-circle btn-xs p-1"
                                icon={faTrash}
                                onClick={async () => {
                                    try {
                                        Swal.fire({
                                            title: "Are you sure?",
                                            text: "You won't be able to revert this!",
                                            icon: "warning",
                                            showCancelButton: true,
                                            confirmButtonColor: "#3085d6",
                                            cancelButtonColor: "#d33",
                                            confirmButtonText: "Yes, delete it!",
                                        }).then(async (result) => {
                                            if (result.isConfirmed) {
                                                await fileAPI.delete(`/delete?path=${folder.bindedPath}`);

                                                // clear file array
                                                setLocalFile(null);

                                                // remove folder from state
                                                setFolders(
                                                    produce(folders, (draft) => {
                                                        draft.map((item, index) => {
                                                            if (item.name === folder.name) {
                                                                draft.splice(index, 1);
                                                            }
                                                        })
                                                    })
                                                )
                                            }
                                        })
                                    } catch (error) {
                                        console.log(error);
                                    }
                                }}
                            />
                        )
                    }
                </div>
            </div>
        </div>
    )
}


const ListFiles = () => {
    const { path, setPath, files, setFiles, folders, setFolders, loading, setLoading } = useContext(MediaContext)

    useEffectAsync(async () => {
        setLoading(true);
        try {
            const response = await fileAPI.get<ListResponseType>(`list?path=${path}`)
            const _data = response.data.data.data;

            const _folders = _data.filter((item) => item.isFolder)
                .map((item) => {
                    const temp = item.name.split('/');
                    // pick 2nd last item
                    item.filename = temp[temp.length - 2];
                    item.downloadLink = "";
                    return item;
                });


            const _files = _data.filter((item) => !item.isFolder)
                .map((item) => {
                    item.filename = item.name.split("/").pop() || "";
                    item.fileNameWithoutExtension = item.filename.split('.').slice(0, -1).join('.');
                    item.fileExtension = item.filename.split('.').pop() || "";
                    return item;
                });

            const _fileNames = _files.map((item) => item.fileNameWithoutExtension);
            const _folderNames = _folders.map((item) => item.filename);


            _fileNames.forEach((item, index) => {
                if (_folderNames.includes(item)) {
                    const temp = _folderNames.indexOf(item)
                    _folders[temp].downloadLink = _files[index]?.downloadLink;
                    _folders[temp].bindedPath = _files[index]?.name;
                }
            })

            _fileNames.forEach((item, index) => {
                if (_folderNames.includes(item)) {
                    // remove from files
                    _files.splice(index, 1);
                }
            })

            setFiles(_files);
            setFolders(_folders);

        } catch (error) {
            console.log("error -->", error);
        }
        setLoading(false);
    }, [path]);

    return (
        <>
            <div className="text-lg font-bold breadcrumbs ml-2">
                <ul>
                    {
                        path?.split('/').map((item, index) => (
                            item && (

                                <li key={index}
                                    onClick={() => {
                                        const temp = path.split('/');
                                        const newPath = temp.slice(0, index + 1).join('/');
                                        setPath(newPath);
                                    }}
                                    className={`cursor-pointer ${index === 0 ? 'text-blue-500' : 'text-gray-500'}`}
                                >
                                    {item}
                                </li>
                            )
                        ))
                    }
                </ul>
            </div>

            <h1 className="text-2xl font-bold ml-2" >
                Folders
            </h1>

            <div className="flex justify-start child:m-2 ">
                {
                    loading && (
                        <div className="loading loading-spinner loading-md"></div>
                    )
                }
                {
                    !loading && folders.map((folder, index) => {
                        return (
                            <FolderCard
                                folder={folder}
                                key={index}
                            />
                        )
                    })
                }
                {
                    folders.length === 0 && (
                        <div className="text-center text-lg text-gray-500">
                            No folders found
                        </div>
                    )
                }
            </div>

            <div className="divider" />

            <h1 className="text-2xl font-bold ml-2" >
                Files
            </h1>

            <div className="flex flex-wrap justify-start child:m-2 ">
                {
                    loading && (
                        <div className="loading loading-spinner loading-md"></div>
                    )
                }
                {
                    !loading && files.map((file, index) => (
                        <div
                            onClick={() => {
                                Swal.fire({
                                    imageUrl: file.downloadLink,
                                    denyButtonText: `delete ${file.filename}`,
                                    showCloseButton: true,
                                    showConfirmButton: false,
                                    imageWidth: 600,
                                    // imageWidth: 200,
                                    // imageHeight: 200,
                                    showDenyButton: true,
                                    denyButtonAriaLabel: "Delete",

                                    // delete file from server
                                    denyButtonColor: "red",
                                    preDeny: async () => {

                                        Swal.fire({
                                            title: "Are you sure?",
                                            text: "You won't be able to revert this!",
                                            icon: "warning",
                                            showCancelButton: true,
                                            confirmButtonColor: "#3085d6",
                                            cancelButtonColor: "#d33",
                                            confirmButtonText: "Yes, delete it!",
                                        }).then(async (result) => {

                                            if (result.isConfirmed) {
                                                try {
                                                    await fileAPI.delete(`/delete?path=${file.name}`);

                                                    // remove file from state
                                                    files.map((item, index) => {
                                                        if (item.name === file.name) {
                                                            files.splice(index, 1);
                                                            setFiles([...files]);
                                                        }
                                                    })

                                                    customToast({
                                                        message: "File deleted successfully",
                                                        icon: "success",
                                                    });
                                                } catch (error) {
                                                    console.log(error);
                                                    customToast({
                                                        message: "Error deleting file",
                                                        icon: "error",
                                                    });
                                                }
                                            }
                                        })

                                    }


                                })
                            }}
                            className="card hover:opacity-30 cursor-pointer  items-center justify-center  "
                            key={index}
                        >
                            <img
                                src={file.downloadLink}
                                width={200}
                                height={200}
                                alt=""
                                className="object-scale-down h-48 border-2 w-full max-w-[200px] "
                            />
                            <div
                                className="text-center"
                            >
                                {file.filename}
                            </div>

                        </div>
                    ))
                }
            </div >
        </>
    )
}

const FileUploadModal = () => {
    const [localFile, setLocalFile] = useState(null);
    const { path, setShowUploadModal } = useContext(MediaContext);
    const [fileInfo, setFileInfo] = useState<SingleProductType>({
        productTitle: "",
        productLink: "",
        productDescription: "",
        productBrandName: "",
        productHighlights: [],
        productAttributes: [],
    });




    const fileChangeHandler = (e: any) => {
        e.preventDefault();

        // clear file array
        setLocalFile(null);

        const file = e.target.files[0];
        if (!file) return;
        setLocalFile(file);
    };

    const fileUploadHandler = async () => {
        try {
            const formData = new FormData();

            if (!localFile) {
                return customToast({
                    message: "Please select a file",
                    icon: "error",
                });
            }
            formData.append("file", localFile);

            const uploadResult = await fileAPI.post(
                `/upload?path=${path}`,
                formData,
                {
                    headers: {
                        Accept: "application/json",
                        "Access-Control-Allow-Origin": "*",
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            const bucket = uploadResult.data?.data?.bucket;

            if (bucket) {
                setLocalFile(null);
                customToast({
                    message: "File uploaded successfully",
                    icon: "success",
                })
            }

        } catch (error: any) {
            if (handleNetworkError(error)) return;

            customToast({
                message: "Error uploading files",
                icon: "error",
            });
            console.log(error.response?.data);
        }
    };

    const fileInfoUpdateHandler = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        const response = await api.post("/products/product", {
            productTitle: fileInfo.productTitle,
            productDescription: fileInfo.productDescription,
            productBrandName: fileInfo.productBrandName,
            productHighlights: fileInfo.productHighlights,
            productAttributes: fileInfo.productAttributes,
        })

        console.log(response.data);
    }



    return (
        <div className="flex flex-col w-full  ">
            <div className="flex flex-1 w-full border-[1px] border-white border-t-0 p-2 rounded-bl-md ">
                <div className="flex shadow-xl m-2 rounded-lg w-full gap-5 ">
                    <div className="flex flex-col ">
                        <div>
                            <FileUploadCard
                                fileChangeHandler={fileChangeHandler}
                                localFile={localFile}
                            />
                            <div className="card-body border-2 rounded-b-md border-t-0 ">
                                <div className="card-actions items-center justify-center child:flex-1  ">
                                    <div className="btn btn-primary btn-sm"
                                        onClick={fileUploadHandler}
                                    >
                                        <FontAwesomeIcon icon={faFileUpload} />
                                        <span className="ml-2">Upload</span>
                                    </div>
                                    <div className="btn btn-error btn-sm"
                                        onClick={() => {
                                            setLocalFile(null);
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                        <span className="ml-2">Delete</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex w-full mt-5 ">
                        <div className="flex-1 w-full ">
                            <div className="form-control w-full max-w-md">
                                <label className="label">
                                    <span className="label-text">Product Title</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    value={fileInfo?.productTitle}
                                    onChange={(e) => {
                                        setFileInfo(produce(fileInfo, (draft) => {
                                            draft.productTitle = e.target.value;
                                        }))
                                    }}
                                />
                            </div>
                            <div className="form-control w-full max-w-md">
                                <label className="label">
                                    <span className="label-text">Product Description</span>
                                </label>
                                <textarea
                                    className="textarea h-24 textarea-bordered w-full join-item"
                                    value={fileInfo?.productTitle}
                                    onChange={(e) => {
                                        setFileInfo(produce(fileInfo, (draft) => {
                                            draft.productTitle = e.target.value;
                                        }))
                                    }}
                                />
                            </div>
                        </div>
                        <div className="flex-1 w-full ">
                            <div className="form-control w-full max-w-md">
                                <label className="label">
                                    <span className="label-text">Product BrandName</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    value={fileInfo?.productTitle}
                                    onChange={(e) => {
                                        setFileInfo(produce(fileInfo, (draft) => {
                                            draft.productTitle = e.target.value;
                                        }))
                                    }}
                                />
                            </div>
                            <div className="form-control w-full max-w-md">
                                <label className="label">
                                    <span className="label-text">Product Highlights</span>
                                </label>
                                <textarea
                                    className="textarea h-24 textarea-bordered w-full join-item"
                                    value={fileInfo?.productTitle}
                                    onChange={(e) => {
                                        setFileInfo(produce(fileInfo, (draft) => {
                                            draft.productTitle = e.target.value;
                                        }))
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end join ">
                <button
                    className="btn btn-primary btn-sm join-item "
                    onClick={fileInfoUpdateHandler}
                >
                    Save Changes
                </button>
                <button className="btn btn-error btn-sm join-item"
                    onClick={() => {
                        setShowUploadModal(false);
                    }}
                >
                    Cancel
                </button>
            </div>
        </div>
    )
}

const FilesAndFoldersList = () => {
    const { path, setPath, showUploadModal, setShowUploadModal } = useContext(MediaContext);

    return (
        <div className="flex flex-col w-full ">
            <div className="flex justify-between child:m-2">
                <div className="btn btn-secondary btn-sm " onClick={() => {

                    if (path === env.FOLDER_NAME) return;

                    // check if path ends with '/'
                    if (path.endsWith('/')) {
                        // remove last '/' and then remove last folder
                        const temp = path.split('/');
                        temp.pop();
                        temp.pop();

                        // set path
                        setPath(temp.join('/'));
                        return;
                    }

                    // remove last folder
                    const temp = path.split('/');
                    temp.pop();

                    // set path
                    setPath(temp.join('/'));

                }}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                    <span className="ml-2">Back</span>
                </div>

                <div className="child:m-2">
                    {
                        !showUploadModal && (
                            <div className="btn btn-secondary btn-sm "
                                onClick={() => {
                                    setShowUploadModal(true);
                                }}
                            >
                                upload new file
                                <FontAwesomeIcon icon={faFile} />
                            </div>
                        )
                    }
                    <div className="btn btn-primary btn-sm "
                        onClick={() => {
                            Swal.fire({
                                title: "Create Folder",
                                input: "text",
                                showCancelButton: true,
                                confirmButtonText: "Create",
                                showLoaderOnConfirm: true,
                                preConfirm: async (folderName) => {

                                    return await fileAPI.post(`/create-folder?path=${path}/${folderName}`)
                                        .then((response) => {
                                            console.log(response.data);
                                            return response.data;
                                        }
                                        )
                                        .catch((error) => {
                                            console.log(error);
                                            Swal.showValidationMessage(
                                                `Request failed: ${error}`
                                            );
                                        });
                                },
                                allowOutsideClick: () => !Swal.isLoading(),
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    customToast({
                                        message: "Folder created successfully",
                                        icon: "success",
                                    });


                                }
                                else if (result.isDenied) {
                                    customToast({
                                        message: "Folder creation cancelled",
                                        icon: "error",
                                    });
                                }
                                else {
                                    customToast({
                                        message: "Folder creation cancelled",
                                        icon: "error",
                                    });
                                }
                            })
                        }}
                    >
                        create folder
                        <FontAwesomeIcon icon={faFolder} />
                    </div>
                </div>

            </div>

            <ListFiles />
        </div>
    )
}



const Media = () => {

    const { showUploadModal } = useContext(MediaContext);

    return (
        <div className="flex flex-col items-center justify-center w-full  ">
            {
                showUploadModal && (
                    <FileUploadModal />
                )
            }

            <div className="divider" />

            <FilesAndFoldersList />
        </div>

    )
}




export default Media