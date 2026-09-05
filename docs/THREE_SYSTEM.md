# THREE_SYSTEM.md - Ecossistema 3D e Matriz Neural NEXUS

## 🧊 ESTRUTURA DOS COMPONENTES WEBGL

```text
src/components/three/
├── SceneCanvas.tsx             # Canvas fullscreen: WebGL capability check, ErrorBoundary, Suspense, DPR/Bloom por tier
├── CameraRig.tsx                # Keyframing da câmera lendo SCENES.json (fonte única de verdade) + breathing/drift procedural
├── NexusCharacter.tsx           # Container do protagonista: decide GLB real (3 arquivos presentes) vs. fallback procedural
├── NexusPrototype.tsx           # Protagonista abstrato (MetallicHeroObject + wireframe + anéis + halo)
├── MetallicHeroObject.tsx       # Esfera metálica com NexusDissolveMaterial (fresnel + dissolve), placeholder da cabeça GLB
├── HolographicConceptDisplay.tsx # Planos holográficos com os 5 concept-arts aprovados, crossfade por estado narrativo
├── materials/NexusDissolveMaterial.tsx # ShaderMaterial de dissolve reutilizável (uTime/uProgress/uNoiseScale/uEdgeWidth/uEdgeColor)
├── NeuralCore.tsx               # Núcleo neural cerebral em esfera de partículas e conexões (tierizado)
├── NeuralWorld.tsx              # Matriz neural 3D imersiva (BufferGeometry & Points, tierizado)
└── LightsEnvironment.tsx        # Iluminação dramática lateral, luz orbital por scroll e pulso ciano (tierizado)

src/utils/nexusTransitions.ts    # getCharacterTransition(scrollProgress) - primary/secondary model + dissolveProgress
src/lib/characterStateMachine.ts # getCharacterState(scrollProgress) - os 5 estados narrativos (fonte de StoreState.characterState)
src/lib/performanceDetector.ts   # detectDevicePerformance() + checkPrefersReducedMotion()
src/components/ui/LoadingOverlay.tsx    # useProgress() real, sem timeout artificial, com estado de erro
src/components/ui/ErrorBoundary.tsx     # ErrorBoundary real em volta do Canvas -> WebGLFallback
src/components/ui/WebGLFallback.tsx     # Tela estática exibida sem WebGL ou em erro do Canvas
src/components/ui/DebugHUD.tsx          # HUD de telemetria opcional (?debug3d=1)
src/components/ui/ConceptInspectorModal.tsx # Modal com os 5 concept-arts aprovados e specs de budget
```

---

## 📷 KEYFRAMING DA CÂMERA (`CameraRig.tsx`)

A câmera **não hardcoda mais posições** - ela lê `SCENES.json` (via `src/data/scenes.ts`) a cada frame,
localiza a cena atual/próxima pelo `scrollRange` e interpola `cameraPosition` / `cameraFov` / `cameraTarget`
com damping framerate-independente (`1 - exp(-lerpSpeed * delta)`). Editar `SCENES.json` já é suficiente
para mudar o comportamento da câmera - não há mais nenhum valor duplicado no componente.

| Scroll Range | Cena | Posição Câmera | FOV | Foco Visual |
| :--- | :--- | :--- | :--- | :--- |
| `0.00 - 0.15` | Scene 01 | `[0.0, 0.0, 6.0]` | `45°` | Silhueta inicial (Humano) |
| `0.15 - 0.32` | Scene 02 | `[0.0, 0.2, 3.8]` | `42°` | Close-up da pele/wireframe |
| `0.32 - 0.50` | Scene 03 | `[0.8, 0.6, 4.5]` | `40°` | Órbita explodida (Máquina) |
| `0.50 - 0.65` | Scene 04 | `[0.0, 0.0, 2.2]` | `50°` | Enfoque no Núcleo Neural |
| `0.65 - 0.88` | Scene 05 | `[0.0, 0.0, -2.5]` | `65°` | Imersão DENTRO da Rede Neural |
| `0.88 - 1.00` | Scene 06 | `[0.0, 0.0, 5.2]` | `45°` | Recuo para o Híbrido Final |

Quando `prefersReducedMotion` está ativo, o parallax de mouse e o "breathing/drift" procedural são
desligados e o `lerpSpeed` sobe de `3.5` para `12` (resposta quase imediata, sem drift orgânico).

---

## 🧬 SISTEMA DE DISSOLVE (`NexusDissolveMaterial` / `MetallicHeroObject`)

`NexusDissolveMaterial` expõe um `ShaderMaterial` com 5 uniforms (`uTime`, `uProgress`, `uNoiseScale`,
`uEdgeWidth`, `uEdgeColor`) e um fresnel metálico baseado em `vNormal` (view-space). Ele é a peça
reutilizável tanto para o placeholder procedural de hoje quanto para o crossfade dos GLBs reais amanhã.

`MetallicHeroObject` consome o shader diretamente (não via `<NexusDissolveMaterial>`, para evitar dois
"writers" concorrentes do mesmo uniform por frame) e calcula um pulso triangular (`0 -> 1 -> 0`) a partir
de `getCharacterTransition(scrollProgress)`: o efeito de dissolve só aparece **durante** uma transição
narrativa real (quando existe `secondaryModel`) e volta a 0 num estado assentado (`01_HUMAN`, `03_HYBRID`).
A intensidade é limitada por `MAX_VISUAL_DISSOLVE = 0.4` para a silhueta nunca desaparecer por completo -
esse é hoje o único requisito de design ainda não validado visualmente num navegador.

Quando os GLBs reais chegarem, o mesmo par de shaders pode ser aplicado ao material de cada cabeça para
o crossfade `humanHead -> hybridHead -> androidHead` descrito em `docs/GLB_SPEC.md`.
