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
}

export type TGameState = {
    serverTime: number
    players: {[key: string]: TPlayerState}
    bullets: TBulletState[]
}

