precision mediump float;

uniform vec4    u_Color;
uniform vec2    playerPos;
uniform bool    drawMesh;

uniform int     drawType;
varying vec2    pass_Pos;

uniform float   hpPerc;
//0 solid
//1 hp

void drawHP (void);

void main(void) {
    if (drawType == 1) {
        drawHP();
    } else if (drawType == 0) {
        gl_FragColor = u_Color;
    }
}

void drawHP (void) {
    float adaptedHpPerc = hpPerc * 2.0 - 1.0;

    if (pass_Pos.x < adaptedHpPerc) {
        gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
    } else {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
    }
}