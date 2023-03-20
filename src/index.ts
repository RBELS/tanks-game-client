import './index.scss'
import runProgram from './run-program'


export let canvas: HTMLCanvasElement
let gl: WebGLRenderingContext

export const startApp = () => {
    canvas = document.getElementById('canvas_main') as HTMLCanvasElement
    gl = canvas.getContext('webgl')!
    if (gl) {
        gl.canvas.width = window.innerWidth*2
        gl.canvas.height = window.innerHeight*2

        console.log(gl.canvas.width + '\t' + gl.canvas.height)

        runProgram(gl)
    }
}






