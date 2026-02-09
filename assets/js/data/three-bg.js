
import * as THREE from 'https://esm.sh/three@0.178.0';

let scene, camera, renderer, material, clock;
let mousePosition = new THREE.Vector2(0.5, 0.5);
let targetMousePosition = new THREE.Vector2(0.5, 0.5);

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const devicePixelRatio = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);

function screenToWorld(normalizedX, normalizedY) {
  const uv_x = normalizedX * 2.0 - 1.0;
  const uv_y = normalizedY * 2.0 - 1.0;
  const aspect = window.innerWidth / window.innerHeight;
  return new THREE.Vector3(uv_x * aspect * 2.0, uv_y * 2.0, 0.0);
}

function init() {
  const container = document.getElementById("container");
  if (!container) return;

  scene = new THREE.Scene();
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  camera.position.z = 1;
  clock = new THREE.Clock();

  renderer = new THREE.WebGLRenderer({
    antialias: !isMobile,
    alpha: true,
    powerPreference: "high-performance",
  });

  renderer.setPixelRatio(devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uActualResolution: { value: new THREE.Vector2(window.innerWidth * devicePixelRatio, window.innerHeight * devicePixelRatio) },
      uCursorSphere: { value: new THREE.Vector3(0, 0, 0) },
      uCursorRadius: { value: 0.12 },
      uSphereCount: { value: isMobile ? 4 : 8 },
      uSmoothness: { value: 0.6 },
      uBackgroundColor: { value: new THREE.Color(0x0a0a15) },
      uSphereColor: { value: new THREE.Color(0x050510) },
      uLightColor: { value: new THREE.Color(0xccaaff) },
      uLightPosition: { value: new THREE.Vector3(0.9, 0.9, 1.2) },
      uCursorGlowColor: { value: new THREE.Color(0xaa77ff) }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;
      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec2 uActualResolution;
      uniform vec3 uCursorSphere;
      uniform float uCursorRadius;
      uniform int uSphereCount;
      uniform float uSmoothness;
      uniform vec3 uBackgroundColor;
      uniform vec3 uSphereColor;
      uniform vec3 uLightColor;
      uniform vec3 uLightPosition;
      uniform vec3 uCursorGlowColor;
      varying vec2 vUv;

      float smin(float a, float b, float k) {
        float h = max(k - abs(a - b), 0.0) / k;
        return min(a, b) - h * h * k * 0.25;
      }

      float sdSphere(vec3 p, float r) { return length(p) - r; }

      float sceneSDF(vec3 pos) {
        float res = 100.0;
        float t = uTime * 0.5;
        
        // Static background metaballs
        res = smin(res, sdSphere(pos - vec3(-1.8, 1.5, 0), 1.0), 0.7);
        res = smin(res, sdSphere(pos - vec3(1.8, -1.5, 0), 1.2), 0.7);
        
        for (int i = 0; i < 10; i++) {
          if (i >= uSphereCount) break;
          float fi = float(i);
          float speed = 0.3 + fi * 0.1;
          vec3 offset = vec3(
            sin(t * speed + fi) * 1.5,
            cos(t * speed * 0.8 + fi * 1.3) * 1.0,
            sin(t * speed * 0.5 + fi) * 0.3
          );
          res = smin(res, sdSphere(pos - offset, 0.12 + mod(fi, 3.0)*0.08), 0.6);
        }
        
        res = smin(res, sdSphere(pos - uCursorSphere, uCursorRadius), uSmoothness);
        return res;
      }

      vec3 calcNormal(vec3 p) {
        float e = 0.001;
        return normalize(vec3(
          sceneSDF(p + vec3(e,0,0)) - sceneSDF(p - vec3(e,0,0)),
          sceneSDF(p + vec3(0,e,0)) - sceneSDF(p - vec3(0,e,0)),
          sceneSDF(p + vec3(0,0,e)) - sceneSDF(p - vec3(0,0,e))
        ));
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy * 2.0 - uActualResolution.xy) / uActualResolution.xy;
        uv.x *= uResolution.x / uResolution.y;
        
        vec3 ro = vec3(uv * 2.0, -2.0);
        vec3 rd = vec3(0.0, 0.0, 1.0);
        
        float t = 0.0;
        for(int i=0; i<48; i++) {
            float d = sceneSDF(ro + rd * t);
            if(d < 0.001) break;
            if(t > 10.0) break;
            t += d * 0.8;
        }

        vec3 color = vec3(0.0);
        float distToCursor = length(uv * 2.0 - uCursorSphere.xy);
        float glow = exp(-distToCursor * 1.3);

        if(t < 10.0) {
            vec3 p = ro + rd * t;
            vec3 n = calcNormal(p);
            float diff = max(dot(n, normalize(uLightPosition)), 0.0);
            float fres = pow(1.0 - max(dot(-rd, n), 0.0), 3.0);
            color = uSphereColor + uLightColor * diff + fres * 0.5;
            color *= (1.0 - exp(-t * 0.5));
        } else {
            color = uBackgroundColor + uCursorGlowColor * glow * 0.25;
        }
        
        gl_FragColor = vec4(pow(color, vec3(0.9)), 1.0);
      }
    `
  });

  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  scene.add(mesh);

  window.addEventListener("mousemove", (e) => {
    targetMousePosition.set(e.clientX / window.innerWidth, 1.0 - e.clientY / window.innerHeight);
  });
  
  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    material.uniforms.uActualResolution.value.set(window.innerWidth * devicePixelRatio, window.innerHeight * devicePixelRatio);
  });
}

function animate() {
  requestAnimationFrame(animate);
  if(!material) return;
  
  mousePosition.x += (targetMousePosition.x - mousePosition.x) * 0.1;
  mousePosition.y += (targetMousePosition.y - mousePosition.y) * 0.1;
  
  const worldPos = screenToWorld(mousePosition.x, mousePosition.y);
  material.uniforms.uTime.value = clock.getElapsedTime();
  material.uniforms.uCursorSphere.value.copy(worldPos);
  
  renderer.render(scene, camera);
}

init();
animate();
