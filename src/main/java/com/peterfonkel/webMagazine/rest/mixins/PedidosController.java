package com.peterfonkel.webMagazine.rest.mixins;


import com.peterfonkel.webMagazine.entities.Pedido;
import com.peterfonkel.webMagazine.entities.Usuario;
import com.peterfonkel.webMagazine.repositories.PedidoDAO;
import com.peterfonkel.webMagazine.repositories.UsuarioDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.PersistentEntityResource;
import org.springframework.data.rest.webmvc.PersistentEntityResourceAssembler;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.web.bind.annotation.*;

@RepositoryRestController
@RequestMapping(path = "/pedidos/search")
@CrossOrigin
public class PedidosController {

    @Autowired
    PedidoDAO pedidoDAO;

    @Autowired
    UsuarioDAO usuarioDAO;



    @PostMapping(path = "crearPedido")
    @ResponseBody
    public PersistentEntityResource postPedido(PersistentEntityResourceAssembler assembler, @RequestBody Pedido pedido){
        Usuario usuario = usuarioDAO.getById(pedido.getUsuario().getId());
        pedido.setUsuario(usuario);
        pedidoDAO.save(pedido);
        return assembler.toModel(pedido);
    }

}
