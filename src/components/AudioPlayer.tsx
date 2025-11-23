'use client'

import { useState, useRef, useEffect } from 'react'

type Props = {
  src: string
}

const SPEEDS = [0.75, 1.0, 1.25, 1.5, 1.75, 2.0]

export default function AudioPlayer({ src }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [speed, setSpeed] = useState(1.0)
  const [isLooping, setIsLooping] = useState(false)

  // Load settings from localStorage
  useEffect(() => {
    const savedSpeed = localStorage.getItem('audioSpeed')
    const savedLoop = localStorage.getItem('audioLoop')
    if (savedSpeed) setSpeed(parseFloat(savedSpeed))
    if (savedLoop) setIsLooping(savedLoop === 'true')
  }, [])

  // Apply settings to audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed
      audioRef.current.loop = isLooping
    }
  }, [speed, isLooping])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed)
    localStorage.setItem('audioSpeed', newSpeed.toString())
  }

  const toggleLoop = () => {
    const newLoop = !isLooping
    setIsLooping(newLoop)
    localStorage.setItem('audioLoop', newLoop.toString())
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border space-y-4">
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onDurationChange={handleLoadedMetadata}
        onEnded={() => !isLooping && setIsPlaying(false)}
      />

      {/* Progress Bar */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 w-10 text-right">{formatTime(currentTime)}</span>
        <input
          type="range"
          min="0"
          max={duration || 0}
          step="0.1"
          value={currentTime}
          onChange={handleSeek}
          className="flex-grow h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <span className="text-xs text-gray-500 w-10">{formatTime(duration)}</span>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center">
        <button
          onClick={togglePlay}
          className="w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
        >
          {isPlaying ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          )}
        </button>

        <div className="flex items-center gap-4">
          {/* Speed Control */}
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium text-gray-500">Speed</span>
            <select
              value={speed}
              onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
              className="text-sm border rounded p-1 bg-gray-50"
            >
              {SPEEDS.map(s => (
                <option key={s} value={s}>x{s}</option>
              ))}
            </select>
          </div>

          {/* Loop Control */}
          <button
            onClick={toggleLoop}
            className={`p-2 rounded-lg transition-colors ${
              isLooping ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:bg-gray-100'
            }`}
            title="Toggle Loop"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </button>
        </div>
      </div>
    </div>
  )
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
