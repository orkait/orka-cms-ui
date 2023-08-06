import { MediaContext } from "@/context/MediaContext";
import { fileAPI } from "@/service/api";
import { singleFileMetaType } from "@/types/type";
import { faGears, faEraser, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { produce } from "immer";
import { useState, useContext } from "react";
import Swal from "sweetalert2";
import FileUploadCard from "./FileUploadCard";


const FolderCard = ({ folder }: { folder: singleFileMetaType }) => {

    const [showSettings, setShowSettings] = useState(false);
    const [localFile, setLocalFile] = useState(null);
    const { folders, path, setPath, setFolders } = useContext(MediaContext)

    return (
        <div
            onClick={() => {
                console.log(folder.name);
            }}

            className="flex flex-col text-center relative cursor-pointer hover:opacity-80 ">
            {
                showSettings ? (
                    <>
                        <div className="w-[300px] h-[200px] ">
                            <FileUploadCard
                                onFileChange={async (e) => {
                                    e.preventDefault();

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
                        folder.name && (
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
                                                await fileAPI.delete(`/delete-folder?path=${folder.name}`);

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
export default FolderCard