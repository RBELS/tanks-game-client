import {TAttributeLocations, TUniformLocations} from '../models/types';
import {Matrix4, radians, Vector2, Vector3, Vector4} from '@math.gl/core';


export class Player {
    private static readonly UP_VEC = new Vector3(0.0, 1.0, 0.0)

    private pos: Vector2
    private _bodyAngle: number
    private _config: PlayerConfig
    private gl: WebGLRenderingContext
    private aLocations: TAttributeLocations
    private uLocations: TUniformLocations

    private projectionMatrix: Matrix4

    constructor(gl: WebGLRenderingContext, uLocations: TUniformLocations, aLocations: TAttributeLocations,
                startPos: Vector2, startBodyAngle: number, playerConfig?: PlayerConfig)
    {
        this.aLocations = aLocations
        this.uLocations = uLocations
        this.pos = startPos
        this._bodyAngle = startBodyAngle
        this.gl = gl
        if (playerConfig) {
            this._config = playerConfig
        } else {
            this._config = new PlayerConfig()
        }
        this.projectionMatrix = this.updateProjectionMatrix()
    }



    public setMatrices() {
        const { gl } = this

        const modelMatrix = new Matrix4(Matrix4.IDENTITY)
        modelMatrix.translate(new Vector4(this.pos.x, this.pos.y, 0, 0))
        gl.uniformMatrix4fv(this.uLocations['model'], false, modelMatrix)

        const viewMatrix = new Matrix4().lookAt({
            eye: new Vector3(this.pos.x, this.pos.y, this.config.scale),
            center: new Vector3(this.pos.x, this.pos.y, 0),
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
        return this._bodyAngle;
    }

    set bodyAngle(value: number) {
        this._bodyAngle = value;
    }

    get config(): PlayerConfig {
        return this._config;
    }

    set config(value: PlayerConfig) {
        this._config = value;
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