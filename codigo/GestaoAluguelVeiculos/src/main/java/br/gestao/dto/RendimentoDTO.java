package br.gestao.dto;

import io.micronaut.serde.annotation.Serdeable;

@Serdeable
public record RendimentoDTO(
    String fonte,
    Double valor
) {}