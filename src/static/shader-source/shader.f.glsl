precision mediump float;

uniform vec4    u_Color;
uniform vec2    playerPos;
uniform bool    drawMesh;

void main() {
//    if (drawMesh) {
//        float pixelX = (gl_FragCoord.x) + playerPos.x*65.9; //magic number
//        float pixelY = (gl_FragCoord.y) + playerPos.y*65.9; //magic number
//
//        const float cellSize = 150.0, halfCellSize = cellSize / 2.0;
//        const float lineHalfLen = 30.0;
//
//        float modX = mod(pixelX, cellSize);
//        float modY = mod(pixelY, cellSize);
//
//        float thickness = 3.0;
//
//        if ((modX <= thickness && (abs(modY-halfCellSize) <= lineHalfLen))
//            || (modY <= thickness && (abs(modX-halfCellSize) <= lineHalfLen))) { //can change comparison signs to get different results
//            gl_FragColor = vec4(1.0, 0.4745, 0.77647, 1.0);
//        } else {
//            gl_FragColor = u_Color;
//        }
//    } else {
//        gl_FragColor = u_Color;
//    }
    gl_FragColor = u_Color;
}