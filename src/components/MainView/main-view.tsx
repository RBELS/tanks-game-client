import React, {ReactEventHandler, useEffect, useState} from 'react'
import styles from './main-view.module.scss'
import LobbyItem from './LobbyItem/lobby-item'
import {restapi} from '../../controller/api/restapi'
import {TUserLobby} from '../../controller/api/api-types'
import {startApp, TConfig} from '../../index'

type TMainViewProps = {
    // startGame: (config: TConfig) => void
    startGame: typeof startApp
}

const MainView: React.FC<TMainViewProps> = ({ startGame }) => {
    const [username, setUsername] = useState('')
    const [lobbyName, setLobbyName] = useState('')

    const [availableLobbies, setAvailableLobbies] = useState<TUserLobby[]>()

    const onCreateLobbyBtClick: ReactEventHandler = async (ev) => {
        const userLobby = await restapi.createLobby(username, lobbyName)
        startGame({inLobbyId: userLobby.lobbyId, inUsername: username})
        console.log(JSON.stringify(userLobby))
    }

    useEffect(() => {
        restapi.getLobbies().then(data => setAvailableLobbies(data))
        setInterval(() => {
            restapi.getLobbies().then(data => setAvailableLobbies(data))
        }, 5000)
    }, [])

    return <>
        <div className={styles.mainScreenContainer}>
            <main className={styles.mainScreenMain}>
                <input value={username} placeholder={'username'} onChange={(e) => setUsername(e.target.value)} />
                <input value={lobbyName} placeholder={'lobbyName'} onChange={(e) => setLobbyName(e.target.value)}/>
                <button onClick={onCreateLobbyBtClick}>Create Lobby</button>
                <br />
            </main>
            <aside className={styles.lobbiesViewContainer}>
                <div className={styles.searchContainer}></div>
                <div className={styles.lobbiesListContainer}>
                    {availableLobbies?.map((el) => <LobbyItem startGame={startGame} {...el} key={el.lobbyId} />)}
                </div>
            </aside>
        </div>
    </>
}

export default MainView