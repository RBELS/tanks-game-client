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