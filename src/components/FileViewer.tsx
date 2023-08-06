import { MediaContext } from '@/context/MediaContext';
import React, { useContext } from 'react'

const FileViewer = () => {
    const {
        fileViewerModalRef
    } = useContext(MediaContext);

    return (
        <figure className="relative ">
            <img
                src={fileViewerModalRef ? ((fileViewerModalRef?.current as any)?.file as any)?.downloadLink : "https://placehold.co/300x200"}
                alt="Shoes"
                className="w-[300px] h-[200px] object-scale-down "
                style={{
                    maxWidth: "300px",
                }}
            />
        </figure>
    )
}

export default FileViewer