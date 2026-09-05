# THREE_SYSTEM.md - Ecossistema 3D e Matriz Neural NEXUS

## 🧊 ESTRUTURA DOS COMPONENTES WEBGL

```text
src/components/three/
├── SceneCanvas.tsx          # Canvas container fullscreen com Suspense e EffectComposer
├── CameraRig.tsx            # Keyframing da câmera 3D (posição, rotação, FOV) por scroll
├── NexusPrototype.tsx       # Protagonista abstrato (conchas, anéis mecânicos, silhueta)
├── NeuralCore.tsx           # Núcleo neural cerebral em esfera de partículas e conexões
├── NeuralWorld.tsx          # Matriz neural 3D imersiva (BufferGeometry & Points)
└── LightsEnvironment.tsx    # Iluminação dramática lateral e ambiência titanium
```

---

## 📷 KEYFRAMING DA CÂMERA (`CameraRig.tsx`)

| Scroll Range | Cena | Posição Câmera | FOV | Foco Visual |
| :--- | :--- | :--- | :--- | :--- |
| `0.00 - 0.15` | Scene 01 | `[0.0, 0.0, 6.0]` | `45°` | Silhueta inicial (Humano) |
| `0.15 - 0.32` | Scene 02 | `[0.0, 0.2, 3.8]` | `42°` | Close-up da pele/wireframe |
| `0.32 - 0.50` | Scene 03 | `[0.8, 0.6, 4.5]` | `40°` | Órbita explodida (Máquina) |
| `0.50 - 0.65` | Scene 04 | `[0.0, 0.0, 2.2]` | `50°` | Enfoque no Núcleo Neural |
| `0.65 - 0.88` | Scene 05 | `[0.0, 0.0, -2.5]` | `65°` | Imersão DENTRO da Rede Neural |
| `0.88 - 1.00` | Scene 06 | `[0.0, 0.0, 5.2]` | `45°` | Recuo para o Híbrido Final |
