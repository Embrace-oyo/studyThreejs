<!--
justThreeJs paper1.vue
@author kongjianqiu
@description
@created 2024/1/23 15:58:22
-->
<template>
  <div class="paper"></div>
</template>

<script setup>
import paper_1_vertex from '@/glsl/paper1/paper_1_vertex.glsl'
import paper_1_frag from '@/glsl/paper1/paper_1_frag.glsl'
import {nextTick} from "vue";

const createShader = (gl, type, source) => {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }
  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}
const createProgram = (gl, vertexShader, fragmentShader) => {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }
  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

const resizeCanvasToDisplaySize = (canvas, multiplier) => {
  multiplier = multiplier || 1;
  const width = canvas.clientWidth * multiplier | 0;
  const height = canvas.clientHeight * multiplier | 0;
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    return true;
  }
  return false;
}

const creatMatrix = (gl, program) => {
  const matrixLocation = gl.getUniformLocation(program, "u_matrix");
  const translation = [200, 150];
  const angleInRadians = 0;
  const scale = [1, 1];
  let matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
  matrix = m3.translate(matrix, translation[0], translation[1]);
  matrix = m3.rotate(matrix, angleInRadians);
  matrix = m3.scale(matrix, scale[0], scale[1]);
  gl.uniformMatrix3fv(matrixLocation, false, matrix);
}

const setGeometry = (gl) => {
  gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -150, -100,
        150, -100,
        -150, 100,
        150, -100,
        -150, 100,
        150, 100]),
      gl.STATIC_DRAW);
}
const setColors = (gl) => {
  // 生成两个随机颜色
  const r1 = Math.random();
  const b1 = Math.random();
  const g1 = Math.random();

  const r2 = Math.random();
  const b2 = Math.random();
  const g2 = Math.random();

  gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(
          [ Math.random(), Math.random(), Math.random(), 1,
            Math.random(), Math.random(), Math.random(), 1,
            Math.random(), Math.random(), Math.random(), 1,
            Math.random(), Math.random(), Math.random(), 1,
            Math.random(), Math.random(), Math.random(), 1,
            Math.random(), Math.random(), Math.random(), 1]),
      gl.STATIC_DRAW);
}

const main = () => {
  const parent = document.querySelector('.paper');
  const canvas = document.createElement('canvas');
  parent.appendChild(canvas)
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.id = 'webgl'
  const gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }
  resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  const vertexShaderSource = paper_1_vertex;
  const fragmentShaderSource = paper_1_frag;
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
  const program = createProgram(gl, vertexShader, fragmentShader);
  gl.useProgram(program);
  creatMatrix(gl, program);
  const size = 2;          // 2 components per iteration
  const type = gl.FLOAT;   // the data is 32bit floats
  const normalize = false; // don't normalize the data
  const stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
  const offset = 0;
  const positionLocation = gl.getAttribLocation(program, "a_position");
  const positionBuffer = gl.createBuffer();
  gl.enableVertexAttribArray(positionLocation)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);
  setGeometry(gl)

  const colorLocation = gl.getAttribLocation(program, "a_color");
  const colorBuffer = gl.createBuffer();
  gl.enableVertexAttribArray(colorLocation)
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
  gl.vertexAttribPointer(colorLocation, 4, type, normalize, stride, offset);
  setColors(gl)

  const primitiveType = gl.TRIANGLES;
  const count = 6;
  gl.drawArrays(primitiveType, offset, count);


}

nextTick(() => {
  const script = document.createElement('script')
  script.src = 'https://webglfundamentals.org/webgl/resources/m3.js';
  document.body.appendChild(script)
  script.addEventListener('load', () => {
    main()
  })
})

</script>

<style scoped lang="less">
.paper {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  overflow: hidden;
}
</style>
