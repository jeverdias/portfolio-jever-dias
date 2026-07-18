import projects from './projects.json' with { type: 'json' }

export const projectTypes = {
  powerbi: 'Power BI',
  website: 'Sistema Web',
  content: 'Conteúdo Digital',
  ai: 'GPTs & Agentes de IA',
}

export const getProjectTypeLabel = (project) => project?.typeLabel?.trim() || projectTypes[project?.type] || project?.category || 'Projeto'

export const defaultProjects = projects
