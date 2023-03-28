import SockJS from 'sockjs-client'
import {CompatClient, Stomp} from '@stomp/stompjs'
import Controller from '../controller'
import {Player} from '../player'
import {Vector2} from '@math.gl/core'
import {SERVER_SIGNAL, TGameState, TInverseMessage, TPlayerState} from './api-types'
import {GameMap} from '../../models/gamemap'
import {config} from "../../config";
import {HPBarDrawer} from "../../models/hpbar/HPBarDrawer";
import {restapi} from './restapi'
import {updateScoreBoard} from '../../components/GameView/score-table/score-table'
import {userConfig} from '../../index'


export let latency = 0

class WebsocketConnection {
    private readonly socket: WebSocket
    private stompClient: CompatClient

    private readonly _controller: Controller
    private readonly gameMap: GameMap
    private actingPlayer: Player
    private _allPlayers: Map<string, Player>
    private hpBarDrawer?: HPBarDrawer

    constructor(gameMap: GameMap) {
        this.gameMap = gameMap
        this.actingPlayer = gameMap.actingPlayer;
        this._allPlayers = gameMap.players
        this.socket = new SockJS(`${config.serverAddress}:8080/registersocket`)
        this._controller = new Controller(gameMap, this)
        this.stompClient = Stomp.over(this.socket)
        //@ts-ignore
        this.stompClient.debug = () => {}

        this.stompClient.connect({ username: userConfig.inUsername, lobbyId: userConfig.inLobbyId }, () => {
            console.log(this.stompClient.connectHeaders)
            this.stompClient.subscribe(`/topic/gamestate/${userConfig.inLobbyId}`, (newstate) => {
                if (!this._controller) return
                const stateObj: TGameState = JSON.parse(newstate.body)
                // this.gameMap.bullets = stateObj.bullets
                this.gameMap.bullets.splice(0, this.gameMap.bullets.length)
                this.gameMap.bullets.push(...stateObj.bullets)
                for (const somePlayerNickname in stateObj.players) {
                    let somePlayer = this._allPlayers.get(somePlayerNickname)
                    const somePlayerState = stateObj.players[somePlayerNickname]
                    if (!somePlayer) {
                        somePlayer = new Player(
                            this.actingPlayer.gl,
                            this.actingPlayer.uLocations,
                            this.actingPlayer.aLocations,
                            new Vector2(0, 0),
                            0,
                            somePlayerNickname,
                            this.actingPlayer.matrices
                        )
                        this._allPlayers.set(somePlayerNickname, somePlayer)
                    }
                    somePlayer.pos = new Vector2(somePlayerState.pos[0], somePlayerState.pos[1])
                    somePlayer.moveMultiplier = somePlayerState.moveMultiplier
                    somePlayer.bodyAngle = somePlayerState.bodyAngle
                    somePlayer.bodyRotateMultiplier = somePlayerState.bodyRotateMultiplier
                    somePlayer.tankTopAngle = somePlayerState.topRotateAngle
                    somePlayer.tankTopRotateMultiplier = somePlayerState.topRotateMultiplier
                    somePlayer.hp = somePlayerState.hp
                    somePlayer.maxHp = somePlayerState.maxHp
                }
                this._controller.lastUpdated = Date.now()
            })
            updateScoreBoard()
            this.stompClient.subscribe(`/topic/doUpdate/${userConfig.inLobbyId}`, (data) => {
                const recMessage: TInverseMessage = JSON.parse(data.body)
                switch (recMessage.type) {
                    case SERVER_SIGNAL.UPDATE_SCOREBOARD: {
                        updateScoreBoard()
                        break
                    }
                    default: {
                        console.log('Unrecognised message type found.')
                    }
                }
            })
        })
    }

    public sendPlayerPos(keySet: Set<string>) {
        const keyArr = Array.from(keySet.keys())
        this.stompClient.send('/app/updatePos', {}, JSON.stringify({
            name: this.actingPlayer.nickname,
            input: keyArr,
            lobbyId: userConfig.inLobbyId
        }))
    }

    public sendPlayerTopAngle(topAngle: number) {
        this.stompClient.send('/app/updateTopAngle', {}, JSON.stringify({
            name: this.actingPlayer.nickname,
            topAngle,
            lobbyId: userConfig.inLobbyId
        }))
    }

    public sendClick(on: boolean) {
        this.stompClient.send('/app/action', {}, JSON.stringify({
            name: this.actingPlayer.nickname,
            action: on ? 1 : -1,
            lobbyId: userConfig.inLobbyId
        }))
    }

    public updateWithPredictions(): void {
        this._controller.update()
    }


}

export default WebsocketConnection