import sharp from 'sharp'
import ffmpeg from 'fluent-ffmpeg'
import { promises as fs } from 'fs'
import path from 'path'
import { promisify } from 'util'

const THUMBNAIL_SIZE = 400 // pixels
const THUMBNAIL_QUALITY = 100

async function ensureDir(dir: string) {
  try {
    await fs.access(dir)
  } catch {
    await fs.mkdir(dir, { recursive: true })
  }
}

async function generateImageThumbnail(inputPath: string, outputPath: string) {
  await sharp(inputPath)
    .rotate() // Automatically rotate based on EXIF data
    .resize(THUMBNAIL_SIZE, THUMBNAIL_SIZE, {
      fit: 'cover',
      position: 'center'
    })
    .jpeg({ quality: THUMBNAIL_QUALITY })
    .toFile(outputPath)
}

const generateVideoThumbnail = promisify((inputPath: string, outputPath: string, callback: (error: Error | null) => void) => {
  console.log(`Generating thumbnail for video: ${inputPath}`)
  
  ffmpeg(inputPath)
    .on('start', (commandLine) => {
      console.log('FFmpeg process started:', commandLine)
    })
    .on('error', (err) => {
      console.error('FFmpeg error:', err)
      callback(err)
    })
    .on('end', () => {
      console.log('FFmpeg process completed')
      callback(null)
    })
    .complexFilter([
      `[0:v]scale=${THUMBNAIL_SIZE}:${THUMBNAIL_SIZE}:force_original_aspect_ratio=increase,crop=${THUMBNAIL_SIZE}:${THUMBNAIL_SIZE},setsar=1`
    ])
    .screenshots({
      count: 1,
      folder: path.dirname(outputPath),
      filename: path.basename(outputPath),
      timestamps: [0]  // Take screenshot from the first frame
    })
})

async function main() {
  const publicDir = path.join(process.cwd(), 'public')
  const thumbnailsDir = path.join(publicDir, 'thumbnails')
  
  // Ensure thumbnails directory exists
  await ensureDir(thumbnailsDir)
  await ensureDir(path.join(thumbnailsDir, 'images'))
  await ensureDir(path.join(thumbnailsDir, 'videos'))

  // Process images
  const imagesDir = path.join(publicDir, 'images')
  const imageFiles = await fs.readdir(imagesDir)
  for (const file of imageFiles) {
    if (file.match(/\.(jpg|jpeg|png|webp)$/i)) {
      const inputPath = path.join(imagesDir, file)
      const outputPath = path.join(thumbnailsDir, 'images', `${path.parse(file).name}.jpg`)
      await generateImageThumbnail(inputPath, outputPath)
      console.log(`Generated thumbnail for ${file}`)
    }
  }

  // Process videos
  const videosDir = path.join(publicDir, 'videos')
  try {
    const videoFiles = (await fs.readdir(videosDir))
      .filter(file => file !== '.DS_Store')  // Skip .DS_Store file
    console.log('Found video files:', videoFiles)
    
    for (const file of videoFiles) {
      if (file.match(/\.(mp4|webm|mov)$/i)) {
        const inputPath = path.join(videosDir, file)
        const outputPath = path.join(thumbnailsDir, 'videos', `${path.parse(file).name}.jpg`)
        console.log(`Processing video: ${inputPath} -> ${outputPath}`)
        try {
          await generateVideoThumbnail(inputPath, outputPath)
          console.log(`Successfully generated thumbnail for ${file}`)
        } catch (err) {
          console.error(`Failed to generate thumbnail for ${file}:`, err)
        }
      }
    }
  } catch (err) {
    console.error('Error processing videos:', err)
  }
}

main().catch(console.error) 