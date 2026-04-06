package br.gestao.repository;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.jpa.repository.JpaRepository;
import br.gestao.model.Cliente;
@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
}