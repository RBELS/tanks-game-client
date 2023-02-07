import {createSquare} from "./square";
import {Vector4} from "@math.gl/core";

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

export class GameMap {
    private mapArrBuffer: Float32Array
    private _color = new Vector4(0.5, 0.5, 0.5, 1.0)
    private gl: WebGLRenderingContext

    constructor(gl: WebGLRenderingContext) {
        this.mapArrBuffer = getMapArrBuffer(50.0)
        this.gl = gl
    }

    public glDrawMap(colorUniformLocation: WebGLUniformLocation | null) {
        this.gl.uniform4fv(colorUniformLocation, this.color)
        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.mapArrBuffer.length/3)
    }


    get color(): Vector4 {
        return this._color;
    }
}