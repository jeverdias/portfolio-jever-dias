import { BarChart3, Braces, Database, LineChart } from 'lucide-react'
import { SectionTitle } from './ui/SectionTitle'

const specialties = [
  {
    icon: BarChart3,
    number: '01',
    title: 'Business Intelligence',
    text: 'Dashboards, indicadores e modelagem de dados para acompanhar o que realmente importa.',
  },
  {
    icon: LineChart,
    number: '02',
    title: 'Analytics',
    text: 'Análise de dados e geração de insights para decisões mais rápidas e bem fundamentadas.',
  },
  {
    icon: Braces,
    number: '03',
    title: 'Sistemas Web',
    text: 'Aplicações simples e funcionais para digitalizar rotinas e reduzir trabalho manual.',
  },
  {
    icon: Database,
    number: '04',
    title: 'Dados & Processos',
    text: 'ETL, organização e apoio à melhoria contínua dos processos operacionais.',
  },
]

export function Specialties() {
  return (
    <section className="section" id="servicos">
      <div className="container">
        <SectionTitle
          eyebrow="Especialidades"
          title="Do dado bruto à solução que funciona."
          text="Estratégia, análise e desenvolvimento reunidos em entregas objetivas."
        />
        <div className="specialties-grid">
          {specialties.map(({ icon: Icon, number, title, text }) => (
            <article className="specialty-card" key={title}>
              <div className="specialty-card__top">
                <div className="specialty-card__icon"><Icon size={24} /></div>
                <span>{number}</span>
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
              <div className="specialty-card__line" />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
