package com.peterfonkel.webMagazine.login.dto;

public class AuthenticationRequest {
	private String user;
	private String password;
	public AuthenticationRequest() {
		super();
	}
	public String getUser() {
		return user;
	}
	public void setUser(String user) {
		this.user = user;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
}
