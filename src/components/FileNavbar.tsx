import { MediaContext } from "@/context/MediaContext";
import { fileAPI } from "@/service/api";
import customToast from "@/toast";
import { faArrowLeft, faFile, faFolder } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import env from "@/env";
import { useContext } from "react";
import Swal from "sweetalert2";

const FileNavbar = () => {

    const { path, setPath, showUploadModal, 
        showInfoDropdown,
        setShowInfoDropdown,
        fileUploaderModalRef,
        folders, setFolders, setCounter, counter } = useContext(MediaContext);

    return (
        <div className="flex justify-between child:m-2">
            <button
                className="btn btn-secondary btn-sm "
                disabled={path === env.FOLDER_NAME}

                onClick={() => {

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
            </button>

            <div className="child:m-2">
                {
                    path !== env.FOLDER_NAME && !showUploadModal && (
                        <div className="btn btn-secondary btn-sm "
                            onClick={() => {
                                if (fileUploaderModalRef && fileUploaderModalRef.current) {
                                    (fileUploaderModalRef.current as any)?.showModal();
                                }
                            }}
                        >
                            upload new file
                            <FontAwesomeIcon icon={faFile} />
                        </div>
                    )
                }

                <div className="btn btn-secondary btn-sm "
                    onClick={() => {
                        setShowInfoDropdown(!showInfoDropdown)
                    }}
                >
                    update product info
                    <FontAwesomeIcon icon={faFile} />
                </div>


                <div className="btn btn-primary btn-sm "
                    onClick={() => {
                        Swal.fire({
                            title: "Create Folder",
                            input: "text",
                            showCancelButton: true,
                            confirmButtonText: "Create",
                            showLoaderOnConfirm: true,
                            preConfirm: async (folderName) => {

                                const result = await fileAPI.post(`/create-folder?path=${path}/${folderName}`)
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

                                setFolders([
                                    ...(folders || []),
                                    {
                                        name: `${path}/${folderName}/`,
                                        isFolder: true,
                                        size: 0,
                                        lastModified: new Date().toISOString(),
                                        downloadLink: ""
                                    }
                                ]);

                                setCounter(counter + 1);
                                return result;

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
                                    icon: "warning",
                                });
                            }
                            else {
                                customToast({
                                    message: "Folder creation cancelled",
                                    icon: "warning",
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
    )
}


export default FileNavbar