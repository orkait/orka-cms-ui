import Layout from '@/components/Layout';
import { MediaContext, MediaContextDefaultValue } from '@/context/MediaContext'
import env from '@/env';
import '@/styles/globals.css'
import { singleFileMetaType } from '@/types/type';
import type { AppProps } from 'next/app'
import { useState } from 'react';

export default function App({ Component, pageProps }: AppProps) {

    const [files, setFiles] = useState<singleFileMetaType[]>([]);
    const [folders, setFolders] = useState<singleFileMetaType[]>([]);
    const [path, setPath] = useState<string>(env.FOLDER_NAME);
    const [loading, setLoading] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);


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
