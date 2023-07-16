package com.peterfonkel.webMagazine.login.usuarios;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestParam;
import com.peterfonkel.webMagazine.login.roles.enums.RolNombre;
import com.peterfonkel.webMagazine.login.usuarios.entidades.Usuario;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RepositoryRestResource(path = "usuarios", itemResourceRel = "usuario", collectionResourceRel = "usuarios", exported=false)
public interface UsuarioDAO extends JpaRepository<Usuario, Long> {
	
	Optional<Usuario> findByEmail(@RequestParam String email);

	boolean existsByEmail(String email);

	Optional<Usuario> findById(Long id);

	List<Usuario> findByRoles_RolNombre(RolNombre rolNombre);

	List<Usuario> findAll();

	List<Usuario> findByRoles_RolNombreIn(Set<RolNombre> roles);

	Usuario findByClaveActivacion(String clave);

	Usuario findByClaveRecuperacion(String claveRecuperacion);
	
	void deleteById(Long id);

	Usuario findByMensaje_Id(Long id);

}
