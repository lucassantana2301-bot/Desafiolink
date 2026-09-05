# PROJECT_STATUS.md - Estado da Engine NEXUS (Pre-GLB)

> Registro vivo do que foi alterado a cada rodada de trabalho e do que ainda falta.
> Leia este arquivo **antes** de mexer em `src/components/three/` ou `src/store/useStore.ts` -
> ele reflete o estado real verificado em código, não apenas o que foi reportado como feito.

---

## ⚠️ Nota sobre trabalho concorrente

Esta rodada (Claude) foi executada **em paralelo** com uma sessão do Antigravity editando o mesmo
working tree (arquivos como `HolographicConceptDisplay.tsx`, `ConceptInspectorModal.tsx`, e mudanças em
`Navbar.tsx` / `HeroOverlay.tsx` / `CameraRig.tsx` / `LightsEnvironment.tsx` surgiram no disco durante
esta sessão, sem commit). As duas linhas de trabalho não colidiram diretamente (edições em regiões
diferentes dos mesmos arquivos), mas isso significa que **nenhum commit foi feito** ao final desta
rodada - o estado abaixo descreve o working tree no momento em que esta rodada terminou. Rode
`git status` / `git diff` antes de commitar para confirmar que nada mudou desde então.

---

## ✅ O QUE FOI CORRIGIDO NESTA RODADA (Claude)

Todos os itens abaixo foram verificados lendo o código atual, não apenas assumidos como corretos.

1. **`devicePerformance === 'unknown'` tratado como tier alto (bug de performance).**
   `NeuralCore.tsx`, `NeuralWorld.tsx` e `LightsEnvironment.tsx` caíam no branch de contagem de
   partículas **mais pesado** (`high`) enquanto o estado era `unknown` (antes da detecção real
   resolver no mount de `SmoothScroll`). Corrigido para tratar `unknown` igual a `low` nos três
   arquivos, consistente com o que `SceneCanvas.tsx` já fazia para DPR/Bloom.

2. **`NexusDissolveMaterial.tsx`: `uEdgeColor` nunca era sincronizado por frame.**
   Os uniforms `uProgress`/`uNoiseScale`/`uEdgeWidth` já eram atualizados a cada frame a partir das
   props, mas `uEdgeColor` só era lido uma vez no `useMemo` inicial. Corrigido para resincronizar
   (via `Color.set()`, sem realocar) sempre que a prop `edgeColor` mudar.

3. **Sistema de dissolve finalizado e validado sem depender de GLB.**
   Novo componente `MetallicHeroObject.tsx`: usa o shader de `NexusDissolveMaterial` (com um fresnel
   metálico adicionado ao fragment shader) diretamente na esfera-base do protagonista procedural.
   O dissolve só aparece como um pulso triangular (`0 -> 1 -> 0`, limitado a `MAX_VISUAL_DISSOLVE=0.4`)
   durante transições narrativas reais (quando `getCharacterTransition` indica um `secondaryModel`),
   nunca fazendo a silhueta desaparecer por completo. `NexusPrototype.tsx` foi atualizado para usar
   `<MetallicHeroObject ref={headSilhouetteRef} radius={0.9} />` no lugar do `meshPhysicalMaterial`
   estático - todos os outros elementos aprovados (wireframe, anéis biomecânicos, halo) permanecem
   intactos, só a esfera-base ganhou o shader.

4. **`NexusCharacter.tsx`: checagem de disponibilidade de GLB exigia só 1 dos 3 arquivos.**
   Antes, `hasGLBModels` virava `true` só com um `HEAD` bem-sucedido em `humanHead.glb`. Se apenas
   esse arquivo fosse commitado (sem `hybridHead.glb`/`androidHead.glb`), os outros dois
   `useGLTF(path)` lançariam erro real através do `Suspense`, seriam capturados pelo `ErrorBoundary`
   e **a experiência 3D inteira cairia para `WebGLFallback`** por causa de 2 arquivos faltando.
   Corrigido para checar os 3 caminhos em paralelo (`Promise.all`) e só ativar o caminho GLB quando
   todos os 3 responderem OK.

5. **`GLBHeadInstance` sem estratégia de dispose.**
   Adicionado `disposeObject3D()` (percorre a hierarquia clonada, chama `geometry.dispose()`,
   `material.dispose()` e `texture.dispose()` em cada mesh) executado no cleanup do `useEffect` de
   cada instância - protege contra vazamento de VRAM se `hasGLBModels` algum dia alternar ou o
   container desmontar.

6. **Re-render de 60fps reintroduzido em `NexusCharacter.tsx` (regressão nova).**
   O `useFrame` chamava `setTransitionData(transition)` **incondicionalmente todo frame** - o mesmo
   anti-padrão que já havia sido eliminado para `scrollProgress`/`activeSceneId`/`characterState` em
   rodadas anteriores. Corrigido para só disparar o `setState` quando o par
   `primaryModel`/`secondaryModel` efetivamente muda (poucas vezes em todo o scroll), via
   `lastTransitionKeyRef`.

7. **`nexus:webgl-info` `CustomEvent` disparado todo frame mesmo sem ninguém ouvindo.**
   O dispatch para o `DebugHUD` rodava incondicionalmente (alocando um objeto novo a cada frame)
   mesmo quando `?debug3d=1` não está na URL. Corrigido para computar `isDebugActive` uma vez (mesmo
   padrão já usado no próprio `DebugHUD.tsx`) e pular o dispatch inteiro quando desativado.

8. **Isolamento de `Suspense` para o fallback visual de concept-art.**
   `HolographicConceptDisplay` carrega 5 texturas PNG (~10MB no total) via `useTexture`. Como estava
   dentro do mesmo `<Suspense>` que `CameraRig`/`LightsEnvironment`/`NeuralCore`/`NeuralWorld`, um
   carregamento lento dessas imagens bloquearia a cena procedural inteira. Envolvido num
   `<Suspense fallback={null}>` próprio dentro de `NexusCharacter.tsx`, para que a cena 3D principal
   renderize imediatamente independente da velocidade de download dessas imagens.

9. **Limpeza de código morto: shaders órfãos.**
   `src/shaders/nexusDissolve.{vert,frag}` e `src/shaders/metallicDissolve.{vert,frag}` nunca foram
   importados por nenhum arquivo (o shader real vive como string inline em
   `NexusDissolveMaterial.tsx`, já que o projeto não tem loader de `.glsl` configurado). Removidos -
   eram cópias não sincronizadas e o `metallicDissolve.frag` ainda usava laranja
   (`vec3(1.0, 0.35, 0.0)`), uma cor fora da paleta do `DESIGN_SYSTEM.md`.

**Verificação:** `npx tsc --noEmit`, `npm run lint` e `npm run build` rodaram limpos após todas as
mudanças acima (ver histórico desta sessão para os logs completos).

---

## 🧩 O QUE JÁ ESTAVA CORRETO (não foi tocado, apenas confirmado)

- `CameraRig.tsx` como fonte única de verdade a partir de `SCENES.json`, com damping
  framerate-independente e vetores em `useRef` (sem module-scope global).
- `LoadingOverlay.tsx` usando `useProgress()` real, sem timeout artificial, com estado de erro visível.
- `SmoothScroll.tsx`: leak do `gsap.ticker` corrigido, listener de `prefers-reduced-motion` com
  cleanup simétrico.
- `ErrorBoundary.tsx` + `WebGLFallback.tsx` + checagem proativa de `getContext('webgl2')` em
  `SceneCanvas.tsx` antes mesmo de montar o `Canvas`.
- `characterStateMachine.ts` com os 5 estados narrativos em progressão linear correta (sem a
  regressão de `04_ANDROID -> 03_HYBRID` encontrada em rodadas anteriores).
- `HeroOverlay.tsx`/`Navbar.tsx` atualizando telemetria "rápida" (progresso, coordenadas) via
  `useStore.subscribe` + mutação direta de DOM, sem re-render de React por tick de scroll.

---

## 🚧 O QUE AINDA FALTA (para o próximo agente/rodada)

1. **Validação visual num navegador real.** Todas as verificações desta rodada foram estáticas
   (`tsc`/`lint`/`build`) - ninguém confirmou visualmente que o fresnel do `MetallicHeroObject`, o
   pulso de dissolve, e o crossfade do `HolographicConceptDisplay` têm a aparência pretendida.
   Rodar `npm run dev` e revisar as 6 cenas no scroll é o próximo passo antes de dar como "pronto".

2. **`GLBHeadInstance` ainda não aplica nenhum shader de dissolve real.** Hoje ele só renderiza
   `<primitive object={clone} visible={visible} />` cru. Quando os 3 `.glb` chegarem em
   `public/models/nexus/`, o crossfade `dissolveProgress` (já calculado em `nexusTransitions.ts`)
   precisa ser efetivamente aplicado aos materiais de cada `GLBHeadInstance` (provavelmente
   substituindo o material dos meshes nomeados `SKIN`/`TITANIUM`/etc. por variantes do
   `NexusDissolveMaterial`, seguindo a nomenclatura definida em `docs/GLB_SPEC.md`).

3. **`HolographicConceptDisplay` não respeita `devicePerformance`.** As 5 texturas de concept-art
   (~10MB) carregam para todo visitante, independente do tier. O isolamento de `Suspense` (item 8
   acima) evita que isso *bloqueie* a cena, mas não evita o custo de banda/memória em si. Vale
   avaliar se em tier `low` faz sentido pular esse componente inteiramente ou carregar versões
   menores das imagens.

4. **Sem teste manual de responsividade mobile real** (dispositivo físico ou emulador). O tiering de
   performance e os breakpoints Tailwind existentes (`sm:`/`md:`/`lg:`/`xl:`) não foram
   visualmente confirmados nesta rodada.

5. **`preloadNexusGLBs()` (exportado de `NexusCharacter.tsx`) nunca é chamado em lugar nenhum.**
   Continua sendo uma API pronta para uso futuro, não uma função ativa. Quando os GLBs chegarem, vale
   chamá-la cedo (ex.: no mesmo `useEffect` que já faz a checagem de disponibilidade) para começar o
   download antes mesmo do usuário rolar até a cena que precisa do modelo.

---

## 📋 Mandato de leitura (lembrete)

Antes de qualquer mudança em `src/components/three/`, leia (nesta ordem):
`AGENTS.md` -> `docs/MASTER.md` -> `docs/DESIGN_SYSTEM.md` -> `docs/MOTION_SYSTEM.md` ->
`docs/THREE_SYSTEM.md` -> `docs/PERFORMANCE.md` -> `docs/CHARACTER_BIBLE.md` -> `docs/GLB_SPEC.md` ->
**este arquivo**.
