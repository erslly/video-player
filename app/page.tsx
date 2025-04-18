import VideoPlayer from "../components/video-player"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-gray-100">
      <div className="w-full max-w-4xl">
        <VideoPlayer
          src="https://p.erslly.xyz/%5BSeicode%5D%20The%20Too-Perfect%20Saint%20Tossed%20Aside%20by%20My%20Fianc%C3%A9%20and%20Sold%20to%20Another%20Kingdom%20-%2001%20%5B1080p%5D%20(1)%20(1).mp4"
          poster="/placeholder.svg?height=720&width=1280"
          title="The Too-Perfect Saint Tossed Aside by My Fiancé and Sold to Another Kingdom"
        />
      </div>
    </main>
  )
}
