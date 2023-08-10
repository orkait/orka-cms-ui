import { MediaContext } from "@/context/MediaContext";
import { api } from "@/service/api";
import customToast from "@/toast";
import { SingleProductType } from "@/types/type";
import { useEffectAsync } from "@/utils/util";
import { produce } from "immer";
import { useState, useContext, useEffect } from "react";

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
    const { path, setShowInfoDropdown, showInfoDropdown } = useContext(MediaContext);

    const defaultData = {
        productTitle: "",
        productLink: "",
        productDescription: "",
        productBrandName: "",
        productHighlights: "",
        productAttributes: "",
    }

    const [fileInfo, setFileInfo] = useState<SingleProductType>(data || defaultData);

    useEffectAsync(async () => {
        try {
            const response = await api.get(`/products/product/${btoa(path)}`);

            if (response.data) {
                setFileInfo(response.data.data);
            }
        } catch (error) {
            // clear the data
            setFileInfo(defaultData)
        }
    }, [path])


    const loadData = async () => {
        try {
            const response = await api.post("/products/product", {
                productTitle: fileInfo.productTitle,
                productLink: btoa(path),
                productDescription: fileInfo.productDescription,
                productBrandName: fileInfo.productBrandName,
                productHighlights: fileInfo.productHighlights,
                productAttributes: fileInfo.productAttributes,
            })
            return response.data;

        } catch (error) {
            console.log(error);
            return null;
        }
    }


    const fileInfoUpdateHandler = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        const result = await loadData();

        if (result) {
            customToast({
                message: "Product Info Updated Successfully",
                icon: "success"
            })
        } else {
            customToast({
                message: "Product Info Update Failed",
                icon: "error"
            })
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
                        setShowInfoDropdown(!showInfoDropdown);
                    }}
                >
                    Cancel
                </button>
            </div>
        </div>
    )
}


export default FileInfo