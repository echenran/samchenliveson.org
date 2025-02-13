import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'

export interface Asset {
  type: "image" | "video" | "text"
  path: string
  thumbnailPath?: string
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
    // Ensure the path does not start with a double slash
    return `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
}

export async function getAssets() {
  // Use Vite's glob imports to get all assets from the public directory
  // Update glob patterns to match exact paths
  const imageFiles = import.meta.glob('/public/images/*', { eager: true })
  const videoFiles = import.meta.glob('/public/videos/*', { eager: true })
  const thumbnailFiles = import.meta.glob('/public/thumbnails/**/*', { eager: true })
  const englishTextFiles = import.meta.glob('/public/text/*_en.json')
  const chineseTextFiles = import.meta.glob('/public/text/*_ch.json')

  console.log('Found image files:', Object.keys(imageFiles))
  console.log('Found video files:', Object.keys(videoFiles))
  console.log('Found English text files:', Object.keys(englishTextFiles))
  console.log('Found Chinese text files:', Object.keys(chineseTextFiles))

  const images: Asset[] = Object.keys(imageFiles).map(file => {
    const filename = file.split('/').pop()
    const thumbnailPath = Object.keys(thumbnailFiles).find(
      t => t.includes(`thumbnails/images/${filename?.replace(/\.[^.]+$/, '.jpg')}`)
    )
    return {
      type: "image",
      path: `/images/${filename}`, // Simplified path
      thumbnailPath: thumbnailPath?.replace('/public', '')
    }
  })

  const videos: Asset[] = Object.keys(videoFiles).map(file => {
    const filename = file.split('/').pop()
    const thumbnailPath = Object.keys(thumbnailFiles).find(
      t => t.includes(`thumbnails/videos/${filename?.replace(/\.[^.]+$/, '.jpg')}`)
    )
    return {
      type: "video",
      path: `/videos/${filename}`, // Simplified path
      thumbnailPath: thumbnailPath?.replace('/public', '')
    }
  })

  const englishTexts: Asset[] = await Promise.all(
    Object.entries(englishTextFiles).map(async ([file, importFn]) => {
      const content = await importFn() as { default: Asset['content'] }
      return {
        type: "text",
        path: getPublicPath(`text/english/${file.split('/').pop()}`),
        content: content.default
      }
    })
  )

  const chineseTexts: Asset[] = await Promise.all(
    Object.entries(chineseTextFiles).map(async ([file, importFn]) => {
      const content = await importFn() as { default: Asset['content'] }
      return {
        type: "text",
        path: getPublicPath(`text/chinese/${file.split('/').pop()}`),

        content: content.default
      }
    })
  )

  const englishAssets = shuffleArray([...images, ...videos, ...englishTexts])
  const chineseAssets = shuffleArray([...images, ...videos, ...chineseTexts])

  return { englishAssets, chineseAssets }
} 