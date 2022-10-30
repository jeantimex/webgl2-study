interface WebGLSetupOptions {
  canvas: HTMLCanvasElement;
  vertexShaderSource: string;
  fragmentShaderSource: string;
  autoResize?: boolean;
  resizeCallback?: Function;
}

export function setUpWebGL(options: WebGLSetupOptions): WebGL2RenderingContext {
  const { canvas, vertexShaderSource, fragmentShaderSource, autoResize, resizeCallback } =
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

  gl.viewport(0, 0, canvas.width, canvas.height);

  if (autoResize) {
    const resizeObserver = new ResizeObserver(() => {
      canvas.width = Math.round(canvas.clientWidth);
      canvas.height = Math.round(canvas.clientHeight);
      gl.viewport(0, 0, canvas.width, canvas.height);
  
      if (resizeCallback) {
        resizeCallback(gl);
      }
    });
    resizeObserver.observe(canvas);
  }

  return gl;
}
