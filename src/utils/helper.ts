import { avatarColors } from "./constants";

export const getColorForUsername = (username: string) => {
    if (username){
        const index = username.charCodeAt(0) % avatarColors.length;   
        return avatarColors[index];
    }else{
        return ""
    }
  };
  
  // Function to capitalize the first letter
 export const capitalizeFirstLetter = (string: string) => {
    if (string){
        return string.charAt(0).toUpperCase() + string.slice(1);
    }else{
        return ""
    }
  };

  export const  getFileSize = (bytes: number) => {
    const KB = 1024;
    const MB = 1024 * 1024;

    const sizeInKB = bytes / KB;
    if (sizeInKB > 1024) {
      const sizeInMB = sizeInKB / 1024;
      return `${sizeInMB.toFixed(1)} MB`;
    }
    return `${sizeInKB.toFixed(0)} KB`;
  };

  export const truncateFileName = (file_name: string) => {
    const maxLength = 25;
    if (file_name.length <= maxLength) {
      return file_name;
    }
    return file_name.slice(0, maxLength) + "...";
  };
