package br.gestao.model;

import io.micronaut.serde.annotation.Serdeable;
import jakarta.persistence.*;
import java.util.List;
import java.util.ArrayList;

@Serdeable
@Entity
@Table(name = "cliente")
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String cpf;
    private String rg;
    private String endereco;
    private String profissao;

    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<Rendimento> rendimentos = new ArrayList<>();

    public Cliente() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }
    public String getRg() { return rg; }
    public void setRg(String rg) { this.rg = rg; }
    public String getEndereco() { return endereco; }
    public void setEndereco(String endereco) { this.endereco = endereco; }
    public String getProfissao() { return profissao; }
    public void setProfissao(String profissao) { this.profissao = profissao; }
    
    public List<Rendimento> getRendimentos() { return rendimentos; }
    public void setRendimentos(List<Rendimento> rendimentos) { this.rendimentos = rendimentos; }
}