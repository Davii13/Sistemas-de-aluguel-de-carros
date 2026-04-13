package br.gestao.controller;

import br.gestao.dto.CreatePedidoRequest;
import br.gestao.dto.PedidoDTO;
import br.gestao.model.Pedido;
import br.gestao.service.PedidoService;
import io.micronaut.http.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@Controller("/api/pedidos")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @Post
    public PedidoDTO criar(@Body CreatePedidoRequest request) {
        Pedido p = pedidoService.criarPedido(request);
        return toDTO(p);
    }

    @Get
    public List<PedidoDTO> listar() {
        return pedidoService.listarTodos().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Post("/{id}/avaliar")
    public PedidoDTO avaliar(@PathVariable Long id, @QueryValue Long agenteId, @QueryValue boolean aprovar) {
        Pedido p = pedidoService.avaliarPedido(id, agenteId, aprovar);
        return toDTO(p);
    }

    @Put("/{id}")
    public PedidoDTO atualizar(@PathVariable Long id, @Body CreatePedidoRequest request) {
        Pedido p = pedidoService.atualizarPedido(id, request);
        return toDTO(p);
    }

    @Delete("/{id}")
    public void cancelar(@PathVariable Long id) {
        pedidoService.cancelarPedido(id);
    }

    private PedidoDTO toDTO(Pedido pedido) {
        PedidoDTO dto = new PedidoDTO();
        dto.setId(pedido.getId());
        if (pedido.getCliente() != null && pedido.getCliente().getUsuario() != null) {
            dto.setClienteId(pedido.getCliente().getUsuario().getId());
        } else if (pedido.getCliente() != null) {
            dto.setClienteId(pedido.getCliente().getId()); // fallback
        }
        dto.setAutomovelId(pedido.getAutomovel().getId());
        dto.setAutomovelMarca(pedido.getAutomovel().getMarca());
        dto.setAutomovelModelo(pedido.getAutomovel().getModelo());
        dto.setDataInicio(pedido.getDataInicio());
        dto.setDataFim(pedido.getDataFim());
        dto.setStatus(pedido.getStatus().name());
        return dto;
    }
}
