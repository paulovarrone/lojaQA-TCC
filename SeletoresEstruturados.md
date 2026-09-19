---
titulo: Mapa de Seletores da LojaQA
projeto: LojaQA — loja virtual fictícia para prática de automação de testes
idioma: pt-BR
finalidade: Base de conhecimento (RAG) com todos os seletores, textos, comportamentos e dados de teste da aplicação LojaQA
frameworks_alvo: Cypress
convencao_seletores: cada elemento tem id (usar como "#id"), data-test (usar como "[data-test=...]") e classes CSS (usar como ".classe")
versao_produtos: 21 produtos
---

# Mapa de Seletores da LojaQA

Este documento é a base de conhecimento completa dos seletores da aplicação web **LojaQA**, uma loja virtual fictícia usada para praticar automação de testes. Cada seção é autocontida e descreve os elementos de uma página, com seus seletores prontos para uso (`#id`, `[data-test="..."]`, `.classe`), textos visíveis, atributos e comportamentos.

Como interpretar os seletores em qualquer seção deste documento:
- Um seletor iniciado por `#` é um seletor de **id** (ex.: `#botao-entrar`).
- Um seletor no formato `[data-test="..."]` é um seletor de **atributo data-test** (ex.: `[data-test="botao-entrar"]`).
- Um seletor iniciado por `.` é um seletor de **classe CSS** (ex.: `.btn_action`).
- Os botões de carrinho têm um seletor próprio por produto, derivado do nome do produto em kebab-case (minúsculas, sem acentos e sem pontuação, espaços viram hífens): id fixo `#botao-carrinho-<nome-do-produto>` e data-test `[data-test="adicionar-carrinho-<nome-do-produto>"]` ⇄ `[data-test="remover-<nome-do-produto>"]`. Exemplo: Mochila do Testador → `#botao-carrinho-mochila-do-testador`, `[data-test="adicionar-carrinho-mochila-do-testador"]`. A lista completa e pronta para copiar está na seção "Seletores dos botões de carrinho, por produto, na LojaQA".

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
- **Atributo de teste padrão:** todos os elementos interativos têm o atributo `data-test`; os principais também têm `id`. Em geral o valor de `id` e de `data-test` é o mesmo.

### Arquivos de página (URLs) da LojaQA

- `index.html` — **página inicial (home)** da LojaQA e raiz do site (o que é servido em `/html/`). É a página de Produtos (catálogo / vitrine / lista de produtos / inventário), exibida logo após o login bem-sucedido. É uma página protegida: sem sessão ativa, redireciona para `login.html?error=auth`.
- `login.html` — página de Login (tela de entrada da aplicação, exibida quando não há sessão ativa).
- `inventory-item.html?id=N` — página de Detalhe de um produto (N é o id do produto).
- `cart.html` — página do Carrinho de compras.
- `checkout-step-one.html` — Checkout etapa 1, formulário de dados do comprador ("Pagamento: Seus Dados").
- `checkout-step-two.html` — Checkout etapa 2, resumo do pedido ("Pagamento: Resumo").
- `checkout-complete.html` — página de Pedido Concluído (confirmação da compra).
- `nota-fiscal.html` — página da Nota Fiscal fictícia, com botão para gerar PDF.
- `sobre.html` — página Sobre (explica o propósito do projeto/TCC).

---

## Elementos globais da LojaQA (cabeçalho, menu lateral e rodapé)

Estes elementos aparecem em todas as páginas da LojaQA que têm cabeçalho (todas, exceto a página de Login e a página de Nota Fiscal). Use esta seção para localizar o menu, o carrinho no topo, o título da página e o rodapé em qualquer página logada.

### Cabeçalho da LojaQA

- **Botão de abrir o menu lateral (ícone hambúrguer ☰)** na página LojaQA: seletores `#botao-menu`, `[data-test="botao-menu"]`, classe `.bm-burger-button`. É um `<button>` com `aria-label="Abrir Menu"`. Clicar abre o menu lateral.
- **Logotipo da LojaQA** no topo (link para a home): seletores `#link-logo`, `[data-test="link-logo"]`, classe `.app_logo`. É um `<a>` com texto "🧪 LojaQA" e `href="index.html"`. Clicar no logotipo volta para a página inicial (home) da loja.
- **Link/ícone do carrinho de compras (🛒)** no topo: seletores `#link-carrinho`, `[data-test="link-carrinho"]`, classe `.shopping_cart_link`. É um `<a>` que leva para `cart.html`. Clicar vai para o carrinho.
- **Badge de contagem do carrinho** (número de itens sobre o ícone do carrinho): seletores `#badge-carrinho`, `[data-test="badge-carrinho"]`, classe `.shopping_cart_badge`. Fica oculto (via `style="display:none"`) quando o carrinho está vazio e mostra o número de itens quando há produtos. Para verificar a quantidade no carrinho, leia o texto deste elemento.
- **Título da página atual** (barra secundária): seletores `#titulo-pagina`, `[data-test="titulo-pagina"]`, classe `.title`. O texto muda conforme a página: "Produtos", "Seu Carrinho", "Pagamento: Seus Dados", "Pagamento: Resumo", "Pedido Concluído!" ou "Sobre a LojaQA".

### Menu lateral da LojaQA (barra de navegação lateral / hamburger menu)

O menu lateral abre ao clicar em `#botao-menu`. Contém:

- **Container do menu lateral:** seletores `#menu-lateral`, `[data-test="menu-lateral"]`, classe `.bm-menu`. Recebe a classe `.open` quando está aberto.
- **Botão de fechar o menu (×):** seletores `#botao-fechar-menu`, `[data-test="botao-fechar-menu"]`, classe `.bm-cross-button`, com `aria-label="Fechar Menu"`.
- **Item de menu "Todos os Produtos":** seletores `#link-todos-itens`, `[data-test="link-todos-itens"]`. Leva de volta para a página inicial (home) da loja, `index.html`.
- **Item de menu "Sobre":** seletores `#link-sobre`, `[data-test="link-sobre"]`. Leva para `sobre.html`.
- **Item de menu "Sair" (deslogar):** seletores `#link-sair`, `[data-test="link-sair"]`. Sair é a mesma coisa que deslogar. Encerra a sessão e volta para `login.html`.
- **Item de menu "Resetar Aplicação":** seletores `#link-resetar`, `[data-test="link-resetar"]`. Limpa o carrinho.
- **Overlay (fundo escurecido atrás do menu):** seletor `#sobreposicao-menu`, classe `.bm-overlay`. Clicar nele fecha o menu. Recebe `.open` quando visível.

### Rodapé da LojaQA

- **Rodapé:** seletores `#rodape`, `[data-test="rodape"]`, classe `.footer`.
- **Link do GitHub** no rodapé: seletor `[data-test="rede-github"]`, texto "GitHub", `href="https://github.com/paulovarrone"`, abre em nova aba.
- **Link do LinkedIn** no rodapé: seletor `[data-test="rede-linkedin"]`, texto "LinkedIn", `href="https://www.linkedin.com/in/paulovarrone"`, abre em nova aba.
- **Texto de copyright** no rodapé: seletor `[data-test="texto-rodape"]`, classe `.footer_copy`, texto "© 2026 LojaQA — Projeto educacional para prática de testes de automação.".

---

## Página de Login da LojaQA (login.html)

A página de Login (`login.html`) é a tela de entrada da LojaQA: é por onde o usuário começa, mas **não** é a página inicial/home da loja — a home é `index.html`, exibida depois do login. Nela o usuário digita usuário e senha para entrar. Não possui o cabeçalho global. Para fazer login: preencher o campo de usuário, preencher o campo de senha e clicar no botão Entrar.

Elementos da página de Login da LojaQA:

- **Campo de usuário (username):** seletores `#campo-usuario`, `[data-test="campo-usuario"]`, classe `.form_input`. É um `<input type="text">` com `placeholder="Usuário"`. Recebe a classe `.input_error` quando há erro de validação.
- **Campo de senha (password):** seletores `#campo-senha`, `[data-test="campo-senha"]`, classe `.form_input`. É um `<input type="password">` com `placeholder="Senha"`. Recebe `.input_error` em erro.
- **Botão Entrar (login/submit):** seletores `#botao-entrar`, `[data-test="botao-entrar"]`, classes `.btn` e `.btn_action`. É um `<input type="submit">` com `value="Entrar"`. Para o usuário `usuario_lento`, o texto vira "Carregando..." e o botão fica `disabled` durante ~5 segundos.
- **Formulário de login:** seletores `#form-login`, `[data-test="form-login"]`, classe `.login-box`.
- **Container da mensagem de erro:** seletores `#container-erro`, `[data-test="container-erro"]`, classe `.error-message-container`. Recebe a classe `.visible` quando um erro é exibido.
- **Texto da mensagem de erro:** seletores `#texto-erro`, `[data-test="texto-erro"]`. Textos exatos possíveis no login, para asserção: "Ops! O campo usuário é obrigatório"; "Ops! O campo senha é obrigatório"; "Ops! Usuário e senha não conferem com nenhum usuário cadastrado"; "Ops! Desculpe, este usuário foi bloqueado." (usuario_bloqueado); "Ops! Você precisa estar logado para acessar esta página." (acesso a página protegida sem sessão).
- **Botão de fechar a mensagem de erro (×):** seletores `#botao-fechar-erro`, `[data-test="botao-fechar-erro"]`, classe `.error-button`.
- **Bloco informativo com a lista de usuários aceitos:** seletores `#credenciais-login`, `[data-test="credenciais-login"]`. Lista os 6 usernames.
- **Bloco informativo com a senha:** seletores `#senha-login`, `[data-test="senha-login"]`. Contém o texto "senha_teste_123".
- **Logotipo da tela de login:** classe `.login_logo`, texto "🧪 LojaQA".
- **Tagline (subtítulo):** classe `.login_tagline`, texto "Sua loja para praticar automação de testes".

Exemplo de login bem-sucedido: digitar `usuario_padrao` no campo `#campo-usuario`, `senha_teste_123` no campo `#campo-senha` e clicar em `#botao-entrar`. Após o sucesso, o usuário é redirecionado para a página inicial (home) da loja, que é `index.html` — a página de Produtos.

---

## Página Inicial / Home / Página de Produtos / Catálogo da LojaQA (index.html)

A página `index.html` é a **página inicial (home) da LojaQA**, ou seja, a página principal exibida logo após o usuário realizar o login com sucesso. Também é chamada de página de Produtos, catálogo, vitrine ou inventário. Lista os 21 produtos da LojaQA em cards, tem um banner de boas-vindas no topo e um seletor de ordenação. Quando um teste precisa "ir para a home" ou "voltar à página inicial" da loja, o destino é `index.html` (a tela de login `login.html` só aparece antes do login ou após o logout).

Elementos gerais da página de Produtos da LojaQA:

- **Banner de boas-vindas:** seletores `#banner-boas-vindas`, `[data-test="banner-boas-vindas"]`, classe `.hero_banner`. Contém o título "Bem-vindo à LojaQA!".
- **Contador de produtos** dentro do banner: seletores `#contador-produtos`, `[data-test="contador-produtos"]`. Mostra o número total de produtos (21).
- **Container da página:** seletores `#container-inventario`, `[data-test="container-inventario"]`, classe `.inventory_container`.
- **Lista/grade de produtos:** seletores `#lista-produtos`, `[data-test="lista-produtos"]`, classe `.inventory_list`. Contém os cards, preenchidos via JavaScript.
- **Seletor de ordenação (dropdown de ordenar produtos):** seletores `#seletor-ordenacao`, `[data-test="seletor-ordenacao"]`, classe `.product_sort_container`. É um `<select>` com 4 opções.

Opções do seletor de ordenação da LojaQA (valor do `<option>` → texto exibido):
- valor `az` → "Nome (A a Z)": **ordem alfabética crescente**, pelo nome do produto. Primeiro item: "Body do Testadorzinho"; último: "Webcam Full HD VisãoQA".
- valor `za` → "Nome (Z a A)": **ordem alfabética decrescente**, pelo nome do produto. É o inverso de `az`.
- valor `lohi` → "Preço (menor ao maior)": **ordem por preço crescente**, do mais barato ao mais caro. Primeiro item: "Pacote de Adesivos de Bugs" (R$ 19,90); último: "Teclado Mecânico TesteMaster" (R$ 349,90).
- valor `hilo` → "Preço (maior ao menor)": **ordem por preço decrescente**, do mais caro ao mais barato. É o inverso de `lohi`.

Ou seja, `az`/`za` ordenam por **nome** (ordem alfabética) e `lohi`/`hilo` ordenam por **preço** — não confundir "crescente/decrescente" de nome com o de preço.

### Card de produto na página de Produtos da LojaQA

Cada produto é exibido em um card (repetido para os 21 produtos). Dentro de cada card:

- **Card do produto (container):** seletor `[data-test="item-inventario"]`, classe `.inventory_item`.
- **Nome do produto (link):** seletor `[data-test="nome-item"]`, classes `.inventory_item_name` e `.link-item`. É um link para a página de detalhe `inventory-item.html?id=N`.
- **Descrição do produto:** seletor `[data-test="descricao-item"]`, classe `.inventory_item_desc`.
- **Preço do produto:** seletor `[data-test="preco-item"]`, classe `.inventory_item_price`. Formato `R$ X,XX`.
- **Imagem do produto:** dentro de um `<a>` com classes `.inventory_item_img` e `.link-item`; o atributo `alt` da imagem é o nome do produto.
- **Botão Adicionar ao carrinho / Remover** (o mesmo botão alterna conforme o estado): cada produto tem o seu, no padrão `#botao-carrinho-<nome-kebab>` e `[data-test="adicionar-carrinho-<nome-kebab>"]` ⇄ `[data-test="remover-<nome-kebab>"]` — a lista completa está na seção "Seletores dos botões de carrinho, por produto, na LojaQA". O `id` é estável e não muda; o `data-test` alterna entre adicionar e remover. Fora do carrinho: texto "Adicionar ao carrinho", classes `.btn .btn_small .btn_inventory`. No carrinho: texto "Remover", classes `.btn .btn_small .btn_secondary`. Exemplo: para a Mochila do Testador, o botão é `#botao-carrinho-mochila-do-testador` e o data-test é `[data-test="adicionar-carrinho-mochila-do-testador"]`.

Observação de comportamento: com o usuário `usuario_problema`, todas as imagens dos cards carregam `../img/broken.svg` (imagem quebrada) em vez da imagem real.

---

## Página de Detalhe do Produto da LojaQA (inventory-item.html)

A página de Detalhe (`inventory-item.html?id=N`) mostra um único produto em tamanho grande, onde N é o id do produto. Chega-se a ela clicando no nome ou na imagem de um produto no catálogo.

Elementos da página de Detalhe do Produto da LojaQA:

- **Container da página de detalhe:** seletores `#detalhes-produto`, `[data-test="detalhes-produto"]`, classe `.inventory_details`.
- **Botão/link "Voltar aos produtos":** seletores `#link-voltar-produtos`, `[data-test="voltar-produtos"]`, classes `.btn .btn_small .btn_back`. Texto "← Voltar aos produtos", leva para `index.html`.
- **Imagem do produto:** seletores `#imagem-item`, `[data-test="imagem-item"]`. O `alt` é o nome do produto.
- **Nome do produto:** seletor `[data-test="nome-item"]`, classe `.inventory_details_name`.
- **Descrição do produto:** seletor `[data-test="descricao-item"]`, classe `.inventory_item_desc`.
- **Preço do produto:** seletor `[data-test="preco-item"]`, classe `.inventory_details_price`. Formato `R$ X,XX`.
- **Botão Adicionar ao carrinho / Remover:** nesta página o id é fixo `#botao-carrinho` (só existe um produto na tela), e o data-test é o do produto aberto — `[data-test="adicionar-carrinho-<nome-kebab>"]` ⇄ `[data-test="remover-<nome-kebab>"]` (ex.: Caneca do Depurador aberta → `[data-test="adicionar-carrinho-caneca-do-depurador"]`); a lista por produto está na seção "Seletores dos botões de carrinho, por produto, na LojaQA". Texto "Adicionar ao carrinho" ⇄ "Remover".
- **Mensagem "item não encontrado":** seletores `#item-nao-encontrado`, `[data-test="item-nao-encontrado"]`. Fica oculta (atributo `hidden`) quando o produto existe; aparece com o texto "ITEM NÃO ENCONTRADO — Este produto não existe." quando o id da URL é inválido.

---

## Página do Carrinho da LojaQA (cart.html)

A página do Carrinho (`cart.html`) lista os produtos adicionados ao carrinho e permite continuar comprando ou seguir para o checkout.

Elementos da página do Carrinho da LojaQA:

- **Container da página do carrinho:** seletores `#container-carrinho`, `[data-test="container-carrinho"]`, classe `.cart_contents_container`.
- **Rótulo de coluna "QTD" (quantidade):** seletor `[data-test="rotulo-quantidade"]`, classe `.cart_quantity_label`.
- **Rótulo de coluna "Descrição":** seletor `[data-test="rotulo-descricao"]`, classe `.cart_desc_label`.
- **Mensagem de carrinho vazio:** seletores `#carrinho-vazio`, `[data-test="carrinho-vazio"]`, classe `.cart_empty`. Fica oculta (atributo `hidden`) quando há itens; aparece com o texto "Seu carrinho está vazio." quando o carrinho está vazio.
- **Lista de itens do carrinho:** seletores `#lista-carrinho`, `[data-test="lista-carrinho"]`, classe `.cart_list`. Preenchida via JavaScript.
- **Botão "Continuar Comprando":** seletores `#botao-continuar-comprando`, `[data-test="continuar-comprando"]`, classes `.btn .btn_secondary`. Leva para `index.html`.
- **Botão "Finalizar Compra" (ir para o checkout):** seletores `#botao-finalizar-compra`, `[data-test="finalizar-compra"]`, classes `.btn .btn_action`. Leva para `checkout-step-one.html`.

### Item dentro do Carrinho da LojaQA

Cada produto no carrinho aparece como uma linha com:
- **Linha do item do carrinho:** seletor `[data-test="item-carrinho"]`, classe `.cart_item`.
- **Quantidade do item:** seletor `[data-test="quantidade-item"]`, classe `.cart_quantity`. Sempre "1".
- **Nome do item (link):** seletor `[data-test="nome-item"]`, leva ao detalhe do produto.
- **Descrição do item:** seletor `[data-test="descricao-item"]`.
- **Preço do item:** seletor `[data-test="preco-item"]`, formato `R$ X,XX`.
- **Botão Remover:** um por produto no carrinho — `[data-test="remover-<nome-kebab>"]` e id `#botao-carrinho-<nome-kebab>` do produto correspondente (lista completa na seção "Seletores dos botões de carrinho, por produto, na LojaQA"). Texto "Remover", classes `.btn .btn_small .btn_secondary`. Exemplo: `[data-test="remover-caneca-do-depurador"]`, id `#botao-carrinho-caneca-do-depurador`.

---

## Página de Checkout Etapa 1 da LojaQA (checkout-step-one.html) — dados do comprador

A etapa 1 do checkout (`checkout-step-one.html`), com título "Pagamento: Seus Dados", tem um formulário onde o comprador informa nome, sobrenome e CEP. Para avançar: preencher os três campos e clicar em Continuar. Todos os campos são obrigatórios.

Elementos da página de Checkout Etapa 1 da LojaQA:

- **Container da página:** seletores `#container-checkout-dados`, `[data-test="container-checkout-dados"]`, classe `.checkout_container`.
- **Formulário de checkout:** seletores `#form-checkout`, `[data-test="form-checkout"]`, classe `.checkout_info`.
- **Campo Nome (primeiro nome):** seletores `#campo-nome`, `[data-test="campo-nome"]`, classe `.form_input`, `placeholder="Nome"`. Recebe `.input_error` em erro.
- **Campo Sobrenome:** seletores `#campo-sobrenome`, `[data-test="campo-sobrenome"]`, classe `.form_input`, `placeholder="Sobrenome"`.
- **Campo CEP (código postal):** seletores `#campo-cep`, `[data-test="campo-cep"]`, classe `.form_input`, `placeholder="CEP"`.
- **Container da mensagem de erro:** seletores `#container-erro`, `[data-test="container-erro"]`, classe `.error-message-container` (recebe `.visible` quando exibido).
- **Texto da mensagem de erro:** seletores `#texto-erro`, `[data-test="texto-erro"]`.
- **Botão de fechar erro (×):** seletores `#botao-fechar-erro`, `[data-test="botao-fechar-erro"]`, classe `.error-button`.
- **Botão Cancelar:** seletores `#botao-cancelar`, `[data-test="botao-cancelar"]`, classes `.btn .btn_secondary`. Volta para `cart.html`.
- **Botão Continuar (avançar):** seletores `#botao-continuar`, `[data-test="botao-continuar"]`, classes `.btn .btn_action`, `value="Continuar"`. Avança para `checkout-step-two.html`.

---

## Página de Checkout Etapa 2 da LojaQA (checkout-step-two.html) — resumo do pedido

A etapa 2 do checkout (`checkout-step-two.html`), com título "Pagamento: Resumo", mostra o resumo do pedido: itens, forma de pagamento, entrega, subtotal, impostos (8%) e total. Para concluir a compra: clicar em Finalizar Pedido.

Elementos da página de Checkout Etapa 2 (resumo) da LojaQA:

- **Container da página:** seletores `#container-checkout-resumo`, `[data-test="container-checkout-resumo"]`, classe `.checkout_container`.
- **Lista de itens do resumo:** seletores `#lista-resumo`, `[data-test="lista-resumo"]`, classe `.cart_list`. Preenchida via JavaScript. Os itens usam os mesmos seletores dos itens do carrinho (`[data-test="item-carrinho"]`, `[data-test="quantidade-item"]`, `[data-test="nome-item"]`, `[data-test="descricao-item"]`, `[data-test="preco-item"]`), porém sem botão Remover.
- **Bloco de resumo (informações de pagamento):** seletores `#info-resumo`, `[data-test="info-resumo"]`, classe `.summary_info`.
- **Rótulo "Forma de Pagamento:":** seletor `[data-test="rotulo-pagamento"]`.
- **Valor da forma de pagamento:** seletor `[data-test="valor-pagamento"]`, texto "CartãoQA #31337".
- **Rótulo "Entrega:":** seletor `[data-test="rotulo-entrega"]`.
- **Valor da entrega:** seletor `[data-test="valor-entrega"]`, texto "Entrega Expressa Grátis!".
- **Rótulo "Resumo de Valores":** seletor `[data-test="rotulo-total"]`.
- **Subtotal:** seletores `#valor-subtotal`, `[data-test="valor-subtotal"]`. Texto no formato "Subtotal: R$ X,XX".
- **Impostos (8%):** seletores `#valor-imposto`, `[data-test="valor-imposto"]`. Texto no formato "Impostos (8%): R$ X,XX".
- **Total:** seletores `#valor-total`, `[data-test="valor-total"]`. Texto no formato "Total: R$ X,XX". O total é o subtotal mais 8% de impostos.
- **Botão Cancelar:** seletores `#botao-cancelar`, `[data-test="botao-cancelar"]`, classes `.btn .btn_secondary`. Volta para `index.html`.
- **Botão Finalizar Pedido:** seletores `#botao-finalizar`, `[data-test="botao-finalizar"]`, classes `.btn .btn_action`. Registra o pedido, limpa o carrinho e vai para `checkout-complete.html`.

---

## Página de Pedido Concluído da LojaQA (checkout-complete.html)

A página de Pedido Concluído (`checkout-complete.html`), com título "Pedido Concluído!", confirma que a compra foi finalizada e oferece gerar a nota fiscal ou voltar à loja.

Elementos da página de Pedido Concluído da LojaQA:

- **Container da página:** seletores `#container-pedido-concluido`, `[data-test="container-pedido-concluido"]`, classe `.checkout_complete_container`.
- **Imagem de confirmação:** seletores `#imagem-confirmacao`, `[data-test="imagem-confirmacao"]`, classe `.pony_express`.
- **Título de conclusão:** seletores `#titulo-conclusao`, `[data-test="titulo-conclusao"]`, classe `.complete-header`, texto "Obrigado pelo seu pedido!".
- **Texto de confirmação:** seletores `#texto-conclusao`, `[data-test="texto-conclusao"]`, classe `.complete-text`. Contém "Pedido #XXXXXXXX confirmado! Ele foi despachado...".
- **Número do pedido:** seletores `#numero-pedido`, `[data-test="numero-pedido"]`. Mostra "#XXXXXXXX" (8 dígitos), preenchido via JavaScript.
- **Botão "Gerar Nota Fiscal (PDF)":** seletores `#botao-nota-fiscal`, `[data-test="nota-fiscal"]`, classes `.btn .btn_action .btn_complete`. Leva para `nota-fiscal.html`.
- **Botão "Voltar à Loja":** seletores `#botao-voltar-inicio`, `[data-test="voltar-inicio"]`, classes `.btn .btn_secondary .btn_complete`. Leva para `index.html`.

---

## Página de Nota Fiscal da LojaQA (nota-fiscal.html)

A página de Nota Fiscal (`nota-fiscal.html`) exibe um documento fictício de nota fiscal do último pedido e tem um botão "Baixar PDF" que gera o arquivo e faz o download direto. O arquivo baixado se chama `nota-fiscal-<numero-do-pedido>.pdf` (exemplo: `nota-fiscal-4821.pdf`), o que permite validar o download no teste (por exemplo, com `cy.readFile` na pasta de downloads do Cypress). Não possui o cabeçalho global nem menu lateral, então a única saída da página é o botão "Voltar" (`#botao-voltar`), que leva ao Pedido Concluído (`checkout-complete.html`); de lá se volta ao início por "Voltar à Loja" (`#botao-voltar-inicio`) ou pelo menu. Só mostra dados se houver um pedido finalizado; caso contrário mostra a mensagem de pedido não encontrado e o botão não gera arquivo.

Elementos da página de Nota Fiscal da LojaQA:

- **Container da página:** seletores `#container-nota-fiscal`, `[data-test="container-nota-fiscal"]`, classe `.nf_container`.
- **Mensagem "pedido não encontrado":** seletores `#pedido-nao-encontrado`, `[data-test="pedido-nao-encontrado"]`. Fica oculta (`hidden`) quando há pedido; aparece com o texto "Nenhum pedido encontrado. Finalize uma compra para gerar a nota fiscal." quando não há pedido.
- **Documento da nota fiscal:** seletores `#nota-fiscal`, `[data-test="nota-fiscal"]`, classe `.nf_documento`. Fica oculto (`hidden`) quando não há pedido.
- **Marca d'água:** classe `.nf_marca_dagua`, texto "SEM VALOR FISCAL".
- **Dados do emitente:** seletor `[data-test="dados-emitente"]`, classe `.nf_empresa`. Empresa fictícia com CNPJ 00.000.000/0001-00.
- **Número da nota:** seletores `#numero-pedido`, `[data-test="numero-pedido"]`. 8 dígitos.
- **Data de emissão:** seletores `#data-emissao`, `[data-test="data-emissao"]`. Formato "DD/MM/AAAA HH:MM:SS".
- **Dados do destinatário:** seletor `[data-test="dados-destinatario"]`, classe `.nf_destinatario`.
- **Nome do cliente:** seletores `#cliente-nome`, `[data-test="cliente-nome"]`. Nome e sobrenome informados no checkout.
- **CEP do cliente:** seletores `#cliente-cep`, `[data-test="cliente-cep"]`. Texto "CEP: XXXXX".
- **Tabela de itens:** seletores `#tabela-itens`, `[data-test="tabela-itens"]`, classe `.nf_tabela`. Colunas: Item, Descrição, Qtd, Valor.
- **Corpo da tabela de itens:** seletores `#itens-nota`, `[data-test="itens-nota"]`. Preenchido via JavaScript.
- **Bloco de totais da nota:** seletor `[data-test="totais-nota"]`, classe `.nf_totais`. Agrupa subtotal, impostos e total.
- **Subtotal da nota:** seletores `#nota-subtotal`, `[data-test="nota-subtotal"]`. Texto "Subtotal: R$ X,XX".
- **Impostos da nota:** seletores `#nota-imposto`, `[data-test="nota-imposto"]`. Texto "Impostos (8%): R$ X,XX".
- **Total da nota:** seletores `#nota-total`, `[data-test="nota-total"]`, classe `.nf_total`. Texto "Total: R$ X,XX".
- **Aviso legal:** seletor `[data-test="aviso-nota"]`, classe `.nf_aviso`. Texto "Documento sem valor fiscal...".
- **Botão Voltar:** seletores `#botao-voltar`, `[data-test="botao-voltar"]`, classes `.btn .btn_secondary`. Volta uma página para trás, ou seja, para `checkout-complete.html` (Pedido Concluído).
- **Botão "Baixar PDF":** seletores `#botao-baixar-pdf`, `[data-test="baixar-pdf"]`, classes `.btn .btn_action`. Ao clicar, gera o PDF e baixa o arquivo `nota-fiscal-<numero-do-pedido>.pdf` diretamente, sem abrir nova aba. Se não houver pedido finalizado, o clique não gera arquivo.

Cada linha de item da tabela da nota fiscal contém: a linha `[data-test="linha-item"]` (`<tr>`); o número sequencial `[data-test="linha-numero"]`; a descrição `[data-test="linha-descricao"]` (nome do produto); a quantidade `[data-test="linha-quantidade"]` (sempre "1"); e o valor `[data-test="linha-valor"]` (formato "R$ X,XX").

---

## Página Sobre da LojaQA (sobre.html)

A página Sobre (`sobre.html`), com título "Sobre a LojaQA", explica o propósito do projeto (ambiente de testes para um TCC). Usa o cabeçalho, o menu lateral e o rodapé globais.

Elementos da página Sobre da LojaQA:
- **Container da página:** seletores `#container-sobre`, `[data-test="container-sobre"]`, classe `.sobre_container`.
- **Card "Por que este site existe?":** seletor `[data-test="sobre-motivo"]`, classe `.sobre_card`. Explica o propósito (TCC).
- **Card "O que dá para testar aqui":** seletor `[data-test="sobre-recursos"]`, classe `.sobre_card`. Lista funcionalidades.
- **Card "Tecnologias":** seletor `[data-test="sobre-tecnologias"]`, classe `.sobre_card`. Descreve a stack e a autoria.

---

## Comportamentos especiais por usuário da LojaQA

A LojaQA tem 6 usuários de login, todos com a senha `senha_teste_123`. Cada usuário provoca um comportamento diferente na aplicação — isto é fundamental para escolher qual usuário usar em cada cenário de teste.

- **usuario_padrao:** fluxo normal, sem defeitos. É o usuário indicado para testar o caminho feliz (comprar do início ao fim com sucesso).

- **usuario_bloqueado:** o login é recusado. Ao tentar entrar, aparece no `#texto-erro` a mensagem "Ops! Desculpe, este usuário foi bloqueado.". Usar para testar login negado / usuário bloqueado.

- **usuario_lento:** o login funciona, mas com atraso artificial de cerca de 5 segundos. Durante a espera, o botão `#botao-entrar` fica com o atributo `disabled` e o texto muda para "Carregando...". Usar para testar espera, loading e performance.

- **usuario_problema:** o login funciona, mas todas as imagens de produto ficam quebradas — a tag `img` aponta para `src="../img/broken.svg"` tanto na vitrine quanto no detalhe. Usar para testar imagens quebradas / atributos de imagem.

- **usuario_erro:** o login funciona, mas várias ações falham de propósito. Três defeitos: (1) trocar o valor de `#seletor-ordenacao` dispara um `alert` de erro e a ordenação volta para "az"; (2) clicar em "Adicionar ao carrinho" de produtos com id ÍMPAR não tem efeito (o badge do carrinho não muda e é emitido um `console.error`) — produtos de id par funcionam normalmente; (3) clicar no botão `#botao-finalizar` (Finalizar Pedido) dispara um `alert` e o pedido NÃO é concluído. Usar para testar tratamento de falhas e diálogos `alert`. Textos exatos dos `alert`: na ordenação, "Ops! A ordenação está quebrada para este usuário. Defeito proposital para testes."; ao finalizar, "Ops! Não foi possível finalizar o pedido. Defeito proposital para testes.".

- **usuario_visual:** o login funciona, mas a aplicação recebe defeitos visuais propositais — o elemento `body` ganha a classe `.bugs-visuais`, que provoca: logotipo deslocado, badge do carrinho (`#badge-carrinho`) posicionado no canto errado, imagens de alguns cards (`:nth-child(3n)`) tortas/rotacionadas, botões de alguns cards (`:nth-child(4n)`) desalinhados, preços em vermelho e itálico, e preços ERRADOS na vitrine: os produtos de id múltiplo de 5 (ids 0, 5, 10, 15 e 20) mostram R$ 10,00 a mais na vitrine, mas o carrinho e o checkout mostram o preço correto. Usar para testes de regressão visual e de asserção de preço/inconsistência.

---

## Mensagens de erro da LojaQA

As mensagens de erro aparecem no elemento de texto de erro `#texto-erro` (`[data-test="texto-erro"]`), dentro do container `#container-erro`, que recebe a classe `.visible` quando visível. Use estes textos exatos para asserções.

Mensagens de erro do Login da LojaQA (todas começam com "Ops! "):
- Usuário em branco: "Ops! O campo usuário é obrigatório".
- Senha em branco: "Ops! O campo senha é obrigatório".
- Usuário/senha incorretos: "Ops! Usuário e senha não conferem com nenhum usuário cadastrado".
- Usuário bloqueado (usuario_bloqueado): "Ops! Desculpe, este usuário foi bloqueado.".
- Acesso a página interna sem estar logado: "Ops! Você precisa estar logado para acessar esta página.".

Mensagens de erro do Checkout Etapa 1 da LojaQA (todas começam com "Erro: "):
- Nome em branco: "Erro: O nome é obrigatório".
- Sobrenome em branco: "Erro: O sobrenome é obrigatório".
- CEP em branco: "Erro: O CEP é obrigatório".

Mensagens de `alert` do usuario_erro — disparadas ao trocar a ordenação em `#seletor-ordenacao` e ao clicar em `#botao-finalizar` (Finalizar Pedido):
- Ordenação quebrada: "Ops! A ordenação está quebrada para este usuário. Defeito proposital para testes.".
- Falha ao finalizar: "Ops! Não foi possível finalizar o pedido. Defeito proposital para testes.".

---

## Classes CSS de estado (dinâmicas) da LojaQA

Estas classes e atributos mudam durante a execução e são úteis para asserções de estado e visibilidade:
- Classe `.open`: aplicada em `#menu-lateral` e `#sobreposicao-menu` quando o menu lateral está aberto.
- Classe `.visible`: aplicada em `#container-erro` quando a mensagem de erro está sendo exibida.
- Classe `.input_error`: aplicada nos campos `.form_input` quando há erro de validação (borda vermelha).
- Atributo `hidden`: aplicado em `#carrinho-vazio`, `#item-nao-encontrado`, `#nota-fiscal`, `#pedido-nao-encontrado` e nos wrappers do detalhe quando o elemento está oculto condicionalmente.
- Classe `.btn_inventory` (fora do carrinho) que alterna para `.btn_secondary` (dentro do carrinho): nos botões Adicionar/Remover.
- Atributo `disabled`: aplicado em `#botao-entrar` durante o atraso do usuario_lento.
- Classe `.bugs-visuais`: aplicada no `body` quando o usuário logado é `usuario_visual`, ativando os defeitos visuais propositais.

## Classes CSS de botões (estáticas) da LojaQA

- `.btn`: classe base de todos os botões (formato pílula/arredondado).
- `.btn_action`: botão de ação principal, azul preenchido (Entrar, Finalizar Compra, Continuar, Finalizar Pedido, Gerar Nota Fiscal, Baixar PDF).
- `.btn_secondary`: botão secundário com borda vermelha (Cancelar, Continuar Comprando, Remover, Voltar à Loja, Voltar).
- `.btn_inventory`: botão de largura total (Adicionar ao carrinho).
- `.btn_small`: botão com padding reduzido.
- `.btn_back`: botão de voltar na página de detalhe do produto.
- `.btn_complete`: botão de largura limitada, usado na página de pedido concluído.

---

## Textos visíveis da LojaQA (para seletores por texto)

Textos exatos exibidos na LojaQA, úteis para localizar elementos por texto (`getByText`, `cy.contains`, XPath `text()`):
- Títulos de página (no elemento `#titulo-pagina`): "Produtos", "Seu Carrinho", "Pagamento: Seus Dados", "Pagamento: Resumo", "Pedido Concluído!", "Sobre a LojaQA".
- Banner de boas-vindas: "Bem-vindo à LojaQA!".
- Botões de carrinho: "Adicionar ao carrinho" (fora do carrinho) e "Remover" (no carrinho).
- Botões de ação: "Entrar", "Continuar Comprando", "Finalizar Compra", "Cancelar", "Continuar", "Finalizar Pedido", "Voltar à Loja", "← Voltar aos produtos", "Gerar Nota Fiscal (PDF)", "Baixar PDF", "Voltar".
- Itens do menu lateral: "Todos os Produtos", "Sobre", "Sair", "Resetar Aplicação".
- Página de conclusão: "Obrigado pelo seu pedido!".
- Nota fiscal: "NOTA FISCAL", "SEM VALOR FISCAL", "Destinatário".
- Estados vazios: "Seu carrinho está vazio.", "ITEM NÃO ENCONTRADO — Este produto não existe.", "Nenhum pedido encontrado. Finalize uma compra para gerar a nota fiscal.".

---

## Seletores dos botões de carrinho, por produto, na LojaQA

A LojaQA tem 21 produtos. Cada produto tem um botão de carrinho próprio, com `id` e `data-test` únicos e fixos — basta copiar o seletor da lista abaixo e usar direto no teste. O `id` do botão nunca muda; o `data-test` alterna conforme o estado: começa como `adicionar-carrinho-...` (produto fora do carrinho, texto "Adicionar ao carrinho", classe `.btn_inventory`) e vira `remover-...` depois de adicionado (texto "Remover", classe `.btn_secondary`).

- **Mochila do Testador** — preço R$ 149,90, página de detalhe `inventory-item.html?id=4`. Botão de adicionar ao carrinho: `[data-test="adicionar-carrinho-mochila-do-testador"]`. Botão de remover do carrinho: `[data-test="remover-mochila-do-testador"]`. Id do botão (não muda com o estado): `#botao-carrinho-mochila-do-testador`.
- **Lanterna de Bike LED** — preço R$ 49,90, página de detalhe `inventory-item.html?id=0`. Botão de adicionar ao carrinho: `[data-test="adicionar-carrinho-lanterna-de-bike-led"]`. Botão de remover do carrinho: `[data-test="remover-lanterna-de-bike-led"]`. Id do botão (não muda com o estado): `#botao-carrinho-lanterna-de-bike-led`.
- **Camiseta Caça-Bugs** — preço R$ 79,90, página de detalhe `inventory-item.html?id=1`. Botão de adicionar ao carrinho: `[data-test="adicionar-carrinho-camiseta-caca-bugs"]`. Botão de remover do carrinho: `[data-test="remover-camiseta-caca-bugs"]`. Id do botão (não muda com o estado): `#botao-carrinho-camiseta-caca-bugs`.
- **Jaqueta Fleece QA** — preço R$ 249,90, página de detalhe `inventory-item.html?id=5`. Botão de adicionar ao carrinho: `[data-test="adicionar-carrinho-jaqueta-fleece-qa"]`. Botão de remover do carrinho: `[data-test="remover-jaqueta-fleece-qa"]`. Id do botão (não muda com o estado): `#botao-carrinho-jaqueta-fleece-qa`.
- **Body do Testadorzinho** — preço R$ 39,90, página de detalhe `inventory-item.html?id=2`. Botão de adicionar ao carrinho: `[data-test="adicionar-carrinho-body-do-testadorzinho"]`. Botão de remover do carrinho: `[data-test="remover-body-do-testadorzinho"]`. Id do botão (não muda com o estado): `#botao-carrinho-body-do-testadorzinho`.
- **Camiseta Teste.Tudo() Salmão** — preço R$ 79,90, página de detalhe `inventory-item.html?id=3`. Botão de adicionar ao carrinho: `[data-test="adicionar-carrinho-camiseta-teste-tudo-salmao"]`. Botão de remover do carrinho: `[data-test="remover-camiseta-teste-tudo-salmao"]`. Id do botão (não muda com o estado): `#botao-carrinho-camiseta-teste-tudo-salmao`.
- **Caneca do Depurador** — preço R$ 34,90, página de detalhe `inventory-item.html?id=6`. Botão de adicionar ao carrinho: `[data-test="adicionar-carrinho-caneca-do-depurador"]`. Botão de remover do carrinho: `[data-test="remover-caneca-do-depurador"]`. Id do botão (não muda com o estado): `#botao-carrinho-caneca-do-depurador`.
- **Teclado Mecânico TesteMaster** — preço R$ 349,90, página de detalhe `inventory-item.html?id=7`. Botão de adicionar ao carrinho: `[data-test="adicionar-carrinho-teclado-mecanico-testemaster"]`. Botão de remover do carrinho: `[data-test="remover-teclado-mecanico-testemaster"]`. Id do botão (não muda com o estado): `#botao-carrinho-teclado-mecanico-testemaster`.
- **Mouse Sem Fio ClickCerto** — preço R$ 89,90, página de detalhe `inventory-item.html?id=8`. Botão de adicionar ao carrinho: `[data-test="adicionar-carrinho-mouse-sem-fio-clickcerto"]`. Botão de remover do carrinho: `[data-test="remover-mouse-sem-fio-clickcerto"]`. Id do botão (não muda com o estado): `#botao-carrinho-mouse-sem-fio-clickcerto`.
- **Fone Anti-Ruído FocoTotal** — preço R$ 199,90, página de detalhe `inventory-item.html?id=9`. Botão de adicionar ao carrinho: `[data-test="adicionar-carrinho-fone-anti-ruido-focototal"]`. Botão de remover do carrinho: `[data-test="remover-fone-anti-ruido-focototal"]`. Id do botão (não muda com o estado): `#botao-carrinho-fone-anti-ruido-focototal`.
- **Boné Automatize Tudo** — preço R$ 59,90, página de detalhe `inventory-item.html?id=10`. Botão de adicionar ao carrinho: `[data-test="adicionar-carrinho-bone-automatize-tudo"]`. Botão de remover do carrinho: `[data-test="remover-bone-automatize-tudo"]`. Id do botão (não muda com o estado): `#botao-carrinho-bone-automatize-tudo`.
- **Moletom Deploy na Sexta** — preço R$ 189,90, página de detalhe `inventory-item.html?id=11`. Botão de adicionar ao carrinho: `[data-test="adicionar-carrinho-moletom-deploy-na-sexta"]`. Botão de remover do carrinho: `[data-test="remover-moletom-deploy-na-sexta"]`. Id do botão (não muda com o estado): `#botao-carrinho-moletom-deploy-na-sexta`.
- **Garrafa Térmica CaféContínuo** — preço R$ 69,90, página de detalhe `inventory-item.html?id=12`. Botão de adicionar ao carrinho: `[data-test="adicionar-carrinho-garrafa-termica-cafecontinuo"]`. Botão de remover do carrinho: `[data-test="remover-garrafa-termica-cafecontinuo"]`. Id do botão (não muda com o estado): `#botao-carrinho-garrafa-termica-cafecontinuo`.
- **Pacote de Adesivos de Bugs** — preço R$ 19,90, página de detalhe `inventory-item.html?id=13`. Botão de adicionar ao carrinho: `[data-test="adicionar-carrinho-pacote-de-adesivos-de-bugs"]`. Botão de remover do carrinho: `[data-test="remover-pacote-de-adesivos-de-bugs"]`. Id do botão (não muda com o estado): `#botao-carrinho-pacote-de-adesivos-de-bugs`.
- **Caderno de Casos de Teste** — preço R$ 29,90, página de detalhe `inventory-item.html?id=14`. Botão de adicionar ao carrinho: `[data-test="adicionar-carrinho-caderno-de-casos-de-teste"]`. Botão de remover do carrinho: `[data-test="remover-caderno-de-casos-de-teste"]`. Id do botão (não muda com o estado): `#botao-carrinho-caderno-de-casos-de-teste`.
- **Luminária PixelPerfect** — preço R$ 119,90, página de detalhe `inventory-item.html?id=15`. Botão de adicionar ao carrinho: `[data-test="adicionar-carrinho-luminaria-pixelperfect"]`. Botão de remover do carrinho: `[data-test="remover-luminaria-pixelperfect"]`. Id do botão (não muda com o estado): `#botao-carrinho-luminaria-pixelperfect`.
- **Mousepad Gigante DevOps** — preço R$ 49,90, página de detalhe `inventory-item.html?id=16`. Botão de adicionar ao carrinho: `[data-test="adicionar-carrinho-mousepad-gigante-devops"]`. Botão de remover do carrinho: `[data-test="remover-mousepad-gigante-devops"]`. Id do botão (não muda com o estado): `#botao-carrinho-mousepad-gigante-devops`.
- **Webcam Full HD VisãoQA** — preço R$ 159,90, página de detalhe `inventory-item.html?id=17`. Botão de adicionar ao carrinho: `[data-test="adicionar-carrinho-webcam-full-hd-visaoqa"]`. Botão de remover do carrinho: `[data-test="remover-webcam-full-hd-visaoqa"]`. Id do botão (não muda com o estado): `#botao-carrinho-webcam-full-hd-visaoqa`.
- **Suporte de Notebook ErgoTeste** — preço R$ 99,90, página de detalhe `inventory-item.html?id=18`. Botão de adicionar ao carrinho: `[data-test="adicionar-carrinho-suporte-de-notebook-ergoteste"]`. Botão de remover do carrinho: `[data-test="remover-suporte-de-notebook-ergoteste"]`. Id do botão (não muda com o estado): `#botao-carrinho-suporte-de-notebook-ergoteste`.
- **Pelúcia do Bug** — preço R$ 44,90, página de detalhe `inventory-item.html?id=19`. Botão de adicionar ao carrinho: `[data-test="adicionar-carrinho-pelucia-do-bug"]`. Botão de remover do carrinho: `[data-test="remover-pelucia-do-bug"]`. Id do botão (não muda com o estado): `#botao-carrinho-pelucia-do-bug`.
- **Quebra-Cabeça 404 Peças** — preço R$ 54,90, página de detalhe `inventory-item.html?id=20`. Botão de adicionar ao carrinho: `[data-test="adicionar-carrinho-quebra-cabeca-404-pecas"]`. Botão de remover do carrinho: `[data-test="remover-quebra-cabeca-404-pecas"]`. Id do botão (não muda com o estado): `#botao-carrinho-quebra-cabeca-404-pecas`.

Exemplo em Cypress para adicionar a Mochila do Testador ao carrinho e depois removê-la: `cy.get('[data-test="adicionar-carrinho-mochila-do-testador"]').click()` e em seguida `cy.get('[data-test="remover-mochila-do-testador"]').click()`.
---

## Templates internos da LojaQA (não interagíveis)

A LojaQA usa elementos `<template>` que o JavaScript clona para gerar conteúdo dinâmico. Eles NÃO são alvos de automação (são inertes e invisíveis), listados só para referência:
- `#modelo-item-produto` na página `index.html`: gera os cards da lista de produtos.
- `#modelo-item-carrinho` na página `cart.html`: gera as linhas do carrinho.
- `#modelo-item-resumo` na página `checkout-step-two.html`: gera as linhas do resumo do pedido.
- `#modelo-linha-item` na página `nota-fiscal.html`: gera as linhas da tabela da nota fiscal.

---

## Armazenamento (setup e teardown de testes) da LojaQA

A LojaQA guarda estado no navegador. Para preparar ou limpar o estado de um teste sem passar pela interface, manipule estas chaves:
- Chave `session-username` no `sessionStorage`: guarda o username logado, por exemplo "usuario_padrao". Definir esta chave equivale a estar logado.
- Chave `cart-contents` no `localStorage`: guarda um array JSON com os ids dos produtos no carrinho, por exemplo `[4,0]`.
- Chave `checkout-info` no `sessionStorage`: guarda um JSON `{first, last, postal}` preenchido na etapa 1 do checkout; é removido ao finalizar o pedido.
- Chave `ultimo-pedido` no `sessionStorage`: guarda um JSON do pedido finalizado com `{numero, data, hora, cliente, itens, subtotal, imposto, total}`, usado pela página de conclusão e pela nota fiscal.

Exemplo para iniciar um teste já logado e com um item no carrinho: definir `sessionStorage["session-username"] = "usuario_padrao"` e `localStorage["cart-contents"] = "[4]"`, depois navegar para `index.html`.

---

## Perguntas frequentes sobre a automação da LojaQA (FAQ)

Perguntas comuns e respostas diretas para localizar seletores e comportamentos na LojaQA:

- **Qual é a página inicial (home) da LojaQA?** É `index.html`, a página de Produtos/catálogo, exibida logo após o login. A tela de login (`login.html`) é apenas a porta de entrada, exibida enquanto não há sessão ativa.
- **Para onde o usuário vai depois do login?** Para `index.html` (a home / lista de produtos).
- **Como voltar para a home/página inicial durante um teste?** Clicar no logotipo "🧪 LojaQA" do cabeçalho (`#link-logo`), ou abrir o menu (`#botao-menu`) e clicar em "Todos os Produtos" (`#link-todos-itens`), ou navegar direto para `index.html`.
- **O logotipo da LojaQA é clicável?** Sim — no cabeçalho ele é um link (`#link-logo`, `[data-test="link-logo"]`) que leva para a home `index.html`. Na tela de login o logotipo é apenas texto (classe `.login_logo`), sem link.
- **Como fazer login na LojaQA?** Preencher `#campo-usuario` com um usuário válido (ex.: `usuario_padrao`), preencher `#campo-senha` com `senha_teste_123` e clicar em `#botao-entrar`.
- **Como deslogar (sair) da LojaQA?** Abrir o menu em `#botao-menu` e clicar em "Sair" (`#link-sair`) — sair é a mesma coisa que deslogar.
- **Qual é a senha dos usuários da LojaQA?** `senha_teste_123`, para todos os 6 usuários.
- **Quais são os usuários da LojaQA?** `usuario_padrao`, `usuario_bloqueado`, `usuario_problema`, `usuario_lento`, `usuario_erro` e `usuario_visual`.
- **Qual usuário usar para o teste de compra bem-sucedida (caminho feliz)?** `usuario_padrao`.
- **Qual o seletor do botão de adicionar um produto ao carrinho?** Cada produto tem o seu, no padrão `[data-test="adicionar-carrinho-<nome-do-produto-em-kebab-case>"]` (id `#botao-carrinho-<nome-kebab>`); a lista completa está na seção "Seletores dos botões de carrinho, por produto, na LojaQA". Ex.: a Caneca do Depurador usa `[data-test="adicionar-carrinho-caneca-do-depurador"]` (ou o id `#botao-carrinho-caneca-do-depurador`).
- **Qual o seletor do botão de remover um produto do carrinho?** O mesmo botão, com o data-test trocado para remover. Ex.: `[data-test="remover-caneca-do-depurador"]`; o id continua `#botao-carrinho-caneca-do-depurador`.
- **Como ir para o carrinho?** Clicar no ícone do carrinho no topo: `#link-carrinho`.
- **Como verificar quantos itens há no carrinho?** Ler o texto do badge `#badge-carrinho`; ele fica oculto quando o carrinho está vazio.
- **Como finalizar a compra na LojaQA?** No carrinho, clicar em `#botao-finalizar-compra`; preencher `#campo-nome`, `#campo-sobrenome` e `#campo-cep` e clicar em `#botao-continuar`; na etapa de resumo, clicar em `#botao-finalizar`.
- **Como ordenar os produtos?** Usar o `<select>` `#seletor-ordenacao`: `az` e `za` ordenam por nome (ordem alfabética crescente e decrescente); `lohi` e `hilo` ordenam por preço (crescente e decrescente).
- **Onde aparece a mensagem de erro do login?** No elemento `#texto-erro`, dentro de `#container-erro` (que fica visível com a classe `.visible`).
- **Qual usuário faz o login falhar/ser bloqueado?** `usuario_bloqueado` — mostra "Ops! Desculpe, este usuário foi bloqueado.".
- **Qual usuário deixa as imagens quebradas?** `usuario_problema` (imagens viram `../img/broken.svg`).
- **Qual usuário deixa o login lento?** `usuario_lento` (~5s de atraso; `#botao-entrar` fica `disabled` com texto "Carregando...").
- **Qual usuário provoca erros nas ações?** `usuario_erro` (ordenação, adicionar itens de id ímpar e finalizar pedido falham, alguns com `alert`).
- **Qual usuário provoca defeitos visuais?** `usuario_visual` (o `body` recebe `.bugs-visuais`; há preços errados na vitrine para ids 0, 5, 10, 15 e 20).
- **Como gerar/baixar a nota fiscal em PDF?** Após finalizar o pedido, na página de conclusão clicar em `#botao-nota-fiscal`; na página da nota, clicar em `#botao-baixar-pdf`. O arquivo `nota-fiscal-<numero-do-pedido>.pdf` é baixado direto.
- **Como validar o download do PDF no Cypress?** Clicar em `#botao-baixar-pdf` e ler o arquivo na pasta de downloads, por exemplo `cy.readFile('cypress/downloads/nota-fiscal-4821.pdf')`.
- **Como preparar o estado do teste sem passar pela UI?** Definir `session-username` no `sessionStorage` (ex.: `"usuario_padrao"` — equivale a estar logado) e `cart-contents` no `localStorage` (ex.: `"[4]"` — array JSON de ids), depois navegar para `index.html`.
- **Qual a taxa de imposto do checkout?** 8% sobre o subtotal.
