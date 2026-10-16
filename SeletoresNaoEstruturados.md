---
titulo: Mapa de Seletores Não Estruturados da LojaQA
projeto: LojaQA — loja virtual fictícia para prática de automação de testes
idioma: pt-BR
finalidade: Base de conhecimento (RAG) com todos os elementos, textos, comportamentos e dados de teste da aplicação LojaQA, localizados apenas por classe CSS, hierarquia e posição
frameworks_alvo: Cypress
convencao_seletores: somente classe CSS (usar como ".classe"), hierarquia ("pai > filho", "a + b", ":has") e posição (":nth-child", ":nth-of-type", ":first-child", ":last-child"); texto visível aparece apenas como valor esperado de asserção
versao_produtos: 21 produtos
---

# Mapa de Seletores Não Estruturados da LojaQA

Este documento é a base de conhecimento dos **seletores não estruturados** da aplicação web **LojaQA**, uma loja virtual fictícia usada para praticar automação de testes. Aqui, cada elemento é localizado apenas pela **classe CSS**, pela **hierarquia** e pela **posição** no documento. Cada seção é autocontida e descreve os elementos de uma página, com seus seletores prontos para uso, textos visíveis e comportamentos.

Como interpretar os seletores em qualquer seção deste documento:
- Um seletor iniciado por `.` é um seletor de **classe CSS** (ex.: `.bm-burger-button`). Classes se combinam sem espaço (`.btn.btn_action`); com espaço viram descendência (`.cart_item .inventory_item_price`).
- Um seletor com `>`, `+`, `:has()`, `:nth-child()`, `:nth-of-type()`, `:first-child` ou `:last-child` é de **hierarquia e posição** (ex.: `.checkout_info > input:nth-of-type(2)`). `:nth-child` conta todos os irmãos e `:nth-of-type` conta só os da mesma tag; elementos invisíveis como `<template>` e `<script>` também contam como irmãos.
- **Texto visível** não é usado para localizar elementos: aparece apenas como valor esperado de asserção, por exemplo `cy.get(".title").should("have.text", "Produtos")`.
- **Produto específico:** nenhum produto tem seletor próprio; cada um é localizado pela posição do seu card na vitrine, `.inventory_item:nth-child(N)`, com N contado na ordenação padrão `az`. Exemplo: Mochila do Testador → `.inventory_item:nth-child(12)`. A lista completa está na seção "Seletores de cada produto da LojaQA".

---

## Fatos gerais e configuração da LojaQA

Fatos fundamentais para escrever testes na LojaQA:

- **Nome da aplicação:** LojaQA (logotipo exibido como "🧪 LojaQA").
- **Tipo:** loja virtual fictícia de comércio eletrônico, feita apenas com HTML, CSS e JavaScript puro, sem frameworks. Projeto educacional para um TCC.
- **Senha de login (única para todos os usuários):** `senha_teste_123`.
- **Usuários de login aceitos (6),** cada um com um comportamento próprio: `usuario_padrao` (fluxo normal — caminho feliz), `usuario_bloqueado` (login recusado), `usuario_problema` (imagens de produto quebradas), `usuario_lento` (login com ~5 s de atraso), `usuario_erro` (ordenação, itens de id ímpar e finalização falham), `usuario_visual` (defeitos visuais e preços errados na vitrine nos ids 0, 5, 10, 15 e 20). Detalhes na seção "Comportamentos especiais por usuário da LojaQA".
- **Taxa de imposto aplicada no checkout:** 8% sobre o subtotal.
- **Formato de preço:** reais no padrão brasileiro, exemplo `R$ 149,90` (com vírgula decimal).
- **Quantidade de produtos no catálogo:** 21.
- **Persistência:** a sessão do usuário fica em `sessionStorage` (chave `session-username`, valor = username logado, ex.: `"usuario_padrao"`) e o carrinho em `localStorage` (chave `cart-contents`, valor = array JSON com os ids dos produtos, ex.: `"[4,0]"`). Sair (logout) apaga a sessão e também esvazia o carrinho. Demais chaves na seção "Armazenamento (setup e teardown de testes) da LojaQA".
- **Política de seletores deste documento:** apenas classe CSS, hierarquia e posição. `id`, `data-test`, outros atributos HTML e texto visível não são usados para localizar elementos.

### Arquivos de página (URLs) da LojaQA

- `index.html` — **página inicial (home)** da LojaQA e raiz do site (o que é servido em `/html/`). É a página de Produtos (catálogo / vitrine / lista de produtos / inventário), exibida logo após o login bem-sucedido. É uma página protegida: sem sessão ativa, redireciona para `login.html?error=auth`.
- `login.html` — página de Login (tela de entrada da aplicação, exibida quando não há sessão ativa). Junto da nota fiscal, é uma das duas páginas sem cabeçalho global e sem menu lateral. Todas as outras páginas são protegidas como a home.
- `inventory-item.html?id=N` — página de Detalhe de um produto (N é o id do produto, de 0 a 20). Abre ao clicar no nome ou na imagem de um produto na vitrine, ou no nome de um item do carrinho.
- `cart.html` — página do Carrinho de compras.
- `checkout-step-one.html` — Checkout etapa 1, formulário de dados do comprador ("Pagamento: Seus Dados").
- `checkout-step-two.html` — Checkout etapa 2, resumo do pedido ("Pagamento: Resumo").
- `checkout-complete.html` — página de Pedido Concluído (confirmação da compra).
- `nota-fiscal.html` — página da Nota Fiscal fictícia, com botão para baixar o PDF. Não tem cabeçalho global, menu lateral nem rodapé.
- `sobre.html` — página Sobre (explica o propósito do projeto/TCC).

---

## Elementos globais da LojaQA (cabeçalho, menu lateral e rodapé)

Estes elementos aparecem em todas as páginas da LojaQA que têm cabeçalho (todas, exceto a página de Login e a página de Nota Fiscal) e são iguais em todas elas, com uma exceção: a barra abaixo do cabeçalho mostra o título da página na maioria das páginas, mostra também o seletor de ordenação em `index.html` e mostra o link "← Voltar aos produtos" no lugar do título em `inventory-item.html`.

### Cabeçalho da LojaQA

- **Botão de abrir o menu lateral (ícone hambúrguer ☰):** fica no canto esquerdo do cabeçalho; clicar abre o menu lateral. Seletores: `.bm-burger-button`, `.header_label > button`, `.header_label > :first-child`.
- **Logotipo da LojaQA no topo (link para a home):** exibe "🧪 LojaQA", ao lado do botão do menu; clicar volta para a página inicial (home) da loja, `index.html`. Seletores: `.app_logo`, `.header_label > a`, `.bm-burger-button + a`.
- **Link/ícone do carrinho de compras (🛒):** fica no canto direito do cabeçalho; clicar vai para o carrinho, `cart.html`. Seletores: `.shopping_cart_link`, `.shopping_cart_container > a`.
- **Badge de contagem do carrinho:** número sobre o ícone do carrinho, com a quantidade de itens. Com o carrinho vazio ele fica oculto (o texto interno continua "0"), então o carrinho vazio é verificado por visibilidade, e não por texto. Seletores: `.shopping_cart_badge`, `.shopping_cart_link > span`. Em Cypress: `cy.get(".shopping_cart_badge").should("have.text", "2")`; carrinho vazio: `cy.get(".shopping_cart_badge").should("not.be.visible")`.
- **Título da página atual (barra abaixo do cabeçalho):** presente em todas as páginas com cabeçalho, exceto `inventory-item.html`. Textos exatos: "Produtos", "Seu Carrinho", "Pagamento: Seus Dados", "Pagamento: Resumo", "Pedido Concluído!" ou "Sobre a LojaQA". Seletores: `.title`, `.header_secondary_container > span`, `header > div:nth-child(2) > span:first-child`.

### Menu lateral da LojaQA (barra de navegação lateral / hamburger menu)

O menu lateral abre ao clicar no botão do menu. Ele já está carregado na página desde o início, apenas posicionado fora da tela; ao abrir, o painel desliza para dentro da tela e um fundo escurecido cobre o restante da página. Contém:

- **Container do menu lateral:** o painel que contém o botão de fechar e os quatro itens do menu. Seletores: `.bm-menu`, `header > nav`.
- **Botão de fechar o menu (×):** fecha o menu lateral. Seletores: `.bm-cross-button`, `.bm-menu > button`, `.bm-menu > :first-child`.
- **Item de menu "Todos os Produtos":** leva de volta para a página inicial (home) da loja, `index.html`. Seletores: `.bm-menu > a:nth-of-type(1)`, `.bm-menu > button + a`.
- **Item de menu "Sobre":** leva para `sobre.html`. Seletor: `.bm-menu > a:nth-of-type(2)`.
- **Item de menu "Sair" (deslogar):** sair é a mesma coisa que deslogar: encerra a sessão, **esvazia o carrinho** e volta para `login.html`. Seletor: `.bm-menu > a:nth-of-type(3)`.
- **Item de menu "Resetar Aplicação":** limpa o carrinho sem deslogar e atualiza a página atual (badge e botões de carrinho voltam ao estado inicial); o menu continua aberto depois do clique. Seletores: `.bm-menu > a:nth-of-type(4)`, `.bm-menu > a:last-child`.
- **Overlay (fundo escurecido atrás do menu):** fica oculto com o menu fechado e aparece quando o menu abre; clicar nele fecha o menu. Por isso, a visibilidade do overlay indica se o menu está aberto. Seletores: `.bm-overlay`, `header > div:nth-child(4)`, `header > div:nth-of-type(3)` (os índices diferem porque `:nth-child` conta o `nav` e `:nth-of-type` não). Em Cypress: menu aberto, `cy.get(".bm-overlay").should("be.visible")`; menu fechado, `should("not.be.visible")`.

### Rodapé da LojaQA

- **Rodapé:** área no fim de cada página com cabeçalho, com os links de redes sociais e o texto de copyright. Seletores: `.footer`, `body > footer`.
- **Link do GitHub no rodapé:** texto "GitHub"; abre o perfil do autor no GitHub em nova aba. Seletores: `.social > li:nth-child(1) > a`, `.social li:first-child a`.
- **Link do LinkedIn no rodapé:** texto "LinkedIn"; abre o perfil do autor no LinkedIn em nova aba. Seletores: `.social > li:nth-child(2) > a`, `.social li:last-child a`.
- **Texto de copyright no rodapé:** texto "© 2026 LojaQA — Projeto educacional para prática de testes de automação.". Seletores: `.footer_copy`, `.social + div`.

---

## Página de Login da LojaQA (login.html)

A página de Login (`login.html`) é a tela de entrada da LojaQA: é por onde o usuário começa, mas **não** é a página inicial/home da loja — a home é `index.html`, exibida depois do login. Nela o usuário digita usuário e senha para entrar. Não possui o cabeçalho global, o menu lateral nem o rodapé. Para fazer login: preencher o campo de usuário, preencher o campo de senha e clicar no botão Entrar.

Elementos da página de Login da LojaQA:

- **Campo de usuário (username):** campo onde se digita o nome de usuário; recebe o foco ao abrir a página e fica com borda vermelha quando há erro de validação. Seletores: `.login-box > input:nth-of-type(1)`, `.login-box > .form_input:first-child`.
- **Campo de senha (password):** campo onde se digita a senha, com os caracteres mascarados; fica com borda vermelha quando há erro de validação. Seletores: `.login-box > input:nth-of-type(2)`, `.login-box > input:first-child + input`.
- **Botão Entrar (login/submit):** envia o formulário; o rótulo é "Entrar". Para o usuário `usuario_lento`, durante ~5 s o rótulo vira "Carregando..." e o botão fica desabilitado. Seletores: `.login-box > input:nth-of-type(3)`, `.login-box > input:nth-child(4)`, `.login-box .btn_action`. O rótulo é o valor do campo, então a asserção é com `have.value`: `cy.get(".login-box .btn_action").should("have.value", "Entrar")`.
- **Formulário de login:** agrupa os dois campos, a mensagem de erro e o botão Entrar; a validação é feita pela aplicação, não pelo navegador. Seletores: `.login-box`, `.login_wrapper > form`.
- **Container da mensagem de erro:** caixa vermelha que só aparece quando há erro; contém o texto do erro e o botão de fechar. Seletores: `.error-message-container`, `.login-box > div`, `.login-box > :nth-child(3)`. Erro exibido: `cy.get(".error-message-container").should("be.visible")`.
- **Texto da mensagem de erro:** texto do erro, preenchido pela aplicação. Textos exatos possíveis: "Ops! O campo usuário é obrigatório"; "Ops! O campo senha é obrigatório"; "Ops! Usuário e senha não conferem com nenhum usuário cadastrado"; "Ops! Desculpe, este usuário foi bloqueado." (usuario_bloqueado); "Ops! Você precisa estar logado para acessar esta página." (acesso a página protegida sem sessão). Seletores: `.error-message-container > span`, `.error-message-container > :first-child`.
- **Botão de fechar a mensagem de erro (×):** fecha a mensagem de erro e tira a borda vermelha dos campos. Seletores: `.error-button`, `.error-message-container > button`.
- **Bloco informativo com a lista de usuários aceitos:** título "Usuários aceitos:" seguido dos 6 usernames. Seletores: `.login_credentials`, `.login_credentials_wrap > div:first-child`.
- **Bloco informativo com a senha:** título "Senha para todos os usuários:" seguido de `senha_teste_123`. Seletores: `.login_password`, `.login_credentials_wrap > div:last-child`, `.login_credentials + div`.
- **Logotipo da tela de login:** exibe "🧪 LojaQA" no topo da página; diferente do logotipo do cabeçalho, aqui ele **não é um link**. Seletores: `.login_logo`, `.login_container > div:first-child`.
- **Tagline (subtítulo):** texto "Sua loja para praticar automação de testes", logo abaixo do logotipo. Seletores: `.login_tagline`, `.login_container > p`, `.login_logo + p`.

Exemplo de login bem-sucedido: `cy.get(".login-box > input:nth-of-type(1)").type("usuario_padrao")`, `cy.get(".login-box > input:nth-of-type(2)").type("senha_teste_123")` e `cy.get(".login-box .btn_action").click()`. Após o sucesso, o usuário vai para a página inicial (home) da loja, `index.html`: `cy.get(".title").should("have.text", "Produtos")`.

---

## Página Inicial / Home / Página de Produtos / Catálogo da LojaQA (index.html)

A página `index.html` é a **página inicial (home) da LojaQA**, ou seja, a página principal exibida logo após o usuário realizar o login com sucesso. Também é chamada de página de Produtos, catálogo, vitrine ou inventário. Lista os 21 produtos da LojaQA em cards gerados pela aplicação, tem um banner de boas-vindas no topo e um seletor de ordenação na barra abaixo do cabeçalho. Quando um teste precisa "ir para a home" ou "voltar à página inicial" da loja, o destino é `index.html` (a tela de login `login.html` só aparece antes do login ou após o logout).

Elementos gerais da página de Produtos da LojaQA:

- **Banner de boas-vindas:** área no topo da página com o título "Bem-vindo à LojaQA!". Seletores: `.hero_banner`, `body > section`, `header + section`.
- **Contador de produtos dentro do banner:** número total de produtos (21), preenchido pela aplicação. Seletores: `.hero_banner strong`, `.hero_banner > p > strong`.
- **Container da página:** área principal da página, que contém a lista de produtos. Seletores: `.inventory_container`, `body > main`.
- **Lista/grade de produtos:** grade com os 21 cards. Seletores: `.inventory_list`, `.inventory_container > div`. Para contar os produtos: `cy.get(".inventory_list > .inventory_item").should("have.length", 21)`.
- **Seletor de ordenação (dropdown de ordenar produtos):** lista suspensa com 4 opções, ao lado do título. Seletores: `.product_sort_container`, `.header_secondary_container > select`, `.title + select`.

Opções do seletor de ordenação da LojaQA (valor → texto exibido). Para escolher uma opção: `cy.get(".product_sort_container").select("lohi")`; para conferir a opção ativa: `cy.get(".product_sort_container").should("have.value", "lohi")`:
- valor `az` → "Nome (A a Z)": **ordem alfabética crescente**, pelo nome do produto. É a ordenação ativa quando a página abre. Primeiro item: "Body do Testadorzinho"; último: "Webcam Full HD VisãoQA".
- valor `za` → "Nome (Z a A)": **ordem alfabética decrescente**, pelo nome do produto. É o inverso de `az`.
- valor `lohi` → "Preço (menor ao maior)": **ordem por preço crescente**, do mais barato ao mais caro. Primeiro item: "Pacote de Adesivos de Bugs" (R$ 19,90); último: "Teclado Mecânico TesteMaster" (R$ 349,90).
- valor `hilo` → "Preço (maior ao menor)": **ordem por preço decrescente**, do mais caro ao mais barato. É o inverso de `lohi`.

Ou seja, `az`/`za` ordenam por **nome** (ordem alfabética) e `lohi`/`hilo` ordenam por **preço** — não confundir "crescente/decrescente" de nome com o de preço. Ao trocar a ordenação, os 21 cards são redesenhados na nova ordem.

### Card de produto na página de Produtos da LojaQA

Cada produto é exibido em um card (repetido para os 21 produtos), com imagem, nome, descrição, preço e botão de carrinho. Os cards não têm classe própria por produto: um card específico é localizado pela posição na grade, `.inventory_item:nth-child(N)`, com N contado na ordenação padrão `az`. Dentro de cada card:

- **Card do produto (container):** bloco de cada produto na grade. Seletores: `.inventory_item`, `.inventory_list > div`; o card de um produto específico, pela posição: `.inventory_item:nth-child(12)` (Mochila do Testador, na ordenação padrão).
- **Nome do produto (link):** nome do produto; clicar abre a página de detalhe. Seletores: `.inventory_item_name`, `.inventory_item > a:nth-of-type(2)`, `.inventory_item_img + a`.
- **Descrição do produto:** texto descritivo do produto. Seletores: `.inventory_item_desc`, `.inventory_item_name + div`.
- **Preço do produto:** no formato `R$ X,XX`. Seletores: `.inventory_item_price`, `.pricebar > div`; o preço de um produto específico: `.inventory_item:nth-child(12) .inventory_item_price`.
- **Imagem do produto:** foto do produto; clicar nela também abre a página de detalhe. Seletores: `.inventory_item_img > img`, `.inventory_item > a:first-child > img`; a imagem de um produto específico: `.inventory_item:nth-child(12) img`.
- **Botão Adicionar ao carrinho / Remover:** o mesmo botão alterna conforme o estado: fora do carrinho, rótulo "Adicionar ao carrinho"; no carrinho, rótulo "Remover". Seletores: `.pricebar > button`, `.inventory_item button`; o botão de um produto específico: `.inventory_item:nth-child(12) button` (Mochila do Testador, na ordenação padrão). A classe indica o estado: `.btn_inventory` fora do carrinho e `.btn_secondary` dentro, por exemplo `.inventory_item:nth-child(12) button.btn_secondary`.

Observação de comportamento: com o usuário `usuario_problema`, todas as imagens dos cards são trocadas por uma imagem quebrada. Com `usuario_visual`, os preços dos ids 0, 5, 10, 15 e 20 aparecem R$ 10,00 maiores só na vitrine. Asserção da imagem quebrada: `cy.get(".inventory_item img").should("have.attr", "src", "../img/broken.svg")`.

---

## Página de Detalhe do Produto da LojaQA (inventory-item.html)

A página de Detalhe (`inventory-item.html?id=N`) mostra um único produto em tamanho grande, onde N é o id do produto. Chega-se a ela clicando no nome ou na imagem de um produto no catálogo, ou no nome de um item do carrinho. É a única página com cabeçalho que não exibe o título: no lugar dele aparece o link "← Voltar aos produtos". A página tem a mensagem de item não encontrado, o bloco da imagem e o bloco das informações (nome, descrição, preço e botão de carrinho). Como só há um produto na tela, os seletores por classe são únicos nesta página.

Elementos da página de Detalhe do Produto da LojaQA:

- **Container da página de detalhe:** área principal da página. Seletores: `.inventory_details`, `body > main`.
- **Botão/link "Voltar aos produtos":** link com o texto "← Voltar aos produtos", na barra abaixo do cabeçalho; leva para `index.html`. Seletores: `.btn_back`, `.header_secondary_container > a`.
- **Bloco da imagem (wrapper):** envolve a imagem do produto; fica oculto quando o produto não existe. Seletores: `.inventory_details_img`, `.inventory_details > div:first-of-type`.
- **Imagem do produto:** foto grande do produto. Seletores: `.inventory_details_img > img`, `.inventory_details img`.
- **Bloco das informações (wrapper):** envolve o nome, a descrição, o preço e o botão de carrinho; fica oculto quando o produto não existe. Seletores: `.inventory_details_desc_container`, `.inventory_details > div:last-child`, `.inventory_details_img + div`.
- **Nome do produto:** nome do produto em texto — aqui não é link, ao contrário do card da vitrine. Seletores: `.inventory_details_name`, `.inventory_details_desc_container > div:nth-child(1)`.
- **Descrição do produto:** texto descritivo do produto. Seletores: `.inventory_details_desc_container > div:nth-child(2)`, `.inventory_details_name + div`.
- **Preço do produto:** no formato `R$ X,XX`. Seletores: `.inventory_details_price`, `.inventory_details_desc_container > div:nth-child(3)`.
- **Botão Adicionar ao carrinho / Remover:** fora do carrinho, rótulo "Adicionar ao carrinho"; no carrinho, rótulo "Remover". Seletores: `.inventory_details_desc_container > button`, `.inventory_details_desc_container > :last-child`, `.inventory_details button`, iguais para todos os produtos. A classe indica o estado: `.inventory_details button.btn_inventory` fora do carrinho e `.inventory_details button.btn_secondary` dentro.
- **Mensagem "item não encontrado":** fica oculta quando o produto existe; aparece com o texto "ITEM NÃO ENCONTRADO — Este produto não existe." quando o id da URL é inválido ou ausente (ex.: `inventory-item.html?id=99` ou `inventory-item.html` sem `?id=`). Nesse caso, os blocos da imagem e das informações ficam ocultos. Seletores: `.inventory_details > p`, `.inventory_details > :first-child`. Em Cypress: `cy.get(".inventory_details > p").should("be.visible")`.

Observação de comportamento: com o usuário `usuario_problema`, a imagem do detalhe também é trocada pela imagem quebrada. Com o `usuario_visual`, o preço do detalhe é o correto: o acréscimo de R$ 10,00 nos ids 0, 5, 10, 15 e 20 aparece só na vitrine, então comparar o preço do card com o preço do detalhe revela a inconsistência. Asserção da imagem quebrada: `cy.get(".inventory_details_img > img").should("have.attr", "src", "../img/broken.svg")`.

---

## Página do Carrinho da LojaQA (cart.html)

A página do Carrinho (`cart.html`) lista os produtos adicionados ao carrinho e permite continuar comprando ou seguir para o checkout. O título da página é "Seu Carrinho". As linhas de produto são geradas pela aplicação. As linhas não têm classe própria por produto e seguem a ordem em que os produtos foram adicionados; uma linha específica é localizada pela posição, `.cart_item:nth-child(N)`.

Elementos da página do Carrinho da LojaQA:

- **Container da página do carrinho:** área principal da página. Seletores: `.cart_contents_container`, `body > main`.
- **Rótulo de coluna "QTD" (quantidade):** cabeçalho da coluna de quantidade, com o texto "QTD". Seletores: `.cart_quantity_label`, `.cart_contents_container > div:first-child > span:first-child`.
- **Rótulo de coluna "Descrição":** cabeçalho da coluna de descrição, com o texto "Descrição". Seletores: `.cart_desc_label`, `.cart_quantity_label + span`.
- **Mensagem de carrinho vazio:** fica oculta quando há itens; aparece com o texto "Seu carrinho está vazio." quando o carrinho está vazio. Seletores: `.cart_empty`, `.cart_contents_container > p`. Em Cypress: `cy.get(".cart_empty").should("be.visible")`.
- **Lista de itens do carrinho:** uma linha por produto no carrinho. Seletores: `.cart_list`, `.cart_empty + div`. Para contar os itens: `cy.get(".cart_list > .cart_item").should("have.length", 2)`.
- **Botão "Continuar Comprando":** rótulo "Continuar Comprando"; leva para `index.html`. Seletores: `.cart_footer > a:first-child`, `.cart_footer .btn_secondary`.
- **Botão "Finalizar Compra" (ir para o checkout):** rótulo "Finalizar Compra"; leva para `checkout-step-one.html`. Seletores: `.cart_footer > a:last-child`, `.cart_footer .btn_action`.

### Item dentro do Carrinho da LojaQA

Cada produto no carrinho aparece como uma linha com quantidade, nome, descrição, preço e botão Remover. Elementos da linha:
- **Linha do item do carrinho:** bloco de cada produto na lista. Seletores: `.cart_item`, `.cart_list > div`; a linha de um produto específico, pela posição: `.cart_item:nth-child(2)` (o segundo produto adicionado).
- **Quantidade do item:** sempre "1" (a LojaQA não tem controle de quantidade). Seletores: `.cart_quantity`, `.cart_item > div:first-child`.
- **Nome do item (link):** nome do produto; clicar abre a página de detalhe. Seletores: `.cart_item .inventory_item_name`, `.cart_item_label > a`.
- **Descrição do item:** texto descritivo do produto. Seletores: `.cart_item .inventory_item_desc`, `.cart_item_label > a + div`.
- **Preço do item:** no formato `R$ X,XX`. Seletores: `.cart_item .inventory_item_price`, `.item_pricebar > div`; o preço de um item específico: `.cart_item:nth-child(2) .inventory_item_price`.
- **Botão Remover:** sempre com o rótulo "Remover" (todo item listado já está no carrinho); clicar remove o item e redesenha a lista. Seletores: `.item_pricebar > button`, `.cart_item button`; o botão de um item específico: `.cart_item:nth-child(2) button` (o segundo produto adicionado).

---

## Página de Checkout Etapa 1 da LojaQA (checkout-step-one.html) — dados do comprador

A etapa 1 do checkout (`checkout-step-one.html`), com título "Pagamento: Seus Dados", tem um formulário onde o comprador informa nome, sobrenome e CEP. Para avançar: preencher os três campos e clicar em Continuar. Todos os campos são obrigatórios e a validação segue a ordem nome, sobrenome, CEP — só a primeira falha é exibida.

Elementos da página de Checkout Etapa 1 da LojaQA:

- **Container da página:** área principal da página. Seletores: `.checkout_container`, `body > main`.
- **Formulário de checkout:** agrupa os três campos, a mensagem de erro e os botões; a validação é feita pela aplicação, não pelo navegador. Seletores: `.checkout_info`, `.checkout_container > form`.
- **Campo Nome (primeiro nome):** campo do primeiro nome; recebe o foco ao abrir a página e fica com borda vermelha quando há erro de validação. Seletores: `.checkout_info > input:nth-of-type(1)`, `.checkout_info > input:first-child`.
- **Campo Sobrenome:** campo do sobrenome. Seletores: `.checkout_info > input:nth-of-type(2)`, `.checkout_info > input:first-child + input`.
- **Campo CEP (código postal):** campo do CEP; aceita qualquer texto, porque a validação só verifica se o campo foi preenchido, não o formato. Seletor: `.checkout_info > input:nth-of-type(3)`.
- **Container da mensagem de erro:** caixa vermelha que só aparece quando há erro; contém o texto do erro e o botão de fechar. Seletores: `.error-message-container`, `.checkout_info > div`, `.checkout_info > :nth-child(4)`. Erro exibido: `cy.get(".error-message-container").should("be.visible")`.
- **Texto da mensagem de erro:** os textos começam com "Erro: ", ao contrário dos do login, que começam com "Ops! ": "Erro: O nome é obrigatório", "Erro: O sobrenome é obrigatório" e "Erro: O CEP é obrigatório". Seletor: `.error-message-container > span`.
- **Botão de fechar erro (×):** fecha a mensagem de erro e tira a borda vermelha dos campos. Seletores: `.error-button`, `.error-message-container > button`.
- **Botão Cancelar:** rótulo "Cancelar"; volta para `cart.html`. Seletores: `.checkout_info > a`, `.checkout_info .btn_secondary`.
- **Botão Continuar (avançar):** rótulo "Continuar"; avança para `checkout-step-two.html` quando os três campos estão preenchidos. Seletores: `.checkout_info > input:nth-of-type(4)`, `.checkout_info > input:nth-child(6)`, `.checkout_info .btn_action`. O rótulo é o valor do campo, então a asserção é com `have.value`: `cy.get(".checkout_info .btn_action").should("have.value", "Continuar")`.

---

## Página de Checkout Etapa 2 da LojaQA (checkout-step-two.html) — resumo do pedido

A etapa 2 do checkout (`checkout-step-two.html`), com título "Pagamento: Resumo", mostra o resumo do pedido: itens, forma de pagamento, entrega, subtotal, impostos (8%) e total. Para concluir a compra: clicar em Finalizar Pedido. Os itens do resumo têm a mesma aparência das linhas do carrinho, porém **sem o botão Remover**, e usam as mesmas classes (`.cart_item`, `.inventory_item_name`, `.inventory_item_price` etc.), na ordem em que os produtos foram adicionados.

Elementos da página de Checkout Etapa 2 (resumo) da LojaQA:

- **Container da página:** área principal da etapa 2. Seletores: `.checkout_container`, `body > main`; a classe é a mesma da etapa 1, e a presença de `.summary_info` distingue esta etapa.
- **Rótulos de coluna "QTD" e "Descrição":** cabeçalhos das colunas da lista, iguais aos do carrinho. Seletores: `.cart_quantity_label` e `.cart_desc_label`.
- **Lista de itens do resumo:** uma linha por produto, com quantidade, nome, descrição e preço, sem botão. Seletores: `.cart_list`, `.checkout_container > div:nth-of-type(2)`; itens: `.cart_item`, `.cart_quantity`, `.inventory_item_name`, `.inventory_item_desc`, `.inventory_item_price`. Para contar: `cy.get(".cart_list > .cart_item").should("have.length", 2)`.
- **Bloco de resumo (informações de pagamento):** reúne a forma de pagamento, a entrega e os valores do pedido. Seletores: `.summary_info`, `.cart_list + div`.
- **Rótulo "Forma de Pagamento:":** texto "Forma de Pagamento:". Seletores: `.summary_info > div:nth-child(1)`, `.summary_info_label:first-child`.
- **Valor da forma de pagamento:** texto "CartãoQA #31337". Seletor: `.summary_info > div:nth-child(2)`.
- **Rótulo "Entrega:":** texto "Entrega:". Seletor: `.summary_info > div:nth-child(3)`.
- **Valor da entrega:** texto "Entrega Expressa Grátis!". Seletor: `.summary_info > div:nth-child(4)`.
- **Rótulo "Resumo de Valores":** texto "Resumo de Valores". Seletor: `.summary_info > div:nth-child(5)`.
- **Subtotal:** texto no formato "Subtotal: R$ X,XX" (soma dos preços dos itens). Seletores: `.summary_subtotal_label`, `.summary_info > div:nth-child(6)`.
- **Impostos (8%):** texto no formato "Impostos (8%): R$ X,XX" (8% do subtotal, arredondado em centavos). Seletores: `.summary_tax_label`, `.summary_info > div:nth-child(7)`.
- **Total:** texto no formato "Total: R$ X,XX". O total é o subtotal mais 8% de impostos. Seletores: `.summary_total_label`, `.summary_info > div:last-child`.
- **Botão Cancelar:** rótulo "Cancelar"; volta para `index.html` — diferente do Cancelar da etapa 1, que volta para o carrinho. Seletores: `.cart_footer > a`, `.cart_footer .btn_secondary`.
- **Botão Finalizar Pedido:** rótulo "Finalizar Pedido"; registra o pedido, limpa o carrinho e vai para `checkout-complete.html`. Seletores: `.cart_footer > button`, `.cart_footer .btn_action`.

---

## Página de Pedido Concluído da LojaQA (checkout-complete.html)

A página de Pedido Concluído (`checkout-complete.html`), com título "Pedido Concluído!", confirma que a compra foi finalizada e oferece gerar a nota fiscal ou voltar à loja.

Elementos da página de Pedido Concluído da LojaQA:

- **Container da página:** área principal da página. Seletores: `.checkout_complete_container`, `body > main`.
- **Imagem de confirmação:** ilustração de pedido confirmado. Seletores: `.pony_express`, `.checkout_complete_container > img`.
- **Título de conclusão:** texto "Obrigado pelo seu pedido!". Seletores: `.complete-header`, `.checkout_complete_container > h2`.
- **Texto de confirmação:** texto "Pedido #XXXXXXXX confirmado! Ele foi despachado e chegará rapidinho até você.". Seletores: `.complete-text`, `.complete-header + div`.
- **Número do pedido:** parte do texto de confirmação, preenchida pela aplicação com "#" seguido de 8 dígitos. Seletor: `.complete-text > strong`. Para asserir o formato: `cy.get(".complete-text > strong").invoke("text").should("match", /^#\d{8}$/)`.
- **Botão "Gerar Nota Fiscal (PDF)":** rótulo "Gerar Nota Fiscal (PDF)"; leva para `nota-fiscal.html`. Seletores: `.btn_action.btn_complete`, `.checkout_complete_container > a:first-of-type`.
- **Botão "Voltar à Loja":** rótulo "Voltar à Loja"; leva para `index.html`. Seletores: `.btn_secondary.btn_complete`, `.checkout_complete_container > a:last-of-type`.

---

## Página de Nota Fiscal da LojaQA (nota-fiscal.html)

A página de Nota Fiscal (`nota-fiscal.html`) exibe um documento fictício de nota fiscal do último pedido e tem um botão "Baixar PDF" que gera o arquivo e faz o download direto. O arquivo baixado se chama `nota-fiscal-<numero-do-pedido>.pdf`, com o número de 8 dígitos (exemplo: `nota-fiscal-45231987.pdf`), o que permite validar o download no teste (por exemplo, com `cy.readFile` na pasta de downloads do Cypress). Não possui o cabeçalho global, o menu lateral nem o rodapé. A única saída é o botão "Voltar", que leva ao Pedido Concluído (`checkout-complete.html`); de lá se volta ao início por "Voltar à Loja". Só mostra dados se houver um pedido finalizado na sessão; caso contrário mostra a mensagem de pedido não encontrado e o botão "Baixar PDF" não gera arquivo. Atenção: nesta página o `body` tem a classe `.nf_body`, e o seletor `header` casa o cabeçalho interno do documento, não o cabeçalho global.

Elementos da página de Nota Fiscal da LojaQA:

- **Container da página:** área principal da página. Seletores: `.nf_container`, `.nf_body > main`.
- **Mensagem "pedido não encontrado":** fica oculta quando há pedido; aparece com o texto "Nenhum pedido encontrado. Finalize uma compra para gerar a nota fiscal." quando não há pedido. Seletores: `.nf_container > p`, `.nf_container > :first-child`.
- **Documento da nota fiscal:** a nota em si; fica oculta quando não há pedido. Seletores: `.nf_documento`, `.nf_container > article`.
- **Marca d'água:** texto "SEM VALOR FISCAL" sobre o documento. Seletores: `.nf_marca_dagua`, `.nf_documento > div:first-child`.
- **Dados do emitente:** "LojaQA Comércio Educacional Ltda. (empresa fictícia)", "CNPJ: 00.000.000/0001-00" e "Av. da Qualidade, 404 — São Paulo/SP". Seletores: `.nf_empresa`, `.nf_cabecalho > div:first-child > div:nth-child(2)`.
- **Número da nota:** número do pedido, com 8 dígitos e sem o "#" da página de conclusão, depois do texto "Nº". O bloco de identificação da nota também mostra o título "NOTA FISCAL" e o subtítulo "Documento fictício para prática de testes". Seletores: `.nf_identificacao strong`, `.nf_identificacao > div:nth-child(3) > strong`.
- **Data de emissão:** depois do texto "Emissão:", no formato "DD/MM/AAAA HH:MM:SS". Seletores: `.nf_identificacao span`, `.nf_identificacao > div:nth-child(4) > span`.
- **Dados do destinatário:** bloco com o título "Destinatário", seguido do nome e do CEP do cliente. Seletores: `.nf_destinatario`, `.nf_documento > section:first-of-type`.
- **Nome do cliente:** nome e sobrenome informados no checkout ("Não informado" se ausentes). Seletores: `.nf_destinatario > div:nth-child(2)`, `.nf_destinatario > h3 + div`.
- **CEP do cliente:** texto "CEP: XXXXX". Seletores: `.nf_destinatario > div:nth-child(3)`, `.nf_destinatario > div:last-child`.
- **Tabela de itens:** colunas Item, Descrição, Qtd e Valor. Seletores: `.nf_tabela`, `.nf_documento > table`. Os cabeçalhos de coluna são `.nf_tabela thead th`; o segundo, "Descrição", é `.nf_tabela thead th:nth-child(2)`.
- **Corpo da tabela de itens:** uma linha por item do pedido, preenchida pela aplicação. Seletor: `.nf_tabela > tbody`. Para contar os itens: `cy.get(".nf_tabela tbody tr").should("have.length", 2)`.
- **Bloco de totais da nota:** reúne subtotal, impostos e total. Seletores: `.nf_totais`, `.nf_tabela + section`.
- **Subtotal da nota:** texto "Subtotal: R$ X,XX". Seletor: `.nf_totais > div:nth-child(1)`.
- **Impostos da nota:** texto "Impostos (8%): R$ X,XX". Seletor: `.nf_totais > div:nth-child(2)`.
- **Total da nota:** texto "Total: R$ X,XX". Seletores: `.nf_total`, `.nf_totais > div:last-child`.
- **Aviso legal:** texto "Documento sem valor fiscal — gerado por uma aplicação educacional de prática de testes de automação.". Seletores: `.nf_aviso`, `.nf_documento > p`.
- **Botão Voltar:** rótulo "Voltar"; leva para `checkout-complete.html` (Pedido Concluído). Seletores: `.nf_acoes > a`, `.nf_acoes .btn_secondary`.
- **Botão "Baixar PDF":** rótulo "Baixar PDF"; gera o PDF e baixa o arquivo `nota-fiscal-<numero-do-pedido>.pdf` diretamente, sem abrir nova aba. Se não houver pedido finalizado, o clique não gera arquivo. Seletores: `.nf_acoes > button`, `.nf_acoes .btn_action`.

Cada linha de item da tabela da nota fiscal mostra o número sequencial (1, 2, 3...), a descrição (nome do produto), a quantidade (sempre "1") e o valor (formato "R$ X,XX"). Seletores: a linha `.nf_tabela tbody tr`, e a de índice N, `.nf_tabela tbody tr:nth-child(N)`, na ordem em que os produtos foram adicionados; as células `td:nth-child(1)` a `td:nth-child(4)` dentro da linha. Para conferir um produto: `cy.get(".nf_tabela tbody tr:nth-child(1) td:nth-child(2)").should("have.text", "Mochila do Testador")`.

---

## Página Sobre da LojaQA (sobre.html)

A página Sobre (`sobre.html`), com título "Sobre a LojaQA", explica o propósito do projeto (ambiente de testes para um TCC). Usa o cabeçalho, o menu lateral e o rodapé globais e tem três cards, cada um com um título.

Elementos da página Sobre da LojaQA:
- **Container da página:** área principal da página, com os três cards. Seletores: `.sobre_container`, `body > main`.
- **Card "Por que este site existe?":** explica o propósito do projeto (TCC). Seletores: `.sobre_card:nth-child(1)`, `.sobre_container > section:first-child`.
- **Card "O que dá para testar aqui":** lista 6 funcionalidades que podem ser testadas. Seletores: `.sobre_card:nth-child(2)`, `.sobre_card:has(ul)`. Os itens da lista são `.sobre_card:nth-child(2) li`, por exemplo `cy.get(".sobre_card:nth-child(2) li").should("have.length", 6)`.
- **Card "Tecnologias":** descreve a stack e a autoria do projeto. Seletores: `.sobre_card:last-child`, `.sobre_card:nth-child(3)`.

---

## Comportamentos especiais por usuário da LojaQA

A LojaQA tem 6 usuários de login, todos com a senha `senha_teste_123`. Cada usuário provoca um comportamento diferente na aplicação — isto é fundamental para escolher qual usuário usar em cada cenário de teste.

- **usuario_padrao:** fluxo normal, sem defeitos. É o usuário indicado para testar o caminho feliz (comprar do início ao fim com sucesso).

- **usuario_bloqueado:** o login é recusado. Ao tentar entrar, aparece a mensagem "Ops! Desculpe, este usuário foi bloqueado." e a navegação não sai de `login.html`. Usar para testar login negado / usuário bloqueado. Em Cypress: `cy.get(".error-message-container > span").should("have.text", "Ops! Desculpe, este usuário foi bloqueado.")`.

- **usuario_lento:** o login funciona, mas com atraso artificial de cerca de 5 segundos. Durante a espera, o botão Entrar fica desabilitado e o rótulo muda para "Carregando...". Usar para testar espera, loading e performance. Em Cypress: `cy.get(".login-box .btn_action").should("be.disabled").and("have.value", "Carregando...")`.

- **usuario_problema:** o login funciona, mas todas as imagens de produto ficam quebradas, tanto na vitrine quanto no detalhe. Usar para testar imagens quebradas / atributos de imagem. Em Cypress: `cy.get(".inventory_item img").should("have.attr", "src", "../img/broken.svg")` na vitrine e `cy.get(".inventory_details_img > img").should("have.attr", "src", "../img/broken.svg")` no detalhe.

- **usuario_erro:** o login funciona, mas várias ações falham de propósito. Três defeitos: (1) trocar a ordenação dispara um `alert` de erro e a ordenação volta para "az"; (2) clicar em "Adicionar ao carrinho" de produtos com id ÍMPAR não tem efeito (o badge do carrinho não muda e é emitido um `console.error`) — produtos de id par funcionam normalmente; (3) clicar em Finalizar Pedido dispara um `alert` e o pedido NÃO é concluído. Textos exatos dos `alert`: na ordenação, "Ops! A ordenação está quebrada para este usuário. Defeito proposital para testes."; ao finalizar, "Ops! Não foi possível finalizar o pedido. Defeito proposital para testes.". Usar para testar tratamento de falhas e diálogos `alert`. Elementos envolvidos: `.product_sort_container`, `.shopping_cart_badge` e `.cart_footer > button`.

- **usuario_visual:** o login funciona, mas a aplicação recebe defeitos visuais propositais: logotipo deslocado, badge do carrinho posicionado no canto errado, título da página com espaçamento exagerado entre as letras, imagens de alguns cards tortas, botões de alguns cards desalinhados, preços em vermelho e itálico na vitrine, no carrinho e no resumo, quantidade do item no carrinho girada, e preços ERRADOS na vitrine: os produtos de id múltiplo de 5 (ids 0, 5, 10, 15 e 20) mostram R$ 10,00 a mais na vitrine, mas a página de detalhe, o carrinho e o checkout mostram o preço correto. Usar para testes de regressão visual e de asserção de preço/inconsistência. Em Cypress: o modo é identificado por `body.bugs-visuais`; as imagens tortas são as dos cards `.inventory_item:nth-child(3n)` e os botões desalinhados, os dos cards `.inventory_item:nth-child(4n)`.

---

## Mensagens de erro da LojaQA

As mensagens de erro aparecem no texto de erro, dentro da caixa de erro, que só fica visível quando há erro. Ao exibir um erro, os campos do formulário ficam com borda vermelha (os dois do login ou os três do checkout). Use estes textos exatos para asserções. Seletores: texto `.error-message-container > span`, caixa `.error-message-container`; exemplo: `cy.get(".error-message-container > span").should("have.text", "Ops! O campo senha é obrigatório")`.

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

Mensagens de `alert` do usuario_erro — disparadas ao trocar a ordenação e ao clicar em Finalizar Pedido — capturáveis com `cy.on("window:alert", ...)`:
- Ordenação quebrada: "Ops! A ordenação está quebrada para este usuário. Defeito proposital para testes.".
- Falha ao finalizar: "Ops! Não foi possível finalizar o pedido. Defeito proposital para testes.".

---

## Estados dinâmicos da LojaQA (para asserções)

Estes estados mudam durante a execução e são úteis para asserções:
- **Menu lateral aberto:** o painel do menu desliza para dentro da tela e o fundo escurecido aparece; ao fechar, os dois voltam ao estado inicial. Em Cypress: `cy.get(".bm-menu").should("have.class", "open")` com o menu aberto; as classes de estado são `.bm-menu.open` e `.bm-overlay.open`.
- **Mensagem de erro exibida:** a caixa de erro só fica visível quando há erro. Em Cypress: `cy.get(".error-message-container").should("be.visible")`; a classe de estado é `.error-message-container.visible`.
- **Campos com erro de validação:** ficam com borda vermelha — os dois campos do login ou os três do checkout de uma vez. Em Cypress: os campos marcados têm a classe `.input_error`, então `cy.get(".input_error").should("have.length", 3)` no checkout.
- **Elementos ocultos conforme o estado:** a mensagem de carrinho vazio, a mensagem de item não encontrado, os blocos da imagem e das informações do detalhe, o documento da nota fiscal e a mensagem de pedido não encontrado aparecem ou somem conforme o estado da aplicação. Seletores: `.cart_empty`, `.inventory_details > p`, `.inventory_details_img`, `.inventory_details_desc_container`, `.nf_documento`, `.nf_container > p`; em Cypress: `cy.get(".cart_empty").should("not.be.visible")`.
- **Botão de carrinho fora e dentro do carrinho:** o mesmo botão troca o rótulo de "Adicionar ao carrinho" para "Remover" e muda de estilo. Em Cypress: a classe troca de `.btn_inventory` para `.btn_secondary`, então `cy.get(".inventory_item:nth-child(12) button").should("have.class", "btn_secondary")`, ou `should("have.text", "Remover")`.
- **Botão Entrar desabilitado:** durante o atraso do `usuario_lento`. Em Cypress: `cy.get(".login-box .btn_action").should("be.disabled")`.
- **Defeitos visuais do usuario_visual:** ativados quando o usuário logado é `usuario_visual`. Em Cypress: o modo é identificado por `body.bugs-visuais`; um elemento afetado: `body.bugs-visuais .inventory_item_price`.

---

## Tipos de botão da LojaQA

- **Botão de ação principal:** azul preenchido — Entrar, Finalizar Compra, Continuar, Finalizar Pedido, Gerar Nota Fiscal (PDF) e Baixar PDF; há no máximo um por página. Seletores: `.btn_action`, que é único em cada página; combinado, `.btn.btn_action`.
- **Botão secundário:** borda vermelha — Cancelar (etapas 1 e 2 do checkout), Continuar Comprando, Remover, Voltar à Loja e Voltar. Seletores: `.btn_secondary`; no carrinho os botões Remover também têm esta classe, então o Continuar Comprando é `.cart_footer .btn_secondary`.
- **Botão de adicionar ao carrinho:** largura total do card, com o rótulo "Adicionar ao carrinho"; deixa de ter esse estilo quando o produto entra no carrinho. Seletores: `.btn_inventory`; o de um produto, `.inventory_item:nth-child(N) .btn_inventory`.
- **Botões pequenos:** os botões de carrinho dos cards, o botão de carrinho do detalhe, os botões Remover do carrinho e o link "← Voltar aos produtos". Seletor: `.btn_small`.
- **Botão de voltar do detalhe:** o link "← Voltar aos produtos". Seletores: `.btn_back`, `.header_secondary_container > .btn_back`.
- **Botões da página de pedido concluído:** largura limitada — Gerar Nota Fiscal (PDF) e Voltar à Loja. Seletores: `.btn_complete`; `.btn_action.btn_complete` (Gerar Nota Fiscal) e `.btn_secondary.btn_complete` (Voltar à Loja).
- **Todos os botões e links com aparência de botão:** formato pílula/arredondado. Seletores: `.btn`, que casa todos; combine com outra classe para restringir.

---

## Textos visíveis da LojaQA (valores esperados em asserções)

Textos exatos exibidos na LojaQA. Nesta base eles não localizam elementos: aparecem apenas como valor esperado de asserção (`should("have.text", ...)`, `should("contain", ...)`). Os rótulos dos botões "Entrar" e "Continuar" são o valor do campo e por isso são verificados com `should("have.value", ...)`:
- Títulos de página: "Produtos", "Seu Carrinho", "Pagamento: Seus Dados", "Pagamento: Resumo", "Pedido Concluído!", "Sobre a LojaQA". Elemento: `.title`.
- Banner de boas-vindas: "Bem-vindo à LojaQA!". Elemento: `.hero_banner h1`.
- Botões de carrinho: "Adicionar ao carrinho" (fora do carrinho) e "Remover" (no carrinho). Elemento: o botão de cada card, `.inventory_item button`, e de cada linha do carrinho, `.cart_item button`.
- Botões de ação: "Entrar", "Continuar Comprando", "Finalizar Compra", "Cancelar", "Continuar", "Finalizar Pedido", "Voltar à Loja", "← Voltar aos produtos", "Gerar Nota Fiscal (PDF)", "Baixar PDF", "Voltar".
- Itens do menu lateral: "Todos os Produtos", "Sobre", "Sair", "Resetar Aplicação". Elementos: `.bm-menu > a:nth-of-type(1)` a `.bm-menu > a:nth-of-type(4)`.
- Rótulos do carrinho, do resumo e da nota: "QTD", "Descrição", "Forma de Pagamento:", "CartãoQA #31337", "Entrega:", "Entrega Expressa Grátis!", "Resumo de Valores", "Subtotal:", "Impostos (8%):", "Total:", "Item", "Qtd", "Valor", "Destinatário", "Emissão:".
- Login, conclusão e nota fiscal: "🧪 LojaQA", "Sua loja para praticar automação de testes", "Usuários aceitos:", "Senha para todos os usuários:", "Obrigado pelo seu pedido!", "NOTA FISCAL", "Documento fictício para prática de testes", "SEM VALOR FISCAL".
- Estados vazios e mensagens: "Seu carrinho está vazio.", "ITEM NÃO ENCONTRADO — Este produto não existe.", "Nenhum pedido encontrado. Finalize uma compra para gerar a nota fiscal.".

---

## Seletores de cada produto da LojaQA

A LojaQA tem 21 produtos. Para cada um, a lista abaixo informa o id (usado na página de detalhe, `inventory-item.html?id=N`, e no carrinho guardado no `localStorage`), o preço e os seletores. O botão de carrinho de cada produto começa com o rótulo "Adicionar ao carrinho" e, depois de clicado, passa a "Remover".

Nenhum produto tem seletor próprio: o card é localizado pela posição na grade, `.inventory_item:nth-child(N)`, com N contado na ordenação padrão `az`, e o botão de carrinho é o único botão do card. No carrinho, no resumo e na nota fiscal, as linhas seguem a ordem em que os produtos foram adicionados (`.cart_item:nth-child(N)`, `.nf_tabela tbody tr:nth-child(N)`).

- **Mochila do Testador** — id 4, preço R$ 149,90. Na ordenação padrão, é o 12º card: `.inventory_item:nth-child(12)`. Botão de carrinho: `.inventory_item:nth-child(12) button`. Preço: `.inventory_item:nth-child(12) .inventory_item_price`.
- **Lanterna de Bike LED** — id 0, preço R$ 49,90. Na ordenação padrão, é o 10º card: `.inventory_item:nth-child(10)`. Botão de carrinho: `.inventory_item:nth-child(10) button`. Preço: `.inventory_item:nth-child(10) .inventory_item_price`.
- **Camiseta Caça-Bugs** — id 1, preço R$ 79,90. Na ordenação padrão, é o 4º card: `.inventory_item:nth-child(4)`. Botão de carrinho: `.inventory_item:nth-child(4) button`. Preço: `.inventory_item:nth-child(4) .inventory_item_price`.
- **Jaqueta Fleece QA** — id 5, preço R$ 249,90. Na ordenação padrão, é o 9º card: `.inventory_item:nth-child(9)`. Botão de carrinho: `.inventory_item:nth-child(9) button`. Preço: `.inventory_item:nth-child(9) .inventory_item_price`.
- **Body do Testadorzinho** — id 2, preço R$ 39,90. Na ordenação padrão, é o 1º card: `.inventory_item:nth-child(1)`. Botão de carrinho: `.inventory_item:nth-child(1) button`. Preço: `.inventory_item:nth-child(1) .inventory_item_price`.
- **Camiseta Teste.Tudo() Salmão** — id 3, preço R$ 79,90. Na ordenação padrão, é o 5º card: `.inventory_item:nth-child(5)`. Botão de carrinho: `.inventory_item:nth-child(5) button`. Preço: `.inventory_item:nth-child(5) .inventory_item_price`.
- **Caneca do Depurador** — id 6, preço R$ 34,90. Na ordenação padrão, é o 6º card: `.inventory_item:nth-child(6)`. Botão de carrinho: `.inventory_item:nth-child(6) button`. Preço: `.inventory_item:nth-child(6) .inventory_item_price`.
- **Teclado Mecânico TesteMaster** — id 7, preço R$ 349,90 (o mais caro). Na ordenação padrão, é o 20º card: `.inventory_item:nth-child(20)`. Botão de carrinho: `.inventory_item:nth-child(20) button`. Preço: `.inventory_item:nth-child(20) .inventory_item_price`.
- **Mouse Sem Fio ClickCerto** — id 8, preço R$ 89,90. Na ordenação padrão, é o 14º card: `.inventory_item:nth-child(14)`. Botão de carrinho: `.inventory_item:nth-child(14) button`. Preço: `.inventory_item:nth-child(14) .inventory_item_price`.
- **Fone Anti-Ruído FocoTotal** — id 9, preço R$ 199,90. Na ordenação padrão, é o 7º card: `.inventory_item:nth-child(7)`. Botão de carrinho: `.inventory_item:nth-child(7) button`. Preço: `.inventory_item:nth-child(7) .inventory_item_price`.
- **Boné Automatize Tudo** — id 10, preço R$ 59,90. Na ordenação padrão, é o 2º card: `.inventory_item:nth-child(2)`. Botão de carrinho: `.inventory_item:nth-child(2) button`. Preço: `.inventory_item:nth-child(2) .inventory_item_price`.
- **Moletom Deploy na Sexta** — id 11, preço R$ 189,90. Na ordenação padrão, é o 13º card: `.inventory_item:nth-child(13)`. Botão de carrinho: `.inventory_item:nth-child(13) button`. Preço: `.inventory_item:nth-child(13) .inventory_item_price`.
- **Garrafa Térmica CaféContínuo** — id 12, preço R$ 69,90. Na ordenação padrão, é o 8º card: `.inventory_item:nth-child(8)`. Botão de carrinho: `.inventory_item:nth-child(8) button`. Preço: `.inventory_item:nth-child(8) .inventory_item_price`.
- **Pacote de Adesivos de Bugs** — id 13, preço R$ 19,90 (o mais barato). Na ordenação padrão, é o 16º card: `.inventory_item:nth-child(16)`. Botão de carrinho: `.inventory_item:nth-child(16) button`. Preço: `.inventory_item:nth-child(16) .inventory_item_price`.
- **Caderno de Casos de Teste** — id 14, preço R$ 29,90. Na ordenação padrão, é o 3º card: `.inventory_item:nth-child(3)`. Botão de carrinho: `.inventory_item:nth-child(3) button`. Preço: `.inventory_item:nth-child(3) .inventory_item_price`.
- **Luminária PixelPerfect** — id 15, preço R$ 119,90. Na ordenação padrão, é o 11º card: `.inventory_item:nth-child(11)`. Botão de carrinho: `.inventory_item:nth-child(11) button`. Preço: `.inventory_item:nth-child(11) .inventory_item_price`.
- **Mousepad Gigante DevOps** — id 16, preço R$ 49,90. Na ordenação padrão, é o 15º card: `.inventory_item:nth-child(15)`. Botão de carrinho: `.inventory_item:nth-child(15) button`. Preço: `.inventory_item:nth-child(15) .inventory_item_price`.
- **Webcam Full HD VisãoQA** — id 17, preço R$ 159,90. Na ordenação padrão, é o 21º card: `.inventory_item:nth-child(21)`. Botão de carrinho: `.inventory_item:nth-child(21) button`. Preço: `.inventory_item:nth-child(21) .inventory_item_price`.
- **Suporte de Notebook ErgoTeste** — id 18, preço R$ 99,90. Na ordenação padrão, é o 19º card: `.inventory_item:nth-child(19)`. Botão de carrinho: `.inventory_item:nth-child(19) button`. Preço: `.inventory_item:nth-child(19) .inventory_item_price`.
- **Pelúcia do Bug** — id 19, preço R$ 44,90. Na ordenação padrão, é o 17º card: `.inventory_item:nth-child(17)`. Botão de carrinho: `.inventory_item:nth-child(17) button`. Preço: `.inventory_item:nth-child(17) .inventory_item_price`.
- **Quebra-Cabeça 404 Peças** — id 20, preço R$ 54,90. Na ordenação padrão, é o 18º card: `.inventory_item:nth-child(18)`. Botão de carrinho: `.inventory_item:nth-child(18) button`. Preço: `.inventory_item:nth-child(18) .inventory_item_price`.

Exemplo em Cypress para adicionar a Mochila do Testador ao carrinho e depois removê-la: `cy.get(".inventory_item:nth-child(12) button").click()`, conferir `cy.get(".inventory_item:nth-child(12) button").should("have.text", "Remover")` e clicar de novo no mesmo seletor.

---

## Templates internos da LojaQA (não interagíveis)

A LojaQA usa modelos internos que a aplicação copia para gerar conteúdo dinâmico (cards, linhas do carrinho, do resumo e da nota). Eles NÃO são alvos de automação: ficam invisíveis e o conteúdo deles não é alcançável por seletor. Estão listados só para referência:
- Modelo dos cards da lista de produtos, em `index.html`. Seletor: `body > template`; ele conta como irmão em seletores de posição, por isso o rodapé desta página é `body > :nth-child(5)`.
- Modelo das linhas do carrinho, em `cart.html`. Seletor: `body > template`.
- Modelo das linhas do resumo do pedido, em `checkout-step-two.html`. Seletor: `body > template`.
- Modelo das linhas da tabela da nota fiscal, em `nota-fiscal.html`. Seletor: `body > template`.

---

## Armazenamento (setup e teardown de testes) da LojaQA

A LojaQA guarda estado no navegador. Para preparar ou limpar o estado de um teste sem passar pela interface, manipule estas chaves:
- Chave `session-username` no `sessionStorage`: guarda o username logado, por exemplo "usuario_padrao". Definir esta chave equivale a estar logado.
- Chave `cart-contents` no `localStorage`: guarda um array JSON com os ids dos produtos no carrinho, por exemplo `[4,0]`.
- Chave `checkout-info` no `sessionStorage`: guarda um JSON `{first, last, postal}` preenchido na etapa 1 do checkout; é removido ao finalizar o pedido.
- Chave `ultimo-pedido` no `sessionStorage`: guarda um JSON do pedido finalizado com `{numero, data, hora, cliente, itens, subtotal, imposto, total}`, usado pela página de conclusão e pela nota fiscal.

Exemplo para iniciar um teste já logado e com um item no carrinho: definir `sessionStorage["session-username"] = "usuario_padrao"` e `localStorage["cart-contents"] = "[4]"`, depois navegar para `index.html`. Lembre que sair pelo menu apaga a sessão e o carrinho, e que "Resetar Aplicação" apaga só o carrinho. Seletores: `.bm-menu > a:nth-of-type(3)` e `.bm-menu > a:nth-of-type(4)`.

---

## Perguntas frequentes sobre a automação da LojaQA (FAQ)

Perguntas comuns e respostas diretas para localizar elementos e comportamentos na LojaQA:

- **Qual é a página inicial (home) da LojaQA e para onde o usuário vai depois do login?** É `index.html`, a página de Produtos/catálogo, exibida logo após o login. A tela de login (`login.html`) é apenas a porta de entrada, exibida enquanto não há sessão ativa. Em Cypress: `cy.get(".title").should("have.text", "Produtos")`.
- **Como voltar para a home/página inicial durante um teste?** Clicar no logotipo do cabeçalho, ou abrir o menu e clicar em "Todos os Produtos", ou navegar direto para `index.html`. Seletores: `.app_logo`; `.bm-burger-button` e depois `.bm-menu > a:nth-of-type(1)`.
- **O logotipo da LojaQA é clicável?** Sim no cabeçalho, onde é um link para a home `index.html`; na tela de login o logotipo é apenas texto, sem link. Seletores: `.app_logo` (cabeçalho) e `.login_logo` (tela de login).
- **Como fazer login na LojaQA?** Preencher o usuário (ex.: `usuario_padrao`) e a senha `senha_teste_123` e clicar em Entrar. Seletores: `.login-box > input:nth-of-type(1)`, `.login-box > input:nth-of-type(2)` e `.login-box .btn_action`.
- **Como verificar o rótulo dos botões Entrar e Continuar?** Esses dois rótulos são o valor do campo, e não um texto interno; por isso a asserção é com `have.value`, e não com `have.text`. Em Cypress: `cy.get(".login-box .btn_action").should("have.value", "Entrar")` e `cy.get(".checkout_info .btn_action").should("have.value", "Continuar")`.
- **Como deslogar (sair) da LojaQA?** Abrir o menu e clicar em "Sair" — sair é a mesma coisa que deslogar. Atenção: sair também esvazia o carrinho, então um teste que desloga e reloga não encontra os itens de antes. Seletores: `.bm-burger-button` e depois `.bm-menu > a:nth-of-type(3)`.
- **Qual é a senha dos usuários da LojaQA?** `senha_teste_123`, para todos os 6 usuários. Ela também aparece na tela de login. Seletor: `.login_password`.
- **Quais são os usuários da LojaQA?** `usuario_padrao`, `usuario_bloqueado`, `usuario_problema`, `usuario_lento`, `usuario_erro` e `usuario_visual`, listados na tela de login. Seletor: `.login_credentials`.
- **Qual usuário usar para o teste de compra bem-sucedida (caminho feliz)?** `usuario_padrao`.
- **Qual usuário faz o login falhar/ser bloqueado?** `usuario_bloqueado` — mostra "Ops! Desculpe, este usuário foi bloqueado.". Seletor: `.error-message-container > span`.
- **Qual usuário deixa as imagens quebradas?** `usuario_problema` (as imagens de produto viram `../img/broken.svg`).
- **Qual usuário deixa o login lento?** `usuario_lento` (~5 s de atraso; o botão Entrar fica desabilitado com o rótulo "Carregando..."). Seletor: `.login-box .btn_action`.
- **Qual usuário provoca erros nas ações?** `usuario_erro`: a ordenação falha com `alert`, adicionar itens de id ímpar não tem efeito e finalizar o pedido falha com `alert`.
- **Qual usuário provoca defeitos visuais?** `usuario_visual` (defeitos visuais propositais; preços errados na vitrine para os ids 0, 5, 10, 15 e 20).
- **Como localizar um produto específico na vitrine?** Pela posição do card na ordenação padrão `az`: a Caneca do Depurador é o 6º card, `.inventory_item:nth-child(6)`. A posição de cada produto está na seção "Seletores de cada produto da LojaQA".
- **Qual o seletor do botão de adicionar um produto ao carrinho?** É o único botão do card: `.inventory_item:nth-child(6) button` para a Caneca do Depurador, na ordenação padrão; a lista completa está na seção "Seletores de cada produto da LojaQA".
- **Qual o seletor do botão de remover um produto, e como saber se ele já está no carrinho?** É o mesmo botão do adicionar: o rótulo muda de "Adicionar ao carrinho" para "Remover" e a classe muda de `btn_inventory` para `btn_secondary`. Para asserir o estado: `cy.get(".inventory_item:nth-child(6) button").should("have.text", "Remover")` ou `.should("have.class", "btn_secondary")`.
- **Qual o seletor do botão de carrinho na página de detalhe do produto?** Em `inventory-item.html?id=N` há um único produto na tela, e o botão é `.inventory_details_desc_container > button`, igual para todos os produtos.
- **Como localizar o preço de um produto específico?** Pela posição do card, descendo até o preço: `.inventory_item:nth-child(12) .inventory_item_price` (Mochila do Testador, na ordenação padrão).
- **Como ordenar os produtos?** Escolher o valor no seletor de ordenação: `az` e `za` ordenam por nome (crescente e decrescente) e `lohi` e `hilo` por preço (crescente e decrescente). Em Cypress: `cy.get(".product_sort_container").select("lohi")`.
- **Como ir para o carrinho?** Clicar no ícone do carrinho no cabeçalho. Seletor: `.shopping_cart_link`.
- **Como verificar quantos itens há no carrinho?** Ler o badge do carrinho; ele fica oculto quando o carrinho está vazio. Em Cypress: `cy.get(".shopping_cart_badge").should("be.visible").and("have.text", "2")` ou `cy.get(".shopping_cart_badge").should("not.be.visible")`.
- **Como remover um item dentro do carrinho?** As linhas seguem a ordem em que os produtos foram adicionados; o botão Remover da primeira linha é `.cart_item:nth-child(1) button`: `cy.get(".cart_item:nth-child(1) button").click()`.
- **Como finalizar a compra na LojaQA?** No carrinho, clicar em Finalizar Compra; preencher nome, sobrenome e CEP e clicar em Continuar; no resumo, clicar em Finalizar Pedido. Seletores: `.cart_footer .btn_action`; `.checkout_info > input:nth-of-type(1)`, `.checkout_info > input:nth-of-type(2)`, `.checkout_info > input:nth-of-type(3)` e `.checkout_info .btn_action`; `.cart_footer > button`.
- **Onde aparece a mensagem de erro do login e do checkout?** No texto de erro, dentro da caixa de erro, que só fica visível quando há erro. Seletores: `.error-message-container > span` e `.error-message-container`; em Cypress: `cy.get(".error-message-container").should("be.visible")`.
- **Como localizar o título da página atual?** Pelo título da barra abaixo do cabeçalho — exceto em `inventory-item.html`, a única página com cabeçalho que não tem título; lá aparece o link "← Voltar aos produtos". Seletores: `.title`; no detalhe, `.btn_back`.
- **Como abrir e fechar o menu lateral?** Abrir pelo botão do menu e fechar pelo botão × ou clicando no fundo escurecido, que só fica visível com o menu aberto. Seletores: `.bm-burger-button`, `.bm-cross-button`, `.bm-overlay`; menu aberto: `cy.get(".bm-menu").should("have.class", "open")`.
- **Como localizar a linha de um item na nota fiscal?** As linhas seguem a ordem em que os produtos foram adicionados: a linha N é `.nf_tabela tbody tr:nth-child(N)`, e as células são `td:nth-child(1)` a `td:nth-child(4)` (número, descrição, quantidade e valor). Para conferir um produto: `cy.get(".nf_tabela tbody tr:nth-child(1) td:nth-child(2)").should("have.text", "Mochila do Testador")`.
- **Como gerar e baixar a nota fiscal em PDF?** Após finalizar o pedido, clicar em "Gerar Nota Fiscal (PDF)" na página de conclusão e, na página da nota, em "Baixar PDF". O arquivo `nota-fiscal-<numero-do-pedido>.pdf` é baixado direto, sem abrir nova aba. Seletores: `.btn_action.btn_complete` e `.nf_acoes > button`.
- **Como validar o download do PDF no Cypress?** Clicar em "Baixar PDF" e ler o arquivo na pasta de downloads, por exemplo `cy.readFile("cypress/downloads/nota-fiscal-45231987.pdf")`. O número do pedido pode ser lido antes na página de conclusão (sem o "#"). Seletores: `.nf_acoes > button` e `.complete-text > strong`.
- **Como preparar o estado do teste sem passar pela interface?** Definir `session-username` no `sessionStorage` (ex.: `"usuario_padrao"` — equivale a estar logado) e `cart-contents` no `localStorage` (ex.: `"[4]"` — array JSON de ids), depois navegar para `index.html`.
- **Qual a taxa de imposto do checkout?** 8% sobre o subtotal, arredondado em centavos; o valor aparece no resumo do pedido. Seletor: `.summary_tax_label`.
