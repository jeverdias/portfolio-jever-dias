import {
  BookOpenCheck,
  CheckCircle2,
  FolderKanban,
  ImagePlus,
  LayoutDashboard,
  Mail,
  Palette,
  Settings,
  Sparkles,
  Tags,
} from 'lucide-react'

export const DEFAULT_ADMIN_VIEW_ID = 'overview'

export const adminNavigation = Object.freeze([
  { id: 'classification', label: 'Classificação do site', description: 'Classificação e templates internos.', componentKey: 'classification', icon: Tags },
  { id: 'overview', label: 'Visão geral', description: 'Resumo do conteúdo e da persistência.', componentKey: 'overview', icon: LayoutDashboard },
  { id: 'settings', label: 'Configurações', description: 'Dados profissionais, contatos e visibilidade.', componentKey: 'settings', icon: Settings },
  { id: 'appearance', label: 'Aparência', description: 'Tema, paleta, tipografia e efeitos.', componentKey: 'appearance', icon: Palette },
  { id: 'professional', label: 'Trajetória', title: 'Trajetória e métricas', description: 'Métricas e conteúdo profissional.', componentKey: 'professional', icon: CheckCircle2 },
  { id: 'repositories', label: 'Repositórios', description: 'Cadastro e organização dos projetos.', componentKey: 'repositories', icon: FolderKanban },
  { id: 'library', label: 'Box/figurinhas', description: 'Biblioteca visual e tecnológica.', componentKey: 'library', icon: ImagePlus },
  { id: 'specialties', label: 'Especialidades', description: 'Áreas de atuação apresentadas no site.', componentKey: 'specialties', icon: Sparkles },
  { id: 'messages', label: 'Mensagens', title: 'Mensagens recebidas', description: 'Mensagens recebidas pelo formulário.', componentKey: 'messages', icon: Mail, visibility: ({ adminAuth }) => Boolean(adminAuth?.configured) },
  { id: 'guide', label: 'Guia do site', description: 'Orientações sobre o site e o painel.', componentKey: 'guide', icon: BookOpenCheck },
])

export function getAdminNavigation(context = {}) {
  return adminNavigation.filter((item) => !item.visibility || item.visibility(context))
}

export function resolveAdminViewId(requestedId, context = {}, hasView = () => true) {
  const visibleItems = getAdminNavigation(context)
  const requested = visibleItems.find((item) => item.id === requestedId && hasView(item.componentKey))
  if (requested) return requested.id

  const fallback = visibleItems.find((item) => item.id === DEFAULT_ADMIN_VIEW_ID && hasView(item.componentKey))
    || visibleItems.find((item) => hasView(item.componentKey))
  return fallback?.id || DEFAULT_ADMIN_VIEW_ID
}

export function getAdminViewLabel(viewId, context = {}) {
  const item = getAdminNavigation(context).find((entry) => entry.id === viewId)
  return item?.title || item?.label || 'Visão geral'
}
