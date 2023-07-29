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

export type FileListType = FileType[];




