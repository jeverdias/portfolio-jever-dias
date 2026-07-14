export function ProjectVisual({ project, large = false }) {
  if (project.image) {
    return <img className="project-visual__image" src={project.image} alt={`Prévia do projeto ${project.title}`} />
  }

  return (
    <div className={`project-visual project-visual--${project.preview || project.type} ${large ? 'is-large' : ''}`} aria-hidden="true">
      <div className="mock-browser">
        <div className="mock-browser__bar"><i /><i /><i /><span /></div>
        {project.preview === 'dashboard' && (
          <div className="mock-dashboard">
            <div className="mock-sidebar" />
            <div className="mock-dashboard__main">
              <div className="mock-kpis"><b /><b /><b /></div>
              <div className="mock-charts"><span /><span /><span /></div>
            </div>
          </div>
        )}
        {project.preview === 'system' && (
          <div className="mock-system">
            <div className="mock-system__nav" />
            <div className="mock-system__body">
              <div className="mock-system__head"><b /><span /></div>
              {[0, 1, 2, 3].map((row) => <i key={row} />)}
            </div>
          </div>
        )}
        {project.preview === 'content' && (
          <div className="mock-content">
            <div className="mock-content__copy"><b /><strong /><span /><span /><i /></div>
            <div className="mock-content__art"><span /><b /><i /></div>
          </div>
        )}
      </div>
    </div>
  )
}
