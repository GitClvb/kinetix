package com.kinetix.fit.model;

import jakarta.persistence.*;

    @Entity
    @Table(name = "variantes")
    public class Variante {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "id_variante")
        private Integer idVariante;

        @ManyToOne
        @JoinColumn(name = "id_producto_color", nullable = false)
        private ProductoColor productoColor;

        @ManyToOne
        @JoinColumn(name = "id_talla", nullable = false)
        private Talla talla;

        @Column(nullable = false)
        private Integer stock;

        public Variante(Integer idVariante, ProductoColor productoColor, Integer stock, Talla talla) {
            this.idVariante = idVariante;
            this.productoColor = productoColor;
            this.stock = stock;
            this.talla = talla;
        }

        public Variante(){ }

        public Integer getIdVariante() {
            return idVariante;
        }

        public void setIdVariante(Integer idVariante) {
            this.idVariante = idVariante;
        }

        public ProductoColor getProductoColor() {
            return productoColor;
        }

        public void setProductoColor(ProductoColor productoColor) {
            this.productoColor = productoColor;
        }

        public Integer getStock() {
            return stock;
        }

        public void setStock(Integer stock) {
            this.stock = stock;
        }

        public Talla getTalla() {
            return talla;
        }

        public void setTalla(Talla talla) {
            this.talla = talla;
        }

        @Override
        public String toString() {
            return "Variante{" +
                    "idVariante=" + idVariante +
                    ", productoColor=" + productoColor +
                    ", talla=" + talla +
                    ", stock=" + stock +
                    '}';
        }
    }
