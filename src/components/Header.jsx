import { Menu, X } from 'lucide-react'
import { useState } from 'react'

const links = [
  ['Início', '#inicio'],
  ['Projetos', '#projetos'],
  ['Serviços', '#servicos'],
  ['Sobre', '#sobre'],
  ['Contato', '#contato'],
]

export function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <a className="brand" href="#inicio" aria-label="Jever Dias — início" onClick={() => setOpen(false)}>
          JD<span className="brand__dot" />
        </a>

        <button
          className="menu-button"
          type="button"
          aria-expanded={open}
          aria-controls="main-navigation"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

        <nav id="main-navigation" className={`main-nav ${open ? 'is-open' : ''}`} aria-label="Navegação principal">
          {links.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
        </nav>

        <a className="header-cta" href="#contato">
          Vamos conversar
        </a>
      </div>
    </header>
  )
}
