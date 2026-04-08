const API = "http://localhost:8081/clientes";
const form = document.getElementById("formCliente");
const lista = document.getElementById("listaClientes");
const containerRendimentos = document.getElementById("containerRendimentos");
const btnAdicionarRenda = document.getElementById("btnAdicionarRenda");

// Função para criar dinamicamente os campos de rendimento (máximo 3)
function criarCamposRendimento(fonte = "", valor = "") {
    if (document.querySelectorAll(".renda-item").length >= 3) {
        alert("Limite de 3 rendimentos atingido.");
        return;
    }

    const div = document.createElement("div");
    div.className = "renda-item";
    div.innerHTML = `
        <input type="text" placeholder="Empresa/Fonte" class="renda-fonte" value="${fonte}" required>
        <input type="number" step="0.01" placeholder="Valor R$" class="renda-valor" value="${valor}" required>
        <button type="button" class="btn-remove" onclick="this.parentElement.remove()">X</button>
    `;
    containerRendimentos.appendChild(div);
}

btnAdicionarRenda.addEventListener("click", () => criarCamposRendimento());

// Função para carregar e listar os clientes cadastrados
function carregarClientes() {
    fetch(API)
        .then(res => {
            if (!res.ok) throw new Error("Erro na rede ao buscar clientes");
            return res.json();
        })
        .then(data => {
            lista.innerHTML = "";
            data.forEach(cliente => {
                // Proteção contra campos nulos ou indefinidos nos rendimentos
                const rendimentosArray = cliente.rendimentos || [];
                const rendasStr = rendimentosArray.length > 0 
                    ? rendimentosArray.map(r => `${r.fonte}: R$${r.valor}`).join("<br>") 
                    : "Nenhum";

                lista.innerHTML += `
                    <tr>
                        <td>${cliente.nome}</td>
                        <td>${cliente.cpf}</td>
                        <td><small>${rendasStr}</small></td>
                        <td class="actions">
                            <button onclick="editar(${cliente.id})">Editar</button>
                            <button class="delete" onclick="deletar(${cliente.id})">Excluir</button>
                        </td>
                    </tr>
                `;
            });
        })
        .catch(err => console.error("Erro ao carregar clientes:", err));
}

// Evento de submissão do formulário (Salvar ou Atualizar)
form.addEventListener("submit", function (e) {
    e.preventDefault();
    const id = document.getElementById("id").value;

    // Captura os dados dos rendimentos dinâmicos
    const rendimentos = [];
    document.querySelectorAll(".renda-item").forEach(item => {
        rendimentos.push({
            fonte: item.querySelector(".renda-fonte").value,
            valor: parseFloat(item.querySelector(".renda-valor").value)
        });
    });

    // Constrói o objeto cliente para envio
    const cliente = {
        nome: document.getElementById("nome").value,
        cpf: document.getElementById("cpf").value,
        rg: document.getElementById("rg").value,
        endereco: document.getElementById("endereco").value,
        profissao: document.getElementById("profissao").value,
        rendimentos: rendimentos
    };

    const metodo = id ? "PUT" : "POST";
    const url = id ? `${API}/${id}` : API;

    fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cliente)
    }).then(res => {
        if (!res.ok) throw new Error("Erro ao salvar o cliente");
        form.reset();
        containerRendimentos.innerHTML = "";
        document.getElementById("id").value = "";
        carregarClientes();
    }).catch(err => alert(err.message));
});

// Função para preencher o formulário para edição
function editar(id) {
    fetch(`${API}/${id}`)
        .then(res => res.json())
        .then(cliente => {
            document.getElementById("id").value = cliente.id;
            document.getElementById("nome").value = cliente.nome;
            document.getElementById("cpf").value = cliente.cpf;
            document.getElementById("rg").value = cliente.rg;
            document.getElementById("endereco").value = cliente.endereco;
            document.getElementById("profissao").value = cliente.profissao;

            containerRendimentos.innerHTML = "";
            const rendimentosArray = cliente.rendimentos || [];
            rendimentosArray.forEach(r => criarCamposRendimento(r.fonte, r.valor));
        });
}

// Função para remover um cliente
function deletar(id) {
    if (confirm("Deseja realmente excluir este cliente?")) {
        fetch(`${API}/${id}`, { method: "DELETE" }).then(() => carregarClientes());
    }
}

// Inicializa a lista ao carregar a página
carregarClientes();