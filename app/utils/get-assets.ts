import { readdirSync } from 'fs'
import { join } from 'path'
import 'server-only'

export interface Asset {
  type: "image" | "video"
  path: string
}

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

export async function getAssets() {
  const publicDir = join(process.cwd(), 'public')
  
  // Read image files
  const imageFiles = readdirSync(join(publicDir, 'images'))
  const images: Asset[] = imageFiles.map(file => ({
    type: "image",
    path: `/images/${file}`
  }))

  // Read video files
  const videoFiles = readdirSync(join(publicDir, 'videos'))
  const videos: Asset[] = videoFiles.map(file => ({
    type: "video",
    path: `/videos/${file}`
  }))

  return shuffleArray([...images, ...videos])
} 