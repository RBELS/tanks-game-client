import React from 'react'
import styles from './lobby-item.module.scss'
import {TUserLobby} from '../../../controller/api/api-types'
import {startApp, TConfig} from '../../../index'

type TLobbyItemProps = {
    startGame: (lobbyId: string) => void
} & TUserLobby

const LobbyItem: React.FC<TLobbyItemProps> = ({ startGame, lobbyId, playersCount, leader, lobbyName }) => {
    return <div onClick={startGame.bind(null, lobbyId)} className={styles.lobbyItemContainer}>
        <div className={styles.lobbyNameContainer}>{lobbyName}</div>

        <div className={styles.lobbyInfoContainer}>
            <span className={styles.leaderTyping}>
                <span className={styles.defaultText}>Leader:</span>
                <span className={styles.insertText}>{leader}</span>
            </span>
            <span className={styles.playersInfo}>
                <span className={styles.defaultText}>Players:</span>
                <span className={styles.insertText}>{playersCount}{/*/20*/}</span>
            </span>
        </div>
    </div>
}

export default LobbyItem