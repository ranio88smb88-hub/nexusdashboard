
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Background: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let scene: THREE.Scene, camera: THREE.OrthographicCamera, renderer: THREE.WebGLRenderer, material: THREE.ShaderMaterial;
    let clock: THREE.Clock;
    let targetMousePosition = new THREE.Vector2(0.5, 0.5);
    let mousePosition = new THREE.Vector2(0.5, 0.5);

    // Enhanced device detection
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const devicePixelRatio = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);

    const init = () => {
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
      containerRef.current?.appendChild(renderer.domElement);

      material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
          uActualResolution: { value: new THREE.Vector2(window.innerWidth * devicePixelRatio, window.innerHeight * devicePixelRatio) },
          uMousePosition: { value: new THREE.Vector2(0.5, 0.5) },
          uCursorSphere: { value: new THREE.Vector3(0, 0, 0) },
          uCursorRadius: { value: 0.12 },
          uSphereCount: { value: isMobile ? 4 : 7 },
          uSmoothness: { value: 0.6 },
          uAmbientIntensity: { value: 0.12 },
          uDiffuseIntensity: { value: 1.2 },
          uSpecularIntensity: { value: 2.5 },
          uSpecularPower: { value: 3.0 },
          uFresnelPower: { value: 0.8 },
          uBackgroundColor: { value: new THREE.Color(0x0a0a15) },
          uSphereColor: { value: new THREE.Color(0x050510) },
          uLightColor: { value: new THREE.Color(0xccaaff) },
          uLightPosition: { value: new THREE.Vector3(0.9, 0.9, 1.2) },
          uContrast: { value: 1.6 },
          uFogDensity: { value: 0.06 },
          uCursorGlowIntensity: { value: 1.2 },
          uCursorGlowRadius: { value: 2.2 },
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
          uniform vec2 uMousePosition;
          uniform vec3 uCursorSphere;
          uniform float uCursorRadius;
          uniform int uSphereCount;
          uniform float uSmoothness;
          uniform float uAmbientIntensity;
          uniform float uDiffuseIntensity;
          uniform float uSpecularIntensity;
          uniform float uSpecularPower;
          uniform float uFresnelPower;
          uniform vec3 uBackgroundColor;
          uniform vec3 uSphereColor;
          uniform vec3 uLightColor;
          uniform vec3 uLightPosition;
          uniform float uContrast;
          uniform float uFogDensity;
          uniform float uCursorGlowIntensity;
          uniform float uCursorGlowRadius;
          uniform vec3 uCursorGlowColor;
          
          varying vec2 vUv;
          
          const float PI = 3.14159265359;
          const float EPSILON = 0.001;
          const float MAX_DIST = 100.0;
          
          float smin(float a, float b, float k) {
            float h = max(k - abs(a - b), 0.0) / k;
            return min(a, b) - h * h * k * 0.25;
          }
          
          float sdSphere(vec3 p, float r) {
            return length(p) - r;
          }
          
          vec3 screenToWorld(vec2 normalizedPos) {
            vec2 uv = normalizedPos * 2.0 - 1.0;
            uv.x *= uResolution.x / uResolution.y;
            return vec3(uv * 2.0, 0.0);
          }
          
          float sceneSDF(vec3 pos) {
            float result = MAX_DIST;
            
            // Fixed corners
            vec3 topLeftPos = screenToWorld(vec2(0.08, 0.92));
            float topLeft = sdSphere(pos - topLeftPos, 0.8);
            
            vec3 bottomRightPos = screenToWorld(vec2(0.92, 0.08));
            float bottomRight = sdSphere(pos - bottomRightPos, 0.9);
            
            float t = uTime * 0.6;
            
            for (int i = 0; i < 10; i++) {
              if (i >= uSphereCount) break;
              
              float fi = float(i);
              float speed = 0.4 + fi * 0.12;
              float radius = 0.15 + mod(fi, 3.0) * 0.1;
              float orbitRadius = (0.5 + mod(fi, 3.0) * 0.2);
              
              vec3 offset = vec3(
                sin(t * speed + fi) * orbitRadius * 1.5,
                cos(t * speed * 0.8 + fi * 1.3) * orbitRadius,
                sin(t * speed * 0.5 + fi) * 0.5
              );
              
              float movingSphere = sdSphere(pos - offset, radius);
              result = smin(result, movingSphere, 0.6);
            }
            
            float cursorBall = sdSphere(pos - uCursorSphere, uCursorRadius);
            
            result = smin(result, topLeft, 0.4);
            result = smin(result, bottomRight, 0.4);
            result = smin(result, cursorBall, uSmoothness);
            
            return result;
          }
          
          vec3 calcNormal(vec3 p) {
            float eps = 0.001;
            return normalize(vec3(
              sceneSDF(p + vec3(eps, 0, 0)) - sceneSDF(p - vec3(eps, 0, 0)),
              sceneSDF(p + vec3(0, eps, 0)) - sceneSDF(p - vec3(0, eps, 0)),
              sceneSDF(p + vec3(0, 0, eps)) - sceneSDF(p - vec3(0, 0, eps))
            ));
          }
          
          float ambientOcclusion(vec3 p, vec3 n) {
            float occ = 0.0;
            float weight = 1.0;
            for (int i = 0; i < 6; i++) {
              float dist = 0.01 + 0.015 * float(i * i);
              float h = sceneSDF(p + n * dist);
              occ += (dist - h) * weight;
              weight *= 0.85;
            }
            return clamp(1.0 - occ, 0.0, 1.0);
          }
          
          float rayMarch(vec3 ro, vec3 rd) {
            float t = 0.0;
            for (int i = 0; i < 64; i++) {
              vec3 p = ro + rd * t;
              float d = sceneSDF(p);
              if (d < EPSILON) return t;
              if (t > 10.0) break;
              t += d * 0.8;
            }
            return -1.0;
          }
          
          void main() {
            vec2 uv = (gl_FragCoord.xy * 2.0 - uActualResolution.xy) / uActualResolution.xy;
            uv.x *= uResolution.x / uResolution.y;
            
            vec3 ro = vec3(uv * 2.0, -2.0);
            vec3 rd = vec3(0.0, 0.0, 1.0);
            
            float t = rayMarch(ro, rd);
            vec3 color = vec3(0.0);
            
            // Cursor Glow calculation
            float distToCursor = length(uv * 2.0 - uCursorSphere.xy);
            float glow = exp(-distToCursor * 1.5) * uCursorGlowIntensity;
            vec3 glowColor = uCursorGlowColor * glow * 0.4;

            if (t > 0.0) {
              vec3 p = ro + rd * t;
              vec3 n = calcNormal(p);
              vec3 viewDir = -rd;
              vec3 lightDir = normalize(uLightPosition);
              
              float ao = ambientOcclusion(p, n);
              float diff = max(dot(n, lightDir), 0.0);
              
              float fresnel = pow(1.0 - max(dot(viewDir, n), 0.0), uFresnelPower);
              vec3 reflectDir = reflect(-lightDir, n);
              float spec = pow(max(dot(viewDir, reflectDir), 0.0), uSpecularPower * 10.0);
              
              color = uSphereColor + uLightColor * diff * uDiffuseIntensity;
              color += uLightColor * spec * uSpecularIntensity * fresnel;
              color += uLightColor * fresnel * 0.5;
              color *= ao;
              
              float fog = 1.0 - exp(-t * uFogDensity);
              color = mix(color, uBackgroundColor, fog);
            } else {
              color = glowColor;
            }
            
            color = pow(color, vec3(uContrast * 0.5));
            gl_FragColor = vec4(color, 1.0);
          }
        `
      });

      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
      scene.add(mesh);
    };

    const animate = () => {
      requestAnimationFrame(animate);
      
      mousePosition.x += (targetMousePosition.x - mousePosition.x) * 0.1;
      mousePosition.y += (targetMousePosition.y - mousePosition.y) * 0.1;

      const aspect = window.innerWidth / window.innerHeight;
      const worldX = (mousePosition.x * 2.0 - 1.0) * aspect * 2.0;
      const worldY = (mousePosition.y * 2.0 - 1.0) * 2.0;
      
      material.uniforms.uTime.value = clock.getElapsedTime();
      material.uniforms.uMousePosition.value = mousePosition;
      material.uniforms.uCursorSphere.value.set(worldX, worldY, 0);
      
      renderer.render(scene, camera);
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMousePosition.set(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight);
    };

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      material.uniforms.uResolution.value.set(width, height);
      material.uniforms.uActualResolution.value.set(width * devicePixelRatio, height * devicePixelRatio);
    };

    init();
    animate();

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 z-0 bg-black" />;
};

export default Background;
