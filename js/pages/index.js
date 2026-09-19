// ===== Página de inventário (lista de produtos) =====

requireLogin();
initHeader();

const listEl = document.getElementById("lista-produtos");
const template = document.getElementById("modelo-item-produto");
const sortSelect = document.getElementById("seletor-ordenacao");

const sorters = {
  az:   (a, b) => a.name.localeCompare(b.name),
  za:   (a, b) => b.name.localeCompare(a.name),
  lohi: (a, b) => a.price - b.price,
  hilo: (a, b) => b.price - a.price
};

function renderList() {
  const isProblemUser = Session.user === "usuario_problema";
  const isVisualUser = Session.user === "usuario_visual";
  const products = [...PRODUCTS].sort(sorters[sortSelect.value]);

  listEl.replaceChildren();
  products.forEach((p) => {
    const node = template.content.cloneNode(true);
    const detailUrl = "inventory-item.html?id=" + p.id;

    node.querySelectorAll(".link-item").forEach((a) => { a.href = detailUrl; });

    const img = node.querySelector("img");
    img.src = isProblemUser ? "../img/broken.svg" : p.img;
    img.alt = p.name;

    // usuario_visual: preço exibido errado (+R$ 10) para ids múltiplos de 5,
    // apenas na vitrine — carrinho e checkout usam o preço correto
    const precoExibido = isVisualUser && p.id % 5 === 0 ? p.price + 10 : p.price;

    node.querySelector('[data-test="nome-item"]').textContent = p.name;
    node.querySelector('[data-test="descricao-item"]').textContent = p.desc;
    node.querySelector('[data-test="preco-item"]').textContent = money(precoExibido);

    bindCartButton(node.querySelector("button"), p);
    listEl.appendChild(node);
  });
}

// Contador de produtos no banner de boas-vindas
const contador = document.getElementById("contador-produtos");
if (contador) contador.textContent = PRODUCTS.length;

sortSelect.addEventListener("change", () => {
  // usuario_erro: a ordenação está quebrada (defeito proposital)
  if (Session.user === "usuario_erro") {
    alert("Ops! A ordenação está quebrada para este usuário. Defeito proposital para testes.");
    sortSelect.value = "az";
    return;
  }
  renderList();
});
window.onAppReset = renderList;
renderList();
