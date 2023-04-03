package com.peterfonkel.webMagazine.entities;

import javax.persistence.Entity;

@Entity
public class PodcastPublicacion extends Bloque{

	private String linkPodcast;

	public PodcastPublicacion() {
		super();
	}

	public PodcastPublicacion(String linkPodcast) {
		this();
		this.linkPodcast = linkPodcast;
	}

	public String getLinkPodcast() {
		return linkPodcast;
	}

	public void setLinkPodcast(String linkPodcast) {
		this.linkPodcast = linkPodcast;
	}
	
	
}
