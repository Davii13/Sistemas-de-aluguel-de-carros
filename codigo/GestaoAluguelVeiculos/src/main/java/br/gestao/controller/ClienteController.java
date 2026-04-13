package br.gestao.controller;

import io.micronaut.http.annotation.*;
import br.gestao.service.ClienteService;
import br.gestao.model.Cliente;
import br.gestao.model.Rendimento;
import jakarta.inject.Inject;
import java.util.List;

@Controller("/clientes")
public class ClienteController {

    @Inject
    private ClienteService service;

    @Post("/{id}/rendimentos")
    public Cliente adicionarRendimento(Long id, @Body Rendimento rendimento) {
        return service.adicionarRendimento(id, rendimento);
    }

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

    @Get("/usuario/{usuarioId}")
    public Cliente buscarPorUsuario(Long usuarioId) {
        return service.buscarPorUsuarioId(usuarioId);
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