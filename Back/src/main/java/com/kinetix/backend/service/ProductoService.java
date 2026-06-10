package com.kinetix.backend.service;

import com.kinetix.backend.common.Genero;
import com.kinetix.backend.dto.*;
import com.kinetix.backend.model.Producto;
import com.kinetix.backend.model.ProductoColor;
import com.kinetix.backend.model.Variante;
import com.kinetix.backend.model.VarianteImagen;
import com.kinetix.backend.repository.ProductoColorRepository;
import com.kinetix.backend.repository.ProductoRepository;
import com.kinetix.backend.repository.VarianteImagenRepository;
import com.kinetix.backend.repository.VarianteRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final ProductoColorRepository productoColorRepository;
    private final VarianteRepository varianteRepository;
    private final VarianteImagenRepository varianteImagenRepository;

    public ProductoService(ProductoRepository productoRepository, ProductoColorRepository productoColorRepository, VarianteRepository varianteRepository, VarianteImagenRepository varianteImagenRepository) {
        this.productoRepository = productoRepository;
        this.productoColorRepository = productoColorRepository;
        this.varianteRepository = varianteRepository;
        this.varianteImagenRepository = varianteImagenRepository;
    }

    public List<Producto> obtenerTodos() {
        return productoRepository.findAll();
    }

    public Producto obtenerPorId(Integer id) {
        return productoRepository.findById(id)
                .orElse(null);
    }

    public Producto guardar(Producto producto) {
        return productoRepository.save(producto);
    }

    public void eliminar(Integer id) {
        productoRepository.deleteById(id);
    }

    public List<Producto> obtenerPorCategoria(Integer idCategoria) {
        return productoRepository
                .findByCategoria_IdCategoria(idCategoria);
    }

    public CatalogoProductoDTO obtenerDetalleProducto(Integer idProducto) {

        Producto producto = productoRepository
                .findById(idProducto)
                .orElseThrow(() ->
                        new RuntimeException("Producto no encontrado"));

        CatalogoProductoDTO dto =
                new CatalogoProductoDTO();

        dto.setIdProducto(producto.getIdProducto());
        dto.setNombre(producto.getNombre());
        dto.setCategoria(producto.getCategoria().getNombre());
        dto.setPrecio("$" + producto.getPrecio());
        dto.setDescripcion(producto.getDescripcion());

        List<ProductoColor> productoColores =
                productoColorRepository
                        .findByProducto_IdProducto(idProducto);

        List<CatalogoColorDTO> coloresDTO =
                new ArrayList<>();

        for (ProductoColor pc : productoColores) {

            CatalogoColorDTO colorDTO =
                    new CatalogoColorDTO();

            colorDTO.setCodigo(
                    pc.getColor().getCodigoHex());

            List<VarianteImagen> imagenes =
                    varianteImagenRepository
                            .findByProductoColor_IdProductoColor(
                                    pc.getIdProductoColor());

            if (!imagenes.isEmpty()) {

                colorDTO.setImagen(
                        imagenes.get(0).getUrlImagen());

            }

            List<Variante> variantes =
                    varianteRepository
                            .findByProductoColor_IdProductoColor(
                                    pc.getIdProductoColor());

            List<String> tallasDTO =
                    new ArrayList<>();

            for (Variante variante : variantes) {

                tallasDTO.add(
                        variante.getTalla().getNombre());

            }

            colorDTO.setTalla(tallasDTO);

            coloresDTO.add(colorDTO);
        }

        dto.setColores(coloresDTO);

        return dto;
    }

    public CatalogoDTO obtenerCatalogo() {

        List<Producto> productos =
                productoRepository.findAll();

        List<CatalogoProductoDTO> hombre =
                new ArrayList<>();

        List<CatalogoProductoDTO> mujer =
                new ArrayList<>();

        for (Producto producto : productos) {

            CatalogoProductoDTO dto =
                    construirProductoCatalogo(producto);

            if (producto.getGenero() == Genero.hombre) {

                hombre.add(dto);

            } else if (producto.getGenero() == Genero.mujer) {

                mujer.add(dto);
            }
        }

        CatalogoDTO catalogo =
                new CatalogoDTO();

        catalogo.setHombre(hombre);
        catalogo.setMujer(mujer);

        return catalogo;
    }

    private CatalogoProductoDTO construirProductoCatalogo(
            Producto producto) {

        CatalogoProductoDTO dto =
                new CatalogoProductoDTO();

        dto.setIdProducto(
                producto.getIdProducto());

        dto.setNombre(
                producto.getNombre());

        dto.setCategoria(
                producto.getCategoria().getNombre());

        dto.setPrecio(
                "$" + producto.getPrecio());

        dto.setDescripcion(
                producto.getDescripcion());

        List<CatalogoColorDTO> coloresDTO =
                new ArrayList<>();

        List<ProductoColor> productoColores =
                productoColorRepository
                        .findByProducto_IdProducto(
                                producto.getIdProducto());

        for (ProductoColor pc : productoColores) {

            CatalogoColorDTO colorDTO =
                    new CatalogoColorDTO();

            colorDTO.setCodigo(
                    pc.getColor().getCodigoHex());

            List<VarianteImagen> imagenes =
                    varianteImagenRepository
                            .findByProductoColor_IdProductoColor(
                                    pc.getIdProductoColor());

            if (!imagenes.isEmpty()) {

                colorDTO.setImagen(
                        imagenes.get(0).getUrlImagen());
            }

            List<Variante> variantes =
                    varianteRepository
                            .findByProductoColor_IdProductoColor(
                                    pc.getIdProductoColor());

            List<String> tallas =
                    new ArrayList<>();

            for (Variante variante : variantes) {

                tallas.add(
                        variante.getTalla().getNombre());
            }

            colorDTO.setTalla(tallas);

            coloresDTO.add(colorDTO);
        }

        dto.setColores(coloresDTO);

        return dto;
    }

    /*
    public List<ProductoDetalleDTO> obtenerTodosConDetalle() {
        List<Producto> productos = productoRepository.findAll();
        List<ProductoDetalleDTO> resultado = new ArrayList<>();

        for (Producto producto : productos) {
            ProductoDetalleDTO dto = new ProductoDetalleDTO();
            dto.setIdProducto(producto.getIdProducto());
            dto.setNombre(producto.getNombre());
            dto.setDescripcion(producto.getDescripcion());
            dto.setPrecio(producto.getPrecio());

            List<ProductoColor> productoColores =
                    productoColorRepository.findByProducto_IdProducto(producto.getIdProducto());

            List<ColorDetalleDTO> coloresDTO = new ArrayList<>();

            for (ProductoColor pc : productoColores) {
                ColorDetalleDTO colorDTO = new ColorDetalleDTO();
                colorDTO.setIdColor(pc.getColor().getIdColor());
                colorDTO.setNombre(pc.getColor().getNombre());

                // imágenes
                List<VarianteImagen> imagenes =
                        varianteImagenRepository.findByProductoColor_IdProductoColor(pc.getIdProductoColor());
                List<ImagenDTO> imagenesDTO = imagenes.stream().map(img -> {
                    ImagenDTO dtoImg = new ImagenDTO();
                    dtoImg.setIdImagen(img.getIdImagen());
                    dtoImg.setUrlImagen(img.getUrlImagen());
                    dtoImg.setPrincipal(img.getPrincipal());
                    return dtoImg;
                }).toList();
                colorDTO.setImagenes(imagenesDTO);

                // tallas
                List<Variante> variantes =
                        varianteRepository.findByProductoColor_IdProductoColor(pc.getIdProductoColor());
                List<TallaDTO> tallasDTO = variantes.stream().map(var -> {
                    TallaDTO tallaDTO = new TallaDTO();
                    tallaDTO.setIdTalla(var.getTalla().getIdTalla());
                    tallaDTO.setNombre(var.getTalla().getNombre());
                    tallaDTO.setStock(var.getStock());
                    return tallaDTO;
                }).toList();
                colorDTO.setTallas(tallasDTO);

                coloresDTO.add(colorDTO);
            }

            dto.setColores(coloresDTO);
            dto.setGenero(producto.getGenero());
            resultado.add(dto);
        }

        return resultado;
    }
    */

}