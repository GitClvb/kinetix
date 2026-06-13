package com.kinetix.fit.service;

import com.kinetix.fit.dto.ProductoMasVendidoDTO;
import com.kinetix.fit.repository.PedidoProductoRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class PedidoProductoService {

    private final PedidoProductoRepository pedidoProductoRepository;

    public PedidoProductoService(PedidoProductoRepository pedidoProductoRepository) {
        this.pedidoProductoRepository = pedidoProductoRepository;
    }

    public List<ProductoMasVendidoDTO> obtenerMasVendidos(int limit) {

        List<Object[]> resultados = pedidoProductoRepository
                .findProductosMasVendidos(PageRequest.of(0, limit));

        List<ProductoMasVendidoDTO> lista = new ArrayList<>();

        for (Object[] r : resultados) {
            ProductoMasVendidoDTO dto = new ProductoMasVendidoDTO();

            dto.setIdProducto((Integer) r[0]);
            dto.setNombre((String) r[1]);
            dto.setDescripcion((String) r[2]);

            dto.setPrecio(r[3] != null ? ((BigDecimal) r[3]).doubleValue() : 0.0);

            dto.setTotalVendidos(r[4] != null ? ((Number) r[4]).longValue() : 0L);

            dto.setImagen((String) r[5]);

            lista.add(dto);
        }

        return lista;
    }
}