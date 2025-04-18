"use client"

import { useEffect, useRef, useState } from "react"
import {Play, Pause, Volume2, VolumeX, Maximize, Minimize, SkipBack, SkipForward, Settings, Check, PictureInPicture, MonitorUp, Bookmark, Keyboard} from "lucide-react"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Slider } from "@/components/ui/slider"

interface VideoPlayerProps {
  src: string
  poster?: string
  title?: string
}

export default function VideoPlayer({ src, poster, title = "Video" }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isVolumeSliderVisible, setIsVolumeSliderVisible] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [quality, setQuality] = useState("720p")
  const [isBuffering, setIsBuffering] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isPictureInPicture, setIsPictureInPicture] = useState(false)
  const [isTheaterMode, setIsTheaterMode] = useState(false)
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false)
  const [chapters, setChapters] = useState([
    { time: 30, title: "Bölüm 1" },
    { time: 120, title: "Bölüm 2" },
    { time: 240, title: "Bölüm 3" },
  ])

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleVolumeChange = (value: number[]) => {
    if (videoRef.current) {
      const newVolume = value[0]
      videoRef.current.volume = newVolume
      setVolume(newVolume)
      setIsMuted(newVolume === 0)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
      if (isMuted) {
        videoRef.current.volume = volume || 0.5
      } else {
        setVolume(videoRef.current.volume)
      }
    }
  }

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      const newTime = (value[0] / 100) * duration
      videoRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const toggleFullScreen = () => {
    if (videoContainerRef.current) {
      if (!document.fullscreenElement) {
        videoContainerRef.current.requestFullscreen().catch((err) => {
          console.error(`Error attempting to enable full-screen mode: ${err.message}`)
        })
      } else {
        document.exitFullscreen()
      }
    }
  }

  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds
    }
  }

  const changePlaybackSpeed = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed
      setPlaybackSpeed(speed)
    }
  }

  const changeQuality = (newQuality: string) => {
    setQuality(newQuality)
  }

  const resetControlsTimeout = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }

    setShowControls(true)

    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false)
      }, 3000)
    }
  }

  const togglePictureInPicture = async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture()
        setIsPictureInPicture(false)
      } else if (videoRef.current) {
        await videoRef.current.requestPictureInPicture()
        setIsPictureInPicture(true)
      }
    } catch (error) {
      console.error("Picture-in-Picture failed:", error)
    }
  }

  const toggleTheaterMode = () => {
    setIsTheaterMode(!isTheaterMode)
    if (videoContainerRef.current) {
      if (!isTheaterMode) {
        videoContainerRef.current.classList.add("max-w-none", "w-[90vw]")
      } else {
        videoContainerRef.current.classList.remove("max-w-none", "w-[90vw]")
      }
    }
  }

  const jumpToChapter = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  useEffect(() => {
    const video = videoRef.current

    if (!video) return

    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime)
    }

    const onLoadedMetadata = () => {
      setDuration(video.duration)
    }

    const onPlay = () => {
      setIsPlaying(true)
      resetControlsTimeout()
    }

    const onPause = () => {
      setIsPlaying(false)
      setShowControls(true)
    }

    const onVolumeChange = () => {
      setVolume(video.volume)
      setIsMuted(video.muted)
    }

    const onFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement)
    }

    const onWaiting = () => {
      setIsBuffering(true)
    }

    const onPlaying = () => {
      setIsBuffering(false)
    }

    video.addEventListener("timeupdate", onTimeUpdate)
    video.addEventListener("loadedmetadata", onLoadedMetadata)
    video.addEventListener("play", onPlay)
    video.addEventListener("pause", onPause)
    video.addEventListener("volumechange", onVolumeChange)
    video.addEventListener("waiting", onWaiting)
    video.addEventListener("playing", onPlaying)
    document.addEventListener("fullscreenchange", onFullscreenChange)

    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT") return

      switch (e.key.toLowerCase()) {
        case " ":
        case "k":
          e.preventDefault()
          togglePlay()
          break
        case "f":
          e.preventDefault()
          toggleFullScreen()
          break
        case "m":
          e.preventDefault()
          toggleMute()
          break
        case "arrowright":
          e.preventDefault()
          skip(10)
          break
        case "arrowleft":
          e.preventDefault()
          skip(-10)
          break
        case "i":
          e.preventDefault()
          togglePictureInPicture()
          break
        case "t":
          e.preventDefault()
          toggleTheaterMode()
          break
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          e.preventDefault()
          if (videoRef.current) {
            videoRef.current.currentTime = (duration * Number.parseInt(e.key)) / 10
          }
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate)
      video.removeEventListener("loadedmetadata", onLoadedMetadata)
      video.removeEventListener("play", onPlay)
      video.removeEventListener("pause", onPause)
      video.removeEventListener("volumechange", onVolumeChange)
      video.removeEventListener("waiting", onWaiting)
      video.removeEventListener("playing", onPlaying)
      document.removeEventListener("fullscreenchange", onFullscreenChange)
      document.removeEventListener("keydown", handleKeyDown)

      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [isPlaying, duration])

  return (
    <div
      ref={videoContainerRef}
      className="relative w-full bg-black rounded-lg overflow-hidden group"
      onMouseMove={resetControlsTimeout}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full aspect-video"
        onClick={togglePlay}
        onDoubleClick={toggleFullScreen}
      />

      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <button
            onClick={togglePlay}
            className="w-20 h-20 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-transform hover:scale-110"
          >
            <Play className="w-10 h-10 text-white fill-white" />
          </button>
        </div>
      )}

      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="w-16 h-16 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div
        className={cn(
          "absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0",
        )}
      >
        <h2 className="text-white font-medium text-lg">{title}</h2>
      </div>

      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0",
        )}
      >
        <div className="mb-2">
          <div className="relative">
            <div className="absolute top-0 left-0 right-0 h-1.5 pointer-events-none">
              {chapters.map((chapter) => (
                <div
                  key={chapter.time}
                  className="absolute top-0 h-full w-1 bg-primary/70"
                  style={{ left: `${(chapter.time / duration) * 100}%` }}
                  title={chapter.title}
                />
              ))}
            </div>
          </div>
          <Slider
            value={[currentTime ? (currentTime / duration) * 100 : 0]}
            onValueChange={handleSeek}
            max={100}
            step={0.1}
            className="cursor-pointer [&>span:first-child]:h-1.5 [&>span:first-child]:bg-white/30 [&_[role=slider]]:bg-primary [&_[role=slider]]:w-4 [&_[role=slider]]:h-4 [&_[role=slider]]:border-2 [&_[role=slider]]:border-white [&>span:first-child_span]:bg-primary"
          />
        </div>

        <div className="flex items-center gap-2">
          <button onClick={togglePlay} className="text-white hover:text-primary transition-colors">
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </button>

          <button onClick={() => skip(-10)} className="text-white hover:text-primary transition-colors">
            <SkipBack className="w-5 h-5" />
          </button>

          <button onClick={() => skip(10)} className="text-white hover:text-primary transition-colors">
            <SkipForward className="w-5 h-5" />
          </button>

          <div className="relative flex items-center ml-1 group">
            <button onClick={toggleMute} className="text-white hover:text-primary transition-colors">
              {isMuted || volume === 0 ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
            </button>

            <div className="w-20 ml-2">
              <Slider
                value={[isMuted ? 0 : volume * 100]}
                onValueChange={(value) => handleVolumeChange([value[0] / 100])}
                max={100}
                step={1}
                className="cursor-pointer [&>span:first-child]:h-1 [&>span:first-child]:bg-white/30 [&_[role=slider]]:bg-primary [&_[role=slider]]:w-3 [&_[role=slider]]:h-3 [&>span:first-child_span]:bg-primary"
              />
            </div>
          </div>

          <div className="text-white text-sm ml-2">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>

          <div className="flex-grow"></div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-white hover:text-primary transition-colors bg-gray-800/50 px-2 py-1 rounded text-sm font-medium">
                {playbackSpeed}x
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-gray-900/90 text-white border-gray-700">
              {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((speed) => (
                <DropdownMenuItem
                  key={speed}
                  onClick={() => changePlaybackSpeed(speed)}
                  className={cn(
                    "flex items-center gap-2 cursor-pointer hover:bg-gray-800",
                    playbackSpeed === speed && "text-primary",
                  )}
                >
                  {playbackSpeed === speed && <Check className="w-4 h-4" />}
                  {speed}x
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <button onClick={toggleTheaterMode} className="text-white hover:text-primary transition-colors ml-2">
            <MonitorUp className="w-5 h-5" />
          </button>

          <button onClick={togglePictureInPicture} className="text-white hover:text-primary transition-colors ml-2">
            <PictureInPicture className="w-5 h-5" />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-white hover:text-primary transition-colors ml-2">
                <Bookmark className="w-5 h-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-gray-900/90 text-white border-gray-700">
              {chapters.map((chapter) => (
                <DropdownMenuItem
                  key={chapter.time}
                  onClick={() => jumpToChapter(chapter.time)}
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-800"
                >
                  {chapter.title} ({formatTime(chapter.time)})
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            onClick={() => setShowKeyboardShortcuts(!showKeyboardShortcuts)}
            className="text-white hover:text-primary transition-colors ml-2"
          >
            <Keyboard className="w-5 h-5" />
          </button>

          <DropdownMenu onOpenChange={setIsSettingsOpen}>
            <DropdownMenuTrigger asChild>
              <button className="text-white hover:text-primary transition-colors ml-2">
                <Settings className={cn("w-5 h-5", isSettingsOpen && "text-primary")} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-gray-900/90 text-white border-gray-700">
              {["1080p", "720p", "480p", "360p", "Auto"].map((q) => (
                <DropdownMenuItem
                  key={q}
                  onClick={() => changeQuality(q)}
                  className={cn(
                    "flex items-center gap-2 cursor-pointer hover:bg-gray-800",
                    quality === q && "text-primary",
                  )}
                >
                  {quality === q && <Check className="w-4 h-4" />}
                  {q}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <button onClick={toggleFullScreen} className="text-white hover:text-primary transition-colors ml-2">
            {isFullScreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {showKeyboardShortcuts && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10 p-4">
          <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white text-lg font-bold">Klavye Kısayolları</h3>
              <button onClick={() => setShowKeyboardShortcuts(false)} className="text-white hover:text-primary">
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-400">Boşluk / K</div>
              <div className="text-white">Oynat/Duraklat</div>

              <div className="text-gray-400">M</div>
              <div className="text-white">Sesi Kapat/Aç</div>

              <div className="text-gray-400">F</div>
              <div className="text-white">Tam Ekran</div>

              <div className="text-gray-400">I</div>
              <div className="text-white">Resim İçinde Resim</div>

              <div className="text-gray-400">T</div>
              <div className="text-white">Tiyatro Modu</div>

              <div className="text-gray-400">Sağ Ok</div>
              <div className="text-white">10 Saniye İleri</div>

              <div className="text-gray-400">Sol Ok</div>
              <div className="text-white">10 Saniye Geri</div>

              <div className="text-gray-400">0-9</div>
              <div className="text-white">Videonun %0-%90'ına Atla</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
