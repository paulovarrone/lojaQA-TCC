// ===== Checkout, etapa 2: resumo do pedido =====

requireLogin();
initHeader();

const listEl = document.getElementById("lista-resumo");
const template = document.getElementById("modelo-item-resumo");

// Itens e totais do resumo. Recalculados a cada renderização para nunca
// divergirem do carrinho — é deles que o pedido é gravado ao finalizar.
let items = [];
let subtotal = 0;
let tax = 0;
let total = 0;

function renderResumo() {
  items = Cart.items.map(productById).filter(Boolean);

  listEl.replaceChildren();
  items.forEach((p) => {
    const node = template.content.cloneNode(true);

    const nameLink = node.querySelector('[data-test="nome-item"]');
    nameLink.href = "inventory-item.html?id=" + p.id;
    nameLink.textContent = p.name;

    node.querySelector('[data-test="descricao-item"]').textContent = p.desc;
    node.querySelector('[data-test="preco-item"]').textContent = money(p.price);

    listEl.appendChild(node);
  });

  subtotal = items.reduce((sum, p) => sum + p.price, 0);
  tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  total = Math.round((subtotal + tax) * 100) / 100;

  document.getElementById("valor-subtotal").textContent = "Subtotal: " + money(subtotal);
  document.getElementById("valor-imposto").textContent = "Impostos (8%): " + money(tax);
  document.getElementById("valor-total").textContent = "Total: " + money(total);
}

document.getElementById("botao-finalizar").addEventListener("click", () => {
  // usuario_erro: finalizar o pedido falha (defeito proposital)
  if (Session.user === "usuario_erro") {
    alert("Ops! Não foi possível finalizar o pedido. Defeito proposital para testes.");
    return;
  }

  // Registra o pedido para a página de conclusão e a nota fiscal
  const info = JSON.parse(sessionStorage.getItem("checkout-info") || "{}");
  const agora = new Date();
  const pedido = {
    numero: String(agora.getTime()).slice(-8),
    data: agora.toLocaleDateString("pt-BR"),
    hora: agora.toLocaleTimeString("pt-BR"),
    cliente: info,
    itens: items.map((p) => ({ id: p.id, nome: p.name, preco: p.price })),
    subtotal: subtotal,
    imposto: tax,
    total: total
  };
  sessionStorage.setItem("ultimo-pedido", JSON.stringify(pedido));
  sessionStorage.removeItem("checkout-info");
  Cart.clear();
  window.location.href = "checkout-complete.html";
});

window.onAppReset = renderResumo;
renderResumo();

