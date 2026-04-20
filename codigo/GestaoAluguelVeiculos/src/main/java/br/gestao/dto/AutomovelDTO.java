package br.gestao.dto;

import io.micronaut.serde.annotation.Serdeable;

@Serdeable
public class AutomovelDTO {
    private Long id;
    private String matricula;
    private Integer ano;
    private String marca;
    private String modelo;
    private String placa;
    private String imagemUrl;
    private Double valorDiaria;

    public AutomovelDTO() {}

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
    public Double getValorDiaria() { return valorDiaria; }
    public void setValorDiaria(Double valorDiaria) { this.valorDiaria = valorDiaria; }
}
