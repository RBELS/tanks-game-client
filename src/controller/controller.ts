import {Player} from './player'
import WebsocketConnection, {latency} from './api/api'
import {canvas} from '../index'
import {toDegrees, Vector2, Vector3} from '@math.gl/core'

class Controller {
    private static readonly ROTATE_SPEED = 80 // DEG/SEC
    private static readonly TOP_ROTATE_SPEED = 160 // DEG/SEC
    public static MOVEMENT_SPEED = 6 // UNITS/SEC
    private static readonly ALLOWED_KEYSET = new Set<string>(['w', 's', 'a', 'd'])

    private keySet: Set<string>
    private player: Player
    private connection: WebsocketConnection
    private readonly mousePos: number[]

    private _lastUpdated?: number

    constructor(player: Player, connection: WebsocketConnection) {
        this.keySet = new Set<string>()
        this.player = player
        this.connection = connection
        this.mousePos = [0, 0]
        this.prepareController()
    }

    get lastUpdated(): number {
        return this._lastUpdated!
    }

    set lastUpdated(value: number) {
        this._lastUpdated = value
    }

    private prepareController() {
        console.log('window onload assigned')
        document.onkeydown = (ev) => this.registerKeys(ev)
        document.onkeyup = (ev) => this.unregisterKeys(ev)
        canvas.onmousemove = (ev) => this.updateMousePos(ev) // This canvas object is global
        setInterval(() => {
            // console.log(this.getTopAngle())
            this.connection.sendPlayerTopAngle(this.getTopAngle())
        }, 30)
    }

    private registerKeys(ev: KeyboardEvent) {
        if (Controller.ALLOWED_KEYSET.has(ev.key) && !this.keySet.has(ev.key)) {
            this.keySet.add(ev.key)
            this.connection.sendPlayerPos(this.keySet)
        }
    }

    private unregisterKeys(ev: KeyboardEvent) {
        if (Controller.ALLOWED_KEYSET.has(ev.key)) {
            this.keySet.delete(ev.key)
            this.connection.sendPlayerPos(this.keySet)
        }
    }

    private updateMousePos(ev: MouseEvent) {
        this.mousePos[0] = ev.x
        this.mousePos[1] = ev.y
    }

    public getTopAngle() {
        const centerPoint = new Vector3(canvas.width/2, canvas.height/2, 0)
        const mousePoint = new Vector3(this.mousePos[0], canvas.height-this.mousePos[1], 0)
        const dirVector = new Vector3().subVectors(mousePoint, centerPoint).normalize()

        let angle = Math.acos(dirVector.dot(Player.UP_VEC))
        if (dirVector.x >= 0)
            angle = 2*Math.PI - angle

        return toDegrees(angle)
    }

    public update() {
        if (this._lastUpdated == undefined) this._lastUpdated = Date.now()

        const currentTime = Date.now() + latency
        const deltaTime = currentTime - this._lastUpdated
        this._lastUpdated = currentTime

        const moveDistance = deltaTime*Controller.MOVEMENT_SPEED/1000
        this.player.move(moveDistance)

        this.player.rotateBody(deltaTime*Controller.ROTATE_SPEED/1000)
        this.player.rotateTop(deltaTime*Controller.TOP_ROTATE_SPEED/1000)
    }
}



export default Controller