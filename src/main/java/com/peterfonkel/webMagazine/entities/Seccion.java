package com.peterfonkel.webMagazine.entities;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

@Entity
public class Seccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    private String nombreSeccion;

    @OneToMany(mappedBy = "seccion")
    private List<Producto> productosSeccion;

    public String getNombreSeccion() {
        return nombreSeccion;
    }

    public void setNombreSeccion(String nombreSeccion) {
        this.nombreSeccion = nombreSeccion;
    }

    public List<Producto> getProductosSeccion() {
        return productosSeccion;
    }

    public void setProductosSeccion(List<Producto> productosSeccion) {
        this.productosSeccion = productosSeccion;
    }

    public void addProducto(Producto producto) {
        this.productosSeccion.add(producto);
        producto.setSeccion(this);
    }

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}
    

}
