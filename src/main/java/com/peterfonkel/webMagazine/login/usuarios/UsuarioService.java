package com.peterfonkel.webMagazine.login.usuarios;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.peterfonkel.webMagazine.login.usuarios.entidades.Usuario;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UsuarioService {

    @Autowired
    UsuarioDAO usuarioDAO;

    public Optional<Usuario> getByEmail(String email){
        return usuarioDAO.findByEmail(email);
    }

    public boolean existsEmail(String email){
        return usuarioDAO.existsByEmail(email);
    }
    
    public Usuario save(Usuario usuario){
        return usuarioDAO.save(usuario);
    }
    
    public void deleteUsuarioById(Long id) {
    	usuarioDAO.deleteById(id);
    }
}
