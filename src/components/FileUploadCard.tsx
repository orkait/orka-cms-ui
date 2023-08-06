import React, { SyntheticEvent, useEffect } from 'react'

const FileUploadCard = ({
    onFileChange,
    localFile,
}: {
    onFileChange: (e: any) => void;
    localFile: File | null;
}) => {
    const fileRef = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (localFile) {
            console.log(localFile)
        }
    }, [localFile])

    return (
        <figure className="relative ">
            <input
                className="opacity-0 w-full h-full absolute top-0 left-0"
                ref={fileRef}
                type="file"
                onChange={(e: SyntheticEvent) => {
                    e.preventDefault();

                    if (onFileChange) {
                        onFileChange(e);
                    }
                }}
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
                    <div className="w-[300px] h-[200px] flex items-center justify-center border-2 rounded-md ">
                        <div className="text-center text-lg font-bold border-2 border-dotted px-2">
                            Select a file
                        </div>
                    </div>
                )
            }
        </figure>
    )
}


export default FileUploadCard