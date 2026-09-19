// ===== Dados dos produtos =====
const PRODUCTS = [
  {
    id: 4,
    name: "Mochila do Testador",
    desc: "Mochila resistente com compartimento acolchoado para notebook, perfeita para carregar seu equipamento de testes para qualquer lugar.",
    price: 149.90,
    img: "../img/backpack.svg"
  },
  {
    id: 0,
    name: "Lanterna de Bike LED",
    desc: "Lanterna de bicicleta com LED vermelho de alta visibilidade. Bateria de longa duração incluída.",
    price: 49.90,
    img: "../img/bike-light.svg"
  },
  {
    id: 1,
    name: "Camiseta Caça-Bugs",
    desc: "Camiseta de algodão super macia com o icônico raio estampado. Conforto garantido para longas sessões de automação.",
    price: 79.90,
    img: "../img/bolt-shirt.svg"
  },
  {
    id: 5,
    name: "Jaqueta Fleece QA",
    desc: "Jaqueta de fleece quentinha e estilosa. Ideal para escritórios gelados e datacenters com ar-condicionado no máximo.",
    price: 249.90,
    img: "../img/fleece-jacket.svg"
  },
  {
    id: 2,
    name: "Body do Testadorzinho",
    desc: "Body infantil vermelho para o pequeno futuro QA da família. Macio, prático e cheio de estilo.",
    price: 39.90,
    img: "../img/onesie.svg"
  },
  {
    id: 3,
    name: "Camiseta Teste.Tudo() Salmão",
    desc: "Camiseta rosa salmão para quem testa tudo, o tempo todo. Porque bug em produção não é opção.",
    price: 79.90,
    img: "../img/camiseta-teste-tudo.svg"
  },
  {
    id: 6,
    name: "Caneca do Depurador",
    desc: "Caneca de cerâmica de 350ml para o café que acompanha cada sessão de depuração. Lava-louças e micro-ondas aprovados.",
    price: 34.90,
    img: "../img/caneca.svg"
  },
  {
    id: 7,
    name: "Teclado Mecânico TesteMaster",
    desc: "Teclado mecânico com switches táteis e iluminação azul. A tecla F5 aguenta milhares de reexecuções de suíte.",
    price: 349.90,
    img: "../img/teclado.svg"
  },
  {
    id: 8,
    name: "Mouse Sem Fio ClickCerto",
    desc: "Mouse ergonômico sem fio com clique silencioso e precisão de sobra para acertar qualquer seletor na primeira tentativa.",
    price: 89.90,
    img: "../img/mouse.svg"
  },
  {
    id: 9,
    name: "Fone Anti-Ruído FocoTotal",
    desc: "Fone com cancelamento de ruído para ignorar o open office enquanto a pipeline roda. Bateria para 30 horas de foco.",
    price: 199.90,
    img: "../img/fone.svg"
  },
  {
    id: 10,
    name: "Boné Automatize Tudo",
    desc: "Boné ajustável com bordado exclusivo. Proteja-se do sol e espalhe a boa palavra da automação.",
    price: 59.90,
    img: "../img/bone.svg"
  },
  {
    id: 11,
    name: "Moletom Deploy na Sexta",
    desc: "Moletom confortável para quem vive perigosamente. Capuz incluso para se esconder quando o deploy der errado.",
    price: 189.90,
    img: "../img/moletom.svg"
  },
  {
    id: 12,
    name: "Garrafa Térmica CaféContínuo",
    desc: "Garrafa térmica de 1 litro que mantém o café quente por 12 horas — integração contínua de cafeína garantida.",
    price: 69.90,
    img: "../img/garrafa.svg"
  },
  {
    id: 13,
    name: "Pacote de Adesivos de Bugs",
    desc: "Pacote com 50 adesivos de bugs, erros 404 e stack traces para decorar seu notebook. Os únicos bugs bem-vindos.",
    price: 19.90,
    img: "../img/adesivos.svg"
  },
  {
    id: 14,
    name: "Caderno de Casos de Teste",
    desc: "Caderno pautado com 200 páginas para rascunhar cenários, dados de teste e aquele bug impossível de reproduzir.",
    price: 29.90,
    img: "../img/caderno.svg"
  },
  {
    id: 15,
    name: "Luminária PixelPerfect",
    desc: "Luminária de mesa com temperatura de cor ajustável. Ilumine cada pixel na hora de comparar telas.",
    price: 119.90,
    img: "../img/luminaria.svg"
  },
  {
    id: 16,
    name: "Mousepad Gigante DevOps",
    desc: "Mousepad de 90x40cm com base antiderrapante. Espaço de sobra para teclado, mouse e a caneca da sorte.",
    price: 49.90,
    img: "../img/mousepad.svg"
  },
  {
    id: 17,
    name: "Webcam Full HD VisãoQA",
    desc: "Webcam Full HD com foco automático e microfone embutido. Apareça nítido na daily, até quando a build quebra.",
    price: 159.90,
    img: "../img/webcam.svg"
  },
  {
    id: 18,
    name: "Suporte de Notebook ErgoTeste",
    desc: "Suporte de alumínio com altura regulável. Ergonomia aprovada em todos os casos de teste de postura.",
    price: 99.90,
    img: "../img/suporte.svg"
  },
  {
    id: 19,
    name: "Pelúcia do Bug",
    desc: "Pelúcia macia do bug mais famoso da firma. O único bug que você vai querer abraçar em vez de corrigir.",
    price: 44.90,
    img: "../img/pelucia.svg"
  },
  {
    id: 20,
    name: "Quebra-Cabeça 404 Peças",
    desc: "Quebra-cabeça de exatas 404 peças. Aviso: uma peça pode não ser encontrada.",
    price: 54.90,
    img: "../img/quebra-cabeca.svg"
  }
];

// ===== Usuários aceitos =====
const VALID_USERS = [
  "usuario_padrao",
  "usuario_bloqueado",
  "usuario_problema",
  "usuario_lento",
  "usuario_erro",
  "usuario_visual"
];
const VALID_PASSWORD = "senha_teste_123";
const TAX_RATE = 0.08;
