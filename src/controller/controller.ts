import {Player} from './player'

class Controller {
    private static readonly ROTATE_SPEED = 80 // DEG/SEC
    private static readonly MOVEMENT_SPEED = 6 // UNITS/SEC

    private keySet: Set<string>
    private player: Player

    private lastUpdated?: number

    constructor(player: Player) {
        this.keySet = new Set<string>()
        this.player = player
        this.prepareController()
    }

    private prepareController() {
        window.onload = (ev) => {
            document.onkeydown = (ev) => this.registerKeys(ev)
            document.onkeyup = (ev) => this.unregisterKeys(ev)
        }
    }

    private registerKeys(ev: KeyboardEvent) {
        this.keySet.add(ev.key)
        console.log(this.keySet)
    }

    private unregisterKeys(ev: KeyboardEvent) {
        this.keySet.delete(ev.key)
        console.log(this.keySet)
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