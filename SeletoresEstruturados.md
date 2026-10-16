---
titulo: Mapa de Seletores Estruturados da LojaQA
projeto: LojaQA — loja virtual fictícia para prática de automação de testes
idioma: pt-BR
finalidade: Base de conhecimento (RAG) com todos os elementos, textos, comportamentos e dados de teste da aplicação LojaQA, localizados apenas por id e data-test
frameworks_alvo: Cypress
convencao_seletores: somente id (usar como "#id") e atributo data-test (usar como "[data-test=...]"); texto visível aparece apenas como valor esperado de asserção
versao_produtos: 21 produtos
---

# Mapa de Seletores Estruturados da LojaQA

Este documento é a base de conhecimento dos **seletores estruturados** da aplicação web **LojaQA**, uma loja virtual fictícia usada para praticar automação de testes. Aqui, cada elemento é localizado apenas pelos atributos que a aplicação criou para automação: o **`id`** e o **`data-test`**. Cada seção é autocontida e descreve os elementos de uma página, com seus seletores prontos para uso, textos visíveis e comportamentos.

Como interpretar os seletores em qualquer seção deste documento:
- Um seletor iniciado por `#` é um seletor de **id** (ex.: `#botao-entrar`). Cada id é único dentro da página.
- Um seletor no formato `[data-test="..."]` é um seletor de **atributo data-test** (ex.: `[data-test="botao-entrar"]`). Elementos que se repetem (cards, linhas do carrinho, linhas da nota) têm o mesmo `data-test` em todas as repetições.
- **Texto visível** não é usado para localizar elementos: aparece apenas como valor esperado de asserção, por exemplo `cy.get("#titulo-pagina").should("have.text", "Produtos")`.
- **Produto específico:** cada produto tem um botão de carrinho com seletores próprios, derivados do nome em kebab-case (minúsculas, sem acentos e sem pontuação, espaços viram hífens): id `#botao-carrinho-<nome-do-produto>` e data-test `[data-test="adicionar-carrinho-<nome-do-produto>"]` ⇄ `[data-test="remover-<nome-do-produto>"]`. Exemplo: Mochila do Testador → `#botao-carrinho-mochila-do-testador`. A lista completa está na seção "Seletores de cada produto da LojaQA".

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
- **Política de seletores deste documento:** apenas `id` e `data-test`. Classe CSS, hierarquia, posição, outros atributos HTML e texto visível não são usados para localizar elementos.

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

- **Botão de abrir o menu lateral (ícone hambúrguer ☰):** fica no canto esquerdo do cabeçalho; clicar abre o menu lateral. Seletores: `#botao-menu`, `[data-test="botao-menu"]`.
- **Logotipo da LojaQA no topo (link para a home):** exibe "🧪 LojaQA", ao lado do botão do menu; clicar volta para a página inicial (home) da loja, `index.html`. Seletores: `#link-logo`, `[data-test="link-logo"]`.
- **Link/ícone do carrinho de compras (🛒):** fica no canto direito do cabeçalho; clicar vai para o carrinho, `cart.html`. Seletores: `#link-carrinho`, `[data-test="link-carrinho"]`.
- **Badge de contagem do carrinho:** número sobre o ícone do carrinho, com a quantidade de itens. Com o carrinho vazio ele fica oculto (o texto interno continua "0"), então o carrinho vazio é verificado por visibilidade, e não por texto. Seletores: `#badge-carrinho`, `[data-test="badge-carrinho"]`. Em Cypress: `cy.get("#badge-carrinho").should("have.text", "2")`; carrinho vazio: `cy.get("#badge-carrinho").should("not.be.visible")`.
- **Título da página atual (barra abaixo do cabeçalho):** presente em todas as páginas com cabeçalho, exceto `inventory-item.html`. Textos exatos: "Produtos", "Seu Carrinho", "Pagamento: Seus Dados", "Pagamento: Resumo", "Pedido Concluído!" ou "Sobre a LojaQA". Seletores: `#titulo-pagina`, `[data-test="titulo-pagina"]`.

### Menu lateral da LojaQA (barra de navegação lateral / hamburger menu)

O menu lateral abre ao clicar no botão do menu. Ele já está carregado na página desde o início, apenas posicionado fora da tela; ao abrir, o painel desliza para dentro da tela e um fundo escurecido cobre o restante da página. Contém:

- **Container do menu lateral:** o painel que contém o botão de fechar e os quatro itens do menu. Seletores: `#menu-lateral`, `[data-test="menu-lateral"]`.
- **Botão de fechar o menu (×):** fecha o menu lateral. Seletores: `#botao-fechar-menu`, `[data-test="botao-fechar-menu"]`.
- **Item de menu "Todos os Produtos":** leva de volta para a página inicial (home) da loja, `index.html`. Seletores: `#link-todos-itens`, `[data-test="link-todos-itens"]`.
- **Item de menu "Sobre":** leva para `sobre.html`. Seletores: `#link-sobre`, `[data-test="link-sobre"]`.
- **Item de menu "Sair" (deslogar):** sair é a mesma coisa que deslogar: encerra a sessão, **esvazia o carrinho** e volta para `login.html`. Seletores: `#link-sair`, `[data-test="link-sair"]`.
- **Item de menu "Resetar Aplicação":** limpa o carrinho sem deslogar e atualiza a página atual (badge e botões de carrinho voltam ao estado inicial); o menu continua aberto depois do clique. Seletores: `#link-resetar`, `[data-test="link-resetar"]`.
- **Overlay (fundo escurecido atrás do menu):** fica oculto com o menu fechado e aparece quando o menu abre; clicar nele fecha o menu. Por isso, a visibilidade do overlay indica se o menu está aberto. Seletor: `#sobreposicao-menu` (não tem `data-test`). Em Cypress: menu aberto, `cy.get("#sobreposicao-menu").should("be.visible")`; menu fechado, `should("not.be.visible")`.

### Rodapé da LojaQA

- **Rodapé:** área no fim de cada página com cabeçalho, com os links de redes sociais e o texto de copyright. Seletores: `#rodape`, `[data-test="rodape"]`.
- **Link do GitHub no rodapé:** texto "GitHub"; abre o perfil do autor no GitHub em nova aba. Seletor: `[data-test="rede-github"]` (não tem `id`).
- **Link do LinkedIn no rodapé:** texto "LinkedIn"; abre o perfil do autor no LinkedIn em nova aba. Seletor: `[data-test="rede-linkedin"]` (não tem `id`).
- **Texto de copyright no rodapé:** texto "© 2026 LojaQA — Projeto educacional para prática de testes de automação.". Seletor: `[data-test="texto-rodape"]` (não tem `id`).

---

## Página de Login da LojaQA (login.html)

A página de Login (`login.html`) é a tela de entrada da LojaQA: é por onde o usuário começa, mas **não** é a página inicial/home da loja — a home é `index.html`, exibida depois do login. Nela o usuário digita usuário e senha para entrar. Não possui o cabeçalho global, o menu lateral nem o rodapé. Para fazer login: preencher o campo de usuário, preencher o campo de senha e clicar no botão Entrar.

Elementos da página de Login da LojaQA:

- **Campo de usuário (username):** campo onde se digita o nome de usuário; recebe o foco ao abrir a página e fica com borda vermelha quando há erro de validação. Seletores: `#campo-usuario`, `[data-test="campo-usuario"]`.
- **Campo de senha (password):** campo onde se digita a senha, com os caracteres mascarados; fica com borda vermelha quando há erro de validação. Seletores: `#campo-senha`, `[data-test="campo-senha"]`.
- **Botão Entrar (login/submit):** envia o formulário; o rótulo é "Entrar". Para o usuário `usuario_lento`, durante ~5 s o rótulo vira "Carregando..." e o botão fica desabilitado. Seletores: `#botao-entrar`, `[data-test="botao-entrar"]`. O rótulo é o valor do campo, então a asserção é com `have.value`: `cy.get("#botao-entrar").should("have.value", "Entrar")`.
- **Formulário de login:** agrupa os dois campos, a mensagem de erro e o botão Entrar; a validação é feita pela aplicação, não pelo navegador. Seletores: `#form-login`, `[data-test="form-login"]`.
- **Container da mensagem de erro:** caixa vermelha que só aparece quando há erro; contém o texto do erro e o botão de fechar. Seletores: `#container-erro`, `[data-test="container-erro"]`. Erro exibido: `cy.get("#container-erro").should("be.visible")`.
- **Texto da mensagem de erro:** texto do erro, preenchido pela aplicação. Textos exatos possíveis: "Ops! O campo usuário é obrigatório"; "Ops! O campo senha é obrigatório"; "Ops! Usuário e senha não conferem com nenhum usuário cadastrado"; "Ops! Desculpe, este usuário foi bloqueado." (usuario_bloqueado); "Ops! Você precisa estar logado para acessar esta página." (acesso a página protegida sem sessão). Seletores: `#texto-erro`, `[data-test="texto-erro"]`.
- **Botão de fechar a mensagem de erro (×):** fecha a mensagem de erro e tira a borda vermelha dos campos. Seletores: `#botao-fechar-erro`, `[data-test="botao-fechar-erro"]`.
- **Bloco informativo com a lista de usuários aceitos:** título "Usuários aceitos:" seguido dos 6 usernames. Seletores: `#credenciais-login`, `[data-test="credenciais-login"]`.
- **Bloco informativo com a senha:** título "Senha para todos os usuários:" seguido de `senha_teste_123`. Seletores: `#senha-login`, `[data-test="senha-login"]`.
- **Logotipo da tela de login:** exibe "🧪 LojaQA" no topo da página; diferente do logotipo do cabeçalho, aqui ele **não é um link**. Seletor: `[data-test="logo-login"]` (não tem `id`).
- **Tagline (subtítulo):** texto "Sua loja para praticar automação de testes", logo abaixo do logotipo. Seletor: `[data-test="tagline-login"]` (não tem `id`).

Exemplo de login bem-sucedido: `cy.get("#campo-usuario").type("usuario_padrao")`, `cy.get("#campo-senha").type("senha_teste_123")` e `cy.get("#botao-entrar").click()`. Após o sucesso, o usuário vai para a página inicial (home) da loja, `index.html`: `cy.get("#titulo-pagina").should("have.text", "Produtos")`.

---

## Página Inicial / Home / Página de Produtos / Catálogo da LojaQA (index.html)

A página `index.html` é a **página inicial (home) da LojaQA**, ou seja, a página principal exibida logo após o usuário realizar o login com sucesso. Também é chamada de página de Produtos, catálogo, vitrine ou inventário. Lista os 21 produtos da LojaQA em cards gerados pela aplicação, tem um banner de boas-vindas no topo e um seletor de ordenação na barra abaixo do cabeçalho. Quando um teste precisa "ir para a home" ou "voltar à página inicial" da loja, o destino é `index.html` (a tela de login `login.html` só aparece antes do login ou após o logout).

Elementos gerais da página de Produtos da LojaQA:

- **Banner de boas-vindas:** área no topo da página com o título "Bem-vindo à LojaQA!". Seletores: `#banner-boas-vindas`, `[data-test="banner-boas-vindas"]`.
- **Contador de produtos dentro do banner:** número total de produtos (21), preenchido pela aplicação. Seletores: `#contador-produtos`, `[data-test="contador-produtos"]`.
- **Container da página:** área principal da página, que contém a lista de produtos. Seletores: `#container-inventario`, `[data-test="container-inventario"]`.
- **Lista/grade de produtos:** grade com os 21 cards. Seletores: `#lista-produtos`, `[data-test="lista-produtos"]`. Para contar os produtos: `cy.get('[data-test="item-inventario"]').should("have.length", 21)`.
- **Seletor de ordenação (dropdown de ordenar produtos):** lista suspensa com 4 opções, ao lado do título. Seletores: `#seletor-ordenacao`, `[data-test="seletor-ordenacao"]`.

Opções do seletor de ordenação da LojaQA (valor → texto exibido). Para escolher uma opção: `cy.get("#seletor-ordenacao").select("lohi")`; para conferir a opção ativa: `cy.get("#seletor-ordenacao").should("have.value", "lohi")`:
- valor `az` → "Nome (A a Z)": **ordem alfabética crescente**, pelo nome do produto. É a ordenação ativa quando a página abre. Primeiro item: "Body do Testadorzinho"; último: "Webcam Full HD VisãoQA".
- valor `za` → "Nome (Z a A)": **ordem alfabética decrescente**, pelo nome do produto. É o inverso de `az`.
- valor `lohi` → "Preço (menor ao maior)": **ordem por preço crescente**, do mais barato ao mais caro. Primeiro item: "Pacote de Adesivos de Bugs" (R$ 19,90); último: "Teclado Mecânico TesteMaster" (R$ 349,90).
- valor `hilo` → "Preço (maior ao menor)": **ordem por preço decrescente**, do mais caro ao mais barato. É o inverso de `lohi`.

Ou seja, `az`/`za` ordenam por **nome** (ordem alfabética) e `lohi`/`hilo` ordenam por **preço** — não confundir "crescente/decrescente" de nome com o de preço. Ao trocar a ordenação, os 21 cards são redesenhados na nova ordem.

### Card de produto na página de Produtos da LojaQA

Cada produto é exibido em um card (repetido para os 21 produtos), com imagem, nome, descrição, preço e botão de carrinho. Os elementos internos têm o mesmo `data-test` em todos os cards; o único seletor exclusivo de cada produto é o do botão de carrinho. Dentro de cada card:

- **Card do produto (container):** bloco de cada produto na grade. Seletor: `[data-test="item-inventario"]`; o card de um produto específico, a partir do seu botão: `cy.get("#botao-carrinho-mochila-do-testador").parents('[data-test="item-inventario"]')`.
- **Nome do produto (link):** nome do produto; clicar abre a página de detalhe. Seletor: `[data-test="nome-item"]`.
- **Descrição do produto:** texto descritivo do produto. Seletor: `[data-test="descricao-item"]`.
- **Preço do produto:** no formato `R$ X,XX`. Seletor: `[data-test="preco-item"]`; o preço de um produto específico: `cy.get("#botao-carrinho-mochila-do-testador").parents('[data-test="item-inventario"]').find('[data-test="preco-item"]')`.
- **Imagem do produto:** foto do produto; clicar nela também abre a página de detalhe. Seletor: `[data-test="imagem-item"]` (o mesmo nos 21 cards); a imagem de um produto específico: `cy.get("#botao-carrinho-mochila-do-testador").parents('[data-test="item-inventario"]').find('[data-test="imagem-item"]')`.
- **Botão Adicionar ao carrinho / Remover:** o mesmo botão alterna conforme o estado: fora do carrinho, rótulo "Adicionar ao carrinho"; no carrinho, rótulo "Remover". Seletores: um por produto — id `#botao-carrinho-<nome-kebab>`, que não muda com o estado, e `[data-test="adicionar-carrinho-<nome-kebab>"]` ⇄ `[data-test="remover-<nome-kebab>"]`. Exemplo: `#botao-carrinho-mochila-do-testador`, `[data-test="adicionar-carrinho-mochila-do-testador"]`. O id por produto existe na vitrine e no carrinho, mas não na página de detalhe, onde o botão tem o id fixo `#botao-carrinho`.

Observação de comportamento: com o usuário `usuario_problema`, todas as imagens dos cards são trocadas por uma imagem quebrada. Com `usuario_visual`, os preços dos ids 0, 5, 10, 15 e 20 aparecem R$ 10,00 maiores só na vitrine. Asserção da imagem quebrada: `cy.get('[data-test="imagem-item"]').should("have.attr", "src", "../img/broken.svg")`.

---

## Página de Detalhe do Produto da LojaQA (inventory-item.html)

A página de Detalhe (`inventory-item.html?id=N`) mostra um único produto em tamanho grande, onde N é o id do produto. Chega-se a ela clicando no nome ou na imagem de um produto no catálogo, ou no nome de um item do carrinho. É a única página com cabeçalho que não exibe o título: no lugar dele aparece o link "← Voltar aos produtos". A página tem a mensagem de item não encontrado, o bloco da imagem e o bloco das informações (nome, descrição, preço e botão de carrinho). Como só há um produto na tela, o botão de carrinho tem um id fixo, igual para todos os produtos.

Elementos da página de Detalhe do Produto da LojaQA:

- **Container da página de detalhe:** área principal da página. Seletores: `#detalhes-produto`, `[data-test="detalhes-produto"]`.
- **Botão/link "Voltar aos produtos":** link com o texto "← Voltar aos produtos", na barra abaixo do cabeçalho; leva para `index.html`. Seletores: `#link-voltar-produtos`, `[data-test="voltar-produtos"]`.
- **Bloco da imagem (wrapper):** envolve a imagem do produto; fica oculto quando o produto não existe. Seletor: `[data-test="bloco-imagem"]` (não tem `id`).
- **Imagem do produto:** foto grande do produto. Seletores: `#imagem-item`, `[data-test="imagem-item"]`.
- **Bloco das informações (wrapper):** envolve o nome, a descrição, o preço e o botão de carrinho; fica oculto quando o produto não existe. Seletor: `[data-test="bloco-informacoes"]` (não tem `id`).
- **Nome do produto:** nome do produto em texto — aqui não é link, ao contrário do card da vitrine. Seletor: `[data-test="nome-item"]`.
- **Descrição do produto:** texto descritivo do produto. Seletor: `[data-test="descricao-item"]`.
- **Preço do produto:** no formato `R$ X,XX`. Seletor: `[data-test="preco-item"]`.
- **Botão Adicionar ao carrinho / Remover:** fora do carrinho, rótulo "Adicionar ao carrinho"; no carrinho, rótulo "Remover". Seletores: id fixo `#botao-carrinho`, igual para todos os produtos — o id por produto da vitrine (`#botao-carrinho-<nome-kebab>`) **não existe** aqui —, e o data-test do produto aberto, `[data-test="adicionar-carrinho-<nome-kebab>"]` ⇄ `[data-test="remover-<nome-kebab>"]`. Exemplo: em `inventory-item.html?id=6` (Caneca do Depurador), `#botao-carrinho` com `[data-test="adicionar-carrinho-caneca-do-depurador"]`.
- **Mensagem "item não encontrado":** fica oculta quando o produto existe; aparece com o texto "ITEM NÃO ENCONTRADO — Este produto não existe." quando o id da URL é inválido ou ausente (ex.: `inventory-item.html?id=99` ou `inventory-item.html` sem `?id=`). Nesse caso, os blocos da imagem e das informações ficam ocultos. Seletores: `#item-nao-encontrado`, `[data-test="item-nao-encontrado"]`. Em Cypress: `cy.get("#item-nao-encontrado").should("be.visible")`.

Observação de comportamento: com o usuário `usuario_problema`, a imagem do detalhe também é trocada pela imagem quebrada. Com o `usuario_visual`, o preço do detalhe é o correto: o acréscimo de R$ 10,00 nos ids 0, 5, 10, 15 e 20 aparece só na vitrine, então comparar o preço do card com o preço do detalhe revela a inconsistência. Asserção da imagem quebrada: `cy.get("#imagem-item").should("have.attr", "src", "../img/broken.svg")`.

---

## Página do Carrinho da LojaQA (cart.html)

A página do Carrinho (`cart.html`) lista os produtos adicionados ao carrinho e permite continuar comprando ou seguir para o checkout. O título da página é "Seu Carrinho". As linhas de produto são geradas pela aplicação. Todas as linhas usam os mesmos `data-test`; o seletor exclusivo de cada linha é o do seu botão Remover.

Elementos da página do Carrinho da LojaQA:

- **Container da página do carrinho:** área principal da página. Seletores: `#container-carrinho`, `[data-test="container-carrinho"]`.
- **Rótulo de coluna "QTD" (quantidade):** cabeçalho da coluna de quantidade, com o texto "QTD". Seletor: `[data-test="rotulo-quantidade"]`.
- **Rótulo de coluna "Descrição":** cabeçalho da coluna de descrição, com o texto "Descrição". Seletor: `[data-test="rotulo-descricao"]`.
- **Mensagem de carrinho vazio:** fica oculta quando há itens; aparece com o texto "Seu carrinho está vazio." quando o carrinho está vazio. Seletores: `#carrinho-vazio`, `[data-test="carrinho-vazio"]`. Em Cypress: `cy.get("#carrinho-vazio").should("be.visible")`.
- **Lista de itens do carrinho:** uma linha por produto no carrinho. Seletores: `#lista-carrinho`, `[data-test="lista-carrinho"]`. Para contar os itens: `cy.get('[data-test="item-carrinho"]').should("have.length", 2)`.
- **Botão "Continuar Comprando":** rótulo "Continuar Comprando"; leva para `index.html`. Seletores: `#botao-continuar-comprando`, `[data-test="continuar-comprando"]`.
- **Botão "Finalizar Compra" (ir para o checkout):** rótulo "Finalizar Compra"; leva para `checkout-step-one.html`. Seletores: `#botao-finalizar-compra`, `[data-test="finalizar-compra"]`.

### Item dentro do Carrinho da LojaQA

Cada produto no carrinho aparece como uma linha com quantidade, nome, descrição, preço e botão Remover. Elementos da linha:
- **Linha do item do carrinho:** bloco de cada produto na lista. Seletor: `[data-test="item-carrinho"]`; a linha de um produto específico, a partir do seu botão: `cy.get("#botao-carrinho-caneca-do-depurador").parents('[data-test="item-carrinho"]')`.
- **Quantidade do item:** sempre "1" (a LojaQA não tem controle de quantidade). Seletor: `[data-test="quantidade-item"]`.
- **Nome do item (link):** nome do produto; clicar abre a página de detalhe. Seletor: `[data-test="nome-item"]`.
- **Descrição do item:** texto descritivo do produto. Seletor: `[data-test="descricao-item"]`.
- **Preço do item:** no formato `R$ X,XX`. Seletor: `[data-test="preco-item"]`; o preço de um item específico: `cy.get("#botao-carrinho-caneca-do-depurador").parents('[data-test="item-carrinho"]').find('[data-test="preco-item"]')`.
- **Botão Remover:** sempre com o rótulo "Remover" (todo item listado já está no carrinho); clicar remove o item e redesenha a lista. Seletores: um por produto — `#botao-carrinho-<nome-kebab>` e `[data-test="remover-<nome-kebab>"]`. Exemplo: `#botao-carrinho-caneca-do-depurador`, `[data-test="remover-caneca-do-depurador"]`.

---

## Página de Checkout Etapa 1 da LojaQA (checkout-step-one.html) — dados do comprador

A etapa 1 do checkout (`checkout-step-one.html`), com título "Pagamento: Seus Dados", tem um formulário onde o comprador informa nome, sobrenome e CEP. Para avançar: preencher os três campos e clicar em Continuar. Todos os campos são obrigatórios e a validação segue a ordem nome, sobrenome, CEP — só a primeira falha é exibida.

Elementos da página de Checkout Etapa 1 da LojaQA:

- **Container da página:** área principal da página. Seletores: `#container-checkout-dados`, `[data-test="container-checkout-dados"]`.
- **Formulário de checkout:** agrupa os três campos, a mensagem de erro e os botões; a validação é feita pela aplicação, não pelo navegador. Seletores: `#form-checkout`, `[data-test="form-checkout"]`.
- **Campo Nome (primeiro nome):** campo do primeiro nome; recebe o foco ao abrir a página e fica com borda vermelha quando há erro de validação. Seletores: `#campo-nome`, `[data-test="campo-nome"]`.
- **Campo Sobrenome:** campo do sobrenome. Seletores: `#campo-sobrenome`, `[data-test="campo-sobrenome"]`.
- **Campo CEP (código postal):** campo do CEP; aceita qualquer texto, porque a validação só verifica se o campo foi preenchido, não o formato. Seletores: `#campo-cep`, `[data-test="campo-cep"]`.
- **Container da mensagem de erro:** caixa vermelha que só aparece quando há erro; contém o texto do erro e o botão de fechar. Seletores: `#container-erro`, `[data-test="container-erro"]`. Erro exibido: `cy.get("#container-erro").should("be.visible")`.
- **Texto da mensagem de erro:** os textos começam com "Erro: ", ao contrário dos do login, que começam com "Ops! ": "Erro: O nome é obrigatório", "Erro: O sobrenome é obrigatório" e "Erro: O CEP é obrigatório". Seletores: `#texto-erro`, `[data-test="texto-erro"]`.
- **Botão de fechar erro (×):** fecha a mensagem de erro e tira a borda vermelha dos campos. Seletores: `#botao-fechar-erro`, `[data-test="botao-fechar-erro"]`.
- **Botão Cancelar:** rótulo "Cancelar"; volta para `cart.html`. Seletores: `#botao-cancelar`, `[data-test="botao-cancelar"]`.
- **Botão Continuar (avançar):** rótulo "Continuar"; avança para `checkout-step-two.html` quando os três campos estão preenchidos. Seletores: `#botao-continuar`, `[data-test="botao-continuar"]`. O rótulo é o valor do campo, então a asserção é com `have.value`: `cy.get("#botao-continuar").should("have.value", "Continuar")`.

---

## Página de Checkout Etapa 2 da LojaQA (checkout-step-two.html) — resumo do pedido

A etapa 2 do checkout (`checkout-step-two.html`), com título "Pagamento: Resumo", mostra o resumo do pedido: itens, forma de pagamento, entrega, subtotal, impostos (8%) e total. Para concluir a compra: clicar em Finalizar Pedido. Os itens do resumo têm a mesma aparência das linhas do carrinho, porém **sem o botão Remover**, e usam os mesmos `data-test` (`[data-test="item-carrinho"]`, `[data-test="nome-item"]`, `[data-test="preco-item"]` etc.).

Elementos da página de Checkout Etapa 2 (resumo) da LojaQA:

- **Container da página:** área principal da etapa 2. Seletores: `#container-checkout-resumo`, `[data-test="container-checkout-resumo"]`; o id e o data-test distinguem esta etapa da etapa 1.
- **Rótulos de coluna "QTD" e "Descrição":** cabeçalhos das colunas da lista, iguais aos do carrinho. Seletores: `[data-test="rotulo-quantidade"]` e `[data-test="rotulo-descricao"]`.
- **Lista de itens do resumo:** uma linha por produto, com quantidade, nome, descrição e preço, sem botão. Seletores: `#lista-resumo`, `[data-test="lista-resumo"]`; itens: `[data-test="item-carrinho"]`, `[data-test="quantidade-item"]`, `[data-test="nome-item"]`, `[data-test="descricao-item"]`, `[data-test="preco-item"]`. Para contar: `cy.get('[data-test="item-carrinho"]').should("have.length", 2)`.
- **Bloco de resumo (informações de pagamento):** reúne a forma de pagamento, a entrega e os valores do pedido. Seletores: `#info-resumo`, `[data-test="info-resumo"]`.
- **Rótulo "Forma de Pagamento:":** texto "Forma de Pagamento:". Seletor: `[data-test="rotulo-pagamento"]`.
- **Valor da forma de pagamento:** texto "CartãoQA #31337". Seletor: `[data-test="valor-pagamento"]`.
- **Rótulo "Entrega:":** texto "Entrega:". Seletor: `[data-test="rotulo-entrega"]`.
- **Valor da entrega:** texto "Entrega Expressa Grátis!". Seletor: `[data-test="valor-entrega"]`.
- **Rótulo "Resumo de Valores":** texto "Resumo de Valores". Seletor: `[data-test="rotulo-total"]`.
- **Subtotal:** texto no formato "Subtotal: R$ X,XX" (soma dos preços dos itens). Seletores: `#valor-subtotal`, `[data-test="valor-subtotal"]`.
- **Impostos (8%):** texto no formato "Impostos (8%): R$ X,XX" (8% do subtotal, arredondado em centavos). Seletores: `#valor-imposto`, `[data-test="valor-imposto"]`.
- **Total:** texto no formato "Total: R$ X,XX". O total é o subtotal mais 8% de impostos. Seletores: `#valor-total`, `[data-test="valor-total"]`.
- **Botão Cancelar:** rótulo "Cancelar"; volta para `index.html` — diferente do Cancelar da etapa 1, que volta para o carrinho. Seletores: `#botao-cancelar`, `[data-test="botao-cancelar"]`.
- **Botão Finalizar Pedido:** rótulo "Finalizar Pedido"; registra o pedido, limpa o carrinho e vai para `checkout-complete.html`. Seletores: `#botao-finalizar`, `[data-test="botao-finalizar"]`.

---

## Página de Pedido Concluído da LojaQA (checkout-complete.html)

A página de Pedido Concluído (`checkout-complete.html`), com título "Pedido Concluído!", confirma que a compra foi finalizada e oferece gerar a nota fiscal ou voltar à loja.

Elementos da página de Pedido Concluído da LojaQA:

- **Container da página:** área principal da página. Seletores: `#container-pedido-concluido`, `[data-test="container-pedido-concluido"]`.
- **Imagem de confirmação:** ilustração de pedido confirmado. Seletores: `#imagem-confirmacao`, `[data-test="imagem-confirmacao"]`.
- **Título de conclusão:** texto "Obrigado pelo seu pedido!". Seletores: `#titulo-conclusao`, `[data-test="titulo-conclusao"]`.
- **Texto de confirmação:** texto "Pedido #XXXXXXXX confirmado! Ele foi despachado e chegará rapidinho até você.". Seletores: `#texto-conclusao`, `[data-test="texto-conclusao"]`.
- **Número do pedido:** parte do texto de confirmação, preenchida pela aplicação com "#" seguido de 8 dígitos. Seletores: `#numero-pedido`, `[data-test="numero-pedido"]`. Para asserir o formato: `cy.get("#numero-pedido").invoke("text").should("match", /^#\d{8}$/)`.
- **Botão "Gerar Nota Fiscal (PDF)":** rótulo "Gerar Nota Fiscal (PDF)"; leva para `nota-fiscal.html`. Seletores: `#botao-nota-fiscal`, `[data-test="nota-fiscal"]` (o mesmo data-test é usado pelo documento da nota na página `nota-fiscal.html`).
- **Botão "Voltar à Loja":** rótulo "Voltar à Loja"; leva para `index.html`. Seletores: `#botao-voltar-inicio`, `[data-test="voltar-inicio"]`.

---

## Página de Nota Fiscal da LojaQA (nota-fiscal.html)

A página de Nota Fiscal (`nota-fiscal.html`) exibe um documento fictício de nota fiscal do último pedido e tem um botão "Baixar PDF" que gera o arquivo e faz o download direto. O arquivo baixado se chama `nota-fiscal-<numero-do-pedido>.pdf`, com o número de 8 dígitos (exemplo: `nota-fiscal-45231987.pdf`), o que permite validar o download no teste (por exemplo, com `cy.readFile` na pasta de downloads do Cypress). Não possui o cabeçalho global, o menu lateral nem o rodapé. A única saída é o botão "Voltar", que leva ao Pedido Concluído (`checkout-complete.html`); de lá se volta ao início por "Voltar à Loja". Só mostra dados se houver um pedido finalizado na sessão; caso contrário mostra a mensagem de pedido não encontrado e o botão "Baixar PDF" não gera arquivo. Atenção: o id `#numero-pedido` e o `[data-test="nota-fiscal"]` também existem na página de Pedido Concluído, com outro conteúdo.

Elementos da página de Nota Fiscal da LojaQA:

- **Container da página:** área principal da página. Seletores: `#container-nota-fiscal`, `[data-test="container-nota-fiscal"]`.
- **Mensagem "pedido não encontrado":** fica oculta quando há pedido; aparece com o texto "Nenhum pedido encontrado. Finalize uma compra para gerar a nota fiscal." quando não há pedido. Seletores: `#pedido-nao-encontrado`, `[data-test="pedido-nao-encontrado"]`.
- **Documento da nota fiscal:** a nota em si; fica oculta quando não há pedido. Seletores: `#nota-fiscal`, `[data-test="nota-fiscal"]`.
- **Marca d'água:** texto "SEM VALOR FISCAL" sobre o documento. Seletor: `[data-test="marca-dagua"]` (não tem `id`).
- **Dados do emitente:** "LojaQA Comércio Educacional Ltda. (empresa fictícia)", "CNPJ: 00.000.000/0001-00" e "Av. da Qualidade, 404 — São Paulo/SP". Seletor: `[data-test="dados-emitente"]`.
- **Número da nota:** número do pedido, com 8 dígitos e sem o "#" da página de conclusão, depois do texto "Nº". O bloco de identificação da nota também mostra o título "NOTA FISCAL" e o subtítulo "Documento fictício para prática de testes". Seletores: `#numero-pedido`, `[data-test="numero-pedido"]`.
- **Data de emissão:** depois do texto "Emissão:", no formato "DD/MM/AAAA HH:MM:SS". Seletores: `#data-emissao`, `[data-test="data-emissao"]`.
- **Dados do destinatário:** bloco com o título "Destinatário", seguido do nome e do CEP do cliente. Seletor: `[data-test="dados-destinatario"]`.
- **Nome do cliente:** nome e sobrenome informados no checkout ("Não informado" se ausentes). Seletores: `#cliente-nome`, `[data-test="cliente-nome"]`.
- **CEP do cliente:** texto "CEP: XXXXX". Seletores: `#cliente-cep`, `[data-test="cliente-cep"]`.
- **Tabela de itens:** colunas Item, Descrição, Qtd e Valor. Seletores: `#tabela-itens`, `[data-test="tabela-itens"]`. Os cabeçalhos de coluna não têm seletor próprio; confira pelo conteúdo da tabela: `cy.get("#tabela-itens").should("contain", "Descrição")`.
- **Corpo da tabela de itens:** uma linha por item do pedido, preenchida pela aplicação. Seletores: `#itens-nota`, `[data-test="itens-nota"]`. Para contar os itens: `cy.get('[data-test="linha-item"]').should("have.length", 2)`.
- **Bloco de totais da nota:** reúne subtotal, impostos e total. Seletor: `[data-test="totais-nota"]`.
- **Subtotal da nota:** texto "Subtotal: R$ X,XX". Seletores: `#nota-subtotal`, `[data-test="nota-subtotal"]`.
- **Impostos da nota:** texto "Impostos (8%): R$ X,XX". Seletores: `#nota-imposto`, `[data-test="nota-imposto"]`.
- **Total da nota:** texto "Total: R$ X,XX". Seletores: `#nota-total`, `[data-test="nota-total"]`.
- **Aviso legal:** texto "Documento sem valor fiscal — gerado por uma aplicação educacional de prática de testes de automação.". Seletor: `[data-test="aviso-nota"]`.
- **Botão Voltar:** rótulo "Voltar"; leva para `checkout-complete.html` (Pedido Concluído). Seletores: `#botao-voltar`, `[data-test="botao-voltar"]`.
- **Botão "Baixar PDF":** rótulo "Baixar PDF"; gera o PDF e baixa o arquivo `nota-fiscal-<numero-do-pedido>.pdf` diretamente, sem abrir nova aba. Se não houver pedido finalizado, o clique não gera arquivo. Seletores: `#botao-baixar-pdf`, `[data-test="baixar-pdf"]`.

Cada linha de item da tabela da nota fiscal mostra o número sequencial (1, 2, 3...), a descrição (nome do produto), a quantidade (sempre "1") e o valor (formato "R$ X,XX"). Seletores: a linha `[data-test="linha-item"]`; as células `[data-test="linha-numero"]`, `[data-test="linha-descricao"]`, `[data-test="linha-quantidade"]` e `[data-test="linha-valor"]`. As linhas não têm seletor por produto; confira o conteúdo com `cy.get('[data-test="linha-descricao"]').should("contain", "Mochila do Testador")`.

---

## Página Sobre da LojaQA (sobre.html)

A página Sobre (`sobre.html`), com título "Sobre a LojaQA", explica o propósito do projeto (ambiente de testes para um TCC). Usa o cabeçalho, o menu lateral e o rodapé globais e tem três cards, cada um com um título.

Elementos da página Sobre da LojaQA:
- **Container da página:** área principal da página, com os três cards. Seletores: `#container-sobre`, `[data-test="container-sobre"]`.
- **Card "Por que este site existe?":** explica o propósito do projeto (TCC). Seletor: `[data-test="sobre-motivo"]`.
- **Card "O que dá para testar aqui":** lista 6 funcionalidades que podem ser testadas. Seletor: `[data-test="sobre-recursos"]`. Os itens da lista não têm seletor próprio; confira pelo conteúdo do card: `cy.get('[data-test="sobre-recursos"]').should("contain", "Catálogo com 21 produtos")`.
- **Card "Tecnologias":** descreve a stack e a autoria do projeto. Seletor: `[data-test="sobre-tecnologias"]`.

---

## Comportamentos especiais por usuário da LojaQA

A LojaQA tem 6 usuários de login, todos com a senha `senha_teste_123`. Cada usuário provoca um comportamento diferente na aplicação — isto é fundamental para escolher qual usuário usar em cada cenário de teste.

- **usuario_padrao:** fluxo normal, sem defeitos. É o usuário indicado para testar o caminho feliz (comprar do início ao fim com sucesso).

- **usuario_bloqueado:** o login é recusado. Ao tentar entrar, aparece a mensagem "Ops! Desculpe, este usuário foi bloqueado." e a navegação não sai de `login.html`. Usar para testar login negado / usuário bloqueado. Em Cypress: `cy.get("#texto-erro").should("have.text", "Ops! Desculpe, este usuário foi bloqueado.")`.

- **usuario_lento:** o login funciona, mas com atraso artificial de cerca de 5 segundos. Durante a espera, o botão Entrar fica desabilitado e o rótulo muda para "Carregando...". Usar para testar espera, loading e performance. Em Cypress: `cy.get("#botao-entrar").should("be.disabled").and("have.value", "Carregando...")`.

- **usuario_problema:** o login funciona, mas todas as imagens de produto ficam quebradas, tanto na vitrine quanto no detalhe. Usar para testar imagens quebradas / atributos de imagem. Em Cypress: `cy.get('[data-test="imagem-item"]').should("have.attr", "src", "../img/broken.svg")`, na vitrine e no detalhe.

- **usuario_erro:** o login funciona, mas várias ações falham de propósito. Três defeitos: (1) trocar a ordenação dispara um `alert` de erro e a ordenação volta para "az"; (2) clicar em "Adicionar ao carrinho" de produtos com id ÍMPAR não tem efeito (o badge do carrinho não muda e é emitido um `console.error`) — produtos de id par funcionam normalmente; (3) clicar em Finalizar Pedido dispara um `alert` e o pedido NÃO é concluído. Textos exatos dos `alert`: na ordenação, "Ops! A ordenação está quebrada para este usuário. Defeito proposital para testes."; ao finalizar, "Ops! Não foi possível finalizar o pedido. Defeito proposital para testes.". Usar para testar tratamento de falhas e diálogos `alert`. Elementos envolvidos: `#seletor-ordenacao`, `#badge-carrinho` e `#botao-finalizar`.

- **usuario_visual:** o login funciona, mas a aplicação recebe defeitos visuais propositais: logotipo deslocado, badge do carrinho posicionado no canto errado, título da página com espaçamento exagerado entre as letras, imagens de alguns cards tortas, botões de alguns cards desalinhados, preços em vermelho e itálico na vitrine, no carrinho e no resumo, quantidade do item no carrinho girada, e preços ERRADOS na vitrine: os produtos de id múltiplo de 5 (ids 0, 5, 10, 15 e 20) mostram R$ 10,00 a mais na vitrine, mas a página de detalhe, o carrinho e o checkout mostram o preço correto. Usar para testes de regressão visual e de asserção de preço/inconsistência. Em Cypress: não há seletor estruturado para o modo visual em si; a inconsistência de preço é verificada comparando `[data-test="preco-item"]` na vitrine e na página de detalhe.

---

## Mensagens de erro da LojaQA

As mensagens de erro aparecem no texto de erro, dentro da caixa de erro, que só fica visível quando há erro. Ao exibir um erro, os campos do formulário ficam com borda vermelha (os dois do login ou os três do checkout). Use estes textos exatos para asserções. Seletores: texto `#texto-erro`, caixa `#container-erro`; exemplo: `cy.get("#texto-erro").should("have.text", "Ops! O campo senha é obrigatório")`.

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
- **Menu lateral aberto:** o painel do menu desliza para dentro da tela e o fundo escurecido aparece; ao fechar, os dois voltam ao estado inicial. Em Cypress: `cy.get("#sobreposicao-menu").should("be.visible")` com o menu aberto e `should("not.be.visible")` com ele fechado.
- **Mensagem de erro exibida:** a caixa de erro só fica visível quando há erro. Em Cypress: `cy.get("#container-erro").should("be.visible")`.
- **Campos com erro de validação:** ficam com borda vermelha — os dois campos do login ou os três do checkout de uma vez. Em Cypress: não há seletor estruturado para o destaque; confirme o erro pela mensagem em `#texto-erro`.
- **Elementos ocultos conforme o estado:** a mensagem de carrinho vazio, a mensagem de item não encontrado, os blocos da imagem e das informações do detalhe, o documento da nota fiscal e a mensagem de pedido não encontrado aparecem ou somem conforme o estado da aplicação. Seletores: `#carrinho-vazio`, `#item-nao-encontrado`, `[data-test="bloco-imagem"]`, `[data-test="bloco-informacoes"]`, `#nota-fiscal`, `#pedido-nao-encontrado`; em Cypress: `cy.get("#carrinho-vazio").should("not.be.visible")`.
- **Botão de carrinho fora e dentro do carrinho:** o mesmo botão troca o rótulo de "Adicionar ao carrinho" para "Remover" e muda de estilo. Em Cypress: o data-test também troca, então `cy.get("#botao-carrinho-mochila-do-testador").should("have.attr", "data-test", "remover-mochila-do-testador")`, ou `should("have.text", "Remover")`.
- **Botão Entrar desabilitado:** durante o atraso do `usuario_lento`. Em Cypress: `cy.get("#botao-entrar").should("be.disabled")`.
- **Defeitos visuais do usuario_visual:** ativados quando o usuário logado é `usuario_visual`. Em Cypress: não há seletor estruturado para o modo visual; use a inconsistência de preço entre a vitrine e o detalhe (`[data-test="preco-item"]`).

---

## Tipos de botão da LojaQA

- **Botão de ação principal:** azul preenchido — Entrar, Finalizar Compra, Continuar, Finalizar Pedido, Gerar Nota Fiscal (PDF) e Baixar PDF; há no máximo um por página. Seletores: `#botao-entrar`, `#botao-finalizar-compra`, `#botao-continuar`, `#botao-finalizar`, `#botao-nota-fiscal`, `#botao-baixar-pdf`.
- **Botão secundário:** borda vermelha — Cancelar (etapas 1 e 2 do checkout), Continuar Comprando, Remover, Voltar à Loja e Voltar. Seletores: `#botao-cancelar`, `#botao-continuar-comprando`, `[data-test="remover-<nome-kebab>"]`, `#botao-voltar-inicio`, `#botao-voltar`.
- **Botão de adicionar ao carrinho:** largura total do card, com o rótulo "Adicionar ao carrinho"; deixa de ter esse estilo quando o produto entra no carrinho. Seletores: `[data-test="adicionar-carrinho-<nome-kebab>"]`, um por produto.
- **Botões pequenos:** os botões de carrinho dos cards, o botão de carrinho do detalhe, os botões Remover do carrinho e o link "← Voltar aos produtos". Seletores: `#botao-carrinho-<nome-kebab>`, `#botao-carrinho`, `#link-voltar-produtos`.
- **Botão de voltar do detalhe:** o link "← Voltar aos produtos". Seletores: `#link-voltar-produtos`, `[data-test="voltar-produtos"]`.
- **Botões da página de pedido concluído:** largura limitada — Gerar Nota Fiscal (PDF) e Voltar à Loja. Seletores: `#botao-nota-fiscal`, `#botao-voltar-inicio`.
- **Todos os botões e links com aparência de botão:** formato pílula/arredondado. Seletores: não há seletor comum a todos; use o id de cada botão.

---

## Textos visíveis da LojaQA (valores esperados em asserções)

Textos exatos exibidos na LojaQA. Nesta base eles não localizam elementos: aparecem apenas como valor esperado de asserção (`should("have.text", ...)`, `should("contain", ...)`). Os rótulos dos botões "Entrar" e "Continuar" são o valor do campo e por isso são verificados com `should("have.value", ...)`:
- Títulos de página: "Produtos", "Seu Carrinho", "Pagamento: Seus Dados", "Pagamento: Resumo", "Pedido Concluído!", "Sobre a LojaQA". Elemento: `#titulo-pagina`.
- Banner de boas-vindas: "Bem-vindo à LojaQA!". Elemento: `#banner-boas-vindas`.
- Botões de carrinho: "Adicionar ao carrinho" (fora do carrinho) e "Remover" (no carrinho). Elemento: o botão de cada produto, `#botao-carrinho-<nome-kebab>`.
- Botões de ação: "Entrar", "Continuar Comprando", "Finalizar Compra", "Cancelar", "Continuar", "Finalizar Pedido", "Voltar à Loja", "← Voltar aos produtos", "Gerar Nota Fiscal (PDF)", "Baixar PDF", "Voltar".
- Itens do menu lateral: "Todos os Produtos", "Sobre", "Sair", "Resetar Aplicação". Elementos: `#link-todos-itens`, `#link-sobre`, `#link-sair`, `#link-resetar`.
- Rótulos do carrinho, do resumo e da nota: "QTD", "Descrição", "Forma de Pagamento:", "CartãoQA #31337", "Entrega:", "Entrega Expressa Grátis!", "Resumo de Valores", "Subtotal:", "Impostos (8%):", "Total:", "Item", "Qtd", "Valor", "Destinatário", "Emissão:".
- Login, conclusão e nota fiscal: "🧪 LojaQA", "Sua loja para praticar automação de testes", "Usuários aceitos:", "Senha para todos os usuários:", "Obrigado pelo seu pedido!", "NOTA FISCAL", "Documento fictício para prática de testes", "SEM VALOR FISCAL".
- Estados vazios e mensagens: "Seu carrinho está vazio.", "ITEM NÃO ENCONTRADO — Este produto não existe.", "Nenhum pedido encontrado. Finalize uma compra para gerar a nota fiscal.".

---

## Seletores de cada produto da LojaQA

A LojaQA tem 21 produtos. Para cada um, a lista abaixo informa o id (usado na página de detalhe, `inventory-item.html?id=N`, e no carrinho guardado no `localStorage`), o preço e os seletores. O botão de carrinho de cada produto começa com o rótulo "Adicionar ao carrinho" e, depois de clicado, passa a "Remover".

Cada produto tem um botão de carrinho com `id` e `data-test` próprios — basta copiar o seletor e usar direto no teste. O `id` `#botao-carrinho-<nome-kebab>` nunca muda e existe na vitrine (`index.html`) e no carrinho (`cart.html`); na página de detalhe o id é sempre `#botao-carrinho`. O `data-test` alterna com o estado, de `adicionar-carrinho-...` para `remover-...`, e vale nas três telas (no carrinho, só no estado remover).

- **Mochila do Testador** — id 4, preço R$ 149,90. Botão de adicionar: `[data-test="adicionar-carrinho-mochila-do-testador"]`. Botão de remover: `[data-test="remover-mochila-do-testador"]`. Id do botão na vitrine e no carrinho: `#botao-carrinho-mochila-do-testador`.
- **Lanterna de Bike LED** — id 0, preço R$ 49,90. Botão de adicionar: `[data-test="adicionar-carrinho-lanterna-de-bike-led"]`. Botão de remover: `[data-test="remover-lanterna-de-bike-led"]`. Id do botão na vitrine e no carrinho: `#botao-carrinho-lanterna-de-bike-led`.
- **Camiseta Caça-Bugs** — id 1, preço R$ 79,90. Botão de adicionar: `[data-test="adicionar-carrinho-camiseta-caca-bugs"]`. Botão de remover: `[data-test="remover-camiseta-caca-bugs"]`. Id do botão na vitrine e no carrinho: `#botao-carrinho-camiseta-caca-bugs`.
- **Jaqueta Fleece QA** — id 5, preço R$ 249,90. Botão de adicionar: `[data-test="adicionar-carrinho-jaqueta-fleece-qa"]`. Botão de remover: `[data-test="remover-jaqueta-fleece-qa"]`. Id do botão na vitrine e no carrinho: `#botao-carrinho-jaqueta-fleece-qa`.
- **Body do Testadorzinho** — id 2, preço R$ 39,90. Botão de adicionar: `[data-test="adicionar-carrinho-body-do-testadorzinho"]`. Botão de remover: `[data-test="remover-body-do-testadorzinho"]`. Id do botão na vitrine e no carrinho: `#botao-carrinho-body-do-testadorzinho`.
- **Camiseta Teste.Tudo() Salmão** — id 3, preço R$ 79,90. Botão de adicionar: `[data-test="adicionar-carrinho-camiseta-teste-tudo-salmao"]`. Botão de remover: `[data-test="remover-camiseta-teste-tudo-salmao"]`. Id do botão na vitrine e no carrinho: `#botao-carrinho-camiseta-teste-tudo-salmao`.
- **Caneca do Depurador** — id 6, preço R$ 34,90. Botão de adicionar: `[data-test="adicionar-carrinho-caneca-do-depurador"]`. Botão de remover: `[data-test="remover-caneca-do-depurador"]`. Id do botão na vitrine e no carrinho: `#botao-carrinho-caneca-do-depurador`.
- **Teclado Mecânico TesteMaster** — id 7, preço R$ 349,90 (o mais caro). Botão de adicionar: `[data-test="adicionar-carrinho-teclado-mecanico-testemaster"]`. Botão de remover: `[data-test="remover-teclado-mecanico-testemaster"]`. Id do botão na vitrine e no carrinho: `#botao-carrinho-teclado-mecanico-testemaster`.
- **Mouse Sem Fio ClickCerto** — id 8, preço R$ 89,90. Botão de adicionar: `[data-test="adicionar-carrinho-mouse-sem-fio-clickcerto"]`. Botão de remover: `[data-test="remover-mouse-sem-fio-clickcerto"]`. Id do botão na vitrine e no carrinho: `#botao-carrinho-mouse-sem-fio-clickcerto`.
- **Fone Anti-Ruído FocoTotal** — id 9, preço R$ 199,90. Botão de adicionar: `[data-test="adicionar-carrinho-fone-anti-ruido-focototal"]`. Botão de remover: `[data-test="remover-fone-anti-ruido-focototal"]`. Id do botão na vitrine e no carrinho: `#botao-carrinho-fone-anti-ruido-focototal`.
- **Boné Automatize Tudo** — id 10, preço R$ 59,90. Botão de adicionar: `[data-test="adicionar-carrinho-bone-automatize-tudo"]`. Botão de remover: `[data-test="remover-bone-automatize-tudo"]`. Id do botão na vitrine e no carrinho: `#botao-carrinho-bone-automatize-tudo`.
- **Moletom Deploy na Sexta** — id 11, preço R$ 189,90. Botão de adicionar: `[data-test="adicionar-carrinho-moletom-deploy-na-sexta"]`. Botão de remover: `[data-test="remover-moletom-deploy-na-sexta"]`. Id do botão na vitrine e no carrinho: `#botao-carrinho-moletom-deploy-na-sexta`.
- **Garrafa Térmica CaféContínuo** — id 12, preço R$ 69,90. Botão de adicionar: `[data-test="adicionar-carrinho-garrafa-termica-cafecontinuo"]`. Botão de remover: `[data-test="remover-garrafa-termica-cafecontinuo"]`. Id do botão na vitrine e no carrinho: `#botao-carrinho-garrafa-termica-cafecontinuo`.
- **Pacote de Adesivos de Bugs** — id 13, preço R$ 19,90 (o mais barato). Botão de adicionar: `[data-test="adicionar-carrinho-pacote-de-adesivos-de-bugs"]`. Botão de remover: `[data-test="remover-pacote-de-adesivos-de-bugs"]`. Id do botão na vitrine e no carrinho: `#botao-carrinho-pacote-de-adesivos-de-bugs`.
- **Caderno de Casos de Teste** — id 14, preço R$ 29,90. Botão de adicionar: `[data-test="adicionar-carrinho-caderno-de-casos-de-teste"]`. Botão de remover: `[data-test="remover-caderno-de-casos-de-teste"]`. Id do botão na vitrine e no carrinho: `#botao-carrinho-caderno-de-casos-de-teste`.
- **Luminária PixelPerfect** — id 15, preço R$ 119,90. Botão de adicionar: `[data-test="adicionar-carrinho-luminaria-pixelperfect"]`. Botão de remover: `[data-test="remover-luminaria-pixelperfect"]`. Id do botão na vitrine e no carrinho: `#botao-carrinho-luminaria-pixelperfect`.
- **Mousepad Gigante DevOps** — id 16, preço R$ 49,90. Botão de adicionar: `[data-test="adicionar-carrinho-mousepad-gigante-devops"]`. Botão de remover: `[data-test="remover-mousepad-gigante-devops"]`. Id do botão na vitrine e no carrinho: `#botao-carrinho-mousepad-gigante-devops`.
- **Webcam Full HD VisãoQA** — id 17, preço R$ 159,90. Botão de adicionar: `[data-test="adicionar-carrinho-webcam-full-hd-visaoqa"]`. Botão de remover: `[data-test="remover-webcam-full-hd-visaoqa"]`. Id do botão na vitrine e no carrinho: `#botao-carrinho-webcam-full-hd-visaoqa`.
- **Suporte de Notebook ErgoTeste** — id 18, preço R$ 99,90. Botão de adicionar: `[data-test="adicionar-carrinho-suporte-de-notebook-ergoteste"]`. Botão de remover: `[data-test="remover-suporte-de-notebook-ergoteste"]`. Id do botão na vitrine e no carrinho: `#botao-carrinho-suporte-de-notebook-ergoteste`.
- **Pelúcia do Bug** — id 19, preço R$ 44,90. Botão de adicionar: `[data-test="adicionar-carrinho-pelucia-do-bug"]`. Botão de remover: `[data-test="remover-pelucia-do-bug"]`. Id do botão na vitrine e no carrinho: `#botao-carrinho-pelucia-do-bug`.
- **Quebra-Cabeça 404 Peças** — id 20, preço R$ 54,90. Botão de adicionar: `[data-test="adicionar-carrinho-quebra-cabeca-404-pecas"]`. Botão de remover: `[data-test="remover-quebra-cabeca-404-pecas"]`. Id do botão na vitrine e no carrinho: `#botao-carrinho-quebra-cabeca-404-pecas`.

Exemplo em Cypress para adicionar a Mochila do Testador ao carrinho e depois removê-la: `cy.get('[data-test="adicionar-carrinho-mochila-do-testador"]').click()` e em seguida `cy.get('[data-test="remover-mochila-do-testador"]').click()`; pelo id, que não muda com o estado, basta clicar duas vezes em `#botao-carrinho-mochila-do-testador`.

---

## Templates internos da LojaQA (não interagíveis)

A LojaQA usa modelos internos que a aplicação copia para gerar conteúdo dinâmico (cards, linhas do carrinho, do resumo e da nota). Eles NÃO são alvos de automação: ficam invisíveis e o conteúdo deles não é alcançável por seletor. Estão listados só para referência:
- Modelo dos cards da lista de produtos, em `index.html`. Seletor: `#modelo-item-produto`.
- Modelo das linhas do carrinho, em `cart.html`. Seletor: `#modelo-item-carrinho`.
- Modelo das linhas do resumo do pedido, em `checkout-step-two.html`. Seletor: `#modelo-item-resumo`.
- Modelo das linhas da tabela da nota fiscal, em `nota-fiscal.html`. Seletor: `#modelo-linha-item`.

---

## Armazenamento (setup e teardown de testes) da LojaQA

A LojaQA guarda estado no navegador. Para preparar ou limpar o estado de um teste sem passar pela interface, manipule estas chaves:
- Chave `session-username` no `sessionStorage`: guarda o username logado, por exemplo "usuario_padrao". Definir esta chave equivale a estar logado.
- Chave `cart-contents` no `localStorage`: guarda um array JSON com os ids dos produtos no carrinho, por exemplo `[4,0]`.
- Chave `checkout-info` no `sessionStorage`: guarda um JSON `{first, last, postal}` preenchido na etapa 1 do checkout; é removido ao finalizar o pedido.
- Chave `ultimo-pedido` no `sessionStorage`: guarda um JSON do pedido finalizado com `{numero, data, hora, cliente, itens, subtotal, imposto, total}`, usado pela página de conclusão e pela nota fiscal.

Exemplo para iniciar um teste já logado e com um item no carrinho: definir `sessionStorage["session-username"] = "usuario_padrao"` e `localStorage["cart-contents"] = "[4]"`, depois navegar para `index.html`. Lembre que sair pelo menu apaga a sessão e o carrinho, e que "Resetar Aplicação" apaga só o carrinho. Seletores: `#link-sair` e `#link-resetar`.

---

## Perguntas frequentes sobre a automação da LojaQA (FAQ)

Perguntas comuns e respostas diretas para localizar elementos e comportamentos na LojaQA:

- **Qual é a página inicial (home) da LojaQA e para onde o usuário vai depois do login?** É `index.html`, a página de Produtos/catálogo, exibida logo após o login. A tela de login (`login.html`) é apenas a porta de entrada, exibida enquanto não há sessão ativa. Em Cypress: `cy.get("#titulo-pagina").should("have.text", "Produtos")`.
- **Como voltar para a home/página inicial durante um teste?** Clicar no logotipo do cabeçalho, ou abrir o menu e clicar em "Todos os Produtos", ou navegar direto para `index.html`. Seletores: `#link-logo`; `#botao-menu` e depois `#link-todos-itens`.
- **O logotipo da LojaQA é clicável?** Sim no cabeçalho, onde é um link para a home `index.html`; na tela de login o logotipo é apenas texto, sem link. Seletores: `#link-logo` (cabeçalho) e `[data-test="logo-login"]` (tela de login).
- **Como fazer login na LojaQA?** Preencher o usuário (ex.: `usuario_padrao`) e a senha `senha_teste_123` e clicar em Entrar. Seletores: `#campo-usuario`, `#campo-senha` e `#botao-entrar`.
- **Como verificar o rótulo dos botões Entrar e Continuar?** Esses dois rótulos são o valor do campo, e não um texto interno; por isso a asserção é com `have.value`, e não com `have.text`. Em Cypress: `cy.get("#botao-entrar").should("have.value", "Entrar")` e `cy.get("#botao-continuar").should("have.value", "Continuar")`.
- **Como deslogar (sair) da LojaQA?** Abrir o menu e clicar em "Sair" — sair é a mesma coisa que deslogar. Atenção: sair também esvazia o carrinho, então um teste que desloga e reloga não encontra os itens de antes. Seletores: `#botao-menu` e depois `#link-sair`.
- **Qual é a senha dos usuários da LojaQA?** `senha_teste_123`, para todos os 6 usuários. Ela também aparece na tela de login. Seletor: `#senha-login`.
- **Quais são os usuários da LojaQA?** `usuario_padrao`, `usuario_bloqueado`, `usuario_problema`, `usuario_lento`, `usuario_erro` e `usuario_visual`, listados na tela de login. Seletor: `#credenciais-login`.
- **Qual usuário usar para o teste de compra bem-sucedida (caminho feliz)?** `usuario_padrao`.
- **Qual usuário faz o login falhar/ser bloqueado?** `usuario_bloqueado` — mostra "Ops! Desculpe, este usuário foi bloqueado.". Seletor: `#texto-erro`.
- **Qual usuário deixa as imagens quebradas?** `usuario_problema` (as imagens de produto viram `../img/broken.svg`).
- **Qual usuário deixa o login lento?** `usuario_lento` (~5 s de atraso; o botão Entrar fica desabilitado com o rótulo "Carregando..."). Seletor: `#botao-entrar`.
- **Qual usuário provoca erros nas ações?** `usuario_erro`: a ordenação falha com `alert`, adicionar itens de id ímpar não tem efeito e finalizar o pedido falha com `alert`.
- **Qual usuário provoca defeitos visuais?** `usuario_visual` (defeitos visuais propositais; preços errados na vitrine para os ids 0, 5, 10, 15 e 20).
- **Como localizar um produto específico na vitrine?** Pelo botão de carrinho do produto, que tem seletor próprio: `#botao-carrinho-caneca-do-depurador` ou `[data-test="adicionar-carrinho-caneca-do-depurador"]`. O card inteiro: `cy.get("#botao-carrinho-caneca-do-depurador").parents('[data-test="item-inventario"]')`.
- **Qual o seletor do botão de adicionar um produto ao carrinho?** Cada produto tem o seu, no padrão `[data-test="adicionar-carrinho-<nome-do-produto-em-kebab-case>"]` (id `#botao-carrinho-<nome-kebab>`); a lista completa está na seção "Seletores de cada produto da LojaQA". Ex.: a Caneca do Depurador usa `[data-test="adicionar-carrinho-caneca-do-depurador"]` ou `#botao-carrinho-caneca-do-depurador`.
- **Qual o seletor do botão de remover um produto, e como saber se ele já está no carrinho?** É o mesmo botão do adicionar, com o data-test trocado: `[data-test="remover-caneca-do-depurador"]`; o id continua `#botao-carrinho-caneca-do-depurador`, por isso funciona nos dois estados. Para asserir o estado: `cy.get("#botao-carrinho-caneca-do-depurador").should("have.text", "Remover")` ou `.should("have.attr", "data-test", "remover-caneca-do-depurador")`.
- **Qual o seletor do botão de carrinho na página de detalhe do produto?** Em `inventory-item.html?id=N` o botão tem o id fixo `#botao-carrinho`, igual para todos os produtos, e o data-test do produto aberto. Ex.: em `inventory-item.html?id=6` (Caneca do Depurador), `#botao-carrinho` ou `[data-test="adicionar-carrinho-caneca-do-depurador"]`. O id `#botao-carrinho-caneca-do-depurador` não existe nessa página.
- **Como localizar o preço de um produto específico?** Partindo do botão de carrinho do produto até o card e descendo ao preço: `cy.get("#botao-carrinho-mochila-do-testador").parents('[data-test="item-inventario"]').find('[data-test="preco-item"]')`.
- **Como ordenar os produtos?** Escolher o valor no seletor de ordenação: `az` e `za` ordenam por nome (crescente e decrescente) e `lohi` e `hilo` por preço (crescente e decrescente). Em Cypress: `cy.get("#seletor-ordenacao").select("lohi")`.
- **Como ir para o carrinho?** Clicar no ícone do carrinho no cabeçalho. Seletor: `#link-carrinho`.
- **Como verificar quantos itens há no carrinho?** Ler o badge do carrinho; ele fica oculto quando o carrinho está vazio. Em Cypress: `cy.get("#badge-carrinho").should("be.visible").and("have.text", "2")` ou `cy.get("#badge-carrinho").should("not.be.visible")`.
- **Como remover um item dentro do carrinho?** Clicar no botão Remover do produto: `cy.get('[data-test="remover-mochila-do-testador"]').click()`, ou pelo id, `cy.get("#botao-carrinho-mochila-do-testador").click()`.
- **Como finalizar a compra na LojaQA?** No carrinho, clicar em Finalizar Compra; preencher nome, sobrenome e CEP e clicar em Continuar; no resumo, clicar em Finalizar Pedido. Seletores: `#botao-finalizar-compra`; `#campo-nome`, `#campo-sobrenome`, `#campo-cep` e `#botao-continuar`; `#botao-finalizar`.
- **Onde aparece a mensagem de erro do login e do checkout?** No texto de erro, dentro da caixa de erro, que só fica visível quando há erro. Seletores: `#texto-erro` e `#container-erro`; em Cypress: `cy.get("#container-erro").should("be.visible")`.
- **Como localizar o título da página atual?** Pelo título da barra abaixo do cabeçalho — exceto em `inventory-item.html`, a única página com cabeçalho que não tem título; lá aparece o link "← Voltar aos produtos". Seletores: `#titulo-pagina`; no detalhe, `#link-voltar-produtos`.
- **Como abrir e fechar o menu lateral?** Abrir pelo botão do menu e fechar pelo botão × ou clicando no fundo escurecido, que só fica visível com o menu aberto. Seletores: `#botao-menu`, `#botao-fechar-menu`, `#sobreposicao-menu`; menu aberto: `cy.get("#sobreposicao-menu").should("be.visible")`.
- **Como localizar a linha de um item na nota fiscal?** As linhas não têm seletor por produto: `[data-test="linha-item"]` casa todas, e as células são `[data-test="linha-numero"]`, `[data-test="linha-descricao"]`, `[data-test="linha-quantidade"]` e `[data-test="linha-valor"]`. Para conferir um produto: `cy.get('[data-test="linha-descricao"]').should("contain", "Mochila do Testador")`.
- **Como gerar e baixar a nota fiscal em PDF?** Após finalizar o pedido, clicar em "Gerar Nota Fiscal (PDF)" na página de conclusão e, na página da nota, em "Baixar PDF". O arquivo `nota-fiscal-<numero-do-pedido>.pdf` é baixado direto, sem abrir nova aba. Seletores: `#botao-nota-fiscal` e `#botao-baixar-pdf`.
- **Como validar o download do PDF no Cypress?** Clicar em "Baixar PDF" e ler o arquivo na pasta de downloads, por exemplo `cy.readFile("cypress/downloads/nota-fiscal-45231987.pdf")`. O número do pedido pode ser lido antes na página de conclusão (sem o "#"). Seletores: `#botao-baixar-pdf` e `#numero-pedido`.
- **Como preparar o estado do teste sem passar pela interface?** Definir `session-username` no `sessionStorage` (ex.: `"usuario_padrao"` — equivale a estar logado) e `cart-contents` no `localStorage` (ex.: `"[4]"` — array JSON de ids), depois navegar para `index.html`.
- **Qual a taxa de imposto do checkout?** 8% sobre o subtotal, arredondado em centavos; o valor aparece no resumo do pedido. Seletor: `#valor-imposto`.
