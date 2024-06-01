package com.peterfonkel.webMagazine.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.peterfonkel.webMagazine.entities.PedidoProducto;

@RepositoryRestResource(path = "pedidoProductos", itemResourceRel = "pedidoProducto", collectionResourceRel = "pedidoProductos")
public interface PedidoProductoDAO extends JpaRepository<PedidoProducto, Long> {
    @Override
	List<PedidoProducto> findAll();

    List<PedidoProducto> findByPedido_IdPedido(Long idPedido);
    
    void deleteByProductoId(Long id);

}
