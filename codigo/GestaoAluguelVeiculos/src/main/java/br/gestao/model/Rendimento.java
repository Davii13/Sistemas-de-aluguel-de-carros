package br.gestao.model;

import io.micronaut.serde.annotation.Serdeable;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Serdeable
@Entity
@Table(name = "rendimento")
public class Rendimento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fonte;
    private Double valor;

    @ManyToOne
    @JoinColumn(name = "cliente_id")
    @JsonIgnore // Impede o erro 500 de recursão infinita
    private Cliente cliente;

    public Rendimento() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getFonte() { return fonte; }
    public void setFonte(String fonte) { this.fonte = fonte; }
    public Double getValor() { return valor; }
    public void setValor(Double valor) { this.valor = valor; }

    public Cliente getCliente() { return cliente; }
    public void setCliente(Cliente cliente) { this.cliente = cliente; }
}