import { MediaContext } from "@/context/MediaContext";
import { api } from "@/service/api";
import customToast from "@/toast";
import { SingleProductType } from "@/types/type";
import { produce } from "immer";
import { useState, useContext } from "react";

const FileInfo = ({
    data = {
        productTitle: "",
        productLink: "",
        productDescription: "",
        productBrandName: "",
        productHighlights: "",
        productAttributes: "",
    }
}: {
    data: SingleProductType,
}) => {
    const [localFile, setLocalFile] = useState<File | null>(null);
    const { path, setShowUploadModal, counter, setCounter } = useContext(MediaContext);
    const [fileInfo, setFileInfo] = useState<SingleProductType>(data || {
        productTitle: "",
        productLink: "",
        productDescription: "",
        productBrandName: "",
        productHighlights: "",
        productAttributes: "",
    });



    const fileInfoUpdateHandler = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        if (!localFile) {
            return customToast({
                message: "Please select a file",
                icon: "error",
            });
        }

        // await fileUploadHandler();

        try {
            const response = await api.post("/products/product", {
                productTitle: fileInfo.productTitle,
                productLink: path + "/" + localFile?.name,
                productDescription: fileInfo.productDescription,
                productBrandName: fileInfo.productBrandName,
                productHighlights: fileInfo.productHighlights,
                productAttributes: fileInfo.productAttributes,
            })
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }

    }


    return (
        <div className="flex flex-col w-full shadow">
            <div className="flex ">
                <div className="flex flex-col flex-1 gap-2 justify-center items-center ">
                    <div className="form-control w-full max-w-md ">
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
                            className="textarea h-48 textarea-bordered w-full join-item"
                            value={fileInfo?.productDescription}
                            onChange={(e) => {
                                setFileInfo(produce(fileInfo, (draft) => {
                                    draft.productDescription = e.target.value;
                                }))
                            }}
                        />
                    </div>
                </div>
                <div className="flex flex-col flex-1 gap-2 justify-center items-center ">
                    <div className="form-control w-full max-w-md">
                        <label className="label">
                            <span className="label-text">Product BrandName</span>
                        </label>
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            value={fileInfo?.productBrandName}
                            onChange={(e) => {
                                setFileInfo(produce(fileInfo, (draft) => {
                                    draft.productBrandName = e.target.value;
                                }))
                            }}
                        />
                    </div>
                    <div className="form-control w-full max-w-md">
                        <label className="label">
                            <span className="label-text">Product Highlights</span>
                        </label>
                        <textarea
                            className="textarea h-48 textarea-bordered w-full join-item"
                            value={fileInfo?.productHighlights}
                            onChange={(e) => {
                                setFileInfo(produce(fileInfo, (draft) => {
                                    draft.productHighlights = e.target.value;
                                }))
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end join  m-2">
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


export default FileInfo