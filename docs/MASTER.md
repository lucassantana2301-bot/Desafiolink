# MASTER.md - Conceito e Arquitetura Narrativa JCS Metalúrgica

## 🏛️ VISÃO GERAL DO PROJETO

A **JCS Metalúrgica** é uma referência em engenharia industrial de precisão, usinagem pesada e fabricação de componentes metálicos de alta performance. 

Este site foi concebido não como um portal corporativo tradicional, mas como uma **experiência cinematográfica 3D interativa guiada por scroll**. O objetivo é provocar um impacto visual equivalente aos melhores projetos premiados no Awwwards, unindo estética industrial, WebGL de alta tecnologia e storytelling técnico.

---

## 🎯 OS QUATRO PILARES CONCEITUAIS

1. **METAL (Matéria-Prima & Solidez):** A densidade do aço, superfícies escovadas, reflexos anisotrópicos e usinagem bruta.
2. **PRECISION (Exatidão & Tolerância Zero):** Traços técnicos HUD, desenho industrial em milímetros, superfícies espelhadas sem imperfeições.
3. **ENGINEERING (Inteligência & Método):** Desmontagem explodida (*exploded view*), componentes encaixando com cálculo milimétrico.
4. **TRANSFORMATION (Do Bruto ao Refinado):** A metamorfose do bloco metálico bruto no componente industrial de alta precisão através do calor, faíscas e usinagem CNC.

---

## 🎬 ARQUITETURA NARRATIVA (LINE-UP DE CENAS)

O scroll da página opera como uma **timeline de produção cinematográfica** de 0.0 a 1.0 (0% a 100% de progresso):

### SCENE 01: HERO CINEMATOGRÁFICO `(Scroll: 0.0 → 0.15)`
- **Visual:** Fundo preto absoluto. Iluminação rasteira abrindo sombras volumétricas. Objeto metálico monolítico central flutuando em rotação sutil.
- **Tipografia Editorial:**
  ```text
  JCS
  PRECISION FORGED IN STEEL
  ```
- **Atmosfera:** Neblina sutil de estúdio industrial, reflexos metálicos pesados.

### SCENE 02: APROXIMAÇÃO & DETALHES DE SUPERFÍCIE `(Scroll: 0.15 → 0.35)`
- **Visual:** Conforme o usuário rola, a câmera faz um zoom in cinemático na micro-textura do objeto.
- **Dynamic Response:** A velocidade de rotação aumenta, a iluminação direcional altera os reflexos no metal escovado, e sutis partículas metálicas entram na profundidade de campo (DoF).

### SCENE 03: EXPLODED VIEW `(Scroll: 0.35 → 0.55)`
- **Visual:** O monolito metálico central desmembra-se dramaticamente em múltiplos componentes de alta tolerância.
- **Texto Narrativo:**
  ```text
  ENGINEERED
  WITH PRECISION
  ```
- **HUD Data:** Linhas técnicas de cotação e dados de tolerância aparecem em overlay no espaço 3D.

### SCENE 04: ATRAVESSANDO A MATÉRIA `(Scroll: 0.55 → 0.75)`
- **Visual:** A câmera atravessa o núcleo da composição explodida.
- **Efeitos:** Explosão controlada de partículas de metal incandescentes / faíscas de solda/usinagem CNC.
- **Texto Narrativo:**
  ```text
  FROM RAW MATERIAL
  TO PRECISION
  ```

### SCENE 05: REORGANIZAÇÃO E ESTRUTURA `(Scroll: 0.75 → 0.90)`
- **Visual:** As peças desmembradas voltam a reorganizar-se com precisão magnética.
- **Efeitos:** Laser verde/azul escaneia a peça montada, revelando o design industrial acabado.

### SCENE 06: TECHNICAL BLUEPRINT & CONFIGURADOR `(Scroll: 0.90 → 1.00)`
- **Visual:** O modelo PBR metálico transita suavemente via shader para modo Desenho Técnico / Wireframe neon industrial.
- **Interação:** Transição suave para o **Configurador de Orçamento Industrial (RFQ)**, permitindo ao cliente selecionar tolerâncias, materiais e enviar cotação técnica.

---

## 🏗️ REQUISITOS TÉCNICOS CHAVE

- **Zero Jank Scrolling:** Smooth scroll sincronizado com GSAP ScrollTrigger via Lenis.
- **Responsive 3D Viewport:** DPR dinâmico com fallback para GPUs integradas e dispositivos móveis.
- **Strict Architecture:** Estado global reativo sincronizando Three.js com UI via Zustand.
