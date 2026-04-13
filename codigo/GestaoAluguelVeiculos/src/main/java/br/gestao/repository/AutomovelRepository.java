package br.gestao.repository;

import br.gestao.model.Automovel;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.repository.CrudRepository;

@Repository
public interface AutomovelRepository extends CrudRepository<Automovel, Long> {
}
