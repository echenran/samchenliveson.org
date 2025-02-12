"use client"

import { useState, useEffect } from "react"
import { useInView } from "react-intersection-observer"
import { motion, AnimatePresence } from "framer-motion"
import GridItem from "@/components/grid-item"
import Modal from "@/components/modal"
import type { Asset } from "@/app/utils/get-assets"
import { useMediaQuery } from 'react-responsive'

export default function ClientContent({ initialAssets }: { initialAssets: Asset[] }) {
  const [assets] = useState<Asset[]>(() => initialAssets)
  const [showVideo, setShowVideo] = useState(false)
  const isMobile = useMediaQuery({ maxWidth: 768 })
  const [modalState, setModalState] = useState({
    isOpen: false,
    currentIndex: 0
  })
  const { ref: videoRef, inView } = useInView({
    threshold: 0.5,
  })
  const [isChinese, setIsChinese] = useState(false)

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
      {/* Wrap all elements in a single parent element */}
      <>
        {/* Text at the top for mobile */}
        <div className="block md:hidden p-6">
            <a href="#" 
                className="text-xl text-center font-serif relative z-20 text-purple-700 pointer-events-auto"
                onClick={(e) => {
                    e.preventDefault(); // Prevent default anchor behavior
                    setIsChinese(!isChinese);
                }}
            >
                <h1>{isChinese ? "English→" : "中文→"}</h1>
            </a> 
          <h1 className="text-2xl text-center font-serif">
            {isChinese ? "陈三的精神永存" : "Sam Chen Lives On"}
          </h1>
          <p className="mt-2 text-center">
            {isChinese 
              ? (
              <>
              <span>陈然（2006 - 2025）是一位深受爱戴的儿子、兄弟和朋友。他过早地离开了这个世界，但他的热情和对生活的热爱依然存在。</span>
              </>
              ) : (
              <>
              <span>Samuel Ran Chen (2006 - 2025) was a beloved son, brother, and friend. He left this world too soon, but his enthusiasm and zest for life live on.</span>
              </>
              )
            }
          </p>
          <p className="text-center">
            <br />
            {isChinese 
              ? (<>
                <span>陈三精神永存基金会是一个致力于支持特殊需要儿童和成人的非营利组织。如果您想帮助保存陈三的遗产并支持基金会，请通过以下方式捐款:</span>
                <br />
                <span>Zelle: samuelchenangel0510@gmail.com</span>
                <br />
                <span>Paypal: email</span>
                <br />
                <span>Check: Mail to ...</span>
              </>
              ) : (<>
                <span>The Sam Chen Lives On Foundation is a non-profit organization dedicated to supporting special needs children and adults. If you would like to help preserve Sam's legacy and support the foundation, you can donate in one of the following ways:</span>
                <br />
                <span>Zelle: samuelchenangel0510@gmail.com</span>
                <br />
                <span>Paypal: email</span>
                <br />
                <span>Check: Mail to ...</span>
              </>
              )
            }
          </p>
          <p className="relative z-10 mt-4 text-center">
            {isChinese 
            ? "如果您想参与撰写资助申请或其他活动，请填写以下表格。"
            : "If you would like to volunteer with grant-writing or other activities, please fill out the form below."
            }
            <br></br>
            {isChinese ? 
                <a href="https://docs.google.com/forms/d/e/1FAIpQLSd7Uw0qYFPMfC5RW_HLe9gthjWGbWViqnzoyAvGbrT3zyMNnQ/viewform" className="relative z-20 pointer-events-auto" target="_blank">
                    <button className="bg-purple-700 text-white px-4 py-2 mt-4 rounded-md">
                    报名志愿者
                    </button>
                </a>
                : 
                <a href="https://docs.google.com/forms/d/e/1FAIpQLSe1l0VHiFlITKYbi9O-w6bXkUWfxptIFd_q8NiOi7fRRaQWMA/viewform" className="relative z-20 pointer-events-auto" target="_blank">
                    <button className="bg-purple-700 text-white px-4 py-2 mt-4 rounded-md">
                    Sign up to volunteer
                    </button>
                </a>
            }
          </p>
        </div>

        {/* Grid of tiles */}
        <div className="grid grid-cols-1 md:grid-cols-6">
          {assets.map((asset, i) => (
            <GridItem
              key={i}
              type={asset.type}
              src={asset.path}
              content={asset.content}
              onClick={() => handleItemClick(i)}
              isMobile={isMobile}
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
          content={assets[modalState.currentIndex]?.content || undefined}
          allAssets={assets.map(asset => ({
            src: asset.path,
            type: asset.type,
            content: asset.content
          }))}
        />

        {/* Fixed center title with smooth fade effect for desktop */}
        <div className="hidden md:flex fixed inset-0 pointer-events-none items-center justify-center">
          <AnimatePresence>
            {!showVideo && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative w-600 h-128 p-24 flex flex-col items-center justify-center"
              >
                <div
                  className="absolute -inset-20 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(ellipse at center, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 70%)",
                  }}
                />
                <a 
                  href="#" 
                  className="text-3xl text-center font-serif relative z-20 text-purple-700 pointer-events-auto"
                  onClick={(e) => {
                    e.preventDefault(); // Prevent default anchor behavior
                    setIsChinese(!isChinese);
                  }}
                >
                  <h1>{isChinese ? "English→" : "中文→"}</h1>
                </a>
                <h1 className="text-4xl text-center font-serif relative z-10">
                  {isChinese ? "Sam Chen精神永存" : "Sam Chen Lives On"}
                </h1>
                <p className="relative z-10 mt-4 text-center">
                  {isChinese 
                    ? "陈然（2006 - 2025）是一位深受爱戴的儿子、兄弟和朋友。他过早地离开了这个世界，但他的热情和对生活的热爱依然存在。"
                    : "Samuel Ran Chen (2006 - 2025) was a beloved son, brother, and friend. He left this world too soon, but his enthusiasm and zest for life live on."
                  }
                </p>
                <p className="relative z-10 mt-4 text-center">
                  {isChinese 
                    ? (
                      <>
                          <span>陈三精神永存基金会是一个致力于支持特殊需要儿童和成人的非营利组织。</span>
                          <br />
                          <br />
                          <span>如果您想帮助保存陈三的遗产并支持基金会，请通过以下方式捐款:</span>
                          <br />
                          <span>Zelle: samuelchenangel0510@gmail.com</span>
                          <br />
                          <span>Paypal: email</span>
                          <br />
                          <span>Check: Mail to ...</span>
                      </>
                    ) : (
                      <>
                        <span>The Sam Chen Lives On Foundation is a non-profit organization dedicated to supporting special needs children and adults.</span>
                        <br />
                        <br />
                        <span>If you would like to help preserve Sam's legacy and support the foundation, you can donate in one of the following ways:</span>
                        <br />
                        <span>Zelle: samuelchenangel0510@gmail.com</span>
                        <br />
                        <span>Paypal: email</span>
                        <br />
                        <span>Check: Mail to ...</span>
                      </>
                    )
                  }
                </p>
                <p className="relative z-10 mt-4 text-center">
                  {isChinese 
                    ? "如果您想参与撰写资助申请或其他活动，请填写以下表格。"
                    : "If you would like to volunteer with grant-writing or other activities, please fill out the form below."
                  }
                  <br></br>
                  {isChinese ? 
                    <a href="https://docs.google.com/forms/d/e/1FAIpQLSd7Uw0qYFPMfC5RW_HLe9gthjWGbWViqnzoyAvGbrT3zyMNnQ/viewform" className="relative z-20 pointer-events-auto">
                      <button className="bg-purple-700 text-white px-4 py-2 mt-4 rounded-md">
                      报名志愿者"
                      </button>
                    </a>
                  : 
                    <a href="https://docs.google.com/forms/d/e/1FAIpQLSe1l0VHiFlITKYbi9O-w6bXkUWfxptIFd_q8NiOi7fRRaQWMA/viewform" className="relative z-20 pointer-events-auto">
                        <button className="bg-purple-700 text-white px-4 py-2 mt-4 rounded-md">
                        Sign up to volunteer
                        </button>
                    </a>
                  }
                  
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
      </>
    </div>
  )
} 