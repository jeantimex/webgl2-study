import vertexShaderSource from "./glsl/vertex.vert";
import fragmentShaderSource from "./glsl/fragment.frag";
import {setUpWebGL} from '../common';

import "../common/style.scss";

const canvas = document.querySelector("canvas");
const gl = setUpWebGL({canvas, vertexShaderSource, fragmentShaderSource});

gl.drawArrays(gl.POINTS, 0, 1);
