import {Player} from '../controller/player'
import {TAttributeLocations, TUniformLocations} from './types'
import {Vector2} from '@math.gl/core'
import WebsocketConnection from '../controller/api/api'
import Background from './background/background'
import {Model} from './Model'
import {createSquare} from './square'

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
    private actingPlayer: Player
    private uLocations: TUniformLocations
    private aLocations: TAttributeLocations

    private websocketConnection: WebsocketConnection
    private background: Background

    private players: Map<string, Player>

    constructor(gl: WebGLRenderingContext, actingPlayerNickname: string, uLocations: TUniformLocations, aLocations: TAttributeLocations) {
        super()
        this.gl = gl
        this.uLocations = uLocations
        this.aLocations = aLocations

        this.actingPlayer = new Player(gl, uLocations, aLocations, new Vector2(0, 0), 0, actingPlayerNickname)
        this.players = new Map<string, Player>()
        this.players.set(actingPlayerNickname, this.actingPlayer)

        this.websocketConnection = new WebsocketConnection(this.actingPlayer, this.players)

        this.actingPlayer.setMatrices()
        this.background = new Background(gl, uLocations, aLocations, this.actingPlayer)

    }


    public draw() {
        this.background.setMatrices()
        this.background.draw()

        for (const player of this.players.values()) {
            player.setMatrices()
            player.draw()
        }
    }

    public setMatrices() {
    }

    public updateWithPredictions() {
        this.websocketConnection.updateWithPredictions()
    }
}