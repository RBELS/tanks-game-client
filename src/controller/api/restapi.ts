import Axios, {AxiosInstance} from 'axios'
import {TScoreBoardEl} from './api-types'
import {config} from '../../config'

export class Restapi {
    private instance: AxiosInstance
    private _lobbyId?: string

    constructor(baseURL: string) {
        this.instance = Axios.create({ baseURL, withCredentials: true })
    }

    public async login(username: string) {
        await this.instance.post('/login', { username, lobbyId: this._lobbyId })
    }

    public async createLobby() {
        this._lobbyId = await this.instance.post("/createLobby").then(res => res.data.lobbyId) //add type here
    }

    public async getScoreboard(): Promise<TScoreBoardEl[]> {
        return await this.instance.get(`/scoreboard/${this._lobbyId}`).then(res => res.data)
    }


    get lobbyId(): string {
        return this._lobbyId!
    }
}

export const restapi = new Restapi(`${config.serverAddress}:8080/`)