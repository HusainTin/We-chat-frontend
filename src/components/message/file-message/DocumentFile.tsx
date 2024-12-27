"use client";
import React, { useState } from "react";
import { NextPage } from "next";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import IconButton from "@mui/material/IconButton";
import { Modal, Tooltip } from "@mui/material";
import { getFileSize, truncateFileName } from "@/utils/helper";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import { DocumentTypes } from "@/utils/constants";
import { GetFileIcon } from "../GetFileIcon";
import CloseIcon from "@mui/icons-material/Close";
import { Document, Page } from 'react-pdf'; // For PDF preview
import * as XLSX from 'xlsx'; // For Excel files
import WordViewer from "react-doc-viewer"; // For Word documents
// import { PPTXViewer } from 'react-pptx'; // For PPT files
import pptxgen from 'pptxgenjs';

interface Props {
  message: any;
  isCurrentUser: any;
}

const DocumentFile: NextPage<Props> = ({ message, isCurrentUser }) => {
  const file = message.file;
  const [open, setOpen] = useState(false);
  const [fileContent, setFileContent] = useState<any>(null);
  const [fileType, setFileType] = useState<string>(file.mime_type);


  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => setOpen(false);
  const handlePreview = async () => {
    // if (DocumentTypes.PDF.includes(file)) {
    //   // PDF Preview
    //   setFileContent(<Document file={file}><Page pageNumber={1} /></Document>);
    // } 
    // else if (DocumentTypes.WORD.includes(fileType)) {
    //   // Word Document Preview
    //   setFileContent(<WordViewer documents={file} />);
    // } 
    if (DocumentTypes.EXCEL.includes(fileType)) {
      // Excel File Preview
      fetch(file.file)
        .then(response => response.arrayBuffer())  // Fetch the file as ArrayBuffer
        .then(data => {
          const workbook = XLSX.read(new Uint8Array(data), { type: 'array' });
          
          // Get the first sheet in the workbook (you can modify this if you want to show multiple sheets)
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
    
          // Convert sheet to a JSON-like structure
          const json:any = XLSX.utils.sheet_to_json(sheet, { header: 1 });  // Get all rows including headers
    
          // Create the table
          let tableHtml = '<table border="1" style="border-collapse: collapse; width: 100%;">';
    
          // Add table header row
          if (json.length > 0) {
            tableHtml += '<thead><tr>';
            json[0].forEach((cell:any) => {
              tableHtml += `<th style="padding: 8px; text-align: left;">${cell}</th>`;
            });
            tableHtml += '</tr></thead>';
          }
    
          // Add table body rows
          tableHtml += '<tbody>';
          for (let i = 1; i < json.length; i++) {
            tableHtml += '<tr>';
            json[i].forEach((cell:any) => {
              tableHtml += `<td style="padding: 8px;">${cell}</td>`;
            });
            tableHtml += '</tr>';
          }
          tableHtml += '</tbody>';
    
          // Close the table tag
          tableHtml += '</table>';
    
          // Display the table
          setFileContent(<div dangerouslySetInnerHTML={{ __html: tableHtml }} />);
        })
        .catch(error => {
          console.error("Error fetching or reading the file:", error);
        });
    }
    
    
    // else if (DocumentTypes.PPT.includes(fileType)) {

    //   console.log(fileType)
      // PPT Preview (for simplicity, we can use an image of the first slide)
      // const pptx = new PptxGenJS();
      // pptx.load(file).then(() => {
      //   const slide = pptx.getSlide(1); // Get the first slide
      //   const slideImage = slide.renderToImage();
      //   setFileContent(<img src={slideImage} alt="PPT Preview" />);
      // }).catch((error:any) => {
      //   setFileContent(<div>Error loading PPTX: {error.message}</div>);
      // });

    // } 
    // else if (DocumentTypes.TXT.includes(fileType)) {
    //   // Text File Preview
    //   const reader = new FileReader();
    //   reader.onload = () => {
    //     const text = reader.result as string;
    //     setFileContent(<pre>{text}</pre>);
    //   };
    //   reader.readAsText(file);
    // } 
    // else {
    //   setFileContent(<div>Unsupported file type</div>);
    // }
  };

  React.useEffect(() => {
    handlePreview();
  }, [file]);


  return (
    <>
      <div
        className={`flex w-[250px] h-[60px] items-center relative group ${
          isCurrentUser
            ? "bg-indigo-500 text-white"
            : "bg-white text-gray-700 dark:text-slate-100 dark:bg-slate-700"
        } rounded-xl gap-0.5 overflow-visible shadow-sm max-w-full`}
        onClick={handleOpen}
      >
        <div className={`m-2`}>
          <GetFileIcon file={file} width={28} height={30} />
        </div>

        <div className="flex flex-col ">
          <Tooltip title={file.file_name} placement="top">
            <p className="text-[14px]">{truncateFileName(file.file_name)}</p>
          </Tooltip>
          <p className="text-[12px] text-slate-200">
            {getFileSize(file.file_size)}
          </p>
        </div>

        {/* Icon button that appears on hover */}
        <div className="hidden group-hover:flex absolute right-0">
          <IconButton
            aria-label="download-file"
            onClick={() => {}}
            href={file.file}
          >
            <CloudDownloadIcon className=" text-[25px] text-white rounded-full backdrop-blur-lg p-[1px]" />
          </IconButton>
        </div>
      </div>
      
      <Modal open={open} onClose={handleClose}>
        <div className="h-full w-full flex items-center justify-center flex-col">
          <div className="p-2 flex w-[70vw] justify-end gap-4">
            <IconButton>
              <CloudDownloadIcon className="text-[2rem] text-white" />
            </IconButton>
            <IconButton aria-label="" onClick={handleClose}>
              <CloseIcon className="text-[2rem] text-white" />
            </IconButton>
          </div>
          {fileContent}
        </div>
      </Modal>
    </>
  );
};

export default DocumentFile;
