import '@/styles/globals.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
    return (
        <div className='flex justify-center items-center w-full '>
            <div className='max-w-[80%] w-full'>
                <Component {...pageProps} />
            </div>
        </div>
    )
}
