import {Player} from './player'
import WebsocketConnection from './api'

class Controller {
    private static readonly ROTATE_SPEED = 80 // DEG/SEC
    private static readonly MOVEMENT_SPEED = 6 // UNITS/SEC
    private static readonly ALLOWED_KEYSET = new Set<string>(['w', 's', 'a', 'd'])

    private keySet: Set<string>
    private player: Player
    private connection: WebsocketConnection

    private lastUpdated?: number

    constructor(player: Player, connection: WebsocketConnection) {
        this.keySet = new Set<string>()
        this.player = player
        this.connection = connection
        this.prepareController()
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
        if (this.lastUpdated == undefined) this.lastUpdated = window.performance.now()

        const currentTime = window.performance.now()
        const deltaTime = currentTime - this.lastUpdated


        let rotation
        let totalAngle = 0
        if (this.keySet.has('a')) {
            if (!rotation) rotation = deltaTime * Controller.ROTATE_SPEED / 1000
            totalAngle += rotation
        }
        if (this.keySet.has('d')) {
            if (!rotation) rotation = deltaTime * Controller.ROTATE_SPEED / 1000
            totalAngle -= rotation
        }
        if (totalAngle != 0) this.player.bodyAngle += totalAngle


        let distance
        let totalDistance = 0

        if (this.keySet.has('w')) {
            if (!distance) distance = deltaTime * Controller.MOVEMENT_SPEED / 1000
            totalDistance += distance
        }
        if (this.keySet.has('s')) {
            if (!distance) distance = deltaTime * Controller.MOVEMENT_SPEED / 1000
            totalDistance -= distance
        }
        if (totalDistance != 0) this.player.move(totalDistance)


        this.lastUpdated = currentTime
    }
}



export default Controller