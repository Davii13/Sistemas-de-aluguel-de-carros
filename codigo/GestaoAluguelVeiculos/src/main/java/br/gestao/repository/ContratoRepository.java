package br.gestao.repository;

import br.gestao.model.Contrato;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.repository.CrudRepository;

@Repository
public interface ContratoRepository extends CrudRepository<Contrato, Long> {
    void deleteByPedidoId(Long pedidoId);
}
