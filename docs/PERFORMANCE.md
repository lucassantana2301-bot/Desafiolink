# PERFORMANCE.md - Otimizações e Estratégia Adaptativa 3D

## ⚡ ESTRATÉGIA DE TIERS DE PERFORMANCE

O site detecta as capacidades de hardware do cliente durante os primeiros 500ms e ajusta os parâmetros visuais via Zustand store (`devicePerformance`):

| Configuração | High-End Desktop | Low-End / Integrated GPU | Mobile Device |
| :--- | :--- | :--- | :--- |
| **DPR (Device Pixel Ratio)** | `[1, 2]` (nativo) | `[1, 1.25]` | `1.0` fixo |
| **Pós-Processamento** | Bloom + Vignette + Chromatic Aberration | Vignette apenas | Desativado (`null`) |
| **Partículas (Faíscas)** | 2.500 instâncias | 500 instâncias | 100 instâncias |
| **Shadow Maps** | Enabled (`softShadows`, 2048px) | Disabled | Disabled |
| **Framerate Cap** | 60 - 120 FPS | 60 FPS | 30 - 60 FPS |

---

## 📦 OTIMIZAÇÃO DE ASSETS (MODELS & TEXTURES)

1. **Draco Compression (GLTF/GLB):**
   - Todos os modelos 3D em `public/models/` devem ser comprimidos via `gltf-pipeline` com compressão Draco.
   - Tamanho máximo por modelo 3D: **< 3.5 MB**.

2. **KTX2 / WebP Textures:**
   - Texturas de mapas normais e roughness devem ser servidas em formato otimizado WebP ou KTX2.
   - Resolução máxima de textura: **2048x2048** para objetos hero, **1024x1024** para secundários.

3. **Dynamic Imports & Lazy Loading:**
   - A `SceneCanvas` deve ser carregada com `next/dynamic` usando `ssr: false` para evitar tentar executar WebGL no servidor durante a hidratação SSR.

```typescript
// Exemplo de Dynamic Import da Scene 3D no Next.js
const SceneCanvas = dynamic(
  () => import('@/components/three/SceneCanvas'),
  { ssr: false, loading: () => <CanvasLoader /> }
);
```

---

## ♿ REDUCED MOTION PREFERENCE

Para usuários com preferência ativada de movimento reduzido (`prefers-reduced-motion: reduce`):

- As transições de câmera são suavizadas para cortes diretos entre waypoints.
- A auto-rotação rápida de objetos é desativada.
- Lenis smooth scroll é desabilitado, voltando ao scroll padrão do navegador.
