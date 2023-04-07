import {Player} from './player'
import WebsocketConnection, {latency} from './api/api'
import {canvas} from '../index'
import {toDegrees, toRadians, Vector2, Vector3} from '@math.gl/core'
import {GameMap} from '../models/gamemap'
import {TBulletState} from "./api/api-types";

class Controller {
    public static readonly ROTATE_SPEED = 80 // DEG/SEC
    public static readonly TOP_ROTATE_SPEED = 160 // DEG/SEC
    public static MOVEMENT_SPEED = 6 // UNITS/SEC
    public static readonly ALLOWED_KEYSET = new Set<string>(['w', 's', 'a', 'd'])
    public static readonly BULLET_V = 20.0

    private keySet: Set<string>
    private player: Player
    private readonly bullets: TBulletState[]
    private connection: WebsocketConnection
    private readonly mousePos: number[]


    constructor(gamemap: GameMap, connection: WebsocketConnection) {
        this.keySet = new Set<string>()
        this.player = gamemap.actingPlayer
        this.connection = connection
        this.mousePos = [0, 0]
        this.bullets = gamemap.bullets
        this.prepareController()
    }

    private prepareController() {
        console.log('window onload assigned')
        document.onkeydown = (ev) => this.registerKeys(ev)
        document.onkeyup = (ev) => this.unregisterKeys(ev)
        document.onmousemove = (ev) => this.updateMousePos(ev) // This canvas object is global
        document.onmousedown = (ev) => this.registerClick(ev)
        document.onmouseup = (ev) => this.unregisterClick(ev)
        setInterval(() => {
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
        this.mousePos[0] = ev.x*2
        this.mousePos[1] = ev.y*2
    }

    private registerClick(ev: MouseEvent) {
        this.connection.sendClick(true)
    }

    private unregisterClick(ev: MouseEvent) {
        this.connection.sendClick(false)
    }

    public getTopAngle() {
        const centerPoint = new Vector3(canvas.width/2, canvas.height/2, 0)
        const mousePoint = new Vector3(this.mousePos[0], canvas.height-this.mousePos[1], 0)
        const dirVector = new Vector3().subVectors(mousePoint, centerPoint).normalize()

        let angle = Math.acos(dirVector.dot(Player.UP_VEC_3D))
        if (dirVector.x >= 0)
            angle = 2*Math.PI - angle

        return toDegrees(angle)
    }

    public update(deltaTime: number) {

        this.bullets.forEach(bullet => {
            if (!bullet.dir) {
                // console.log(bullet.rotateAngle)
                bullet.dir = new Vector3().copy(Player.UP_VEC_3D)
                    .rotateZ({ radians: toRadians(bullet.rotateAngle) })
                console.log(bullet.dir)
            }
            const posVec = new Vector3(bullet.pos[0], bullet.pos[1], 0)
                .add(bullet.dir.multiplyByScalar(deltaTime*Controller.BULLET_V))
            bullet.pos = [posVec.x, posVec.y]
        })
    }
}



export default Controller