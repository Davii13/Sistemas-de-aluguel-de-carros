const API = "http://127.0.0.1:8080/clientes";

const form = document.getElementById("formCliente");
const lista = document.getElementById("listaClientes");

function carregarClientes() {
  fetch(API)
    .then(res => res.json())
    .then(data => {
      lista.innerHTML = "";

      data.forEach(cliente => {
        lista.innerHTML += `
          <tr>
            <td>${cliente.nome}</td>
            <td>${cliente.cpf}</td>
            <td class="actions">
              <button onclick="editar(${cliente.id})">Editar</button>
              <button class="delete" onclick="deletar(${cliente.id})">Excluir</button>
            </td>
          </tr>
        `;
      });
    });
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const id = document.getElementById("id").value;

  const cliente = {
    nome: document.getElementById("nome").value,
    cpf: document.getElementById("cpf").value,
    rg: document.getElementById("rg").value,
    endereco: document.getElementById("endereco").value,
    profissao: document.getElementById("profissao").value
  };

  if (id) {
    fetch(`${API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cliente)
    }).then(() => {
      form.reset();
      carregarClientes();
    });
  } else {
    fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cliente)
    }).then(() => {
      form.reset();
      carregarClientes();
    });
  }
});

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
    });
}

function deletar(id) {
  fetch(`${API}/${id}`, {
    method: "DELETE"
  }).then(() => carregarClientes());
}

carregarClientes();