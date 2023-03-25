import React, {useEffect, useState} from 'react'
import './index'
import MainView from './components/MainView/main-view'
import GameView from './components/GameView/game-view'
import {startApp, TConfig} from './index'

const App: React.FC = () => {
    const [appStarted, setAppStarted] = useState(false)
    const [config, setConfig] = useState<TConfig>()

    useEffect(() => {
        if (config && !appStarted) {
            startApp(config),
            setAppStarted(true)
        }
    }, [config])

    return <>
        {config ? <GameView /> : <MainView startGame={(config: TConfig) => {setConfig(config)}} />}
    </>
}

export default App
