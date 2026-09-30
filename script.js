const produtos = [
    { id: 1, nome: 'Café Expresso', preco: 5.00, icone: '☕' },
    { id: 2, nome: 'Café com Leite', preco: 7.50, icone: '🥛' },
    { id: 3, nome: 'Cappuccino', preco: 9.00, icone: '☕' },
    { id: 4, nome: 'Chocolate Quente', preco: 10.00, icone: '🍫' },
    { id: 5, nome: 'Pão de Queijo', preco: 4.00, icone: '🥐' },
    { id: 6, nome: 'Bolo de Cenoura', preco: 8.00, icone: '🎂' },
    { id: 7, nome: 'Sanduíche Natural', preco: 12.00, icone: '🥪' },
    { id: 8, nome: 'Suco de Laranja', preco: 6.50, icone: '🍊' },
    { id: 9, nome: 'Croissant', preco: 7.00, icone: '🥐' },
    { id: 10, nome: 'Mochaccino', preco: 11.00, icone: '☕' },
    { id: 11, nome: 'Água Mineral', preco: 3.00, icone: '💧' },
    { id: 12, nome: 'Brownie', preco: 6.00, icone: '🍫' }
];

let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

function salvarCarrinho() {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

const produtosGrid = document.getElementById('produtosGrid');

function renderizarProdutos() {
    produtosGrid.innerHTML = '';
    produtos.forEach(prod => {
        const card = document.createElement('div');
        card.className = 'produto-card';
        card.innerHTML = `
            <div class="produto-img">${prod.icone}</div>
            <div class="produto-info">
                <h3 class="produto-nome">${prod.nome}</h3>
                <p class="produto-preco">R$ ${prod.preco.toFixed(2)}</p>
                <button class="btn btn-primary" data-id="${prod.id}">
                    Adicionar ao Carrinho
                </button>
            </div>
        `;
        produtosGrid.appendChild(card);
    });


    document.querySelectorAll('.produto-card button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            adicionarAoCarrinho(id);
        });
    });
}

function adicionarAoCarrinho(idProd) {
    const produto = produtos.find(p => p.id === idProd);
    const itemExistente = carrinho.find(i => i.id === idProd);

    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        carrinho.push({ ...produto, quantidade: 1 });
    }

    salvarCarrinho();
    atualizarCarrinho();
}

function removerItem(idProd) {
    carrinho = carrinho.filter(i => i.id !== idProd);
    salvarCarrinho();
    atualizarCarrinho();
}

function alterarQuantidade(idProd, delta) {
    const item = carrinho.find(i => i.id === idProd);
    if (item) {
        item.quantidade += delta;
        if (item.quantidade <= 0) {
            removerItem(idProd);
        } else {
            salvarCarrinho();
            atualizarCarrinho();
        }
    }
}

function atualizarCarrinho() {
    const totalItens = carrinho.reduce((s, i) => s + i.quantidade, 0);
    document.getElementById('cartCount').textContent = totalItens;


    const container = document.getElementById('carrinhoItens');
    container.innerHTML = '';

    carrinho.forEach(item => {
        const div = document.createElement('div');
        div.className = 'carrinho-item';
        div.innerHTML = `
            <div>
                <strong>${item.nome}</strong><br>
                R$ ${item.preco.toFixed(2)}
            </div>
            <div class="item-qtd">
                <button data-id="${item.id}" data-acao="menos">-</button>
                ${item.quantidade}
                <button data-id="${item.id}" data-acao="mais">+</button>
                <button data-id="${item.id}" data-acao="remover" style="margin-left:8px; background:#e74c3c; color:#fff;">✕</button>
            </div>
        `;
        container.appendChild(div);
    });

    const total = carrinho.reduce((s, i) => s + (i.preco * i.quantidade), 0);
    document.getElementById('valorTotal').textContent = total.toFixed(2);
}

document.getElementById('carrinhoItens').addEventListener('click', (e) => {
    if (!e.target.dataset.id) return;
    const id = parseInt(e.target.dataset.id);
    const acao = e.target.dataset.acao;

    if (acao === 'mais') alterarQuantidade(id, 1);
    if (acao === 'menos') alterarQuantidade(id, -1);
    if (acao === 'remover') removerItem(id);
});

const carrinhoModal = document.getElementById('carrinhoModal');

document.getElementById('cartBtn').addEventListener('click', () => {
    carrinhoModal.classList.add('aberto');
});

document.getElementById('fecharCarrinho').addEventListener('click', () => {
    carrinhoModal.classList.remove('aberto');
});

carrinhoModal.addEventListener('click', (e) => {
    if (e.target === carrinhoModal) {
        carrinhoModal.classList.remove('aberto');
    }
});

document.getElementById('finalizarPedido').addEventListener('click', () => {
    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    alert('✅ Pedido enviado com sucesso!\nObrigado pela preferência!');
    carrinho = [];
    salvarCarrinho();
    atualizarCarrinho();
    carrinhoModal.classList.remove('aberto');
});

const menuToggle = document.getElementById('menuToggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('aberto');
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('aberto');
    });
});

document.querySelectorAll('.faq-pergunta').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.parentElement;
        item.classList.toggle('aberto');
    });
});

document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const alvo = document.querySelector(this.getAttribute('href'));
        if (alvo) {
            alvo.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

renderizarProdutos();
atualizarCarrinho();
 