package com.peterfonkel.webMagazine.entities;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class ConfigPrecio {

    @Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;
    private float precioInvitacion;
    private float precioSub1;
    private float precioSub2;
    private float precioSub3;
    private float precioSub4;
    private float precioSub5;
    
    public ConfigPrecio() {
    }

    public Long getId() {
        return Id;
    }

    public void setId(Long id) {
        Id = id;
    }

    public float getPrecioInvitacion() {
        return precioInvitacion;
    }

    public void setPrecioInvitacion(float precioInvitacion) {
        this.precioInvitacion = precioInvitacion;
    }

    public float getPrecioSub1() {
        return precioSub1;
    }

    public void setPrecioSub1(float precioSub1) {
        this.precioSub1 = precioSub1;
    }

    public float getPrecioSub2() {
        return precioSub2;
    }

    public void setPrecioSub2(float precioSub2) {
        this.precioSub2 = precioSub2;
    }

    public float getPrecioSub3() {
        return precioSub3;
    }

    public void setPrecioSub3(float precioSub3) {
        this.precioSub3 = precioSub3;
    }

    public float getPrecioSub4() {
        return precioSub4;
    }

    public void setPrecioSub4(float precioSub4) {
        this.precioSub4 = precioSub4;
    }

    public float getPrecioSub5() {
        return precioSub5;
    }

    public void setPrecioSub5(float precioSub5) {
        this.precioSub5 = precioSub5;
    }

    


}
