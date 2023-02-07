import {TAttributeLocations, TUniformLocations} from '../models/types';
import {Matrix4, radians, Vector2, Vector3, Vector4} from '@math.gl/core'
import {Model} from '../models/Model';
import {TankBody} from '../models/tank/tank-body';
import Vector from '@math.gl/core/dist/classes/base/vector'



export class Player extends Model{
    private static readonly UP_VEC = new Vector3(0.0, 1.0, 0.0)

    private pos: Vector2
    private _bodyAngle?: number //made null because both value are used in setter
    private bodyDir: Vector2 | null

    private _config: PlayerConfig
    private gl: WebGLRenderingContext
    private readonly aLocations: TAttributeLocations
    private readonly uLocations: TUniformLocations

    private projectionMatrix: Matrix4

    private tankBody: TankBody

    constructor(gl: WebGLRenderingContext, uLocations: TUniformLocations, aLocations: TAttributeLocations,
                startPos: Vector2, startBodyAngle: number, playerConfig?: PlayerConfig)
    {
        super();

        this.aLocations = aLocations
        this.uLocations = uLocations
        this.pos = new Vector2().copy(startPos)

        this.bodyDir = null
        this.bodyAngle = startBodyAngle// INVOKES SETTERS THAT UPDATES THE BODY DIR VECTOR

        this.gl = gl
        if (playerConfig) {
            this._config = playerConfig
        } else {
            this._config = new PlayerConfig()
        }
        this.projectionMatrix = this.updateProjectionMatrix()

        this.tankBody = new TankBody(gl, aLocations, uLocations)
    }



    public setMatrices() {
        const { gl } = this

        const modelMatrix = new Matrix4(Matrix4.IDENTITY)

        modelMatrix.translate(new Vector4(this.pos.x, this.pos.y, 0, 0))
        modelMatrix.rotateZ(radians(this.bodyAngle))

        gl.uniformMatrix4fv(this.uLocations['model'], false, modelMatrix)

        const viewMatrix = new Matrix4().lookAt({
            eye: new Vector3(0, 0, this.config.scale), //debug
            center: new Vector3(0, 0, 0),           //debug
            // eye: new Vector3(this.pos.x, this.pos.y, this.config.scale),
            // center: new Vector3(this.pos.x, this.pox.y, 0),
            up: Player.UP_VEC
        })
        gl.uniformMatrix4fv(this.uLocations['view'], false, viewMatrix)
        gl.uniformMatrix4fv(this.uLocations['projection'], false, this.projectionMatrix)
    }

    /*
    * Sets the projection matrix and returns it for convenience.
    */
    private updateProjectionMatrix(): Matrix4 {
        this.projectionMatrix = new Matrix4().perspective({
            fovy: radians(60.0),
            aspect: this.gl.canvas.width/this.gl.canvas.height,
            near: 0.01,
            far: 100.0
        })
        return this.projectionMatrix
    }

    get bodyAngle(): number {
        return this._bodyAngle!;
    }

    private updateBodyDirVec(): Vector2 {
        const bufVec3 = new Vector3().copy(Player.UP_VEC)
        bufVec3.rotateZ({
            radians: radians(this._bodyAngle!) //must not be null
        })
        this.bodyDir = new Vector2(bufVec3.x, bufVec3.y)
        return this.bodyDir
    }

    set bodyAngle(value: number) {
        this._bodyAngle = value;
        this.updateBodyDirVec()
    }

    get config(): PlayerConfig {
        return this._config;
    }

    set config(value: PlayerConfig) {
        this._config = value;
    }

    draw(): void {
        this.tankBody.draw()
    }

    public move(distance: number) {
        if (!this.bodyDir) return
        this.pos.addScaledVector(this.bodyDir, distance)
    }
}




export class PlayerConfig {
    private _scale: number
    constructor() {
        this._scale = 10
    }


    get scale(): number {
        return this._scale;
    }

    set scale(value: number) {
        this._scale = value;
    }
}