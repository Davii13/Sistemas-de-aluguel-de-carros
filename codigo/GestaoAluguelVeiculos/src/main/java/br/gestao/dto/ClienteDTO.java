package br.gestao.dto;

import io.micronaut.serde.annotation.Serdeable;
import java.util.List;

@Serdeable
public record ClienteDTO(
    Long id,
    String nome,
    String cpf,
    String rg,
    String endereco,
    String profissao,
    List<RendimentoDTO> rendimentos
) {}