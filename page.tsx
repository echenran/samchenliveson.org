"use client"

import { useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"
import { motion, AnimatePresence } from "framer-motion"

export default function MemorialPage() {
  const [showVideo, setShowVideo] = useState(false)
  const { ref: videoRef, inView } = useInView({
    threshold: 0.5,
  })

  useEffect(() => {
    setShowVideo(inView)
  }, [inView])

  return (
    <div className="min-h-screen bg-white">
      {/* Grid of tiles */}
      <div className="grid grid-cols-6">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="aspect-square bg-purple-200 transition-opacity duration-300 hover:opacity-100 opacity-20"
          />
        ))}
      </div>

      {/* Fixed center title with smooth fade effect */}
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
        <AnimatePresence>
          {!showVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative w-96 h-48 flex items-center justify-center"
            >
              <div
                className="absolute inset-0 bg-gradient-radial from-white via-white to-transparent"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%)",
                }}
              />
              <h1 className="text-4xl text-center font-serif relative z-10">Sam Chen Lives On</h1>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* YouTube video (scrolls with page) */}
      <div className="max-w-4xl mx-auto mb-24">
        <div
          ref={videoRef}
          className={`aspect-video transition-opacity duration-300 ${showVideo ? "opacity-100" : "opacity-0"}`}
        >
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/your-video-id"
            title="Memorial Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  )
}

