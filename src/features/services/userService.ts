import apiInstance from "./apiService";

export const getAllUsers =  async ({limit , offset, search}:any): Promise<object> =>{
    const response = await apiInstance.get(`/api/users/?limit=${limit}&offset=${offset}&search=${search}`);
    return response;
}

export const updateUserProfile = async (data:any) =>{
    const response = await apiInstance.put(`/api/user-profile/`,data=data);
    return response
}

export const getUserProfile = async () =>{
    const response = await apiInstance.get(`/api/user-profile/`);
    return response
}

export const changePassword = async (data:any) =>{
    const response = await apiInstance.put(`/api/change-password/`,data=data);
    return response
}

export const userLogout = async () =>{
    const accessToken = localStorage.getItem('access_token');
    const response = await apiInstance.delete(`/api/logout/${accessToken}`);
    return response
}

export const updateProfilePic = async (data:any) =>{
    const response = await apiInstance.put(`/api/profile-picture/`,data=data);
    return response
}

export const saveUserDetails = async (data:any) =>{
    const response = await apiInstance.put(`/api/user-details/`,data=data);
    return response
}

