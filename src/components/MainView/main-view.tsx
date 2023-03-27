import React, {ReactEventHandler, useEffect, useState} from 'react'
import styles from './main-view.module.scss'
import LobbyItem from './LobbyItem/lobby-item'
import {restapi} from '../../controller/api/restapi'
import {TUserLobby} from '../../controller/api/api-types'
import {startApp, TConfig} from '../../index'

type TMainViewProps = {
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

    //need to add refresh button
    useEffect(() => {
        restapi.getLobbies().then(data => setAvailableLobbies(data))
        setInterval(() => {
            restapi.getLobbies().then(data => setAvailableLobbies(data))
        }, 5000)
    }, [])

    return <>
        <div className={styles.mainScreenContainer}>
            <main className={styles.mainScreenMain}>
                <div className={styles.dataContainer}>

                    <div className={styles.usernameInputContainer}>
                        <h2 className={styles.pageTextH2}>Enter a nickname for the player</h2>
                        <input value={username} placeholder={'Username'} onChange={(e) => setUsername(e.target.value)} />
                        <div className={styles.buttonLikeText}>...and simply select a lobby</div>
                    </div>

                    <hr className={styles.borderLine} />

                    <div className={styles.createLobbyContainer}>
                        <h2 className={styles.pageTextH2}>Create a new lobby</h2>
                        <input value={lobbyName} placeholder={'Lobby Name'} onChange={(e) => setLobbyName(e.target.value)}/>
                        <button onClick={onCreateLobbyBtClick}>Create Lobby</button>
                    </div>
                </div>
            </main>
            <aside className={styles.lobbiesViewContainer}>
                <div className={styles.searchContainer}></div>
                <div className={styles.lobbiesListContainer}>
                    {availableLobbies?.map((el) => <LobbyItem startGame={(lobbyId: string) => startGame({inLobbyId: lobbyId, inUsername: username})} {...el} key={el.lobbyId} />)}
                </div>
            </aside>
        </div>
    </>
}

export default MainView