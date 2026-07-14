export function SectionTitle({ eyebrow, title, text, action }) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <span className="section-heading__eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
        {text && <p>{text}</p>}
      </div>
      {action}
    </div>
  )
}
