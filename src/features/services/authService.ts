"use client"
import apiInstance from "./apiService";

interface ILogin{
    email:string;
    password:string;
}
export const login = async({email, password}:ILogin) => {
    const response = await apiInstance.post('/api/login', {
        email: email,
        password: password
    });
    return response;
}

export const register = async(data : any) => {
    const response = await apiInstance.post('/api/register', data);
    return response;
}

export const refreshToken = async() => {
    const data = {
        refresh_token: localStorage.getItem("refresh_token")
    }
    const response = await apiInstance.post('/api/refresh-token', data);
    return response;
}

export const verifyToken = async() => {
    const access_token =  localStorage.getItem("access_token")
    const response = await apiInstance.get('/api/verify/'+access_token);
    return response;
}

export const loginWithOauth = async({provider, data}:any) => {
    const response = await apiInstance.post(`/api/${provider}/auth/`, data = data);
    return response;
}
export const getOauthRedirectUri = async(provider:any) => {
    const response = await apiInstance.get(`/api/get-oauth-redirect-url/${provider}`);
    return response;
}
export const sendResetPasswordEmail = async(data:any) => {
    const response = await apiInstance.post(`/api/send/reset-password-email/`, data = data);
    return response;
}
export const checkPasswordToken = async(token:any) => {
    const response = await apiInstance.get(`/api/check/password-token/?token=${token}`);
    return response;
}
export const resetPassword = async(token:string, data:any) => {
    const response = await apiInstance.put(`/api/reset-password/?token=${token}`,data=data );
    return response;
}

export const verifyMFAToken = async(token:string) => {
    const response = await apiInstance.get(`/api/mfa/verify-token/?token=${token}`);
    return response;
}

export const MFALogin = async(data:any) => {
    const response = await apiInstance.post(`/api/mfa/login/`, data = data);
    return response;
}

export const MFAToggle = async(data:any) => {
    const response = await apiInstance.put(`/api/mfa/toggle/`, data = data);
    return response;
}