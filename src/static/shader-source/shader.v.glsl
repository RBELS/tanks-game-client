attribute vec2 aPos;

uniform     mat4    model;
uniform     mat4    view;
uniform     mat4    projection;
uniform vec4    u_Color;

void main(void) {
    gl_Position = projection * view * model * vec4(aPos, 0.0, 1.0);
}