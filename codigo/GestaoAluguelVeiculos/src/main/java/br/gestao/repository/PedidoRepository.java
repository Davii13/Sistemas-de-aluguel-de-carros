package br.gestao.repository;

import br.gestao.model.Pedido;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.repository.CrudRepository;

@Repository
public interface PedidoRepository extends CrudRepository<Pedido, Long> {
}
