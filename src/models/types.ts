import {Matrix4} from '@math.gl/core'

export type TModelProps = {
    vertices: Float32Array
    index?: Int8Array
}

export type TUniformLocations = {
    [key: string]: WebGLUniformLocation
}
export type TAttributeLocations = {
    [key: string]: number
}
export type TMatrixBundle = {
    model?: Matrix4
    view?: Matrix4
    projection?: Matrix4
}