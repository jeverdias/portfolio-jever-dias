const descriptions = {
  embed: 'Painel incorporado dentro do site.', live: 'Sistema navegável com opção de nova aba.', gallery: 'Sequência visual de prints.',
  assistant: 'Apresentação orientada de uma solução de IA.', case: 'História completa: problema, solução e resultados.',
  video: 'Reprodução de vídeo demonstrativo.', document: 'Leitura de PDF ou documento.', prototype: 'Protótipo interativo incorporado.',
  comparison: 'Comparação visual de antes e depois.', repository: 'Resumo técnico e acesso ao código.',
}

export function DisplayModelExample({ presentation = 'case' }) {
  if (presentation === 'embed') return <span className="model-context model-context--dashboard"><b>Indicadores</b><span><i>12</i><i>87%</i><i>+24%</i></span><em><u /><u /><u /><u /></em></span>
  if (presentation === 'live') return <span className="model-context model-context--system"><b>Sistema de O.S.</b><span>Visão geral</span><em><i>OS-104</i><i>Em andamento</i><i>Hoje</i></em></span>
  if (presentation === 'gallery') return <span className="model-context model-context--gallery"><b>Galeria do projeto</b><span><i>Capa</i><i>Tela 2</i><i>Tela 3</i></span></span>
  if (presentation === 'assistant') return <span className="model-context model-context--chat"><b>Assistente de IA</b><span>Como posso ajudar?</span><em>Organizei uma resposta para você.</em></span>
  if (presentation === 'video') return <span className="model-context model-context--video"><b>Demonstração do projeto</b><i>▶</i><small>01:24</small></span>
  if (presentation === 'document') return <span className="model-context model-context--document"><b>Cartilha digital</b><span /><span /><span /><small>PDF · 12 páginas</small></span>
  if (presentation === 'prototype') return <span className="model-context model-context--prototype"><b>Protótipo navegável</b><span><i>Início</i><i>Serviços</i></span><em>Continuar</em></span>
  if (presentation === 'comparison') return <span className="model-context model-context--comparison"><b>Antes</b><b>Depois</b><span>Manual</span><span>Automatizado</span></span>
  if (presentation === 'repository') return <span className="model-context model-context--code"><b>portfolio-jever</b><span>src/</span><span>README.md</span><code>const projeto = 'publicado'</code></span>
  return <span className="model-context model-context--case"><b>Estudo de caso</b><span><strong>Desafio</strong><i>Organizar informações dispersas</i></span><span><strong>Solução</strong><i>Painel claro e objetivo</i></span><span><strong>Resultado</strong><i>Decisões mais rápidas</i></span></span>
}

export function DisplayModelPreview({ model }) {
  return <span className="display-model-tooltip" role="tooltip">
    <DisplayModelExample presentation={model.presentation} />
    <strong>{model.name}</strong>
    <small>{descriptions[model.presentation] || 'Modelo personalizado do portfólio.'}</small>
  </span>
}
