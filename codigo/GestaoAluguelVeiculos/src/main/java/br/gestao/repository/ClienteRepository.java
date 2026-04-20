package br.gestao.repository;

import io.micronaut.data.annotation.Repository;
import io.micronaut.data.annotation.Query;
import io.micronaut.data.repository.CrudRepository;
import br.gestao.model.Cliente;
import java.util.Optional;
import java.util.List;

@Repository
public interface ClienteRepository extends CrudRepository<Cliente, Long> {
    
    @Query("SELECT c FROM Cliente c WHERE c.usuario.id = :usuarioId")
    Optional<Cliente> findByUsuarioId(Long usuarioId);
    
    List<Cliente> findAll();
}