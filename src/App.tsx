import React, {useEffect} from 'react'
import './index'
import {startApp} from './index'
import styles from './app.module.scss'

const App: React.FC = () => {
    useEffect(() => {
        startApp()
    }, [])
    return <>
        <canvas width={1400} height={700} id={'canvas_main'}></canvas>
        <div className={`score-table-container`}>
            <h2 className={'score-table-heading'}>Scoreboard</h2>
            <ul className={'score-table'} id={'score-table'}></ul>
        </div>
    </>
}

export default App
