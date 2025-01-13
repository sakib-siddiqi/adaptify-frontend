import axios, { InternalAxiosRequestConfig } from "axios";
import supabase from "./supabase";

const http = axios.create({
    baseURL : 'https://adaptify-back-end.vercel.app/api/'
});

http.interceptors.request.use(async(config : InternalAxiosRequestConfig)=>{
    const user = await supabase.auth.getSession();
    config.headers.Authorization = `Bearer ${user.data.session?.access_token}`;
    return config;
})

export default http;