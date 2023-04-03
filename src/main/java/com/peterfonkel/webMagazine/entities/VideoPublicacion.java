package com.peterfonkel.webMagazine.entities;

import javax.persistence.Entity;

@Entity
public class VideoPublicacion extends Bloque{

	private String urlVideo;

	public VideoPublicacion() {
		super();
	}

	public VideoPublicacion(String urlVideo) {
		this();
		this.urlVideo = urlVideo;
	}

	public String getUrlVideo() {
		return urlVideo;
	}

	public void setUrlVideo(String urlVideo) {
		this.urlVideo = urlVideo;
	}
	
	
	
}
