package br.gestao.model;

import io.micronaut.serde.annotation.Serdeable;
import jakarta.persistence.*;
import br.gestao.enums.TipoProprietario;

@Serdeable
@Entity
@Table(name = "automovel")
public class Automovel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String matricula;
    private Integer ano;
    private String marca;
    private String modelo;
    private String placa;
    private String imagemUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoProprietario tipoProprietario;

    private Long proprietarioId; // ID of the Cliente, Agente (Banco/Empresa)

    public Automovel() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getMatricula() { return matricula; }
    public void setMatricula(String matricula) { this.matricula = matricula; }
    
    public Integer getAno() { return ano; }
    public void setAno(Integer ano) { this.ano = ano; }
    
    public String getMarca() { return marca; }
    public void setMarca(String marca) { this.marca = marca; }
    
    public String getModelo() { return modelo; }
    public void setModelo(String modelo) { this.modelo = modelo; }
    
    public String getPlaca() { return placa; }
    public void setPlaca(String placa) { this.placa = placa; }
    
    public String getImagemUrl() { return imagemUrl; }
    public void setImagemUrl(String imagemUrl) { this.imagemUrl = imagemUrl; }

    public TipoProprietario getTipoProprietario() { return tipoProprietario; }
    public void setTipoProprietario(TipoProprietario tipoProprietario) { this.tipoProprietario = tipoProprietario; }
    
    public Long getProprietarioId() { return proprietarioId; }
    public void setProprietarioId(Long proprietarioId) { this.proprietarioId = proprietarioId; }
}
