// ===== Página de detalhe do produto =====

requireLogin();
initHeader();

const id = parseInt(new URLSearchParams(location.search).get("id"), 10);
const product = productById(id);

const notFoundEl = document.getElementById("item-nao-encontrado");
const imgWrap = document.querySelector(".inventory_details_img");
const descWrap = document.querySelector(".inventory_details_desc_container");

if (!product) {
  notFoundEl.hidden = false;
  imgWrap.hidden = true;
  descWrap.hidden = true;
} else {
  const isProblemUser = Session.user === "usuario_problema";

  const img = document.getElementById("imagem-item");
  img.src = isProblemUser ? "../img/broken.svg" : product.img;
  img.alt = product.name;

  document.querySelector('[data-test="nome-item"]').textContent = product.name;
  document.querySelector('[data-test="descricao-item"]').textContent = product.desc;
  document.querySelector('[data-test="preco-item"]').textContent = money(product.price);

  bindCartButton(document.getElementById("botao-carrinho"), product);
}

window.onAppReset = () => {
  if (product) updateCartButton(document.getElementById("botao-carrinho"), product);
};
