import {Vector2, Vector3} from "@math.gl/core";

export type TPlayerState = {
    pos: number[]
    bodyAngle: number
    bodyRotateMultiplier: number
    moveMultiplier: number
    topRotateAngle: number
    topRotateMultiplier: number
}

export type TBulletState = {
    pos: number[]
    rotateAngle: number
    dir?: Vector3
}

export type TGameState = {
    serverTime: number
    players: {[key: string]: TPlayerState}
    bullets: TBulletState[]
}

