interface WebGLSetupOptions {
  canvas: HTMLCanvasElement;
  vertexShaderSource: string;
  fragmentShaderSource: string;
  drawCallback: Function;
}

export function setUpWebGL(options: WebGLSetupOptions) {
  const { canvas, vertexShaderSource, fragmentShaderSource, drawCallback } =
    options;
  const gl = canvas.getContext("webgl2");
  const program = gl.createProgram();

  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertexShaderSource);
  gl.compileShader(vertexShader);
  gl.attachShader(program, vertexShader);

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragmentShaderSource);
  gl.compileShader(fragmentShader);
  gl.attachShader(program, fragmentShader);

  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.log(gl.getShaderInfoLog(vertexShader));
    console.log(gl.getShaderInfoLog(fragmentShader));
  }

  gl.useProgram(program);

  const resizeObserver = new ResizeObserver(() => {
    canvas.width = Math.round(canvas.clientWidth * devicePixelRatio);
    canvas.height = Math.round(canvas.clientHeight * devicePixelRatio);
    gl.viewport(0, 0, canvas.width, canvas.height);
  });
  resizeObserver.observe(canvas);

  const draw = () => {
    drawCallback(gl);
    requestAnimationFrame(draw);
  };

  requestAnimationFrame(draw);
}
