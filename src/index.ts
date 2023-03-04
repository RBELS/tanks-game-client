import './index.scss'
import runProgram from './run-program'


export const canvas = document.getElementById('canvas_main') as HTMLCanvasElement
const gl = canvas.getContext('webgl')




if (gl) {
    console.log(window.innerWidth + '\t' + window.innerHeight)
    gl.canvas.width = window.innerWidth*2
    gl.canvas.height = window.innerHeight*2
    gl.viewport(0, 0, window.innerWidth, window.innerHeight)

    runProgram(gl)
}




