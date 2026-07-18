function extraPalette(id, name, scheme, bg, deep, text, muted, primary, secondary, green) {
  const light = scheme === 'light'
  return { id, name, scheme, swatches: [bg, primary, secondary], vars: { '--bg': bg, '--bg-deep': deep, '--surface': light ? 'rgba(255,255,255,.72)' : 'rgba(18,24,32,.78)', '--surface-strong': light ? '#fcfcfb' : deep, '--line': `color-mix(in srgb, ${primary} 17%, transparent)`, '--line-strong': `color-mix(in srgb, ${primary} 42%, transparent)`, '--text': text, '--muted': muted, '--blue': primary, '--purple': secondary, '--green': green, '--gradient': `linear-gradient(110deg, ${primary}, ${secondary})`, '--header-bg': `color-mix(in srgb, ${bg} 88%, transparent)`, '--glow-one': `color-mix(in srgb, ${secondary} 14%, transparent)`, '--glow-two': `color-mix(in srgb, ${primary} 13%, transparent)` } }
}

export const colorPalettes = [
  { id: 'jd-original', name: 'JD original', scheme: 'dark', swatches: ['#050814', '#55b8ff', '#9b5cff'], vars: { '--bg': '#050814', '--bg-deep': '#02040b', '--surface': 'rgba(12, 18, 35, .72)', '--surface-strong': '#0c1223', '--line': 'rgba(151, 174, 230, .13)', '--line-strong': 'rgba(139, 120, 255, .34)', '--text': '#f7f8ff', '--muted': '#9ea9c2', '--blue': '#55b8ff', '--purple': '#9b5cff', '--green': '#4de0ad', '--gradient': 'linear-gradient(110deg, #5aaeff 8%, #8b6cff 51%, #bd55f6 96%)', '--header-bg': 'rgba(5, 8, 20, .72)', '--glow-one': 'rgba(102, 65, 239, .22)', '--glow-two': 'rgba(67, 130, 255, .16)' } },
  { id: 'navy-gold', name: 'Azul-marinho e ouro', scheme: 'dark', swatches: ['#07111f', '#d8aa4d', '#f3d995'], vars: { '--bg': '#07111f', '--bg-deep': '#030913', '--surface': 'rgba(15, 28, 46, .82)', '--surface-strong': '#0f1c2e', '--line': 'rgba(219, 180, 96, .18)', '--line-strong': 'rgba(216, 170, 77, .42)', '--text': '#f7f3e8', '--muted': '#abb8c8', '--blue': '#d8aa4d', '--purple': '#f3d995', '--green': '#6bc7a5', '--gradient': 'linear-gradient(110deg, #b8832f, #e1b85f, #f3d995)', '--header-bg': 'rgba(7, 17, 31, .84)', '--glow-one': 'rgba(181, 126, 35, .15)', '--glow-two': 'rgba(212, 171, 83, .12)' } },
  { id: 'clinical-blue', name: 'Clínico azul', scheme: 'light', swatches: ['#f5f9fc', '#147ca8', '#4db6c6'], vars: { '--bg': '#f5f9fc', '--bg-deep': '#e7f0f6', '--surface': 'rgba(255, 255, 255, .86)', '--surface-strong': '#ffffff', '--line': 'rgba(31, 90, 120, .15)', '--line-strong': 'rgba(20, 124, 168, .36)', '--text': '#102735', '--muted': '#587080', '--blue': '#147ca8', '--purple': '#4b7fb3', '--green': '#278d74', '--gradient': 'linear-gradient(110deg, #147ca8, #4db6c6, #4b7fb3)', '--header-bg': 'rgba(245, 249, 252, .88)', '--glow-one': 'rgba(77, 182, 198, .16)', '--glow-two': 'rgba(20, 124, 168, .12)' } },
  { id: 'forest-sage', name: 'Floresta e sálvia', scheme: 'light', swatches: ['#f4f6ef', '#315c4b', '#9bb780'], vars: { '--bg': '#f4f6ef', '--bg-deep': '#e6eadf', '--surface': 'rgba(255, 255, 250, .86)', '--surface-strong': '#fbfcf7', '--line': 'rgba(49, 92, 75, .16)', '--line-strong': 'rgba(76, 112, 80, .4)', '--text': '#21352d', '--muted': '#68786e', '--blue': '#4c7050', '--purple': '#8b6e52', '--green': '#315c4b', '--gradient': 'linear-gradient(110deg, #315c4b, #6f9169, #a4b982)', '--header-bg': 'rgba(244, 246, 239, .9)', '--glow-one': 'rgba(111, 145, 105, .14)', '--glow-two': 'rgba(155, 183, 128, .14)' } },
  { id: 'burgundy-ivory', name: 'Bordô e marfim', scheme: 'light', swatches: ['#fbf6ee', '#761f35', '#c19a6b'], vars: { '--bg': '#fbf6ee', '--bg-deep': '#efe5d7', '--surface': 'rgba(255, 252, 246, .88)', '--surface-strong': '#fffaf2', '--line': 'rgba(118, 31, 53, .15)', '--line-strong': 'rgba(118, 31, 53, .36)', '--text': '#331c22', '--muted': '#756267', '--blue': '#761f35', '--purple': '#9b5666', '--green': '#527b68', '--gradient': 'linear-gradient(110deg, #761f35, #a74c64, #c19a6b)', '--header-bg': 'rgba(251, 246, 238, .9)', '--glow-one': 'rgba(118, 31, 53, .12)', '--glow-two': 'rgba(193, 154, 107, .14)' } },
  { id: 'academic-indigo', name: 'Acadêmico índigo', scheme: 'light', swatches: ['#f7f5ef', '#27356f', '#9a6b45'], vars: { '--bg': '#f7f5ef', '--bg-deep': '#eae6dc', '--surface': 'rgba(255, 255, 252, .88)', '--surface-strong': '#fffefa', '--line': 'rgba(39, 53, 111, .15)', '--line-strong': 'rgba(39, 53, 111, .34)', '--text': '#20243a', '--muted': '#666b7f', '--blue': '#27356f', '--purple': '#66548f', '--green': '#52765d', '--gradient': 'linear-gradient(110deg, #27356f, #66548f, #9a6b45)', '--header-bg': 'rgba(247, 245, 239, .9)', '--glow-one': 'rgba(102, 84, 143, .12)', '--glow-two': 'rgba(39, 53, 111, .12)' } },
  { id: 'charcoal-copper', name: 'Grafite e cobre', scheme: 'dark', swatches: ['#111313', '#bf7b4b', '#d9a57e'], vars: { '--bg': '#111313', '--bg-deep': '#090a0a', '--surface': 'rgba(30, 31, 30, .82)', '--surface-strong': '#1e1f1e', '--line': 'rgba(217, 165, 126, .15)', '--line-strong': 'rgba(191, 123, 75, .38)', '--text': '#f7f2ed', '--muted': '#b5aaa2', '--blue': '#bf7b4b', '--purple': '#d9a57e', '--green': '#75b698', '--gradient': 'linear-gradient(110deg, #9b5935, #bf7b4b, #d9a57e)', '--header-bg': 'rgba(17, 19, 19, .86)', '--glow-one': 'rgba(191, 123, 75, .14)', '--glow-two': 'rgba(217, 165, 126, .1)' } },
  { id: 'emerald-finance', name: 'Esmeralda executiva', scheme: 'dark', swatches: ['#061511', '#1ca67a', '#7ad8b7'], vars: { '--bg': '#061511', '--bg-deep': '#020b08', '--surface': 'rgba(9, 35, 28, .8)', '--surface-strong': '#09231c', '--line': 'rgba(71, 194, 153, .16)', '--line-strong': 'rgba(28, 166, 122, .42)', '--text': '#f2fff9', '--muted': '#9dbbb0', '--blue': '#1ca67a', '--purple': '#5ab7a0', '--green': '#7ad8b7', '--gradient': 'linear-gradient(110deg, #12815e, #1ca67a, #7ad8b7)', '--header-bg': 'rgba(6, 21, 17, .86)', '--glow-one': 'rgba(28, 166, 122, .18)', '--glow-two': 'rgba(122, 216, 183, .1)' } },
  { id: 'violet-neon', name: 'Violeta futurista', scheme: 'dark', swatches: ['#090611', '#8f5cff', '#ff5bd1'], vars: { '--bg': '#090611', '--bg-deep': '#030207', '--surface': 'rgba(25, 13, 43, .76)', '--surface-strong': '#190d2b', '--line': 'rgba(190, 123, 255, .16)', '--line-strong': 'rgba(143, 92, 255, .46)', '--text': '#fff7ff', '--muted': '#baa7c8', '--blue': '#8f5cff', '--purple': '#ff5bd1', '--green': '#52e4c1', '--gradient': 'linear-gradient(110deg, #6f5cff, #ad55ff, #ff5bd1)', '--header-bg': 'rgba(9, 6, 17, .84)', '--glow-one': 'rgba(143, 92, 255, .22)', '--glow-two': 'rgba(255, 91, 209, .16)' } },
  { id: 'terracotta', name: 'Terracota editorial', scheme: 'light', swatches: ['#fbf5ed', '#b55435', '#de9a69'], vars: { '--bg': '#fbf5ed', '--bg-deep': '#eee2d3', '--surface': 'rgba(255, 251, 245, .88)', '--surface-strong': '#fffaf3', '--line': 'rgba(126, 73, 48, .16)', '--line-strong': 'rgba(181, 84, 53, .38)', '--text': '#3d2921', '--muted': '#79675e', '--blue': '#b55435', '--purple': '#945d52', '--green': '#5f806b', '--gradient': 'linear-gradient(110deg, #a2462d, #d8754c, #de9a69)', '--header-bg': 'rgba(251, 245, 237, .9)', '--glow-one': 'rgba(181, 84, 53, .12)', '--glow-two': 'rgba(222, 154, 105, .14)' } },
  { id: 'ocean-cyan', name: 'Oceano digital', scheme: 'dark', swatches: ['#04131c', '#20b7d2', '#3f7cff'], vars: { '--bg': '#04131c', '--bg-deep': '#02080c', '--surface': 'rgba(7, 31, 45, .8)', '--surface-strong': '#071f2d', '--line': 'rgba(74, 192, 221, .17)', '--line-strong': 'rgba(32, 183, 210, .42)', '--text': '#f1fcff', '--muted': '#9bb8c2', '--blue': '#20b7d2', '--purple': '#3f7cff', '--green': '#48d7ab', '--gradient': 'linear-gradient(110deg, #20b7d2, #3f7cff, #7c5cff)', '--header-bg': 'rgba(4, 19, 28, .86)', '--glow-one': 'rgba(63, 124, 255, .18)', '--glow-two': 'rgba(32, 183, 210, .16)' } },
  { id: 'mono-classic', name: 'Monocromático clássico', scheme: 'light', swatches: ['#f5f4f0', '#292929', '#858585'], vars: { '--bg': '#f5f4f0', '--bg-deep': '#e7e5df', '--surface': 'rgba(255, 255, 252, .88)', '--surface-strong': '#ffffff', '--line': 'rgba(35, 35, 35, .14)', '--line-strong': 'rgba(35, 35, 35, .32)', '--text': '#202020', '--muted': '#686868', '--blue': '#292929', '--purple': '#666666', '--green': '#4b725d', '--gradient': 'linear-gradient(110deg, #202020, #5b5b5b, #929292)', '--header-bg': 'rgba(245, 244, 240, .92)', '--glow-one': 'rgba(40, 40, 40, .06)', '--glow-two': 'rgba(120, 120, 120, .08)' } },
  extraPalette('mist-blue', 'Azul névoa suave', 'light', '#e9f0f4', '#dce6ec', '#243743', '#637580', '#4d8199', '#7896ae', '#578b78'),
  extraPalette('warm-gray', 'Cinza quente suave', 'light', '#eeeae4', '#e0dbd3', '#332f2b', '#756e67', '#756b61', '#a58d79', '#657c68'),
  extraPalette('lavender-soft', 'Lavanda suave', 'light', '#efedf4', '#e2deeb', '#332f40', '#756f82', '#74639b', '#a47ea8', '#5d8576'),
  extraPalette('sand-olive', 'Areia e oliva', 'light', '#eee9dc', '#e1dac8', '#37352b', '#767263', '#6f7650', '#aa8b5a', '#5f8063'),
  extraPalette('slate-blue', 'Ardósia e azul', 'dark', '#111923', '#0a1017', '#f1f5f8', '#9caab5', '#6997c1', '#8d7fb3', '#65ad8d'),
  extraPalette('coffee-cream', 'Café e creme', 'dark', '#1c1511', '#100c09', '#fff7ee', '#b9a99d', '#b7815d', '#d0a77b', '#799b78'),
  extraPalette('rose-professional', 'Rosa profissional', 'light', '#f3e9eb', '#e8dade', '#422e34', '#7d6870', '#9b586c', '#bd8191', '#668879'),
  extraPalette('deep-red', 'Vermelho institucional', 'dark', '#19090c', '#0d0406', '#fff4f5', '#bca1a6', '#bd4053', '#d8796d', '#62a486'),
  extraPalette('sunset-coral', 'Pôr do sol coral', 'light', '#fff1eb', '#f5ddd4', '#432b28', '#806a65', '#d75e4a', '#f29b72', '#4c8b76'),
  extraPalette('midnight-lime', 'Meia-noite e lima', 'dark', '#0c120d', '#050805', '#f4ffe9', '#a8b89d', '#9dcc42', '#d5ef78', '#55bd8b'),
  extraPalette('royal-purple', 'Roxo imperial', 'dark', '#130b22', '#08040f', '#fbf5ff', '#b9a7c9', '#884dcc', '#d46de2', '#58c7a5'),
  extraPalette('sky-peach', 'Céu e pêssego', 'light', '#eef7fb', '#ddebf2', '#243640', '#677985', '#3d9bc1', '#ef9b7c', '#4d947b'),
  extraPalette('petrol-orange', 'Petróleo e laranja', 'dark', '#07181b', '#030c0e', '#f3ffff', '#9eb7b9', '#1e9aa5', '#ef873d', '#54c697'),
  extraPalette('plum-champagne', 'Ameixa e champanhe', 'light', '#faf2f5', '#ecdfe5', '#402731', '#7c6870', '#7d3d5c', '#d2a36f', '#598576'),
  extraPalette('arctic-mint', 'Ártico e menta', 'light', '#edf8f7', '#dcecea', '#203c3b', '#617b79', '#238b86', '#70c9b5', '#3d9073'),
  extraPalette('cobalt-silver', 'Cobalto e prata', 'dark', '#081226', '#030815', '#f5f8ff', '#a3aec5', '#426de0', '#aebbd5', '#55c7a2'),
  extraPalette('mustard-ink', 'Mostarda e tinta', 'light', '#f8f2df', '#ebe2c9', '#282c35', '#6d7077', '#bd8516', '#44526d', '#517b67'),
  extraPalette('berry-blue', 'Frutas vermelhas e azul', 'dark', '#160b19', '#09040b', '#fff5ff', '#bea8c0', '#c34277', '#527ed8', '#55b98f'),
  extraPalette('porcelain-teal', 'Porcelana e teal', 'light', '#f4f5f2', '#e5e9e5', '#263938', '#687a78', '#217b78', '#7c9c9a', '#4b836c'),
  extraPalette('graphite-yellow', 'Grafite e amarelo', 'dark', '#131416', '#08090a', '#fffdf2', '#b3b1a7', '#e2b72f', '#7786a0', '#62b58d'),
]

export const designStyles = [
  { id: 'jd-modern', name: 'JD moderno', description: 'Visual atual: dark, glassmorphism, gradientes e cantos arredondados.' },
  { id: 'futuristic', name: 'Futurista', description: 'Mais brilho, linhas técnicas e contraste digital.' },
  { id: 'executive', name: 'Executivo', description: 'Sóbrio, direto e com superfícies mais sólidas.' },
  { id: 'classic', name: 'Clássico', description: 'Cantos discretos, ritmo tradicional e elegância institucional.' },
  { id: 'editorial', name: 'Editorial', description: 'Tipografia expressiva, espaços amplos e aparência de publicação.' },
  { id: 'clinical', name: 'Clínico', description: 'Limpo, organizado e sereno para saúde e bem-estar.' },
  { id: 'organic', name: 'Orgânico', description: 'Formas suaves e cores naturais, sem perder profissionalismo.' },
  { id: 'academic', name: 'Acadêmico', description: 'Estrutura documental, leitura confortável e autoridade.' },
  { id: 'minimal', name: 'Minimalista atual', description: 'Poucos elementos, espaços generosos e foco absoluto no conteúdo.' },
  { id: 'neo-brutalist', name: 'Neo-brutalista', description: 'Bordas fortes, contraste direto e personalidade contemporânea.' },
  { id: 'retro-office', name: 'Corporativo anos 90', description: 'Visual institucional antigo reinterpretado com boa legibilidade.' },
  { id: 'retro-terminal', name: 'Terminal retrô', description: 'Referência a interfaces antigas, linhas monoespaçadas e estética técnica.' },
  { id: 'luxury', name: 'Luxo discreto', description: 'Ritmo clássico, detalhes finos e apresentação premium.' },
  { id: 'magazine', name: 'Revista contemporânea', description: 'Composição assimétrica e títulos grandes de alto impacto.' },
  { id: 'aurora', name: 'Aurora digital', description: 'Gradientes fluidos, brilho colorido e profundidade tecnológica.' },
  { id: 'bento', name: 'Bento grid', description: 'Blocos modulares inspirados em painéis atuais e produtos digitais.' },
  { id: 'soft-ui', name: 'Soft UI', description: 'Superfícies suaves, volumes discretos e sensação acolhedora.' },
  { id: 'industrial', name: 'Industrial', description: 'Linhas firmes, alto contraste e linguagem de engenharia.' },
  { id: 'newspaper', name: 'Jornal clássico', description: 'Hierarquia editorial, divisórias e leitura informativa.' },
  { id: 'art-deco', name: 'Art Déco', description: 'Geometria elegante, detalhes finos e presença sofisticada.' },
  { id: 'y2k', name: 'Y2K tecnológico', description: 'Referências digitais dos anos 2000 reinterpretadas.' },
  { id: 'swiss', name: 'Suíço internacional', description: 'Grade rigorosa, tipografia limpa e informação objetiva.' },
  { id: 'material', name: 'Material atual', description: 'Camadas claras, elevação funcional e componentes familiares.' },
  { id: 'cyberpunk', name: 'Cyberpunk', description: 'Neon, recortes angulares e atmosfera de alta tecnologia.' },
  { id: 'paper', name: 'Papel e tinta', description: 'Textura editorial suave e sensação de material impresso.' },
  { id: 'monochrome', name: 'Monocromático moderno', description: 'Uma cor dominante, contraste preciso e foco no conteúdo.' },
  { id: 'rounded-playful', name: 'Arredondado criativo', description: 'Formas amigáveis, cartões leves e personalidade acessível.' },
  { id: 'data-grid', name: 'Grade de dados', description: 'Visual analítico, linhas técnicas e organização de dashboard.' },
  { id: 'museum', name: 'Museu e cultura', description: 'Espaços amplos, títulos curatoriais e apresentação contemplativa.' },
  { id: 'compact-pro', name: 'Profissional compacto', description: 'Alta densidade com leitura rápida e acabamento corporativo.' },
]

export const fontOptions = [
  { id: 'dm-manrope', name: 'DM Sans + Manrope', body: "'DM Sans', sans-serif", heading: "'Manrope', sans-serif", description: 'Fonte atual do tema JD.' },
  { id: 'inter', name: 'Inter', body: "'Inter', sans-serif", heading: "'Inter', sans-serif", description: 'Atual, neutra e muito legível.' },
  { id: 'poppins', name: 'Poppins', body: "'Poppins', sans-serif", heading: "'Poppins', sans-serif", description: 'Geométrica e amigável.' },
  { id: 'space-grotesk', name: 'Space Grotesk', body: "'Space Grotesk', sans-serif", heading: "'Space Grotesk', sans-serif", description: 'Tecnológica e contemporânea.' },
  { id: 'ibm-plex', name: 'IBM Plex Sans', body: "'IBM Plex Sans', sans-serif", heading: "'IBM Plex Sans', sans-serif", description: 'Técnica e institucional.' },
  { id: 'montserrat', name: 'Montserrat', body: "'Montserrat', sans-serif", heading: "'Montserrat', sans-serif", description: 'Corporativa e marcante.' },
  { id: 'lora', name: 'Lora + Inter', body: "'Inter', sans-serif", heading: "'Lora', serif", description: 'Elegante para textos e pesquisa.' },
  { id: 'playfair', name: 'Playfair + DM Sans', body: "'DM Sans', sans-serif", heading: "'Playfair Display', serif", description: 'Clássica e editorial.' },
  { id: 'roboto-slab', name: 'Roboto Slab', body: "'Inter', sans-serif", heading: "'Roboto Slab', serif", description: 'Sólida e acadêmica.' },
  { id: 'source-serif', name: 'Source Serif 4', body: "'Source Serif 4', serif", heading: "'Source Serif 4', serif", description: 'Leitura tradicional e confortável.' },
  { id: 'archivo', name: 'Archivo', body: "'Archivo', sans-serif", heading: "'Archivo', sans-serif", description: 'Técnica, estável e muito profissional.' },
  { id: 'barlow', name: 'Barlow', body: "'Barlow', sans-serif", heading: "'Barlow', sans-serif", description: 'Moderna com inspiração industrial.' },
  { id: 'bebas-inter', name: 'Bebas Neue + Inter', body: "'Inter', sans-serif", heading: "'Bebas Neue', sans-serif", description: 'Títulos fortes e conteúdo limpo.' },
  { id: 'cormorant', name: 'Cormorant + DM Sans', body: "'DM Sans', sans-serif", heading: "'Cormorant Garamond', serif", description: 'Elegante, artística e editorial.' },
  { id: 'fira-sans', name: 'Fira Sans', body: "'Fira Sans', sans-serif", heading: "'Fira Sans', sans-serif", description: 'Clara para interfaces e informação.' },
  { id: 'merriweather', name: 'Merriweather + Inter', body: "'Inter', sans-serif", heading: "'Merriweather', serif", description: 'Autoridade com leitura confortável.' },
  { id: 'nunito', name: 'Nunito Sans', body: "'Nunito Sans', sans-serif", heading: "'Nunito Sans', sans-serif", description: 'Suave, acessível e contemporânea.' },
  { id: 'oswald', name: 'Oswald + Inter', body: "'Inter', sans-serif", heading: "'Oswald', sans-serif", description: 'Compacta e marcante nos títulos.' },
  { id: 'raleway', name: 'Raleway', body: "'Raleway', sans-serif", heading: "'Raleway', sans-serif", description: 'Refinada para marcas e serviços.' },
  { id: 'rubik', name: 'Rubik', body: "'Rubik', sans-serif", heading: "'Rubik', sans-serif", description: 'Geométrica, clara e amigável.' },
  { id: 'sora', name: 'Sora', body: "'Sora', sans-serif", heading: "'Sora', sans-serif", description: 'Digital e precisa para tecnologia.' },
  { id: 'urbanist', name: 'Urbanist', body: "'Urbanist', sans-serif", heading: "'Urbanist', sans-serif", description: 'Atual, leve e versátil.' },
  { id: 'work-sans', name: 'Work Sans', body: "'Work Sans', sans-serif", heading: "'Work Sans', sans-serif", description: 'Funcional para produtos e negócios.' },
  { id: 'noto-serif', name: 'Noto Serif', body: "'Noto Serif', serif", heading: "'Noto Serif', serif", description: 'Clássica e preparada para textos longos.' },
  { id: 'libre-baskerville', name: 'Libre Baskerville', body: "'Libre Baskerville', serif", heading: "'Libre Baskerville', serif", description: 'Tradicional e institucional.' },
  { id: 'georgia-system', name: 'Georgia + Arial', body: "Arial, sans-serif", heading: "Georgia, serif", description: 'Combinação clássica sem fonte externa.' },
  { id: 'verdana', name: 'Verdana', body: "Verdana, sans-serif", heading: "Verdana, sans-serif", description: 'Excelente leitura em qualquer tela.' },
  { id: 'trebuchet', name: 'Trebuchet MS', body: "'Trebuchet MS', sans-serif", heading: "'Trebuchet MS', sans-serif", description: 'Web clássica com personalidade.' },
  { id: 'courier', name: 'Courier New + Inter', body: "'Inter', sans-serif", heading: "'Courier New', monospace", description: 'Técnica e retrô para projetos digitais.' },
  { id: 'tahoma', name: 'Tahoma', body: "Tahoma, sans-serif", heading: "Tahoma, sans-serif", description: 'Compacta, sóbria e bastante legível.' },
]

export const professionalPresets = [
  ['technology', 'Tecnologia, BI e dados', 'jd-original', 'jd-modern'], ['law', 'Advocacia', 'navy-gold', 'classic'],
  ['administration', 'Administração', 'navy-gold', 'executive'], ['medicine', 'Medicina', 'clinical-blue', 'clinical'],
  ['nutrition', 'Nutrição', 'forest-sage', 'organic'], ['research', 'Pesquisadores', 'academic-indigo', 'academic'],
  ['engineering', 'Engenharia', 'charcoal-copper', 'executive'], ['architecture', 'Arquitetura', 'mono-classic', 'editorial'],
  ['accounting', 'Contabilidade', 'navy-gold', 'executive'], ['finance', 'Finanças', 'emerald-finance', 'executive'],
  ['education', 'Educação', 'academic-indigo', 'academic'], ['psychology', 'Psicologia', 'forest-sage', 'organic'],
  ['dentistry', 'Odontologia', 'clinical-blue', 'clinical'], ['physiotherapy', 'Fisioterapia', 'ocean-cyan', 'clinical'],
  ['pharmacy', 'Farmácia', 'clinical-blue', 'clinical'], ['nursing', 'Enfermagem', 'ocean-cyan', 'clinical'],
  ['veterinary', 'Veterinária', 'forest-sage', 'organic'], ['marketing', 'Marketing', 'violet-neon', 'futuristic'],
  ['design', 'Design', 'violet-neon', 'editorial'], ['photography', 'Fotografia', 'charcoal-copper', 'editorial'],
  ['gastronomy', 'Gastronomia', 'terracotta', 'editorial'], ['consulting', 'Consultoria', 'navy-gold', 'executive'],
  ['human-resources', 'Recursos Humanos', 'burgundy-ivory', 'organic'], ['logistics', 'Logística', 'ocean-cyan', 'executive'],
  ['agribusiness', 'Agronegócio', 'forest-sage', 'executive'], ['sustainability', 'Sustentabilidade', 'emerald-finance', 'organic'],
  ['real-estate', 'Mercado imobiliário', 'charcoal-copper', 'classic'], ['fashion', 'Moda', 'burgundy-ivory', 'editorial'],
  ['music', 'Música', 'violet-neon', 'futuristic'], ['public-sector', 'Setor público', 'academic-indigo', 'classic'],
  ['journalism', 'Jornalismo', 'mustard-ink', 'newspaper'], ['culture', 'Cultura e museus', 'plum-champagne', 'museum'],
  ['cybersecurity', 'Cibersegurança', 'midnight-lime', 'cyberpunk'], ['industry', 'Indústria', 'graphite-yellow', 'industrial'],
  ['startups', 'Startups', 'sunset-coral', 'bento'], ['software-product', 'Produto digital', 'cobalt-silver', 'material'],
  ['events', 'Eventos', 'berry-blue', 'aurora'], ['beauty', 'Beleza e estética', 'plum-champagne', 'soft-ui'],
  ['sports', 'Esportes', 'petrol-orange', 'data-grid'], ['nonprofit', 'Terceiro setor', 'arctic-mint', 'rounded-playful'],
  ['legal-tech', 'Legal Tech', 'royal-purple', 'compact-pro'], ['publishing', 'Editoração', 'porcelain-teal', 'paper'],
  ['communications', 'Comunicação', 'sky-peach', 'swiss'], ['premium-services', 'Serviços premium', 'navy-gold', 'art-deco'],
  ['creator', 'Criadores digitais', 'violet-neon', 'y2k'],
].map(([id, name, paletteId, designId]) => ({ id, name, paletteId, designId }))

export const defaultAppearance = { presetId: 'technology', paletteId: 'jd-original', designId: 'jd-modern', fontId: 'dm-manrope' }

export function applyAppearance(appearance = defaultAppearance) {
  const palette = colorPalettes.find((item) => item.id === appearance.paletteId) || colorPalettes[0]
  const design = designStyles.find((item) => item.id === appearance.designId) || designStyles[0]
  const font = fontOptions.find((item) => item.id === appearance.fontId) || fontOptions[0]
  const root = document.documentElement
  Object.entries(palette.vars).forEach(([name, value]) => root.style.setProperty(name, value))
  root.dataset.design = design.id
  root.dataset.colorScheme = palette.scheme
  root.style.colorScheme = palette.scheme
  root.style.setProperty('--body-font', font.body)
  root.style.setProperty('--heading-font', font.heading)
}
