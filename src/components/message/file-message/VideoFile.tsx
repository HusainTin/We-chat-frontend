import { NextPage } from 'next';
import { useEffect, useRef, useState } from 'react';

interface Props {
  message: { file: { file: string } };
}

const VideoFile: NextPage<Props> = ({ message }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const captureThumbnail = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video && canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        }
      }
    };

    const video = videoRef.current;
    if (video) {
      video.preload = "metadata";
      video.addEventListener("loadedmetadata", () => {
        video.currentTime = 1;
      });
      video.addEventListener("seeked", captureThumbnail);
    }

    return () => {
      if (video) {
        video.removeEventListener("seeked", captureThumbnail);
      }
    };
  }, []);

  const playVideo = () => {
    setIsPlaying(true);
    const video = videoRef.current;
    if (video) {
      video.play();
    }
  };

  return (
    <div className="relative w-full h-64 bg-black rounded-lg overflow-hidden cursor-pointer">
      {/* Canvas to display the thumbnail */}
      {!isPlaying && <canvas ref={canvasRef} className="w-full h-full object-cover" />}

      {/* Video element with dynamic source */}
      <video
        ref={videoRef}
        src={message.file.file}
        className={`${isPlaying ? "block" : "hidden"} w-full h-full object-cover`}
        controls
      />

      {/* Play button */}
      {!isPlaying && (
        <button
          onClick={playVideo}
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-4xl rounded-full w-16 h-16"
        >
          &#9658;
        </button>
      )}
    </div>
  );
};

export default VideoFile;
