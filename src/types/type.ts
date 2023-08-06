export type SuccessResponseType<T> = {
    status: string,
    response_code: number,
    data: T
}

export type FailureResponseType<T> = {
    status: string,
    responseCode: number,
    errorMessage: string
}

export type singleFileMetaType = {
    name: string,
    isFolder: boolean,
    size: number,
    lastModified: string,
    downloadLink: string,
    filename?: string,
    fileNameWithoutExtension?: string,
    fileExtension?: string,
    bindedPath?: string,
}


export type ListResponseType = SuccessResponseType<{
    data: singleFileMetaType[],
    nextPageToken: string,
    isLastPage: boolean,
    noOfRecordsReturned: number,
    filesCount: number,
    foldersCount: number,
}>

export type FileType = {
    Files: {
        Name: string,
        isFolder: boolean,
        Size: number,
        LastModified: string,
        DownloadLink: string,
    }[],
    NextPageToken: string,
    IsLastPage: boolean,
    NoOfRecordsReturned: number,
    FilesCount: number,
    FoldersCount: number,
}

export type SingleProductType = {
    productTitle: string,
    productLink: string,
    productDescription: string,
    productBrandName: string,
    productHighlights: string,
    productAttributes: string
}


export type FileListType = FileType[];




export interface IModalRef extends HTMLDivElement {
    current: {
        showModal: () => void,
        close: () => void
    }
}
