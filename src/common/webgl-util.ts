interface WebGLSetupOptions {
  canvas: HTMLCanvasElement;
  vertexShaderSource: string;
  fragmentShaderSource: string;
  width?: string;
  height?: string;
  draw: (gl: WebGL2RenderingContext) => void;
}

/**
 * Adjusts the canvas drawing buffer based on its client size.
 *
 * @param {WebGL2RenderingContext} gl
 * @param {string} width
 * @param {string} height
 */
function resizeCanvasSize(
  gl: WebGL2RenderingContext,
  width: string,
  height: string
) {
  const canvas = gl.canvas;

  canvas.style.width = width;
  canvas.style.height = height;

  // Lookup the size the browser is displaying the canvas in CSS pixels.
  const dpr = window.devicePixelRatio || 1;
  const displayWidth = Math.round(canvas.clientWidth * dpr);
  const displayHeight = Math.round(canvas.clientHeight * dpr);

  // Check if the canvas is not the same size.
  const needResize =
    canvas.width !== displayWidth || canvas.height !== displayHeight;

  if (needResize) {
    canvas.width = displayWidth;
    canvas.height = displayHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
}

export function setUpWebGL(options: WebGLSetupOptions) {
  const {
    canvas,
    vertexShaderSource,
    fragmentShaderSource,
    width = "300px",
    height = "150px",
    draw,
  } = options;
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
    console.error(gl.getShaderInfoLog(vertexShader));
    console.error(gl.getShaderInfoLog(fragmentShader));
  }

  gl.useProgram(program);

  const resizeObserver = new ResizeObserver(() => {
    resizeCanvasSize(gl, width, height);
    draw(gl);
  });
  resizeObserver.observe(canvas);

  const drawCallback = () => {
    draw(gl);
    requestAnimationFrame(drawCallback);
  }
  requestAnimationFrame(drawCallback);
}
