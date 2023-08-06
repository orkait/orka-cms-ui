import { MediaContext } from "@/context/MediaContext";
import { fileAPI } from "@/service/api";
import customToast from "@/toast";
import { ListResponseType } from "@/types/type";
import { useEffectAsync } from "@/utils/util";
import { env } from "process";
import { Ref, useContext, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import FolderCard from "./FolderCard";
import FileInfo from "./FileInfo";
import FileUploader from "./FileUploader";
import FileViewer from "./FileViewer";


const ListObjects = () => {
    const {
        path, setPath, files, setFiles,
        folders, setFolders, loading, setLoading, counter,
        setSelectedFile,

        fileUploaderModalRef,
        fileViewerModalRef,
        showInfoDropdown
    } = useContext(MediaContext)


    useEffectAsync(async () => {
        setLoading(true);
        try {
            const response = await fileAPI.get<ListResponseType>(`list?path=${path}`)
            const _data = response.data.data.data;

            const _folders = _data?.filter((item) => item.isFolder)
                .map((item) => {
                    const temp = item.name.split('/');
                    // pick 2nd last item
                    item.filename = temp[temp.length - 2];
                    item.downloadLink = "";
                    return item;
                });


            const _files = _data?.filter((item) => !item.isFolder)
                .map((item) => {
                    item.filename = item.name.split("/").pop() || "";
                    item.fileNameWithoutExtension = item.filename.split('.').slice(0, -1).join('.');
                    item.fileExtension = item.filename.split('.').pop() || "";
                    return item;
                });

            const _fileNames = _files?.map((item) => item.fileNameWithoutExtension);
            const _folderNames = _folders?.map((item) => item.filename);


            _fileNames?.forEach((item, index) => {
                if (_folderNames.includes(item)) {
                    const temp = _folderNames.indexOf(item)
                    _folders[temp].downloadLink = _files[index]?.downloadLink;
                    _folders[temp].bindedPath = _files[index]?.name;
                }
            })

            _fileNames?.forEach((item, index) => {
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
    }, [path, counter]);

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

            {
                path !== env.FOLDER_NAME && (
                    showInfoDropdown && (
                        <FileInfo
                            data={{
                                productTitle: "",
                                productLink: "",
                                productDescription: "",
                                productBrandName: "",
                                productHighlights: "",
                                productAttributes: "",
                            }}
                        />
                    )
                )
            }

            <div className="flex justify-start child:m-2 flex-wrap ">
                {
                    loading && (
                        <div className="loading loading-spinner loading-md"></div>
                    )
                }
                {
                    !loading && folders?.map((folder, index) => {
                        return (
                            <FolderCard
                                folder={folder}
                                key={index}
                            />
                        )
                    })
                }
                {
                    (!folders || (folders && folders.length === 0)) && (
                        <div className="ml-2 text-md font-bold ">
                            No folders found
                        </div>
                    )
                }
            </div>

            {
                path !== env.FOLDER_NAME && (
                    <>
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
                                !loading && files?.map((file, index) => (
                                    <>
                                        <div
                                            onClick={() => {
                                                setSelectedFile(file);
                                                if (fileViewerModalRef && fileViewerModalRef.current) {
                                                    (fileViewerModalRef.current as any).file = file;
                                                    (fileViewerModalRef.current as any).showModal();
                                                }
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
                                    </>
                                ))
                            }
                        </div>

                        {
                            (!files || (files && files.length === 0)) && (
                                <div className="ml-2 text-md font-bold ">
                                    No files found
                                </div>
                            )
                        }

                        <div className="divider" />
                    </>
                )
            }

            <dialog
                className="modal "
                ref={fileViewerModalRef}

            >
                <form method="dialog" className="flex flex-col modal-box items-center justify-center ">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    <FileViewer
                    />
                    <div className="divider" />

                    <div
                        className="btn btn-error"
                        onClick={() => {

                            // close file viewer modal
                            if (fileViewerModalRef && fileViewerModalRef.current) {
                                (fileViewerModalRef.current as any).close();
                            }

                            Swal.fire({
                                title: "Are you sure?",
                                text: "You won't be able to revert this!",
                                icon: "warning",
                                showCancelButton: true,

                                confirmButtonText: "Yes, delete it!",
                                cancelButtonText: "No, cancel!",
                                reverseButtons: true,
                            }).then((result) => {
                                if (result.isConfirmed) {

                                    if (fileViewerModalRef && fileViewerModalRef.current) {
                                        const file = (fileViewerModalRef.current as any).file;

                                        fileAPI.delete(`/delete?path=${file.name}`)
                                            .then((response) => {
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
                                            }).catch((error) => {
                                                console.log(error);
                                                customToast({
                                                    message: "Error deleting file",
                                                    icon: "error",
                                                });
                                            })
                                    }

                                } else if (result.dismiss === Swal.DismissReason.cancel) {
                                    customToast({
                                        message: "File deletion cancelled",
                                        icon: "error",
                                    })
                                }
                            })
                        }}
                    >
                        Delete
                    </div>

                </form>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog >



            <dialog
                className="modal  "
                ref={fileUploaderModalRef as any}
            >
                <form method="dialog" className="flex flex-col modal-box dark:border-2 dark:border-white items-center justify-center ">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    <FileUploader />
                </form>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog >



        </>
    )
}


export default ListObjects