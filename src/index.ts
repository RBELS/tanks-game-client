import './index.scss'
import runProgram from './run-program'


const canvas = document.getElementById('canvas_main') as HTMLCanvasElement
const gl = canvas.getContext('webgl')

if (gl) {
    runProgram(gl)
}




