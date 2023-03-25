import React, {useState} from 'react'
import styles from './score-table.module.scss'
import {TScoreBoardEl} from '../../../controller/api/api-types'
import {restapi} from '../../../controller/api/restapi'

export let updateScoreBoard: () => void


// const createScoreTableItem = (el: TScoreBoardEl, index: number): string => {
//     return `<li class="score-table-item">
//         <span class="score-table-item-user">${index+1}. ${el.name}</span>
//         <span class="score-table-item-points">${el.score}</span>
//     </li>`
// }


const ScoreTable: React.FC = () => {
    const [scoreboardItems, setScoreboardItems] = useState<TScoreBoardEl[]>()

    updateScoreBoard = async () => {
        const scoreBoard = await restapi.getScoreboard()
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
