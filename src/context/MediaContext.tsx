import { singleFileMetaType } from "@/types/type";
import { createContext } from "react";

export type MediaContextType = {
    folders: singleFileMetaType[],
    files: singleFileMetaType[],
    setFolders: React.Dispatch<React.SetStateAction<singleFileMetaType[]>>,
    setFiles: React.Dispatch<React.SetStateAction<singleFileMetaType[]>>,
    path: string,
    setPath: React.Dispatch<React.SetStateAction<string>>,
    loading: boolean,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,

    showUploadModal: boolean,
    setShowUploadModal: React.Dispatch<React.SetStateAction<boolean>>,

    counter: number,
    setCounter: React.Dispatch<React.SetStateAction<number>>,

    selectedFile: singleFileMetaType,
    setSelectedFile: React.Dispatch<React.SetStateAction<singleFileMetaType>>,

    showInfoDropdown: boolean,
    setShowInfoDropdown: React.Dispatch<React.SetStateAction<boolean>>,


    fileUploaderModalRef: React.MutableRefObject<File | null>,
    fileViewerModalRef: React.MutableRefObject<HTMLDialogElement | null>

}

export const defaultSingleMeta = {
    name: '',
    isFolder: false,
    size: 0,
    lastModified: '',
    downloadLink: '',
    filename: '',
    fileNameWithoutExtension: '',
    fileExtension: '',
    bindedPath: '',
}

export const MediaContextDefaultValue: MediaContextType = {
    folders: [],
    files: [],
    setFolders: () => { },
    setFiles: () => { },
    path: "",
    setPath: () => { },
    loading: false,
    setLoading: () => { },
    showUploadModal: false,
    setShowUploadModal: () => { },
    counter: 0,
    setCounter: () => { },

    selectedFile: defaultSingleMeta,
    setSelectedFile: () => { },

    showInfoDropdown: false,
    setShowInfoDropdown: () => { },

    fileUploaderModalRef: { current: null },
    fileViewerModalRef: { current: null }

}

export const MediaContext = createContext<MediaContextType>(MediaContextDefaultValue)

