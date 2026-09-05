# NEXUS GLB MODEL SPECIFICATION & ASSET MANIFEST

> **Documento Oficial de Especificação Técnica para Produção e Integração de Modelos 3D GLB**  
> **Projeto:** NEXUS — Experimental 3D Cinematic Experience  
> **Versão:** 1.0.0 — Pipeline Pre-GLB Readiness

---

## 🎯 1. VISÃO GERAL E CONCEITO

O protagonista NEXUS transita cinematicamente por 5 estados narrativos ao longo do scroll do site. Três modelos GLB principais cobrirão essa evolução espacial e material:

| Estado Narrativo | Asset GLB Destino | Papel de Integração Shader |
| :--- | :--- | :--- |
| **`01_HUMAN`** | `/models/nexus/humanHead.glb` | Base anatômica pura com materiais realistas. |
| **`02_SKIN_REVEAL`** | `humanHead.glb` → `hybridHead.glb` | Crossfade / Dissolve via `NexusDissolveMaterial` (`uProgress`). |
| **`03_HYBRID`** | `/models/nexus/hybridHead.glb` | 50% Humano / 50% Biomecânico com titânio e cerâmica fosca. |
| **`04_ANDROID`** | `/models/nexus/androidHead.glb` | Chassi sintético completo com ligas de titânio e núcleo synaptic. |
| **`05_NEXUS_FINAL`** | `hybridHead.glb` | Reconstrução final com materiais de emissão ciana e convergência. |

---

## 📐 2. ALINHAMENTO ESPACIAL E TRANSFORMS (REQUISITOS RÍGIDOS)

Para garantir que a transição via shader e crossfade ocorra sem desalinhamentos visuais (*pop-in* ou deslocamentos), **TODOS OS 3 MODELOS DEVEM OBEDECER RIGOROSAMENTE**:

1. **Origem do Objeto `(0, 0, 0)`:**
   - A origem local do modelo deve estar localizada na junção anatômica do pescoço com a base do crânio.
2. **Escala:**
   - Escala real 1:1 em metros (`1 unit = 1 meter`).
   - `Scale = (1.0, 1.0, 1.0)` sem rotação ou escala residual desaplicada (`Freeze Transforms` / `Apply All Transforms` no Blender/Maya).
3. **Orientação do Eixo:**
   - **`+Z`**: Olhar frontal (frente do personagem).
   - **`+Y`**: Topo da cabeça (orientação vertical superior).
   - **`+X`**: Orelha esquerda do personagem (direita da câmera em visão frontal).
4. **Alinhamento Facial Identico:**
   - Os olhos, nariz e boca de `humanHead.glb`, `hybridHead.glb` e `androidHead.glb` precisam compartilhar as mesmas coordenadas espaciais em estado de repouso.

---

## ⚡ 3. ORÇAMENTO DE GEOMETRIA E PERFORMANCE (BUDGETS)

| Modelo | Limite Máximo de Triângulos | Draw Calls Alvo | Uso Recomendado |
| :--- | :--- | :--- | :--- |
| **`humanHead.glb`** | ≤ **80.000** tris | 1 - 3 | Pele realista, olhos, cabelo anatômico. |
| **`hybridHead.glb`** | ≤ **120.000** tris | 2 - 4 | Placas anatômicas divididas e conectores internos. |
| **`androidHead.glb`** | ≤ **150.000** tris | 2 - 5 | Estrutura biomecânica detalhada e lentes ópticas. |

- **Topologia:** Quad-dominant ou triangulada de forma limpa, sem *N-gons*, sem vértices duplicados e sem faces internas ocultas invisíveis à câmera.
- **Normal Maps:** Normais suavizadas (*Smooth Shading*) pré-calculadas no export.

---

## 🎨 4. NORMATIZAÇÃO E NOMEAÇÃO DE MATERIAIS

Os nomes dos materiais no arquivo GLB devem seguir estritamente o padrão abaixo para permitirem injeção automática de shaders customizados no React Three Fiber:

| Nome do Material (GLB) | Descrição do Canal PBR | Propriedades Visuais Esperadas |
| :--- | :--- | :--- |
| **`SKIN`** | Subsurface Scattering / Normal / Roughness | Pele humana biológica fosca e realista. |
| **`EYES`** | Glass / Cornea / Iris Map | Olho anatômico com refração e profundidade. |
| **`HAIR`** | Anisotropic / Alpha Cutout | Cabelo e sobrancelhas sutis. |
| **`TITANIUM`** | Metallic 1.0 / Roughness 0.25 | Titânio escuro escovado (estrutura biomecânica). |
| **`CERAMIC`** | Metallic 0.0 / Roughness 0.1 | Cerâmica sintética fosca alta precisão (branco titânio/cinza). |
| **`CYAN_EMISSIVE`** | Emissive Map `#00f3ff` | Circuitos e sinapses luminosas cianas sutis (NEXUS HUD). |
| **`MECHANICAL_INNER`** | Metallic 0.9 / Roughness 0.4 | Engrenagens internas e fibra de carbono. |
| **`OPTIC_LENS`** | Glass / Transmission 0.9 | Lentes sintéticas e sensores oculares android. |

---

## 🖼️ 5. ESPECIFICAÇÃO DE TEXTURAS E COMPRESSÃO

1. **Resolução:**
   - **Texturas Padrão:** 2048×2048 (2K) PNG/WebP em mapa ORM (Occlusion/Roughness/Metallic no mesmo arquivo RGB).
   - **Texturas Críticas (Skin Normal / Eye Iris):** 4094×4094 (4K) somente onde justificável visualmente.
2. **Compressão para Produção WebGL:**
   - **Geometria:** Compressão Draco de alta precisão (`quantization: position 14, normal 10, uv 12`).
   - **Texturas:** KTX2 / Basis Universal ou WebP otimizado via `@gltf-transform`.

---

## 🔍 6. CHECKLIST DE VALIDAÇÃO ANTES DO COMMIT DO GLB

- [ ] O arquivo abre perfeitamente no [gltf-viewer.donmccurdy.com](https://gltf-viewer.donmccurdy.com/).
- [ ] Nenhum nó no GLB possui transformações não zeradas (`position [0,0,0]`, `rotation [0,0,0]`, `scale [1,1,1]`).
- [ ] Todos os materiais seguem a nomenclatura da Tabela 4.
- [ ] O tamanho do arquivo `.glb` compactado está abaixo de **12 MB** por modelo.
