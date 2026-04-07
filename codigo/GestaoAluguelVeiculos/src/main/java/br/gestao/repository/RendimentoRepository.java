package br.gestao.repository;

import io.micronaut.data.annotation.Repository;
import io.micronaut.data.jpa.repository.JpaRepository;
import br.gestao.model.Rendimento;

@Repository
public interface RendimentoRepository extends JpaRepository<Rendimento, Long> {
}