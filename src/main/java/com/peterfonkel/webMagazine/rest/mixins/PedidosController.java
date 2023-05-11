package com.peterfonkel.webMagazine.rest.mixins;


import com.peterfonkel.webMagazine.entities.Direccion;
import com.peterfonkel.webMagazine.entities.Pedido;
import com.peterfonkel.webMagazine.entities.PedidoProducto;
import com.peterfonkel.webMagazine.entities.Usuario;
import com.peterfonkel.webMagazine.repositories.DireccionDAO;
import com.peterfonkel.webMagazine.repositories.PedidoDAO;
import com.peterfonkel.webMagazine.repositories.PedidoProductoDAO;
import com.peterfonkel.webMagazine.repositories.UsuarioDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.PersistentEntityResource;
import org.springframework.data.rest.webmvc.PersistentEntityResourceAssembler;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RepositoryRestController
@RequestMapping(path = "/pedidos/search")
@CrossOrigin
public class PedidosController {

    @Autowired
    PedidoDAO pedidoDAO;

    @Autowired
    UsuarioDAO usuarioDAO;

    @Autowired
    DireccionDAO direccionDAO;
    
    @Autowired
    PedidoProductoDAO pedidoProductoDAO;



    @PostMapping(path = "crearPedido")
    @ResponseBody
    public PersistentEntityResource postPedido(PersistentEntityResourceAssembler assembler, @RequestBody Pedido pedido){
        Usuario usuario = usuarioDAO.getById(pedido.getUsuario().getId());
        Direccion direccion = direccionDAO.getById(pedido.getDireccionEntrega().getIdDireccion()); //cambiar cuando esté implementeda las direcciones
        List<PedidoProducto> productos = new ArrayList<>();
        for (PedidoProducto pedidoProducto:
            pedido.getProductos() ) {
            productos.add(pedidoProductoDAO.getById(pedidoProducto.getId()));
        }
        pedido.setProductos(productos);
        pedido.setDireccionEntrega(direccion);
        pedido.setUsuario(usuario);
        pedidoDAO.save(pedido);
        return assembler.toModel(pedido);
    }

}
