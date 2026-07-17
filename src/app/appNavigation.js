export const readProjectIdFromPath = (pathname = '') => (
  decodeURIComponent(String(pathname).match(/^\/portfolio\/([^/]+)\/?$/)?.[1] || '')
)

export const createProjectPath = (projectId) => `/portfolio/${encodeURIComponent(projectId)}`
export const createPortfolioReturnPath = () => '/#projetos'
