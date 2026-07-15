export function getInitials(name = '') {
  const words = name.trim().split(/\s+/).filter(Boolean)
  return words.slice(0, 3).map((word) => word[0]?.toLocaleUpperCase('pt-BR')).join('') || 'J'
}
