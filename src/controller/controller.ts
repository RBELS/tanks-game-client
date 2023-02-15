import {Player} from './player'
import WebsocketConnection from './api'

class Controller {
    private static readonly ROTATE_SPEED = 80 // DEG/SEC
    private static readonly MOVEMENT_SPEED = 6.0 // UNITS/SEC
    private static readonly ALLOWED_KEYSET = new Set<string>(['w', 's', 'a', 'd'])

    private keySet: Set<string>
    private player: Player
    private connection: WebsocketConnection

    private _lastUpdated?: number

    constructor(player: Player, connection: WebsocketConnection) {
        this.keySet = new Set<string>()
        this.player = player
        this.connection = connection
        this.prepareController()
    }


    get lastUpdated(): number {
        return this._lastUpdated!
    }

    set lastUpdated(value: number) {
        this._lastUpdated = value
    }

    private prepareController() {
        window.onload = (ev) => {
            document.onkeydown = (ev) => this.registerKeys(ev)
            document.onkeyup = (ev) => this.unregisterKeys(ev)
        }
    }

    private registerKeys(ev: KeyboardEvent) {
        if (Controller.ALLOWED_KEYSET.has(ev.key) && !this.keySet.has(ev.key)) {
            this.keySet.add(ev.key)
            this.connection.sendState(this.keySet)
        }
    }

    private unregisterKeys(ev: KeyboardEvent) {
        if (Controller.ALLOWED_KEYSET.has(ev.key)) {
            this.keySet.delete(ev.key)
            this.connection.sendState(this.keySet)
        }
    }

    public update() {
        if (this._lastUpdated == undefined) this._lastUpdated = window.performance.now()

        const currentTime = Date.now()//window.performance.now()
        const deltaTime = currentTime - this._lastUpdated

        const moveDistance = deltaTime*Controller.MOVEMENT_SPEED/1000
        this.player.move(moveDistance)

        this._lastUpdated = currentTime
    }
}



export default Controller