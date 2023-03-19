import {Vector2, Vector3} from "@math.gl/core";

export type TPlayerState = {
    pos: number[]
    bodyAngle: number
    bodyRotateMultiplier: number
    moveMultiplier: number
    topRotateAngle: number
    topRotateMultiplier: number
    hp: number
    maxHp: number
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

export type TScoreBoardEl = {
    name: string
    score: number
}

export type TInverseMessage = {
    type: string
}

export const SERVER_SIGNAL = {
    UPDATE_SCOREBOARD: 'UPDATE_SCOREBOARD' as const,
    UPDATE_HP: 'UPDATE_HP' as const,
}