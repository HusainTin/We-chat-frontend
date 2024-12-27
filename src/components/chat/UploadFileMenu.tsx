import React from "react";
import { Menu, MenuItem } from "@mui/material";
import { NextPage } from "next";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useParams } from "next/navigation";
import { sendFileMessage } from "@/features/services/chatService";
import toast from "react-hot-toast";
interface Props {
  showUplaodFileMenu: boolean;
  setShowUplaodFileMenu: (value: boolean) => void;
  theme: any;
}

const UploadFileMenu: NextPage<Props> = ({
  showUplaodFileMenu,
  setShowUplaodFileMenu,
  theme,
}) => {
  const { id } = useParams() as { id: string };

  const fileHandler =async (e:any)=>{
    try {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("chat_id", id)
      const res =await sendFileMessage(formData)
    } catch (error:any) {
      toast.error(error?.response.data.errors[0])
    }
  }
  return (
    <>
      <div>
        <Menu
          id="upload-file-menu"
          MenuListProps={{ "aria-labelledby": "upload-file" }}
          open={showUplaodFileMenu}
          onClose={() => setShowUplaodFileMenu(false)}
          className="rounded-2xl"
          sx={{
            "& .MuiPaper-root": {
              backgroundColor: theme == "dark" ? "#333" : "white",
              color: theme == "dark" ? "#fff" : "black",
              borderRadius: "1rem",
              width: 280,
              position: "absolute",
              top: "77vh !important",
              left: {
                xs: "15vw !important", 
                sm: "25vw !important", 
                md: "70vw !important", 
                lg: "80vw !important", 
              },
            },
            "& .MuiMenuItem-root": {
              "&:hover": {
                backgroundColor: theme == "dark" ? "#444" : "default",
              },
            },
          }}
        >
          <MenuItem key="unsend" className="text-[12px]">
            <div className="flex w-full items-center">
              <CloudUploadIcon className="text-[20px] mx-2" />
              Select from your uploaded files
            </div>
          </MenuItem>
          <MenuItem key="unsend" className="text-[12px]">
            <div className="flex w-full items-center">
              <input
                accept="*"
                id="select-file"
                type="file"
                style={{ display: "none" }}
                onChange={fileHandler}
              />
              <label htmlFor="select-file">
                <UploadFileIcon className="text-[20px] mx-2" />
                Upload from your device
              </label>
            </div>
          </MenuItem>
        </Menu>
      </div>
    </>
  );
};

export default UploadFileMenu;
