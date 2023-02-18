
import SockJS from 'sockjs-client'
import {CompatClient, Stomp} from '@stomp/stompjs'
import Controller from '../controller'
import {Player} from '../player'
import {Vector2} from '@math.gl/core'
import controller from '../controller'
import {GameState} from './api-types'

//@allow-js
const interceptEvent = (target: Window | Document, eventName: string, newHandler: (ev: Event) => void) => {
    //@ts-ignore
    const existingHandler = target[eventName]
    // @ts-ignore
    target[eventName] = function (ev) {
        existingHandler(ev)
        newHandler(ev)
    }
}


class WebsocketConnection {
    private socket: WebSocket
    private stompClient: CompatClient

    private _controller?: Controller // not sure if i need it here
    private player: Player

    constructor(player: Player) {
        this.player = player;
        this.socket = new SockJS('http://192.168.1.36:8080/registersocket')
        this.stompClient = Stomp.over(this.socket)

        this.stompClient.connect({}, () => {
            this.stompClient.subscribe('/topic/gamestate', (newstate) => {
                if (!this._controller) return
                const stateObj: GameState = JSON.parse(newstate.body)
                const curPlayerState = stateObj.players['rebel']


                //WILL BE SEPARATE METHOD
                this.player.pos = new Vector2(curPlayerState.pos[0], curPlayerState.pos[1])
                this.player.moveMultiplier = curPlayerState.moveMultiplier
                this.player.bodyAngle = curPlayerState.bodyAngle
                this.player.bodyRotateMultiplier = curPlayerState.bodyRotateMultiplier
                this._controller.lastUpdated = Date.now()
                //WILL BE SEPARATE METHOD
            })
        })
    }

    public sendState(keySet: Set<string>) {
        const keyArr = Array.from(keySet.keys())
        this.stompClient.send('/app/update', {}, JSON.stringify({
            name: 'rebel',
            input: keyArr
        }))
    }

    set controller(value: Controller) {
        this._controller = value
    }

}

export default WebsocketConnection