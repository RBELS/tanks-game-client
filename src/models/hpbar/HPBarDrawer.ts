import {TAttributeLocations, TMatrixBundle, TModelProps, TUniformLocations} from "../types";
import {Matrix4, Vector2, Vector3, Vector4} from "@math.gl/core";

export class HPBarDrawer {
    private static createHPBar = (): TModelProps => {
        return {
            vertices: new Float32Array([
                -1, 0.2,
                1, 0.2,
                1, -0.2,
                -1, -0.2
            ]),
            index: new Int8Array([
                0, 1, 2,
                0, 2, 3
            ])
        }
    }


    private _matrices?: TMatrixBundle
    private readonly gl: WebGLRenderingContext
    private readonly uLocations: TUniformLocations
    private readonly aLocations: TAttributeLocations
    private readonly arrBuffer: WebGLBuffer
    private readonly indexBuffer: WebGLBuffer
    private readonly vertCount: number

    constructor(gl: WebGLRenderingContext, uLocations: TUniformLocations, aLocations: TAttributeLocations) {
        this.gl = gl
        this.uLocations = uLocations
        this.aLocations = aLocations

        this.arrBuffer = gl.createBuffer()!
        this.indexBuffer = gl.createBuffer()!

        const bulletModel = HPBarDrawer.createHPBar()
        this.vertCount = bulletModel.index ? bulletModel.index.length : 0

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, bulletModel.index!, gl.STATIC_DRAW) //always exists for body
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)

        gl.bindBuffer(gl.ARRAY_BUFFER, this.arrBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, bulletModel.vertices, gl.STATIC_DRAW)
        gl.bindBuffer(gl.ARRAY_BUFFER, null)
    }


    set matrices(value: TMatrixBundle) {
        this._matrices = value;
    }

    public drawBar(playerPos: Vector2, hpPerc: number) {
        const {gl} = this

        gl.uniform1i(this.uLocations['drawType'], 1)
        gl.uniform1f(this.uLocations['hpPerc'], hpPerc)

        let modelMatrix = new Matrix4(Matrix4.IDENTITY)
        modelMatrix = modelMatrix.translate(new Vector4(playerPos[0], playerPos[1], 0, 0))
        modelMatrix = modelMatrix.translate(new Vector4(0.0, 1.2, 0.0, 0.0))

        gl.uniformMatrix4fv(this.uLocations['model'], false, modelMatrix)

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.arrBuffer)
        gl.vertexAttribPointer(this.aLocations['aPos'], 2, gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray(this.aLocations['aPos'])
        gl.uniform4fv(this.uLocations['u_Color'], new Vector4(0.0, 1.0, 0.0, 1.0))
        gl.drawElements(gl.TRIANGLES, this.vertCount, gl.UNSIGNED_BYTE, 0)


        gl.uniformMatrix4fv(this.uLocations['model'], false, this._matrices!.model!)

        gl.uniform1i(this.uLocations['drawType'], 0)
    }

}