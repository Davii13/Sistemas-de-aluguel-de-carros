package br.gestao.controller;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.annotation.Post;
import io.micronaut.http.annotation.Put;
import io.micronaut.http.annotation.Delete;
import io.micronaut.http.annotation.Body;
import br.gestao.service.ClienteService;
import br.gestao.model.Cliente;
import jakarta.inject.Inject;

import java.util.List;

@Controller("/clientes")
public class ClienteController {

    @Inject
    private ClienteService service;

    @Post
    public Cliente criar(@Body Cliente cliente) {
        return service.salvar(cliente);
    }

    @Get
    public List<Cliente> listar() {
        return service.listar();
    }

    @Get("/{id}")
    public Cliente buscar(Long id) {
        return service.buscarPorId(id);
    }

    @Put("/{id}")
    public Cliente atualizar(Long id, @Body Cliente cliente) {
        return service.atualizar(id, cliente);
    }

    @Delete("/{id}")
    public void deletar(Long id) {
        service.deletar(id);
    }
}
