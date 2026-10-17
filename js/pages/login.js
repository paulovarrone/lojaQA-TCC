// ===== Página de login =====

const form = document.getElementById("form-login");
const userInput = document.getElementById("campo-usuario");
const passInput = document.getElementById("campo-senha");
const errorBox = document.getElementById("container-erro");
const errorText = document.getElementById("texto-erro");
const errorClose = document.getElementById("botao-fechar-erro");
const loginBtn = document.getElementById("botao-entrar");

function showError(msg) {
  errorText.textContent = "Ops! " + msg;
  errorBox.classList.add("exibido");
  userInput.classList.add("campo_invalido");
  passInput.classList.add("campo_invalido");
}

function clearError() {
  errorBox.classList.remove("exibido");
  userInput.classList.remove("campo_invalido");
  passInput.classList.remove("campo_invalido");
}

errorClose.addEventListener("click", clearError);

// Mensagem quando o usuário é redirecionado sem sessão ativa
if (new URLSearchParams(location.search).get("error") === "auth") {
  showError("Você precisa estar logado para acessar esta página.");
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  clearError();
  const user = userInput.value.trim();
  const pass = passInput.value;

  if (!user) return showError("O campo usuário é obrigatório");
  if (!pass) return showError("O campo senha é obrigatório");

  if (!VALID_USERS.includes(user) || pass !== VALID_PASSWORD) {
    return showError("Usuário e senha não conferem com nenhum usuário cadastrado");
  }
  if (user === "usuario_bloqueado") {
    return showError("Desculpe, este usuário foi bloqueado.");
  }

  Session.login(user);

  // usuario_lento: simula lentidão de ~5s
  const delay = user === "usuario_lento" ? 5000 : 0;
  if (delay) {
    loginBtn.value = "Carregando...";
    loginBtn.disabled = true;
  }
  setTimeout(() => { window.location.href = "index.html"; }, delay);
});
