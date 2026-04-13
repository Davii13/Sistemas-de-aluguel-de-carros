package br.gestao.service;

import jakarta.inject.Inject;
import jakarta.inject.Singleton;
import br.gestao.repository.ClienteRepository;
import br.gestao.model.Cliente;
import br.gestao.model.Rendimento;
import java.util.List;

@Singleton
public class ClienteService {

    @Inject
    private ClienteRepository repository;

    // MÉTODO QUE ESTAVA FALTANDO:
    public Cliente adicionarRendimento(Long clienteId, Rendimento novoRendimento) {
        Cliente cliente = buscarPorId(clienteId);
        if (cliente != null) {
            if (cliente.getRendimentos().size() >= 3) {
                throw new RuntimeException("Limite de 3 rendimentos atingido.");
            }
            novoRendimento.setCliente(cliente);
            cliente.getRendimentos().add(novoRendimento);
            return repository.update(cliente);
        }
        return null;
    }

    public Cliente salvar(Cliente cliente) {
        if (cliente.getRendimentos() != null) {
            cliente.getRendimentos().forEach(r -> r.setCliente(cliente));
        }
        return repository.save(cliente);
    }

    public List<Cliente> listar() {
        return repository.findAll();
    }

    public Cliente buscarPorId(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Cliente buscarPorUsuarioId(Long usuarioId) {
        return repository.findByUsuarioId(usuarioId).orElse(null);
    }

    public Cliente atualizar(Long id, Cliente cliente) {
        cliente.setId(id);
        if (cliente.getRendimentos() != null) {
            cliente.getRendimentos().forEach(r -> r.setCliente(cliente));
        }
        return repository.update(cliente);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}