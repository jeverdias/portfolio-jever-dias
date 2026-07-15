const previewClass = (presentation) => `model-preview model-preview--${presentation || 'case'}`

export function DisplayModelPreview({ model }) {
  return <span className="display-model-tooltip" role="tooltip">
    <span className={previewClass(model.presentation)} aria-hidden="true"><i /><i /><i /><b /><b /><em /></span>
    <strong>{model.name}</strong>
    <small>{({ embed: 'Painel incorporado dentro do site.', live: 'Sistema navegável com opção de nova aba.', gallery: 'Sequência visual de prints.', assistant: 'Apresentação orientada de uma solução de IA.', case: 'História completa: problema, solução e resultados.', video: 'Reprodução de vídeo demonstrativo.', document: 'Leitura de PDF ou documento.', prototype: 'Protótipo interativo incorporado.', comparison: 'Comparação visual de antes e depois.', repository: 'Resumo técnico e acesso ao código.' })[model.presentation] || 'Modelo personalizado do portfólio.'}</small>
  </span>
}
