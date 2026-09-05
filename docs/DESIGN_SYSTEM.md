# DESIGN_SYSTEM.md - Sistema Visual JCS Metalúrgica

## 🎨 PALETA DE CORES (INDUSTRIAL METALLIC PALETTE)

O sistema de cores é derivado de metais industriais, ambiente de fundição e luzes de alta precisão de laboratório.

| Nome Token | HEX | HSL | Aplicação |
| :--- | :--- | :--- | :--- |
| `--bg-darkness` | `#050505` | `hsl(0, 0%, 2%)` | Fundo principal da aplicação |
| `--metal-graphite` | `#121417` | `hsl(210, 13%, 8%)` | Cards HUD, superfícies de interface |
| `--steel-border` | `#2A2F36` | `hsl(214, 12%, 19%)` | Linhas de cotação e divisórias HUD |
| `--steel-light` | `#8E99A6` | `hsl(213, 12%, 60%)` | Textos secundários técnicos |
| `--pure-white` | `#F5F7FA` | `hsl(210, 20%, 97%)` | Tipografia editorial de alto contraste |
| `--spark-accent` | `#FF5500` | `hsl(20, 100%, 50%)` | Accent sutil (faíscas, alertas de precisão) |
| `--cyan-scan` | `#00F0FF` | `hsl(184, 100%, 50%)` | Linhas de escaneamento laser técnico |

---

## 🔤 TYPOGRAPHY SYSTEM

O contraste entre **tipografia editorial ousada** e **mono-espaçada técnica** cria o tom de alta engenharia.

### 1. Title Font (Editorial & High-Fashion Industrial)
- **Family:** Custom Display / Sans-Serif Editorial (`font-display`)
- **Estilo:** All-caps, tracking ajustado, proporções clássicas.
- **Uso:** Títulos de cena ("JCS", "PRECISION FORGED IN STEEL").

### 2. Technical HUD Font (Engineering Monospace)
- **Family:** JetBrains Mono / Space Mono (`font-mono`)
- **Estilo:** Maiúsculas, tracking largo (`tracking-widest`), tamanhos reduzidos (10px - 12px).
- **Uso:** Coordenadas de câmera, indicadores de tolerances, progresso de scroll em tempo real.

---

## 🖥️ ELEMENTOS DE INTERFACE HUD (HEADS-UP DISPLAY)

A interface 2D não deve cobrir a cena 3D, mas sim comportar-se como um visor tático de precisão industrial:

1. **Crosshairs e Grid Lines:** Marcadores finos de canto (`+`, `[ ]`, `-- --`).
2. **Readouts Dinâmicos:** Exibição contínua do progresso do scroll (`SCROLL_POS: 0.428`), framerate (`FPS: 60`), e cena ativa (`SCENE_03 // EXPLODED`).
3. **Espaço Negativo Generoso:** 70%+ do viewport é reservado para a valorização da luz e do objeto 3D.
4. **Composição Assimétrica:** Títulos desalinhados propositalmente com margens técnicas e numeração indexada (`01 // 06`).

---

## ⛔ O QUE NÃO FAZER (DESIGN ANTI-PATTERNS)

- ❌ NÃO usar cards arredondados genéricos (`rounded-2xl` com sombras suaves).
- ❌ NÃO usar gradientes coloridos vibrantes estilo "SaaS marketing web".
- ❌ NÃO colocar botões coloridos chamativos com cantos redondos tipo pílula.
- ❌ NÃO usar ilustrações planas (*flat design*) ou ícones simplistas de vetor corporativo.
