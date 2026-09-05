# PERFORMANCE.md - Diretrizes de Performance NEXUS

## ⚡ ESTRATÉGIA DE REDE NEURAL E PONTOS HIGH-PERFORMANCE

A Scene 05 (`NeuralWorld`) renderiza centenas de nós e conexões neurais no espaço 3D. Para garantir 60 FPS consistentes em qualquer hardware:

1. **Uso de `BufferGeometry` Única:**
   - Todos os pontos e linhas da matriz neural utilizam um único buffer de atributos (`Float32Array`).
   - Evita a criação de centenas de objetos `THREE.Mesh` ou instâncias React separadas.
2. **Dynamic DPR Scaling:**
   - Desktop High: `[1, 2]`
   - Mobile / Low GPU: `1.0` fixo
3. **Pós-processamento Conservador:**
   - Bloom com threshold alto (0.75) para que apenas o ciano sutil dos pulsos neurais emita brilho.
   - Selective rendering quando a câmera está dentro do mundo neural.
