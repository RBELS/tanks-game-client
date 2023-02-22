import SockJS from 'sockjs-client'
import {CompatClient, Stomp} from '@stomp/stompjs'
import Controller from '../controller'
import {Player} from '../player'
import {Vector2} from '@math.gl/core'
import {GameState, PlayerState} from './api-types'


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
let sumDistance = 0
let count = 0

class WebsocketConnection {
    private socket: WebSocket
    private stompClient: CompatClient

    private _controller: Controller
    private actingPlayer: Player
    private allPlayers: Map<string, Player>

    constructor(actingPlayer: Player, allPlayers: Map<string, Player>) {
        this.actingPlayer = actingPlayer;
        this.allPlayers = allPlayers
        this.socket = new SockJS('http://192.168.1.36:8080/registersocket')
        this.stompClient = Stomp.over(this.socket)
        this._controller = new Controller(actingPlayer, this)
        //@ts-ignore
        this.stompClient.debug = () => {}

        this.stompClient.connect({}, () => {
            this.stompClient.subscribe('/topic/gamestate', (newstate) => {
                if (!this._controller) return
                const stateObj: GameState = JSON.parse(newstate.body)

                // latency = 14.6

                for (const somePlayerNickname in stateObj.players) {
                    let somePlayer = this.allPlayers.get(somePlayerNickname)
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
                        this.allPlayers.set(somePlayerNickname, somePlayer)
                    }
                    somePlayer.pos = new Vector2(somePlayerState.pos[0], somePlayerState.pos[1])
                    somePlayer.moveMultiplier = somePlayerState.moveMultiplier
                    somePlayer.bodyAngle = somePlayerState.bodyAngle
                    somePlayer.bodyRotateMultiplier = somePlayerState.bodyRotateMultiplier
                }
                this._controller.lastUpdated = Date.now()
            })
        })
    }

    public sendState(keySet: Set<string>) {
        const keyArr = Array.from(keySet.keys())
        this.stompClient.send('/app/update', {}, JSON.stringify({
            name: this.actingPlayer.nickname,
            input: keyArr
        }))
    }

    public updateWithPredictions(): void {
        this._controller.update()
    }

}

export default WebsocketConnection