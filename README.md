# 🛍️ LojaQA — Loja para Prática de Testes

Loja virtual educacional construída com HTML, CSS e JavaScript puro (sem dependências), pensada para prática de automação de testes (Selenium, Playwright, Cypress etc.). Inspirada no fluxo do saucedemo.com, mas com identidade própria: interface em português, preços em reais e emissão de nota fiscal fictícia em PDF — gerada por um gerador de PDF escrito do zero, sem biblioteca.

> Projeto educacional. Empresa, produtos, imagens e nota fiscal são fictícios.

## Como executar

Basta baixar a extensão `Live Server` no VS Code ou servir a pasta com um servidor local.

Também possível a utilização a partir de:

```bash
python -m http.server 5500     
```
ou

```bash
npx serve . -l 5500       
```

Depois acesse `http://localhost:5500/html/`. A raiz da aplicação é o `html/index.html` (a vitrine), que é protegida — sem sessão você é redirecionado para `login.html`. Use um dos usuários abaixo para entrar.

## Usuários de teste

| Usuário | Comportamento |
|---|---|
| `usuario_padrao` | Fluxo normal |
| `usuario_bloqueado` | Bloqueado — exibe erro no login |
| `usuario_problema` | Todas as imagens de produto aparecem quebradas |
| `usuario_lento` | Login com atraso artificial de ~5s |
| `usuario_erro` | Ações falham: ordenação dispara `alert` de erro, produtos de id ímpar não podem ser adicionados ao carrinho e "Finalizar Pedido" falha |
| `usuario_visual` | Defeitos visuais propositais: imagens tortas, badge do carrinho deslocado, botões desalinhados, preços em vermelho e alguns preços errados na vitrine |

**Senha para todos:** `senha_teste_123`

## Produtos

**21 produtos** fictícios com tema de QA/tecnologia, de R$ 19,90 a R$ 349,90 — mochila, camisetas, caneca, teclado, mouse, fone, boné, moletom, garrafa, adesivos, caderno, luminária, mousepad, webcam, suporte de notebook, pelúcia do bug, quebra-cabeça de 404 peças e mais. A lista completa com preços e os seletores de cada produto está em [SELETORES.md](SELETORES.md).

## Arquitetura

Separação estrita entre marcação e lógica:

- **HTML não contém JavaScript** — nenhum `<script>` inline nem `onclick`; cada página apenas importa seus scripts com `<script src ... defer>`.
- **JavaScript não contém HTML** — nenhuma string de markup; o conteúdo dinâmico é gerado clonando elementos `<template>` declarados no próprio HTML e preenchidos via `textContent` / atributos.

```
html/*.html                # Páginas da aplicação
js/
  data.js                  # Dados: produtos, usuários, taxa de imposto
  store.js                 # Estado: sessão, carrinho, utilidades
  ui.js                    # UI compartilhada: menu lateral, badge, botões de carrinho
  pdf.js                   # Gerador de PDF próprio (sem dependências), usado pela nota fiscal
  pages/
    login.js               # login.html
    index.js               # index.html (home / lista de produtos)
    item.js                # inventory-item.html
    cart.js                # cart.html
    checkout-info.js       # checkout-step-one.html
    checkout-overview.js   # checkout-step-two.html
    complete.js            # checkout-complete.html
    nota-fiscal.js         # nota-fiscal.html
    sobre.js               # sobre.html
css/style.css              # Estilos globais
img/*.svg                  # Imagens dos produtos
```

Ordem de importação em cada página: `data.js` → `store.js` → `ui.js` → `pages/<página>.js`. As duas páginas sem cabeçalho não carregam o `ui.js`: o login vai direto para o script da página, e a nota fiscal carrega o `pdf.js` no lugar.

## Páginas

| Página | Arquivo |
|---|---|
| **Página inicial (home)** — lista de produtos com ordenação | `index.html` |
| Login (tela de entrada) | `login.html` |
| Detalhe do produto | `inventory-item.html?id=N` |
| Carrinho | `cart.html` |
| Pagamento — dados | `checkout-step-one.html` |
| Pagamento — resumo (subtotal + 8% de impostos) | `checkout-step-two.html` |
| Pedido concluído | `checkout-complete.html` |
| Nota fiscal (PDF) | `nota-fiscal.html` |
| Sobre (propósito do projeto/TCC) | `sobre.html` |

## Funcionalidades

- Validação de login com mensagens "Ops! ..."
- Proteção de rotas: todas as páginas exceto `login.html` exigem sessão e redirecionam para `login.html?error=auth` sem ela
- Adicionar/remover itens do carrinho com badge no ícone
- Ordenação por nome (A–Z / Z–A) e preço (menor–maior / maior–menor)
- Validação dos campos do pagamento (Nome, Sobrenome, CEP)
- Preços em reais (`R$ X,XX`) e cálculo de impostos (8%) no resumo
- Registro do pedido com número, data/hora e itens (`sessionStorage`)
- **Nota fiscal fictícia** com marca d'água "SEM VALOR FISCAL", tabela de itens e totais — o botão "Baixar PDF" gera o arquivo e baixa direto (`nota-fiscal-<numero>.pdf`)
- Catálogo com 21 produtos e banner de boas-vindas com contador
- Página "Sobre" explicando o propósito do projeto (ambiente de testes para TCC)
- Menu lateral: Todos os Produtos, Sobre, Sair, Resetar Aplicação
- Logo "🧪 LojaQA" do cabeçalho é link para a home
- Atributos `data-test` e `id` em todos os elementos relevantes, para seletores estáveis

## Seletores

📋 **O mapa completo de seletores, página por página, está em [SELETORES.md](SELETORES.md)** — inclui tags, classes, atributos, textos, mensagens de erro, os botões de carrinho de cada produto e chaves de armazenamento.

Presentes no HTML:

- ✅ 76 ids como `#id`
- ✅ 97 data-test como `[data-test="..."]`
- ✅ 88 classes como `.classe`

Os botões de carrinho são gerados em runtime e somam mais 21 ids e 42 data-test (um por produto, alternando entre adicionar e remover).
