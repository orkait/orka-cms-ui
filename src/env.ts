const env = {
    API: process.env.NEXT_PUBLIC_FILE_SERVICE_API || 'http://localhost:8080',
    FOLDER_NAME: process.env.NEXT_PUBLIC_FOLDER_NAME || "dynopictures"
}

export default env