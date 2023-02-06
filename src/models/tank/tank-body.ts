import {TAttributeLocations, TModelProps, TUniformLocations} from "../types";
import {Model} from "../Model";

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

export class TankBody extends Model{

    private readonly arrBuffer: WebGLBuffer
    private readonly indexBuffer: WebGLBuffer
    private readonly gl: WebGLRenderingContext
    private readonly aLocations: TAttributeLocations
    private readonly uLocatipns: TUniformLocations

    constructor(gl: WebGLRenderingContext, aLocations: TAttributeLocations, uLocations: TUniformLocations) {
        super();
        this.arrBuffer = gl.createBuffer()!
        this.indexBuffer = gl.createBuffer()!
        this.gl = gl
        this.aLocations = aLocations
        this.uLocatipns = uLocations

        const tankBody = createTankBody(1.0)

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, tankBody.index!, gl.STATIC_DRAW) //always exists for body
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)

        gl.bindBuffer(gl.ARRAY_BUFFER, this.arrBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, tankBody.vertices, gl.STATIC_DRAW)
        gl.bindBuffer(gl.ARRAY_BUFFER, null)

    }

    public draw(): void {
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer)

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.arrBuffer)
        this.gl.vertexAttribPointer(this.aLocations['aPos'], 3, this.gl.FLOAT, false, 0, 0)
        this.gl.enableVertexAttribArray(this.aLocations['aPos'])

        this.gl.drawElements(this.gl.TRIANGLES, 9, this.gl.UNSIGNED_BYTE, 0)

    }

}
