import vertexShaderSource from "./glsl/vertex.vert";
import fragmentShaderSource from "./glsl/fragment.frag";
import {setUpWebGL} from '../common';

import "../common/style.scss";

const canvas = document.querySelector("canvas");

const drawCallback = (gl: WebGL2RenderingContext) => {
  gl.drawArrays(gl.POINTS, 0, 1);
}

setUpWebGL({canvas, vertexShaderSource, fragmentShaderSource, drawCallback});
