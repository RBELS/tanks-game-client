import React from 'react'
import styles from './game-view.module.scss'


const GameView: React.FC = () => {
    return <>
        <canvas width={1400} height={700} id={'canvas-main'} className={styles.canvasMain}></canvas>
        <div className={styles.scoreTableContainer}>
            <h2 className={styles.scoreTableHeading}>Scoreboard</h2>
            <ul className={styles.scoreTable} id={'score-table'}></ul>
        </div>
    </>
}

export default GameView