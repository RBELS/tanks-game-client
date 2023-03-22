import React from 'react'
import styles from './lobby-item.module.scss'

const LobbyItem: React.FC = () => {
    return <div className={styles.lobbyItemContainer}>
        <div className={styles.lobbyNameContainer}>
            The Best Lobby
        </div>

        <div className={styles.lobbyInfoContainer}>
            <span className={styles.leaderTyping}>
                <span className={styles.defaultText}>Leader:</span>
                <span className={styles.insertText}>Rebel</span>
            </span>
            <span className={styles.playersInfo}>
                <span className={styles.defaultText}>Players:</span>
                <span className={styles.insertText}>10/20</span>
            </span>
        </div>
    </div>
}

export default LobbyItem