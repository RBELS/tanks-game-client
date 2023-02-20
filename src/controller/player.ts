import {TAttributeLocations, TMatrixBundle, TUniformLocations} from '../models/types'
import {Matrix4, radians, Vector2, Vector3, Vector4} from '@math.gl/core'
import {Model} from '../models/Model';
import {TankBody} from '../models/tank/tank-body';
import Vector from '@math.gl/core/dist/classes/base/vector'



export class Player extends Model{
    private static readonly UP_VEC = new Vector3(0.0, 1.0, 0.0)

    private _pos: Vector2
    private _bodyAngle?: number //made null because both value are used in setter
    private _bodyDir: Vector2 | null
    private _moveMultiplier: number
    private _bodyRotateMultiplier: number
    private _nickname: string

    private _gl: WebGLRenderingContext
    private readonly _aLocations: TAttributeLocations
    private readonly _uLocations: TUniformLocations

    private tankBody: TankBody
    private _matrices: TMatrixBundle

    private readonly isMainPlayer: boolean

    constructor(gl: WebGLRenderingContext, uLocations: TUniformLocations, aLocations: TAttributeLocations,
                startPos: Vector2, startBodyAngle: number, nickname: string, matrixBundle?: TMatrixBundle)
    {
        super();

        this._aLocations = aLocations
        this._uLocations = uLocations
        this._pos = new Vector2().copy(startPos)

        this._bodyDir = null
        this.bodyAngle = startBodyAngle// INVOKES SETTERS THAT UPDATES THE BODY DIR VECTOR

        this._gl = gl

        if (!matrixBundle) {
            this.isMainPlayer = true
            this._matrices = {}
            this._matrices.projection = this.updateProjectionMatrix()
        } else {
            this.isMainPlayer = false
            this._matrices = matrixBundle
        }

        this.tankBody = new TankBody(gl, aLocations, uLocations)
        this._moveMultiplier = 0
        this._bodyRotateMultiplier = 0
        this._nickname = nickname
    }



    public setMatrices() {
        const { _gl } = this

        const modelMatrix = new Matrix4(Matrix4.IDENTITY)
        this._matrices.model = modelMatrix

        modelMatrix.translate(new Vector4(this._pos.x, this._pos.y, 0, 0))
        modelMatrix.rotateZ(radians(this.bodyAngle))

        _gl.uniformMatrix4fv(this._uLocations['model'], false, modelMatrix)

        if (this.isMainPlayer) {
            const viewMatrix = new Matrix4().lookAt({
                eye: new Vector3(this._pos.x, this._pos.y, 10.0),
                center: new Vector3(this._pos.x, this._pos.y, 0),
                up: Player.UP_VEC
            })
            this._matrices.view = viewMatrix
            _gl.uniformMatrix4fv(this._uLocations['view'], false, viewMatrix)
        } else {
            _gl.uniformMatrix4fv(this._uLocations['view'], false, this._matrices.view!)
        }


        _gl.uniformMatrix4fv(this._uLocations['projection'], false, this._matrices.projection!)
        _gl.uniform1i(this._uLocations['drawMesh'], 0)
    }

    /*
    * Sets the projection matrix and returns it for convenience.
    */
    private updateProjectionMatrix(): Matrix4 {
        this._matrices.projection = new Matrix4().perspective({
            fovy: radians(60.0),
            aspect: this._gl.canvas.width/this._gl.canvas.height,
            near: 0.01,
            far: 100.0
        })
        return this._matrices.projection
    }

    get bodyAngle(): number {
        return this._bodyAngle!;
    }

    private updateBodyDirVec(): Vector2 {
        const bufVec3 = new Vector3().copy(Player.UP_VEC)
        bufVec3.rotateZ({
            radians: radians(this._bodyAngle!) //must not be null
        })
        this._bodyDir = new Vector2(bufVec3.x, bufVec3.y)
        return this._bodyDir
    }

    set bodyAngle(value: number) {
        this._bodyAngle = value;
        this.updateBodyDirVec()
    }

    get pos(): Vector2 {
        return this._pos
    }

    set pos(value: Vector2) {
        this._pos = value
    }

    draw(): void {
        this.tankBody.draw()
    }

    public move(distance: number) {
        if (!this._bodyDir) return

        this._pos.addScaledVector(this._bodyDir, distance*this._moveMultiplier)
    }

    public rotateBody(angle: number) {
        if (!this._bodyAngle) return
        this.bodyAngle = this.bodyAngle + angle * this._bodyRotateMultiplier
    }

    get moveMultiplier(): number {
        return this._moveMultiplier
    }

    set moveMultiplier(value: number) {
        this._moveMultiplier = value
    }

    get matrices(): TMatrixBundle {
        return this._matrices
    }


    get bodyDir(): Vector2 | null {
        return this._bodyDir
    }

    set bodyDir(value: Vector2 | null) {
        this._bodyDir = value
    }


    get bodyRotateMultiplier(): number {
        return this._bodyRotateMultiplier
    }

    set bodyRotateMultiplier(value: number) {
        this._bodyRotateMultiplier = value
    }


    get nickname(): string {
        return this._nickname
    }


    get gl(): WebGLRenderingContext {
        return this._gl
    }

    get aLocations(): TAttributeLocations {
        return this._aLocations
    }

    get uLocations(): TUniformLocations {
        return this._uLocations
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