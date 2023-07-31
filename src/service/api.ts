import axios from "axios";
import env from "@/env";

export const fileAPI = axios.create({
    baseURL: env.FILE_SERVICE_API
});

export const api = axios.create({
    baseURL: env.API
})
