document.addEventListener("DOMContentLoaded", () => {
  const produtosContainer = document.getElementById("produtos-container");
  const cartCount = document.getElementById("cart-count");

  // Modal Elementos
  const modal = document.getElementById("checkout-modal");
  const closeBtn = document.querySelector(".close-btn");
  const listaCarrinho = document.getElementById("lista-carrinho");
  const totalCarrinho = document.getElementById("total-carrinho");

  let carrinho = {};

  // 1. Simulação de Login Google
  document.getElementById("login-btn").addEventListener("click", (e) => {
    e.preventDefault();
    alert(
      "Redirecionando para autenticação segura do Google...\n\n(Simulação de Login realizada com sucesso! Bem-vindo(a)!)",
    );
    document.getElementById("login-btn").innerHTML = "👤 Olá, Cliente!";
  });

  // 2. Carregar Produtos com Detalhes Nutricionais
  fetch("/api/produtos")
    .then((response) => response.json())
    .then((produtos) => {
      produtosContainer.innerHTML = "";
      produtos.forEach((produto) => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
                    <img src="/static/${produto.imagem_url}" alt="${produto.nome}" class="card-img">
                    <h3>${produto.nome}</h3>
                    <p>${produto.descricao}</p>
                    <div class="detalhes-nutricionais">
                        <strong>Calorias:</strong> ${produto.calorias} kcal<br>
                        <strong>Ingredientes e Alergênicos:</strong> ${produto.ingredientes}
                    </div>
                    <div class="preco">R$ ${produto.preco.toFixed(2).replace(".", ",")}</div>
                    <button onclick="adicionarCarrinho('${produto.nome}', ${produto.preco})">Adicionar ao Carrinho</button>
                `;
        produtosContainer.appendChild(card);
      });
    })
    .catch((error) => console.error("Erro ao carregar produtos:", error));

  // 3. Funções do Carrinho
  window.adicionarCarrinho = function (nome, preco) {
    if (carrinho[nome]) {
      carrinho[nome].quantidade += 1;
    } else {
      carrinho[nome] = { preco: preco, quantidade: 1 };
    }
    atualizarContadorCarrinho();
    alert(`1x ${nome} adicionado ao carrinho!`);
  };

  function atualizarContadorCarrinho() {
    let totalItens = 0;
    for (let item in carrinho) {
      totalItens += carrinho[item].quantidade;
    }
    cartCount.innerText = totalItens;
  }

  // 4. Abrir Modal de Checkout
  const carrinhoBtn = document.querySelector(".carrinho-btn");
  carrinhoBtn.addEventListener("click", function (event) {
    event.preventDefault();

    if (Object.keys(carrinho).length === 0) {
      alert(
        "Seu carrinho está vazio! Adicione nossos cupcakes antes de fechar o pedido.",
      );
      return;
    }

    // Preenche os itens detalhados no modal
    listaCarrinho.innerHTML = "";
    let valorTotal = 0;

    for (let nome in carrinho) {
      let item = carrinho[nome];
      let subtotal = item.preco * item.quantidade;
      valorTotal += subtotal;

      listaCarrinho.innerHTML += `
                <div class="item-carrinho">
                    <span>${item.quantidade}x ${nome}</span>
                    <span>R$ ${subtotal.toFixed(2).replace(".", ",")}</span>
                </div>
            `;
    }

    totalCarrinho.innerText = `Total: R$ ${valorTotal.toFixed(2).replace(".", ",")}`;
    modal.style.display = "block"; // Mostra o modal
  });

  // 5. Fechar Modal e Concluir Pagamento
  closeBtn.onclick = function () {
    modal.style.display = "none";
  };
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  document.getElementById("confirmar-compra").addEventListener("click", () => {
    const pagamento = document.getElementById("forma-pagamento").value;
    const modoStr = pagamento === "pix" ? "PIX" : "Cartão de Crédito";

    alert(
      `🎉 Pedido processado com sucesso!\n\nPagamento via: ${modoStr}\nMuito obrigado por apoiar o Doce Cuidado - Cupcakes.`,
    );

    carrinho = {};
    atualizarContadorCarrinho();
    modal.style.display = "none";
  });
});
