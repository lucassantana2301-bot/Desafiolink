# PERFORMANCE.md - Diretrizes de Performance NEXUS

## ⚡ ESTRATÉGIA DE REDE NEURAL E PONTOS HIGH-PERFORMANCE

A Scene 05 (`NeuralWorld`) renderiza centenas de nós e conexões neurais no espaço 3D. Para garantir 60 FPS consistentes em qualquer hardware:

1. **Uso de `BufferGeometry` Única:**
   - Todos os pontos e linhas da matriz neural utilizam um único buffer de atributos (`Float32Array`).
   - Evita a criação de centenas de objetos `THREE.Mesh` ou instâncias React separadas.
2. **Dynamic DPR Scaling (via `devicePerformance` no Zustand, detectado em `performanceDetector.ts`):**
   - `high`: DPR `[1, 2]`, Bloom `intensity=0.45`.
   - `medium`: DPR `[1, 1.25]`, Bloom `intensity=0.25`.
   - `low`: DPR `1.0` fixo, EffectComposer **desligado por completo**.
   - `unknown` (estado inicial, antes da detecção no mount de `SmoothScroll`): tratado como `low` em
     **todos** os pontos de decisão (DPR, post-processing, contagem de partículas de `NeuralCore`,
     `NeuralWorld` e `LightsEnvironment`). Isso evita o pico de custo "assume-se hardware bom até prova
     em contrário" logo no primeiro frame, justamente no hardware mais fraco.
3. **Pós-processamento Conservador:**
   - Bloom com `luminanceThreshold=0.85` para que apenas o ciano sutil (pulsos neurais, fresnel do
     `MetallicHeroObject`) emita brilho, sem estourar os reflexos metálicos do titânio.
   - `EffectComposer` inteiro é pulado (não só reduzido) no tier `low`/`unknown`.
4. **GPU Culling real:** `NexusPrototype`, `NeuralCore` e `NeuralWorld` marcam `.visible = false` e
   fazem `return` antecipado no `useFrame` quando fora do range de scroll relevante - o objeto é
   removido do draw call, não apenas deixado transparente.
5. **Isolamento de Suspense para assets pesados:** `HolographicConceptDisplay` (5 texturas PNG de
   concept-art, ~10MB no total) roda dentro do seu próprio `<Suspense fallback={null}>` em
   `NexusCharacter.tsx`, para que o carregamento dessas imagens nunca bloqueie o restante da cena
   procedural (câmera, luzes, núcleo neural) que já está pronta para renderizar.
