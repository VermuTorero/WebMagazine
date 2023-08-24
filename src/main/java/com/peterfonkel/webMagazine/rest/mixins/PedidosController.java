package com.peterfonkel.webMagazine.rest.mixins;


import com.peterfonkel.webMagazine.entities.Direccion;

import com.peterfonkel.webMagazine.entities.Pedido;
import com.peterfonkel.webMagazine.entities.PedidoProducto;
import com.peterfonkel.webMagazine.entities.Publicacion;
import com.peterfonkel.webMagazine.login.usuarios.UsuarioDAO;
import com.peterfonkel.webMagazine.login.usuarios.entidades.Usuario;
import com.peterfonkel.webMagazine.repositories.DireccionDAO;
import com.peterfonkel.webMagazine.repositories.PedidoDAO;
import com.peterfonkel.webMagazine.repositories.PedidoProductoDAO;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.PersistentEntityResource;
import org.springframework.data.rest.webmvc.PersistentEntityResourceAssembler;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.hateoas.CollectionModel;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RepositoryRestController
@RequestMapping(path = "/pedidos/search")
@CrossOrigin
public class PedidosController {
	
	private final static Logger logger = LoggerFactory.getLogger(Publicacion.class);

    @Autowired
    PedidoDAO pedidoDAO;

    @Autowired
    UsuarioDAO usuarioDAO;

    @Autowired
    DireccionDAO direccionDAO;
    
    @Autowired
    PedidoProductoDAO pedidoProductoDAO;

    public PedidoDAO getPedidoDAO() {
		return pedidoDAO;
	}
    

    public UsuarioDAO getUsuarioDAO() {
		return usuarioDAO;
	}

	public DireccionDAO getDireccionDAO() {
		return direccionDAO;
	}

	public PedidoProductoDAO getPedidoProductoDAO() {
		return pedidoProductoDAO;
	}

	@PostMapping(path = "crearPedido")
    @ResponseBody
    public PersistentEntityResource postPedido(PersistentEntityResourceAssembler assembler, @RequestBody Pedido pedido){
        Usuario usuario = getUsuarioDAO().findById(pedido.getUsuario().getId()).get();
        Direccion direccion = getDireccionDAO().findById(pedido.getDireccionEntrega().getIdDireccion()).get(); //cambiar cuando esté implementeda las direcciones
        List<PedidoProducto> productos = new ArrayList<>();
        for (PedidoProducto pedidoProducto:
            pedido.getProductos() ) {
            productos.add(getPedidoProductoDAO().getById(pedidoProducto.getId()));
        }
        pedido.setProductos(productos);
        pedido.setDireccionEntrega(direccion);
        pedido.setUsuario(usuario);
        getPedidoDAO().save(pedido);
        return assembler.toModel(pedido);
    }

    @GetMapping(path = "pedidos-abiertos")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getPedidosAbiertos(PersistentEntityResourceAssembler assembler) {
		List<Pedido> pedidosAbiertos = getPedidoDAO().findByIsCerradoIsFalse();
		return assembler.toCollectionModel(pedidosAbiertos);
	}

    @GetMapping(path = "pedidos-cerrados")
	@ResponseBody
	public CollectionModel<PersistentEntityResource> getPedidosCerrados(PersistentEntityResourceAssembler assembler) {
		List<Pedido> pedidosCerrados = getPedidoDAO().findByIsCerradoIsTrue();
		return assembler.toCollectionModel(pedidosCerrados);
	}
    
    @GetMapping(path = "productosPedido/{idPedido}")
  	@ResponseBody
  	public CollectionModel<PersistentEntityResource> getProductosPedido(PersistentEntityResourceAssembler assembler, @PathVariable ("idPedido") Long idPedido) {
    	Pedido pedido = getPedidoDAO().findByIdPedido(idPedido);
    	logger.info("PEDIDO: ", pedido);
    	List<PedidoProducto> productosPedido = pedido.getProductos();
    	logger.info("Productos: ", productosPedido);
  		return assembler.toCollectionModel(productosPedido);
  	}

}
