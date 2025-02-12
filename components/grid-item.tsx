"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

interface GridItemProps {
  type: "image" | "video" | "text"
  src: string
  thumbnailSrc?: string
  alt?: string
  content?: {
    author: string
    description: string
    text: string[]
  }
  onClick?: () => void
  isMobile?: boolean
}

export default function GridItem({ type, src, thumbnailSrc, alt, content, onClick, isMobile }: GridItemProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [thumbnail, setThumbnail] = useState<string>(thumbnailSrc || "")

  useEffect(() => {
    if (type === "video" && !thumbnailSrc) {
      const video = document.createElement('video')
      video.src = src
      video.preload = "metadata"
      video.muted = true
      
      video.onloadeddata = () => {
        video.currentTime = 1 // Get frame at 1 second
      }
      
      video.onseeked = () => {
        const canvas = document.createElement('canvas')
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(video, 0, 0)
        setThumbnail(canvas.toDataURL('image/jpeg'))
      }
    }
  }, [src, type, thumbnailSrc])

  function switchMediaType(type: "image" | "video" | "text", content?: {
    author: string
    description: string
    text: string[]
  }){
    if (type === "image") {
      return (
        <>
          {thumbnailSrc && (
            <Image
              src={thumbnailSrc}
              alt={alt || ""}
              width={500}
              height={500}
              className="object-cover blur-up-animation w-full h-full"
              priority
            />
          )}
          <Image
            src={src}
            alt={alt || ""}
            width={500}
            height={500}
            className="object-cover w-full h-full"
            loading={thumbnailSrc ? "lazy" : "eager"}
          />
        </>
      )
    } else if (type === "video") {
      return (
        <>
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={alt || "Video thumbnail"}
              width={500}
              height={500}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-pulse">Loading...</div>
            </div>
          )}
          {/* Play button overlay, visible only on mobile */}
          <div className="absolute inset-0 flex items-center justify-center md:hidden">
            <button className="bg-black bg-opacity-50 text-white p-2 rounded-full">
              ▶
            </button>
          </div>
        </>
      )
    } else if (type === "text") {
      return (
        <div className="w-full h-full flex items-center justify-center p-4">
          <div className="flex flex-col justify-center h-full overflow-hidden">
            {isMobile && (
              <>
                {content?.author && (
                  <p className="text-gray-600 text-left mt-2">
                    {content.author} ({content.description})
                  </p>
                )}
              </>
            )}
            <p className="text-gray-800 text-center overflow-hidden text-overflow-ellipsis">
              {content?.text.join(" ")}
            </p>
          </div>
        </div>
      )
    }
  }

  function mobileMotionDiv(type: "image" | "video" | "text", content?: {
    author: string
    description: string
    text: string[]
  }) {
    if (isMobile) {
      return (
        <motion.div 
          className="w-full opacity-100 mobile-class relative cursor-pointer bg-purple-200 " 
          style={{ willChange: 'transform' }}
        >
          {switchMediaType(type, content)}
        </motion.div>
      )
    } else {
      return (
        <motion.div 
          className="aspect-square relative opacity-20 hover:opacity-100 transition-opacity duration-300 bg-purple-200 cursor-pointer" 
          style={{ willChange: 'opacity, transform' }}
          whileHover={{ scale: 1 }}
          transition={{ duration: 0.2 }}
          onClick={onClick}
        >
          {switchMediaType(type, content)}
        </motion.div>
      )
    }
  }

  return (
    mobileMotionDiv(type, content)
  )
}

