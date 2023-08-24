package com.peterfonkel.webMagazine.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.peterfonkel.webMagazine.entities.Pedido;

@RepositoryRestResource(path = "pedidos", itemResourceRel = "pedido", collectionResourceRel = "pedidos")
public interface PedidoDAO extends JpaRepository<Pedido, Long>{
    
    @Override
	List<Pedido> findAll();

    Pedido findByIdPedido(Long id);
    List<Pedido> findByIsCerradoIsTrue();
    List<Pedido> findByIsCerradoIsFalse();
}
