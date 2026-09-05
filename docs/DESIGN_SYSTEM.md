# DESIGN_SYSTEM.md - Diretrizes Visuais NEXUS

## 🎨 PALETA DE CORES MONOCROMÁTICA & SCI-FI

A paleta visual de NEXUS é sombria, minimalista e tecnológica, construída sobre tons de preto profundo, metais frios e um accent ciano sutil.

| Nome Token | HEX | HSL | Aplicação |
| :--- | :--- | :--- | :--- |
| `--bg-nexus` | `#050505` | `hsl(0, 0%, 2%)` | Fundo principal da aplicação |
| `--titanium-dark` | `#0F1115` | `hsl(220, 16%, 7%)` | Molduras HUD e retículos discretos |
| `--titanium-border`| `#1E232B` | `hsl(216, 18%, 14%)` | Divisórias finas de telemetria |
| `--silver-text` | `#9CA8B6` | `hsl(212, 16%, 66%)` | Microtipografia técnica e dados |
| `--pure-white` | `#F8FAFC` | `hsl(210, 40%, 98%)` | Tipografia editorial principal |
| `--cyan-accent` | `#00F0FF` | `hsl(184, 100%, 50%)` | Accent sutil para pulsos neurais e glow |

---

## 🔤 TYPOGRAPHY SYSTEM

1. **Title Font (Editorial Grotesk):**
   - Sans-serif de proporções gigantescas (`text-6xl` a `text-9xl`), All-Caps, tracking condensado ou ligeiramente expandido (`tracking-tight` / `tracking-wider`).
2. **Telemetry Font (Monospace Technical):**
   - JetBrains Mono / Space Mono (`font-mono`), tamanhos micro (`text-[10px]` a `text-xs`), tracking largo (`tracking-[0.25em]`).

---

## 🖥️ INTERFACE HUD DE TELEMETRIA COGNITIVA

Elementos táticos de interface distribuídos no viewport 2D:

- Retículos de canto (`NXS // 01`, `SYSTEM ONLINE`, `NEURAL STATUS`).
- Indicadores de dados dinâmicos (`VISION`, `MEMORY`, `COGNITIVE LOAD`).
- Barra discreta de progresso de scroll em tempo real (`0.0% -> 100.0%`).
- Coordenadas vivas no espaço (`X: 0.42 / Y: -0.18 / Z: 3.12`).

---

## ⛔ O QUE NÃO FAZER

- ❌ NÃO transformar o site em uma estética "neon cyberpunk" apelativa ou estampa gamer.
- ❌ NÃO criar cards SaaS corporativos com sombras arredondadas.
- ❌ NÃO copiar personagens conhecidos da ficção científica.
