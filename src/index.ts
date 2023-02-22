import './index.scss'
import runProgram from './run-program'


const canvas = document.getElementById('canvas_main') as HTMLCanvasElement
const gl = canvas.getContext('webgl')




if (gl) {
    console.log(window.innerWidth + '\t' + window.innerHeight)
    gl.canvas.width = window.innerWidth
    gl.canvas.height = window.innerHeight
    gl.viewport(0, 0, window.innerWidth, window.innerHeight)

    runProgram(gl)
}




