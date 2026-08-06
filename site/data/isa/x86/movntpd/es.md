---
summary: Tienda valores en coma flotante de precisión doble empaquetados Usando Hinte no Temporal
---

## Descripción

Mueva los valores en coma flotante de precisión doble empaquetados en el operando de origen (segundo operando) al operando de destino (primer operando) utilizando una pista no temporal para evitar el caché de los datos durante el escrito a la memoria. El operando de origen es un registro XMM, registro YMM o registro ZMM, que se supone que contiene datos de doble precisión empaquetados, de puntos flotantes. El operando de destino es una ubicación de memoria de 128 bits, 256 bits o 512 bits. El operando de memoria debe estar alineado en una versión de 16 bytes (128-bit), 32-byte (VEX.256 versión codificada) o 64-byte (EVEX.512 versión codificada) de lo contrario una excepción de protección general (#GP) se generará.

El indicio no temporal se implementa utilizando un protocolo de tipo de memoria de combinación de escritura (WC) al escribir los datos a la memoria. Utilizando este protocolo, el procesador no escribe los datos en la jerarquía de caché, ni recoge la línea correspondiente de caché de la memoria en la jerarquía de caché. El tipo de memoria de la región que se está escribiendo puede anular la indirecta no temporal, si la dirección de memoria especificada para la tienda no temporal está en una región de memoria inestable (UC) o escrita protegida (WP). Para obtener más información sobre las tiendas no temporales, consulte "Caching of Temporal vs. Datos no temporales" en el capítulo 10 del Manual de Desarrolladores de Software de Arquitectura Intel, Volumen 1.

Debido a que el protocolo WC utiliza un modelo de consistencia de memoria de orden débil, una operación de esgrima implementada con la instrucción SFENCE o MFENCE debe usarse junto con instrucciones MOVNTPD si varios procesadores pueden usar diferentes tipos de memoria para leer/escribir los lugares de memoria de destino.

Nota: VEX.vvvv y EVEX.vvvv están reservados y deben ser 1111b, VEX.L debe ser 0; de lo contrario las instrucciones serán

```text
#UD.
```

## Operación

```text
VMOVNTPD (EVEX Encoded Versions)
VL = 128, 256, 512
DEST[VL-1:0] := SRC[VL-1:0]

1. ModRM.MOD != 011B


DEST[MAXVL-1:VL] := 0

MOVNTPD (Legacy and VEX Versions)
DEST := SRC
```

## Intel C/C++ compilador intrínseco

```c
VMOVNTPD void _mm512_stream_pd(double * p, __m512d a);
VMOVNTPD void _mm256_stream_pd (double * p, __m256d a);
MOVNTPD void _mm_stream_pd (double * p, __m128d a);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones no-EVEX-encoded, ver Excepciones Tipo1.SSE2 en la tabla 2-18, "Tipo 1 Clase Condiciones de Excepción."

Instrucciones codificadas por EVEX, ver Tabla 2-47, "Tipo E1NF Clase Condiciones de Excepción."

Additionally:

```text
#UD                    If VEX.vvvv != 1111B or EVEX.vvvv != 1111B.
```
