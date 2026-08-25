import { Singularity } from "./webgl/Singularity";
import { Hero } from "./components/Hero";
import { Station } from "./components/Station";
import { Anatomy } from "./components/Anatomy";
import { Ledger } from "./components/Ledger";
import { MassScale } from "./components/MassScale";
import { Dilation } from "./components/Dilation";
import { Footer } from "./components/Footer";
import { useReveal } from "./hooks/useReveal";
import { useDescent } from "./hooks/useDescent";
import { useEclipse } from "./hooks/useEclipse";
import { Rs } from "./components/Rs";

function SingularityStation() {
  const { ref, revealed } = useReveal<HTMLElement>(0.3);

  return (
    <section
      id="singularidade"
      ref={ref}
      className="station singularity-station"
      aria-labelledby="singularidade-title"
    >
      <div className="station__inner" data-shown={revealed}>
        <div className="eyebrow reveal">
          <span className="depth tnum">
            0 <Rs />
          </span>
          <span className="eyebrow__rule" />
          <span className="readout">—</span>
        </div>

        <h2 id="singularidade-title" className="singularity-station__line reveal reveal--d1">
          Aqui a física que usamos para escrever esta página deixa de valer.
        </h2>

        <p className="singularity-station__after reveal reveal--d3">
          A relatividade geral prevê densidade infinita, e uma teoria que prevê infinito
          está avisando que saiu do seu domínio. O que existe no centro é uma pergunta em
          aberto — provavelmente a resposta exige uma teoria quântica da gravidade que
          ninguém escreveu ainda.
        </p>
      </div>
    </section>
  );
}

export default function App() {
  useDescent();
  useEclipse("travessia");

  return (
    <>
      <a className="skip-link" href="#o-que-e">
        Pular para o conteúdo
      </a>

      <Singularity />
      <div className="veil" aria-hidden="true" />

      <header className="masthead">
        <span className="masthead__mark">Horizonte</span>
        <span className="masthead__sub">atlas de um objeto que não pode ser visto</span>
      </header>

      <main className="shell">
        <Hero />

        {/* ------------------------------------------------- 10.000 r_s -- */}
        <Station id="o-que-e" depth="10.000" label="gravidade newtoniana">
          <div className="col">
            <h2 id="o-que-e-title" className="title">
              Matéria demais num espaço pequeno demais
            </h2>
            <p className="lede">
              Um buraco negro não é um buraco, nem um objeto sólido. É uma região do espaço
              onde tanta massa foi comprimida num volume tão pequeno que a velocidade de
              escape passa da velocidade da luz.
            </p>
            <p className="body-text">
              Escapar de qualquer corpo custa velocidade: 11,2 km/s para sair da Terra, 618
              km/s para sair do Sol. Esse número cresce conforme a massa aumenta e o raio
              diminui. Comprima massa suficiente e ele chega a{" "}
              <span className="mark">299.792 km/s</span> — e nada, nem a luz, tem velocidade
              sobrando para ir embora.
            </p>
            <p className="body-text">
              A superfície onde isso acontece é o horizonte de eventos. Ela não é feita de
              nada. É uma fronteira causal: o conjunto de pontos a partir dos quais nenhum
              sinal futuro consegue mais alcançar o resto do universo.
            </p>
          </div>
        </Station>

        {/* -------------------------------------------------- 1.000 r_s -- */}
        <Station id="escala" depth="1.000" label="esfera de influência" variant="full">
          <div className="col">
            <h2 id="escala-title" className="title">
              Três famílias, nove ordens de grandeza
            </h2>
            <p className="lede">
              Entre o menor buraco negro já pesado e o maior já estimado há um fator de
              três bilhões. Chamar os dois pelo mesmo nome esconde mais do que explica.
            </p>
          </div>
          <MassScale />
        </Station>

        {/* ---------------------------------------------------- 100 r_s -- */}
        <Station id="anatomia" depth="100" label="disco externo">
          <div className="col">
            <h2 id="anatomia-title" className="title">
              O que existe entre você e o centro
            </h2>
            <p className="lede">
              Nenhuma dessas camadas é uma superfície física. São altitudes onde a
              geometria do espaço faz algo específico — e o diagrama abaixo está em escala.
            </p>
          </div>
          <Anatomy />
        </Station>

        {/* ----------------------------------------------------- 20 r_s -- */}
        <Station id="curiosidades" depth="20" label="disco interno">
          <div className="col">
            <h2 id="curiosidades-title" className="title">
              Oito coisas que contrariam a intuição
            </h2>
            <p className="lede">
              Quase tudo que a ficção ensinou sobre buracos negros é falso, e o que é
              verdade costuma ser mais estranho.
            </p>
          </div>
          <Ledger />
        </Station>

        {/* ------------------------------------------------------ 3 r_s -- */}
        <Station id="tempo" depth="3" label="última órbita estável">
          <div className="col">
            <h2 id="tempo-title" className="title">
              O tempo não passa igual para os dois
            </h2>
            <p className="lede">
              Perto de uma massa grande, os relógios andam mais devagar. Não é ilusão de
              ótica nem defeito do relógio: é o tempo mesmo.
            </p>
            <p className="body-text">
              O efeito é medido diariamente. Os satélites do GPS ficam adiantados 38
              microssegundos por dia em relação ao solo, e sem essa correção a navegação
              erraria cerca de 10 quilômetros por dia. Perto de um buraco negro o mesmo
              efeito deixa de ser uma correção e vira a história inteira.
            </p>
          </div>
          <Dilation />
        </Station>

        {/* ------------------------------------------------------ 1 r_s -- */}
        <Station id="horizonte" depth="1" label="horizonte de eventos">
          <div className="col">
            <h2 id="horizonte-title" className="title">
              A travessia não tem nada de dramático
            </h2>
            <p className="lede">
              Você não sente o horizonte. Num buraco negro supermassivo, cruzá-lo é
              atravessar um pedaço qualquer de espaço vazio — sem solavanco, sem brilho,
              sem aviso.
            </p>
            <p className="body-text">
              As forças de maré, que esticariam você até romper, dependem do tamanho: no
              horizonte elas caem com o quadrado da massa. Num buraco negro estelar você
              seria destruído bem antes de chegar. Em Sagitário A*, atravessaria inteiro e
              só descobriria depois.
            </p>
            <p className="horizon-note">
              O que muda não é o lugar. É o futuro: a partir dali, todas as trajetórias
              possíveis apontam para o centro. Ir embora vira tão impossível quanto voltar
              para ontem.
            </p>
          </div>
        </Station>

        {/* -------------------------------------------------------- 0 -- */}
        <SingularityStation />
      </main>

      {/* The fall itself: an empty stretch that takes the sky to black. */}
      <div id="travessia" className="crossing" aria-hidden="true" />
      <div className="eclipse" aria-hidden="true" />

      <Footer />
    </>
  );
}
