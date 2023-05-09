package com.peterfonkel.webMagazine.entities;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Lateral {
	

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	Long id;
	private String htmlPodcast;
	private String htmlTwitter;
    private String htmlInstagram;
    private String htmlFacebook;
    
	public Lateral() {
		super();
	}

	public Long getId() {
		return id;
	}
	

	public Lateral(String htmlPodcast, String htmlTwitter, String htmlInstagram, String htmlFacebook) {
		super();
		this.htmlPodcast = htmlPodcast;
		this.htmlTwitter = htmlTwitter;
		this.htmlInstagram = htmlInstagram;
		this.htmlFacebook = htmlFacebook;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getHtmlPodcast() {
		return htmlPodcast;
	}

	public void setHtmlPodcast(String htmlPodcast) {
		this.htmlPodcast = htmlPodcast;
	}

	public String getHtmlTwitter() {
		return htmlTwitter;
	}

	public void setHtmlTwitter(String htmlTwitter) {
		this.htmlTwitter = htmlTwitter;
	}

	public String getHtmlInstagram() {
		return htmlInstagram;
	}

	public void setHtmlInstagram(String htmlInstagram) {
		this.htmlInstagram = htmlInstagram;
	}

	public String getHtmlFacebook() {
		return htmlFacebook;
	}

	public void setHtmlFacebook(String htmlFacebook) {
		this.htmlFacebook = htmlFacebook;
	}
	
	
}
