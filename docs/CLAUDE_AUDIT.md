# CLAUDE_AUDIT.md — NEXUS Engineering Audit

> Rodada executada em paralelo com uma sessão ativa do Antigravity editando o mesmo working tree
> (`HolographicConceptDisplay.tsx`, `ConceptInspectorModal.tsx`, `HeroOverlay.tsx`, `NeuralCore.tsx`,
> `NeuralWorld.tsx`, `NexusPrototype.tsx`, `page.tsx`, e os novos `CustomCursor.tsx`/`nexusAudio.ts`
> mudaram no disco durante esta sessão, sem commit). Nenhum arquivo foi revertido ou sobrescrito às
> cegas — todas as leituras foram feitas no estado mais recente antes de qualquer edição.

## ARCHITECTURE

Estrutura em `src/components/three/` e pipeline scroll → store → R3F seguem exatamente o que
`docs/THREE_SYSTEM.md` e `docs/MOTION_SYSTEM.md` descrevem. `SCENES.json` continua como única fonte
de verdade para `CameraRig`. Nenhuma duplicação de estado ou de loop de renderização foi encontrada.

## SCROLL ENGINE

Linha do tempo única confirmada: `Lenis → gsap.ticker → ScrollTrigger.onUpdate → useStore.setScrollProgress
→ (CameraRig / NexusCharacter / NeuralCore / NeuralWorld / HeroOverlay via useFrame ou store.subscribe)`.
Apenas um `ScrollTrigger` é criado (`SmoothScroll.tsx`), com `gsap.context` + `ctx.revert()` e
`lenis.destroy()` no cleanup. Sem brigas por scroll, sem ScrollTriggers duplicados.

## CAMERA

`CameraRig.tsx` mantém interpolação de posição/target/FOV com damping framerate-independente
(`1 - exp(-lerpSpeed * delta)`), vetores em `useRef` de instância (não module-scope), e respeita
`prefersReducedMotion` (lerpSpeed 3.5 → 12, drift/parallax desligados). Nenhuma cena hardcoded no
componente. Sem tremor/snap identificado no código (toda transição é lerp contínuo a partir do estado
anterior da câmera, nunca um salto direto para o alvo).

## R3F / MATRIX

`NeuralCore` e `NeuralWorld` usam `BufferGeometry` única por `points`/`lineSegments` (sem 1 componente
React por nó), PRNG determinístico (`pseudoRandom`), contagem de partículas por tier, e GPU culling real
(`.visible = false` + `return` antecipado no `useFrame` fora do range de scroll relevante). Cálculo de
conexões (`O(n²)`) roda uma única vez dentro de `useMemo`, não por frame.

**Bug corrigido nesta rodada:** `NeuralWorld.tsx` não tratava `devicePerformance === 'unknown'` como
`low`, ao contrário de `NeuralCore.tsx`/`LightsEnvironment.tsx` (e do que `docs/PERFORMANCE.md` exige
explicitamente). Isso fazia a Scene 05 renderizar a contagem de nós **mais pesada** (tier "high") no
primeiro frame, antes da detecção real de hardware resolver no mount de `SmoothScroll` — exatamente o
pico de custo que o resto do engine já evita. Corrigido para tratar `unknown` como `low`, consistente
com os arquivos irmãos. (O Antigravity re-tunou os valores de contagem/raio/linhas neste mesmo arquivo
em paralelo; a correção foi preservada através da reescrita.)

## SHADERS

`NexusDissolveMaterial` / `MetallicHeroObject`: shader único e barato (ruído pseudo-aleatório 2D +
`discard` + fresnel simples), uniforms memoizados fora do loop de render, cor só reparseada quando muda.
Sem shaders adicionais propostos nesta rodada — nenhum ganho visual claro justificaria o custo extra
além do que já existe.

## ASSETS

GLBs (`humanHead`/`hybridHead`/`androidHead`) ainda `pending` (0 bytes, só `.gitkeep`) — pipeline
Draco/Meshopt/KTX2 não se aplica ainda, o fallback procedural (`NexusPrototype` + `MetallicHeroObject`)
cobre o gap corretamente. As 5 imagens de concept-art em `public/images/nexus/` somam ~10.7MB (PNG puro,
sem compressão WebP/AVIF) e carregam para **todo** visitante via `HolographicConceptDisplay`,
independentemente do tier — já documentado como item em aberto em `docs/PROJECT_STATUS.md` #3. Não
alterado nesta rodada por ser uma decisão de trade-off visual (Antigravity está ativamente iterando
nessa cena) e não uma regressão; ver recomendação abaixo.

## PERFORMANCE

Tiers (`high`/`medium`/`low`/`unknown`) controlando DPR, Bloom/EffectComposer e contagem de
partículas continuam consistentes em todos os arquivos após a correção do `NeuralWorld.tsx`. Bloom
`luminanceThreshold=0.85`, `EffectComposer` inteiro pulado em `low`/`unknown`. Nenhum objeto Three.js
alocado por frame; todas as posições vêm de `useMemo`/`useRef`.

## MOBILE

`detectDevicePerformance()` já classifica mobile (UA + `innerWidth < 768`) como `low`. `CustomCursor.tsx`
(novo, do Antigravity) roda seu próprio `requestAnimationFrame` para suavizar a posição do cursor
customizado — é um segundo loop de RAF, mas legítimo (fora do Canvas, não pode usar `useFrame`),
gated a `pointer: fine` (desabilitado em touch/mobile) e com cleanup simétrico
(`cancelAnimationFrame` + `removeEventListener`). Não compete com o loop do R3F por recursos
relevantes — sem ação necessária.

## ISSUES FIXED

1. **[HIGH] `NeuralWorld.tsx`: tier `unknown` tratado como `high`** em vez de `low`, contradizendo
   `docs/PERFORMANCE.md` e o padrão já usado em `NeuralCore.tsx`/`LightsEnvironment.tsx`. Corrigido.

## ISSUES NOT FIXED (recomendações)

1. **[MEDIUM] `HolographicConceptDisplay`: 5 texturas PNG (~10.7MB) carregam sem respeitar
   `devicePerformance`.** O isolamento de `Suspense` já evita bloquear a cena principal, mas não evita
   o custo de banda/memória em tiers `low`/mobile. Sugestão futura (não aplicada agora, pois a cena está
   sob iteração ativa do Antigravity): pular o componente inteiro em `devicePerformance === 'low'`, ou
   reencodar os PNGs para WebP/AVIF compactado.
2. **[LOW] Duas instâncias independentes de `ConceptInspectorModal`** são montadas simultaneamente
   (uma em `Navbar.tsx`, outra em `HeroOverlay.tsx`), cada uma com seu próprio `isOpen` local. Não é bug
   (nunca ambas abertas ao mesmo tempo, sem vazamento), mas poderia ser centralizado em um único estado
   no `useStore` para reduzir duplicação de listeners de teclado quando um dia crescer.
3. **[INFO] GLBs ainda pendentes.** Pipeline Draco/Meshopt/KTX2 (Missão 06) permanece só arquitetural
   até os 3 arquivos `.glb` chegarem em `public/models/nexus/`.

## VALIDATION

- `npx tsc --noEmit` → limpo.
- `npm run lint` → limpo.
- `npm run build` (Turbopack) → compilado com sucesso, páginas estáticas geradas sem erros.

---

# RODADA 2 — SCENE 05 "MATRIX" TECHNICAL REVIEW

> Escopo: apenas a Cena 05 (`SCENES.json` `scene-05`, `scrollRange [0.65, 0.88]`, "SYNAPTIC MATRIX"),
> após o refinamento visual do Antigravity (câmera reenquadrada de `[0,0,-2.5]`/FOV 65 para
> `[0.2,0.05,3.3]`/FOV 40, mais perto da origem — "imersão no núcleo de consciência" em vez de
> "penetrar o horizonte de eventos"). Nenhuma composição, tipografia ou layout foi alterada. Nenhum
> código foi modificado nesta rodada — os números abaixo confirmam que o componente já está dentro do
> orçamento antes de qualquer otimização ser necessária.

### Componente responsável: `NeuralWorld.tsx`

| Métrica (tier `high`, 700 nós) | Valor medido |
| :--- | :--- |
| Draw calls próprios | 2 (`<points>` + `<lineSegments>`, cada um 1 único `BufferGeometry`) |
| Nós (partículas) | 700 (tier `high`) / 350 (`medium`) / 120 (`low`/`unknown`) |
| Segmentos de linha gerados | **392** (high) / 102 (medium) / 8 (low) — medido executando o algoritmo real de `NeuralWorld.tsx` fora do browser (script Node com a mesma lógica de `pseudoRandom`/threshold `distSq < 2.8`) |
| Vértices de linha | 784 (high) — 1 único `lineSegments`, não 392 objetos |
| Instancing / componente-por-nó | Nenhum nó vira componente React; tudo é 1 `Float32Array` em `useMemo`, recalculado só quando `count` muda (troca de tier), nunca por frame |
| Alocações em `useFrame` | Zero `new THREE.*` — só leitura de `useStore.getState()`, mutação de `.rotation`/`.opacity`/`.size` em objetos já existentes |
| Material | `pointsMaterial` + `lineBasicMaterial` únicos, `transparent` + `AdditiveBlending` + `depthWrite={false}` (evita write no depth buffer, padrão correto para partículas aditivas) |
| GPU culling | `worldGroupRef.visible = false` fora de `scrollProgress [0.55, 0.95]`, com `return` antecipado no `useFrame` — a cena nem chega a computar opacity/rotation quando fora de range |

**Conclusão sobre a Matrix isolada:** já satisfaz a prioridade 3 e 4 da tarefa (linhas em 1 único
`BufferGeometry`, não centenas de objetos; sem necessidade de instancing adicional — `Points` já é,
na prática, uma forma de instancing de partículas em 1 draw call). 700 nós / 392 linhas / 784 vértices
é uma carga trivial para qualquer GPU desktop — o gargalo de 60 FPS, se existir, não está aqui.

### Orçamento real de draw calls durante a Cena 05 (soma de tudo visível simultaneamente)

A Cena 05 não roda `NeuralWorld` isolado — `NeuralCore` (visível `[0.40, 0.92]`) e
`LightsEnvironment` (sempre montado) permanecem ativos no mesmo intervalo:

| Componente | Draw calls | Observação |
| :--- | :--- | :--- |
| `NeuralWorld` | 2 | pontos + linhas (matriz externa) |
| `NeuralCore` | 4 | pontos + linhas + anel de pulso (`ringGeometry`) + esfera interna |
| `LightsEnvironment` | 1 | poeira atmosférica (`points`); as 4 luzes não geram draw call próprio |
| `HolographicConceptDisplay` | ~3 | só o plano `04_ANDROID` fica com `opacity > 0.005` na maior parte da Cena 05 (crossfade dos outros 4 já chegou a 0 e `mesh.visible=false`) + scanline + moldura reticulada |
| `NexusPrototype` | 0 | fora de `[0.70, 0.84]` (maior parte da Cena 05) fica `visible=false` via GPU culling; só aparece nas bordas de transição |
| **Total (steady state)** | **~10** | + 2-3 passes de post-processing (Bloom + Vignette) em tier `high`/`medium` |

10 draw calls é uma fração mínima de qualquer orçamento de 60 FPS em desktop (referência comum: várias
centenas a poucos milhares antes de draw-call overhead virar gargalo). **Prioridade 1 (60 FPS desktop
high) não está em risco pelo lado de draw calls.**

### Overdraw

- Todos os elementos aditivos (`NeuralWorld`, `NeuralCore`, poeira de `LightsEnvironment`) usam
  `depthWrite={false}` + `transparent`, o padrão correto para evitar problemas de ordenação/z-fighting
  em partículas — mas isso significa que o overdraw real vem da **sobreposição de camadas semi-
  transparentes**, não de geometria desperdiçada.
- `sizeAttenuation` (padrão do `PointsMaterial`) faz pontos próximos da câmera renderizarem maiores.
  Verifiquei se o reenquadramento do Antigravity (câmera agora em `z ≈ 3.3-5.2`, dentro do range
  `z [-16, +8]` que o `<group position={[0,0,-4]}>` da Matrix ocupa) criaria pontos "estourados" perto
  da câmera: a distância mínima possível entre a câmera e um nó da Matrix é ~3 unidades (câmera fica na
  borda próxima da nuvem de pontos, não no meio dela), o que em FOV 40 resulta em pontos de
  ~20px de diâmetro — sem estouro visível. **O reenquadramento da câmera não introduziu overdraw por
  pontos gigantes.**
- `NeuralCore` (fora do escopo desta cena, mas ativo simultaneamente) gera 2175 segmentos de linha para
  220 nós num raio de 0.78 — uma malha bem mais densa que a Matrix externa. Isso é uma nota lateral, não
  uma correção: por estar fora do escopo pedido ("apenas a Cena 05 MATRIZ") e por ser uma decisão de
  densidade visual (não um vazamento de recursos — ainda é 1 único draw call), não foi alterado. Se o
  Antigravity notar um "blob" muito brilhante no núcleo sob Bloom, o parâmetro a ajustar é o threshold
  de distância em `NeuralCore.tsx` (fora do escopo desta auditoria).

### Shader cost

Nenhum shader customizado na Matrix — `pointsMaterial`/`lineBasicMaterial` built-in do Three.js
(shaders internos já otimizados, sem branches caros). Custo de fragment shader por partícula é mínimo.

### DPR / Postprocessing

Inalterados desde a Rodada 1: `[1,2]` em `high`, `[1,1.25]` em `medium`, `1.0` fixo em `low`/`unknown`;
`EffectComposer` (Bloom + Vignette) pulado inteiro fora de `high`/`medium`. Já dentro do orçamento de
`docs/PERFORMANCE.md`.

### React re-renders / useFrame allocations

`NeuralWorld` só re-renderiza quando `devicePerformance` ou `prefersReducedMotion` mudam no Zustand
store (eventos raros, não por scroll/frame). Todo o resto do estado por frame é lido via
`useStore.getState()` dentro do `useFrame` (sem inscrição reativa, sem re-render). Zero alocação de
objetos Three.js dentro do loop — confirmado lendo o corpo inteiro do `useFrame`.

### Mobile

Tier `low`/`unknown`: 120 nós / 8 linhas / DPR 1.0 / postprocessing desligado — a Matrix vira
essencialmente um campo de partículas esparso, sem a malha densa do desktop, exatamente o trade-off que
`docs/PERFORMANCE.md` pede para 30-60 FPS estável em mobile.

### ISSUES FIXED (Rodada 2)

Nenhum. Não foi necessária nenhuma alteração de código — `NeuralWorld.tsx` já estava dentro do
orçamento em todas as métricas pedidas (draw calls, buffers, instancing, materiais, blending, DPR,
postprocessing, re-renders, alocações). A correção da Rodada 1 (`unknown` tratado como `low`) já cobria
o único ponto fraco encontrado.

### RECOMMENDATIONS (não aplicadas — fora do escopo "apenas Cena 05" ou não urgentes)

1. Se o Antigravity quiser mais "peso visual" na Matrix sem custo de GPU, dá para aumentar o raio
   `xy`/threshold de conexão em `NeuralWorld.tsx` sem tocar em contagem de nós — o gargalo real não é
   quantidade de nós, é puramente estético.
2. `NeuralCore.tsx` (fora do escopo) tem uma malha ~5.5x mais densa proporcionalmente que a Matrix
   externa (2175 linhas / 220 nós vs. 392 linhas / 700 nós) — vale revisão dedicada se algum dia isso
   virar reclamação de FPS ou de "blob" excessivo sob Bloom.

## VALIDATION (Rodada 2)

- `npx tsc --noEmit` → limpo.
- `npm run lint` → limpo.
- `npm run build` (Turbopack) → compilado com sucesso (retry após lock de build concorrente do
  Antigravity liberar).

---

# RODADA 3 — SCENE 06 "NEXUS" FINAL SCENE AUDIT + TRANSIÇÃO 05→06

> Escopo: reconstrução da Cena 06 pelo Antigravity, capturada **enquanto acontecia** — `SCENES.json`,
> `NexusCharacter.tsx`, `NeuralWorld.tsx`, `NeuralCore.tsx` e `HolographicConceptDisplay.tsx` mudaram no
> disco durante a leitura desta rodada (timestamps a poucos segundos uns dos outros). Toda leitura foi
> refeita no estado mais recente antes de qualquer edição, conforme protocolo de coordenação do
> `AGENTS.md`. Nenhuma composição, tipografia, paleta ou intenção narrativa foi alterada.

### O que o Antigravity mudou (confirmado lendo o código, não assumido)

- **`NexusCharacter.tsx`**: o branch pré-GLB não renderiza mais `<NexusPrototype />` (a antiga
  esfera/torus/anéis biomecânicos) — agora renderiza só `<HolographicConceptDisplay />` como "Cinematic
  Protagonist Integration". O branch GLB (dormant, sem `.glb` reais em `public/models/nexus/` ainda)
  também trocou o fallback de `<NexusPrototype />` para `<HolographicConceptDisplay />`. Resultado:
  **`SCENE 06 = HUMAN-MACHINE CONVERGENCE`** é literalmente as 5 imagens de concept-art oficiais
  fazendo crossfade contínuo (`getConceptWeights`), terminando 100% em `nexus-final.png` no fim do
  scroll — não há mais nenhuma geometria procedural central. Confere com o resultado esperado.
- **`NeuralCore.tsx`**: range de visibilidade encurtado de `[0.40, 0.92]` para `[0.40, 0.86]` — o núcleo
  denso (a "esfera" pulsante de `innerSphereRef` + `ringGeometry`) agora **dissolve completamente antes
  da Cena 06 começar** (`0.88`). Ele nunca aparece na cena final.
- **`NeuralWorld.tsx`**: reescrito para servir tanto a Matrix (Cena 05) quanto o funil de convergência da
  Cena 06 num único sistema contínuo — ver seção de transição abaixo.
- **`SCENES.json`**: câmera da Cena 06 ajustada de `[0,0,5.2]`/FOV 45 para `[0,0.05,2.75]`/FOV 38 (mais
  próxima, mais fechada), consistente com "convergência" em vez de "recuo".

### 1-2. CameraRig / ScrollTrigger

Nenhuma mudança nesta rodada (`git diff --stat` = 0 para `CameraRig.tsx` e `SmoothScroll.tsx`). Continuam
como fonte única de verdade (`SCENES.json` → `CameraRig`) e única timeline (`Lenis → gsap.ticker →
ScrollTrigger.onUpdate → scrollProgress`), já auditados nas Rodadas 1-2. `CameraRig` não hardcoda nada da
Cena 06 — a nova posição de câmera vem inteiramente do `SCENES.json` editado pelo Antigravity.

### 3. Interpolação 05 → 06

Verificado o salto de câmera na fronteira `scrollRange` (Cena 05 termina em `[0.2,0.05,3.3]`/FOV 40, Cena
06 começa em `[0,0.05,2.75]`/FOV 38): delta de posição ~0.57 unidades, delta de FOV 2° — pequeno o
suficiente para o damping framerate-independente do `CameraRig` (`lerpSpeed=3.5`) absorver sem
"snap" perceptível. Sem tremor/salto identificado no código.

### 4-5. Partículas de convergência / Neural filaments (transição real 05→06)

`NeuralWorld.tsx` agora é o único sistema de partículas que atravessa a fronteira 05→06 sem descontinuidade:

- Visibilidade: `scrollProgress >= 0.55` **sem teto superior** (antes era `<= 0.95`) — a Matrix nunca some
  antes do fim do scroll, ela se transforma continuamente no funil de convergência da Cena 06.
- **Distribuição espacial redesenhada**: de um "túnel" cilíndrico genérico para uma "corona" esférica
  concentrada ao redor da cabeça (`radius 1.25-4.05`), com uma zona de exclusão facial explícita
  (`Math.abs(x) < 0.65 && y > -0.4 && y < 0.55 && z > 0.3` empurra o nó para trás) — os filamentos
  literalmente evitam cobrir o rosto do protagonista no `HolographicConceptDisplay`. Isso é uma decisão
  de composição do Antigravity, não alterada.
- **Funil de convergência real**: `scrollProgress > 0.88` aplica `convergenceScale = 1.0 - convNorm*0.35`
  no grupo inteiro (via `.scale.setScalar`, não realocando geometria) — os filamentos se contraem ~35%
  em direção à cabeça/pescoço na Cena 06, é isso que fisicamente representa "convergência" sem nenhuma
  esfera/geometria adicional.
- Grau máximo de conexão por nó limitado a 3 (`connections >= 3 → break`) já é uma medida anti-clutter
  aplicada pelo próprio Antigravity — nota técnica: o cap só limita conexões **de saída** por nó durante
  seu próprio scan (`i`), não o grau total; medindo o grau real resultante (script Node reproduzindo o
  algoritmo), o grau máximo observado foi **10**, não 3. Não é bug (ainda 1 único draw call, custo
  irrelevante), só uma imprecisão no comentário do código-fonte — não corrigido por ser puramente
  cosmético/de comentário e por não ser meu escopo alterar a lógica de densidade visual do Antigravity.

| Métrica (medida rodando o algoritmo real fora do browser) | high (320 nós) | medium (180) | low/unknown (90) |
| :--- | :--- | :--- | :--- |
| Segmentos de linha | 705 | 334 | 122 |
| Vértices de linha | 1410 | 668 | 244 |
| Grau máximo real por nó | 10 | 9 | 7 |

Ainda 2 draw calls totais (`points` + `lineSegments`, buffers únicos) — nenhuma mudança na categoria de
custo, só na distribuição espacial e no teto de visibilidade.

### 6. Draw calls — Cena 06 (steady state, `scrollProgress` perto de 0.95-1.0)

| Componente | Draw calls | Estado na Cena 06 |
| :--- | :--- | :--- |
| `HolographicConceptDisplay` | 6 (5 planos de imagem + 1 scanline) | ativo, plano `05_NEXUS_FINAL` em opacidade crescente |
| `NeuralWorld` | 2 | ativo, em convergência (`convergenceScale` encolhendo) |
| `NeuralCore` | 0 | `visible=false` (fora de `[0.40,0.86]`), `return` antecipado no `useFrame` |
| `NexusPrototype`/`MetallicHeroObject` | 0 (removido) | — |
| `LightsEnvironment` | 1 | sempre ativo |
| **Total** | **9** | + Bloom/Vignette em `high`/`medium` |

Uma redução de draw calls em relação à Rodada 2 (que era ~10, com `NexusPrototype` parcialmente visível
nas bordas de Cena 05/06): a Cena 06 agora tem **menos** geometria concorrendo por GPU, não mais, apesar
de visualmente mais rica — exatamente o objetivo "cena visualmente rica sem desperdiçar GPU".

### 7. BufferGeometry / InstancedMesh

Nenhum uso de `InstancedMesh` em lugar nenhum do projeto — corretamente, porque não há nenhuma malha
triangular repetida N vezes que justificasse instancing (o caso de uso clássico de `InstancedMesh`). Toda
a "multiplicidade" do projeto (nós neurais, partículas de poeira) já usa `Points`/`BufferGeometry`, que é
a forma correta e mais barata de representar milhares de partículas em 1 draw call — instancing não teria
nenhum ganho aqui e adicionaria complexidade sem propósito.

### 8. Overdraw / transparências

Sem mudança de categoria: `HolographicConceptDisplay` continua com 5 planos empilhados com
`depthWrite={false}` (só 1 fica com opacidade > 0.005 por vez fora das janelas de crossfade, então o
`mesh.visible = false` automático evita ficar desenhando planos invisíveis). `NeuralWorld` continua
aditivo com `depthWrite={false}`. A redução de nós (700→320 no tier high) e a concentração espacial em
torno da cabeça (em vez de espalhados por um túnel largo) tende a *reduzir* a área de overdraw em tela,
não aumentar.

### 9. DPR / performance tiers

Inalterado desde a Rodada 1-2 (`SceneCanvas.tsx` sem diff): `[1,2]` high / `[1,1.25]` medium / `1.0`
low-unknown; postprocessing só em high/medium. Continua dentro do orçamento de `docs/PERFORMANCE.md`.

### 10. Mobile fallback

Tier `low`/`unknown`: `NeuralWorld` 90 nós / 122 linhas, `NeuralCore` já não entra em jogo na Cena 06
(dissolve antes de 0.88 em qualquer tier), `HolographicConceptDisplay` continua carregando as mesmas 5
texturas em qualquer tier (item já registrado como recomendação na Rodada 1, não mudou).

### 11. Reduced motion

`NeuralWorld` já pula a rotação/posição orientada pelo ponteiro do mouse quando `prefersReducedMotion`
(igual Rodada 2). A rotação ambiente lenta (`rotation.y = time * 0.035`, ~2°/s) e o `convergenceScale`
continuam rodando independente de `prefersReducedMotion` — é uma animação muito sutil (mesma categoria do
"breathing" que `CameraRig` já trata como aceitável mesmo com reduced motion parcialmente ativo);
registrado como observação, não alterado, por não ser uma regressão e por mexer em código que o
Antigravity está tunando ativamente.

### 12. Cleanup de recursos

`GLBHeadInstance` mantém `disposeObject3D()` no cleanup do `useEffect` (inalterado). Nenhum novo listener,
timer ou objeto Three.js sem cleanup foi introduzido nesta reconstrução.

### 13. Carregamento dos assets do protagonista

**Gap latente identificado e corrigido nesta rodada:** em `NexusCharacter.tsx`, quando `hasGLBModels` for
`true` no futuro (ainda não acontece hoje - `public/models/nexus/` só tem `.gitkeep`), o fallback do
`<Suspense>` que envolve os 3 `<GLBHeadInstance>` passou a ser `<HolographicConceptDisplay />` direto. Se
esse componente ainda não tiver suas 5 texturas em cache (`useTexture`) no momento em que for usado como
fallback, ele próprio suspende — e como um elemento de `fallback` que suspende não é recapturado pelo
mesmo `Suspense`, isso propagaria para o `<Suspense fallback={null}>` raiz do `SceneCanvas.tsx`,
zerando **toda** a cena 3D (câmera, luzes, NeuralCore, NeuralWorld) até as texturas carregarem — a exata
cascata que o item 8 do `PROJECT_STATUS.md` já tinha corrigido para outro caminho. Corrigido envolvendo
esse fallback num `<Suspense fallback={null}>` próprio. Hoje isso é código dormente (só ativa quando os
`.glb` chegarem), mas o custo da correção é zero e evita reintroduzir um bug já resolvido uma vez.

### DEAD CODE — identificado e removido

`grep -rn "NexusPrototype\|MetallicHeroObject" src/` confirmou: depois da reconstrução do Antigravity,
`NexusPrototype.tsx` só era referenciado por um `import` não utilizado em `NexusCharacter.tsx` (a antiga
esfera nunca mais aparece em nenhum JSX renderizado, em nenhuma cena). Cadeia órfã completa:

- `src/components/three/NexusPrototype.tsx` (esfera/torus/anéis/wireframe/scanner — o antigo protagonista procedural)
- `src/components/three/MetallicHeroObject.tsx` (usado só por `NexusPrototype`)
- `src/components/three/materials/NexusDissolveMaterial.tsx` (shader usado só por `MetallicHeroObject`)

Nenhum dos três é usado pela Matrix (`NeuralCore`/`NeuralWorld` são sistemas de partículas independentes,
nunca importaram esses arquivos) — confirmado via grep antes de remover, conforme instrução. **Removidos**
(com confirmação explícita do usuário, já que a exclusão de arquivo é uma ação irreversível bloqueada por
padrão pelo classifier de permissões) junto com o import órfão em `NexusCharacter.tsx`. `docs/THREE_SYSTEM.md`
ainda documenta esses 3 arquivos como parte da arquitetura — ficou desatualizado por esta remoção;
não foi editado nesta rodada por estar fora do escopo pedido (só `docs/CLAUDE_AUDIT.md`), fica como
recomendação abaixo.

### ISSUES FIXED (Rodada 3)

1. **[MEDIUM] Dead code removido:** `NexusPrototype.tsx`, `MetallicHeroObject.tsx`,
   `materials/NexusDissolveMaterial.tsx` — órfãos após a reconstrução da Cena 06, confirmados sem uso em
   nenhuma cena (incluindo a Matrix) antes da remoção.
2. **[LOW/preventivo] `NexusCharacter.tsx`:** `Suspense` aninhado ao redor de `<HolographicConceptDisplay />`
   quando usado como fallback do carregamento de GLB, prevenindo uma cascata que zeraria a cena 3D
   inteira se as texturas de concept-art ainda não estivessem em cache no momento em que os `.glb` reais
   chegarem. Código dormente hoje, custo zero, prevenção de uma regressão já corrigida uma vez no passado.

### RECOMMENDATIONS (não aplicadas)

1. `docs/THREE_SYSTEM.md` ainda referencia `NexusPrototype`/`MetallicHeroObject`/`NexusDissolveMaterial`
   na árvore de componentes e na seção "Sistema de Dissolve" — desatualizado após esta remoção. Fora do
   escopo desta rodada (só `CLAUDE_AUDIT.md` foi pedido), mas vale uma atualização de documentação numa
   rodada futura.
2. Mesma recomendação da Rodada 1 sobre `HolographicConceptDisplay` não respeitar `devicePerformance`
   (5 PNGs, ~10.7MB, carregam em qualquer tier) — segue não urgente/fora de escopo.
3. Comentário `"limit max degree per node to prevent clutter"` em `NeuralWorld.tsx` está impreciso (grau
   real observado até 10, não 3) — cosmético, não corrigido por não ser escopo de engine.

## VALIDATION (Rodada 3)

- `npx tsc --noEmit` → limpo.
- `npm run lint` → limpo.
- `npm run build` (Turbopack) → compilado com sucesso.

---

## ENGINE STATUS: STABLE
