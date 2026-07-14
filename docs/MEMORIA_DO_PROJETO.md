# Memória persistente — Portfólio Jever Dias

Última atualização: **14 de julho de 2026**  
Local do projeto: `C:\Users\jever\Documents\Site JD`  
Branch principal: `main`

## Estado atual

**Versão ativa: Versão 1 — portfólio visual estático.**

A base visual está concluída em React + Vite. A estrutura já possui campos e modais preparados para as versões seguintes, mas os links, imagens e vídeos definitivos ainda dependem do conteúdo real fornecido por Jever.

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

Status: **próxima versão**

Objetivos:

- receber os endereços reais dos projetos;
- cadastrar o link incorporado do Power BI;
- cadastrar os links dos sistemas e conteúdos digitais;
- testar quais sites permitem abertura no modal;
- revisar nomes, descrições, tecnologias e resultados de cada entrega;
- confirmar email, LinkedIn e GitHub oficiais.

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

## Informações ainda necessárias de Jever

- URL do repositório GitHub para configurar o remoto `origin`.
- Links definitivos dos três projetos iniciais.
- Email, LinkedIn e GitHub confirmados.
- Prints e vídeos da Versão 3.
- Domínio escolhido na Versão 5.
