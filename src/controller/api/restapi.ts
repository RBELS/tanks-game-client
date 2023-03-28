import Axios, {AxiosInstance} from 'axios'
import {TScoreBoardEl, TUserLobby} from './api-types'
import {config} from '../../config'

export class Restapi {
    private instance: AxiosInstance

    constructor(baseURL: string) {
        this.instance = Axios.create({ baseURL, withCredentials: true })
    }

    public async createLobby(leaderName: string, lobbyName: string): Promise<TUserLobby> {
        return await this.instance.post('/createLobby', { username: leaderName, lobbyName }).then(res => res.data) //add type here
    }

    public async getScoreboard(lobbyId: string): Promise<TScoreBoardEl[]> {
        return await this.instance.get(`/scoreboard/${lobbyId}`).then(res => res.data)
    }

    public async getLobbies(): Promise<TUserLobby[]> {
        return await this.instance.get(`/lobbies`).then(res => res.data)
    }

}

export const restapi = new Restapi(`${config.serverAddress}:8080/`)