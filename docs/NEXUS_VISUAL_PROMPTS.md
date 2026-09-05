# NEXUS — CONCEPT ART VISUAL PROMPTS

Este documento reúne os prompts profissionais otimizados para geradores de imagem AI (Midjourney, DALL-E 3, Stable Diffusion XL, Imagen) para criar as concept arts oficiais do personagem **NEXUS** mantendo rigorosa consistência visual entre os 4 estados.

---

## 🎯 REGRAS DE CONSISTÊNCIA DE PROMPT

Para assegurar que todos os geradores produzam o **mesmo personagem** com o **mesmo enquadramento e iluminação**:

- **Aspect Ratio:** `--ar 16:9`
- **Framing:** `Cinematic close-up portrait, bust shot, centered composition`
- **Background:** `Solid pitch-black dark studio background (#050505), subtle atmospheric fog`
- **Lighting:** `Dramatic clinical cold side lighting, high contrast key light from left (45 degrees), deep dark shadows`
- **Camera Spec:** `Shot on 85mm lens, f/1.8 aperture, shallow depth of field, photorealistic, 8k resolution`
- **Facial Features:** `Young adult male/android, sharp jawline, high cheekbones, calm and serene intelligent expression, no smile, looking directly into camera`

---

## 📸 PROMPTS OFICIAIS DOS 4 ESTADOS

### PROMPT 01: `01_HUMAN`

```text
Cinematic 16:9 portrait of a young adult male with sharp intelligent facial features, high cheekbones, and a calm, serene expression looking directly at the camera. Pure biological human state. Natural realistic skin texture with subtle pores, clinical cold key lighting from the left creating deep dramatic shadows on the right. Dark titanium background (#050505), high-fashion sci-fi editorial aesthetic, shot on 85mm f/1.8 lens, photorealistic, hyper-detailed, neutral lips, calm intense gaze, zero robotic elements, sophisticated minimalism --ar 16:9 --v 6.0 --style raw
```

---

### PROMPT 02: `02_SKIN_REVEAL`

```text
Cinematic 16:9 portrait of the exact same young adult male, same facial structure and serene calm expression looking directly into camera. Transition state: skin along the right temple and jawline is cleanly dissolving in geometric precision, revealing intricate underlying dark titanium biomechanical structures and ceramic plates beneath the skin. Left side remains realistic human skin. Clinical cold side lighting, subtle silver reflection on mechanical parts, dark background (#050505), no blood, medical-tech precision, 85mm lens, photorealistic, hyper-detailed sci-fi editorial art --ar 16:9 --v 6.0 --style raw
```

---

### PROMPT 03: `03_HYBRID`

```text
Cinematic 16:9 portrait of the exact same character, 50% human and 50% machine hybrid state. Left half of the face is realistic human skin with a calm intelligent gaze. Right half of the face is a sophisticated biomechanical assembly of matte black ceramic plates, dark titanium cables, and micro-machined fiber optics. The right synthetic eye has a sapphire lens with an extremely subtle cyan light emission (#00F0FF). Clinical cold side lighting, high contrast, dark pitch-black background (#050505), original premium sci-fi design, not bulky, high-fashion android, photorealistic 8k --ar 16:9 --v 6.0 --style raw
```

---

### PROMPT 04: `04_ANDROID`

```text
Cinematic 16:9 portrait of the exact same character in full 100% android mechanical state. Entire facial structure is sculpted from dark matte titanium, black ceramic plates, and ultra-precise biomechanical layers that closely follow the original human head anatomy. Both synthetic eyes feature intricate sapphire lenses with faint cyan glow rings (#00F0FF). Serene, calm, intelligent posture looking directly forward. Minimalist rim lighting highlighting titanium edges, pitch-black background (#050505), highly sophisticated, non-bulky, futuristic AI laboratory design, photorealistic, 8k resolution --ar 16:9 --v 6.0 --style raw
```

---

## 🎨 NEGATIVE PROMPTS (O QUE EVITAR NAS GERAÇÕES)

Sempre inclua os seguintes termos de exclusão ao gerar as imagens:

```text
ugly, distorted, bulky armor, iron man, terminator, cyborg, red eyes, neon cyberpunk, bright colorful lights, gaming aesthetic, cartoon, anime, illustration, 3d render look, low quality, blood, gore, angry expression, monstrous features, military suit, shoulder pads
```
