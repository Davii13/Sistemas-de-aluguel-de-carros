package br.gestao.model;

import io.micronaut.serde.annotation.Serdeable;
import jakarta.persistence.*;

@Serdeable
@Entity
@Table(name = "contrato")
public class Contrato {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "pedido_id", nullable = false)
    private Pedido pedido;

    private Double valorTotal;
    
    private Boolean isCreditoConcedido = false;

    @ManyToOne
    @JoinColumn(name = "banco_id")
    private Agente banco; // Banco que concedeu o credito (se houver)

    public Contrato() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Pedido getPedido() { return pedido; }
    public void setPedido(Pedido pedido) { this.pedido = pedido; }

    public Double getValorTotal() { return valorTotal; }
    public void setValorTotal(Double valorTotal) { this.valorTotal = valorTotal; }

    public Boolean getIsCreditoConcedido() { return isCreditoConcedido; }
    public void setIsCreditoConcedido(Boolean isCreditoConcedido) { this.isCreditoConcedido = isCreditoConcedido; }

    public Agente getBanco() { return banco; }
    public void setBanco(Agente banco) { this.banco = banco; }
}
