import React, {ReactEventHandler} from 'react'
import styles from './main-view.module.scss'
import LobbyItem from './LobbyItem/lobby-item'

type TMainViewProps = {
    startGame: () => void
}

const MainView: React.FC<TMainViewProps> = ({ startGame }) => {
    const createLobbyClick: ReactEventHandler = (ev) => {

    }


    return <>
        <div className={styles.mainScreenContainer}>
            <main className={styles.mainScreenMain}>
                <button onClick={startGame}>Start Game</button>
            </main>
            <aside className={styles.lobbiesViewContainer}>
                <button onClick={createLobbyClick} className={styles.createLobbyBt}>Create Lobby</button>
                <div className={styles.searchContainer}>

                </div>
                <div className={styles.lobbiesListContainer}>
                    <LobbyItem />
                    <LobbyItem />
                    <LobbyItem />
                    <LobbyItem />
                    <LobbyItem />
                    <LobbyItem />
                    <LobbyItem />
                    <LobbyItem />
                </div>
            </aside>
        </div>
    </>
}

export default MainView