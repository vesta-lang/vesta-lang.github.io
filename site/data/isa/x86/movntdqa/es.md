---
summary: Carga Doble Quadword Países No Temporales Hint
---

## Descripción

MOVNTDQA carga un cuadword doble desde el operando de origen (segundo operando) al operando de destino (primer operando) utilizando un indicio no temporal si la fuente de memoria es WC (escribir combinando) tipo de memoria. Para el tipo de memoria WC, el indicio no temporal puede ser implementado cargando un búfer interno temporal con el equivalente de una línea de caché alineada sin llenar estos datos al caché. Cualquier tipo de memoria de las líneas aliadas en el caché se snooped y flushed. Posteriormente MOVNTDQA lee porciones sin leer de la línea de caché WC recibirá datos del búfer interno temporal si los datos están disponibles. El búfer interno temporal puede ser derribado por el procesador en cualquier momento por cualquier motivo, por ejemplo:

* Una operación de carga aparte de un MOVNTDQA que hace referencia a la memoria ya residente en un interior temporal

buffer.

* A non-WC reference to Memory already resident in a temporary internal buffer. * Entrelazar las lecturas y escribir a un único buffer interno temporal. * Repetidas (V)MOVNTDQA cargas de un determinado artículo de 16 bytes en una línea de streaming. * Ciertas condiciones microarquitecturales, como la escasez de recursos, la detección de una afección de la especificación errónea,

y varias condiciones de falla.

El indicio no temporal se implementa utilizando un protocolo de tipo de memoria de combinación de escritura (WC) al leer los datos de memoria. Utilizando este protocolo, el procesador no lee los datos en la jerarquía de caché, ni recoge la línea correspondiente de caché de la memoria en la jerarquía de caché. El tipo de memoria de la región que se lee puede anular el indicio no temporal, si la dirección de memoria especificada para la lectura no temporal no es una región de memoria WC. La información sobre lecturas y escritos no temporales se puede encontrar en "Caching of Temporal vs. Datos no temporales" en el capítulo 10 en el Intel(R) 64 y el Manual del Desarrollador de Software de Arquitectura IA-32, Volumen 3A.

Debido a que el protocolo WC utiliza un modelo de consistencia de memoria de orden débil, una operación de esgrima implementada con una instrucción MFENCE debe usarse junto con instrucciones MOVNTDQA si varios procesadores pueden usar diferentes tipos de memoria para los lugares de memoria referencia o sincronizar lecturas de un procesador con escritos por

1. ModRM.MOD != 011B

otros agentes del sistema. La implementación de un procesador de la indirecta de carga de streaming no anula el tipo de memoria eficaz, pero la implementación de la indirecta es dependiente del procesador. Por ejemplo, una implementación del procesador puede optar por ignorar la pista y procesar la instrucción como un MOVDQA normal para cualquier tipo de memoria. Otra implementación puede optimizar las lecturas de caché generadas por MOVNTDQA en el tipo de memoria WB para reducir los desalojos de caché.

Las direcciones 128-bit (V)MOVNTDQA deben ser alineadas de 16 bytes o la instrucción causará un #GP.

Las direcciones VMOVNTDQA de 256 bits deben estar alineadas de 32 bytes o la instrucción causará un #GP.

Las direcciones 512-bit VMOVNTDQA deben estar alineadas de 64 bytes o la instrucción causará un #GP.

## Operación

```text
MOVNTDQA (128bit- Legacy SSE Form)
DEST := SRC
DEST[MAXVL-1:128] (Unmodified)

VMOVNTDQA (VEX.128 and EVEX.128 Encoded Form)
DEST := SRC
DEST[MAXVL-1:128] := 0

VMOVNTDQA (VEX.256 and EVEX.256 Encoded Forms)
DEST[255:0] := SRC[255:0]
DEST[MAXVL-1:256] := 0

VMOVNTDQA (EVEX.512 Encoded Form)
DEST[511:0] := SRC[511:0]
DEST[MAXVL-1:512] := 0
```

## Intel C/C++ compilador intrínseco

```c
VMOVNTDQA __m512i _mm512_stream_load_si512(__m512i const* p);
MOVNTDQA __m128i _mm_stream_load_si128 (const __m128i *p);
VMOVNTDQA __m256i _mm256_stream_load_si256 (__m256i const* p);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones no-EVEX-encoded, ver Tabla 2-18, "Tipo 1 Clase Condiciones de Excepción."

Instrucciones codificadas por EVEX, ver Tabla 2-47, "Tipo E1NF Clase Condiciones de Excepción."

Additionally:

```text
#UD               If VEX.vvvv != 1111B or EVEX.vvvv != 1111B.
```
