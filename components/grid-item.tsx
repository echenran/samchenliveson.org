"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

interface GridItemProps {
  type: "image" | "video"
  src: string
  thumbnailSrc?: string
  alt?: string
  content?: string
  onClick?: () => void
}

export default function GridItem({ type, src, thumbnailSrc, alt, onClick }: GridItemProps) {
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

  return (
    <motion.div 
      className="aspect-square relative opacity-20 hover:opacity-100 transition-opacity duration-300 bg-purple-200 cursor-pointer" 
      style={{ willChange: 'opacity, transform' }}
      whileHover={{ scale: 1 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
    >
      {type === "image" && (
        <>
          {thumbnailSrc && (
            <Image
              src={thumbnailSrc}
              alt={alt || ""}
              fill
              className="object-cover blur-up-animation"
              priority
            />
          )}
          <Image
            src={src}
            alt={alt || ""}
            fill
            className="object-cover"
            loading={thumbnailSrc ? "lazy" : "eager"}
          />
        </>
      )}
      {type === "video" && (
        <>
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={alt || "Video thumbnail"}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-pulse">Loading...</div>
            </div>
          )}
        </>
      )}
      {type === "text" && content && (
        <div className="w-full h-full flex items-center justify-center p-4">
          <p className="text-gray-800 text-center">{content}</p>
        </div>
      )}
    </motion.div>
  )
}

