"use client"

import { useState, useEffect } from "react"
import { useInView } from "react-intersection-observer"
import { motion, AnimatePresence } from "framer-motion"
import GridItem from "@/components/grid-item"
import Modal from "@/components/modal"
import type { Asset } from "@/app/utils/get-assets"

export default function ClientContent({ initialAssets }: { initialAssets: Asset[] }) {
  const [assets] = useState<Asset[]>(() => initialAssets)
  const [showVideo, setShowVideo] = useState(false)
  const [modalState, setModalState] = useState({
    isOpen: false,
    currentIndex: 0
  })
  const { ref: videoRef, inView } = useInView({
    threshold: 0.5,
  })

  useEffect(() => {
    setShowVideo(inView)
  }, [inView])

  const handleItemClick = (index: number) => {
    setModalState({ isOpen: true, currentIndex: index })
  }

  const handleCloseModal = () => {
    setModalState({ ...modalState, isOpen: false })
  }

  const handleNavigate = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'next' 
      ? (modalState.currentIndex + 1) % assets.length
      : (modalState.currentIndex - 1 + assets.length) % assets.length
    setModalState({ ...modalState, currentIndex: newIndex })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Grid of tiles */}
      <div className="grid grid-cols-6">
        {assets.map((asset, i) => (
          <GridItem
            key={i}
            type={asset.type}
            src={asset.path}
            onClick={() => handleItemClick(i)}
          />
        ))}
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        onNavigate={handleNavigate}
        currentIndex={modalState.currentIndex}
        src={assets[modalState.currentIndex]?.path || ""}
        type={assets[modalState.currentIndex]?.type || "image"}
      />

      {/* Fixed center title with smooth fade effect */}
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
        <AnimatePresence>
          {!showVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative w-600 h-128 p-24 flex flex-col items-center justify-center"
            >
              <div
                className="absolute -inset-20"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 70%)",
                }}
              />
              <h1 className="text-4xl text-center font-serif relative z-10">Sam Chen Lives On</h1>
              <p className="relative z-10 mt-4 text-center">
                <p>Samuel Ran Chen (2006 - 2025) was a beloved son, brother, and friend.</p>
                <p>He left this world too soon, but his enthusiasm and zest for life live on.</p>
              </p>
              <p className="relative z-10 mt-4 text-center">
                <p>The Sam Chen Lives On Foundation is a non-profit organization dedicated to supporting special needs children and adults.</p>
                <p>If you would like to help preserve Sam's legacy and support the foundation, please donate in one of the following ways:</p>
                <p>Zelle: samuelchenangel0510@gmail.com</p>
                <p>Paypal: email</p>
                <p>Check: Mail to ...</p>
              </p>
              <p className="relative z-10 mt-4 text-center">
                <p>If you would like to volunteer with grant-writing or other activities, please fill out the form below.</p>
                    <a href="https://docs.google.com/forms/d/e/1FAIpQLSe1l0VHiFlITKYbi9O-w6bXkUWfxptIFd_q8NiOi7fRRaQWMA/viewform">.
                    <div></div>
                    </a>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* YouTube video (scrolls with page) */}
      <div className="max-w-4xl mx-auto my-24">
        <div
          ref={videoRef}
          className={`aspect-video transition-opacity duration-300 ${showVideo ? "opacity-100" : "opacity-0"}`}
        >
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/3bLc6XPeZkU"
            title="Memorial Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  )
} 