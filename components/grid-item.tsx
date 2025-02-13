"use client"

import { useState } from "react"
import type { Asset } from "../src/utils/get-assets"

interface GridItemProps {
  type: Asset['type']
  path: string
  content?: Asset['content']
  openModal: () => void
  isMobile: boolean
  thumbnailPath: string
}

export default function GridItem({ type, path, content, openModal, isMobile, thumbnailPath }: GridItemProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  const onClick = () => {
    if (!isMobile) {
      openModal();
    } else if (type === "video") {
      const videoElement = document.createElement('video');
      videoElement.controls = true;
      // videoElement.style.display = 'block'; // Make the video element visible immediately
      // videoElement.style.position = 'fixed'; // Position it fixed to the viewport
      // videoElement.style.top = '50%';
      // videoElement.style.left = '50%';
      // videoElement.style.transform = 'translate(-50%, -50%)';
      // videoElement.style.zIndex = '1000'; // Ensure it's on top of other elements
      // document.body.appendChild(videoElement);

      // Set the source after appending to start loading
      videoElement.src = path; // Assuming 'path' is the video URL
      videoElement.play();

      videoElement.addEventListener('ended', () => {
        document.body.removeChild(videoElement);
      });
    }
  };

  return (
    <div 
      className={`relative cursor-pointer overflow-hidden transition-opacity duration-200 ${
        isMobile
          ? type === "video"
            ? 'opacity-80 aspect-square'
            : type === "text"
            ? 'opacity-100 border-t border-gray-300'
            : 'opacity-100'
          : 'opacity-40 hover:opacity-100 aspect-square'
      }`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
    >
      {type === "image" && (
        <>
          <img
            src={thumbnailPath}
            alt={content?.description ?? ""}
            className={`w-full h-full object-cover ${!isLoaded ? 'block' : 'hidden'}`}
          />
          <img
            src={thumbnailPath}
            alt={content?.description ?? ""}
            className={`w-full h-full object-cover ${isLoaded ? 'block' : 'hidden'}`}
            onLoad={() => setIsLoaded(true)}
          />
        </>
      )}
      {type === "video" && (
        <>
          <img
            src={thumbnailPath}
            alt={content?.description ?? ""}
            className={`w-full h-full object-cover`}
          />
          {isMobile && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="bg-black text-white py-4 px-8 rounded-full">
                ▶️
              </button>
            </div>
          )}
        </>
      )}
      {type === "text" && content?.text && (
        <div className={`w-full ${isMobile ? 'h-auto' : 'h-full'} p-5 bg-purple-100 justify-center flex flex-col`}>
          {isMobile && (
            <div className="mb-2">
              <p className="font-bold">{content.author}</p>
              <p className="italic">{content.description}</p>
            </div>
          )}
          <p className="text-center overflow-hidden overflow-ellipsis">
            {content.text.join(" ")}
          </p>
        </div>
      )}
    </div>
  )
}

