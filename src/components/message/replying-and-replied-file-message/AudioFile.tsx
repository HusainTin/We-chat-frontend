import { NextPage } from "next";
import { useEffect, useRef } from "react";
import WaveSurfer  from "wavesurfer.js";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

interface Props {
  message: any; // Type the file prop
  type:string;
}

const AudioFileReplyingOn: NextPage<Props> = ({ message , type}) => {
  const user = JSON.parse(localStorage.getItem("user_details") || "{}");
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const file = message.file
  useEffect(() => {
    if (waveformRef.current && file.file) {
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
      }
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "white",
        progressColor: "#93c5fd",
        height: 30,
        barWidth: 2,
        barGap: 2,
        interact: false,
      });
  
      wavesurfer.current.load(file.file);
    }
  
    return () => {
      wavesurfer.current?.destroy();
    };
  }, [file.file]);
  

  return (
    <div className={`flex w-[15vw] h-[40px] gap-1 items-center justify-center  rounded-lg
    ${
        type == "replied_to"?
        (message?.sender?.id == user?.id
        ? "bg-indigo-400"
        : "bg-slate-300 dark:bg-slate-500")
        :"bg-slate-600"
        }`}>
      <div className="flex items-center justify-center">
        <PlayArrowIcon className="text-[white]" />
      </div>
      <div className="h-full w-full my-3 mr-3 flex items-center justify-center">
        <div ref={waveformRef} className="w-full h-[40px] p-1.5"></div>
      </div>
    </div>
  );
};

export default AudioFileReplyingOn;
