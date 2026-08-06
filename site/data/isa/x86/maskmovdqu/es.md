---
summary: Almacene los bytes seleccionados de doble palabra cuádruple
---

## Descripción

Tiendas seleccionadas del operando de origen (primer operando) en una ubicación de memoria de 128 bits. La máscara operando (segundo operando) selecciona qué bytes del operando de origen están escritos a la memoria. La fuente y máscara operandos son registros XMM. La ubicación de memoria especificado por la dirección efectiva en el registro DI/EDI/RDI (el registro de segmento predeterminado es DS, pero esto puede ser anulado con un prefijo de override de segmento). La ubicación de memoria no necesita alinearse en un límite natural. (El tamaño de la dirección de la tienda depende del atributo tamaño de la dirección.)

El bit mas significativo en cada byte de la máscara operando determina si el byte correspondiente en el operando de origen está escrito a la ubicación de byte correspondiente en memoria: 0 indica no escribir y 1 indica escribir.

La instrucción MASKMOVDQU genera un indicio no temporal al procesador para minimizar la contaminación de caché. El indicio no temporal se implementa utilizando un protocolo de tipo de memoria (WC) que combina (véase "Caching of Temporal vs. Datos no temporales" en el capítulo 10, del Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1). Debido a que el protocolo WC utiliza un modelo de consistencia de memoria de orden débil, una operación de esgrima implementada con la instrucción SFENCE o MFENCE debe usarse junto con instrucciones MASKMOVDQU si varios procesadores pueden usar diferentes tipos de memoria para leer/escribir los lugares de memoria de destino.

Comportamiento con una máscara de los 0s es el siguiente:

* No se escribirán datos a la memoria. * No se garantiza la firma de puntos de rotura (código o datos); diferentes implementaciones de procesadores pueden indicar o

No señale estos puntos de ruptura.

* Las excepciones asociadas con el tratamiento de la memoria y las fallas de página todavía pueden ser señalizadas (ejecución

dependent).

* Si la región de memoria de destino se mapea como UC o WP, la ejecución de semántica asociada para estos

Los tipos de memoria no están garantizados (es decir, está reservado) y son de aplicación específica.

La instrucción MASKMOVDQU se puede utilizar para mejorar el rendimiento de algoritmos que necesitan fusionar datos sobre una base byte-byte. MASKMOVDQU no debe causar una lectura para la propiedad; hacerlo genera ancho de banda innecesario ya que los datos deben ser escritos directamente utilizando la máscara de byte sin asignar datos antiguos antes de la tienda.

En modo de 64 bits, el uso del prefijo REX.R permite esta instrucción para acceder a registros adicionales (XMM8-XMM15).

Nota: En VEX-versiones codificadas, VEX.vvvv está reservado y debe ser 1111b instrucciones de lo contrario #UD.

Si VMASKMOVDQU está codificado con VEX.L= 1, un intento de ejecutar la instrucción codificada con VEX.L= 1 causará una excepción #UD.

1.ModRM.MOD = 011B required

## Operación

```text
IF (MASK[7] = 1)

    THEN DEST[DI/EDI] := SRC[7:0] ELSE (* Memory location unchanged *); FI;

IF (MASK[15] = 1)

    THEN DEST[DI/EDI +1] := SRC[15:8] ELSE (* Memory location unchanged *); FI;
    (* Repeat operation for 3rd through 14th bytes in source operand *)

IF (MASK[127] = 1)

    THEN DEST[DI/EDI +15] := SRC[127:120] ELSE (* Memory location unchanged *); FI;
```

## Intel C/C++ compilador intrínseco

```c
void _mm_maskmoveu_si128(__m128i d, __m128i n, char * p);
```

## Otras excepciones

Ver Tabla 2-21, "Tipo 4 Condiciones de Excepción", además:

```text
#UD               If VEX.L= 1
```

```text
                  If VEX.vvvv  1111B.
```
