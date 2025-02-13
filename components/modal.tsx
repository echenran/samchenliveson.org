"use client"

import { motion, AnimatePresence } from "framer-motion"
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from "react"

interface Content {
  author: string;
  description: string;
  text: string[];
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  currentIndex: number;
  src: string;
  type: "image" | "video" | "text";
  content?: Content;
  allAssets: Array<{
    src: string;
    type: "image" | "video" | "text";
    content?: Content;
  }>;
}
export default function Modal({ isOpen, onClose, onNavigate, currentIndex, src, type, content, allAssets }: ModalProps) {
  if (!isOpen) return null

  const asset = allAssets[currentIndex] || {}
  const assetType = asset.type || "image"
  const assetSrc = asset.src || ""
  const assetContent = asset.content || { author: '', description: '', text: [] };

  // Debugging
  console.log('Current asset:', asset)

  console.log('Modal props:', {
    isOpen,
    currentIndex,
    src,
    type,
    content,
    allAssets: allAssets.map(asset => ({
      src: asset.src,
      type: asset.type,
      content: asset.content
    }))
  })

  const [direction, setDirection] = useState<'prev' | 'next'>('next')
  const [isNavigating, setIsNavigating] = useState(false)

  useEffect(() => {
    if (!isOpen || !allAssets) return;

    const preloadMedia = (src: string, type: "image" | "video") => {
      if (type === 'image') {
        const img = new Image();
        img.src = src;
      } else if (type === 'video') {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.src = src;
      }
    };

    const preloadAsset = (index: number) => {
      if (index >= 0 && index < allAssets.length) {
        const asset = allAssets[index];
        if (asset.type === 'image' || asset.type === 'video') {
          preloadMedia(asset.src, asset.type);
        }
      }
    };

    // Preload next and previous items
    preloadAsset(currentIndex + 1);
    preloadAsset(currentIndex - 1);

    // Preload two items to the left and right
    preloadAsset(currentIndex + 2);
    preloadAsset(currentIndex - 2);

  }, [currentIndex, isOpen, allAssets]);

  const handleNavigate = (newDirection: 'prev' | 'next') => {
    setIsNavigating(true)
    setDirection(newDirection)
    onNavigate(newDirection)
  }

  const variants = {
    enter: (direction: 'prev' | 'next') => ({
      x: direction === 'next' ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: 'prev' | 'next') => ({
      x: direction === 'next' ? '-100%' : '100%',
      opacity: 0
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
            className="relative bg-white rounded-lg w-full p-4 overflow-hidden flex items-center justify-center max-h-screen"
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
                className="aspect-square w-full relative flex justify-start h-full"
                onAnimationComplete={() => setIsNavigating(false)}
              >
                {assetType === "image" ? (
                  <img
                    src={assetSrc}
                    alt={`Item ${currentIndex + 1}`}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                ) : assetType === "video" ? (
                  <video
                    src={assetSrc}
                    controls
                    className="w-full h-full object-contain"
                    playsInline
                  >
                    <source src={assetSrc} type="video/quicktime" />
                  </video>
                ) : assetType === "text" && assetContent ? (
                  <div className="p-4 flex flex-col items-start justify-start overflow-y-auto max-h-full w-full">
                    <h2 className="text-lg font-bold">{assetContent.author}</h2>
                    <p className="text-sm italic mb-4">{assetContent.description}</p>
                    {assetContent.text?.map((paragraph, index) => (
                      <p key={index} className="mb-2">{paragraph}</p>
                    ))}
                  </div>
                ) : null}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
} 