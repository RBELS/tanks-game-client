import SockJS from 'sockjs-client'
import {CompatClient, Stomp} from '@stomp/stompjs'
import Controller from '../controller'
import {Player} from '../player'
import {Vector2} from '@math.gl/core'
import {SERVER_SIGNAL, TGameState, TInverseMessage, TPlayerState} from './api-types'
import {GameMap} from '../../models/gamemap'
import {config} from "../../config";
import {HPBarDrawer} from "../../models/hpbar/HPBarDrawer";
import {updateScoreBoard} from '../../components/GameView/score-table/score-table'
import {userConfig} from '../../index'
import {types} from 'sass'


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

        this.stompClient.connect({ ...userConfig }, () => {
            //@ts-ignore
            const url: string = this.socket._transport.url
            const urlPartArr = url.split('/')
            userConfig.playerId = urlPartArr[urlPartArr.length-2]

            this.stompClient.subscribe(`/topic/gamestate/${userConfig.lobbyId}`, (newstate) => {
                if (!this._controller) return
                const stateObj: TGameState = JSON.parse(newstate.body)
                // console.log(stateObj)
                this.gameMap.bullets.splice(0, this.gameMap.bullets.length)
                this.gameMap.bullets.push(...stateObj.bullets)

                const newPlayerMap: Map<string, Player> = new Map()
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
                    //add a player to the new map
                    //done to delete disconnected players from the game map
                    newPlayerMap.set(somePlayerNickname, somePlayer)
                }
                //update all players to filter disconnected players
                this.gameMap.players = newPlayerMap
                this._allPlayers = newPlayerMap
            })
            updateScoreBoard()
            this.stompClient.subscribe(`/topic/doUpdate/${userConfig.lobbyId}`, (data) => {
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
            // name: this.actingPlayer.nickname,
            playerId: userConfig.playerId,
            input: keyArr,
            lobbyId: userConfig.lobbyId
        }))
    }

    public sendPlayerTopAngle(topAngle: number) {
        this.stompClient.send('/app/updateTopAngle', {}, JSON.stringify({
            // name: this.actingPlayer.nickname,
            playerId: userConfig.playerId,
            topAngle,
            lobbyId: userConfig.lobbyId
        }))
    }

    public sendClick(on: boolean) {
        this.stompClient.send('/app/action', {}, JSON.stringify({
            // name: this.actingPlayer.nickname,
            playerId: userConfig.playerId,
            action: on ? 1 : -1,
            lobbyId: userConfig.lobbyId
        }))
    }

    public updateWithPredictions(): void {
        this._controller.update()
    }


}

export default WebsocketConnection