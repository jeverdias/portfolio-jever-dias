import { BarChart3, Bot, CheckCircle2, Database, FolderKanban, GalleryHorizontal, Globe2, Settings } from 'lucide-react'

export function DashboardView({ projectStore, siteStore, onNavigate }) {
  const counts = projectStore.projects.reduce((result, project) => ({
    ...result,
    [project.type]: (result[project.type] || 0) + 1,
  }), {})

  return (
    <div className="admin-page">
      <div className="admin-page__heading"><span>Visão geral</span><h3>Seu portfólio em um só lugar.</h3><p>Acompanhe o conteúdo cadastrado e escolha o que deseja editar.</p></div>
      <div className="admin-metrics">
        <article><BarChart3 size={20} /><strong>{counts.powerbi || 0}</strong><span>Projetos Power BI</span></article>
        <article><Globe2 size={20} /><strong>{counts.website || 0}</strong><span>Sistemas web</span></article>
        <article><GalleryHorizontal size={20} /><strong>{counts.content || 0}</strong><span>Conteúdos digitais</span></article>
        <article><Bot size={20} /><strong>{counts.ai || 0}</strong><span>GPTs & Agentes de IA</span></article>
        <article><CheckCircle2 size={20} /><strong>{projectStore.projects.filter((project) => project.featured).length}</strong><span>Projetos publicados</span></article>
      </div>
      <div className="admin-overview-grid">
        <article className="admin-overview-card"><div className="admin-overview-card__icon"><FolderKanban size={21} /></div><div><h4>Repositórios</h4><p>Edite títulos, resumos, links, tecnologias e até quatro prints por projeto.</p></div><button type="button" onClick={() => onNavigate('repositories')}>Gerenciar projetos</button></article>
        <article className="admin-overview-card"><div className="admin-overview-card__icon"><Settings size={21} /></div><div><h4>Configurações</h4><p>Atualize sua apresentação, contatos, redes e números exibidos no site.</p></div><button type="button" onClick={() => onNavigate('settings')}>Editar o site</button></article>
      </div>
      <div className="admin-storage-card"><Database size={22} /><div><strong>{siteStore.mode === 'supabase' ? 'Supabase conectado' : 'Modo local ativo'}</strong><p>{siteStore.mode === 'supabase' ? 'Configurações, projetos e arquivos são protegidos por autenticação e políticas RLS.' : 'Os dados estão neste navegador. Configure o projeto Supabase exclusivo para ativar sincronização online segura.'}</p></div><span>{siteStore.mode === 'supabase' ? 'Sincronização online' : 'Aguardando Supabase'}</span></div>
    </div>
  )
}
