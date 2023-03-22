import React, {useEffect, useState} from 'react'
import './index'
import MainView from './components/MainView/main-view'
import GameView from './components/GameView/game-view'
import {startApp} from './index'

const App: React.FC = () => {
    const [appStarted, setAppStarted] = useState(false)
    const [gameStarted, setGameStarted] = useState(false)

    useEffect(() => {
        if (gameStarted && !appStarted) {
            startApp()
            setAppStarted(true)
        }
    }, [gameStarted])

    return <>
        {gameStarted ? <GameView /> : <MainView startGame={() => setGameStarted(true)} />}
    </>
}

export default App
