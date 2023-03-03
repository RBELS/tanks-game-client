import {TAttributeLocations, TMatrixBundle, TModelProps, TUniformLocations} from "../types"
import {Model} from "../Model";
import {Matrix4, toRadians, Vector4} from '@math.gl/core'

export const createTankBody = (size: number): TModelProps => {
    const props: TModelProps = {
        vertices: new Float32Array([
             0.0,  1.0,
            -0.6,  0.4,
            -0.6, -1.0,
             0.6, -1.0,
             0.6,  0.4
        ]),
        index: new Int8Array([
            0, 1, 4,
            1, 3, 4,
            1, 2, 3
        ])
    }
    return props
}

export class TankBody extends Model {

    private readonly arrBuffer: WebGLBuffer
    private readonly indexBuffer: WebGLBuffer
    private readonly gl: WebGLRenderingContext
    private readonly aLocations: TAttributeLocations
    private readonly uLocations: TUniformLocations

    private readonly matrices: TMatrixBundle
    private _rotateAngle: number

    constructor(gl: WebGLRenderingContext, aLocations: TAttributeLocations, uLocations: TUniformLocations, matrices: TMatrixBundle) {
        super();
        this.arrBuffer = gl.createBuffer()!
        this.indexBuffer = gl.createBuffer()!
        this.gl = gl
        this.aLocations = aLocations
        this.uLocations = uLocations
        this._rotateAngle = 0
        this.matrices = matrices

        const tankBody = createTankBody(1.0)

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, tankBody.index!, gl.STATIC_DRAW) //always exists for body
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)

        gl.bindBuffer(gl.ARRAY_BUFFER, this.arrBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, tankBody.vertices, gl.STATIC_DRAW)
        gl.bindBuffer(gl.ARRAY_BUFFER, null)

    }

    public draw(): void {
        const {gl} = this
        let newMatrix = new Matrix4().copy(this.matrices.model!)
        newMatrix = newMatrix.rotateZ(toRadians((this._rotateAngle)))
        gl.uniformMatrix4fv(this.uLocations['model'], false, newMatrix)

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.arrBuffer)
        gl.vertexAttribPointer(this.aLocations['aPos'], 2, gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray(this.aLocations['aPos'])
        gl.uniform4fv(this.uLocations['u_Color'], new Vector4(0.2, 1.0, 1.0, 1.0))
        gl.drawElements(gl.TRIANGLES, 9, gl.UNSIGNED_BYTE, 0)

        gl.uniformMatrix4fv(this.uLocations['model'], false, this.matrices.model!)
    }

    public setMatrices(): void {
    }


    get rotateAngle(): number {
        return this._rotateAngle
    }

    set rotateAngle(value: number) {
        this._rotateAngle = value
    }
}
