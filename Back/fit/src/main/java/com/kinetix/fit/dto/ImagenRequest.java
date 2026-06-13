package com.kinetix.fit.dto;

public class ImagenRequest {

    private String urlImagen;
    private Boolean principal;

    public ImagenRequest() {
    }

    public String getUrlImagen() {
        return urlImagen;
    }

    public void setUrlImagen(String urlImagen) {
        this.urlImagen = urlImagen;
    }

    public Boolean getPrincipal() {
        return principal;
    }

    public void setPrincipal(Boolean principal) {
        this.principal = principal;
    }
}