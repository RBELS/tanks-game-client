import {Model} from '../Model'
import {TAttributeLocations, TMatrixBundle, TUniformLocations} from '../types'
import {Matrix4, radians, Vector2, Vector3, Vector4} from '@math.gl/core'
import {Player} from '../../controller/player'
import {getMapArrBuffer} from '../gamemap'



class Background extends Model {
    private readonly gl: WebGLRenderingContext
    private readonly uLocations: TUniformLocations
    private readonly aLocations: TAttributeLocations
    private readonly arrBuffer: WebGLBuffer
    private matrices: TMatrixBundle
    private readonly playerMatrixBundle: TMatrixBundle
    private readonly player: Player

    constructor(gl: WebGLRenderingContext, uLocations: TUniformLocations, aLocations: TAttributeLocations,
    player: Player)
    {
        super()
        this.gl = gl
        this.uLocations = uLocations
        this.aLocations = aLocations

        this.player = player
        this.playerMatrixBundle = player.matrices
        const vertices = getMapArrBuffer(50.0)
        this.arrBuffer = gl.createBuffer()!
        gl.bindBuffer(gl.ARRAY_BUFFER, this.arrBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
        gl.bindBuffer(gl.ARRAY_BUFFER, null)

        this.matrices = {}
    }


    public setMatrices() {
        const { gl } = this

        const modelMatrix = new Matrix4(Matrix4.IDENTITY)
        gl.uniformMatrix4fv(this.uLocations['model'], false, modelMatrix)

        const viewMatrix = this.playerMatrixBundle.view!
        gl.uniformMatrix4fv(this.uLocations['view'], false, viewMatrix)

        const projectionMatrix = this.playerMatrixBundle.projection!
        gl.uniformMatrix4fv(this.uLocations['projection'], false, projectionMatrix)


        gl.uniform2fv(this.uLocations['playerPos'], this.player.pos)
    }

    public draw(): void {
        const { gl } = this

        gl.uniform1i(this.uLocations['drawMesh'], 1) //not 0 stands for true; 0 stands for false

        gl.bindBuffer(this.gl.ARRAY_BUFFER, this.arrBuffer)
        gl.vertexAttribPointer(this.aLocations['aPos'], 2, this.gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray(this.aLocations['aPos'])

        gl.uniform4fv(this.uLocations['u_Color'], new Vector4(40/255, 42/255, 54/255, 1))

        gl.drawArrays(this.gl.TRIANGLES, 0, 6);

        gl.uniform1i(this.uLocations['drawMesh'], 0)
    }


}

export default Background