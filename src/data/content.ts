/**
 * Every number here is a real measurement or a direct consequence of one.
 * Where a value is contested in the literature it is hedged in the copy.
 */

export type Station = {
  id: string;
  /** Distance from the singularity, in Schwarzschild radii. */
  depth: string;
  /** What that distance physically means. */
  note: string;
};

/** The page is a descent. These are the altitudes you pass through. */
export const STATIONS: Station[] = [
  { id: "queda", depth: "∞", note: "observador distante" },
  { id: "o-que-e", depth: "10.000", note: "gravidade newtoniana" },
  { id: "escala", depth: "1.000", note: "esfera de influência" },
  { id: "anatomia", depth: "100", note: "disco externo" },
  { id: "curiosidades", depth: "20", note: "disco interno" },
  { id: "tempo", depth: "3", note: "última órbita estável" },
  { id: "horizonte", depth: "1", note: "horizonte de eventos" },
  { id: "singularidade", depth: "0", note: "—" },
];

// ---------------------------------------------------------------- anatomy --

export type Layer = {
  id: string;
  name: string;
  /** Radius in Schwarzschild radii, as displayed. */
  radius: string;
  /** Fraction of the diagram radius, for the SVG. */
  r: number;
  body: string;
};

export const LAYERS: Layer[] = [
  {
    id: "singularidade",
    name: "Singularidade",
    radius: "0",
    r: 0.012,
    body: "O ponto onde a curvatura vai ao infinito e a relatividade geral para de dar respostas. Não é um lugar que existe no espaço — é um instante no futuro de quem cruzou o horizonte. Ninguém tem uma teoria testada do que há aqui.",
  },
  {
    id: "horizonte",
    name: "Horizonte de eventos",
    radius: "1",
    r: 0.2,
    body: "A superfície onde a velocidade de escape iguala a da luz. Não há parede, nem choque, nem aviso: para quem cai, é um pedaço qualquer de espaço vazio. Só é impossível voltar.",
  },
  {
    id: "fotons",
    name: "Esfera de fótons",
    radius: "1,5",
    r: 0.3,
    body: "A altitude em que a luz orbita. Um raio que chegue exatamente aqui dá voltas antes de escapar ou cair. Se você flutuasse nesse ponto e olhasse para o lado, veria a própria nuca.",
  },
  {
    id: "sombra",
    name: "Sombra",
    radius: "2,6",
    r: 0.52,
    body: "O disco escuro que aparece nas imagens do Event Horizon Telescope. É 2,6 vezes maior que o horizonte: a própria gravidade funciona como lente e amplia a silhueta. A sombra é o que você vê; o horizonte é o que está lá.",
  },
  {
    id: "isco",
    name: "Última órbita estável",
    radius: "3",
    r: 0.6,
    body: "Abaixo daqui nenhuma órbita se sustenta — qualquer matéria espirala para dentro em questão de horas. É por isso que o disco de acreção tem um buraco no meio, e é essa borda que define seu brilho.",
  },
  {
    id: "disco",
    name: "Disco de acreção",
    radius: "3 – 10.000",
    r: 0.94,
    body: "Gás triturado por atrito e cisalhamento até chegar a dezenas de milhões de graus. A borda interna emite em raios X, a externa mal brilha no infravermelho. É a matéria caindo — não o buraco negro — que produz toda a luz.",
  },
];

// -------------------------------------------------------------- curiosity --

export type Fact = {
  value: string;
  unit: string;
  title: string;
  body: string;
};

export const FACTS: Fact[] = [
  {
    value: "0",
    unit: "%",
    title: "Buracos negros não sugam nada",
    body: "Se o Sol fosse trocado por um buraco negro de mesma massa neste segundo, a órbita da Terra não mudaria um metro. A gravidade a 150 milhões de quilômetros depende só da massa, e ela seria idêntica. Ficaríamos no escuro e no frio — não seríamos engolidos.",
  },
  {
    value: "8,9",
    unit: "mm",
    title: "A Terra caberia numa bola de gude",
    body: "Esse é o raio de Schwarzschild do nosso planeta: comprima a Terra inteira abaixo de 8,9 milímetros e ela vira um buraco negro. Para o Sol, o número é 2,95 quilômetros. Para você, é menor que um próton.",
  },
  {
    value: "0,45",
    unit: "kg/m³",
    title: "Um deles é menos denso que o ar",
    body: "A densidade média dentro do horizonte de M87* — massa dividida por volume — é menos da metade da densidade do ar ao nível do mar. Buracos negros supermassivos são gigantes rarefeitos: o raio cresce com a massa, mas o volume cresce com o cubo dela.",
  },
  {
    value: "10⁶⁷",
    unit: "anos",
    title: "Eles evaporam — devagar",
    body: "A radiação Hawking faz um buraco negro de massa solar perder massa até sumir, em cerca de 10⁶⁷ anos. Mas a temperatura dele é de 6×10⁻⁸ K, bem abaixo dos 2,7 K do fundo cósmico. Hoje eles absorvem mais do que emitem: a evaporação só começa quando o Universo esfriar o bastante.",
  },
  {
    value: "5",
    unit: "PB",
    title: "A primeira foto não coube na internet",
    body: "O Event Horizon Telescope combinou oito radiotelescópios para fotografar M87* em 2019. Os cinco petabytes de dados brutos foram gravados em discos rígidos e despachados de avião, porque transmitir teria sido mais lento. Os discos do Polo Sul só puderam sair meses depois, no fim do inverno antártico.",
  },
  {
    value: "3",
    unit: "M☉",
    title: "Três sóis viraram som",
    body: "Em 14 de setembro de 2015 o LIGO registrou a fusão de dois buracos negros de 36 e 29 massas solares. O resultado teve 62 — as três massas solares que faltam saíram como ondas gravitacionais em uma fração de segundo, com pico de potência superior ao de toda a luz emitida por todas as estrelas do Universo observável.",
  },
  {
    value: "7.650",
    unit: "km/s",
    title: "Uma estrela a 2,5% da velocidade da luz",
    body: "A estrela S2 leva 16 anos para dar uma volta em Sagitário A*, e no ponto mais próximo cruza o espaço a 7.650 km/s. Foi rastreando essa órbita por três décadas que Genzel e Ghez provaram que há 4,3 milhões de massas solares no centro da Via Láctea — e ganharam o Nobel de 2020.",
  },
  {
    value: "66",
    unit: "bi M☉",
    title: "O maior que conhecemos",
    body: "TON 618 tem uma massa estimada em 66 bilhões de sóis. Seu horizonte de eventos teria um raio de cerca de 1.300 unidades astronômicas — quarenta vezes a órbita de Netuno. A estimativa vem do brilho do quasar e carrega uma barra de erro generosa, mas a ordem de grandeza é essa.",
  },
];

// ------------------------------------------------------------------ scale --

export type MassPoint = {
  name: string;
  /** Solar masses. */
  mass: number;
  detail: string;
  klass: "estelar" | "intermediário" | "supermassivo";
};

export const MASS_POINTS: MassPoint[] = [
  { name: "Cygnus X-1", mass: 21, detail: "O primeiro candidato aceito, a 7.200 anos-luz", klass: "estelar" },
  { name: "GW150914", mass: 62, detail: "A primeira fusão detectada por ondas gravitacionais", klass: "estelar" },
  { name: "ω Centauri", mass: 8200, detail: "Candidato a massa intermediária, ainda em disputa", klass: "intermediário" },
  { name: "Sagitário A*", mass: 4.3e6, detail: "O nosso, a 26 mil anos-luz do Sistema Solar", klass: "supermassivo" },
  { name: "M87*", mass: 6.5e9, detail: "O primeiro a ser fotografado, em 2019", klass: "supermassivo" },
  { name: "TON 618", mass: 6.6e10, detail: "Estimado a partir do brilho do quasar", klass: "supermassivo" },
];

export const SOURCES = [
  { label: "Event Horizon Telescope Collaboration", note: "ApJL 875 & 930, 2019 · 2022" },
  { label: "LIGO / Virgo", note: "Observation of Gravitational Waves, PRL 116, 2016" },
  { label: "GRAVITY Collaboration", note: "Massa de Sgr A*, A&A 647, 2021" },
  { label: "S. W. Hawking", note: "Particle creation by black holes, CMP 43, 1975" },
];
