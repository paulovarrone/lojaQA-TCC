---
titulo: Mapa de Seletores Não Estruturados da LojaQA
projeto: LojaQA — loja virtual fictícia para prática de automação de testes
idioma: pt-BR
finalidade: Base de conhecimento (RAG) para localizar todos os elementos, textos, comportamentos e dados de teste da aplicação LojaQA sem usar id e sem usar data-test
frameworks_alvo: Cypress
convencao_seletores: nenhum seletor usa id nem data-test; cada elemento é localizado por classe CSS (usar como ".classe"), atributo semântico (placeholder, alt, href, type, value, aria-label), hierarquia e posição (usar como "pai > filho", ":nth-child", ":nth-of-type", ":has") e texto visível (usar como cy.contains)
versao_produtos: 21 produtos
---

# Mapa de Seletores Não Estruturados da LojaQA

Este documento é a base de conhecimento dos **seletores não estruturados** da aplicação web **LojaQA**, uma loja virtual fictícia usada para praticar automação de testes. Ele cobre as mesmas páginas e os mesmos elementos do "Mapa de Seletores da LojaQA", mas por outro caminho: **nenhum seletor daqui usa `id` e nenhum usa `data-test`**. A aplicação tem esses atributos, e este documento os ignora de propósito, porque a maioria das aplicações reais que um QA automatiza não oferece atributos de teste dedicados — é preciso saber localizar elementos por estrutura, texto e atributos semânticos. Cada seção é autocontida e descreve os elementos de uma página, com seus seletores prontos para uso, textos visíveis, atributos e comportamentos.

Como interpretar os seletores em qualquer seção deste documento:
- Um seletor iniciado por `.` é uma **classe CSS** (ex.: `.bm-burger-button`) e um seletor entre colchetes é um **atributo semântico** (ex.: `input[placeholder="Usuário"]`, `a[href="cart.html"]`, `img[alt="Mochila do Testador"]`, `button[aria-label="Abrir Menu"]`). Classes se combinam sem espaço (`.btn.btn_action`); com espaço viram descendência (`.cart_item .inventory_item_price`), que é outra coisa.
- Um seletor com `>`, `+`, `:nth-child()`, `:nth-of-type()` ou `:has()` é de **hierarquia e posição** (ex.: `form.checkout_info > input:nth-of-type(4)`, `.inventory_item:has(img[alt="Pelúcia do Bug"])`). Atenção: `:nth-child` conta todos os irmãos e `:nth-of-type` conta só os da mesma tag — os dois raramente coincidem —, e elementos invisíveis como `<template>` e `<script>` também contam como irmãos.
- Localização **por texto visível** é feita com `cy.contains()`, de preferência com escopo para não casar demais (ex.: `cy.contains(".bm-menu a", "Sair")` em vez de `cy.contains("Sair")`). Cuidado com um caso recorrente na LojaQA: o rótulo de um `<input type="submit">` vive no atributo `value` e não em nó de texto, então "Entrar" e "Continuar" **não** são alcançáveis por `cy.contains()` — use `input[value="Entrar"]` e `input[value="Continuar"]`.

---

## Fatos gerais e configuração da LojaQA

Fatos fundamentais para escrever testes na LojaQA:

- **Nome da aplicação:** LojaQA (logotipo exibido como "🧪 LojaQA").
- **Tipo:** loja virtual fictícia de comércio eletrônico, feita apenas com HTML, CSS e JavaScript puro, sem frameworks. Projeto educacional para um TCC.
- **Senha de login (única para todos os usuários):** `senha_teste_123`.
- **Usuários de login aceitos (6),** cada um com um comportamento próprio: `usuario_padrao` (fluxo normal — caminho feliz), `usuario_bloqueado` (login recusado), `usuario_problema` (imagens de produto quebradas), `usuario_lento` (login com ~5 s de atraso), `usuario_erro` (ordenação, itens de id ímpar e finalização falham com `alert`), `usuario_visual` (defeitos visuais e preços errados na vitrine nos ids 0, 5, 10, 15 e 20). Detalhes na seção "Comportamentos especiais por usuário da LojaQA".
- **Taxa de imposto aplicada no checkout:** 8% sobre o subtotal.
- **Formato de preço:** reais no padrão brasileiro, exemplo `R$ 149,90` (com vírgula decimal).
- **Quantidade de produtos no catálogo:** 21.
- **Persistência:** a sessão do usuário fica em `sessionStorage` (chave `session-username`, valor = username logado, ex.: `"usuario_padrao"`) e o carrinho em `localStorage` (chave `cart-contents`, valor = array JSON com os ids dos produtos, ex.: `"[4,0]"`). Demais chaves na seção "Armazenamento (setup e teardown de testes) da LojaQA".
- **Política deste documento:** a LojaQA marca com `data-test` quase todos os elementos interativos e com `id` os principais, mas nenhum seletor deste documento usa esses dois atributos. As âncoras usadas aqui são, em ordem de preferência: atributo semântico estável (`href`, `alt`, `placeholder`, `type`, `value`, `aria-label`), texto visível, classe de componente, hierarquia e, por último, posição.

### Arquivos de página (URLs) da LojaQA

- `index.html` — **página inicial (home)** da LojaQA e raiz do site (o que é servido em `/html/`). É a página de Produtos (catálogo / vitrine / lista de produtos / inventário), exibida logo após o login bem-sucedido. É uma página protegida: sem sessão ativa, redireciona para `login.html?error=auth`.
- `login.html` — página de Login (tela de entrada da aplicação, exibida quando não há sessão ativa). Junto da nota fiscal, é uma das duas páginas sem cabeçalho global e sem menu lateral.
- `inventory-item.html?id=N` — página de Detalhe de um produto (N é o id do produto). O `href` no formato `inventory-item.html?id=N` é a âncora não estruturada mais estável de cada produto em toda a aplicação, porque não muda com a ordenação, com o estado do carrinho nem com o usuário logado.
- `cart.html` — página do Carrinho de compras.
- `checkout-step-one.html` — Checkout etapa 1, formulário de dados do comprador ("Pagamento: Seus Dados").
- `checkout-step-two.html` — Checkout etapa 2, resumo do pedido ("Pagamento: Resumo").
- `checkout-complete.html` — página de Pedido Concluído (confirmação da compra).
- `nota-fiscal.html` — página da Nota Fiscal fictícia, com botão para gerar PDF. Não tem cabeçalho global nem menu lateral, e o `body` tem a classe `.nf_body`, que serve para identificar a página.
- `sobre.html` — página Sobre (explica o propósito do projeto/TCC).

---

## Elementos globais da LojaQA (cabeçalho, menu lateral e rodapé)

Estes elementos aparecem em todas as páginas da LojaQA que têm cabeçalho (todas, exceto a página de Login e a página de Nota Fiscal). A marcação é idêntica nessas sete páginas, o que torna os seletores por hierarquia reutilizáveis — com uma exceção importante: a barra secundária (`.header_secondary_container`) muda de conteúdo por página. Ela tem apenas o `span.title` na maioria das páginas, tem o `span.title` mais o `<select>` de ordenação em `index.html`, e tem o link "← Voltar aos produtos" no lugar do título em `inventory-item.html`.

### Cabeçalho da LojaQA

- **Botão de abrir o menu lateral (ícone hambúrguer ☰):** é um `<button>` com `aria-label="Abrir Menu"` e texto "☰", primeiro filho de `div.header_label`. Seletores: `.bm-burger-button`, `button[aria-label="Abrir Menu"]`, `header .header_label > button`. Clicar abre o menu lateral.
- **Logotipo da LojaQA no topo (link para a home):** é um `<a>` com texto "🧪 LojaQA" e `href="index.html"`, irmão imediatamente seguinte ao botão hambúrguer. Seletores: `.app_logo`, `.header_label > a[href="index.html"]`, `.bm-burger-button + a`, `cy.contains(".app_logo", "🧪 LojaQA")`. Cuidado: `a[href="index.html"]` sem escopo casa também o item "Todos os Produtos" do menu e outros botões de navegação.
- **Link/ícone do carrinho de compras (🛒):** é um `<a>` para `cart.html` dentro de `div.shopping_cart_container`. Seletores: `.shopping_cart_link`, `header a[href="cart.html"]` (o escopo `header` é necessário, porque o botão Cancelar da etapa 1 do checkout também aponta para `cart.html`), `.shopping_cart_container > a`. Clicar vai para o carrinho.
- **Badge de contagem do carrinho:** é um `<span>` filho único do link do carrinho, que nasce com `style="display:none"` e recebe o número de itens via JavaScript. Seletores: `.shopping_cart_badge`, `.shopping_cart_link > span`. Com o carrinho vazio o texto é "0" mas o elemento fica oculto, então asserte por visibilidade (`should("not.be.visible")`) e não por texto vazio.
- **Título da página atual (barra secundária):** é um `<span class="title">`, presente em todas as páginas com cabeçalho menos `inventory-item.html`. Seletores: `.title`, `.header_secondary_container > span`, `header > div:nth-child(2) > span:first-child`. Textos exatos: "Produtos", "Seu Carrinho", "Pagamento: Seus Dados", "Pagamento: Resumo", "Pedido Concluído!" ou "Sobre a LojaQA".

### Menu lateral da LojaQA (barra de navegação lateral / hamburger menu)

O menu lateral abre ao clicar em `.bm-burger-button` (`button[aria-label="Abrir Menu"]`) e já está no DOM desde o carregamento, apenas posicionado fora da tela. Atenção à contagem de irmãos: o **primeiro filho do `<nav>` é o botão de fechar**, e só depois vêm os quatro links — por isso "Todos os Produtos" é o segundo filho, mas o primeiro `<a>`. Contém:

- **Container do menu lateral:** é um `<nav class="bm-menu">`, terceiro filho do `header`. Seletores: `.bm-menu`, `header > nav`. Aberto, recebe a classe `open`, o que dá o seletor composto `nav.bm-menu.open`. O menu fechado não usa `display:none` (fica deslocado para fora da tela), então asserte a presença ou a ausência da classe `open` em vez da visibilidade.
- **Botão de fechar o menu (×):** é um `<button>` com `aria-label="Fechar Menu"` e texto "×", primeiro filho do `nav`. Seletores: `.bm-cross-button`, `button[aria-label="Fechar Menu"]`, `.bm-menu > button`.
- **Item de menu "Todos os Produtos":** é um `<a href="index.html">`. Seletores: `cy.contains(".bm-menu a", "Todos os Produtos")`, `.bm-menu a:nth-of-type(1)`, `.bm-menu > button + a`. Leva de volta para a página inicial (home), `index.html`.
- **Item de menu "Sobre":** é um `<a href="sobre.html">`, o único link para esse destino em toda a página. Seletores: `.bm-menu a[href="sobre.html"]`, `cy.contains(".bm-menu a", "Sobre")`, `.bm-menu a:nth-of-type(2)`. Cuidado ao buscar só pelo texto "Sobre": ele é substring de "Sobre a LojaQA", o título daquela página.
- **Item de menu "Sair" (deslogar):** é um `<a href="#">` com o texto "Sair". Seletores: `cy.contains(".bm-menu a", "Sair")`, `.bm-menu a:nth-of-type(3)`. Sair é a mesma coisa que deslogar: encerra a sessão, **esvazia o carrinho** e volta para `login.html`.
- **Item de menu "Resetar Aplicação":** é um `<a href="#">` com o texto "Resetar Aplicação". Seletores: `cy.contains(".bm-menu a", "Resetar Aplicação")`, `.bm-menu a:nth-of-type(4)`, `.bm-menu a:last-child`. Limpa o carrinho sem deslogar.
- **Overlay (fundo escurecido atrás do menu):** é um `<div class="bm-overlay">` vazio, quarto e último filho do `header`. Seletores: `.bm-overlay`, `header > div:nth-child(4)`, `header > div:nth-of-type(3)` — repare que os dois índices diferem porque `:nth-child` conta o `nav` e `:nth-of-type` não. Clicar nele fecha o menu; recebe `open` quando visível.

### Rodapé da LojaQA

- **Rodapé:** é o `<footer class="footer">`, último elemento visível do `body`. Seletores: `.footer`, `body > footer`.
- **Link do GitHub no rodapé:** é um `<a>` com o texto "GitHub", `href="https://github.com/paulovarrone"` e `target="_blank"`. Seletores: `.footer a[href*="github"]`, `cy.contains(".footer a", "GitHub")`, `.social > li:nth-child(1) > a`. Abre em nova aba.
- **Link do LinkedIn no rodapé:** é um `<a>` com o texto "LinkedIn", `href="https://www.linkedin.com/in/paulovarrone"` e `target="_blank"`. Seletores: `.footer a[href*="linkedin"]`, `cy.contains(".footer a", "LinkedIn")`, `.social > li:nth-child(2) > a`, `.social li:last-child a`. Abre em nova aba.
- **Texto de copyright no rodapé:** é um `<div class="footer_copy">` com o texto "© 2026 LojaQA — Projeto educacional para prática de testes de automação.". Seletores: `.footer_copy`, `.footer > div`, `.social + div`.

---

## Página de Login da LojaQA (login.html)

A página de Login (`login.html`) é a tela de entrada da LojaQA: é por onde o usuário começa, mas **não** é a página inicial/home da loja — a home é `index.html`, exibida depois do login. Nela o usuário digita usuário e senha para entrar. Não possui o cabeçalho global, o menu lateral nem o rodapé, o que a torna reconhecível pelo seletor `.login_container` ou pela ausência de `body > header`. Para fazer login: preencher o campo de usuário, preencher o campo de senha e clicar no botão Entrar.

Elementos da página de Login da LojaQA:

- **Campo de usuário (username):** é um `<input type="text">` com `placeholder="Usuário"`, `autocomplete="username"` e `autofocus`, primeiro filho do formulário. Seletores: `input[placeholder="Usuário"]`, `input[autocomplete="username"]`, `.login-box > input[type="text"]`, `.form_input:first-child`. Recebe a classe `input_error` quando há erro de validação.
- **Campo de senha (password):** é um `<input type="password">` com `placeholder="Senha"` e `autocomplete="current-password"`, segundo filho do formulário e único campo de senha da aplicação. Seletores: `input[type="password"]`, `input[placeholder="Senha"]`, `input[autocomplete="current-password"]`, `input[placeholder="Usuário"] + input`. Recebe `input_error` em erro.
- **Botão Entrar (login/submit):** é um `<input type="submit">` com `value="Entrar"` e as classes `btn` e `btn_action` — **não tem texto de nó**, então `cy.contains("Entrar")` por conteúdo não o encontra. Seletores: `input[value="Entrar"]`, `input[type="submit"]`, `.login-box input[type="submit"]`, `.btn.btn_action`, `.login-box > input:nth-child(4)`, `.login-box > input:nth-of-type(3)`. Para `usuario_lento`, durante ~5 s o `value` vira "Carregando..." e o elemento fica `disabled`: asserte com `input[type="submit"][value="Carregando..."]` ou `input[type="submit"]:disabled`.
- **Formulário de login:** é um `<form class="login-box">` com o atributo `novalidate`. Seletores: `.login-box`, `form[novalidate]`, `.login_wrapper > form`. Seus quatro filhos são, em ordem: campo de usuário, campo de senha, container de erro e botão Entrar.
- **Container da mensagem de erro:** é um `<div class="error-message-container">`, terceiro filho do formulário. Seletores: `.error-message-container`, `.login-box > div`, `.login-box > *:nth-child(3)`, `input[type="password"] + div`. Recebe a classe `visible` quando um erro é exibido, o que dá `.error-message-container.visible`.
- **Texto da mensagem de erro:** é um `<span>` vazio dentro do container de erro, preenchido via JavaScript. Seletores: `.error-message-container > span`, `.error-message-container span:first-child`. Textos exatos possíveis: "Ops! O campo usuário é obrigatório"; "Ops! O campo senha é obrigatório"; "Ops! Usuário e senha não conferem com nenhum usuário cadastrado"; "Ops! Desculpe, este usuário foi bloqueado." (usuario_bloqueado); "Ops! Você precisa estar logado para acessar esta página." (acesso a página protegida sem sessão).
- **Botão de fechar a mensagem de erro (×):** é um `<button type="button">` com `aria-label="Fechar"` e texto "×". Seletores: `.error-button`, `button[aria-label="Fechar"]`, `.error-message-container > button`. Note que o `aria-label` é "Fechar", diferente do "Fechar Menu" do menu lateral.
- **Bloco informativo com a lista de usuários aceitos:** é um `<div class="login_credentials">` cujo título é um `<h4>` com o texto "Usuários aceitos:", seguido dos 6 usernames. Seletores: `.login_credentials`, `.login_credentials_wrap > div:first-child`, `cy.contains(".login_credentials", "usuario_padrao")`.
- **Bloco informativo com a senha:** é um `<div class="login_password">` cujo título é um `<h4>` com o texto "Senha para todos os usuários:", seguido de `senha_teste_123`. Seletores: `.login_password`, `.login_credentials_wrap > div:last-child`, `.login_credentials + div`, `cy.contains(".login_password", "senha_teste_123")`.
- **Logotipo da tela de login:** é um `<div class="login_logo">` com o texto "🧪 LojaQA", primeiro filho do container. Diferente do logotipo do cabeçalho, aqui ele **não é um link**. Seletores: `.login_logo`, `.login_container > div:first-child`.
- **Tagline (subtítulo):** é um `<p class="login_tagline">` com o texto "Sua loja para praticar automação de testes". Seletores: `.login_tagline`, `.login_container > p`, `.login_logo + p`.

Exemplo de login bem-sucedido sem id e sem data-test: digitar `usuario_padrao` em `input[placeholder="Usuário"]`, `senha_teste_123` em `input[placeholder="Senha"]` e clicar em `input[value="Entrar"]`. Após o sucesso, o usuário é redirecionado para a página inicial (home) da loja, que é `index.html` — confirme com `cy.get(".title").should("have.text", "Produtos")`.

---

## Página Inicial / Home / Página de Produtos / Catálogo da LojaQA (index.html)

A página `index.html` é a **página inicial (home) da LojaQA**, ou seja, a página principal exibida logo após o usuário realizar o login com sucesso. Também é chamada de página de Produtos, catálogo, vitrine ou inventário. Lista os 21 produtos da LojaQA em cards gerados por JavaScript a partir de um `<template>`, tem um banner de boas-vindas no topo e um seletor de ordenação. Quando um teste precisa "ir para a home" ou "voltar à página inicial" da loja, o destino é `index.html` (a tela de login `login.html` só aparece antes do login ou após o logout).

Elementos gerais da página de Produtos da LojaQA:

- **Banner de boas-vindas:** é uma `<section class="hero_banner">` que contém o título "Bem-vindo à LojaQA!" em um `<h1>`. Seletores: `.hero_banner`, `body > section`, `header + section`, `cy.contains("h1", "Bem-vindo à LojaQA!")`.
- **Contador de produtos dentro do banner:** é um `<strong>` dentro do `<p>` do banner, preenchido via JavaScript com o número total de produtos (21). Seletores: `.hero_banner p strong`, `.hero_banner > p > strong`.
- **Container da página:** é o `<main class="inventory_container">`. Seletores: `.inventory_container`, `body > main`, `main`.
- **Lista/grade de produtos:** é um `<div class="inventory_list">`, filho único do `main`, preenchido via JavaScript com os 21 cards. Seletores: `.inventory_list`, `main > div`, `.inventory_container > div`. Para contar os produtos: `cy.get(".inventory_list > .inventory_item").should("have.length", 21)`.
- **Seletor de ordenação (dropdown de ordenar produtos):** é um `<select class="product_sort_container">` com 4 opções, segundo e último filho da barra secundária do cabeçalho. Seletores: `.product_sort_container`, `header select`, `.header_secondary_container > select`, `span.title + select`.

Opções do seletor de ordenação da LojaQA (valor do `<option>` → texto exibido), selecionáveis com `cy.get(".product_sort_container").select("lohi")` ou por texto com `select("Preço (menor ao maior)")`:
- valor `az` → "Nome (A a Z)": **ordem alfabética crescente**, pelo nome do produto. É a ordenação ativa quando a página abre (`select > option:first-child`). Primeiro item: "Body do Testadorzinho"; último: "Webcam Full HD VisãoQA".
- valor `za` → "Nome (Z a A)": **ordem alfabética decrescente**, pelo nome do produto. É o inverso de `az`. Seletor da opção: `option[value="za"]` ou `.product_sort_container > option:nth-child(2)`.
- valor `lohi` → "Preço (menor ao maior)": **ordem por preço crescente**, do mais barato ao mais caro. Primeiro item: "Pacote de Adesivos de Bugs" (R$ 19,90); último: "Teclado Mecânico TesteMaster" (R$ 349,90). Seletor da opção: `option[value="lohi"]`.
- valor `hilo` → "Preço (maior ao menor)": **ordem por preço decrescente**, do mais caro ao mais barato. É o inverso de `lohi`. Seletor da opção: `option[value="hilo"]` ou `.product_sort_container > option:last-child`.

Ou seja, `az`/`za` ordenam por **nome** (ordem alfabética) e `lohi`/`hilo` ordenam por **preço** — não confundir "crescente/decrescente" de nome com o de preço. Importante para seletores não estruturados: **qualquer seletor posicional na vitrine (`:nth-child`) depende da ordenação ativa**; o `href` do produto é a alternativa imune à ordenação.

### Card de produto na página de Produtos da LojaQA

Cada produto é exibido em um card (repetido para os 21 produtos), sem nenhum atributo próprio que o identifique. As três âncoras confiáveis de um card específico são o **texto do nome**, o **`alt` da imagem** e o **`href` do link de detalhe** — todos derivados do produto, e não da posição. Dentro de cada card:

- **Card do produto (container):** é um `<div class="inventory_item">`, filho direto de `.inventory_list`. Seletores: `.inventory_item`, `.inventory_list > div`, o card de um produto por conteúdo `.inventory_item:has(a[href="inventory-item.html?id=4"])` ou `.inventory_item:has(img[alt="Mochila do Testador"])`, e por texto `cy.contains(".inventory_item", "Mochila do Testador")`.
- **Nome do produto (link):** é um `<a class="inventory_item_name link-item">` com o nome como texto e `href="inventory-item.html?id=N"`, segundo filho do card. Seletores: `.inventory_item_name`, `.inventory_item > a:nth-of-type(2)`, `.inventory_item_img + a`, `a[href="inventory-item.html?id=4"].inventory_item_name`.
- **Descrição do produto:** é um `<div class="inventory_item_desc">`, terceiro filho do card. Seletores: `.inventory_item_desc`, `.inventory_item > div:first-of-type`, `.inventory_item_name + div`.
- **Preço do produto:** é um `<div class="inventory_item_price">` dentro de `div.pricebar`, no formato `R$ X,XX`. Seletores: `.inventory_item_price`, `.pricebar > div`, e o preço de um produto específico `.inventory_item:has(a[href="inventory-item.html?id=4"]) .inventory_item_price`.
- **Imagem do produto:** é um `<img>` dentro do `<a class="inventory_item_img link-item">`, com o atributo `alt` igual ao nome do produto — é a âncora por acessibilidade de cada card. Seletores: `img[alt="Mochila do Testador"]`, `.inventory_item_img > img`, `.inventory_item > a:first-child > img`.
- **Botão Adicionar ao carrinho / Remover:** é o **único `<button>` do card**, dentro de `div.pricebar`; o texto alterna entre "Adicionar ao carrinho" e "Remover" e a classe alterna entre `btn_inventory` (fora do carrinho) e `btn_secondary` (dentro), sempre com `btn` e `btn_small`. Seletores: `.inventory_item:has(a[href="inventory-item.html?id=4"]) button` (imune à ordenação e ao estado), `.pricebar > button`, `cy.contains(".inventory_item", "Mochila do Testador").find("button")`. Para asserir o estado: `.inventory_item button.btn_inventory` (fora) e `.inventory_item button.btn_secondary` (dentro).

Observação de comportamento: com o usuário `usuario_problema`, todas as imagens dos cards carregam `../img/broken.svg` em vez da imagem real — asserte com `img[src="../img/broken.svg"]` ou `cy.get(".inventory_item img").should("have.attr", "src", "../img/broken.svg")`. Com `usuario_visual`, o `body` recebe a classe `bugs-visuais` (`body.bugs-visuais`) e os preços dos ids 0, 5, 10, 15 e 20 aparecem R$ 10,00 maiores só na vitrine.

---

## Página de Detalhe do Produto da LojaQA (inventory-item.html)

A página de Detalhe (`inventory-item.html?id=N`) mostra um único produto em tamanho grande, onde N é o id do produto. Chega-se a ela clicando no nome ou na imagem de um produto no catálogo. É a única página com cabeçalho em que a barra secundária não tem o `span.title`: no lugar dele há o link "← Voltar aos produtos". Como só há um produto na tela, os seletores por classe são naturalmente únicos aqui, sem precisar de escopo por conteúdo.

Elementos da página de Detalhe do Produto da LojaQA:

- **Container da página de detalhe:** é o `<main class="inventory_details">`. Seletores: `.inventory_details`, `body > main`.
- **Botão/link "Voltar aos produtos":** é um `<a>` com as classes `btn`, `btn_small` e `btn_back`, `href="index.html"` e o texto "← Voltar aos produtos", filho único da barra secundária do cabeçalho nesta página. Seletores: `.btn_back`, `.header_secondary_container > a`, `cy.contains("a", "← Voltar aos produtos")`.
- **Imagem do produto:** é um `<img>` dentro de `div.inventory_details_img`, com `alt` igual ao nome do produto. Seletores: `.inventory_details_img > img`, `main img`, `img[alt="Caneca do Depurador"]`.
- **Nome do produto:** é um `<div class="inventory_details_name">`, primeiro filho de `div.inventory_details_desc_container`. Seletores: `.inventory_details_name`, `.inventory_details_desc_container > div:nth-child(1)`, `cy.contains(".inventory_details_name", "Caneca do Depurador")`.
- **Descrição do produto:** é um `<div class="inventory_item_desc">`, segundo filho do container de descrição — a mesma classe usada no card da vitrine e na linha do carrinho. Seletores: `.inventory_details_desc_container > div:nth-child(2)`, `.inventory_details_name + div`, `main .inventory_item_desc`.
- **Preço do produto:** é um `<div class="inventory_details_price">`, terceiro filho do container de descrição, no formato `R$ X,XX`. Seletores: `.inventory_details_price`, `.inventory_details_desc_container > div:nth-child(3)`, `.inventory_details_desc_container > div:last-of-type`.
- **Botão Adicionar ao carrinho / Remover:** é o **único `<button>` da página**, quarto e último filho do container de descrição, com o texto alternando entre "Adicionar ao carrinho" e "Remover". Seletores: `main button`, `.inventory_details_desc_container > button`, `.inventory_details_desc_container > *:last-child`, `cy.contains("button", "Adicionar ao carrinho")`. Estado: `button.btn_inventory` fora do carrinho, `button.btn_secondary` dentro.
- **Mensagem "item não encontrado":** é um `<p>` com o atributo `hidden` quando o produto existe, primeiro filho do `main`. Seletores: `main > p`, `main > p[hidden]` (produto existe) e `main > p:not([hidden])` (id inválido), `cy.contains("ITEM NÃO ENCONTRADO")`. Texto exato: "ITEM NÃO ENCONTRADO — Este produto não existe.". Quando o id da URL é inválido, os dois wrappers (`.inventory_details_img` e `.inventory_details_desc_container`) recebem `hidden`.

---

## Página do Carrinho da LojaQA (cart.html)

A página do Carrinho (`cart.html`) lista os produtos adicionados ao carrinho e permite continuar comprando ou seguir para o checkout. O título na barra secundária do cabeçalho é "Seu Carrinho". As linhas de produto são geradas por JavaScript a partir de um `<template>`, e cada uma tem a mesma estrutura, sem atributo próprio — a âncora de uma linha específica é o texto do nome ou o `href` do link de detalhe.

Elementos da página do Carrinho da LojaQA:

- **Container da página do carrinho:** é o `<main class="cart_contents_container">`. Seletores: `.cart_contents_container`, `body > main`.
- **Rótulo de coluna "QTD" (quantidade):** é um `<span class="cart_quantity_label">` com o texto "QTD", dentro do primeiro `div` do `main`. Seletores: `.cart_quantity_label`, `main > div:first-child > span:first-child`, `cy.contains("span", "QTD")`.
- **Rótulo de coluna "Descrição":** é um `<span class="cart_desc_label">` com o texto "Descrição", irmão seguinte do rótulo QTD. Seletores: `.cart_desc_label`, `.cart_quantity_label + span`, `cy.contains("span", "Descrição")`.
- **Mensagem de carrinho vazio:** é um `<p class="cart_empty">` com o atributo `hidden` quando há itens. Seletores: `.cart_empty`, `main > p`, `p[hidden]` (com itens) e `.cart_empty:not([hidden])` (vazio), `cy.contains("Seu carrinho está vazio.")`. Texto exato: "Seu carrinho está vazio.".
- **Lista de itens do carrinho:** é um `<div class="cart_list">`, preenchido via JavaScript. Seletores: `.cart_list`, `main > div:nth-of-type(2)`, `.cart_empty + div`. Para contar os itens: `cy.get(".cart_list > .cart_item").should("have.length", 2)`.
- **Botão "Continuar Comprando":** **não é um `<button>`** — é um `<a>` com as classes `btn` e `btn_secondary`, `href="index.html"` e o texto "Continuar Comprando". Seletores: `cy.contains("a", "Continuar Comprando")`, `.cart_footer > a:first-child`, `.cart_footer a[href="index.html"]`.
- **Botão "Finalizar Compra" (ir para o checkout):** **também é um `<a>`**, com as classes `btn` e `btn_action`, `href="checkout-step-one.html"` e o texto "Finalizar Compra". Seletores: `cy.contains("a", "Finalizar Compra")`, `a[href="checkout-step-one.html"]`, `.cart_footer > a:last-child`.

### Item dentro do Carrinho da LojaQA

Cada produto no carrinho aparece como uma linha com:
- **Linha do item do carrinho:** é um `<div class="cart_item">`, filho direto de `.cart_list`. Seletores: `.cart_item`, `.cart_list > div`, a linha de um produto por conteúdo `.cart_item:has(a[href="inventory-item.html?id=6"])`, e por texto `cy.contains(".cart_item", "Caneca do Depurador")`.
- **Quantidade do item:** é um `<div class="cart_quantity">` com o texto "1", primeiro filho da linha (a LojaQA não tem controle de quantidade). Seletores: `.cart_quantity`, `.cart_item > div:first-child`.
- **Nome do item (link):** é um `<a class="inventory_item_name">` com `href="inventory-item.html?id=N"`, que leva ao detalhe do produto. Seletores: `.cart_item .inventory_item_name`, `.cart_item_label > a`, `cy.contains(".cart_item a", "Caneca do Depurador")`.
- **Descrição do item:** é um `<div class="inventory_item_desc">`, segundo filho de `div.cart_item_label`. Seletores: `.cart_item .inventory_item_desc`, `.cart_item_label > div:first-of-type`, `.cart_item_label > a + div`.
- **Preço do item:** é um `<div class="inventory_item_price">` dentro de `div.item_pricebar`, no formato `R$ X,XX`. Seletores: `.cart_item .inventory_item_price`, `.item_pricebar > div`, e o preço de um item específico `.cart_item:has(a[href="inventory-item.html?id=6"]) .inventory_item_price`.
- **Botão Remover:** é o único `<button>` da linha, dentro de `div.item_pricebar`, sempre com o texto "Remover" e a classe `btn_secondary` (todo item listado já está no carrinho). Seletores: `.cart_item:has(a[href="inventory-item.html?id=6"]) button`, `cy.contains(".cart_item", "Caneca do Depurador").find("button")`, `.item_pricebar > button`, `cy.contains("button", "Remover")`.

---

## Página de Checkout Etapa 1 da LojaQA (checkout-step-one.html) — dados do comprador

A etapa 1 do checkout (`checkout-step-one.html`), com título "Pagamento: Seus Dados", tem um formulário onde o comprador informa nome, sobrenome e CEP. Para avançar: preencher os três campos e clicar em Continuar. Todos os campos são obrigatórios e a validação é por ordem — nome, depois sobrenome, depois CEP. Os três campos compartilham a classe `.form_input`, então a âncora individual de cada um é o `placeholder`.

Elementos da página de Checkout Etapa 1 da LojaQA:

- **Container da página:** é o `<main class="checkout_container">`. Seletores: `.checkout_container`, `body > main`.
- **Formulário de checkout:** é um `<form class="checkout_info">` com o atributo `novalidate`, filho único do `main`. Seletores: `.checkout_info`, `form[novalidate]`, `main > form`. Seus seis filhos são, em ordem: nome, sobrenome, CEP, container de erro, link Cancelar e botão Continuar.
- **Campo Nome (primeiro nome):** é um `<input type="text">` com `placeholder="Nome"` e `autofocus`, primeiro filho do formulário. Seletores: `input[placeholder="Nome"]`, `.checkout_info > input:first-child`, `.form_input:nth-of-type(1)`. Recebe `input_error` em erro.
- **Campo Sobrenome:** é um `<input type="text">` com `placeholder="Sobrenome"`, segundo filho do formulário. Seletores: `input[placeholder="Sobrenome"]`, `input[placeholder="Nome"] + input`, `.checkout_info > input:nth-of-type(2)`.
- **Campo CEP (código postal):** é um `<input type="text">` com `placeholder="CEP"`, terceiro filho do formulário. Seletores: `input[placeholder="CEP"]`, `input[placeholder="Sobrenome"] + input`, `.checkout_info > input:nth-of-type(3)`. Cuidado: `input[type="text"]:last-of-type` **não** funciona aqui, porque `:last-of-type` conta por tag e o último `input` do formulário é o Continuar, de `type="submit"`.
- **Container da mensagem de erro:** é um `<div class="error-message-container">`, quarto filho do formulário. Seletores: `.error-message-container`, `.checkout_info > div`, `.checkout_info > *:nth-child(4)`, `input[placeholder="CEP"] + div`. Recebe a classe `visible` quando exibido: `.error-message-container.visible`.
- **Texto da mensagem de erro:** é um `<span>` dentro do container de erro. Seletores: `.error-message-container > span`. Os textos começam com "Erro: ", ao contrário dos do login, que começam com "Ops! ".
- **Botão de fechar erro (×):** é um `<button type="button">` com `aria-label="Fechar"` e texto "×". Seletores: `.error-button`, `button[aria-label="Fechar"]`, `.error-message-container > button`.
- **Botão Cancelar:** **não é um botão** — é um `<a>` com as classes `btn` e `btn_secondary`, `href="cart.html"` e o texto "Cancelar", quinto filho e único `<a>` do formulário. Seletores: `cy.contains("a", "Cancelar")`, `form.checkout_info > a`, `.checkout_info .btn_secondary`, `main a[href="cart.html"]` (escopo necessário: o ícone do carrinho no cabeçalho aponta para o mesmo destino).
- **Botão Continuar (avançar):** é um `<input type="submit">` com `value="Continuar"` e as classes `btn` e `btn_action` — **sem texto de nó**, logo `cy.contains("Continuar")` por conteúdo não o encontra. Seletores: `input[type="submit"][value="Continuar"]`, `.checkout_info > input:nth-child(6)`, `.checkout_info > input:nth-of-type(4)`, `.checkout_info > *:last-child`, `.checkout_info > a + input`. Avança para `checkout-step-two.html`.

---

## Página de Checkout Etapa 2 da LojaQA (checkout-step-two.html) — resumo do pedido

A etapa 2 do checkout (`checkout-step-two.html`), com título "Pagamento: Resumo", mostra o resumo do pedido: itens, forma de pagamento, entrega, subtotal, impostos (8%) e total. Para concluir a compra: clicar em Finalizar Pedido. Os itens do resumo usam a mesma estrutura das linhas do carrinho (`.cart_item`, `.cart_quantity`, `.inventory_item_name`, `.inventory_item_desc`, `.inventory_item_price`), porém **sem o botão Remover** — o que dá um seletor de diferenciação útil: `.cart_item:not(:has(button))`.

Elementos da página de Checkout Etapa 2 (resumo) da LojaQA:

- **Container da página:** é o `<main class="checkout_container">`, a mesma classe da etapa 1 — para distinguir as duas páginas, use o título `cy.contains(".title", "Pagamento: Resumo")` ou a presença de `.summary_info`. Seletores: `.checkout_container`, `body > main`.
- **Lista de itens do resumo:** é um `<div class="cart_list">`, preenchido via JavaScript. Seletores: `.cart_list`, `main > div:nth-of-type(2)`. Para contar: `cy.get(".cart_list > .cart_item").should("have.length", 2)`.
- **Bloco de resumo (informações de pagamento):** é um `<div class="summary_info">` com exatamente oito filhos, na ordem descrita abaixo. Seletores: `.summary_info`, `main > div:nth-of-type(3)`, `.cart_list + div`.
- **Rótulo "Forma de Pagamento:":** é o primeiro filho do bloco de resumo, um `<div class="summary_info_label">`. Seletores: `.summary_info > div:nth-child(1)`, `.summary_info_label:first-child`, `cy.contains(".summary_info div", "Forma de Pagamento:")`.
- **Valor da forma de pagamento:** é o segundo filho, um `<div class="summary_value_label">` com o texto "CartãoQA #31337". Seletores: `.summary_info > div:nth-child(2)`, `.summary_value_label:nth-child(2)` (note que `:nth-of-type` não serve, porque conta por tag e todos os oito filhos são `div`), `cy.contains("CartãoQA #31337")`.
- **Rótulo "Entrega:":** é o terceiro filho do bloco de resumo. Seletores: `.summary_info > div:nth-child(3)`, `cy.contains(".summary_info div", "Entrega:")`.
- **Valor da entrega:** é o quarto filho, com o texto "Entrega Expressa Grátis!". Seletores: `.summary_info > div:nth-child(4)`, `cy.contains("Entrega Expressa Grátis!")`.
- **Rótulo "Resumo de Valores":** é o quinto filho do bloco de resumo. Seletores: `.summary_info > div:nth-child(5)`, `.summary_info_label:nth-child(5)`, `cy.contains(".summary_info div", "Resumo de Valores")`.
- **Subtotal:** é o sexto filho, um `<div class="summary_subtotal_label">` com o texto no formato "Subtotal: R$ X,XX". Seletores: `.summary_subtotal_label`, `.summary_info > div:nth-child(6)`, `cy.contains(".summary_info div", "Subtotal:")`.
- **Impostos (8%):** é o sétimo filho, um `<div class="summary_tax_label">` com o texto no formato "Impostos (8%): R$ X,XX". Seletores: `.summary_tax_label`, `.summary_info > div:nth-child(7)`, `.summary_subtotal_label + div`.
- **Total:** é o oitavo e último filho, um `<div class="summary_total_label">` com o texto no formato "Total: R$ X,XX". O total é o subtotal mais 8% de impostos. Seletores: `.summary_total_label`, `.summary_info > div:last-child`, `.summary_info > div:nth-child(8)`.
- **Botão Cancelar:** é um `<a>` com as classes `btn` e `btn_secondary`, `href="index.html"` e o texto "Cancelar". Seletores: `cy.contains("a", "Cancelar")`, `.cart_footer > a`, `.cart_footer a[href="index.html"]`.
- **Botão Finalizar Pedido:** este é um `<button>` de verdade, com texto de nó, as classes `btn` e `btn_action`. Seletores: `cy.contains("button", "Finalizar Pedido")`, `.cart_footer > button`, `main button`. Registra o pedido, limpa o carrinho e vai para `checkout-complete.html`.

---

## Página de Pedido Concluído da LojaQA (checkout-complete.html)

A página de Pedido Concluído (`checkout-complete.html`), com título "Pedido Concluído!", confirma que a compra foi finalizada e oferece gerar a nota fiscal ou voltar à loja. É a página com a estrutura mais simples da LojaQA: cinco filhos diretos no `main`, sendo dois deles links de ação.

Elementos da página de Pedido Concluído da LojaQA:

- **Container da página:** é o `<main class="checkout_complete_container">`. Seletores: `.checkout_complete_container`, `body > main`.
- **Imagem de confirmação:** é um `<img class="pony_express">` com `src="../img/pony-express.svg"` e `alt="Pedido confirmado"`, primeiro filho do `main`. Seletores: `.pony_express`, `img[alt="Pedido confirmado"]`, `main > img`.
- **Título de conclusão:** é um `<h2 class="complete-header">` com o texto "Obrigado pelo seu pedido!". Seletores: `.complete-header`, `main > h2`, `cy.contains("h2", "Obrigado pelo seu pedido!")`.
- **Texto de confirmação:** é um `<div class="complete-text">` que contém "Pedido #XXXXXXXX confirmado! Ele foi despachado e chegará rapidinho até você.". Seletores: `.complete-text`, `main > div`, `.complete-header + div`, `cy.contains(".complete-text", "confirmado!")`.
- **Número do pedido:** é um `<strong>` dentro do texto de confirmação, preenchido via JavaScript com "#" seguido de 8 dígitos. Seletores: `.complete-text > strong`, `.complete-text strong`. Para asserir o formato: `cy.get(".complete-text strong").invoke("text").should("match", /^#\d{8}$/)`.
- **Botão "Gerar Nota Fiscal (PDF)":** é um `<a>` com as classes `btn`, `btn_action` e `btn_complete`, `href="nota-fiscal.html"` e o texto "Gerar Nota Fiscal (PDF)". Seletores: `a[href="nota-fiscal.html"]`, `cy.contains("a", "Gerar Nota Fiscal (PDF)")`, `main > a:first-of-type`, `.btn_action.btn_complete`.
- **Botão "Voltar à Loja":** é um `<a>` com as classes `btn`, `btn_secondary` e `btn_complete`, `href="index.html"` e o texto "Voltar à Loja". Seletores: `cy.contains("a", "Voltar à Loja")`, `main > a:last-of-type`, `.btn_secondary.btn_complete`, `main > *:last-child`.

---

## Página de Nota Fiscal da LojaQA (nota-fiscal.html)

A página de Nota Fiscal (`nota-fiscal.html`) exibe um documento fictício de nota fiscal do último pedido e tem um botão "Baixar PDF" que gera o arquivo e faz o download direto. O arquivo baixado se chama `nota-fiscal-<numero-do-pedido>.pdf` (exemplo: `nota-fiscal-45231987.pdf`), o que permite validar o download no teste (por exemplo, com `cy.readFile` na pasta de downloads do Cypress). Não possui o cabeçalho global nem menu lateral — o `body` tem a classe `.nf_body`, e o único `<header>` da página é o interno da nota (`.nf_cabecalho`), então o seletor `header` aqui **não** casa o cabeçalho global. A única saída é o botão "Voltar", que leva ao Pedido Concluído. Só mostra dados se houver um pedido finalizado.

Elementos da página de Nota Fiscal da LojaQA:

- **Container da página:** é o `<main class="nf_container">`. Seletores: `.nf_container`, `body.nf_body > main`.
- **Mensagem "pedido não encontrado":** é um `<p>` com o atributo `hidden` quando há pedido, primeiro filho do `main`. Seletores: `main > p`, `main > p:not([hidden])` (sem pedido), `cy.contains("Nenhum pedido encontrado")`. Texto exato: "Nenhum pedido encontrado. Finalize uma compra para gerar a nota fiscal.".
- **Documento da nota fiscal:** é um `<article class="nf_documento">` com o atributo `hidden` quando não há pedido. Seletores: `.nf_documento`, `main > article`, `article:not([hidden])`.
- **Marca d'água:** é um `<div class="nf_marca_dagua">` com o texto "SEM VALOR FISCAL", primeiro filho do documento. Seletores: `.nf_marca_dagua`, `.nf_documento > div:first-child`, `cy.contains("SEM VALOR FISCAL")`.
- **Dados do emitente:** é um `<div class="nf_empresa">` com a empresa fictícia e o CNPJ 00.000.000/0001-00. Seletores: `.nf_empresa`, `.nf_cabecalho div:first-child > div:nth-child(2)`, `cy.contains(".nf_empresa", "CNPJ: 00.000.000/0001-00")`.
- **Número da nota:** é um `<strong>` dentro do terceiro `div` do bloco de identificação, com 8 dígitos (sem o "#" que aparece na página de conclusão). Seletores: `.nf_identificacao > div:nth-child(3) > strong`, `.nf_identificacao strong`.
- **Data de emissão:** é um `<span>` dentro do quarto `div` do bloco de identificação, no formato "DD/MM/AAAA HH:MM:SS". Seletores: `.nf_identificacao > div:nth-child(4) > span`, `.nf_identificacao span`, `cy.contains(".nf_identificacao div", "Emissão:")`.
- **Dados do destinatário:** é uma `<section class="nf_destinatario">` cujo título é um `<h3>` com o texto "Destinatário". Seletores: `.nf_destinatario`, `.nf_documento > section:first-of-type`, `cy.contains("h3", "Destinatário")`.
- **Nome do cliente:** é o segundo filho do bloco do destinatário (o primeiro é o `<h3>`), com o nome e o sobrenome informados no checkout. Seletores: `.nf_destinatario > div:nth-child(2)`, `.nf_destinatario h3 + div`, `.nf_destinatario div:first-of-type`.
- **CEP do cliente:** é o terceiro filho do bloco do destinatário, com o texto "CEP: XXXXX". Seletores: `.nf_destinatario > div:nth-child(3)`, `.nf_destinatario > div:last-child`, `cy.contains(".nf_destinatario div", "CEP:")`.
- **Tabela de itens:** é uma `<table class="nf_tabela">` com as colunas Item, Descrição, Qtd e Valor. Seletores: `.nf_tabela`, `main table`. Os cabeçalhos são `.nf_tabela thead th` e podem ser lidos por texto com `cy.contains("th", "Descrição")`.
- **Corpo da tabela de itens:** é o `<tbody>`, preenchido via JavaScript. Seletores: `.nf_tabela > tbody`, `table tbody`. Para contar os itens: `cy.get(".nf_tabela tbody tr").should("have.length", 2)`.
- **Bloco de totais da nota:** é uma `<section class="nf_totais">` que agrupa subtotal, impostos e total. Seletores: `.nf_totais`, `.nf_documento > section:last-of-type`, `table + section`.
- **Subtotal da nota:** é o primeiro filho do bloco de totais, com o texto "Subtotal: R$ X,XX". Seletores: `.nf_totais > div:nth-child(1)`, `.nf_totais > div:first-child`, `cy.contains(".nf_totais div", "Subtotal:")`.
- **Impostos da nota:** é o segundo filho do bloco de totais, com o texto "Impostos (8%): R$ X,XX". Seletores: `.nf_totais > div:nth-child(2)`, `cy.contains(".nf_totais div", "Impostos (8%):")`.
- **Total da nota:** é o terceiro e último filho do bloco de totais, um `<div class="nf_total">` com o texto "Total: R$ X,XX". Seletores: `.nf_total`, `.nf_totais > div:last-child`, `.nf_totais > div:nth-child(3)`.
- **Aviso legal:** é um `<p class="nf_aviso">` com o texto "Documento sem valor fiscal — gerado por uma aplicação educacional de prática de testes de automação.". Seletores: `.nf_aviso`, `.nf_documento > p`, `.nf_documento > *:last-child`.
- **Botão Voltar:** é um `<a>` com as classes `btn` e `btn_secondary`, `href="checkout-complete.html"` e o texto "Voltar". Seletores: `a[href="checkout-complete.html"]`, `cy.contains("a", "Voltar")`, `.nf_acoes > a`.
- **Botão "Baixar PDF":** é um `<button>` de verdade, com texto de nó e as classes `btn` e `btn_action`. Seletores: `cy.contains("button", "Baixar PDF")`, `.nf_acoes > button`, `main button`. Ao clicar, gera o PDF e baixa o arquivo diretamente, sem abrir nova aba. Se não houver pedido finalizado, o clique não gera arquivo.

Cada linha de item da tabela da nota fiscal é um `<tr>` com quatro `<td>`, sem classe: a linha é `.nf_tabela tbody tr` (a de índice N é `.nf_tabela tbody tr:nth-child(N)`); o número sequencial é `td:nth-child(1)`; a descrição, que é o nome do produto, é `td:nth-child(2)` — e permite localizar a linha de um produto por texto, com `cy.contains(".nf_tabela tr", "Mochila do Testador")`; a quantidade, sempre "1", é `td:nth-child(3)`; e o valor, no formato "R$ X,XX", é `td:nth-child(4)` ou `td:last-child`.

---

## Página Sobre da LojaQA (sobre.html)

A página Sobre (`sobre.html`), com título "Sobre a LojaQA", explica o propósito do projeto (ambiente de testes para um TCC). Usa o cabeçalho, o menu lateral e o rodapé globais. Os três cards não têm atributo próprio: a âncora de cada um é o texto do seu `<h2>` ou a posição entre os irmãos.

Elementos da página Sobre da LojaQA:
- **Container da página:** é o `<main class="sobre_container">`, com exatamente três `<section>` filhas. Seletores: `.sobre_container`, `body > main`.
- **Card "Por que este site existe?":** é a primeira `<section class="sobre_card">`, cujo `<h2>` tem esse texto. Explica o propósito (TCC). Seletores: `.sobre_card:nth-child(1)`, `main > section:first-child`, `cy.contains(".sobre_card", "Por que este site existe?")`.
- **Card "O que dá para testar aqui":** é a segunda `<section class="sobre_card">`, e é a única que contém uma `<ul>` com a lista de funcionalidades. Seletores: `.sobre_card:nth-child(2)`, `main > section:nth-of-type(2)`, `.sobre_card:has(ul)`, `cy.contains(".sobre_card", "O que dá para testar aqui")`. Os itens da lista são `.sobre_card ul > li`.
- **Card "Tecnologias":** é a terceira e última `<section class="sobre_card">`, que descreve a stack e a autoria (o nome do autor está em um `<strong>`). Seletores: `.sobre_card:last-child`, `main > section:nth-of-type(3)`, `cy.contains(".sobre_card", "Tecnologias")`.

---

## Comportamentos especiais por usuário da LojaQA

A LojaQA tem 6 usuários de login, todos com a senha `senha_teste_123`. Cada usuário provoca um comportamento diferente na aplicação — isto é fundamental para escolher qual usuário usar em cada cenário de teste.

- **usuario_padrao:** fluxo normal, sem defeitos. É o usuário indicado para testar o caminho feliz (comprar do início ao fim com sucesso).

- **usuario_bloqueado:** o login é recusado. Ao tentar entrar, aparece em `.error-message-container > span` a mensagem "Ops! Desculpe, este usuário foi bloqueado." e a navegação não sai de `login.html`. Usar para testar login negado / usuário bloqueado.

- **usuario_lento:** o login funciona, mas com atraso artificial de cerca de 5 segundos. Durante a espera, o botão de entrar fica `disabled` e o seu `value` muda para "Carregando...". Asserte com `input[type="submit"]:disabled` ou `input[type="submit"][value="Carregando..."]` — e não por texto, já que o rótulo está no atributo `value`. Usar para testar espera, loading e performance.

- **usuario_problema:** o login funciona, mas todas as imagens de produto ficam quebradas — a tag `img` aponta para `src="../img/broken.svg"` tanto na vitrine quanto no detalhe. Asserte com `img[src="../img/broken.svg"]` ou `cy.get(".inventory_item img").should("have.attr", "src", "../img/broken.svg")`. Usar para testar imagens quebradas / atributos de imagem.

- **usuario_erro:** o login funciona, mas várias ações falham de propósito. Três defeitos: (1) trocar o valor de `.product_sort_container` dispara um `alert` de erro e a ordenação volta para "az"; (2) clicar em "Adicionar ao carrinho" de produtos com id ÍMPAR não tem efeito (o badge `.shopping_cart_badge` não muda e é emitido um `console.error`) — produtos de id par funcionam normalmente; (3) clicar no botão "Finalizar Pedido" (`cy.contains("button", "Finalizar Pedido")`) dispara um `alert` e o pedido NÃO é concluído. Usar para testar tratamento de falhas e diálogos `alert`.

- **usuario_visual:** o login funciona, mas a aplicação recebe defeitos visuais propositais — o elemento `body` ganha a classe `bugs-visuais` (seletor `body.bugs-visuais`), que provoca: logotipo deslocado, badge do carrinho posicionado no canto errado, imagens de alguns cards (`.inventory_item:nth-child(3n) img`) tortas/rotacionadas, botões de alguns cards (`.inventory_item:nth-child(4n) button`) desalinhados, preços em vermelho e itálico, e preços ERRADOS na vitrine: os produtos de id múltiplo de 5 (ids 0, 5, 10, 15 e 20) mostram R$ 10,00 a mais na vitrine, mas o carrinho e o checkout mostram o preço correto. Usar para testes de regressão visual e de asserção de preço/inconsistência.

---

## Mensagens de erro da LojaQA

As mensagens de erro aparecem no `<span>` dentro do container `.error-message-container`, que recebe a classe `visible` quando exibido — o seletor completo do texto é `.error-message-container > span`, ou `.error-message-container.visible span` quando se quer garantir que o erro está visível. Use estes textos exatos para asserções, com `cy.contains()`.

Mensagens de erro do Login da LojaQA (todas começam com "Ops! "):
- Usuário em branco: "Ops! O campo usuário é obrigatório".
- Senha em branco: "Ops! O campo senha é obrigatório".
- Usuário/senha incorretos: "Ops! Usuário e senha não conferem com nenhum usuário cadastrado".
- Usuário bloqueado (usuario_bloqueado): "Ops! Desculpe, este usuário foi bloqueado.".
- Acesso a página interna sem estar logado: "Ops! Você precisa estar logado para acessar esta página.".

Mensagens de erro do Checkout Etapa 1 da LojaQA (todas começam com "Erro: "), validadas nesta ordem — nome, sobrenome, CEP:
- Nome em branco: "Erro: O nome é obrigatório".
- Sobrenome em branco: "Erro: O sobrenome é obrigatório".
- CEP em branco: "Erro: O CEP é obrigatório".

Mensagens de `alert` do usuario_erro — disparadas ao trocar a ordenação em `.product_sort_container` e ao clicar no botão "Finalizar Pedido" — capturáveis com `cy.on("window:alert", ...)`:
- Ordenação quebrada: "Ops! A ordenação está quebrada para este usuário. Defeito proposital para testes.".
- Falha ao finalizar: "Ops! Não foi possível finalizar o pedido. Defeito proposital para testes.".

---

## Classes CSS de estado (dinâmicas) da LojaQA

Estas classes e atributos mudam durante a execução e são úteis para asserções de estado e visibilidade — e, como este documento não usa id, também servem para compor seletores mais precisos:
- Classe `.open`: aplicada em `nav.bm-menu` e em `div.bm-overlay` quando o menu lateral está aberto. Seletores: `nav.bm-menu.open`, `.bm-overlay.open`. Prefira asserir esta classe a asserir visibilidade, porque o menu fechado apenas sai da tela.
- Classe `.visible`: aplicada em `.error-message-container` quando a mensagem de erro está sendo exibida. Seletor: `.error-message-container.visible`, e o texto do erro visível é `.error-message-container.visible > span`.
- Classe `.input_error`: aplicada nos campos `.form_input` quando há erro de validação (borda vermelha). Seletores: `.form_input.input_error`, `input.input_error`; para contar quantos campos falharam, `cy.get(".input_error").should("have.length", 3)` no checkout.
- Atributo `hidden`: aplicado em `.cart_empty`, na mensagem de item não encontrado (`main > p`), em `.nf_documento`, na mensagem de pedido não encontrado e nos wrappers do detalhe (`.inventory_details_img` e `.inventory_details_desc_container`). Seletores: `p[hidden]` e o inverso `.cart_empty:not([hidden])`, `article:not([hidden])`.
- Classe `.btn_inventory` (fora do carrinho) que alterna para `.btn_secondary` (dentro do carrinho), nos botões Adicionar/Remover. Seletores: `.inventory_item button.btn_inventory` e `.inventory_item button.btn_secondary`. Como o texto muda junto, `cy.contains("button", "Remover")` é equivalente.
- Atributo `disabled`: aplicado no botão de entrar durante o atraso do `usuario_lento`. Seletores: `input[type="submit"]:disabled`, `input[type="submit"][disabled]`, `.btn_action:disabled`.
- Classe `.bugs-visuais`: aplicada no `body` quando o usuário logado é `usuario_visual`, ativando os defeitos visuais propositais. Seletor: `body.bugs-visuais`, e para escopar um elemento afetado, `body.bugs-visuais .inventory_item_price`.

## Classes CSS de botões (estáticas) da LojaQA

- `.btn`: classe base de todos os botões e de todos os links com aparência de botão (formato pílula/arredondado). Sozinha, casa muitos elementos: use sempre combinada, como `.btn.btn_action`.
- `.btn_action`: botão de ação principal, azul preenchido (Entrar, Finalizar Compra, Continuar, Finalizar Pedido, Gerar Nota Fiscal, Baixar PDF). Como cada tela tem apenas um, `.btn_action` costuma ser único por página.
- `.btn_secondary`: botão secundário com borda vermelha (Cancelar, Continuar Comprando, Remover, Voltar à Loja, Voltar). Cuidado no carrinho: além do "Continuar Comprando", cada item tem um botão Remover com esta classe — escope com `.cart_footer .btn_secondary`.
- `.btn_inventory`: botão de largura total, presente apenas nos botões "Adicionar ao carrinho" (some quando o produto entra no carrinho).
- `.btn_small`: botão com padding reduzido, usado nos botões de carrinho dos cards, no botão do detalhe e no link "← Voltar aos produtos".
- `.btn_back`: botão de voltar na página de detalhe do produto — é a classe mais específica daquele link, e o seletor `.btn_back` já o identifica sozinho.
- `.btn_complete`: botão de largura limitada, usado nos dois links da página de pedido concluído; combine com a outra classe para distinguir: `.btn_action.btn_complete` (Gerar Nota Fiscal) e `.btn_secondary.btn_complete` (Voltar à Loja).

---

## Textos visíveis da LojaQA (para seletores por texto)

Textos exatos exibidos na LojaQA, úteis para localizar elementos com `cy.contains`. Atenção ao caso especial: "Entrar" e "Continuar" **não** são texto de nó — vivem no atributo `value` de um `<input type="submit">` e só são alcançáveis por `input[value="Entrar"]` e `input[value="Continuar"]`:
- Títulos de página (no elemento `.title`): "Produtos", "Seu Carrinho", "Pagamento: Seus Dados", "Pagamento: Resumo", "Pedido Concluído!", "Sobre a LojaQA".
- Banner de boas-vindas (em `.hero_banner h1`): "Bem-vindo à LojaQA!".
- Botões de carrinho: "Adicionar ao carrinho" (fora do carrinho) e "Remover" (no carrinho) — ambos texto de nó de um `<button>`, logo alcançáveis por `cy.contains("button", "Remover")`.
- Ações que aceitam busca por texto, com a distinção que importa na hora de escolher a tag no `cy.contains`: são links `<a>` — "Continuar Comprando", "Finalizar Compra", "Cancelar", "Voltar à Loja", "← Voltar aos produtos", "Gerar Nota Fiscal (PDF)" e "Voltar" —, enquanto "Finalizar Pedido" e "Baixar PDF" são `<button>` de verdade, assim como os botões de carrinho dos cards.
- Itens do menu lateral (todos `<a>`): "Todos os Produtos", "Sobre", "Sair", "Resetar Aplicação".
- Rótulos do resumo do pedido e da nota: "Forma de Pagamento:", "CartãoQA #31337", "Entrega:", "Entrega Expressa Grátis!", "Resumo de Valores", "Subtotal:", "Impostos (8%):", "Total:", "QTD", "Descrição", "Item", "Qtd", "Valor", "Destinatário".
- Conclusão e nota fiscal: "Obrigado pelo seu pedido!", "NOTA FISCAL", "SEM VALOR FISCAL", "Documento fictício para prática de testes".
- Estados vazios e mensagens: "Seu carrinho está vazio.", "ITEM NÃO ENCONTRADO — Este produto não existe.", "Nenhum pedido encontrado. Finalize uma compra para gerar a nota fiscal.".

---

## Localização de cada produto da LojaQA, sem id e sem data-test

A LojaQA tem 21 produtos e, sem `id` e sem `data-test`, nenhum deles tem seletor próprio: a âncora é sempre o conteúdo do card. A mais estável é o **`href` do link de detalhe** (`inventory-item.html?id=N`), que não muda com a ordenação, com o estado do carrinho nem com o usuário logado; em seguida vêm o **`alt` da imagem** e o **texto do nome**. A posição na vitrine (`:nth-child`) é informada abaixo para a ordenação padrão `az`, mas só vale enquanto essa ordenação estiver ativa. Em todos os itens abaixo, o botão de carrinho do produto é o único `<button>` dentro do card, e o seu texto alterna entre "Adicionar ao carrinho" e "Remover".

- **Mochila do Testador** — preço R$ 149,90, detalhe `inventory-item.html?id=4`, 12º card na ordenação padrão. Card: `.inventory_item:has(a[href="inventory-item.html?id=4"])` ou `.inventory_item:has(img[alt="Mochila do Testador"])`. Botão de carrinho: `.inventory_item:has(a[href="inventory-item.html?id=4"]) button`. Por texto: `cy.contains(".inventory_item", "Mochila do Testador").find("button")`.
- **Lanterna de Bike LED** — preço R$ 49,90, detalhe `inventory-item.html?id=0`, 10º card na ordenação padrão. Card: `.inventory_item:has(a[href="inventory-item.html?id=0"])` ou `.inventory_item:has(img[alt="Lanterna de Bike LED"])`. Botão de carrinho: `.inventory_item:has(a[href="inventory-item.html?id=0"]) button`. Por texto: `cy.contains(".inventory_item", "Lanterna de Bike LED").find("button")`.
- **Camiseta Caça-Bugs** — preço R$ 79,90, detalhe `inventory-item.html?id=1`, 4º card na ordenação padrão. Card: `.inventory_item:has(a[href="inventory-item.html?id=1"])` ou `.inventory_item:has(img[alt="Camiseta Caça-Bugs"])`. Botão de carrinho: `.inventory_item:has(a[href="inventory-item.html?id=1"]) button`. Por texto: `cy.contains(".inventory_item", "Camiseta Caça-Bugs").find("button")`.
- **Jaqueta Fleece QA** — preço R$ 249,90, detalhe `inventory-item.html?id=5`, 9º card na ordenação padrão. Card: `.inventory_item:has(a[href="inventory-item.html?id=5"])` ou `.inventory_item:has(img[alt="Jaqueta Fleece QA"])`. Botão de carrinho: `.inventory_item:has(a[href="inventory-item.html?id=5"]) button`. Por texto: `cy.contains(".inventory_item", "Jaqueta Fleece QA").find("button")`.
- **Body do Testadorzinho** — preço R$ 39,90, detalhe `inventory-item.html?id=2`, 1º card na ordenação padrão. Card: `.inventory_item:has(a[href="inventory-item.html?id=2"])` ou `.inventory_item:has(img[alt="Body do Testadorzinho"])`. Botão de carrinho: `.inventory_item:has(a[href="inventory-item.html?id=2"]) button`. Por texto: `cy.contains(".inventory_item", "Body do Testadorzinho").find("button")`.
- **Camiseta Teste.Tudo() Salmão** — preço R$ 79,90, detalhe `inventory-item.html?id=3`, 5º card na ordenação padrão. Card: `.inventory_item:has(a[href="inventory-item.html?id=3"])` ou `.inventory_item:has(img[alt="Camiseta Teste.Tudo() Salmão"])`. Botão de carrinho: `.inventory_item:has(a[href="inventory-item.html?id=3"]) button`. Por texto: `cy.contains(".inventory_item", "Camiseta Teste.Tudo() Salmão").find("button")`.
- **Caneca do Depurador** — preço R$ 34,90, detalhe `inventory-item.html?id=6`, 6º card na ordenação padrão. Card: `.inventory_item:has(a[href="inventory-item.html?id=6"])` ou `.inventory_item:has(img[alt="Caneca do Depurador"])`. Botão de carrinho: `.inventory_item:has(a[href="inventory-item.html?id=6"]) button`. Por texto: `cy.contains(".inventory_item", "Caneca do Depurador").find("button")`.
- **Teclado Mecânico TesteMaster** — preço R$ 349,90, detalhe `inventory-item.html?id=7`, 20º card na ordenação padrão. Card: `.inventory_item:has(a[href="inventory-item.html?id=7"])` ou `.inventory_item:has(img[alt="Teclado Mecânico TesteMaster"])`. Botão de carrinho: `.inventory_item:has(a[href="inventory-item.html?id=7"]) button`. Por texto: `cy.contains(".inventory_item", "Teclado Mecânico TesteMaster").find("button")`.
- **Mouse Sem Fio ClickCerto** — preço R$ 89,90, detalhe `inventory-item.html?id=8`, 14º card na ordenação padrão. Card: `.inventory_item:has(a[href="inventory-item.html?id=8"])` ou `.inventory_item:has(img[alt="Mouse Sem Fio ClickCerto"])`. Botão de carrinho: `.inventory_item:has(a[href="inventory-item.html?id=8"]) button`. Por texto: `cy.contains(".inventory_item", "Mouse Sem Fio ClickCerto").find("button")`.
- **Fone Anti-Ruído FocoTotal** — preço R$ 199,90, detalhe `inventory-item.html?id=9`, 7º card na ordenação padrão. Card: `.inventory_item:has(a[href="inventory-item.html?id=9"])` ou `.inventory_item:has(img[alt="Fone Anti-Ruído FocoTotal"])`. Botão de carrinho: `.inventory_item:has(a[href="inventory-item.html?id=9"]) button`. Por texto: `cy.contains(".inventory_item", "Fone Anti-Ruído FocoTotal").find("button")`.
- **Boné Automatize Tudo** — preço R$ 59,90, detalhe `inventory-item.html?id=10`, 2º card na ordenação padrão. Card: `.inventory_item:has(a[href="inventory-item.html?id=10"])` ou `.inventory_item:has(img[alt="Boné Automatize Tudo"])`. Botão de carrinho: `.inventory_item:has(a[href="inventory-item.html?id=10"]) button`. Por texto: `cy.contains(".inventory_item", "Boné Automatize Tudo").find("button")`.
- **Moletom Deploy na Sexta** — preço R$ 189,90, detalhe `inventory-item.html?id=11`, 13º card na ordenação padrão. Card: `.inventory_item:has(a[href="inventory-item.html?id=11"])` ou `.inventory_item:has(img[alt="Moletom Deploy na Sexta"])`. Botão de carrinho: `.inventory_item:has(a[href="inventory-item.html?id=11"]) button`. Por texto: `cy.contains(".inventory_item", "Moletom Deploy na Sexta").find("button")`.
- **Garrafa Térmica CaféContínuo** — preço R$ 69,90, detalhe `inventory-item.html?id=12`, 8º card na ordenação padrão. Card: `.inventory_item:has(a[href="inventory-item.html?id=12"])` ou `.inventory_item:has(img[alt="Garrafa Térmica CaféContínuo"])`. Botão de carrinho: `.inventory_item:has(a[href="inventory-item.html?id=12"]) button`. Por texto: `cy.contains(".inventory_item", "Garrafa Térmica CaféContínuo").find("button")`.
- **Pacote de Adesivos de Bugs** — preço R$ 19,90 (o mais barato), detalhe `inventory-item.html?id=13`, 16º card na ordenação padrão. Card: `.inventory_item:has(a[href="inventory-item.html?id=13"])` ou `.inventory_item:has(img[alt="Pacote de Adesivos de Bugs"])`. Botão de carrinho: `.inventory_item:has(a[href="inventory-item.html?id=13"]) button`. Por texto: `cy.contains(".inventory_item", "Pacote de Adesivos de Bugs").find("button")`.
- **Caderno de Casos de Teste** — preço R$ 29,90, detalhe `inventory-item.html?id=14`, 3º card na ordenação padrão. Card: `.inventory_item:has(a[href="inventory-item.html?id=14"])` ou `.inventory_item:has(img[alt="Caderno de Casos de Teste"])`. Botão de carrinho: `.inventory_item:has(a[href="inventory-item.html?id=14"]) button`. Por texto: `cy.contains(".inventory_item", "Caderno de Casos de Teste").find("button")`.
- **Luminária PixelPerfect** — preço R$ 119,90, detalhe `inventory-item.html?id=15`, 11º card na ordenação padrão. Card: `.inventory_item:has(a[href="inventory-item.html?id=15"])` ou `.inventory_item:has(img[alt="Luminária PixelPerfect"])`. Botão de carrinho: `.inventory_item:has(a[href="inventory-item.html?id=15"]) button`. Por texto: `cy.contains(".inventory_item", "Luminária PixelPerfect").find("button")`.
- **Mousepad Gigante DevOps** — preço R$ 49,90, detalhe `inventory-item.html?id=16`, 15º card na ordenação padrão. Card: `.inventory_item:has(a[href="inventory-item.html?id=16"])` ou `.inventory_item:has(img[alt="Mousepad Gigante DevOps"])`. Botão de carrinho: `.inventory_item:has(a[href="inventory-item.html?id=16"]) button`. Por texto: `cy.contains(".inventory_item", "Mousepad Gigante DevOps").find("button")`.
- **Webcam Full HD VisãoQA** — preço R$ 159,90, detalhe `inventory-item.html?id=17`, 21º e último card na ordenação padrão. Card: `.inventory_item:has(a[href="inventory-item.html?id=17"])` ou `.inventory_item:has(img[alt="Webcam Full HD VisãoQA"])`. Botão de carrinho: `.inventory_item:has(a[href="inventory-item.html?id=17"]) button`. Por texto: `cy.contains(".inventory_item", "Webcam Full HD VisãoQA").find("button")`.
- **Suporte de Notebook ErgoTeste** — preço R$ 99,90, detalhe `inventory-item.html?id=18`, 19º card na ordenação padrão. Card: `.inventory_item:has(a[href="inventory-item.html?id=18"])` ou `.inventory_item:has(img[alt="Suporte de Notebook ErgoTeste"])`. Botão de carrinho: `.inventory_item:has(a[href="inventory-item.html?id=18"]) button`. Por texto: `cy.contains(".inventory_item", "Suporte de Notebook ErgoTeste").find("button")`.
- **Pelúcia do Bug** — preço R$ 44,90, detalhe `inventory-item.html?id=19`, 17º card na ordenação padrão. Card: `.inventory_item:has(a[href="inventory-item.html?id=19"])` ou `.inventory_item:has(img[alt="Pelúcia do Bug"])`. Botão de carrinho: `.inventory_item:has(a[href="inventory-item.html?id=19"]) button`. Por texto: `cy.contains(".inventory_item", "Pelúcia do Bug").find("button")`.
- **Quebra-Cabeça 404 Peças** — preço R$ 54,90, detalhe `inventory-item.html?id=20`, 18º card na ordenação padrão. Card: `.inventory_item:has(a[href="inventory-item.html?id=20"])` ou `.inventory_item:has(img[alt="Quebra-Cabeça 404 Peças"])`. Botão de carrinho: `.inventory_item:has(a[href="inventory-item.html?id=20"]) button`. Por texto: `cy.contains(".inventory_item", "Quebra-Cabeça 404 Peças").find("button")`.

Exemplo em Cypress para adicionar a Mochila do Testador ao carrinho e depois removê-la, sem id e sem data-test: `cy.get('.inventory_item:has(a[href="inventory-item.html?id=4"]) button').click()` e em seguida o mesmo seletor, cujo texto agora é "Remover"; a variante por texto é `cy.contains(".inventory_item", "Mochila do Testador").find("button").click()`.

---

## Templates internos da LojaQA (não interagíveis)

A LojaQA usa elementos `<template>` que o JavaScript clona para gerar conteúdo dinâmico. Eles NÃO são alvos de automação: o conteúdo de um `<template>` vive em um `DocumentFragment`, fora da árvore do documento, então **nenhum seletor alcança o que está dentro dele** — `template .inventory_item` não casa com nada. Estão listados só para referência e porque contam como irmãos em seletores posicionais:
- `body > template` em `index.html`: gera os cards da lista de produtos; é o quarto filho do `body`, o que faz do rodapé o quinto (`body > :nth-child(5)`).
- `body > template` em `cart.html`: gera as linhas do carrinho; é o terceiro filho do `body`, antes do rodapé.
- `body > template` em `checkout-step-two.html`: gera as linhas do resumo do pedido; é o terceiro filho do `body`.
- `body > template` em `nota-fiscal.html`: gera as linhas da tabela da nota fiscal; é o segundo filho do `body`, logo após o `main`.

---

## Armazenamento (setup e teardown de testes) da LojaQA

A LojaQA guarda estado no navegador. Para preparar ou limpar o estado de um teste sem passar pela interface — e sem depender de seletor nenhum —, manipule estas chaves:
- Chave `session-username` no `sessionStorage`: guarda o username logado, por exemplo "usuario_padrao". Definir esta chave equivale a estar logado.
- Chave `cart-contents` no `localStorage`: guarda um array JSON com os ids dos produtos no carrinho, por exemplo `[4,0]`.
- Chave `checkout-info` no `sessionStorage`: guarda um JSON `{first, last, postal}` preenchido na etapa 1 do checkout; é removido ao finalizar o pedido.
- Chave `ultimo-pedido` no `sessionStorage`: guarda um JSON do pedido finalizado com `{numero, data, hora, cliente, itens, subtotal, imposto, total}`, usado pela página de conclusão e pela nota fiscal.

Exemplo para iniciar um teste já logado e com um item no carrinho: definir `sessionStorage["session-username"] = "usuario_padrao"` e `localStorage["cart-contents"] = "[4]"`, depois navegar para `index.html`. Lembre que sair pelo menu (`cy.contains(".bm-menu a", "Sair")`) apaga as duas chaves, porque o logout também esvazia o carrinho.

---

## Perguntas frequentes sobre a automação da LojaQA (FAQ)

Perguntas comuns e respostas diretas para localizar seletores e comportamentos na LojaQA sem usar id e sem usar data-test:

- **Qual é a página inicial (home) da LojaQA?** É `index.html`, a página de Produtos/catálogo, exibida logo após o login. Confirme com `cy.get(".title").should("have.text", "Produtos")`.
- **Como fazer login na LojaQA?** Preencher `input[placeholder="Usuário"]` com um usuário válido (ex.: `usuario_padrao`), preencher `input[placeholder="Senha"]` com `senha_teste_123` e clicar em `input[value="Entrar"]`.
- **Por que `cy.contains("Entrar")` não clica no botão de login?** Porque o botão é um `<input type="submit">` e o rótulo vive no atributo `value`, não em nó de texto. Use `input[value="Entrar"]` ou `input[type="submit"]`. O mesmo vale para o "Continuar" do checkout.
- **Qual é a senha dos usuários da LojaQA?** `senha_teste_123`, para todos os 6 usuários. Ela também está impressa na tela, em `.login_password`.
- **Quais são os usuários da LojaQA?** `usuario_padrao`, `usuario_bloqueado`, `usuario_problema`, `usuario_lento`, `usuario_erro` e `usuario_visual`, listados na tela de login em `.login_credentials`.
- **Qual usuário usar para o teste de compra bem-sucedida (caminho feliz)?** `usuario_padrao`.
- **Como localizar um produto específico na vitrine?** Pelo `href` do link de detalhe, que é a âncora mais estável: `.inventory_item:has(a[href="inventory-item.html?id=6"])`. Alternativas: pelo `alt` da imagem, `.inventory_item:has(img[alt="Caneca do Depurador"])`, ou pelo texto, `cy.contains(".inventory_item", "Caneca do Depurador")`.
- **Qual o seletor do botão de adicionar um produto ao carrinho?** É o único `<button>` do card, então basta escopar o card: `.inventory_item:has(a[href="inventory-item.html?id=6"]) button`. Por texto: `cy.contains(".inventory_item", "Caneca do Depurador").find("button")`.
- **Qual o seletor do botão de remover um produto, e como saber se ele já está no carrinho?** É o mesmo botão do adicionar: o texto muda de "Adicionar ao carrinho" para "Remover" e a classe muda de `btn_inventory` para `btn_secondary`, e é por isso que o seletor por `href` funciona nos dois estados enquanto o seletor por texto ou por classe não. Para asserir o estado: `cy.get('.inventory_item:has(a[href="inventory-item.html?id=6"]) button').should("have.text", "Remover")` ou `.should("have.class", "btn_secondary")`.
- **Como localizar o preço de um produto específico?** Escopando o card pelo `href` e descendo até o preço: `.inventory_item:has(a[href="inventory-item.html?id=4"]) .inventory_item_price`.
- **Como ir para o carrinho?** Clicar no ícone do carrinho no cabeçalho: `header a[href="cart.html"]` ou `.shopping_cart_link`. O escopo `header` importa porque o botão Cancelar da etapa 1 do checkout também aponta para `cart.html`.
- **Como verificar quantos itens há no carrinho?** Ler `.shopping_cart_badge`; ele fica oculto (`display:none`) quando o carrinho está vazio, então asserte com `should("be.visible").and("have.text", "2")` ou `should("not.be.visible")`.
- **Como remover um item dentro do carrinho?** Escopando a linha e clicando no seu único botão: `cy.get('.cart_item:has(a[href="inventory-item.html?id=4"]) button').click()`, ou por texto, `cy.contains(".cart_item", "Mochila do Testador").find("button").click()`.
- **Como ordenar os produtos?** Usar o `<select>`: `cy.get(".product_sort_container").select("lohi")`. Os valores são `az` e `za` (por nome, crescente e decrescente) e `lohi` e `hilo` (por preço, crescente e decrescente); também dá para selecionar pelo texto da opção, como "Preço (menor ao maior)".
- **Posso localizar o produto pela posição, com `:nth-child`?** Pode, mas é o seletor mais frágil da aplicação: `.inventory_list > div:nth-child(12)` é a Mochila do Testador **apenas** na ordenação padrão `az`. Trocar a ordenação reordena tudo. Prefira o `href`.
- **Como localizar o card de um produto a partir do seu nome?** Com `cy.contains(".inventory_item", "Mochila do Testador")`, que sobe do texto até o card, ou com `:has` sobre o `alt` da imagem: `.inventory_item:has(img[alt="Mochila do Testador"])`.
- **Como finalizar a compra na LojaQA?** No carrinho, clicar em `cy.contains("a", "Finalizar Compra")`; preencher `input[placeholder="Nome"]`, `input[placeholder="Sobrenome"]` e `input[placeholder="CEP"]` e clicar em `input[value="Continuar"]`; no resumo, clicar em `cy.contains("button", "Finalizar Pedido")`.
- **Por que `cy.contains("button", "Cancelar")` e `cy.contains("button", "Finalizar Compra")` não encontram nada?** Porque são `<a>` com aparência de botão, não `<button>`. Use `cy.contains("a", "Cancelar")` e `cy.contains("a", "Finalizar Compra")`. Só "Finalizar Pedido" e "Baixar PDF" são `<button>` de verdade, além dos botões de carrinho.
- **Onde aparece a mensagem de erro do login e do checkout?** No `<span>` dentro de `.error-message-container`, que ganha a classe `visible`. Seletor completo: `.error-message-container.visible > span`.
- **Como localizar o título da página atual?** Pelo `.title` da barra secundária do cabeçalho — exceto em `inventory-item.html`, a única página com cabeçalho que não tem título; lá o lugar é ocupado pelo link `.btn_back`.
- **Como abrir e fechar o menu lateral?** Abrir com `button[aria-label="Abrir Menu"]` (ou `.bm-burger-button`) e fechar com `button[aria-label="Fechar Menu"]` (ou `.bm-cross-button`, ou clicando em `.bm-overlay`). Asserte o estado pela classe: `nav.bm-menu.open`.
- **Como sair (deslogar) da LojaQA?** Abrir o menu e clicar em `cy.contains(".bm-menu a", "Sair")`. Atenção: sair também esvazia o carrinho, então um teste que desloga e reloga não encontra os itens de antes.
- **Como localizar a linha de um item na nota fiscal?** Pelo texto do produto na segunda célula: `cy.contains(".nf_tabela tr", "Mochila do Testador")`. As células são `td:nth-child(1)` a `td:nth-child(4)`: número, descrição, quantidade e valor.
- **Como gerar, baixar e validar a nota fiscal em PDF?** Após finalizar o pedido, clicar em `a[href="nota-fiscal.html"]` e depois em `cy.contains("button", "Baixar PDF")`. O arquivo `nota-fiscal-<numero-do-pedido>.pdf` é baixado direto e pode ser lido com `cy.readFile("cypress/downloads/nota-fiscal-45231987.pdf")`.
- **Como preparar o estado do teste sem passar pela interface, e qual a taxa de imposto?** Definir `session-username` no `sessionStorage` (ex.: `"usuario_padrao"`) e `cart-contents` no `localStorage` (ex.: `"[4]"`), depois navegar para `index.html`. A taxa de imposto do checkout é de 8% sobre o subtotal.
