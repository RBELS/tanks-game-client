//@ts-ignore
import vertCode from './static/shader-source/shader.v.glsl'
//@ts-ignore
import fragCode from './static/shader-source/shader.f.glsl'

import {TAttributeLocations, TUniformLocations} from './models/types'
import Axios from 'axios'
import {GameMap} from './models/gamemap'
import {Vector2} from '@math.gl/core'

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
        drawMesh: gl.getUniformLocation(shaderProgram, 'drawMesh')!,
    }
}


export let nickname = ''


const runProgram = async (gl: WebGLRenderingContext) => {
    //api instance
    const api = Axios.create({ baseURL: 'http://localhost:8080/', withCredentials: true })//http://192.168.1.36:8080/

    gl.viewport(0,0,gl.canvas.width,gl.canvas.height)

    const vertShader = compileShaderShortcut(gl, vertCode, gl.VERTEX_SHADER)
    const fragShader = compileShaderShortcut(gl, fragCode, gl.FRAGMENT_SHADER)

    const shaderProgram = createShaderProgramShortcut(gl, [vertShader, fragShader])

    gl.useProgram(shaderProgram)

    const aLocations = configAndGetAttribLocations(gl, shaderProgram)
    const uLocations = configAndGetUniformLocations(gl, shaderProgram)

    nickname = prompt('Enter nickname:')!

    const userRegistered = await api.post('/login', { username: nickname })
    const gameMap = new GameMap(gl, nickname, uLocations, aLocations)


    const draw = (timestamp: number) => {
        gl.clearColor(98/255, 114/255, 164/255, 1)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

        gameMap.setMatrices()
        gameMap.draw()
        gameMap.updateWithPredictions()

        window.requestAnimationFrame(draw);
    }

    window.requestAnimationFrame(draw)
}

export default runProgram