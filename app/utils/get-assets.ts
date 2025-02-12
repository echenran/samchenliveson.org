import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'
import 'server-only'

export interface Asset {
  type: "image" | "video" | "text"
  path: string
  content?: {
    author: string
    description: string
    text: string[]
  }
}

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

const getPublicPath = (path: string) => {
    const basePath = process.env.NODE_ENV === 'production' ? '/samchenliveson.org' : ''
    return `${basePath}${path}`
}

export async function getAssets() {
    const publicDir = join(process.cwd(), 'public')
    // const publicDir = `${process.env.NEXT_PUBLIC_BASE_PATH}`
    console.log("publicDir:", publicDir)
  
  // Read image files
  const imageFiles = readdirSync(join(publicDir, 'images'))
  const images: Asset[] = imageFiles.map(file => ({
    type: "image",
    path: getPublicPath(`/images/${file}`)
  }))

  // Read video files
  const videoFiles = readdirSync(join(publicDir, 'videos'))
  const videos: Asset[] = videoFiles.map(file => ({
    type: "video",
    path: getPublicPath(`/videos/${file}`)
  }))

  // Read JSON files
  const textFiles = readdirSync(join(publicDir, 'text'))
  const texts: Asset[] = textFiles.map(file => {
    const filePath = join(publicDir, 'text', file)
    const fileContent = readFileSync(filePath, 'utf-8')
    const content = JSON.parse(fileContent) // Parse the JSON content
    return {
      type: "text",
      path: getPublicPath(`/text/${file}`),
      content
    }
  })

  const assets = shuffleArray([...images, ...videos, ...texts])

  // For each asset, generate a thumbnail version
  const assetsWithThumbnails = assets.map(asset => ({
    ...asset,
    thumbnailSrc: `/thumbnails/${asset.path}` // You'll need to implement thumbnail generation
  }))

  return assetsWithThumbnails
} 