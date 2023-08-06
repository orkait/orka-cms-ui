import { MediaContext } from "@/context/MediaContext";
import { fileAPI } from "@/service/api";
import customToast from "@/toast";
import { handleNetworkError } from "@/utils/util";
import { faFileUpload, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useContext, useState } from "react";

const FileUploader = () => {
    const fileRef = useRef<HTMLInputElement>(null);
    const { path, fileUploaderModalRef, setCounter, counter } = useContext(MediaContext)
    const [localFile, setLocalFile] = useState<File | null>(null);

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


            if (uploadResult?.data) {
                customToast({
                    message: "File uploaded successfully",
                    icon: "success",
                })
            }

            // close file uploader modal
            if (fileUploaderModalRef) {
                (fileUploaderModalRef.current as any).close();
            }

            setCounter(counter + 1);

            return uploadResult

        } catch (error: any) {
            if (handleNetworkError(error)) return;

            customToast({
                message: "Error uploading files",
                icon: "error",
            });
            console.log(error.response);

            return error;
        }



    };

    return (
        <div className="flex flex-col w-full ">
            <div className="flex flex-1 w-full rounded-bl-md ">
                <div className="flex shadow rounded-lg w-full gap-5 p-2 items-center justify-center ">
                    <div className="child:border-[1px] child:border-dotted">
                        <figure className="relative ">
                            <input
                                className="opacity-0 w-full h-full absolute top-0 left-0"
                                ref={fileRef}
                                type="file"
                                onChange={(e) => {
                                    e.preventDefault();

                                    if (fileRef.current?.files) {
                                        const file = fileRef.current?.files[0];

                                        if (file) {
                                            setLocalFile(file);
                                        }
                                    }
                                }}
                            />
                            {
                                localFile ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={
                                            window.URL.createObjectURL(localFile)
                                        }
                                        alt="Shoes"
                                        className="w-[300px] h-[200px] object-scale-down "
                                        style={{
                                            maxWidth: "300px",
                                        }}
                                    />
                                ) : (
                                    <div className="w-[300px] h-[200px] flex items-center justify-center border-2 rounded-md ">
                                        <div className="text-center text-lg font-bold border-2 border-dotted px-2">
                                            Select a file
                                        </div>
                                    </div>
                                )
                            }
                        </figure>

                        <div className="flex items-center justify-center child:flex-1 child:m-2  ">
                            <div className="btn btn-primary btn-sm child:m-2"
                                onClick={fileUploadHandler}
                            >
                                <FontAwesomeIcon icon={faFileUpload} />
                                <span className="ml-2">Upload</span>
                            </div>
                            <div className="btn btn-error btn-sm"
                                onClick={(e) => {
                                    e.preventDefault();

                                    if (fileRef.current) {
                                        fileRef.current.value = "";
                                        setLocalFile(null);
                                    }

                                }}
                            >
                                <FontAwesomeIcon icon={faTrash} />
                                <span className="ml-2">
                                    clear
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default FileUploader