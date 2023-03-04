import {TBulletState} from '../../controller/api/api-types'
import {TAttributeLocations, TMatrixBundle, TModelProps, TUniformLocations} from '../types'
import {Matrix4, toRadians, Vector4} from '@math.gl/core'
import {createTankBody} from '../tank/tank-body'

export class BulletDrawer {
    private static createBulletModel = (): TModelProps => {
        return {
            vertices: new Float32Array([
                -0.05,  0.1,
                 0.05,  0.1,
                 0.05, -0.1,
                -0.05, -0.1
            ]),
            index: new Int8Array([
                0, 1, 2,
                0, 2, 3
            ])
        }
    }


    private readonly matrices: TMatrixBundle
    private readonly gl: WebGLRenderingContext
    private readonly uLocations: TUniformLocations
    private readonly aLocations: TAttributeLocations
    private readonly arrBuffer: WebGLBuffer
    private readonly indexBuffer: WebGLBuffer
    private readonly vertCount: number

    constructor(gl: WebGLRenderingContext, matrices: TMatrixBundle, uLocations: TUniformLocations, aLocations: TAttributeLocations) {
        this.gl = gl
        this.matrices = matrices
        this.uLocations = uLocations
        this.aLocations = aLocations

        this.arrBuffer = gl.createBuffer()!
        this.indexBuffer = gl.createBuffer()!

        const bulletModel = BulletDrawer.createBulletModel()
        this.vertCount = bulletModel.index ? bulletModel.index.length : 0

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, bulletModel.index!, gl.STATIC_DRAW) //always exists for body
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)

        gl.bindBuffer(gl.ARRAY_BUFFER, this.arrBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, bulletModel.vertices, gl.STATIC_DRAW)
        gl.bindBuffer(gl.ARRAY_BUFFER, null)
    }

    public drawBullet(bullet: TBulletState) {
        const {gl} = this
        let modelMatrix = new Matrix4(Matrix4.IDENTITY)
        modelMatrix = modelMatrix.translate(new Vector4(bullet.pos[0], bullet.pos[1], 0, 0))
        modelMatrix = modelMatrix.rotateZ(bullet.rotateAngle)

        gl.uniformMatrix4fv(this.uLocations['model'], false, modelMatrix)

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.arrBuffer)
        gl.vertexAttribPointer(this.aLocations['aPos'], 2, gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray(this.aLocations['aPos'])
        gl.uniform4fv(this.uLocations['u_Color'], new Vector4(0.2, 1.0, 1.0, 1.0))
        gl.drawElements(gl.TRIANGLES, this.vertCount, gl.UNSIGNED_BYTE, 0)


        gl.uniformMatrix4fv(this.uLocations['model'], false, this.matrices.model!)
    }
}