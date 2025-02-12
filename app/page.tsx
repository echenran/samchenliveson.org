import { getAssets } from "./utils/get-assets"
import ClientContent from "@/components/client-content"

// Server Component
export default async function MemorialPage() {
  const assets = await getAssets()
  
  return (
    <>
      <div className="min-h-screen bg-white relative z-10">
        <ClientContent initialAssets={assets} />
      </div>
    </>
  )
}

