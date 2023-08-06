import { faCode, faFile, faFileArchive, faFileImage, faFilePdf, faFileWord } from "@fortawesome/free-solid-svg-icons"
import FileNavbar from "@/components/FileNavbar";
import ListObjects from "@/components/ListObjects";

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


const IndexPage = () => {
    return (
        <div className="flex flex-col items-center justify-center w-full  ">
            <div className="flex flex-col w-full ">
                <FileNavbar />
                <ListObjects />
            </div >
        </div>
    )
}

export default IndexPage