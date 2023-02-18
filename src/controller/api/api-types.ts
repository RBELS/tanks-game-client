export type PlayerState = {
    pos: number[]
    bodyAngle: number
    bodyRotateMultiplier: number
    moveMultiplier: number
}

export type GameState = {
    serverTime: number
    players: {[key: string]: PlayerState}
}

