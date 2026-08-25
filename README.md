# Horizonte

Um site sobre buracos negros — só front-end, sem back-end.

A página é uma descida. Cada seção é marcada pela distância até a singularidade em
raios de Schwarzschild — 10.000 rₛ, 3 rₛ (última órbita estável), 1,5 rₛ (esfera de
fótons), 1 rₛ (horizonte), 0 — e essa ordem carrega informação de verdade: você está
caindo. Depois da última seção a tela escurece por completo, e o rodapé aparece do
outro lado do horizonte.

```bash
npm install
npm run dev
```

## O buraco negro

O fundo não é vídeo nem imagem. É um traçador de geodésicas em WebGL2
(`src/webgl/shaders.ts`): para cada pixel, um raio é integrado pela métrica de
Schwarzschild em coordenadas cartesianas, com o horizonte fixado em `r = 1`.

Nada é desenhado à mão. O anel de fótons, a sombra 2,6 vezes maior que o horizonte,
o disco que se curva por cima e por baixo — tudo isso cai da integração. O disco
carrega feixe relativístico (o lado que se aproxima é amplificado), desvio para o
vermelho gravitacional e rotação diferencial: as camadas internas giram muito mais
rápido que as externas.

Sem three.js, sem GSAP, sem dependência de animação. Só React e um quad.

### Desempenho

Quatro níveis de qualidade, de 240 a 90 passos de integração e de 100% a 52% da
resolução. O primeiro ajuste acontece nos 12 primeiros frames, então uma GPU fraca é
detectada ainda durante o fade-in. O render pausa quando a aba está oculta e quando o
eclipse final fecha. `prefers-reduced-motion` congela a cena e desliga as transições.

Para forçar o nível mais barato — útil para testar em renderizador de software:

```bash
http://localhost:5173/?perf=low
```

## Design

A paleta vem do objeto, não do gosto: um disco de acreção é um gradiente de corpo
negro cisalhado pelo efeito Doppler, então o sistema inteiro de cores é essa rampa —
azul (`#79cdff`) no lado que se aproxima, ouro (`#ffab3d`) no topo, vermelho
(`#d1452f`) no lado que se afasta, sobre um vazio índigo (`#05040a`). A mesma rampa
colore os números das curiosidades, de fora para dentro.

Jost para display (geométrica, bojos circulares — a geometria do próprio objeto),
Archivo para texto, IBM Plex Mono para dados.

Duas regras estruturais valem em todo o site: qualquer coisa que o leitor possa
operar vive num painel de instrumento (`.panel`), e nada mais; e a legibilidade vem
de uma única máscara fixa na viewport (`.veil`), nunca de máscaras por seção — que
se encontram em emendas horizontais visíveis atravessando o objeto.

## Estrutura

```
src/
  webgl/      shaders.ts + o componente de canvas
  lib/        loop de scroll compartilhado, física, cores
  hooks/      reveal, descida, eclipse, motion reduzido
  components/ seções e blocos interativos
  data/       todo o conteúdo e os números, num arquivo só
  styles/     tokens, base, componentes
```

Os números em `src/data/content.ts` são medições reais ou consequência direta delas;
onde a literatura discorda, o texto avisa. As fontes estão no rodapé.
