import { CheckCircle2 } from 'lucide-react'
import { SectionTitle } from './ui/SectionTitle'

const steps = [
  ['Entender', 'O desafio, o processo e a decisão que precisa ser melhorada.'],
  ['Organizar', 'As fontes, regras e prioridades em uma estrutura simples e confiável.'],
  ['Construir', 'Uma solução clara, responsiva e preparada para o uso real.'],
]

export function About() {
  return (
    <section className="section about" id="sobre">
      <div className="container about__grid">
        <div>
          <SectionTitle
            eyebrow="Sobre o meu trabalho"
            title="Tecnologia com contexto e propósito."
            text="Mais do que montar telas, busco entender o problema e transformar complexidade em uma experiência simples para quem vai usar."
          />
          <div className="about__checks">
            <span><CheckCircle2 size={18} /> Comunicação clara durante a entrega</span>
            <span><CheckCircle2 size={18} /> Soluções responsivas e fáceis de manter</span>
            <span><CheckCircle2 size={18} /> Atenção à qualidade dos dados e processos</span>
          </div>
        </div>
        <div className="process-card">
          <span className="process-card__label">Como eu trabalho</span>
          {steps.map(([title, text], index) => (
            <div className="process-step" key={title}>
              <span>0{index + 1}</span>
              <div><h3>{title}</h3><p>{text}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
