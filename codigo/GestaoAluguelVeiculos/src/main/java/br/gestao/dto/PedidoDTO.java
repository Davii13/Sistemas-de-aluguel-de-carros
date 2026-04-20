package br.gestao.dto;

import io.micronaut.serde.annotation.Serdeable;
import java.time.LocalDate;

@Serdeable
public class PedidoDTO {
    private Long id;
    private Long clienteId;
    private Long automovelId;
    private String automovelMarca;
    private String automovelModelo;
    private LocalDate dataInicio;
    private LocalDate dataFim;
    private String status;
    private Double valorTotal;
    private Double valorDiaria;

    public PedidoDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getClienteId() { return clienteId; }
    public void setClienteId(Long clienteId) { this.clienteId = clienteId; }
    public Long getAutomovelId() { return automovelId; }
    public void setAutomovelId(Long automovelId) { this.automovelId = automovelId; }
    public String getAutomovelMarca() { return automovelMarca; }
    public void setAutomovelMarca(String automovelMarca) { this.automovelMarca = automovelMarca; }
    public String getAutomovelModelo() { return automovelModelo; }
    public void setAutomovelModelo(String automovelModelo) { this.automovelModelo = automovelModelo; }
    public LocalDate getDataInicio() { return dataInicio; }
    public void setDataInicio(LocalDate dataInicio) { this.dataInicio = dataInicio; }
    public LocalDate getDataFim() { return dataFim; }
    public void setDataFim(LocalDate dataFim) { this.dataFim = dataFim; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Double getValorTotal() { return valorTotal; }
    public void setValorTotal(Double valorTotal) { this.valorTotal = valorTotal; }
    public Double getValorDiaria() { return valorDiaria; }
    public void setValorDiaria(Double valorDiaria) { this.valorDiaria = valorDiaria; }
}
