# Memória persistente — Portfólio Jever Dias

Última atualização: **17 de julho de 2026**<br>
Local do projeto: `C:\Users\jever\Documents\Site JD`  
Branch de trabalho: `develop` (a produção permanece vinculada à `main`)
Repositório: `https://github.com/jeverdias/portfolio-jever-dias`
Site publicado: `https://jeverdias.netlify.app`

## Estado atual

**Versão ativa: v1.8.8 — arquitetura modular concluída na `develop`, ainda sem integração na `main`.**

Regra permanente: toda correção, adição ou modificação deve atualizar a versão conforme `docs/VERSIONAMENTO.md`. Ao finalizar, sempre sugerir uma mensagem de commit, sem executar commit ou push sem autorização.

A base visual está concluída em React + Vite. O painel possui integração com Supabase Auth, Database e Storage, caixa de mensagens, formulário com fallback Netlify, currículo profissional, trajetória, depoimentos e SEO ampliado. A Etapa 7 foi concluída: `src/styles/index.css` é o ponto único de entrada, o antigo `global.css` foi removido e o CSS está modularizado sem alteração do baseline compilado. A validação atual possui 376 testes Node e 8 classificações, totalizando 384 verificações. A `main`, o Netlify e a produção permanecem inalterados; a v1.8.8 ainda não foi integrada nem publicada. A Etapa 8 está cancelada e não foi iniciada. Limpeza de CSS legado, duplicações, fontes e breakpoints permanece fora do escopo.

## Plano de versões

### Versão 1 — Portfólio visual estático

Status: **construída**

Critérios:

- identidade dark com azul e roxo;
- hero, especialidades, projetos, sobre, contato e rodapé;
- três projetos de exemplo;
- responsividade para desktop e celular;
- componentes organizados;
- build estático pronto para Netlify;
- modo administrador local como infraestrutura de edição.

### Versão 2 — Links reais dos projetos

Status: **em desenvolvimento**

Objetivos:

- receber os endereços reais dos projetos;
- cadastrar o link incorporado do Power BI;
- cadastrar os links dos sistemas e conteúdos digitais;
- testar quais sites permitem abertura no modal;
- revisar nomes, descrições, tecnologias e resultados de cada entrega;
- confirmar email, LinkedIn e GitHub oficiais.
- conectar Supabase Auth, Database e Storage quando o painel passar a publicar alterações online.

Critério de conclusão: todos os cards abrem uma demonstração real ou um destino válido.

### Versão 3 — Prints e vídeos demonstrativos

Status: **planejada**

Objetivos:

- receber prints em boa resolução;
- converter imagens para WebP;
- adicionar capas reais aos cards;
- preparar vídeos curtos e leves de navegação;
- criar galeria ou player dentro dos modais;
- manter carregamento rápido em celular.

Critério de conclusão: cada projeto prioritário possui uma demonstração visual real e otimizada.

### Versão 4 — Formulário de contato

Status: **planejada**

Objetivos:

- adicionar formulário com nome, email, assunto e mensagem;
- usar Netlify Forms para evitar backend próprio;
- incluir proteção contra spam e mensagens de sucesso/erro;
- testar o recebimento das mensagens;
- manter o email como alternativa direta.

Critério de conclusão: uma mensagem enviada pelo site chega corretamente ao destino configurado.

### Versão 5 — Domínio próprio

Status: **planejada**

Objetivos:

- escolher e registrar o domínio;
- conectar o domínio ao Netlify;
- configurar DNS, HTTPS e redirecionamento para o endereço principal;
- atualizar metadados, endereço canônico e imagem social;
- testar o domínio em celular e computador.

Critério de conclusão: o portfólio abre com HTTPS no domínio oficial e sem alertas.

## Decisões técnicas que devem ser preservadas

- Stack: Vite + React.
- Estilo: CSS puro, sem Tailwind.
- Hospedagem prevista: Netlify.
- Conteúdo principal: `src/data/site.js` e `src/data/projects.json`.
- Alterações do administrador ficam no `localStorage` até serem exportadas e incorporadas ao repositório.
- O PIN do frontend não deve ser tratado como autenticação segura.
- O Power BI usa apenas a incorporação; não deve exibir um botão com o link público.
- Projetos web podem usar iframe e botão externo, pois alguns servidores bloqueiam iframe.
- Cada versão deve manter acessibilidade, responsividade e desempenho.

## Protocolo de atualização desta memória

Ao iniciar uma nova versão:

1. Alterar **Versão ativa**.
2. Marcar a versão anterior como concluída.
3. Registrar novos requisitos e decisões.
4. Atualizar a data no topo.
5. Adicionar uma entrada no histórico abaixo.

## Histórico

### 14/07/2026 — Fundação do projeto

- Criada a estrutura React + Vite.
- Implementado o visual dark responsivo.
- Criados cards e modais para Power BI, sistemas e conteúdo digital.
- Criado o modo administrador local com exportação/importação JSON.
- Adicionada configuração do Netlify.
- Git inicializado na branch `main`.
- Definido o roadmap das versões 1 a 5.

### 14/07/2026 — Execução local e VS Code

- Identificado que `node`, `npm` e `code` não estavam disponíveis no PATH do Windows.
- Criado `iniciar-site.cmd` com o caminho do Node.js usado pelo projeto e abertura automática do navegador.
- Criado `abrir-vscode.cmd` para localizar o VS Code e abrir o workspace correto.
- Criado `Site JD.code-workspace` e tarefas em `.vscode`.
- Registrada e ignorada a pasta Git vazia duplicada `Site JD\Site JD`, preservando seus arquivos para revisão do usuário.

### 14/07/2026 — Login e console administrativo

- Substituído o botão do header por um único acesso **Login**.
- Removido o segundo acesso administrativo do rodapé.
- Criadas as áreas Visão geral, Configurações e Repositórios.
- Configurações agora editam apresentação, contatos, redes e números do site.
- Repositórios diferenciam Power BI, sistemas web, conteúdos digitais e GPTs & Agentes de IA.
- A categoria de IA possui um modelo inicial marcado como “Em preparação”, para não apresentar um trabalho ainda não publicado como projeto real.
- No login administrativo, a tecla Enter envia o mesmo formulário do botão “Entrar no painel”.
- Adicionados tema, formato, público-alvo, capa e galeria com até quatro prints.
- Projeto público ganhou abas de demonstração e prints.
- Definido Supabase Auth + Database + Storage como evolução para persistência online segura.

### 14/07/2026 — Instagram e rolagem administrativa

- Adicionado Instagram às configurações e ao rodapé do portfólio.
- Corrigida a rolagem interna das abas e do editor administrativo.
- Adicionado espaço inferior para permitir acesso confortável aos últimos campos.

### 14/07/2026 — GitHub, VS Code e publicação no Netlify

- Repositório público criado em `jeverdias/portfolio-jever-dias`.
- Projeto local conectado ao GitHub Desktop e ao workspace do VS Code.
- Adicionadas tarefas para execução local, build e acesso ao painel de deploy.
- Site Netlify renomeado para `jeverdias`.
- Publicação de produção concluída em `https://jeverdias.netlify.app`.
- Removida pelo usuário a cópia temporária `portfolio-jever-dias-5b807` criada durante o primeiro fluxo do Netlify.
- Deploy contínuo conectado ao repositório original `jeverdias/portfolio-jever-dias`.
- Apenas a branch `main` está autorizada a atualizar o site de produção.
- Deploy manual de produção bloqueado no Netlify; novas versões devem partir de um `push` na `main`.

### 14/07/2026 — Segurança, contato, currículo e credibilidade

- Preparada integração com um projeto Supabase exclusivo do portfólio.
- Adicionados Supabase Auth, validação de administrador, tabelas com RLS e Storage separado.
- PIN local restrito ao ambiente de desenvolvimento; produção exige autenticação segura.
- Adicionado formulário de contato compatível com Netlify Forms e proteção honeypot.
- Adicionada seção de currículo com visualização, download, Lattes e upload pelo Storage.
- Adicionadas métricas, tecnologias, linha do tempo e depoimentos editáveis pelo painel.
- Ampliados SEO, dados estruturados, sitemap, robots, manifest e metadados sociais.
- Projeto Supabase novo não criado porque `JD Org` atingiu o limite de dois projetos gratuitos; os sistemas existentes foram preservados sem alterações.

### 15/07/2026 — Estudos de caso, páginas individuais e biblioteca visual

- Cada projeto passou a ter uma página individual e compartilhável em `/portfolio/id-do-projeto`.
- Criada estrutura de estudo de caso com desafio, solução, resultados, duração e participação de Jever.
- Os novos campos são editáveis na área **Repositórios** do painel administrativo.
- Especialidades ganharam explicações em linguagem simples e exemplos práticos para visitantes leigos.
- Criada a área administrativa **Figurinhas**, com inclusão, edição, exclusão, busca, categorias, cores e coleção de ícones.
- Permitido enviar uma figurinha própria com prévia e orientação de fontes e licenças.
- O box de tecnologias da página inicial e a lista de tecnologias da seção de credibilidade usam a mesma biblioteca editável.
- Capas, prints e figurinhas enviados passam por redução de dimensões e conversão para WebP quando a conversão produz um arquivo menor.
- Galerias das páginas individuais usam carregamento tardio para evitar baixar imagens antes de serem necessárias.
- Sitemap ampliado com os endereços individuais dos projetos iniciais.
- Mudanças mantidas apenas no projeto local; nenhum commit ou push foi realizado sem autorização.

### 15/07/2026 — Planejamento futuro do pulso do Supabase

- Definido que o workflow de atividade só será criado depois que o banco exclusivo do portfólio estiver pronto e testado.
- Removido o workflow executável provisório para evitar uma automação incompleta no GitHub.
- Criado `docs/GITHUB_SUPABASE_KEEP_ALIVE.md` com checklist de banco, tabelas, RLS, Storage, Secrets, publicação, testes e acompanhamento.
- Registrado que a chave privilegiada `service_role` não deverá ser utilizada.
- Registrado que o workflow futuro só funcionará na branch padrão e dependerá de autorização explícita para commit e push.
- Nenhum pulso está ativo neste momento.

### 15/07/2026 — Tipos personalizados e coleção de figurinhas

- O botão **Voltar ao portfólio** das páginas individuais recebeu o mesmo destaque azul/roxo da ação principal.
- Adicionado o atalho **Conhecer o projeto**, que leva diretamente à história/estudo de caso abaixo do resumo.
- O título administrativo do estudo de caso passou a ser **Conte um pouco sobre o projeto**, mantendo uma explicação discreta sobre a finalidade desses campos.
- Projetos agora possuem um **Tipo do portfólio** editável e independente do modelo técnico usado para abrir Power BI, site, conteúdo ou IA.
- Tipos existentes aparecem como opções selecionáveis; um novo tipo digitado é reutilizado automaticamente nos filtros e na lista lateral.
- A seção administrativa foi renomeada para **Box/figurinhas**.
- Figurinhas personalizadas enviadas passam a integrar uma coleção persistente, podem ser aplicadas em vários boxes e possuem exclusão própria.
- Ao excluir uma figurinha da coleção, ela também é removida dos boxes que a utilizavam.
- Nenhum commit ou push foi realizado sem autorização.

### 15/07/2026 — Modelos de exibição e Guia do site

- Modelo de exibição passou a usar uma biblioteca editável armazenada nas configurações gerais.
- Novos modelos recebem nome livre, comportamento-base e uma apresentação pronta.
- A biblioteca possui 10 apresentações: dashboard incorporado, aplicação web ao vivo, galeria, demonstração de IA, estudo de caso, vídeo, documento/PDF, protótipo, antes/depois e repositório de código.
- Modelos personalizados podem ser editados ou excluídos. Na exclusão, projetos vinculados são transferidos para um modelo compatível; os 10 modelos-base permanecem protegidos.
- Área/categoria foi definida como assunto ou setor do projeto, como BI, Saúde ou Educação.
- Criado campo separado **Status do projeto**, com sugestões de andamento e valor personalizado.
- Status passou a aparecer nos cards e na página individual do projeto.
- Criada a seção administrativa **Guia do site**, apresentada como manual interativo.
- O guia contém mapa das áreas, relação entre campos e efeitos públicos, explicações conceituais, regras de demonstração, armazenamento e publicação.
- Adicionadas miniaturas limpas e reais da página inicial e da página de projeto em `public/guide`, capturadas diretamente do site local.
- Nenhum commit ou push foi realizado sem autorização.

### 15/07/2026 — Especialidades e visibilidade das áreas

- Criada a área administrativa **Especialidades**.
- Cada especialidade permite editar nome, resumo do card, explicação para leigos, exemplo, cor, ícone ou figurinha e visibilidade.
- É possível criar e excluir especialidades sem alterar o código-fonte.
- Adicionados controles em **Configurações** para mostrar ou ocultar Hero, Especialidades, Portfólio, Sobre, Credibilidade, Currículo, Contato e Rodapé.
- Ao ocultar uma área, seu item de navegação também é retirado do menu quando aplicável.
- O Guia do site foi atualizado para explicar os 10 modelos, o editor de especialidades e a visibilidade das áreas.
- Nenhum commit ou push foi realizado sem autorização.

### 15/07/2026 — Aparência editável sem alterar a arquitetura

- O visual original JD permanece como tema padrão e pode ser restaurado com um clique.
- Criada a área administrativa **Aparência** sem modificar a arquitetura, os nomes, os textos ou os projetos.
- Adicionados 30 perfis profissionais, incluindo tecnologia, advocacia, administração, medicina, nutrição, pesquisa, engenharia, educação e outras áreas.
- Adicionadas 12 paletas de cores claras e escuras e 8 estilos de design: JD moderno, futurista, executivo, clássico, editorial, clínico, orgânico e acadêmico.
- Cor e estilo podem ser escolhidos separadamente depois da seleção de um perfil profissional.
- A preferência é persistida junto às configurações gerais do site.
- Nenhum commit ou push foi realizado sem autorização.

### v1.1.0 — Aparência ampliada, métricas e conteúdo profissional

- Métricas deixaram de ser quatro campos fixos e passaram a ser uma coleção editável com inclusão, exclusão, ícone, figurinha, cor e visibilidade.
- Criada a área **Trajetória**, reunindo métricas, experiências profissionais e depoimentos em editores separados.
- Status de projeto categorizado em Concluído, Em andamento, Parado e Outro, com texto personalizado em Outro.
- Modelos de exibição ganharam miniaturas explicativas ao passar o mouse ou navegar pelo teclado.
- Aparência ampliada para 20 paletas, 14 estilos de design e 10 opções tipográficas.
- Guia do site detalhado com marcações numeradas nas miniaturas reais.
- Versão atualizada de v1.0.0 para v1.1.0 por se tratar de novas funcionalidades compatíveis.

### v1.2.0 — Prévias contextuais e biblioteca de ícones

- Prévia em modal para cada setor profissional, paleta, estilo e fonte antes de aplicar.
- Prévia em modal por conjunto de alterações dos projetos: identificação, card, apresentação, estudo de caso e mídia.
- Os dez modelos de exibição agora mostram exemplos coerentes com dashboard, sistema, galeria, IA, vídeo, documento, protótipo, comparação, código e estudo de caso.
- Métricas da Trajetória ganharam seleção visual ampliada de ícones e integração clara com Box/figurinhas.
- Inclusão de fontes externas sugeridas para obter novos ícones, com alerta para conferir a licença de uso.
- Versão atualizada de v1.1.0 para v1.2.0 por se tratar de novas funcionalidades compatíveis.

### v1.3.0 — Catálogo visual expandido e métricas responsivas

- Corrigida a grade de métricas da seção Experiência e confiança, mantendo todos os cards com dimensões consistentes.
- O card de tecnologias agora ocupa uma linha completa e não quebra o padrão ao adicionar novas métricas.
- O resumo inicial passou a mostrar as três primeiras métricas visíveis, incluindo métricas personalizadas como UNEB.
- Acrescentadas 12 paletas, totalizando 32 combinações de cores.
- Acrescentados 15 temas profissionais, totalizando 45 sugestões por setor.
- Catálogo ampliado para 30 estilos de design e 30 combinações de fontes, organizados em três colunas no desktop.
- Versão atualizada de v1.2.0 para v1.3.0 por se tratar de novas funcionalidades compatíveis.

### v1.3.1 — Classificação e metadados do portfólio

- Projeto classificado como aplicação web de portfólio profissional com landing page pública e painel administrativo.
- Categorias recomendadas registradas como Portfolio Website e Web Application.
- Descrição, palavras-chave, manifesto, metadados sociais e documentação alinhados com essa classificação.
- Versão atualizada de v1.3.0 para v1.3.1 como ajuste de metadados e documentação.

### v1.4.0 — Classificação comercial editável

- Criada a aba administrativa Classificação do site.
- Incluídos 15 modelos vendáveis para profissionais, empresas, conversão, vendas, conteúdo, produtos digitais e organizações.
- Cada modelo informa público, objetivo, recursos esperados e classificação técnica.
- Aplicar um modelo atualiza classificação, paleta, estilo e fonte sem apagar textos, projetos ou contatos.
- Incluídos filtros, indicação do modelo atual, prévia em modal e referências de mercado.
- Metadados de descrição e categoria passam a acompanhar a classificação selecionada durante a navegação.
- Versão atualizada de v1.3.1 para v1.4.0 por se tratar de nova funcionalidade compatível.

### v1.4.1 — Arquiteturas por classificação e identidade dinâmica

- Restauração única da classificação Portfólio profissional e do tema JD para corrigir a seleção acidental anterior.
- Botão permanente para restaurar o portfólio e o tema JD na aba Classificação do site.
- A classificação passou a modificar composição, cabeçalho, hero, grades, cards, espaçamentos e hierarquia, além de cor, fonte e acabamento.
- Cada modelo explica claramente o que muda no layout.
- Classificação do site reposicionada logo após a identificação no painel e exibida abaixo do nome profissional.
- Iniciais do cabeçalho, rodapé, login, painel e estudo de caso agora são geradas automaticamente a partir do nome cadastrado, com no máximo três letras.
- Versão atualizada de v1.4.0 para v1.4.1 como correção funcional e visual compatível.

### v1.4.2 — Classificações com mudanças estruturais visíveis

- Corrigida a percepção de que a classificação alterava somente cores e fontes.
- Menu, botão principal, títulos de serviços, títulos de projetos e chamada de contato agora acompanham a finalidade do site.
- As classificações podem reordenar as seções públicas sem apagar o conteúdo cadastrado.
- Loja e catálogo priorizam a vitrine; blog prioriza publicações; curso prioriza conteúdos; landing page prioriza benefícios, confiança e conversão.
- Landing page, loja, catálogo e blog ganharam heroes estruturalmente diferentes do portfólio JD.
- Versão atualizada de v1.4.1 para v1.4.2 como correção visual e comportamental compatível.

### v1.5.0 — Estruturas básicas separadas da aparência

- Classificações simplificadas para oito tipos básicos: Portfólio, Landing Page, Institucional, Serviços Profissionais, Negócio Local, Catálogo, Blog e Evento.
- Aplicar uma classificação não altera mais paleta, fonte, estilo ou tema.
- Aparência continua sendo a única área responsável por cores e acabamento visual.
- Métricas ganharam composições específicas: prova social na landing page, faixa de resultados institucional, confiança para serviços, formato compacto local e destaque de evento.
- Landing Page ganhou campos editáveis próprios para etiqueta, oferta, explicação, botão e benefícios.
- Criada uma seção pública exclusiva de benefícios para a Landing Page.
- A migração preserva a aparência existente e restaura somente a estrutura Portfólio quando necessário.
- Versão atualizada de v1.4.2 para v1.5.0 por se tratar de nova funcionalidade compatível.
- Nenhum commit ou push foi realizado sem autorização.

### v1.5.1 — Classificações com ajuda e prévias fiéis

- Adicionado um botão `!` em cada card para explicar, em linguagem simples, para que serve aquele segmento de site e para quem ele é indicado.
- Quando uma classificação está aplicada, o indicador de confirmação aparece à esquerda do botão explicativo.
- O modal Visualizar deixou de usar uma composição genérica e agora mostra uma miniatura específica para cada uma das oito estruturas.
- Site institucional ganhou apresentação empresarial, serviços em linhas e faixa de resultados.
- Serviços profissionais passou a destacar especialidades, confiança, contato e projetos em formato de caso.
- Negócio local passou a priorizar serviços, contato, localização e métricas compactas.
- Catálogo simples passou a priorizar uma vitrine de itens com capas quadradas e faixa resumida de informações.
- As mudanças estruturais continuam preservando paleta, fonte e estilo configurados em Aparência.
- Versão atualizada de v1.5.0 para v1.5.1 como correção visual e funcional compatível.
- Nenhum commit ou push foi realizado sem autorização.

### v1.6.0 — Base online isolada, mensagens e desempenho

- Criado o projeto Supabase separado `site-jd`, na região de São Paulo, sem compartilhar dados com os sistemas existentes.
- Pausado somente o projeto `sistema-campo-homologacao`; o projeto `sistema-campo-vita` foi preservado.
- Schema ampliado com mensagens de contato, políticas RLS, índices e bucket exclusivo para arquivos.
- Adicionada a caixa **Mensagens** ao painel, com busca, filtros, leitura, arquivamento e exclusão.
- Formulário público passa a gravar no Supabase quando configurado e mantém o Netlify como alternativa.
- Uploads de figurinhas passam a usar o Storage no modo online, com validação de tipo e tamanho.
- Painel, páginas de projeto e modais passaram a ser carregados sob demanda.
- Criado teste automatizado das oito classificações e realizada conferência estrutural em desktop e celular.
- Corrigido o layout móvel de Serviços profissionais para uma coluna.
- Preparado workflow de atividade do Supabase a cada seis dias, ainda inativo até existir autorização de commit/push e Secrets no GitHub.
- Identificada antes do uso uma senha técnica inadequada na criação inicial; a senha foi redefinida pelo painel oficial com valor aleatório forte, sem recriar o projeto e sem expor o valor.
- Variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` cadastradas no Netlify para todos os contextos de deploy.
- Usuário `jever_dias@hotmail.com` criado no Supabase Auth e autorizado em `portfolio_admins`.
- Secrets `SUPABASE_URL` e `SUPABASE_ANON_KEY` cadastrados nas Actions do repositório; o workflow permanece inativo enquanto não estiver na `main`.
- Login local testado com sucesso usando Supabase Auth e o administrador autorizado.
- Senha temporária do administrador alterada pela API administrativa do Supabase; novo Login validado e UUID preservado, sem registrar a senha ou tokens no projeto.
- Versão atualizada de v1.5.1 para v1.6.0 por se tratar de novas funcionalidades compatíveis.
- Nenhum commit ou push foi realizado sem autorização.

### v1.8.8 — Arquitetura modular validada na develop

- Etapa 7 concluída com CSS modularizado e `src/styles/index.css` como ponto único de entrada.
- O antigo `global.css` foi removido sem alterar o CSS compilado em relação ao baseline.
- Validação consolidada em 376 testes Node e 8 classificações, totalizando 384 verificações.
- A `main` e a produção continuam inalteradas; a integração da v1.8.8 ainda não ocorreu.
- A Etapa 8 permanece cancelada e não iniciada. Limpeza de CSS legado, duplicações, fontes e breakpoints continua fora do escopo.

## Informações ainda necessárias de Jever

- Links definitivos dos três projetos iniciais.
- Email, LinkedIn e GitHub confirmados.
- Prints e vídeos da Versão 3.
- Domínio escolhido na Versão 5.
