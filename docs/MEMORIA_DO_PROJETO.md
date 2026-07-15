# Memória persistente — Portfólio Jever Dias

Última atualização: **14 de julho de 2026**  
Local do projeto: `C:\Users\jever\Documents\Site JD`  
Branch principal: `main`
Repositório: `https://github.com/jeverdias/portfolio-jever-dias`
Site publicado: `https://jeverdias.netlify.app`

## Estado atual

**Versão ativa: evolução integrada das Versões 2, 3 e 4.**

A base visual está concluída em React + Vite. O painel possui integração preparada com Supabase Auth, Database e Storage, formulário Netlify, currículo profissional, trajetória, depoimentos e SEO ampliado. A criação do projeto Supabase exclusivo está pendente porque a organização atual atingiu o limite de dois projetos gratuitos.

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

## Informações ainda necessárias de Jever

- Links definitivos dos três projetos iniciais.
- Email, LinkedIn e GitHub confirmados.
- Prints e vídeos da Versão 3.
- Domínio escolhido na Versão 5.
