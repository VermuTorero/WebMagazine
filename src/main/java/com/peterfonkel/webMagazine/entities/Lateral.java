package com.peterfonkel.webMagazine.entities;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity(name = "AreaLateral")
public class Lateral {
	

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	Long id;
	@Column(length = 1000)
	private String htmlPodcast;
	@Column(length = 1000)
	private String htmlTwitter;
	@Column(length = 1000)
    private String htmlTwitter2;
	@Column(length = 1000)
    private String htmlTwitter3;
    
	public Lateral() {
		super();
	}

	

	public Lateral(String htmlPodcast, String htmlTwitter, String htmlTwitter2, String htmlTwitter3) {
		super();
		this.htmlPodcast = htmlPodcast;
		this.htmlTwitter = htmlTwitter;
		this.htmlTwitter2 = htmlTwitter2;
		this.htmlTwitter3 = htmlTwitter3;
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



	public String getHtmlTwitter2() {
		return htmlTwitter2;
	}



	public void setHtmlTwitter2(String htmlTwitter2) {
		this.htmlTwitter2 = htmlTwitter2;
	}



	public String getHtmlTwitter3() {
		return htmlTwitter3;
	}



	public void setHtmlTwitter3(String htmlTwitter3) {
		this.htmlTwitter3 = htmlTwitter3;
	}


	
	
}
