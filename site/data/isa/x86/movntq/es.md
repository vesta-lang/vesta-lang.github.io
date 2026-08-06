---
summary: Tienda de Quadword Usando Hint no Temporal
---

## Descripción

Mueva el cuadrido en el operando de origen (segundo operando) al operando de destino (primer operando) utilizando una pista no temporal para minimizar la contaminación del caché durante el escrito a la memoria. El operando de origen es un registro de tecnología MMX, que se supone que contiene datos de enteros empaquetados (tetos empaquetados, palabras o palabras dobles). El operando de destino es una ubicación de memoria de 64 bits.

El indicio no temporal se implementa utilizando un protocolo de tipo de memoria de combinación de escritura (WC) al escribir los datos a la memoria. Utilizando este protocolo, el procesador no escribe los datos en la jerarquía de caché, ni recoge la línea correspondiente de caché de la memoria en la jerarquía de caché. El tipo de memoria de la región que se está escribiendo puede anular la indirecta no temporal, si la dirección de memoria especificada para la tienda no temporal está en una región de memoria inestable (UC) o escrita protegida (WP). Para obtener más información sobre las tiendas no temporales, consulte "Caching of Temporal vs. Datos no temporales" en el capítulo 10 en el Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1.

Debido a que el protocolo WC utiliza un modelo de consistencia de memoria de orden débil, una operación de esgrima implementada con la instrucción SFENCE o MFENCE debe usarse junto con instrucciones MOVNTQ si varios procesadores pueden usar diferentes tipos de memoria para leer/escribir los lugares de memoria de destino.

La operación de esta instrucción es la misma en modos no-64-bit y modo 64-bit.

## Operación

```text
DEST := SRC;
```

## Intel C/C++ compilador intrínseco

```c
MOVNTQ void _mm_stream_pi(__m64 * p, __m64 a);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Véase la sección 25.25.3, "Excepción de condiciones de Legacy SIMD Instrucciones de funcionamiento en los registros MMX" en el manual de desarrollo de software de arquitecturas Intel(R) 64 e IA-32, Volumen 3B.
