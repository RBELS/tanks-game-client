precision mediump float;

uniform vec4    u_Color;

void main() {
//    gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
    gl_FragColor = u_Color;
}