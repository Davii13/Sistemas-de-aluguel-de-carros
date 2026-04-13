package br.gestao.controller;

import br.gestao.model.Automovel;
import br.gestao.service.AutomovelService;
import io.micronaut.http.annotation.*;
import java.util.List;

@Controller("/api/automoveis")
public class AutomovelController {

    private final AutomovelService automovelService;

    public AutomovelController(AutomovelService automovelService) {
        this.automovelService = automovelService;
    }

    @Get
    public List<Automovel> listar() {
        return automovelService.listarTodos();
    }

    @Get("/{id}")
    public Automovel buscarOuFalhar(@PathVariable Long id) {
        return automovelService.buscarPorId(id);
    }

    @Post
    public Automovel salvar(@Body Automovel automovel) {
        return automovelService.cadastrar(automovel);
    }

    @Put("/{id}")
    public Automovel atualizar(@PathVariable Long id, @Body Automovel automovel) {
        return automovelService.atualizar(id, automovel);
    }

    @Delete("/{id}")
    public void excluir(@PathVariable Long id) {
        automovelService.excluir(id);
    }
}
