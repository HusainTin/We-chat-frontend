"use client"
import React, { useState } from 'react';
import { NextPage } from 'next'
import { fileTypes } from '@/utils/constants';
import AudioFile from './AudioFile';
import ImageFile from './ImageFile';
import VideoFile from './VideoFile';
import DocumentFile from './DocumentFile';
import OtherFile from './OtherFile';

interface Props {
    message: any;
    isCurrentUser: boolean;
}

const FileMessage: NextPage<Props> = ({message, isCurrentUser}) => {
    const file = message.file
    if (file.file_type == fileTypes.AUDIO){
        return <AudioFile message={message} isCurrentUser={isCurrentUser}/>
    }else if (file.file_type == fileTypes.IMAGE){
        return <ImageFile message={message}/>
    }else if (file.file_type == fileTypes.VIDEO){
        return <VideoFile message= {message}/>
    }else if (file.file_type == fileTypes.DOCUMENT){
        return <DocumentFile message={message} isCurrentUser ={isCurrentUser} />
    }else {
        return (
            <OtherFile message={message} isCurrentUser ={isCurrentUser} />
        )
    }
}

export default FileMessage