import Axios, {AxiosInstance} from 'axios'
import {TScoreBoardEl} from "./api-types";
import {config} from "../../config";

export class Restapi {
    private instance: AxiosInstance
    constructor(baseURL: string) {
        this.instance = Axios.create({ baseURL, withCredentials: true })
    }

    public async login(username: string) {
        await this.instance.post('/login', { username })
    }

    public async getScoreboard(): Promise<TScoreBoardEl[]> {
        return await this.instance.get('/scoreboard').then(res => res.data)
    }
}

export const restapi = new Restapi(`${config.serverAddress}:8080/`)