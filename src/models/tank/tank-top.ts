import {Model} from '../Model'
import {TAttributeLocations, TModelProps, TUniformLocations} from '../types'
import {Vector4} from '@math.gl/core'


export const createTankTop = (size: number): TModelProps => {
    const props: TModelProps = {
        vertices: new Float32Array([
            -0.2,  0.4,
             0.2,  0.4,
            -0.4,  0.2,
             0.4,  0.2,
            -0.4, -0.4,
             0.4, -0.4
        ]),
        index: new Int8Array([
            0, 1, 3,
            0, 2, 3,
            2, 4, 5,
            2, 3, 5
        ])
    }
    return props
}

export class TankTop extends Model {

    private readonly arrBuffer: WebGLBuffer
    private readonly indexBuffer: WebGLBuffer
    private readonly gl: WebGLRenderingContext
    private readonly aLocations: TAttributeLocations
    private readonly uLocations: TUniformLocations

    constructor(gl: WebGLRenderingContext, aLocations: TAttributeLocations, uLocations: TUniformLocations) {
        super();
        this.arrBuffer = gl.createBuffer()!
        this.indexBuffer = gl.createBuffer()!
        this.gl = gl
        this.aLocations = aLocations
        this.uLocations = uLocations

        const tankTop = createTankTop(1.0)

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, tankTop.index!, gl.STATIC_DRAW) //always exists for top
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)

        gl.bindBuffer(gl.ARRAY_BUFFER, this.arrBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, tankTop.vertices, gl.STATIC_DRAW)
        gl.bindBuffer(gl.ARRAY_BUFFER, null)
    }

    public draw(): void {
        const { gl } = this

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer)

        gl.bindBuffer(gl.ARRAY_BUFFER, this.arrBuffer)
        gl.vertexAttribPointer(this.aLocations['aPos'], 2, this.gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray(this.aLocations['aPos'])

        gl.uniform4fv(this.uLocations['u_Color'], new Vector4(0.2, 0.4, 1.0, 1.0))

        this.gl.drawElements(this.gl.TRIANGLES, 12, this.gl.UNSIGNED_BYTE, 0)
    }

    public setMatrices(): void {
    }

}
