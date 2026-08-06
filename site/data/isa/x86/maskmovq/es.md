---
summary: Tienda Selected Bytes of Quadword
---

## Descripción

Tiendas seleccionadas del operando de origen (primer operando) en una ubicación de memoria de 64 bits. La máscara operando (segundo operando) selecciona qué bytes del operando de origen están escritos a la memoria. La fuente y máscara operandos son registros de tecnología MMX. La ubicación de memoria especificado por la dirección efectiva en el registro DI/EDI/RDI (el registro de segmento predeterminado es DS, pero esto puede ser anulado con un prefijo de override de segmento). La ubicación de memoria no necesita alinearse en un límite natural. (El tamaño de la dirección de la tienda depende del atributo tamaño de la dirección.)

El bit mas significativo en cada byte de la máscara operando determina si el byte correspondiente en el operando de origen está escrito a la ubicación de byte correspondiente en memoria: 0 indica no escribir y 1 indica escribir.

La instrucción MASKMOVQ genera un indicio no temporal al procesador para minimizar la contaminación de caché. El indicio no temporal se implementa utilizando un protocolo de tipo de memoria (WC) que combina (véase "Caching of Temporal vs. Datos no temporales" en el capítulo 10, del Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1). Debido a que el protocolo WC utiliza un modelo de consistencia de memoria de orden débil, una operación de esgrima implementada con la instrucción SFENCE o MFENCE debe usarse junto con instrucciones MASKMOVQ si varios procesadores pueden usar diferentes tipos de memoria para leer/escribir los lugares de memoria de destino.

Esta instrucción causa una transición de x87 FPU a estado de tecnología MMX (es decir, el x87 FPU top-of-puntero de pila se establece a 0 y la palabra etiqueta x87 FPU se establece a todos los 0s [válidos]).

El comportamiento de la instrucción MASKMOVQ con una máscara de todos los 0s es el siguiente:

* No se escribirán datos a la memoria. * La transición de x87 FPU a estado de tecnología MMX ocurrirá. * Las excepciones asociadas con el tratamiento de la memoria y las fallas de página todavía pueden ser señalizadas (ejecución

dependent).

* No se garantiza la firma de puntos de ruptura (código o datos) (dependiendo de la implementación). * Si la región de memoria de destino se mapea como UC o WP, la ejecución de semántica asociada para estos

Los tipos de memoria no están garantizados (es decir, está reservado) y son de aplicación específica.

La instrucción MASKMOVQ se puede utilizar para mejorar el rendimiento de algoritmos que necesitan fusionar datos sobre una base byteby-byte. No debe causar una lectura para la propiedad; hacerlo genera ancho de banda innecesario ya que los datos deben ser escritos directamente usando la máscara de byte sin asignar datos antiguos antes de la tienda.

En modo de 64 bits, la dirección de memoria es especificada por DS:RDI.

## Operación

```text
IF (MASK[7] = 1)

    THEN DEST[DI/EDI] := SRC[7:0] ELSE (* Memory location unchanged *); FI;

IF (MASK[15] = 1)

    THEN DEST[DI/EDI +1] := SRC[15:8] ELSE (* Memory location unchanged *); FI;
    (* Repeat operation for 3rd through 6th bytes in source operand *)

IF (MASK[63] = 1)

    THEN DEST[DI/EDI +15] := SRC[63:56] ELSE (* Memory location unchanged *); FI;
```

## Intel C/C++ compilador intrínseco

```c
void _mm_maskmove_si64(__m64d, __m64n, char * p);
```

## Otras excepciones

Ver Tabla 25-8, " Condiciones de Excepción para Legacy SIMD/MMX Instrucciones sin Excepción FP", en el Manual de Desarrolladores de Software de Arquitecturas Intel(R) 64 e IA-32, Volumen 3B.
