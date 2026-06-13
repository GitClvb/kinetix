package com.kinetix.fit.service;

import com.kinetix.fit.dto.*;
import com.kinetix.fit.enums.EstadoProducto;
import com.kinetix.fit.enums.GeneroProducto;
import com.kinetix.fit.enums.PrincipalImagen;
import com.kinetix.fit.model.*;
import com.kinetix.fit.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProductoService {

    private final ProductoRepository       productoRepository;
    private final ProductoColorRepository  productoColorRepository;
    private final VarianteRepository       varianteRepository;
    private final VarianteImagenRepository varianteImagenRepository;
    private final CategoriaRepository      categoriaRepository;
    private final ColorRepository          colorRepository;
    private final TallaRepository          tallaRepository;

    public ProductoService(ProductoRepository productoRepository,
                           ProductoColorRepository productoColorRepository,
                           VarianteRepository varianteRepository,
                           VarianteImagenRepository varianteImagenRepository,
                           CategoriaRepository categoriaRepository,
                           ColorRepository colorRepository,
                           TallaRepository tallaRepository) {
        this.productoRepository       = productoRepository;
        this.productoColorRepository  = productoColorRepository;
        this.varianteRepository       = varianteRepository;
        this.varianteImagenRepository = varianteImagenRepository;
        this.categoriaRepository      = categoriaRepository;
        this.colorRepository          = colorRepository;
        this.tallaRepository          = tallaRepository;
    }

    public List<Producto> obtenerTodos() {
        return productoRepository.findAll();
    }

    public Producto obtenerPorId(Integer id) {
        return productoRepository.findById(id).orElse(null);
    }

    public Producto guardar(Producto producto) {
        return productoRepository.save(producto);
    }

    public void eliminar(Integer id) {
        productoRepository.deleteById(id);
    }

    public List<Producto> obtenerPorCategoria(Integer idCategoria) {
        return productoRepository.findByCategoria_IdCategoria(idCategoria);
    }

    // ── Detalle público de producto (usado por producto.js) ──────────────────
    //
    // FUSIÓN:
    // · De tu compañero: filtro por estado ACTIVO y filtro de variantes sin stock
    // · Tuyo: se popula `variantes` (List<VarianteDTO>) en cada CatalogoColorDTO
    //   para que producto.js pueda resolver talla → idVariante al agregar al carrito

    public CatalogoProductoDTO obtenerDetalleProducto(Integer idProducto) {

        Producto producto = productoRepository
                .findByIdProductoAndEstado(idProducto, EstadoProducto.activo)
                .orElseThrow(() -> new RuntimeException("Producto no disponible"));

        CatalogoProductoDTO dto = new CatalogoProductoDTO();
        dto.setIdProducto(producto.getIdProducto());
        dto.setNombre(producto.getNombre());
        dto.setCategoria(producto.getCategoria().getNombre());
        dto.setPrecio("$" + producto.getPrecio());
        dto.setDescripcion(producto.getDescripcion());

        List<ProductoColor> productoColores =
                productoColorRepository.findByProducto_IdProducto(idProducto);

        // Se reutiliza construirColoresDTO pero filtrando variantes sin stock
        dto.setColores(construirColoresDTO(productoColores, true));

        return dto;
    }

    // ── Catálogo completo (usado por catalogo.js) ────────────────────────────

    public CatalogoDTO obtenerCatalogo() {

        List<Producto> productos = productoRepository.findAll();

        List<CatalogoProductoDTO> hombre = new ArrayList<>();
        List<CatalogoProductoDTO> mujer  = new ArrayList<>();

        for (Producto producto : productos) {
            CatalogoProductoDTO dto = construirProductoCatalogo(producto);
            if (producto.getGenero() == GeneroProducto.hombre) {
                hombre.add(dto);
            } else if (producto.getGenero() == GeneroProducto.mujer) {
                mujer.add(dto);
            }
        }

        CatalogoDTO catalogo = new CatalogoDTO();
        catalogo.setHombre(hombre);
        catalogo.setMujer(mujer);
        return catalogo;
    }

    private CatalogoProductoDTO construirProductoCatalogo(Producto producto) {

        CatalogoProductoDTO dto = new CatalogoProductoDTO();
        dto.setIdProducto(producto.getIdProducto());
        dto.setNombre(producto.getNombre());
        dto.setCategoria(producto.getCategoria().getNombre());
        dto.setPrecio("$" + producto.getPrecio());
        dto.setDescripcion(producto.getDescripcion());

        List<ProductoColor> productoColores =
                productoColorRepository.findByProducto_IdProducto(producto.getIdProducto());
        dto.setColores(construirColoresDTO(productoColores, false));

        return dto;
    }

    private List<CatalogoColorDTO> construirColoresDTO(List<ProductoColor> productoColores,
                                                       boolean filtrarSinStock) {
        List<CatalogoColorDTO> coloresDTO = new ArrayList<>();

        for (ProductoColor pc : productoColores) {

            CatalogoColorDTO colorDTO = new CatalogoColorDTO();
            colorDTO.setCodigo(pc.getColor().getCodigoHex());

            // Imagen principal del color
            List<VarianteImagen> imagenes =
                    varianteImagenRepository.findByProductoColor_IdProductoColor(
                            pc.getIdProductoColor());
            if (!imagenes.isEmpty()) {
                colorDTO.setImagen(imagenes.get(0).getUrlImagen());
            }

            // Variantes de este color
            List<Variante> variantes =
                    varianteRepository.findByProductoColor_IdProductoColor(
                            pc.getIdProductoColor());

            List<String>      tallasLegacy = new ArrayList<>();
            List<VarianteDTO> variantesDTO = new ArrayList<>();

            for (Variante v : variantes) {
                // Filtro de stock: solo en vista detalle
                if (filtrarSinStock && v.getStock() <= 0) continue;

                String nombreTalla = v.getTalla().getNombre();
                tallasLegacy.add(nombreTalla);
                variantesDTO.add(new VarianteDTO(v.getIdVariante(), nombreTalla));
            }

            colorDTO.setTalla(tallasLegacy);
            colorDTO.setVariantes(variantesDTO);

            coloresDTO.add(colorDTO);
        }

        return coloresDTO;
    }

    @Transactional
    public ProductoDetalleDTO obtenerProductoPorId(Integer idProducto) {

        Producto producto = productoRepository.findById(idProducto).orElseThrow();

        ProductoDetalleDTO dto = new ProductoDetalleDTO();
        dto.setIdProducto(producto.getIdProducto());
        dto.setNombre(producto.getNombre());
        dto.setDescripcion(producto.getDescripcion());
        dto.setPrecio(producto.getPrecio());
        dto.setIdCategoria(producto.getCategoria().getIdCategoria());
        dto.setGenero(producto.getGenero());

        List<ProductoColor> colores =
                productoColorRepository.findByProducto_IdProducto(idProducto);

        List<ColorDetalleDTO> coloresDTO = new ArrayList<>();

        for (ProductoColor productoColor : colores) {

            ColorDetalleDTO colorDTO = new ColorDetalleDTO();
            colorDTO.setIdColor(productoColor.getColor().getIdColor());

            List<VarianteImagen> imagenes =
                    varianteImagenRepository.findByProductoColor_IdProductoColor(
                            productoColor.getIdProductoColor());
            colorDTO.setImagen(imagenes.isEmpty() ? null : imagenes.get(0).getUrlImagen());

            List<Variante> variantes =
                    varianteRepository.findByProductoColor_IdProductoColor(
                            productoColor.getIdProductoColor());

            List<TallaDetalleDTO> tallasDTO = new ArrayList<>();
            for (Variante variante : variantes) {
                TallaDetalleDTO tallaDTO = new TallaDetalleDTO();
                tallaDTO.setTalla(variante.getTalla().getNombre());
                tallaDTO.setStock(variante.getStock());
                tallasDTO.add(tallaDTO);
            }

            colorDTO.setTallas(tallasDTO);
            coloresDTO.add(colorDTO);
        }

        dto.setColores(coloresDTO);
        return dto;
    }

    @Transactional
    public void crearProducto(ProductoDetalleDTO dto) {

        Categoria categoria = categoriaRepository.findById(dto.getIdCategoria())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        Producto producto = new Producto();
        producto.setNombre(dto.getNombre());
        producto.setDescripcion(dto.getDescripcion());
        producto.setPrecio(dto.getPrecio());
        producto.setGenero(dto.getGenero());
        producto.setCategoria(categoria);
        producto.setEstado(EstadoProducto.activo);
        producto = productoRepository.save(producto);

        for (ColorDetalleDTO colorDTO : dto.getColores()) {

            Color color = colorRepository.findById(colorDTO.getIdColor())
                    .orElseThrow(() -> new RuntimeException("Color no encontrado"));

            ProductoColor productoColor = new ProductoColor();
            productoColor.setProducto(producto);
            productoColor.setColor(color);
            productoColor = productoColorRepository.save(productoColor);

            VarianteImagen imagen = new VarianteImagen();
            imagen.setProductoColor(productoColor);
            imagen.setUrlImagen(colorDTO.getImagen());
            imagen.setPrincipal(PrincipalImagen.si);
            varianteImagenRepository.save(imagen);

            for (TallaDetalleDTO tallaDTO : colorDTO.getTallas()) {
                if (tallaDTO.getStock() <= 0) continue;

                Talla talla = tallaRepository.findByNombre(tallaDTO.getTalla())
                        .orElseThrow(() -> new RuntimeException("Talla no encontrada"));

                Variante variante = new Variante();
                variante.setProductoColor(productoColor);
                variante.setTalla(talla);
                variante.setStock(tallaDTO.getStock());
                varianteRepository.save(variante);
            }
        }
    }

    @Transactional
    public void actualizarProducto(Integer idProduct, ProductoDetalleDTO dto) {

        if (dto.getColores() == null || dto.getColores().isEmpty()) {
            throw new RuntimeException("El producto debe tener al menos un color");
        }

        Producto producto = productoRepository.findById(idProduct).orElseThrow();
        producto.setNombre(dto.getNombre());
        producto.setDescripcion(dto.getDescripcion());
        producto.setPrecio(dto.getPrecio());
        producto.setGenero(dto.getGenero());

        Categoria categoria = categoriaRepository.findById(dto.getIdCategoria()).orElseThrow();
        producto.setCategoria(categoria);
        productoRepository.save(producto);

        // Borrar colores/variantes/imágenes anteriores
        List<ProductoColor> coloresActuales =
                productoColorRepository.findByProducto_IdProducto(idProduct);

        for (ProductoColor pc : coloresActuales) {
            varianteImagenRepository.deleteByProductoColor_IdProductoColor(pc.getIdProductoColor());
            varianteRepository.deleteByProductoColor_IdProductoColor(pc.getIdProductoColor());
        }
        productoColorRepository.deleteByProducto_IdProducto(idProduct);
        productoColorRepository.flush();

        // Recrear
        for (ColorDetalleDTO colorDTO : dto.getColores()) {

            Color color = colorRepository.findById(colorDTO.getIdColor()).orElseThrow();

            ProductoColor productoColor = new ProductoColor();
            productoColor.setProducto(producto);
            productoColor.setColor(color);
            productoColorRepository.save(productoColor);

            VarianteImagen imagen = new VarianteImagen();
            imagen.setProductoColor(productoColor);
            imagen.setUrlImagen(colorDTO.getImagen());
            imagen.setPrincipal(PrincipalImagen.si);
            varianteImagenRepository.save(imagen);

            for (TallaDetalleDTO tallaDTO : colorDTO.getTallas()) {
                Talla talla = tallaRepository.findByNombre(tallaDTO.getTalla()).orElseThrow();

                Variante variante = new Variante();
                variante.setProductoColor(productoColor);
                variante.setTalla(talla);
                variante.setStock(tallaDTO.getStock());
                varianteRepository.save(variante);
            }
        }
    }

    //  activar / desactivar producto
    @Transactional
    public void cambiarEstado(Integer idProducto) {

        Producto producto = productoRepository.findById(idProducto).orElseThrow();

        producto.setEstado(
                producto.getEstado() == EstadoProducto.activo
                        ? EstadoProducto.inactivo
                        : EstadoProducto.activo
        );

        productoRepository.save(producto);
    }

    public List<ProductoAdminDTO> obtenerProductosAdmin() {

        List<Producto> productos =
                productoRepository.findAll();

        List<ProductoAdminDTO> resultado =
                new ArrayList<>();

        for (Producto producto : productos) {

            ProductoAdminDTO dto =
                    new ProductoAdminDTO();

            dto.setIdProducto(
                    producto.getIdProducto());

            dto.setNombre(
                    producto.getNombre());

            dto.setCategoria(
                    producto.getCategoria().getNombre());

            dto.setGenero(
                    producto.getGenero());

            dto.setPrecio(
                    producto.getPrecio());

            dto.setEstado(
                    producto.getEstado().name());

            dto.setTotalColores(
                    productoColorRepository
                            .findByProducto_IdProducto(
                                    producto.getIdProducto()
                            )
                            .size());

            String imagenPrincipal =
                    varianteImagenRepository
                            .findFirstByProductoColorProductoIdProductoOrderByIdImagenAsc(
                                    producto.getIdProducto()
                            )
                            .map(VarianteImagen::getUrlImagen)
                            .orElse(null);
            dto.setImagenPrincipal(imagenPrincipal);
            resultado.add(dto);
        }
        return resultado;
    }

}