"use client"

import NextImage from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from "react"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  onNavigate: (direction: 'prev' | 'next') => void
  currentIndex: number
  src: string
  type: "image" | "video" | "text"
  content?: {
    author: string
    description: string
    text: string[]
  }
  allAssets: Array<{ src: string, type: "image" | "video" | "text", content?: {
    author: string
    description: string
    text: string[]
  } }>
}
export default function Modal({ isOpen, onClose, onNavigate, currentIndex, src, type, content, allAssets }: ModalProps) {
  const [direction, setDirection] = useState<'prev' | 'next'>('next')
  const [isNavigating, setIsNavigating] = useState(false)

  useEffect(() => {
    if (!isOpen || !allAssets) return

    // Preload next and previous images
    const preloadImage = (src: string) => {
      const img: HTMLImageElement = new window.Image()
      img.src = src
    }

    const preloadVideo = (src: string) => {
      const video = document.createElement('video')
      video.preload = 'metadata'
      video.src = src
    }

    // Preload next item
    if (currentIndex < allAssets.length - 1) {
      const nextAsset = allAssets[currentIndex + 1]
      if (nextAsset.type === 'image') {
        preloadImage(nextAsset.src)
      } else {
        preloadVideo(nextAsset.src)
      }
    }

    // Preload previous item
    if (currentIndex > 0) {
      const prevAsset = allAssets[currentIndex - 1]
      if (prevAsset.type === 'image') {
        preloadImage(prevAsset.src)
      } else {
        preloadVideo(prevAsset.src)
      }
    }
  }, [currentIndex, isOpen, allAssets])

  if (!isOpen) return null

  const handleNavigate = (newDirection: 'prev' | 'next') => {
    setIsNavigating(true)
    setDirection(newDirection)
    onNavigate(newDirection)
  }

  const variants = {
    enter: (direction: 'prev' | 'next') => ({
      x: direction === 'next' ? '100%' : '-100%'
    }),
    center: {
      x: 0
    },
    exit: (direction: 'prev' | 'next') => ({
      x: direction === 'next' ? '-100%' : '100%'
    })
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
        onClick={onClose}
      >
        <div className="relative max-w-4xl w-full mx-auto">
          {/* Navigation buttons */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleNavigate('prev')
            }}
            className="absolute -left-16 top-1/2 -translate-y-1/2 p-4 hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronLeftIcon className="w-8 h-8 text-white" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              handleNavigate('next')
            }}
            className="absolute -right-16 top-1/2 -translate-y-1/2 p-4 hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronRightIcon className="w-8 h-8 text-white" />
          </button>

          {/* Modal content */}
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className="relative bg-white rounded-lg w-full p-4 overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full z-10"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            {/* Content */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={isNavigating ? variants : undefined}
                initial={isNavigating ? "enter" : false}
                animate="center"
                exit={isNavigating ? "exit" : undefined}
                transition={{ type: "tween", duration: 0.3 }}
                className="aspect-square w-full relative"
                onAnimationComplete={() => setIsNavigating(false)}
              >
                {type === "image" ? (
                  <NextImage
                    src={src}
                    alt={`Item ${currentIndex + 1}`}
                    fill
                    className="object-contain"
                  />
                ) : type === "video" ? (
                  <video
                    src={src}
                    controls
                    className="w-full h-full object-contain"
                    playsInline
                  >
                    <source src={src} type="video/quicktime" />
                  </video>
                ) : (
                  <div className="p-4">
                    <h2 className="text-lg font-bold">{content?.author}</h2>
                    <p className="text-sm italic mb-4">{content?.description}</p>
                    {content?.text.map((paragraph, index) => (
                      <p key={index} className="mb-2">{paragraph}</p>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
} 