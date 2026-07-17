export function resolveSections({ template, visibility = {}, preferredOrder, availableSections, knownSectionIds, requiredSectionIds } = {}) {
  if (!template) return []

  const known = Array.isArray(knownSectionIds) ? new Set(knownSectionIds) : new Set(template.sections)
  const allowed = new Set(template.sections.filter((id) => known.has(id)))
  const available = Array.isArray(availableSections) ? new Set(availableSections) : allowed
  const required = new Set((Array.isArray(requiredSectionIds) ? requiredSectionIds : []).filter((id) => allowed.has(id)))
  const emptyOrderIsIntentional = Array.isArray(preferredOrder) && preferredOrder.length === 0
  const sourceOrder = Array.isArray(preferredOrder) && preferredOrder.length
    ? [...preferredOrder, ...template.defaultSectionOrder]
    : emptyOrderIsIntentional
      ? [...required]
      : template.defaultSectionOrder

  const result = []
  for (const id of sourceOrder) {
    if (!allowed.has(id) || !available.has(id) || result.includes(id)) continue
    if (visibility?.[id] === false && !required.has(id)) continue
    result.push(id)
  }
  for (const id of required) {
    if (available.has(id) && !result.includes(id)) result.push(id)
  }
  return result
}
