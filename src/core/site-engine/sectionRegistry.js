import { cloneConfigValue, deepFreezeConfig } from '../config/siteSchema.js'
import { listPublicSections } from './publicSectionRegistry.js'

const publicSectionMetadata = {
  hero: { label: 'Apresentação', description: 'Identidade, proposta principal e primeira ação.', category: 'introduction', publicComponentKey: 'Hero', adminEditorKey: 'settings', defaultVisibility: true, capabilities: [] },
  specialties: { label: 'Especialidades', description: 'Áreas de atuação explicadas de forma objetiva.', category: 'content', publicComponentKey: 'Specialties', adminEditorKey: 'specialties', defaultVisibility: true, capabilities: ['specialties'] },
  projects: { label: 'Portfólio', description: 'Projetos, entregas e estudos de caso.', category: 'proof', publicComponentKey: 'Projects', adminEditorKey: 'repositories', defaultVisibility: true, capabilities: ['projects'] },
  about: { label: 'Sobre', description: 'Contexto profissional ou institucional.', category: 'identity', publicComponentKey: 'About', adminEditorKey: 'settings', defaultVisibility: true, capabilities: [] },
  credibility: { label: 'Trajetória e credibilidade', description: 'Métricas, tecnologias, experiências e depoimentos.', category: 'proof', publicComponentKey: 'Credibility', adminEditorKey: 'professional', defaultVisibility: true, capabilities: ['metrics'] },
  resume: { label: 'Currículo', description: 'Resumo profissional e acesso ao currículo.', category: 'credentials', publicComponentKey: 'Resume', adminEditorKey: 'settings', defaultVisibility: true, capabilities: ['resume'] },
  contact: { label: 'Contato', description: 'Canais de contato e captura de mensagem.', category: 'conversion', publicComponentKey: 'Contact', adminEditorKey: 'settings', defaultVisibility: true, capabilities: ['contact'] },
  footer: { label: 'Rodapé', description: 'Identidade e links finais.', category: 'navigation', publicComponentKey: 'Footer', adminEditorKey: 'settings', defaultVisibility: true, capabilities: [] },
}

const definitions = [
  ...listPublicSections().map((definition) => ({ ...definition, ...publicSectionMetadata[definition.id] })),
  { id: 'problem', label: 'Problema', description: 'Necessidade que a oferta resolve.', category: 'landing', publicComponentKey: null, adminEditorKey: null, defaultVisibility: true, required: false, capabilities: [] },
  { id: 'solution', label: 'Solução', description: 'Proposta oferecida para a necessidade.', category: 'landing', publicComponentKey: null, adminEditorKey: null, defaultVisibility: true, required: false, capabilities: ['services'] },
  { id: 'benefits', label: 'Benefícios', description: 'Ganhos e diferenciais principais.', category: 'landing', publicComponentKey: 'LandingHighlights', adminEditorKey: 'classification', defaultVisibility: true, required: false, capabilities: ['leadCapture'] },
  { id: 'social-proof', label: 'Prova social', description: 'Resultados, métricas ou depoimentos.', category: 'proof', publicComponentKey: null, adminEditorKey: 'professional', defaultVisibility: true, required: false, capabilities: ['testimonials'] },
  { id: 'faq', label: 'Perguntas frequentes', description: 'Respostas para dúvidas recorrentes.', category: 'conversion', publicComponentKey: null, adminEditorKey: null, defaultVisibility: true, required: false, capabilities: ['faq'] },
  { id: 'call-to-action', label: 'Chamada para ação', description: 'Ação principal reforçada ao final.', category: 'conversion', publicComponentKey: null, adminEditorKey: null, defaultVisibility: true, required: false, capabilities: ['leadCapture'] },
  { id: 'about-company', label: 'Sobre a empresa', description: 'História, propósito e posicionamento.', category: 'identity', publicComponentKey: null, adminEditorKey: null, defaultVisibility: true, required: false, capabilities: [] },
  { id: 'services', label: 'Serviços', description: 'Soluções ou atendimentos oferecidos.', category: 'content', publicComponentKey: null, adminEditorKey: 'specialties', defaultVisibility: true, required: false, capabilities: ['services'] },
  { id: 'differentials', label: 'Diferenciais', description: 'Razões para confiar na organização ou profissional.', category: 'proof', publicComponentKey: null, adminEditorKey: null, defaultVisibility: true, required: false, capabilities: [] },
  { id: 'clients', label: 'Clientes', description: 'Organizações ou públicos atendidos.', category: 'proof', publicComponentKey: null, adminEditorKey: null, defaultVisibility: true, required: false, capabilities: ['clients'] },
  { id: 'team', label: 'Equipe', description: 'Pessoas e responsabilidades da organização.', category: 'identity', publicComponentKey: null, adminEditorKey: null, defaultVisibility: true, required: false, capabilities: ['team'] },
  { id: 'professional-profile', label: 'Perfil profissional', description: 'Experiência, abordagem e credenciais.', category: 'identity', publicComponentKey: null, adminEditorKey: 'professional', defaultVisibility: true, required: false, capabilities: [] },
  { id: 'portfolio', label: 'Trabalhos realizados', description: 'Casos e trabalhos do profissional.', category: 'proof', publicComponentKey: null, adminEditorKey: 'repositories', defaultVisibility: true, required: false, capabilities: ['projects'] },
  { id: 'testimonials', label: 'Depoimentos', description: 'Relatos e evidências de confiança.', category: 'proof', publicComponentKey: null, adminEditorKey: 'professional', defaultVisibility: true, required: false, capabilities: ['testimonials'] },
  { id: 'credentials', label: 'Credenciais', description: 'Formação, registros e qualificações.', category: 'credentials', publicComponentKey: null, adminEditorKey: 'professional', defaultVisibility: true, required: false, capabilities: [] },
]

const frozenSections = definitions.map((definition) => deepFreezeConfig(cloneConfigValue(definition)))
const sectionsById = new Map(frozenSections.map((definition) => [definition.id, definition]))

export const listSections = () => frozenSections.map(cloneConfigValue)
export const getSectionDefinition = (id) => sectionsById.has(id) ? cloneConfigValue(sectionsById.get(id)) : null
export const isKnownSection = (id) => sectionsById.has(id)
