import React from 'react'
import styles from './game-view.module.scss'
import ScoreTable from './score-table/score-table'


const GameView: React.FC = () => {
    return <>
        <canvas width={1400} height={700} id={'canvas-main'} className={styles.canvasMain}></canvas>
        <ScoreTable />
    </>
}

export default GameView