import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'

const CHANNEL_NAME = 'scoreboard_channel'
const STORAGE_KEY = 'scoreboard_state'

export const initialState = {
  teamA: { name: 'Team A', score: 0, sets: 0, logo: '' },
  teamB: { name: 'Team B', score: 0, sets: 0, logo: '' },
  serve: 'A',
  timer: 0,
  timerRunning: false,
  carouselImages: [],
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      // Always start with timer paused on page load
      return { ...initialState, ...parsed, timerRunning: false }
    }
  } catch {
    // Ignore parse errors
  }
  return { ...initialState }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Ignore storage errors (e.g. quota exceeded with large images)
  }
}

const ScoreboardContext = createContext(null)

export function ScoreboardProvider({ children }) {
  const [state, setState] = useState(loadState)
  const channelRef = useRef(null)

  useEffect(() => {
    const channel = new BroadcastChannel(CHANNEL_NAME)
    channelRef.current = channel

    channel.onmessage = (event) => {
      if (event.data?.type === 'STATE_UPDATE') {
        setState(event.data.state)
        saveState(event.data.state)
      }
    }

    return () => {
      channel.close()
      channelRef.current = null
    }
  }, [])

  const updateState = useCallback((updater) => {
    setState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater }
      saveState(next)
      channelRef.current?.postMessage({ type: 'STATE_UPDATE', state: next })
      return next
    })
  }, [])

  return (
    <ScoreboardContext.Provider value={{ state, updateState }}>
      {children}
    </ScoreboardContext.Provider>
  )
}

export function useScoreboard() {
  const ctx = useContext(ScoreboardContext)
  if (!ctx) throw new Error('useScoreboard must be used inside ScoreboardProvider')
  return ctx
}
