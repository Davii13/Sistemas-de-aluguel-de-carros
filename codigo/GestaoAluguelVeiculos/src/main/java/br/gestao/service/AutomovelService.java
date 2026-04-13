package br.gestao.service;

import br.gestao.model.Automovel;
import br.gestao.repository.AutomovelRepository;
import jakarta.inject.Singleton;
import java.util.List;

@Singleton
public class AutomovelService {

    private final AutomovelRepository automovelRepository;

    public AutomovelService(AutomovelRepository automovelRepository) {
        this.automovelRepository = automovelRepository;
    }

    public List<Automovel> listarTodos() {
        return (List<Automovel>) automovelRepository.findAll();
    }

    public Automovel buscarPorId(Long id) {
        return automovelRepository.findById(id).orElse(null);
    }

    public Automovel cadastrar(Automovel automovel) {
        return automovelRepository.save(automovel);
    }

    public Automovel atualizar(Long id, Automovel automovel) {
        if (!automovelRepository.existsById(id))
            return null;
        automovel.setId(id);
        return automovelRepository.update(automovel);
    }

    public void excluir(Long id) {
        automovelRepository.deleteById(id);
    }
}
