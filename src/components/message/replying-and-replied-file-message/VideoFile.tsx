import { CircularProgress } from "@mui/material";
import { NextPage } from "next";
import { useEffect, useRef, useState } from "react";

interface Props {
  file: any;
}

const VideoFile: NextPage<Props> = ({ file }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const captureThumbnail = async() => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video && canvas) {
        console.log('creating ctx')
        const ctx =await canvas.getContext("2d");
        console.log(ctx)
        if (ctx) {
          canvas.width = 120;
          canvas.height = 100;
          console.log("drawing image")
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          console.log("drawn image")
          setLoading(false); // Hide loading indicator
        }
      }
    };

    const video = videoRef.current;
    if (video) {
      video.preload = "metadata";  // Only load metadata initially
      video.addEventListener("loadedmetadata", () => {
        video.currentTime = 1;  // Move to 1 second in for thumbnail
      });
      console.log('seeking')
      video.addEventListener("seeked", captureThumbnail); // Capture once the seeked time is reached
    }

    return () => {
      if (video) {
        console.log('seeking in return ')
        video.removeEventListener("seeked", captureThumbnail);
      }
    };
  }, []);

  return (
    <div className="relative w-[120px] h-[100px] bg-black rounded-lg overflow-hidden cursor-pointer">
      {loading && (
        <div className="flex items-center justify-center w-full h-full text-white">
          <CircularProgress />
        </div>
      )}
      <div className={`${loading ? "hidden" : "flex"}`}>
        <canvas ref={canvasRef} className="h-[20]" />
        <video ref={videoRef} src={file.file} className="hidden" controls />
        <button className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-small rounded-full w-7 h-7">
          &#9658;
        </button>
      </div>
    </div>
  );
};

export default VideoFile;
