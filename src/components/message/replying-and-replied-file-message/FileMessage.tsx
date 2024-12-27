import { NextPage } from 'next'
import AudioFile from './AudioFile';
import { fileTypes } from '@/utils/constants';
import VideoFile from './VideoFile';
import ImageFile from './ImageFIle';
import DocumentFile from './DocumentFile';
import OtherFile from './OtherFile';

interface Props {
    message: any;
    type: string;
}

const FileMessage: NextPage<Props> = ({message, type}) => {
    const file = message.file
    if (file.file_type == fileTypes.AUDIO){
        return <AudioFile message = {message} type={type}  />
    }
    else if (file.file_type == fileTypes.VIDEO){
        return <VideoFile file= {file}/>
    }
    else if (file.file_type == fileTypes.IMAGE){
        return <ImageFile file= {file}/>
    }
    else if (file.file_type == fileTypes.DOCUMENT){
        return <DocumentFile message={message} type = {type}/>
    }
    else if (file.file_type == fileTypes.OTHER){
        return <OtherFile  message = {message} type={type}/>
    }

    else {
        return (
            <></>
        )
    }
}

export default FileMessage