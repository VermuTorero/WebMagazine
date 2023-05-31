package com.peterfonkel.webMagazine.login.usuarios;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.RequestParam;
import com.peterfonkel.webMagazine.login.roles.enums.RolNombre;
import com.peterfonkel.webMagazine.login.usuarios.entidades.Usuario;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RepositoryRestResource(path = "usuarios", 
						itemResourceRel = "usuario", 
						collectionResourceRel = "usuarios")
public interface UsuarioDAO extends JpaRepository<Usuario, Integer> {
	
    Optional<Usuario> findByEmail(@RequestParam String email);
    boolean existsByEmail(String email);
    Usuario findById(Long id);
    List<Usuario> findByRoles_RolNombre(String rol);
    List<Usuario> findAll();
    List<Usuario> findByRoles_RolNombreIn(Set<RolNombre> roles);
}
