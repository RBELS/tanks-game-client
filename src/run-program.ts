//@ts-ignore
import vertCode from './static/shader-source/shader.v.glsl'
//@ts-ignore
import fragCode from './static/shader-source/shader.f.glsl'
import {Matrix4, radians, Vector2, Vector3} from '@math.gl/core'
import {GameMap} from './models/game-map'
import {TAttributeLocations, TUniformLocations} from './models/types'
import {Player} from './controller/player'
import Controller from './controller/controller'
import Background from './models/background/background'

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

const configAndGetAttribLocations = (gl: WebGLRenderingContext, shaderProgram: WebGLProgram): TAttributeLocations => {
    // gl.enable(gl.DEPTH_TEST)

    return {
        aPos: gl.getAttribLocation(shaderProgram, 'aPos'),
    }
}
const configAndGetUniformLocations = (gl: WebGLRenderingContext, shaderProgram: WebGLProgram): TUniformLocations => {
    return {
        model: gl.getUniformLocation(shaderProgram, 'model')!,
        view: gl.getUniformLocation(shaderProgram, 'view')!,
        projection: gl.getUniformLocation(shaderProgram, 'projection')!,
        u_Color: gl.getUniformLocation(shaderProgram, 'u_Color')!,
        playerPos: gl.getUniformLocation(shaderProgram, 'playerPos')!,
        drawMesh: gl.getUniformLocation(shaderProgram, 'drawMesh')!
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
    const map = new GameMap(gl);
    const controller = new Controller(player)
    player.setMatrices()
    const background = new Background(gl, uLocations, aLocations, player.matrices)

    const draw = (timestamp: number) => {
        gl.clearColor(98/255, 114/255, 164/255, 1)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

        background.setMatrices(player.pos)
        background.draw()

        player.setMatrices()
        player.draw()
        controller.update()

        window.requestAnimationFrame(draw);
    }

    window.requestAnimationFrame(draw)
}

export default runProgram