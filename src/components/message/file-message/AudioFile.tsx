import { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { IconButton } from "@mui/material";
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
interface Props {
  message: any;
  isCurrentUser: any;
}

const AudioFile: NextPage<Props> = ({ message, isCurrentUser }) => {
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Initialize WaveSurfer
    if (waveformRef.current) {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "white",
        progressColor: "#93c5fd", 
        height: 50,
        barWidth: 2,
        barGap: 2,
        // responsive: true,
      }) as any;

      // Load the audio file
    }
    if (wavesurfer.current){
      const wavesurferRef:any = wavesurfer.current
      wavesurferRef.load(message.file.file);
    }

    return () => {
      // Cleanup WaveSurfer instance on unmount
      if (wavesurfer.current) {
        const wavesurferRef:any = wavesurfer.current
        wavesurferRef.destroy();
      }
    };
  }, [message.file.file]);

  const togglePlayPause = () => {
    if (wavesurfer.current) {
      const wavesurferRef:any = wavesurfer.current
      wavesurferRef.playPause();
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className={`flex w-[250px] h-[60px] items-center relative group ${
      isCurrentUser
        ? "bg-indigo-500 text-white"
        : "bg-white text-gray-700 dark:text-slate-100 dark:bg-slate-700"
    } rounded-xl gap-1 overflow-visible shadow-sm max-w-full`}>
      {/* <div className=" flex w-full p-1 bg-white shadow-md rounded-lg"> */}
        <div className="flex items-center space-x-4  h-full">
          {/* Play/Pause button */}
          <IconButton onClick={togglePlayPause}>
            {
              isPlaying? (
                <PauseIcon className="text-[white]"/>
              ) : (
                <PlayArrowIcon className="text-[white]"/>
              )
            }
          </IconButton>
        </div>
        {/* Waveform container */}
        <div className="h-full w-full my-3 mr-3 flex items-center justify-center">
        <div ref={waveformRef} className="w-full h-[50px]"></div>
        </div>
      {/* </div> */}
    </div>
  );
};

export default AudioFile;
