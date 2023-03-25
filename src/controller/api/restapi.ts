import Axios, {AxiosInstance} from 'axios'
import {TScoreBoardEl, TUserLobby} from './api-types'
import {config} from '../../config'

export class Restapi {
    private instance: AxiosInstance
    private _lobbyId: string

    constructor(baseURL: string) {
        this.instance = Axios.create({ baseURL, withCredentials: true })
        this._lobbyId = ''
    }

    public async login(username: string, lobbyId: string) {
        this._lobbyId = lobbyId
        await this.instance.post('/login', { username, lobbyId })
    }

    public async createLobby(leaderName: string, lobbyName: string): Promise<TUserLobby> {
        return await this.instance.post('/createLobby', { username: leaderName, lobbyName }).then(res => res.data) //add type here
    }

    public async getScoreboard(): Promise<TScoreBoardEl[]> {
        return await this.instance.get(`/scoreboard/${this._lobbyId}`).then(res => res.data)
    }

    public async getLobbies(): Promise<TUserLobby[]> {
        return await this.instance.get(`/lobbies`).then(res => res.data)
    }


    get lobbyId(): string {
        return this._lobbyId
    }
}

export const restapi = new Restapi(`${config.serverAddress}:8080/`)