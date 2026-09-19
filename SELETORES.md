# Mapa de Seletores

Referência **completa** dos seletores da aplicação para automação de testes: `id`, `data-test`, tag, classes CSS, atributos, textos visíveis e estados.

**Convenções:**
- Todos os seletores são exibidos **prontos para uso**: `#id`, `.classe` e `[data-test="..."]` — basta copiar e colar no seu framework.
- Todas as interações principais possuem `id` e `data-test`. Em geral compartilham o mesmo nome; as exceções estão indicadas.
- Seletores marcados como **dinâmico** são gerados por produto ou mudam conforme o estado.
- A coluna **`class`** lista as classes CSS do elemento, utilizáveis como seletor alternativo.

---

## Elementos globais (todas as páginas, exceto Login e Nota Fiscal)

### Cabeçalho

| Elemento | Tag | `id` | `data-test` | `class` | Atributos / Texto |
|---|---|---|---|---|---|
| Barra superior | `div` | — | — | `.primary_header` | — |
| Agrupador menu + logo | `div` | — | — | `.header_label` | — |
| Botão abrir menu (☰) | `button` | `#botao-menu` | `[data-test="botao-menu"]` | `.bm-burger-button` | `aria-label="Abrir Menu"` |
| Logo (link para a home) | `a` | `#link-logo` | `[data-test="link-logo"]` | `.app_logo` | `href="index.html"`, texto: "🧪 LojaQA" |
| Container do carrinho | `div` | — | — | `.shopping_cart_container` | — |
| Link do carrinho (🛒) | `a` | `#link-carrinho` | `[data-test="link-carrinho"]` | `.shopping_cart_link` | `href="cart.html"` |
| Badge de contagem | `span` | `#badge-carrinho` | `[data-test="badge-carrinho"]` | `.shopping_cart_badge` | oculto via `style` quando carrinho vazio; texto = nº de itens |
| Barra secundária | `div` | — | — | `.header_secondary_container` | — |
| Título da página | `span` | `#titulo-pagina` | `[data-test="titulo-pagina"]` | `.title` | textos por página (ver seção Textos) |

### Menu lateral

| Elemento | Tag | `id` | `data-test` | `class` | Atributos / Ação |
|---|---|---|---|---|---|
| Container do menu | `nav` | `#menu-lateral` | `[data-test="menu-lateral"]` | `.bm-menu` (+ `.open` quando aberto) | — |
| Botão fechar (×) | `button` | `#botao-fechar-menu` | `[data-test="botao-fechar-menu"]` | `.bm-cross-button` | `aria-label="Fechar Menu"` |
| Todos os Produtos | `a` | `#link-todos-itens` | `[data-test="link-todos-itens"]` | — | `href="index.html"` — volta para a página inicial (home) |
| Sobre | `a` | `#link-sobre` | `[data-test="link-sobre"]` | — | `href="sobre.html"` — página sobre o projeto/TCC |
| Sair (= deslogar) | `a` | `#link-sair` | `[data-test="link-sair"]` | — | `href="#"` — encerra sessão → `login.html` |
| Resetar Aplicação | `a` | `#link-resetar` | `[data-test="link-resetar"]` | — | `href="#"` — limpa o carrinho |
| Overlay (fundo escuro) | `div` | `#sobreposicao-menu` | — | `.bm-overlay` (+ `.open` quando visível) | clique fecha o menu |

### Rodapé

| Elemento | Tag | `id` | `data-test` | `class` | Atributos / Texto |
|---|---|---|---|---|---|
| Rodapé | `footer` | `#rodape` | `[data-test="rodape"]` | `.footer` | — |
| Lista de redes sociais | `ul` | — | — | `.social` | — |
| Link GitHub | `a` | — | `[data-test="rede-github"]` | — | `href="https://github.com/paulovarrone"`, `target="_blank"`, texto: "GitHub" |
| Link LinkedIn | `a` | — | `[data-test="rede-linkedin"]` | — | `href="https://www.linkedin.com/in/paulovarrone"`, `target="_blank"`, texto: "LinkedIn" |
| Texto de copyright | `div` | — | `[data-test="texto-rodape"]` | `.footer_copy` | "© 2026 LojaQA — Projeto educacional..." |

---

## Login — `login.html`

Tela de entrada da aplicação (exibida enquanto não há sessão ativa). Após o login o usuário vai para a página inicial da loja, `index.html`.

| Elemento | Tag | `id` | `data-test` | `class` | Atributos / Texto |
|---|---|---|---|---|---|
| Container da página | `div` | — | — | `.login_container` | — |
| Logo | `div` | — | — | `.login_logo` | texto: "🧪 LojaQA" |
| Tagline | `p` | — | — | `.login_tagline` | "Sua loja para praticar automação de testes" |
| Wrapper do formulário | `div` | — | — | `.login_wrapper` | — |
| Formulário | `form` | `#form-login` | `[data-test="form-login"]` | `.login-box` | `novalidate` |
| Campo de usuário | `input` | `#campo-usuario` | `[data-test="campo-usuario"]` | `.form_input` (+ `.input_error` em erro) | `type="text"`, `placeholder="Usuário"`, `autocomplete="username"`, `autofocus` |
| Campo de senha | `input` | `#campo-senha` | `[data-test="campo-senha"]` | `.form_input` (+ `.input_error` em erro) | `type="password"`, `placeholder="Senha"`, `autocomplete="current-password"` |
| Botão de login | `input` | `#botao-entrar` | `[data-test="botao-entrar"]` | `.btn`, `.btn_action` | `type="submit"`, `value="Entrar"` (vira "Carregando..." no usuario_lento) |
| Container de erro | `div` | `#container-erro` | `[data-test="container-erro"]` | `.error-message-container` (+ `.visible` quando exibido) | — |
| Texto do erro | `span` | `#texto-erro` | `[data-test="texto-erro"]` | — | ver seção Mensagens de erro |
| Botão fechar erro (×) | `button` | `#botao-fechar-erro` | `[data-test="botao-fechar-erro"]` | `.error-button` | `type="button"`, `aria-label="Fechar"` |
| Bloco de credenciais | `div` | — | — | `.login_credentials_wrap` | — |
| Lista de usuários aceitos | `div` | `#credenciais-login` | `[data-test="credenciais-login"]` | `.login_credentials` | contém os 6 usernames (`usuario_padrao`, `usuario_bloqueado`, `usuario_problema`, `usuario_lento`, `usuario_erro`, `usuario_visual`) |
| Senha dos usuários | `div` | `#senha-login` | `[data-test="senha-login"]` | `.login_password` | contém "senha_teste_123" |

---

## Produtos (página inicial / home) — `index.html`

Página principal da loja, exibida logo após o login bem-sucedido.

| Elemento | Tag | `id` | `data-test` | `class` | Atributos |
|---|---|---|---|---|---|
| Banner de boas-vindas | `section` | `#banner-boas-vindas` | `[data-test="banner-boas-vindas"]` | `.hero_banner` | contém h1 "Bem-vindo à LojaQA!" |
| Contador de produtos | `strong` | `#contador-produtos` | `[data-test="contador-produtos"]` | — | texto: "21" (preenchido via JS) |
| Container da página | `main` | `#container-inventario` | `[data-test="container-inventario"]` | `.inventory_container` | — |
| Lista de produtos | `div` | `#lista-produtos` | `[data-test="lista-produtos"]` | `.inventory_list` | preenchida via JS |
| Seletor de ordenação | `select` | `#seletor-ordenacao` | `[data-test="seletor-ordenacao"]` | `.product_sort_container` | 4 `option` (ver abaixo) |

**Opções do seletor de ordenação:**

| `value` | Texto visível | Ordena por | Sentido |
|---|---|---|---|
| `az` | Nome (A a Z) | nome (alfabética) | crescente |
| `za` | Nome (Z a A) | nome (alfabética) | decrescente |
| `lohi` | Preço (menor ao maior) | preço | crescente (mais barato primeiro) |
| `hilo` | Preço (maior ao menor) | preço | decrescente (mais caro primeiro) |

### Card de produto (dinâmico — um por produto)

| Elemento | Tag | `id` | `data-test` | `class` | Atributos |
|---|---|---|---|---|---|
| Card do produto | `div` | — | `[data-test="item-inventario"]` | `.inventory_item` | — |
| Link da imagem | `a` | — | — | `.inventory_item_img`, `.link-item` | `href="inventory-item.html?id=N"` |
| Imagem do produto | `img` | — | — | — | `src="../img/<produto>.svg"`, `alt` = nome do produto |
| Nome do produto (link) | `a` | — | `[data-test="nome-item"]` | `.inventory_item_name`, `.link-item` | `href="inventory-item.html?id=N"` |
| Descrição | `div` | — | `[data-test="descricao-item"]` | `.inventory_item_desc` | — |
| Barra de preço | `div` | — | — | `.pricebar` | — |
| Preço | `div` | — | `[data-test="preco-item"]` | `.inventory_item_price` | formato `R$ X,XX` |
| Botão Adicionar/Remover | `button` | um por produto, estável (ver [Botões de carrinho por produto](#botões-de-carrinho-por-produto)) | alterna entre `adicionar-carrinho-…` e `remover-…` do produto | `.btn`, `.btn_small` + `.btn_inventory` (fora) ⇄ `.btn_secondary` (no carrinho) | texto: "Adicionar ao carrinho" ⇄ "Remover" |

> **Usuário `usuario_problema`:** todas as imagens carregam `../img/broken.svg` em vez da imagem real.

---

## Detalhe do produto — `inventory-item.html?id=N`

| Elemento | Tag | `id` | `data-test` | `class` | Atributos / Texto |
|---|---|---|---|---|---|
| Container da página | `main` | `#detalhes-produto` | `[data-test="detalhes-produto"]` | `.inventory_details` | — |
| Voltar aos produtos | `a` | `#link-voltar-produtos` | `[data-test="voltar-produtos"]` | `.btn`, `.btn_small`, `.btn_back` | `href="index.html"`, texto: "← Voltar aos produtos" |
| Wrapper da imagem | `div` | — | — | `.inventory_details_img` | `hidden` quando item não existe |
| Imagem do produto | `img` | `#imagem-item` | `[data-test="imagem-item"]` | — | `alt` = nome do produto |
| Wrapper da descrição | `div` | — | — | `.inventory_details_desc_container` | `hidden` quando item não existe |
| Nome do produto | `div` | — | `[data-test="nome-item"]` | `.inventory_details_name` | — |
| Descrição | `div` | — | `[data-test="descricao-item"]` | `.inventory_item_desc` | — |
| Preço | `div` | — | `[data-test="preco-item"]` | `.inventory_details_price` | formato `R$ X,XX` |
| Botão Adicionar/Remover | `button` | `#botao-carrinho` (fixo — só há um produto na tela) | do produto aberto: alterna entre `adicionar-carrinho-…` e `remover-…` (ver [Botões de carrinho por produto](#botões-de-carrinho-por-produto)) | `.btn`, `.btn_small` + `.btn_inventory` ⇄ `.btn_secondary` | texto: "Adicionar ao carrinho" ⇄ "Remover" |
| Item não encontrado | `p` | `#item-nao-encontrado` | `[data-test="item-nao-encontrado"]` | — | `hidden` quando há produto; texto: "ITEM NÃO ENCONTRADO — Este produto não existe." |

---

## Carrinho — `cart.html`

| Elemento | Tag | `id` | `data-test` | `class` | Atributos / Texto |
|---|---|---|---|---|---|
| Container da página | `main` | `#container-carrinho` | `[data-test="container-carrinho"]` | `.cart_contents_container` | — |
| Rótulo "QTD" | `span` | — | `[data-test="rotulo-quantidade"]` | `.cart_quantity_label` | — |
| Rótulo "Descrição" | `span` | — | `[data-test="rotulo-descricao"]` | `.cart_desc_label` | — |
| Carrinho vazio | `p` | `#carrinho-vazio` | `[data-test="carrinho-vazio"]` | `.cart_empty` | `hidden` quando há itens; texto: "Seu carrinho está vazio." |
| Lista de itens | `div` | `#lista-carrinho` | `[data-test="lista-carrinho"]` | `.cart_list` | preenchida via JS |
| Rodapé de ações | `div` | — | — | `.cart_footer` | — |
| Continuar Comprando | `a` | `#botao-continuar-comprando` | `[data-test="continuar-comprando"]` | `.btn`, `.btn_secondary` | `href="index.html"` |
| Finalizar Compra | `a` | `#botao-finalizar-compra` | `[data-test="finalizar-compra"]` | `.btn`, `.btn_action` | `href="checkout-step-one.html"` |

### Item do carrinho (dinâmico — um por item)

| Elemento | Tag | `id` | `data-test` | `class` | Atributos / Texto |
|---|---|---|---|---|---|
| Linha do item | `div` | — | `[data-test="item-carrinho"]` | `.cart_item` | — |
| Quantidade | `div` | — | `[data-test="quantidade-item"]` | `.cart_quantity` | texto: "1" |
| Wrapper do conteúdo | `div` | — | — | `.cart_item_label` | — |
| Nome (link) | `a` | — | `[data-test="nome-item"]` | `.inventory_item_name` | `href="inventory-item.html?id=N"` |
| Descrição | `div` | — | `[data-test="descricao-item"]` | `.inventory_item_desc` | — |
| Barra de preço | `div` | — | — | `.item_pricebar` | — |
| Preço | `div` | — | `[data-test="preco-item"]` | `.inventory_item_price` | formato `R$ X,XX` |
| Botão Remover | `button` | um por produto (ver [Botões de carrinho por produto](#botões-de-carrinho-por-produto)) | `remover-…` do produto, ex.: `[data-test="remover-caneca-do-depurador"]` | `.btn`, `.btn_small`, `.btn_secondary` | texto: "Remover" |

---

## Checkout: dados — `checkout-step-one.html`

| Elemento | Tag | `id` | `data-test` | `class` | Atributos |
|---|---|---|---|---|---|
| Container da página | `main` | `#container-checkout-dados` | `[data-test="container-checkout-dados"]` | `.checkout_container` | — |
| Formulário | `form` | `#form-checkout` | `[data-test="form-checkout"]` | `.checkout_info` | `novalidate` |
| Nome | `input` | `#campo-nome` | `[data-test="campo-nome"]` | `.form_input` (+ `.input_error` em erro) | `type="text"`, `placeholder="Nome"`, `autofocus` |
| Sobrenome | `input` | `#campo-sobrenome` | `[data-test="campo-sobrenome"]` | `.form_input` (+ `.input_error` em erro) | `type="text"`, `placeholder="Sobrenome"` |
| CEP | `input` | `#campo-cep` | `[data-test="campo-cep"]` | `.form_input` (+ `.input_error` em erro) | `type="text"`, `placeholder="CEP"` |
| Container de erro | `div` | `#container-erro` | `[data-test="container-erro"]` | `.error-message-container` (+ `.visible`) | — |
| Texto do erro | `span` | `#texto-erro` | `[data-test="texto-erro"]` | — | ver seção Mensagens de erro |
| Botão fechar erro (×) | `button` | `#botao-fechar-erro` | `[data-test="botao-fechar-erro"]` | `.error-button` | `type="button"`, `aria-label="Fechar"` |
| Cancelar | `a` | `#botao-cancelar` | `[data-test="botao-cancelar"]` | `.btn`, `.btn_secondary` | `href="cart.html"` |
| Continuar | `input` | `#botao-continuar` | `[data-test="botao-continuar"]` | `.btn`, `.btn_action` | `type="submit"`, `value="Continuar"` |

---

## Checkout: resumo — `checkout-step-two.html`

| Elemento | Tag | `id` | `data-test` | `class` | Texto |
|---|---|---|---|---|---|
| Container da página | `main` | `#container-checkout-resumo` | `[data-test="container-checkout-resumo"]` | `.checkout_container` | — |
| Rótulo "QTD" | `span` | — | `[data-test="rotulo-quantidade"]` | `.cart_quantity_label` | — |
| Rótulo "Descrição" | `span` | — | `[data-test="rotulo-descricao"]` | `.cart_desc_label` | — |
| Lista de itens | `div` | `#lista-resumo` | `[data-test="lista-resumo"]` | `.cart_list` | preenchida via JS |
| Bloco de resumo | `div` | `#info-resumo` | `[data-test="info-resumo"]` | `.summary_info` | — |
| Rótulo pagamento | `div` | — | `[data-test="rotulo-pagamento"]` | `.summary_info_label` | "Forma de Pagamento:" |
| Valor pagamento | `div` | — | `[data-test="valor-pagamento"]` | `.summary_value_label` | "CartãoQA #31337" |
| Rótulo entrega | `div` | — | `[data-test="rotulo-entrega"]` | `.summary_info_label` | "Entrega:" |
| Valor entrega | `div` | — | `[data-test="valor-entrega"]` | `.summary_value_label` | "Entrega Expressa Grátis!" |
| Rótulo total | `div` | — | `[data-test="rotulo-total"]` | `.summary_info_label` | "Resumo de Valores" |
| Subtotal | `div` | `#valor-subtotal` | `[data-test="valor-subtotal"]` | `.summary_subtotal_label` | "Subtotal: R$ X,XX" |
| Impostos (8%) | `div` | `#valor-imposto` | `[data-test="valor-imposto"]` | `.summary_tax_label` | "Impostos (8%): R$ X,XX" |
| Total | `div` | `#valor-total` | `[data-test="valor-total"]` | `.summary_total_label` | "Total: R$ X,XX" |
| Rodapé de ações | `div` | — | — | `.cart_footer` | — |
| Cancelar | `a` | `#botao-cancelar` | `[data-test="botao-cancelar"]` | `.btn`, `.btn_secondary` | `href="index.html"` |
| Finalizar Pedido | `button` | `#botao-finalizar` | `[data-test="botao-finalizar"]` | `.btn`, `.btn_action` | registra o pedido, limpa o carrinho → `checkout-complete.html` |

Os itens da lista usam os mesmos seletores do carrinho (`[data-test="item-carrinho"]`, `[data-test="quantidade-item"]`, `[data-test="nome-item"]`, `[data-test="descricao-item"]`, `[data-test="preco-item"]`), porém **sem** botão Remover.

---

## Pedido concluído — `checkout-complete.html`

| Elemento | Tag | `id` | `data-test` | `class` | Atributos / Texto |
|---|---|---|---|---|---|
| Container da página | `main` | `#container-pedido-concluido` | `[data-test="container-pedido-concluido"]` | `.checkout_complete_container` | — |
| Imagem de confirmação (✓) | `img` | `#imagem-confirmacao` | `[data-test="imagem-confirmacao"]` | `.pony_express` | `src="../img/pony-express.svg"`, `alt="Pedido confirmado"` |
| Título | `h2` | `#titulo-conclusao` | `[data-test="titulo-conclusao"]` | `.complete-header` | "Obrigado pelo seu pedido!" |
| Texto de confirmação | `div` | `#texto-conclusao` | `[data-test="texto-conclusao"]` | `.complete-text` | "Pedido #XXXXXXXX confirmado! Ele foi despachado..." |
| Número do pedido | `strong` | `#numero-pedido` | `[data-test="numero-pedido"]` | — | "#XXXXXXXX" (8 dígitos, preenchido via JS) |
| Gerar Nota Fiscal (PDF) | `a` | `#botao-nota-fiscal` | `[data-test="nota-fiscal"]` | `.btn`, `.btn_action`, `.btn_complete` | `href="nota-fiscal.html"` |
| Voltar à Loja | `a` | `#botao-voltar-inicio` | `[data-test="voltar-inicio"]` | `.btn`, `.btn_secondary`, `.btn_complete` | `href="index.html"` |

---

## Sobre — `sobre.html`

Página que explica o propósito do site (ambiente de testes para o TCC). Usa o cabeçalho/menu/rodapé globais.

| Elemento | Tag | `id` | `data-test` | `class` | Texto |
|---|---|---|---|---|---|
| Container da página | `main` | `#container-sobre` | `[data-test="container-sobre"]` | `.sobre_container` | — |
| Card "Por que este site existe?" | `section` | — | `[data-test="sobre-motivo"]` | `.sobre_card` | explica o propósito (TCC) |
| Card "O que dá para testar aqui" | `section` | — | `[data-test="sobre-recursos"]` | `.sobre_card` | lista de funcionalidades |
| Card "Tecnologias" | `section` | — | `[data-test="sobre-tecnologias"]` | `.sobre_card` | stack e autoria |

---

## Nota Fiscal — `nota-fiscal.html`

Página sem cabeçalho/menu (documento isolado). O botão "Baixar PDF" gera o arquivo e baixa direto, sem diálogo: o download é `nota-fiscal-<numero-do-pedido>.pdf`.

Como não há menu aqui, a única saída é o botão "Voltar" (`#botao-voltar`), que leva ao Pedido Concluído; de lá se volta ao início por "Voltar à Loja" (`#botao-voltar-inicio`) ou pelo menu.

| Elemento | Tag | `id` | `data-test` | `class` | Atributos / Texto |
|---|---|---|---|---|---|
| Corpo da página | `body` | — | — | `.nf_body` | fundo cinza |
| Container da página | `main` | `#container-nota-fiscal` | `[data-test="container-nota-fiscal"]` | `.nf_container` | — |
| Pedido não encontrado | `p` | `#pedido-nao-encontrado` | `[data-test="pedido-nao-encontrado"]` | — | `hidden` quando há pedido; texto: "Nenhum pedido encontrado..." |
| Documento da nota | `article` | `#nota-fiscal` | `[data-test="nota-fiscal"]` | `.nf_documento` | `hidden` quando não há pedido |
| Marca d'água | `div` | — | — | `.nf_marca_dagua` | "SEM VALOR FISCAL" |
| Cabeçalho da nota | `header` | — | — | `.nf_cabecalho` | — |
| Logo na nota | `div` | — | — | `.nf_logo` | texto: "🧪 LojaQA" |
| Dados do emitente | `div` | — | `[data-test="dados-emitente"]` | `.nf_empresa` | empresa fictícia + CNPJ 00.000.000/0001-00 |
| Bloco de identificação | `div` | — | — | `.nf_identificacao` | número + data de emissão |
| Título "NOTA FISCAL" | `div` | — | — | `.nf_titulo` | "NOTA FISCAL" |
| Subtítulo | `div` | — | — | `.nf_subtitulo` | "Documento fictício para prática de testes" |
| Número da nota | `strong` | `#numero-pedido` | `[data-test="numero-pedido"]` | — | 8 dígitos |
| Data de emissão | `span` | `#data-emissao` | `[data-test="data-emissao"]` | — | "DD/MM/AAAA HH:MM:SS" |
| Bloco do destinatário | `section` | — | `[data-test="dados-destinatario"]` | `.nf_destinatario` | — |
| Nome do cliente | `div` | `#cliente-nome` | `[data-test="cliente-nome"]` | — | nome + sobrenome do checkout |
| CEP do cliente | `div` | `#cliente-cep` | `[data-test="cliente-cep"]` | — | "CEP: XXXXX" |
| Tabela de itens | `table` | `#tabela-itens` | `[data-test="tabela-itens"]` | `.nf_tabela` | colunas: Item, Descrição, Qtd, Valor |
| Corpo da tabela | `tbody` | `#itens-nota` | `[data-test="itens-nota"]` | — | preenchido via JS |
| Bloco de totais | `section` | — | `[data-test="totais-nota"]` | `.nf_totais` | — |
| Subtotal | `div` | `#nota-subtotal` | `[data-test="nota-subtotal"]` | — | "Subtotal: R$ X,XX" |
| Impostos | `div` | `#nota-imposto` | `[data-test="nota-imposto"]` | — | "Impostos (8%): R$ X,XX" |
| Total | `div` | `#nota-total` | `[data-test="nota-total"]` | `.nf_total` | "Total: R$ X,XX" |
| Aviso legal | `p` | — | `[data-test="aviso-nota"]` | `.nf_aviso` | "Documento sem valor fiscal..." |
| Ações | `div` | — | — | `.nf_acoes` | — |
| Voltar | `a` | `#botao-voltar` | `[data-test="botao-voltar"]` | `.btn`, `.btn_secondary` | volta uma página para trás → `href="checkout-complete.html"` |
| Baixar PDF | `button` | `#botao-baixar-pdf` | `[data-test="baixar-pdf"]` | `.btn`, `.btn_action` | baixa `nota-fiscal-<numero>.pdf` direto (sem diálogo) |

### Linha de item da nota (dinâmica — uma por item)

| Elemento | Tag | `data-test` | Texto |
|---|---|---|---|
| Linha | `tr` | `[data-test="linha-item"]` | — |
| Número sequencial | `td` | `[data-test="linha-numero"]` | 1, 2, 3... |
| Descrição | `td` | `[data-test="linha-descricao"]` | nome do produto |
| Quantidade | `td` | `[data-test="linha-quantidade"]` | "1" |
| Valor | `td` | `[data-test="linha-valor"]` | "R$ X,XX" |

---

## `class` de estado (dinâmicas)

Valores de `class` e atributos que **mudam durante a execução** — úteis para asserções de visibilidade/estado:

| `class` / Atributo | Aplicada em | Significado |
|---|---|---|
| `.open` | `#menu-lateral`, `#sobreposicao-menu` | menu lateral aberto |
| `.visible` | `#container-erro` | mensagem de erro exibida |
| `.input_error` | campos `.form_input` | campo com erro de validação (borda vermelha) |
| `[hidden]` | `#carrinho-vazio`, `#item-nao-encontrado`, `#nota-fiscal`, `#pedido-nao-encontrado`, wrappers do detalhe | elemento oculto condicionalmente |
| `style="display:none"` ⇄ `inline-flex` | `#badge-carrinho` | badge oculto quando o carrinho está vazio |
| `.btn_inventory` ⇄ `.btn_secondary` | botões Adicionar/Remover | fora do carrinho ⇄ dentro do carrinho |
| `[disabled]` | `#botao-entrar` | durante o delay do `usuario_lento` |
| `.bugs-visuais` | `body` | adicionada quando o usuário logado é `usuario_visual` — ativa os defeitos visuais propositais |

## `class` de botões (estáticas)

| `class` | Estilo |
|---|---|
| `.btn` | base de todos os botões (formato pílula) |
| `.btn_action` | azul preenchido, destaque (Entrar, Finalizar Compra, Continuar, Finalizar Pedido, Gerar Nota Fiscal, Baixar PDF) |
| `.btn_secondary` | borda vermelha (Cancelar, Continuar Comprando, Remover, Voltar à Loja, Voltar) |
| `.btn_inventory` | largura total (Adicionar ao carrinho) |
| `.btn_small` | padding reduzido |
| `.btn_back` | botão de voltar (detalhe do produto) |
| `.btn_complete` | largura limitada (botões da página de conclusão) |

---

## Textos visíveis (para seletores por texto)

Úteis com `getByText` / `cy.contains` / XPath `text()`:

| Contexto | Texto |
|---|---|
| Títulos de página (`#titulo-pagina`) | "Produtos", "Seu Carrinho", "Pagamento: Seus Dados", "Pagamento: Resumo", "Pedido Concluído!", "Sobre a LojaQA" |
| Banner de boas-vindas | "Bem-vindo à LojaQA!" |
| Botões de carrinho | "Adicionar ao carrinho" ⇄ "Remover" |
| Ações | "Entrar", "Continuar Comprando", "Finalizar Compra", "Cancelar", "Continuar", "Finalizar Pedido", "Voltar à Loja", "← Voltar aos produtos", "Gerar Nota Fiscal (PDF)", "Baixar PDF", "Voltar" |
| Menu lateral | "Todos os Produtos", "Sobre", "Sair", "Resetar Aplicação" |
| Conclusão | "Obrigado pelo seu pedido!" |
| Nota fiscal | "NOTA FISCAL", "SEM VALOR FISCAL", "Destinatário" |
| Estados vazios | "Seu carrinho está vazio.", "ITEM NÃO ENCONTRADO — Este produto não existe.", "Nenhum pedido encontrado. Finalize uma compra para gerar a nota fiscal." |

## Mensagens de erro (`#texto-erro`)

### Login (prefixo "Ops! ")

| Cenário | Mensagem |
|---|---|
| Usuário vazio | `Ops! O campo usuário é obrigatório` |
| Senha vazia | `Ops! O campo senha é obrigatório` |
| Credenciais inválidas | `Ops! Usuário e senha não conferem com nenhum usuário cadastrado` |
| Usuário bloqueado | `Ops! Desculpe, este usuário foi bloqueado.` |
| Acesso sem sessão | `Ops! Você precisa estar logado para acessar esta página.` |

### Checkout (prefixo "Erro: ")

| Cenário | Mensagem |
|---|---|
| Nome vazio | `Erro: O nome é obrigatório` |
| Sobrenome vazio | `Erro: O sobrenome é obrigatório` |
| CEP vazio | `Erro: O CEP é obrigatório` |

---

## Comportamentos especiais por usuário

Todos usam a senha `senha_teste_123`.

| Usuário | Comportamento | Onde observar |
|---|---|---|
| `usuario_padrao` | fluxo normal, sem defeitos | — |
| `usuario_bloqueado` | login recusado | `#texto-erro`: "Ops! Desculpe, este usuário foi bloqueado." |
| `usuario_lento` | login com atraso de ~5s | `#botao-entrar` fica `[disabled]` com `value="Carregando..."` |
| `usuario_problema` | todas as imagens de produto quebradas | `img` com `src="../img/broken.svg"` na vitrine e no detalhe |
| `usuario_erro` | ações falham de propósito | 1) trocar `#seletor-ordenacao` dispara `alert` e volta para `az`; 2) clicar em Adicionar de produtos com **id ímpar** não tem efeito (badge não muda, `console.error` emitido); 3) `#botao-finalizar` dispara `alert` e o pedido não é concluído |
| `usuario_visual` | defeitos visuais propositais | `body` recebe `.bugs-visuais`: logo deslocado, `#badge-carrinho` no canto errado, imagens de cards `:nth-child(3n)` tortas, botões de cards `:nth-child(4n)` desalinhados, preços em vermelho itálico, e **preços errados na vitrine** (+R$ 10,00 nos produtos de id múltiplo de 5: ids 0, 5, 10, 15 e 20 — carrinho e checkout mostram o preço correto) |

**Textos dos `alert` do `usuario_erro`** (para testes de diálogo):
- Ordenação: `Ops! A ordenação está quebrada para este usuário. Defeito proposital para testes.`
- Finalizar: `Ops! Não foi possível finalizar o pedido. Defeito proposital para testes.`

---

## Templates (uso interno — não interagíveis)

Elementos `<template>` clonados pelo JavaScript para gerar o conteúdo dinâmico. **Não são alvos de automação** (conteúdo inerte, invisível ao usuário), listados apenas para referência:

| `id` | Página | Gera |
|---|---|---|
| `#modelo-item-produto` | `index.html` | cards da lista de produtos |
| `#modelo-item-carrinho` | `cart.html` | linhas do carrinho |
| `#modelo-item-resumo` | `checkout-step-two.html` | linhas do resumo do pedido |
| `#modelo-linha-item` | `nota-fiscal.html` | linhas da tabela da nota fiscal |

---

## Botões de carrinho por produto

Seletores prontos dos 21 produtos. O `id` do botão é estável; o `data-test` alterna entre adicionar e remover conforme o produto entra ou sai do carrinho.

| Produto | `data-test` para adicionar | `data-test` para remover | `id` do botão | Detalhe do produto | Preço |
|---|---|---|---|---|---|
| Mochila do Testador | `[data-test="adicionar-carrinho-mochila-do-testador"]` | `[data-test="remover-mochila-do-testador"]` | `#botao-carrinho-mochila-do-testador` | `inventory-item.html?id=4` | R$ 149,90 |
| Lanterna de Bike LED | `[data-test="adicionar-carrinho-lanterna-de-bike-led"]` | `[data-test="remover-lanterna-de-bike-led"]` | `#botao-carrinho-lanterna-de-bike-led` | `inventory-item.html?id=0` | R$ 49,90 |
| Camiseta Caça-Bugs | `[data-test="adicionar-carrinho-camiseta-caca-bugs"]` | `[data-test="remover-camiseta-caca-bugs"]` | `#botao-carrinho-camiseta-caca-bugs` | `inventory-item.html?id=1` | R$ 79,90 |
| Jaqueta Fleece QA | `[data-test="adicionar-carrinho-jaqueta-fleece-qa"]` | `[data-test="remover-jaqueta-fleece-qa"]` | `#botao-carrinho-jaqueta-fleece-qa` | `inventory-item.html?id=5` | R$ 249,90 |
| Body do Testadorzinho | `[data-test="adicionar-carrinho-body-do-testadorzinho"]` | `[data-test="remover-body-do-testadorzinho"]` | `#botao-carrinho-body-do-testadorzinho` | `inventory-item.html?id=2` | R$ 39,90 |
| Camiseta Teste.Tudo() Salmão | `[data-test="adicionar-carrinho-camiseta-teste-tudo-salmao"]` | `[data-test="remover-camiseta-teste-tudo-salmao"]` | `#botao-carrinho-camiseta-teste-tudo-salmao` | `inventory-item.html?id=3` | R$ 79,90 |
| Caneca do Depurador | `[data-test="adicionar-carrinho-caneca-do-depurador"]` | `[data-test="remover-caneca-do-depurador"]` | `#botao-carrinho-caneca-do-depurador` | `inventory-item.html?id=6` | R$ 34,90 |
| Teclado Mecânico TesteMaster | `[data-test="adicionar-carrinho-teclado-mecanico-testemaster"]` | `[data-test="remover-teclado-mecanico-testemaster"]` | `#botao-carrinho-teclado-mecanico-testemaster` | `inventory-item.html?id=7` | R$ 349,90 |
| Mouse Sem Fio ClickCerto | `[data-test="adicionar-carrinho-mouse-sem-fio-clickcerto"]` | `[data-test="remover-mouse-sem-fio-clickcerto"]` | `#botao-carrinho-mouse-sem-fio-clickcerto` | `inventory-item.html?id=8` | R$ 89,90 |
| Fone Anti-Ruído FocoTotal | `[data-test="adicionar-carrinho-fone-anti-ruido-focototal"]` | `[data-test="remover-fone-anti-ruido-focototal"]` | `#botao-carrinho-fone-anti-ruido-focototal` | `inventory-item.html?id=9` | R$ 199,90 |
| Boné Automatize Tudo | `[data-test="adicionar-carrinho-bone-automatize-tudo"]` | `[data-test="remover-bone-automatize-tudo"]` | `#botao-carrinho-bone-automatize-tudo` | `inventory-item.html?id=10` | R$ 59,90 |
| Moletom Deploy na Sexta | `[data-test="adicionar-carrinho-moletom-deploy-na-sexta"]` | `[data-test="remover-moletom-deploy-na-sexta"]` | `#botao-carrinho-moletom-deploy-na-sexta` | `inventory-item.html?id=11` | R$ 189,90 |
| Garrafa Térmica CaféContínuo | `[data-test="adicionar-carrinho-garrafa-termica-cafecontinuo"]` | `[data-test="remover-garrafa-termica-cafecontinuo"]` | `#botao-carrinho-garrafa-termica-cafecontinuo` | `inventory-item.html?id=12` | R$ 69,90 |
| Pacote de Adesivos de Bugs | `[data-test="adicionar-carrinho-pacote-de-adesivos-de-bugs"]` | `[data-test="remover-pacote-de-adesivos-de-bugs"]` | `#botao-carrinho-pacote-de-adesivos-de-bugs` | `inventory-item.html?id=13` | R$ 19,90 |
| Caderno de Casos de Teste | `[data-test="adicionar-carrinho-caderno-de-casos-de-teste"]` | `[data-test="remover-caderno-de-casos-de-teste"]` | `#botao-carrinho-caderno-de-casos-de-teste` | `inventory-item.html?id=14` | R$ 29,90 |
| Luminária PixelPerfect | `[data-test="adicionar-carrinho-luminaria-pixelperfect"]` | `[data-test="remover-luminaria-pixelperfect"]` | `#botao-carrinho-luminaria-pixelperfect` | `inventory-item.html?id=15` | R$ 119,90 |
| Mousepad Gigante DevOps | `[data-test="adicionar-carrinho-mousepad-gigante-devops"]` | `[data-test="remover-mousepad-gigante-devops"]` | `#botao-carrinho-mousepad-gigante-devops` | `inventory-item.html?id=16` | R$ 49,90 |
| Webcam Full HD VisãoQA | `[data-test="adicionar-carrinho-webcam-full-hd-visaoqa"]` | `[data-test="remover-webcam-full-hd-visaoqa"]` | `#botao-carrinho-webcam-full-hd-visaoqa` | `inventory-item.html?id=17` | R$ 159,90 |
| Suporte de Notebook ErgoTeste | `[data-test="adicionar-carrinho-suporte-de-notebook-ergoteste"]` | `[data-test="remover-suporte-de-notebook-ergoteste"]` | `#botao-carrinho-suporte-de-notebook-ergoteste` | `inventory-item.html?id=18` | R$ 99,90 |
| Pelúcia do Bug | `[data-test="adicionar-carrinho-pelucia-do-bug"]` | `[data-test="remover-pelucia-do-bug"]` | `#botao-carrinho-pelucia-do-bug` | `inventory-item.html?id=19` | R$ 44,90 |
| Quebra-Cabeça 404 Peças | `[data-test="adicionar-carrinho-quebra-cabeca-404-pecas"]` | `[data-test="remover-quebra-cabeca-404-pecas"]` | `#botao-carrinho-quebra-cabeca-404-pecas` | `inventory-item.html?id=20` | R$ 54,90 |

**Estados do botão** (exemplo com a Mochila do Testador):

| Estado | `id` | `data-test` | Texto | `class` extra |
|---|---|---|---|---|
| Fora do carrinho | `#botao-carrinho-mochila-do-testador` | `[data-test="adicionar-carrinho-mochila-do-testador"]` | "Adicionar ao carrinho" | `.btn_inventory` |
| No carrinho | `#botao-carrinho-mochila-do-testador` (não muda) | `[data-test="remover-mochila-do-testador"]` | "Remover" | `.btn_secondary` |
---

## Armazenamento (setup/teardown de testes)

Chaves usadas pela aplicação — úteis para preparar estado sem passar pela UI:

| Chave | Onde | Conteúdo |
|---|---|---|
| `session-username` | `sessionStorage` | username logado (ex.: `"usuario_padrao"`) |
| `cart-contents` | `localStorage` | array JSON de ids de produtos (ex.: `[4,0]`) |
| `checkout-info` | `sessionStorage` | JSON `{first, last, postal}` da etapa 1 (removido ao finalizar) |
| `ultimo-pedido` | `sessionStorage` | JSON do pedido finalizado: `{numero, data, hora, cliente, itens, subtotal, imposto, total}` — usado pela conclusão e pela nota fiscal |
