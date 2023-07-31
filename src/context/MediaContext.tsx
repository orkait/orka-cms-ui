import env from "@/env";
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
}

export const MediaContext = createContext<MediaContextType>(MediaContextDefaultValue)

