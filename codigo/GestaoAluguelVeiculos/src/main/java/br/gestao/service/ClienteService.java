package br.gestao.service;
import jakarta.inject.Inject;
import jakarta.inject.Singleton;
import br.gestao.repository.ClienteRepository;
import br.gestao.model.Cliente;

import java.util.List;
@Singleton
public class ClienteService {

    @Inject
    private ClienteRepository repository;

    public Cliente salvar(Cliente cliente) {
        return repository.save(cliente);
    }

    public List<Cliente> listar() {
        return repository.findAll();
    }

    public Cliente buscarPorId(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Cliente atualizar(Long id, Cliente cliente) {
        cliente.setId(id);
        return repository.update(cliente);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}