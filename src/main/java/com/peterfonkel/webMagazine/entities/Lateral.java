package com.peterfonkel.webMagazine.entities;

import javax.persistence.Id;

public class Lateral {
	

	@Id
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
