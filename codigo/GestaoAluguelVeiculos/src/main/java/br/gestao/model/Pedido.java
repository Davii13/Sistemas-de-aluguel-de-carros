package br.gestao.model;

import io.micronaut.serde.annotation.Serdeable;
import jakarta.persistence.*;
import br.gestao.enums.StatusPedido;
import java.time.LocalDate;

@Serdeable
@Entity
@Table(name = "pedido")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "automovel_id", nullable = false)
    private Automovel automovel;

    @ManyToOne
    @JoinColumn(name = "agente_avaliador_id")
    private Agente agenteAvaliador;

    private LocalDate dataInicio;
    private LocalDate dataFim;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusPedido status = StatusPedido.PENDENTE;

    private Double valorTotal;

    public Pedido() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Cliente getCliente() { return cliente; }
    public void setCliente(Cliente cliente) { this.cliente = cliente; }
    
    public Automovel getAutomovel() { return automovel; }
    public void setAutomovel(Automovel automovel) { this.automovel = automovel; }
    
    public Agente getAgenteAvaliador() { return agenteAvaliador; }
    public void setAgenteAvaliador(Agente agenteAvaliador) { this.agenteAvaliador = agenteAvaliador; }
    
    public LocalDate getDataInicio() { return dataInicio; }
    public void setDataInicio(LocalDate dataInicio) { this.dataInicio = dataInicio; }
    
    public LocalDate getDataFim() { return dataFim; }
    public void setDataFim(LocalDate dataFim) { this.dataFim = dataFim; }
    
    public StatusPedido getStatus() { return status; }
    public void setStatus(StatusPedido status) { this.status = status; }

    public Double getValorTotal() { return valorTotal; }
    public void setValorTotal(Double valorTotal) { this.valorTotal = valorTotal; }
}
