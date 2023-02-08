
import SockJS from 'sockjs-client'
import {CompatClient, Stomp} from '@stomp/stompjs'

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

    constructor() {
        this.socket = new SockJS('http://localhost:8080/registersocket')
        this.stompClient = Stomp.over(this.socket)

        this.stompClient.connect({}, () => {
            this.stompClient.subscribe('/topic/gamestate', function (newstate) {
                console.log(JSON.parse(newstate.body))
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
}

export default WebsocketConnection