package br.gestao.dto;

import io.micronaut.serde.annotation.Serdeable;

@Serdeable
public class ContratoDTO {
    private Long id;
    private Long pedidoId;
    private Double valorTotal;
    private Boolean isCreditoConcedido;

    public ContratoDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getPedidoId() { return pedidoId; }
    public void setPedidoId(Long pedidoId) { this.pedidoId = pedidoId; }
    public Double getValorTotal() { return valorTotal; }
    public void setValorTotal(Double valorTotal) { this.valorTotal = valorTotal; }
    public Boolean getIsCreditoConcedido() { return isCreditoConcedido; }
    public void setIsCreditoConcedido(Boolean isCreditoConcedido) { this.isCreditoConcedido = isCreditoConcedido; }
}
