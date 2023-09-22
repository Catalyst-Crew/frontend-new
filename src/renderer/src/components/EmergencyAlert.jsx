import { useSelector } from 'react-redux'
import React, { useEffect, useState } from 'react'
import { useGlobalAudioPlayer } from 'react-use-audio-player'

import { selectAlertSstate } from '../store/store'

import '../assets/css/emergency.css'
import audio from '../assets/audio.wav'

const EmergencyAlert = () => {
  const { load, pause, play } = useGlobalAudioPlayer()

  const [active, setActive] = useState(null)

  const alertsActive = useSelector(selectAlertSstate)

  useEffect(() => {
    load(audio, { loop: true, html5: true })
  }, [])

  useEffect(() => {
    if (alertsActive) {
      setActive('blinking-gradient-overlay')
      play()
    } else {
      setActive(null)
      pause()
    }
  }, [alertsActive])

  return <div className={active} />
}

export default EmergencyAlert
