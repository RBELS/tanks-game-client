import './index.scss'
import runProgram from './run-program'

import { Matrix4, Vector3, radians } from '@math.gl/core'


const canvas = document.getElementById('canvas_main') as HTMLCanvasElement
const gl = canvas.getContext('webgl')

if (gl) {
    runProgram(gl)
}




