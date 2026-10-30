// Consulta a API Tech4Produtos e exibe os produtos do Burger Fast Food.
// O cadastro (POST) é feito separadamente pelo Postman; aqui usamos somente GET.
(() => {
    const nomeRestaurante = "Burger Fast Food";
    const url = `https://tech4produtos.fly.dev/produtos/restaurante=${encodeURIComponent(nomeRestaurante)}`;
    const lista = document.getElementById("lista-produtos-api");
    const status = document.getElementById("status-produtos-api");

    // Permite que o arquivo seja carregado em páginas que não tenham esta seção.
    if (!lista || !status) return;

    function criarTexto(tag, classe, texto) {
        const elemento = document.createElement(tag);
        if (classe) elemento.className = classe;
        elemento.textContent = texto || "";
        return elemento;
    }

    function criarCard(produto) {
        const coluna = document.createElement("div");
        coluna.className = "col";

        const card = document.createElement("article");
        card.className = "card h-100 api-produto-card";

        const imagem = document.createElement("img");
        imagem.className = "card-img-top";
        imagem.alt = produto.nome ? `Foto de ${produto.nome}` : "Imagem do produto";
        imagem.loading = "lazy";

        // Só permite URLs de imagem HTTP/HTTPS vindas da API.
        try {
            const urlImagem = new URL(produto.imagem, window.location.href);
            if (urlImagem.protocol === "https:" || urlImagem.protocol === "http:") {
                imagem.src = urlImagem.href;
            } else {
                imagem.hidden = true;
            }
        } catch (_) {
            imagem.hidden = true;
        }
        imagem.addEventListener("error", () => {
            imagem.hidden = true;
        });

        const corpo = document.createElement("div");
        corpo.className = "card-body d-flex flex-column";
        corpo.appendChild(criarTexto("h3", "card-title", produto.nome || "Produto sem nome"));
        corpo.appendChild(criarTexto("p", "card-text api-produto-descricao", produto.descricao || "Descrição não informada."));
        corpo.appendChild(criarTexto("p", "api-produto-categoria", `Categoria: ${produto.produto || "Não informada"}`));

        if (produto.restaurante) {
            corpo.appendChild(criarTexto("p", "api-produto-restaurante", `Restaurante: ${produto.restaurante}`));
        }

        card.append(imagem, corpo);
        coluna.appendChild(card);
        return coluna;
    }

    fetch(url)
        .then(resposta => {
            if (!resposta.ok) {
                throw new Error(`A API respondeu com o status ${resposta.status}.`);
            }
            return resposta.json();
        })
        .then(dados => {
            // A API normalmente retorna uma lista. Também aceita respostas envelopadas.
            const produtos = Array.isArray(dados)
                ? dados
                : (Array.isArray(dados.produtos) ? dados.produtos
                    : (Array.isArray(dados.data) ? dados.data : []));

            lista.replaceChildren();

            if (produtos.length === 0) {
                status.textContent = "Nenhum produto foi encontrado para este restaurante. Confira se os produtos já foram cadastrados e se o nome do restaurante está igual ao da API.";
                return;
            }

            const fragmento = document.createDocumentFragment();
            produtos.forEach(produto => fragmento.appendChild(criarCard(produto)));
            lista.appendChild(fragmento);
            status.textContent = `${produtos.length} produto(s) carregado(s) da API.`;
        })
        .catch(erro => {
            console.error("Erro ao carregar produtos da API:", erro);
            status.textContent = "Não foi possível carregar os produtos agora. Confira sua conexão, a URL da API e o nome cadastrado para o restaurante.";
        });
})();
