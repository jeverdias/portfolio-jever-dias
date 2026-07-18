import { createElement } from 'react'
import { About } from '../components/About.jsx'
import { Contact } from '../components/Contact.jsx'
import { Credibility } from '../components/Credibility.jsx'
import { Footer } from '../components/Footer.jsx'
import { Hero } from '../components/Hero.jsx'
import { Projects } from '../components/Projects.jsx'
import { Resume } from '../components/Resume.jsx'
import { Specialties } from '../components/Specialties.jsx'
import { selectPublicProjects } from '../utils/compatibility.js'

export const publicSectionComponents = Object.freeze({
  hero: ({ siteConfig, templateId, handlers }) => createElement(Hero, { site: siteConfig, classificationId: templateId, onContact: handlers.onContact }),
  specialties: ({ siteConfig, templateId }) => createElement(Specialties, { items: siteConfig.specialties, classificationId: templateId }),
  projects: ({ projects, templateId, handlers }) => createElement(Projects, { projects: selectPublicProjects(projects), classificationId: templateId, onOpen: handlers.onOpenProject }),
  about: () => createElement(About),
  credibility: ({ siteConfig }) => createElement(Credibility, { site: siteConfig }),
  resume: ({ siteConfig }) => createElement(Resume, { site: siteConfig }),
  contact: ({ siteConfig, templateId, handlers }) => createElement(Contact, { site: siteConfig, classificationId: templateId, onOpen: handlers.onContact }),
  footer: ({ siteConfig }) => createElement(Footer, { site: siteConfig }),
})

export const getPublicSectionComponentIds = () => Object.keys(publicSectionComponents)
export const hasPublicSectionComponent = (sectionId) => typeof publicSectionComponents[sectionId] === 'function'
export const renderPublicSection = (sectionId, context) => publicSectionComponents[sectionId]?.(context) ?? null
