import Layout from '@/components/Layout';
import { MediaContext, defaultSingleMeta } from '@/context/MediaContext'
import env from '@/env';
import '@/styles/globals.css'
import { IModalRef, singleFileMetaType } from '@/types/type';
import type { AppProps } from 'next/app'
import { useRef, useState } from 'react';


export default function App({ Component, pageProps }: AppProps) {
    const [files, setFiles] = useState<singleFileMetaType[]>([]);
    const [folders, setFolders] = useState<singleFileMetaType[]>([]);
    const [path, setPath] = useState<string>(env.FOLDER_NAME);
    const [loading, setLoading] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [counter, setCounter] = useState(0);
    const [selectedFile, setSelectedFile] = useState<singleFileMetaType>(defaultSingleMeta);
    const [showInfoDropdown, setShowInfoDropdown] = useState<boolean>(false);
    const fileUploaderModalRef = useRef<File | null>(null);
    const fileViewerModalRef = useRef<singleFileMetaType>(defaultSingleMeta);

    return (
        <MediaContext.Provider
            value={{
                folders,
                files,
                setFolders,
                setFiles,
                path,
                setPath,
                loading,
                setLoading,

                showUploadModal,
                setShowUploadModal,
                counter,
                setCounter,

                selectedFile,
                setSelectedFile,

                showInfoDropdown,
                setShowInfoDropdown,

                fileUploaderModalRef,
                fileViewerModalRef
                
            }}>
            <div className='flex justify-center items-center w-full '>
                <div className='max-w-[80%] w-full'>
                    <Layout >
                        <Component {...pageProps} />
                    </Layout>
                </div>
            </div>
        </MediaContext.Provider>
    )
}
