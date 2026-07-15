import { BarChart3, BookOpenCheck, Boxes, Eye, FolderKanban, Image, LayoutDashboard, Link2, MonitorPlay, Palette, Settings, Sparkles } from 'lucide-react'

const mappings = [
  ['Nome profissional', 'Configurações', 'Título principal, contato e rodapé'],
  ['Cargo / apresentação', 'Configurações', 'Linha logo abaixo do nome na página inicial'],
  ['Redes sociais', 'Configurações', 'Modal “Fale comigo” e rodapé; campos vazios não aparecem'],
  ['Visibilidade das áreas', 'Configurações', 'Mostra ou oculta cada seção do site público'],
  ['Tema, cor e estilo', 'Aparência', 'Muda somente a identidade visual; o conteúdo e a estrutura permanecem'],
  ['Métricas e figuras', 'Trajetória', 'Números do box inicial e da seção de credibilidade'],
  ['Experiências profissionais', 'Trajetória', 'Linha do tempo exibida abaixo do portfólio'],
  ['Depoimentos', 'Trajetória', 'Recomendações exibidas na seção de credibilidade'],
  ['Nome e resumo do projeto', 'Repositórios', 'Card público e página individual'],
  ['Tipo do portfólio', 'Repositórios', 'Filtro público e identificação na lista lateral'],
  ['Modelo de exibição', 'Repositórios', 'Comportamento da demonstração, do link e da prévia'],
  ['Área / categoria', 'Repositórios', 'Assunto ou setor do projeto, como Saúde ou Educação'],
  ['Status', 'Repositórios', 'Situação atual, como Em andamento ou Concluído'],
  ['Desafio, solução e resultados', 'Repositórios', 'Estudo de caso da página individual'],
  ['Tecnologias e figurinhas', 'Box/figurinhas', 'Box principal e lista de tecnologias'],
  ['Nome, texto, exemplo e ícone', 'Especialidades', 'Cards da seção Especialidades'],
]

const displayModels = [
  ['Dashboard incorporado', 'Exibe Power BI ou outro painel dentro do site.'],
  ['Aplicação web ao vivo', 'Abre o sistema em uma janela incorporada e permite nova aba.'],
  ['Galeria de imagens', 'Apresenta uma sequência de telas, peças ou páginas.'],
  ['Demonstração de IA', 'Explica objetivo, recursos, limites e acesso seguro.'],
  ['Estudo de caso completo', 'Prioriza desafio, solução, processo e resultados.'],
  ['Vídeo demonstrativo', 'Reproduz um vídeo de apresentação do projeto.'],
  ['Documento ou PDF', 'Abre cartilha, relatório, currículo ou material para leitura.'],
  ['Protótipo interativo', 'Incorpora uma experiência navegável, como Figma ou protótipo web.'],
  ['Antes e depois', 'Compara duas imagens para evidenciar a transformação.'],
  ['Repositório de código', 'Apresenta contexto técnico e direciona ao código-fonte.'],
]

export function AdminGuide() {
  return (
    <div className="admin-guide">
      <div className="admin-page__heading">
        <span>Manual interativo</span>
        <h3>Aprenda sobre este site</h3>
        <p>Entenda cada área do portfólio e veja onde uma alteração aparece para o visitante.</p>
      </div>

      <div className="guide-quick-map">
        <article><LayoutDashboard size={20} /><strong>Visão geral</strong><p>Resumo do conteúdo, projetos e armazenamento.</p></article>
        <article><Settings size={20} /><strong>Configurações</strong><p>Apresentação, contatos, redes, números e visibilidade das áreas.</p></article>
        <article><Palette size={20} /><strong>Aparência</strong><p>45 perfis profissionais, 32 paletas, 30 estilos e 30 combinações de fontes.</p></article><article><FolderKanban size={20} /><strong>Classificação</strong><p>8 estruturas básicas. Não altera cores, fontes ou o tema escolhido.</p></article>
        <article><BarChart3 size={20} /><strong>Trajetória</strong><p>Métricas com figuras, experiências profissionais e depoimentos.</p></article>
        <article><FolderKanban size={20} /><strong>Repositórios</strong><p>Projetos, modelos, status, estudos de caso, links e galerias.</p></article>
        <article><Boxes size={20} /><strong>Box/figurinhas</strong><p>Tecnologias do box principal e coleção reutilizável.</p></article>
        <article><Sparkles size={20} /><strong>Especialidades</strong><p>Nome, texto para leigos, exemplo, cor, ícone e visibilidade.</p></article>
      </div>

      <section className="guide-section">
        <div className="guide-section__title"><BookOpenCheck size={20} /><div><span>Mapa de alterações</span><h4>Se eu modificar um campo, onde ele aparece?</h4></div></div>
        <div className="guide-mapping-table" role="table" aria-label="Relação entre campos administrativos e o site público">
          <div className="guide-mapping-table__head" role="row"><strong>Campo</strong><strong>Onde editar</strong><strong>Onde muda</strong></div>
          {mappings.map(([field, area, result]) => <div role="row" key={field}><strong>{field}</strong><span>{area}</span><p>{result}</p></div>)}
        </div>
      </section>

      <section className="guide-section guide-section--split">
        <div>
          <div className="guide-section__title"><Eye size={20} /><div><span>Site público</span><h4>Miniatura real da página inicial</h4></div></div>
          <p>Esta imagem foi gerada diretamente da versão local atual. Não contém marcações ou desenhos enviados por mensagem.</p>
          <p>Em <strong>Configurações → Visibilidade das áreas</strong>, você decide quais setores aparecem para o visitante.</p>
        </div>
        <figure className="guide-real-image guide-annotated-image"><div><img src="/guide/mini-site-inicio.png" alt="Miniatura real e limpa da página inicial" loading="lazy" /><span style={{ left: '3%', top: '29%' }}>1</span><span style={{ left: '61%', top: '31%' }}>2</span><span style={{ left: '61%', top: '67%' }}>3</span></div><figcaption><strong>1.</strong> Apresentação editada em Configurações. <strong>2.</strong> Métricas editadas em Trajetória. <strong>3.</strong> Tecnologias e figuras editadas em Box/figurinhas.</figcaption></figure>
      </section>

      <section className="guide-section">
        <div className="guide-section__title"><FolderKanban size={20} /><div><span>Projetos</span><h4>Tipo, modelo, categoria e status não são a mesma coisa</h4></div></div>
        <div className="guide-concepts">
          <article><span>01</span><h5>Tipo do portfólio</h5><p>Nome usado para organizar e filtrar, como “Dashboard Financeiro” ou “Sistema Interno”.</p></article>
          <article><span>02</span><h5>Modelo de exibição</h5><p>Define como o visitante vê a demonstração. Um modelo personalizado escolhe um dos 10 comportamentos prontos.</p></article>
          <article><span>03</span><h5>Área / categoria</h5><p>Indica o assunto ou setor: Saúde, Educação, Processos, Automação etc.</p></article>
          <article><span>04</span><h5>Status</h5><p>Escolha Concluído, Em andamento ou Parado. Em Outro, digite uma situação ou motivo personalizado.</p></article>
        </div>
        <div className="guide-info-list">
          <p><strong>Coluna esquerda:</strong> pesquise, filtre e selecione o projeto.</p>
          <p><strong>Editor à direita:</strong> altere conteúdo, modelo, status, imagens, links e estudo de caso.</p>
        </div>
      </section>

      <section className="guide-section guide-section--split">
        <div>
          <div className="guide-section__title"><MonitorPlay size={20} /><div><span>Página individual</span><h4>Como o visitante conhece o projeto</h4></div></div>
          <ol className="guide-steps">
            <li><span>1</span><p>O visitante escolhe um card no portfólio.</p></li>
            <li><span>2</span><p>A página apresenta resumo, contexto, público, duração, formato e status.</p></li>
            <li><span>3</span><p>“Conhecer o projeto” leva ao desafio, à solução e aos resultados.</p></li>
            <li><span>4</span><p>“Ver demonstração” usa o modelo de exibição escolhido no painel.</p></li>
          </ol>
        </div>
        <figure className="guide-real-image guide-annotated-image"><div><img src="/guide/mini-pagina-projeto.png" alt="Miniatura real da página individual de projeto" loading="lazy" /><span style={{ left: '5%', top: '4%' }}>1</span><span style={{ left: '5%', top: '71%' }}>2</span><span style={{ left: '55%', top: '30%' }}>3</span></div><figcaption><strong>1.</strong> Retorno ao portfólio. <strong>2.</strong> Demonstração e estudo de caso. <strong>3.</strong> Capa cadastrada no projeto.</figcaption></figure>
      </section>

      <section className="guide-section">
        <div>
          <div className="guide-section__title"><Sparkles size={20} /><div><span>Especialidades</span><h4>Conteúdo totalmente editável</h4></div></div>
          <div className="guide-info-list">
            <p><strong>Resumo do card:</strong> texto curto exibido na página inicial.</p>
            <p><strong>Explicação para leigos:</strong> detalhamento simples que aparece no modal.</p>
            <p><strong>Exemplo:</strong> situação prática para facilitar o entendimento.</p>
            <p><strong>Figurinha:</strong> use um ícone padrão ou uma imagem da coleção.</p>
          </div>
        </div>
      </section>

      <section className="guide-section">
        <div className="guide-section__title"><Palette size={20} /><div><span>Aparência</span><h4>Perfil, paleta, design e fonte</h4></div></div>
        <div className="guide-concepts">
          <article><span>01</span><h5>Perfil profissional</h5><p>Aplica uma combinação pronta adequada a um setor, sem alterar o conteúdo.</p></article>
          <article><span>02</span><h5>Paleta</h5><p>Troca apenas cores, fundos, destaques e contrastes.</p></article>
          <article><span>03</span><h5>Design</h5><p>Altera cantos, sombras, densidade e personalidade visual.</p></article>
          <article><span>04</span><h5>Fonte</h5><p>Troca a tipografia dos textos e títulos mantendo as mesmas informações.</p></article>
        </div>
      </section>

      <section className="guide-section">
        <div className="guide-section__title"><BarChart3 size={20} /><div><span>Trajetória</span><h4>Onde ficam números, experiências e depoimentos</h4></div></div>
        <div className="guide-info-list"><p><strong>Métricas:</strong> crie valores como “+12”, escolha visualmente um dos ícones, use uma figurinha própria e controle a visibilidade. Para adicionar imagens, abra Box/figurinhas.</p><p><strong>Onde obter ícones:</strong> a própria tela indica Lucide, Google Icons, SVG Repo e Flaticon. Confira a licença antes de publicar.</p><p><strong>Trajetória:</strong> cada marco possui período, título e descrição.</p><p><strong>Depoimentos:</strong> cadastre nome, cargo/empresa e somente textos autorizados.</p></div>
      </section>

      <section className="guide-section">
        <div className="guide-section__title"><Image size={20} /><div><span>Imagens</span><h4>Capas, prints e figurinhas</h4></div></div>
        <div className="guide-concepts guide-concepts--three">
          <article><Sparkles size={20} /><h5>Otimização</h5><p>Reduz dimensões exageradas e tenta WebP. Só substitui a original quando o arquivo fica menor.</p></article>
          <article><Boxes size={20} /><h5>Coleção</h5><p>Figurinhas enviadas ficam salvas para reutilização e podem ser excluídas.</p></article>
          <article><Link2 size={20} /><h5>Links</h5><p>Também aceita URL pública. Depois, o Supabase Storage poderá guardar os arquivos.</p></article>
        </div>
      </section>

      <section className="guide-section guide-demo-rules">
        <div className="guide-section__title"><BarChart3 size={20} /><div><span>Demonstrações</span><h4>10 modelos de exibição prontos</h4></div></div>
        <p>Um modelo personalizado pode ter outro nome, outro tipo e uma destas apresentações. Um comportamento totalmente novo exige adicionar código ao site.</p>
        {displayModels.map(([name, description], index) => <details open={index === 0} key={name}><summary>{name}</summary><p>{description}</p></details>)}
      </section>
    </div>
  )
}
