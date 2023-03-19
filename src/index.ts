import './index.scss'
import runProgram from './run-program'


export const canvas = document.getElementById('canvas_main') as HTMLCanvasElement
const gl = canvas.getContext('webgl')




if (gl) {
    gl.canvas.width = window.innerWidth*2
    gl.canvas.height = window.innerHeight*2

    console.log(gl.canvas.width + '\t' + gl.canvas.height)

    runProgram(gl)
}




