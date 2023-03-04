import {Player} from '../controller/player'
import {TAttributeLocations, TUniformLocations} from './types'
import {toDegrees, Vector2} from '@math.gl/core'
import WebsocketConnection from '../controller/api/api'
import Background from './background/background'
import {Model} from './Model'
import {createSquare} from './square'
import {TBulletState} from '../controller/api/api-types'
import {BulletDrawer} from './bullet/BulletDrawer'

/**
 * Generates map of provided size.
 */
export const getMapArrBuffer = (size: number): Float32Array => {
    const square = createSquare()
    for (let i = 0;i < square.length;i++) {
        square[i] *= size
    }
    return square
}


export class GameMap extends Model {
    private gl: WebGLRenderingContext
    private readonly _actingPlayer: Player
    private uLocations: TUniformLocations
    private aLocations: TAttributeLocations

    private websocketConnection: WebsocketConnection
    private background: Background

    private readonly _players: Map<string, Player>
    private _bullets: TBulletState[]
    private bulletDrawer: BulletDrawer

    constructor(gl: WebGLRenderingContext, actingPlayerNickname: string, uLocations: TUniformLocations, aLocations: TAttributeLocations) {
        super()
        this.gl = gl
        this.uLocations = uLocations
        this.aLocations = aLocations

        this._actingPlayer = new Player(gl, uLocations, aLocations, new Vector2(0, 0), 0, actingPlayerNickname)
        this._players = new Map<string, Player>()
        this._players.set(actingPlayerNickname, this._actingPlayer)
        this._bullets = []
        this.bulletDrawer = new BulletDrawer(gl, this._actingPlayer.matrices, uLocations, aLocations)

        this.websocketConnection = new WebsocketConnection(this)

        this._actingPlayer.setMatrices()
        this.background = new Background(gl, uLocations, aLocations, this._actingPlayer)

    }


    public draw() {
        this.background.setMatrices()
        this.background.draw()
        console.log(this.bullets)
        for (const player of this._players.values()) {
            player.setMatrices()
            player.draw()
        }
        for (const bullet of this._bullets) {
            this.bulletDrawer.drawBullet(bullet)
        }
    }

    public setMatrices() {
    }

    public updateWithPredictions() {
        this.websocketConnection.updateWithPredictions()
    }

    get players(): Map<string, Player> {
        return this._players
    }

    get actingPlayer(): Player {
        return this._actingPlayer
    }

    get bullets(): TBulletState[] {
        return this._bullets
    }

    set bullets(value: TBulletState[]) {
        this._bullets = value
    }
}