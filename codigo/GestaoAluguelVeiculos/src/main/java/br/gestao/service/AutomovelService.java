package br.gestao.service;

import br.gestao.model.Automovel;
import br.gestao.model.Pedido;
import br.gestao.repository.AutomovelRepository;
import br.gestao.repository.ContratoRepository;
import br.gestao.repository.PedidoRepository;
import jakarta.inject.Singleton;
import jakarta.transaction.Transactional;
import java.util.List;

@Singleton
public class AutomovelService {

    private final AutomovelRepository automovelRepository;
    private final PedidoRepository pedidoRepository;
    private final ContratoRepository contratoRepository;

    public AutomovelService(AutomovelRepository automovelRepository, PedidoRepository pedidoRepository, ContratoRepository contratoRepository) {
        this.automovelRepository = automovelRepository;
        this.pedidoRepository = pedidoRepository;
        this.contratoRepository = contratoRepository;
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

    @Transactional
    public Automovel atualizar(Long id, Automovel automovel) {
        if (!automovelRepository.existsById(id))
            return null;
        automovel.setId(id);
        return automovelRepository.update(automovel);
    }

    @Transactional
    public void excluir(Long id) {
        List<Pedido> pedidos = pedidoRepository.findByAutomovelId(id);
        for (Pedido p : pedidos) {
            contratoRepository.deleteByPedidoId(p.getId());
            pedidoRepository.deleteById(p.getId());
        }
        automovelRepository.deleteById(id);
    }
}
