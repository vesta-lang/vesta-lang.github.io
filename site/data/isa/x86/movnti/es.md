---
summary: Espada doble de la tienda usando Hint no temporal
---

## Descripción

Mueva el entero de doble palabra en el operando de origen (segundo operando) al operando de destino (primer operando) utilizando una pista no temporal para minimizar la contaminación del caché durante el escrito a la memoria. El operando de origen es un registro de proposito general. El operando de destino es una ubicación de memoria de 32 bits.

El indicio no temporal se implementa utilizando un protocolo de tipo de memoria de combinación de escritura (WC) al escribir los datos a la memoria. Utilizando este protocolo, el procesador no escribe los datos en la jerarquía de caché, ni recoge la línea correspondiente de caché de la memoria en la jerarquía de caché. El tipo de memoria de la región que se está escribiendo puede anular la indirecta no temporal, si la dirección de memoria especificada para la tienda no temporal está en una región de memoria inestable (UC) o escrita protegida (WP). Para obtener más información sobre las tiendas no temporales, consulte "Caching of Temporal vs. Datos no temporales" en el capítulo 10 en el Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1.

Debido a que el protocolo WC utiliza un modelo de consistencia de memoria de orden débil, una operación de esgrima implementada con la instrucción SFENCE o MFENCE debe usarse junto con instrucciones MOVNTI si varios procesadores pueden usar diferentes tipos de memoria para leer/escribir los lugares de memoria de destino.

En modo de 64 bits, el tamaño de operación predeterminado de la instrucción es de 32 bits. El uso del prefijo REX.R permite el acceso a registros adicionales (R8-R15). El uso del prefijo REX.W promueve la operación a 64 bits. Vea la tabla resumen al comienzo de esta sección para la codificación de datos y límites.

## Operación

```text
DEST := SRC;
```

## Intel C/C++ compilador intrínseco

```c
MOVNTI void _mm_stream_si32 (int *p, int a) MOVNTI void _mm_stream_si64(__int64 *p, __int64 a);
```

## SIMD coma flotante Excepciones

None.
