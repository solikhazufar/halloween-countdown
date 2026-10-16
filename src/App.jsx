import { useEffect, useRef, useState } from 'react'
import './App.css'

const getTimeLeft = () => {
  const now = new Date()
  const currentYear = now.getFullYear()
  const halloweenThisYear = new Date(currentYear, 9, 31, 0, 0, 0)

  const targetDate =
    now > halloweenThisYear
      ? new Date(currentYear + 1, 9, 31, 0, 0, 0)
      : halloweenThisYear

  const difference = Math.max(targetDate.getTime() - now.getTime(), 0)

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  }
}

const isHalloweenDay = () => {
  const now = new Date()
  return now.getMonth() === 9 && now.getDate() === 31
}

function App() {
  const screamAudioRef = useRef(null)
  const videoRef = useRef(null)
  const [timeLeft, setTimeLeft] = useState(getTimeLeft)
  const [showCelebration, setShowCelebration] = useState(false)
  const [screamActive, setScreamActive] = useState(false)
  const [screamText, setScreamText] = useState('WAAAAAHHHHH!')

  const screamTexts = [
    'GHHHHHAAAA!',
    'RAAAAGHHH!',
    'MURRHHHH!',
    'WOOOAAAAH!',
  ]

  useEffect(() => {
    const updateTimer = () => {
      setTimeLeft(getTimeLeft())
      setShowCelebration(isHalloweenDay())
    }

    screamAudioRef.current = new Audio(
      '/phatphrogstudio-wendigo-horror-voice-angry-scream-growl-roar-583005.mp3',
    )

    if (videoRef.current) {
      videoRef.current.muted = true
      videoRef.current.loop = true
      videoRef.current.play().catch(() => {})
    }

    updateTimer()
    const timer = setInterval(updateTimer, 1000)
    return () => clearInterval(timer)
  }, [])

  const playScreamSound = () => {
    try {
      if (!screamAudioRef.current) {
        screamAudioRef.current = new Audio('/phatphrogstudio-wendigo-horror-voice-angry-scream-growl-roar-583005.mp3')
        screamAudioRef.current.volume = 0.7
      }

      screamAudioRef.current.currentTime = 0
      screamAudioRef.current.play()
    } catch (error) {
      console.error('Scream sound failed to start:', error)
    }
  }

  const triggerSkeleton = () => {
    const randomScream = screamTexts[Math.floor(Math.random() * screamTexts.length)]
    const screamDuration = 1200

    setScreamText(randomScream)
    setScreamActive(true)

    if (screamAudioRef.current) {
      screamAudioRef.current.currentTime = 0
      screamAudioRef.current.volume = 0.85
      screamAudioRef.current.play().catch(() => {})
    }

    playScreamSound()

    setTimeout(() => {
      setScreamActive(false)
    }, screamDuration + 100)
  }

  const countdownItems = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ]

  const hangingDecor = [
    { type: 'bat', className: 'decor-left', emoji: '🦇' },
    { type: 'bat', className: 'decor-center', emoji: '🦇' },
    { type: 'pumpkin', className: 'decor-right', emoji: '🎃' },
    { type: 'moon', className: 'decor-moon', emoji: '🌙' },
  ]

  const confetti = Array.from({ length: 32 }, (_, index) => ({
    id: index,
    left: `${(index * 13) % 100}%`,
    delay: `${(index % 8) * 0.18}s`,
    duration: `${2.2 + (index % 5) * 0.5}s`,
    color: ['#ff8a00', '#ff3d00', '#ec4899', '#facc15', '#22c55e'][index % 5],
    size: `${8 + (index % 4) * 4}px`,
    rotate: `${index * 18}deg`,
  }))

  return (
    <main className={`app-shell ${screamActive ? 'is-screaming' : ''}`}>
      <video
        ref={videoRef}
        className="video-overlay"
        src="/halloween-bg.mp4"
        poster="/halloween-poster.jpg"
        muted
        loop
        autoPlay
        playsInline
      />
      <div className={`scream-background ${screamActive ? 'active' : ''}`} aria-hidden="true" />
      <div className="red-tint" aria-hidden="true" />
      <div className="night-sky" aria-hidden="true" />

      <div className="decorations" aria-hidden="true">
        {hangingDecor.map(({ type, className, emoji }) => (
          <div key={className} className={`hanging-decor ${type} ${className}`}>
            <span>{emoji}</span>
          </div>
        ))}
      </div>

      <div className={`screen-scream ${screamActive ? 'active' : ''}`}>
        <span>{screamText}</span>
      </div>

      <div className="skeleton-scene" aria-label="Talk to the skeleton">
        <button type="button" className="skeleton-button" onClick={triggerSkeleton}>
          <span className="skeleton-glow" aria-hidden="true" />
          <img
            src="/sceleton.jpg"
            alt="Halloween skeleton"
            className="skeleton-image"
          />
          <span className="button-label">PRESS TO KNOW</span>
        </button>
      </div>

      {showCelebration && (
        <div className="celebration-popup" role="alert" aria-live="polite">
          <div className="celebration-box">
            <p className="celebration-label">It&apos;s Halloween Time</p>
            <h2>Happy Halloween!</h2>
            <p>Trick or treat, spooky vibes, and monster energy all night long.</p>
          </div>

          {confetti.map((piece) => (
            <span
              key={piece.id}
              className="confetti"
              style={{
                left: piece.left,
                animationDelay: piece.delay,
                animationDuration: piece.duration,
                background: piece.color,
                width: piece.size,
                height: piece.size,
                transform: `rotate(${piece.rotate})`,
              }}
            />
          ))}
        </div>
      )}

      <section className="countdown-wrap">
        <div className="countdown-panel">
          <div className="heading-block">
            <p className="eyebrow">🎃 Spooky season</p>
            <h1>Halloween Countdown</h1>
            <p className="subtitle">
              The night of pumpkins, costumes, and candy is getting closer with every passing second.
            </p>
          </div>

          <div className="countdown-grid">
            {countdownItems.map(({ label, value }) => (
              <div key={label} className="count-card">
                <span className="count-value">{String(value).padStart(2, '0')}</span>
                <span className="count-label">{label}</span>
              </div>
            ))}
          </div>

          <div className="tag-row">
            <span>October 31</span>
            <span>Midnight magic</span>
          </div>
        </div>
      </section>
    </main>
  )
}

export default App
