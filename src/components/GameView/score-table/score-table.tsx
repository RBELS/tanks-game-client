import React, {useState} from 'react'
import styles from './score-table.module.scss'
import {TScoreBoardEl} from '../../../controller/api/api-types'
import {restapi} from '../../../controller/api/restapi'
import {userConfig} from '../../../index'

export let updateScoreBoard: () => void

const ScoreTable: React.FC = () => {
    const [scoreboardItems, setScoreboardItems] = useState<TScoreBoardEl[]>()

    updateScoreBoard = async () => {
        const scoreBoard = await restapi.getScoreboard(userConfig.lobbyId)
        setScoreboardItems(scoreBoard)
    }

    return <div className={styles.scoreTableContainer}>
        <h2 className={styles.scoreTableHeading}>Scoreboard</h2>
        <ul className={styles.scoreTable}>
            {scoreboardItems?.map((el, index) => <li className={styles.scoreTableItem} key={index}>
                <span className={styles.scoreTableItemUser}>{index+1}. {el.name}</span>
                <span className={styles.scoreTableItemPoints}>{el.score}</span>
            </li>)}
        </ul>
    </div>
}

export default ScoreTable
