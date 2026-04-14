package br.gestao.service;

import br.gestao.dto.CreatePedidoRequest;
import br.gestao.enums.StatusPedido;
import br.gestao.model.*;
import br.gestao.repository.*;
import jakarta.inject.Singleton;
import jakarta.transaction.Transactional;
import java.time.LocalDate;
import java.util.List;

@Singleton
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ClienteRepository clienteRepository;
    private final AutomovelRepository automovelRepository;
    private final ContratoRepository contratoRepository;
    private final AgenteRepository agenteRepository;

    public PedidoService(PedidoRepository pedidoRepository, ClienteRepository clienteRepository, 
                         AutomovelRepository automovelRepository, ContratoRepository contratoRepository,
                         AgenteRepository agenteRepository) {
        this.pedidoRepository = pedidoRepository;
        this.clienteRepository = clienteRepository;
        this.automovelRepository = automovelRepository;
        this.contratoRepository = contratoRepository;
        this.agenteRepository = agenteRepository;
    }

    public Pedido criarPedido(CreatePedidoRequest request) {
        Cliente cliente = clienteRepository.findByUsuarioId(request.getClienteId())
            .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado"));
        Automovel automovel = automovelRepository.findById(request.getAutomovelId())
            .orElseThrow(() -> new IllegalArgumentException("Automóvel não encontrado"));

        Pedido pedido = new Pedido();
        pedido.setCliente(cliente);
        pedido.setAutomovel(automovel);
        pedido.setDataInicio(LocalDate.parse(request.getDataInicio()));
        pedido.setDataFim(LocalDate.parse(request.getDataFim()));
        pedido.setStatus(StatusPedido.PENDENTE);

        return pedidoRepository.save(pedido);
    }

    public List<Pedido> listarTodos() {
        return (List<Pedido>) pedidoRepository.findAll();
    }

    @Transactional
    public Pedido avaliarPedido(Long pedidoId, Long agenteId, boolean aprovar) {
        Pedido pedido = pedidoRepository.findById(pedidoId)
            .orElseThrow(() -> new IllegalArgumentException("Pedido não encontrado"));
            
        if (pedido.getStatus() != StatusPedido.PENDENTE) {
             throw new IllegalArgumentException("Este contrato já foi decidido anteriormente.");
        }
            
        Agente agente = agenteRepository.findByUsuarioId(agenteId)
            .orElseThrow(() -> new IllegalArgumentException("Agente Administrativo não encontrado"));

        pedido.setAgenteAvaliador(agente);

        if (aprovar) {
            pedido.setStatus(StatusPedido.APROVADO);
            
            // Cria contrato
            Contrato contrato = new Contrato();
            contrato.setPedido(pedido);
            contrato.setValorTotal(1500.0); // Mock value calculation based on premium car
            
            // Regra simples: Se o agente é banco, concede crédito.
            if (agente.getTipoAgente() == br.gestao.enums.TipoAgente.BANCO) {
                contrato.setIsCreditoConcedido(true);
                contrato.setBanco(agente);
            }
            
            contratoRepository.save(contrato);
        } else {
            pedido.setStatus(StatusPedido.REJEITADO);
        }

        return pedidoRepository.save(pedido);
    }

    public Pedido atualizarPedido(Long id, CreatePedidoRequest request) {
        Pedido pedido = pedidoRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Pedido não encontrado"));
            
        Automovel automovel = automovelRepository.findById(request.getAutomovelId())
            .orElseThrow(() -> new IllegalArgumentException("Automóvel não encontrado"));

        pedido.setAutomovel(automovel);
        pedido.setDataInicio(LocalDate.parse(request.getDataInicio()));
        pedido.setDataFim(LocalDate.parse(request.getDataFim()));
        
        return pedidoRepository.update(pedido);
    }
    
    @Transactional
    public void cancelarPedido(Long id) {
        contratoRepository.deleteByPedidoId(id);
        pedidoRepository.deleteById(id);
    }
}
