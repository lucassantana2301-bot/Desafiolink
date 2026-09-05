# THREE_SYSTEM.md - Cenas 3D, WebGL e Post-Processing

## 🧊 ESTRUTURA DO ECOSSISTEMA THREE.JS / R3F

A camada 3D é construída sobre React Three Fiber (R3F) e `@react-three/drei`, estruturada de forma modular em `src/components/three/` e `src/scenes/`.

```text
src/components/three/
├── SceneCanvas.tsx          # Reusable Canvas wrapper com Suspense, Preload & EffectComposer
├── CameraRig.tsx            # Rig de câmera responsivo a scroll + mouse parallax sutil
├── MetallicHeroObject.tsx   # Objeto 3D procedural com materiais metálicos PBR e animação
├── IndustrialEnvironment.tsx# Configuração de iluminação industrial, studio lights & HDRI
└── ParticlesMetal.tsx       # Sistema de partículas (faíscas metálicas e fumaça)
```

---

## 💡 ILUMINAÇÃO INDUSTRIAL & MATERIAIS

### 1. PBR Metalness Setup
- `roughness`: `0.15 - 0.35` (Superfície levemente escovada)
- `metalness`: `0.95 - 1.0` (Aço industrial puro)
- `clearcoat`: `0.3`
- `clearcoatRoughness`: `0.1`

### 2. Studio Lighting Rig
- **Key Light:** Key light frontal dramática fria (`#E6F0FF`, intensidade: 3.5).
- **Rim Light (Contraluz Industrial):** Rim light rasteira quente (`#FF6600`, intensidade: 5.0) para desenhar a silhueta metálica.
- **Fill Ambient:** Ambiência mínima escura (`#05070A`, intensidade: 0.2) para manter o contraste profundo.

---

## 📷 CAMERA RIG ARCHITECTURE

O `CameraRig` escuta o `scrollProgress` global e calcula a trajetória da câmera (curva Bezier de animação ou interpolação linear entre waypoints de cena):

| Scroll Range | Cena | Posição Câmera (x, y, z) | Rotação Câmera |
| :--- | :--- | :--- | :--- |
| `0.00 - 0.15` | Scene 01 | `[0.0, 0.0, 5.0]` | LookAt Center |
| `0.15 - 0.35` | Scene 02 | `[0.0, 0.0, 2.8]` | Close-up Zoom |
| `0.35 - 0.55` | Scene 03 | `[0.0, 1.2, 4.0]` | High-Angle Exploded |
| `0.55 - 0.75` | Scene 04 | `[0.0, 0.0, 1.2]` | Fly-Through Tunnel |
| `0.75 - 0.90` | Scene 05 | `[0.0, 0.5, 4.5]` | Assembly View |
| `0.90 - 1.00` | Scene 06 | `[0.0, 0.0, 6.0]` | Blueprint Wireframe |

---

## 🧪 SHADERS CUSTOMIZADOS GLSL (`src/shaders/`)

A pasta `src/shaders/` é reservada para programas customizados de fragment e vertex shaders:

- `metallicDissolve.vert / .frag`: Transição de dissolve térmico / faíscas.
- `blueprintWireframe.frag`: Shader de brilho técnico neon sobre linhas CAD.
- `noiseDisplacement.vert`: Deslocamento de vértices em alta temperatura.

---

## 🪄 PÓS-PROCESSAMENTO (`@react-three/postprocessing`)

Efeitos configurados na `SceneCanvas`:

1. **Bloom:** `intensity: 0.5, luminanceThreshold: 0.8, luminanceSmoothing: 0.2` (para destacar faíscas e bordas brilhantes).
2. **Vignette:** `escuridão rasteira nos cantos` (`offset: 0.3, darkness: 0.8`).
3. **ChromaticAberration:** Ligeira distorção óptica periférica (`offset: [0.0005, 0.0005]`).
