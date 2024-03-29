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
void drawMeshProc (void);

void main(void) {
    if (drawType == 1) {
        drawHP();
    } else if (drawType == 0) {
        if (drawMesh) {
            drawMeshProc();
        } else {
            gl_FragColor = u_Color;
        }
    }
}

vec4 pickHPColor(float health) {
    vec4 result = vec4(1.0, 1.0, 0.0, 1.0);
    if (health >= 0.5) {
        result.r = 1.0 - ((health - 0.5) / 0.5);
    } else {
        result.g = health / 0.5;
    }
    return result;
}

void drawHP (void) {
    float adaptedHpPerc = hpPerc * 2.0 - 1.0;

    if (pass_Pos.x < adaptedHpPerc) {
        gl_FragColor = pickHPColor(hpPerc);
    } else {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
    }
}

void drawMeshProc(void) {
    float period = 7.0;
    float width = 0.015;
    float modX = mod(pass_Pos.x, period);
    float modY = mod(pass_Pos.y, period);

    if (modX < (period-width) && modX > width && modY < (period-width) && modY > width) {
        gl_FragColor = u_Color;
    } else {
        gl_FragColor = vec4(1.0, 0.4745, 0.7765, 1.0);
    }

}