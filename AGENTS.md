# AGENTS.md - System Guidelines & Operational Protocols

Bem-vindo ao projeto **JCS Metalúrgica 3D Cinematic Website**.

Este documento define os papéis, responsabilidades e diretrizes obrigatórias para qualquer agente (humano ou de IA) que trabalhe na base de código deste projeto.

---

## 🚨 MANDATO OBRIGATÓRIO

**Antes de escrever ou alterar qualquer código, TODO agente DEVE obrigatoriamente ler e assimilar os seguintes documentos:**

1. [`docs/MASTER.md`](file:///c:/Users/alexa/OneDrive/Área%20de%20Trabalho/Linkdinpf/docs/MASTER.md) - Visão geral do projeto, conceito JCS, diretrizes cinematográficas e fluxo narrativo das 6 Cenas.
2. [`docs/DESIGN_SYSTEM.md`](file:///c:/Users/alexa/OneDrive/Área%20de%20Trabalho/Linkdinpf/docs/DESIGN_SYSTEM.md) - Tokens visuais, paleta de cores (preto, grafite, aço), tipografia editorial e padrões de interface HUD técnico.
3. [`docs/MOTION_SYSTEM.md`](file:///c:/Users/alexa/OneDrive/Área%20de%20Trabalho/Linkdinpf/docs/MOTION_SYSTEM.md) - Arquitetura de movimento GSAP + ScrollTrigger, Lenis smooth scroll e Framer Motion para microinterações.
4. [`docs/THREE_SYSTEM.md`](file:///c:/Users/alexa/OneDrive/Área%20de%20Trabalho/Linkdinpf/docs/THREE_SYSTEM.md) - Cenas 3D, React Three Fiber, @react-three/drei, CameraRig, shaders, iluminação industrial e pós-processamento.

---

## 👥 PAPÉIS E RESPONSABILIDADES DOS AGENTES

### 1. 🎬 Creative Director
- **Foco:** Direção de arte, atmosfera visual, storytelling 3D e consistência da marca JCS Metalúrgica.
- **Responsabilidades:**
  - Garantir a estética cinematográfica industrial premium (Metal, Precisão, Engenharia, Transformação).
  - Validar transições de cena, composições assimétricas e tipografia editorial.
  - Assegurar que o site **não** se pareça com um template corporativo comum.

### 2. 💻 Frontend Engineer
- **Foco:** Arquitetura Next.js (App Router), TypeScript, Tailwind CSS e estrutura de componentes UI/Layout.
- **Responsabilidades:**
  - Manter código TypeScript estritamente tipado (`types/`).
  - Desenvolver elementos de interface HUD industrial em `components/ui/`.
  - Integrar Lenis smooth scroll e gerenciar layout responsivo.
  - Garantir compatibilidade cross-browser e acessibilidade sem comprometer a visão criativa.

### 3. 🌀 Motion Engineer
- **Foco:** Orquestração de movimento, GSAP Timelines, ScrollTrigger e sincronização de scroll.
- **Responsabilidades:**
  - Controlar a timeline mestre conectada ao progresso global do scroll (`scrollProgress` de 0 a 1 em `store/useStore.ts`).
  - Sincronizar Lenis com GSAP ScrollTrigger sem *jank* ou perda de performance.
  - Utilizar Framer Motion exclusivamente para micro-interações de UI e texto (NÃO usar Framer Motion para controlar a cena 3D principal).

### 4. 🧊 WebGL / Three.js Engineer
- **Foco:** React Three Fiber, Three.js, Shaders GLSL, Iluminação, Materiais e Pós-processamento.
- **Responsabilidades:**
  - Construir e otimizar a `SceneCanvas` reutilizável e o `CameraRig`.
  - Desenvolver materiais metálicos com reflexão física realista (PBR) e shaders customizados em `shaders/`.
  - Configurar partículas industriais, faíscas metálicas e montagem de vistas explodidas (*exploded view*).

### 5. ⚡ Performance Engineer
- **Foco:** Taxa de quadros (60 FPS), orçamentos de memória, otimização WebGL e adaptações mobile.
- **Responsabilidades:**
  - Implementar tiers de performance (`high`, `low`, `mobile`) via Zustand.
  - Otimizar carregamento de modelos GLTF/GLB (Draco compression) e texturas (KTX2/WebP).
  - Aplicar `adaptive DPR` (Device Pixel Ratio) e garantir modo `reduced-motion`.

### 6. 🧪 QA Reviewer
- **Foco:** Qualidade de código, compilação limpa, linters e testes de integração.
- **Responsabilidades:**
  - Garantir zero erros de TypeScript (`tsc --noEmit`) e zero avisos de ESLint.
  - Verificar integridade do build (`npm run build`).
  - Validar suavidade das transições em múltiplos dispositivos.

---

## 🛠️ REGRAS DE CÓDIGO E CONVENÇÕES
- Todo arquivo React com interatividade client-side deve conter `'use client'`.
- Nomes de arquivos 3D e componentes de cena ficam em `src/components/three/` e `src/scenes/`.
- Todos os estados globais de scroll/cena pertencem ao `store/useStore.ts`.
- Mantenha a separação entre componentes UI 2D (`components/ui/`) e Canvas 3D (`components/three/`).
