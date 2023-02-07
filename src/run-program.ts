//@ts-ignore
import vertCode from './static/shader-source/shader.v.glsl'
//@ts-ignore
import fragCode from './static/shader-source/shader.f.glsl'
import {Matrix4, radians, Vector2, Vector3, Vector4} from '@math.gl/core'
import {GameMap} from './models/game-map'
import {TAttributeLocations, TUniformLocations} from './models/types'
import {TankBody} from './models/tank/tank-body'
import {Model} from './models/Model'
import {Player} from './controller/player';

const compileShaderShortcut = (gl: WebGLRenderingContext, shaderSource: string, shaderType: number): WebGLShader => {
    const shader = gl.createShader(shaderType)!
    gl.shaderSource(shader, shaderSource)
    gl.compileShader(shader)
    return shader
}
const createShaderProgramShortcut = (gl: WebGLRenderingContext, shaders: WebGLShader[]): WebGLProgram => {
    const shaderProgram = gl.createProgram()!
    for (const shader of shaders) {
        gl.attachShader(shaderProgram, shader)
    }
    gl.linkProgram(shaderProgram)
    return shaderProgram
}
const createArrayBufferShortcut = (gl: WebGLRenderingContext, arrBuffer: Float32Array): WebGLBuffer => {
    const glBuffer = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, glBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, arrBuffer, gl.STATIC_DRAW)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)
    return glBuffer
}
const configAndGetAttribLocations = (gl: WebGLRenderingContext, shaderProgram: WebGLProgram): TAttributeLocations => {
    gl.enable(gl.DEPTH_TEST)

    return {
        aPos: gl.getAttribLocation(shaderProgram, 'aPos'),
    }
}
const configAndGetUniformLocations = (gl: WebGLRenderingContext, shaderProgram: WebGLProgram): TUniformLocations => {
    return {
        model: gl.getUniformLocation(shaderProgram, 'model')!,
        view: gl.getUniformLocation(shaderProgram, 'view')!,
        projection: gl.getUniformLocation(shaderProgram, 'projection')!,
        u_Color: gl.getUniformLocation(shaderProgram, 'u_Color')!
    }
}






const runProgram = (gl: WebGLRenderingContext) => {
    gl.viewport(0,0,gl.canvas.width,gl.canvas.height)

    const vertShader = compileShaderShortcut(gl, vertCode, gl.VERTEX_SHADER)
    const fragShader = compileShaderShortcut(gl, fragCode, gl.FRAGMENT_SHADER)

    const shaderProgram = createShaderProgramShortcut(gl, [vertShader, fragShader])

    gl.useProgram(shaderProgram)

    const aLocations = configAndGetAttribLocations(gl, shaderProgram)
    const uLocations = configAndGetUniformLocations(gl, shaderProgram)

    const player = new Player(gl, uLocations, aLocations, new Vector2(0, 0), 0)
    player.setMatrices()


    const map = new GameMap(gl);
    const tankBody = new TankBody(gl, aLocations, uLocations)

    const draw = (timestamp: number) => {
        gl.clearColor(0, 0, 0, 1)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

        gl.uniform4fv(uLocations['u_Color'], new Vector4(0.2, 1.0, 1.0, 1.0))//move to tank body
        tankBody.draw()

        window.requestAnimationFrame(draw);
    }

    window.requestAnimationFrame(draw)
}

export default runProgram