
import { faArrowLeft, faCode, faFile, faFileArchive, faFileImage, faFilePdf, faFileUpload, faFileWord, faFolder, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import customToast from "@/toast";
import { handleNetworkError, useEffectAsync } from "../utils/util";
import api from "@/service/api";
import { ListResponseType, singleFileMetaType } from "@/types/type";
import Swal from "sweetalert2";
import env from "@/env";


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


const Media = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [sizeInBytes, setSizeInBytes] = useState(0);
    const [fileUrl, setFileUrl] = useState("");
    const [localFile, setLocalFile] = useState(null);
    const [path, setPath] = useState<string>(env.FOLDER_NAME);
    const modelRef = useRef(null);


    const ListFiles = () => {
        const [files, setFiles] = useState<singleFileMetaType[]>([]);
        const [folders, setFolders] = useState<singleFileMetaType[]>([]);
        const [isLoading, setIsLoading] = useState<boolean>(false);
        const [activeFilePath, setActiveFilePath] = useState<string>("");

        useEffectAsync(async () => {
            setIsLoading(true);
            try {
                const response = await api.get<ListResponseType>(`list?path=${path}`)
                const _data = response.data.data.data;

                const _files = _data.filter((item) => !item.isFolder)
                    .map((item) => {
                        item.filename = item.name.split("/").pop() || "";
                        return item;
                    });
                const _folders = _data.filter((item) => item.isFolder)
                    .map((item) => {
                        const temp = item.name.split('/');
                        // pick 2nd last item
                        item.filename = temp[temp.length - 2];
                        return item;
                    });

                setFiles(_files);
                setFolders(_folders);

            } catch (error) {
                console.log("error -->", error);
            }
            setIsLoading(false);
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
                        isLoading && (
                            <div className="loading loading-spinner loading-md"></div>
                        )
                    }
                    {
                        !isLoading && folders.map((folder, index) => (
                            <div
                                key={index}
                                className="btn btn-outline btn-primary"
                                onClick={() => {
                                    setPath(folder.name);
                                }}
                            >
                                {folder.filename}
                            </div>
                        ))
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
                        isLoading && (
                            <div className="loading loading-spinner loading-md"></div>
                        )
                    }
                    {
                        !isLoading && files.map((file, index) => (
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
                                                        await api.delete(`/delete?path=${file.name}`);

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
                                    onClick={() => {
                                        setActiveFilePath(file.name);
                                    }}
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
            setIsUploading(true);
            const formData = new FormData();

            if (!localFile) {
                return customToast({
                    message: "Please select a file",
                    icon: "error",
                });
            }
            formData.append("file", localFile);

            const uploadResult = await api.post(
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
                setFileUrl(bucket);

                // clear file array
                setLocalFile(null);
                setSizeInBytes(0);
            }
            setIsUploading(false);
        } catch (error: any) {
            if (handleNetworkError(error)) return;

            customToast({
                message: "Error uploading files",
                icon: "error",
            });
            console.log(error.response?.data);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-full">

            {/* ---------- FILE UPLOAD ------------ */}
            <dialog
                ref={modelRef}
                className="modal modal-bottom sm:modal-middle">
                <form method="dialog" className="modal-box">
                    <div className="flex justify-center ">
                        <div className="card card-compact bg-base-100 shadow-xl m-2 rounded-lg  ">
                            <figure className="relative max-w-[300px] max-h-[200px] border-2  border-b-0  ">
                                <input
                                    className="opacity-0 w-full h-full absolute top-0 left-0"
                                    type="file"
                                    onChange={fileChangeHandler}
                                />
                                <img
                                    src={localFile ? URL.createObjectURL(localFile) : "https://placehold.co/300x200"}
                                    alt="Shoes"
                                    className="object-scale-down h-48 "
                                />
                            </figure>
                            <div className="card-body border-2 rounded-b-md ">
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
                                            setSizeInBytes(0);
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                        <span className="ml-2">Delete</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-action"
                        onClick={() => {
                            document.body.style.opacity = "1";

                        }}
                    >
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn">Close</button>
                    </div>
                </form>
            </dialog>


            <div className="divider" />

            {/* ---------- FILE LIST ------------ */}
            <div className="flex flex-col  w-full ">
                <div className="flex justify-between child:m-2">
                    <div className="btn btn-secondary btn-sm " onClick={() => {

                        if (path === env.FOLDER_NAME ) return;

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
                        <div className="btn btn-secondary btn-sm "
                            onClick={() => {
                                if (modelRef && modelRef.current) {
                                    // @ts-ignore
                                    modelRef.current.showModal();

                                    // reduce opacity of background
                                    // document.body.style.opacity = "0.1";
                                }
                            }}
                        >
                            upload new file
                            <FontAwesomeIcon icon={faFile} />
                        </div>
                        <div className="btn btn-primary btn-sm ">
                            create folder
                            <FontAwesomeIcon icon={faFolder} />
                        </div>
                    </div>

                </div>

                <ListFiles />
            </div>
        </div>
    )
}




export default Media