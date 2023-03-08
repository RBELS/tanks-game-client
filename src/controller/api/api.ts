import SockJS from 'sockjs-client'
import {CompatClient, Stomp} from '@stomp/stompjs'
import Controller from '../controller'
import {Player} from '../player'
import {Vector2} from '@math.gl/core'
import {TGameState, TPlayerState} from './api-types'
import {GameMap} from '../../models/gamemap'


const interceptEvent = (target: Window | Document, eventName: string, newHandler: (ev: Event) => void) => {
    //@ts-ignore
    const existingHandler = target[eventName]
    // @ts-ignore
    target[eventName] = function (ev) {
        existingHandler(ev)
        newHandler(ev)
    }
}

export let latency = 0

class WebsocketConnection {
    private readonly socket: WebSocket
    private stompClient: CompatClient

    private readonly _controller: Controller
    private readonly gameMap: GameMap
    private actingPlayer: Player
    private _allPlayers: Map<string, Player>

    constructor(gameMap: GameMap) {
        this.gameMap = gameMap
        this.actingPlayer = gameMap.actingPlayer;
        this._allPlayers = gameMap.players
        this.socket = new SockJS('http://localhost:8080/registersocket')//http://192.168.1.36:8080/registersocket
        this.stompClient = Stomp.over(this.socket)
        this._controller = new Controller(gameMap, this)
        //@ts-ignore
        this.stompClient.debug = () => {}

        this.stompClient.connect({}, () => {
            this.stompClient.subscribe('/topic/gamestate', (newstate) => {
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
                }
                this._controller.lastUpdated = Date.now()
            })
        })
    }

    public sendPlayerPos(keySet: Set<string>) {
        const keyArr = Array.from(keySet.keys())
        this.stompClient.send('/app/updatePos', {}, JSON.stringify({
            name: this.actingPlayer.nickname,
            input: keyArr
        }))
    }

    public sendPlayerTopAngle(topAngle: number) {
        this.stompClient.send('/app/updateTopAngle', {}, JSON.stringify({
            name: this.actingPlayer.nickname,
            topAngle
        }))
    }

    public sendClick(on: boolean) {
        this.stompClient.send('/app/action', {}, JSON.stringify({
            name: this.actingPlayer.nickname,
            action: on ? 1 : -1
        }))
    }


    public updateWithPredictions(): void {
        this._controller.update()
    }

}

export default WebsocketConnection