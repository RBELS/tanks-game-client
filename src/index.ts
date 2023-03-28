import './index.scss'
import runProgram from './run-program'


export let canvas: HTMLCanvasElement
export let scoreBoardEl: HTMLUListElement
export let userConfig: TConfig
let gl: WebGLRenderingContext

export type TConfig = {
    lobbyId: string
    username?: string
    playerId?: string
}

export const startApp = (inConfig: TConfig) => {
    canvas = document.getElementById('canvas-main') as HTMLCanvasElement
    scoreBoardEl = document.getElementById('score-table') as HTMLUListElement
    gl = canvas.getContext('webgl')!
    userConfig = inConfig
    if (gl) {
        gl.canvas.width = window.innerWidth*2
        gl.canvas.height = window.innerHeight*2

        console.log(gl.canvas.width + '\t' + gl.canvas.height)

        runProgram(gl)
    }
}






