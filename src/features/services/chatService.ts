"use client"
import apiInstance from "./apiService";

export const getAllChat = async({search}:any) => {
    const response = await apiInstance.get('/api/get-chat/?search='+search)
    return response;
}
export const getChatById =  async (id: string): Promise<object> =>{
    const response = await apiInstance.get(`/api/get-chat/${id}`)
    return response;
}
export const getAllMessages =  async ({id, limit , offset}:any): Promise<object> =>{
    const response = await apiInstance.get(`/api/get-messages/${id}?limit=${limit}&offset=${offset}`)
    return response;
}

export const createNewChat =  async ({id}:any)=>{
    const response = await apiInstance.post('/api/create-chat',{
        id: id
    });
    return response;
}
export const createGroupChat =  async (data:any)=>{
    const response = await apiInstance.post('/api/group-chat',data);
    return response;
}

export const deleteMessageForUser =  async (id:string)=>{
    const response = await apiInstance.delete('/api/delete-message/'+id);
    return response;
}

export const reactOnMessage =  async (data:any)=>{
    const response = await apiInstance.post('/api/react-on-message/', data=data);
    return response;
}

export const getAllReactions =  async (id:any)=>{
    const response = await apiInstance.get('/api/reactions/'+id);
    return response;
}

export const sendFileMessage = async (data:any)=>{
    const response = await apiInstance.post('/api/file-messages/', data);
    return response;    
}

