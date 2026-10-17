// ===== Componentes de interface: header, menu lateral, badge e botões de carrinho =====
// Nenhum HTML é gerado aqui — a marcação vive nas páginas; este módulo apenas
// conecta eventos e atualiza texto/classes/atributos.

function initHeader() {
  // usuario_visual: ativa os defeitos visuais propositais (regras .bugs-visuais no CSS)
  if (Session.user === "usuario_visual") {
    document.body.classList.add("bugs-visuais");
  }

  const burgerBtn = document.getElementById("botao-menu");
  const crossBtn = document.getElementById("botao-fechar-menu");
  const overlay = document.getElementById("sobreposicao-menu");
  const logoutLink = document.getElementById("link-sair");
  const resetLink = document.getElementById("link-resetar");

  if (burgerBtn) burgerBtn.addEventListener("click", () => toggleMenu(true));
  if (crossBtn) crossBtn.addEventListener("click", () => toggleMenu(false));
  if (overlay) overlay.addEventListener("click", () => toggleMenu(false));

  if (logoutLink) {
    logoutLink.addEventListener("click", (e) => {
      e.preventDefault();
      Session.logout();
      window.location.href = "login.html";
    });
  }

  if (resetLink) {
    resetLink.addEventListener("click", (e) => {
      e.preventDefault();
      Cart.clear();
      updateCartBadge();
      if (typeof window.onAppReset === "function") window.onAppReset();
    });
  }

  updateCartBadge();
}

function toggleMenu(open) {
  const menu = document.getElementById("menu-lateral");
  const overlay = document.getElementById("sobreposicao-menu");
  if (menu) menu.classList.toggle("aberto", open);
  if (overlay) overlay.classList.toggle("aberto", open);
}

function updateCartBadge() {
  const badge = document.getElementById("badge-carrinho");
  if (!badge) return;
  const count = Cart.items.length;
  badge.textContent = count;
  badge.style.display = count > 0 ? "inline-flex" : "none";
}

// Ajusta texto, classes, id e data-test de um botão Add to cart / Remove
function updateCartButton(btn, product) {
  const inCart = Cart.has(product.id);
  const slug = slugify(product.name);

  btn.textContent = inCart ? "Remover" : "Adicionar ao carrinho";
  btn.classList.toggle("botao_contorno", inCart);
  btn.classList.toggle("botao_comprar", !inCart);

  // id estável (não muda com o estado); data-test dinâmico (muda ao adicionar/remover)
  if (!btn.id) btn.id = "botao-carrinho-" + slug;
  const prefix = inCart ? "remover-" : "adicionar-carrinho-";
  btn.setAttribute("data-test", prefix + slug);
}

// Conecta o clique de um botão de carrinho a um produto.
// onChange (opcional) é chamado após alternar — útil para redesenhar listas.
function bindCartButton(btn, product, onChange) {
  updateCartButton(btn, product);
  btn.addEventListener("click", () => {
    // usuario_erro: adicionar falha para produtos de id ímpar (defeito proposital)
    if (Session.user === "usuario_erro" && !Cart.has(product.id) && product.id % 2 === 1) {
      console.error("LojaQA: falha proposital — não foi possível adicionar o produto " + product.id);
      return;
    }
    if (Cart.has(product.id)) Cart.remove(product.id); else Cart.add(product.id);
    updateCartBadge();
    updateCartButton(btn, product);
    if (typeof onChange === "function") onChange();
  });
}
