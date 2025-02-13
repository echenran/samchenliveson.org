import { useState, useEffect } from 'react'
import './globals.css'
import ClientContent from '../components/client-content'
import { getAssets } from './utils/get-assets'
import type { Asset } from './utils/get-assets'

export default function App() {
  const [englishAssets, setEnglishAssets] = useState<Asset[]>([])
  const [chineseAssets, setChineseAssets] = useState<Asset[]>([])

  useEffect(() => {
    const loadAssets = async () => {
      const { englishAssets, chineseAssets } = await getAssets()
      setEnglishAssets(englishAssets)
      setChineseAssets(chineseAssets)
    }
    
    loadAssets()
  }, [])

  return (
    <main className="min-h-screen bg-white relative z-10">
      <ClientContent englishAssets={englishAssets} chineseAssets={chineseAssets} />
    </main>
  )
}
