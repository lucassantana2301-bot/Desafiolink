# AGENTS.md - NEXUS System Guidelines & Operational Protocols

Bem-vindo ao projeto **NEXUS — Experimental 3D Cinematic Experience**.

Este documento define os papéis, responsabilidades e diretrizes obrigatórias para qualquer agente (humano ou de IA) que trabalhe na base de código deste projeto.

---

## 🚨 MANDATO OBRIGATÓRIO

**Antes de escrever ou alterar qualquer código, TODO agente DEVE obrigatoriamente ler e assimilar os seguintes documentos:**

1. [`docs/MASTER.md`](file:///c:/Users/alexa/OneDrive/Área%20de%20Trabalho/Linkdinpf/docs/MASTER.md) - Visão geral do projeto, conceito NEXUS ("WHERE DOES HUMAN END AND MACHINE BEGIN?"), direção de arte sci-fi e fluxo narrativo das 6 Cenas.
2. [`docs/DESIGN_SYSTEM.md`](file:///c:/Users/alexa/OneDrive/Área%20de%20Trabalho/Linkdinpf/docs/DESIGN_SYSTEM.md) - Tokens visuais, paleta monochrome (preto, titânio, ciano sutil), tipografia Grotesk/Mono e interface HUD de telemetria cognitiva.
3. [`docs/MOTION_SYSTEM.md`](file:///c:/Users/alexa/OneDrive/Área%20de%20Trabalho/Linkdinpf/docs/MOTION_SYSTEM.md) - Arquitetura de movimento GSAP + ScrollTrigger (~600vh), Lenis smooth scroll e Framer Motion para microinterações de UI.
4. [`docs/THREE_SYSTEM.md`](file:///c:/Users/alexa/OneDrive/Área%20de%20Trabalho/Linkdinpf/docs/THREE_SYSTEM.md) - R3F, Drei, CameraRig keyframing, NexusCharacter, NexusPrototype, MetallicHeroObject, NeuralCore, NeuralWorld (Points/BufferGeometry) e pós-processamento.
5. [`docs/CHARACTER_BIBLE.md`](file:///c:/Users/alexa/OneDrive/Área%20de%20Trabalho/Linkdinpf/docs/CHARACTER_BIBLE.md) - Os 5 estados narrativos oficiais do protagonista e o conjunto de concept-art aprovado.
6. [`docs/GLB_SPEC.md`](file:///c:/Users/alexa/OneDrive/Área%20de%20Trabalho/Linkdinpf/docs/GLB_SPEC.md) - Especificação técnica obrigatória para os 3 modelos GLB (`humanHead`/`hybridHead`/`androidHead`).
7. [`docs/PROJECT_STATUS.md`](file:///c:/Users/alexa/OneDrive/Área%20de%20Trabalho/Linkdinpf/docs/PROJECT_STATUS.md) - **Leitura obrigatória antes de qualquer mudança em `src/components/three/`.** Registro vivo do que já foi corrigido e do que ainda falta, verificado em código (não apenas reportado).

---

## 👥 PAPÉIS E RESPONSABILIDADES DOS AGENTES

### 1. 🎬 Creative Director
- **Foco:** Direção de arte cinematográfica, atmosfera sci-fi minimalista, storytelling visual e a pergunta central: *"WHERE DOES HUMAN END AND MACHINE BEGIN?"*.
- **Responsabilidades:**
  - Garantir a estética sofisticada e sombria (Monocromático, Titânio, Biomecânica, Redes Neurais, Ciano sutil).
  - Impedir que o site pareça um template SaaS, um dashboard corporativo ou um visual gamer neon genérico.
  - Assegurar composições assimétricas, espaço negativo generoso e peso cinematográfico nas transições.

### 2. 💻 Frontend Engineer
- **Foco:** Arquitetura Next.js (App Router), TypeScript, Tailwind CSS e estrutura de componentes UI/Layout.
- **Responsabilidades:**
  - Manter código TypeScript estritamente tipado (`types/`).
  - Desenvolver elementos de interface HUD experimental em `components/ui/`.
  - Integrar Lenis smooth scroll e gerenciar layout responsivo sem quebrar o canvas fixed.

### 3. 🌀 Motion Engineer
- **Foco:** Orquestração de movimento, GSAP Timelines, ScrollTrigger (~600vh) e sincronização de scroll.
- **Responsabilidades:**
  - Controlar a timeline mestre conectada ao progresso global do scroll (`scrollProgress` de 0 a 1 em `store/useStore.ts`).
  - Sincronizar Lenis com GSAP ScrollTrigger sem *jank* ou perda de performance.
  - Utilizar Framer Motion exclusivamente para microinterações de UI e texto.

### 4. 🧊 WebGL / Three.js Engineer
- **Foco:** React Three Fiber, Three.js, Points/BufferGeometry, Instancing, Camera Keyframing e Pós-processamento.
- **Responsabilidades:**
  - Desenvolver e otimizar os componentes 3D: `NexusPrototype`, `NeuralCore` e `NeuralWorld`.
  - Configurar o `CameraRig` com interpolação suave (position, rotation, target, FOV).
  - Manter alta taxa de quadros (60 FPS) usando `BufferGeometry` eficientes no mundo neural.

### 5. ⚡ Performance Engineer
- **Foco:** Framerate (60 FPS), orçamentos de memória WebGL e adaptações móveis.
- **Responsabilidades:**
  - Implementar tiers de performance (`high`, `low`, `mobile`) via Zustand.
  - Aplicar `adaptive DPR` e responder à preferência `prefers-reduced-motion`.

### 6. 🧪 QA Reviewer
- **Foco:** Qualidade de código, compilação limpa e testes de integração.
- **Responsabilidades:**
  - Garantir zero erros de TypeScript (`npx tsc --noEmit`) e zero avisos de ESLint.
  - Verificar integridade do build (`npm run build`).

---

## 🛠️ REGRAS DE CÓDIGO E CONVENÇÕES
- Todo arquivo React com interatividade client-side deve conter `'use client'`.
- Nomes de componentes 3D ficam em `src/components/three/`.
- Todos os estados globais pertencem ao `store/useStore.ts`.
