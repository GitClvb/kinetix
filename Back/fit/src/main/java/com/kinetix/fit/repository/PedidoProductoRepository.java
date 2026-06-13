package com.kinetix.fit.repository;

import com.kinetix.fit.model.PedidoProducto;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PedidoProductoRepository extends JpaRepository<PedidoProducto, Integer> {

    @Query(value = """
        SELECT
            p.id_producto,
            p.nombre,
            p.descripcion,
            p.precio,
            SUM(pp.cantidad) AS total_vendidos,
            (
                SELECT vi2.url_imagen
                FROM variante_imagenes vi2
                JOIN producto_color pc2 ON pc2.id_producto_color = vi2.id_producto_color
                WHERE pc2.id_producto = p.id_producto
                  AND vi2.principal = 'si'
                LIMIT 1
            ) AS imagen
        FROM pedido_productos pp
        JOIN variantes      v  ON v.id_variante        = pp.id_variante
        JOIN producto_color pc ON pc.id_producto_color = v.id_producto_color
        JOIN productos      p  ON p.id_producto        = pc.id_producto
        GROUP BY p.id_producto, p.nombre, p.descripcion, p.precio
        ORDER BY total_vendidos DESC
        """, nativeQuery = true)
    List<Object[]> findProductosMasVendidos(Pageable pageable);
}