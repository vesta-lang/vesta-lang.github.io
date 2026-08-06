---
summary: Reúne los valores de Dword empaquetados utilizando índices de Dword/Qword firmados
---

## Descripción

La instrucción carga condicionalmente hasta 4 o 8 dwords valores de las direcciones de memoria especificadas por el operando de memoria (el segundo operando) y utilizando índices de dword. El operando de memoria utiliza la forma VSIB del byte SIB para especificar un registro de proposito general operando como base común, un registro vectorial para una serie de índices relativos a la base y un factor de escala constante.

La máscara operando (el tercer operando) especifica la operación de carga condicional de cada dirección de memoria y la actualización correspondiente de cada elemento de datos del operando de destino (el primer operando). La condicionalidad es especificada por el bit mas significativo de cada elemento de datos del registro de máscaras. Si no se establece el bit de máscara de un elemento, el elemento correspondiente del registro de destino se deja sin cambios. El ancho del elemento de datos en el registro de destino y el registro de máscaras son idénticos. El registro completo de máscaras se establecerá a cero por esta instrucción a menos que la instrucción cause una excepción.

Utilizando índices de qword, la instrucción carga condicionalmente hasta 2 o 4 valores de qword desde el VSIB que se dirige a operando de memoria, y actualiza la mitad inferior del registro de destino. Los 128 o 256 bits superiores del registro de destino son cero'ed con índices de qword.

Esta instrucción puede suspenderse por una excepción si por lo menos un elemento ya está recogido (es decir, si la excepción es activada por un elemento que no sea el más adecuado con su conjunto de bits de máscara). Cuando esto sucede, el registro de destino y la máscara operando se actualizan parcialmente; los elementos que se han reunido se colocan en el registro de destino y tienen sus bits de máscara fijados a cero. Si alguna trampa o interrupción está pendiente de elementos ya recogidos, serán entregados en lugar de la excepción; en este caso, EFLAG.RF se establece a uno por lo que un punto de instrucción no es re-triggered cuando la instrucción es continuada.

Si el tamaño de los datos y el tamaño de índice son diferentes, parte del registro de destino y parte del registro de máscaras no corresponden a ningún elemento que se esté reuniendo. Esta instrucción establece esas partes a cero. Puede hacer esto a uno o ambos registros, incluso si la instrucción desencadena una excepción, e incluso si la instrucción desencadena la excepción antes de reunir elementos.

VEX.128 versión: Para los índices dword, la instrucción reunirá cuatro valores dword. Para los índices de qword, la instrucción reunirá dos valores y cero los 64 bits superiores del destino.

VEX.256 versión: Para los índices de dword, la instrucción reunirá ocho valores de dword. Para los índices de qword, la instrucción reunirá cuatro valores y cero los 128 bits superiores del destino.

Note that:

* Si cualquier par del índice, máscara o registro de destino son los mismos, esta instrucción resulta una falla UD. * Los valores pueden leerse de memoria en cualquier orden. Ordenación de memoria con otras instrucciones sigue el Intel-

64 modelo de gestión de memoria.

* Las fallas se entregan de una manera correcta a la izquierda. Es decir, si una falla es activada por un elemento y entregada, todo

Los elementos más cercanos a la LSB del destino serán completados (y no culpar). Elementos individuales más cercanos

al MSB puede o no ser completado. Si un elemento dado desencadena múltiples fallas, se entregan en el orden convencional.

* Los elementos pueden ser recogidos en cualquier orden, pero las faltas deben ser entregadas en orden derecho a izquierda; así, elementos a

la izquierda de un defecto uno puede ser recogido antes de la culpa es entregado. Una aplicación dada de esta

la instrucción es repetible - dados los mismos valores de entrada y estado arquitectónico, se recogerá el mismo conjunto de elementos a la izquierda del fallo.

* Esta instrucción no realiza cheques de AC, y así nunca entregará una falla de AC. * Esta instrucción causará un #UD si el atributo tamaño de la dirección es de 16-bit. * Esta instrucción causará un #UD si el operando de memoria está codificado sin el byte SIB. * Esta instrucción no debe usarse para acceder a la memoria mapeado I/O como el orden de las cargas individuales que hace

es la implementación específica, y algunas implementaciones pueden utilizar cargas más grandes que el tamaño del elemento de datos o elementos de carga un número indeterminado de veces.

* El índice escalado puede requerir más bits que los bits de dirección utilizados por el procesador (por ejemplo, en 32-

modo bit, si la escala es mayor que uno). En este caso, el mas significativo morde más allá del número de dirección

Los bits son ignorados.

## Operación

```text
DEST := SRC1;
BASE_ADDR: base register encoded in VSIB addressing;
VINDEX: the vector index register encoded by VSIB addressing;
SCALE: scale factor encoded by SIB:[7:6];
DISP: optional 1, 4 byte displacement;
MASK := SRC3;

VPGATHERDD (VEX.128 version)
MASK[MAXVL-1:128] := 0;
FOR j := 0 to 3

    i := j * 32;
    IF MASK[31+i] THEN

          MASK[i +31:i] := FFFFFFFFH; // extend from most significant bit
    ELSE

          MASK[i +31:i] := 0;
    FI;
ENDFOR
FOR j := 0 to 3
    i := j * 32;
    DATA_ADDR := BASE_ADDR + (SignExtend(VINDEX[i+31:i])*SCALE + DISP;
    IF MASK[31+i] THEN

          DEST[i +31:i] := FETCH_32BITS(DATA_ADDR); // a fault exits the instruction
    FI;
    MASK[i +31:i] := 0;
ENDFOR
DEST[MAXVL-1:128] := 0;


VPGATHERQD (VEX.128 version)
MASK[MAXVL-1:64] := 0;
FOR j := 0 to 3

    i := j * 32;
    IF MASK[31+i] THEN

          MASK[i +31:i] := FFFFFFFFH; // extend from most significant bit
    ELSE

          MASK[i +31:i] := 0;
    FI;
ENDFOR
FOR j := 0 to 1
    k := j * 64;
    i := j * 32;
    DATA_ADDR := BASE_ADDR + (SignExtend(VINDEX1[k+63:k])*SCALE + DISP;
    IF MASK[31+i] THEN

          DEST[i +31:i] := FETCH_32BITS(DATA_ADDR); // a fault exits the instruction
    FI;
    MASK[i +31:i] := 0;
ENDFOR
DEST[MAXVL-1:64] := 0;

VPGATHERDD (VEX.256 version)
MASK[MAXVL-1:256] := 0;
FOR j := 0 to 7

    i := j * 32;
    IF MASK[31+i] THEN

          MASK[i +31:i] := FFFFFFFFH; // extend from most significant bit
    ELSE

          MASK[i +31:i] := 0;
    FI;
ENDFOR
FOR j := 0 to 7
    i := j * 32;
    DATA_ADDR := BASE_ADDR + (SignExtend(VINDEX1[i+31:i])*SCALE + DISP;
    IF MASK[31+i] THEN

          DEST[i +31:i] := FETCH_32BITS(DATA_ADDR); // a fault exits the instruction
    FI;
    MASK[i +31:i] := 0;
ENDFOR
DEST[MAXVL-1:256] := 0;


VPGATHERQD (VEX.256 version)
MASK[MAXVL-1:128] := 0;
FOR j := 0 to 7

    i := j * 32;
    IF MASK[31+i] THEN

          MASK[i +31:i] := FFFFFFFFH; // extend from most significant bit
    ELSE

          MASK[i +31:i] := 0;
    FI;
ENDFOR
FOR j := 0 to 3
    k := j * 64;
    i := j * 32;
    DATA_ADDR := BASE_ADDR + (SignExtend(VINDEX1[k+63:k])*SCALE + DISP;
    IF MASK[31+i] THEN

          DEST[i +31:i] := FETCH_32BITS(DATA_ADDR); // a fault exits the instruction
    FI;
    MASK[i +31:i] := 0;
ENDFOR
DEST[MAXVL-1:128] := 0;
```

## Intel C/C++ compilador intrínseco

```c
VPGATHERDD: __m128i _mm_i32gather_epi32 (int const * base, __m128i index, const int scale);
VPGATHERDD: __m128i _mm_mask_i32gather_epi32 (__m128i src, int const * base, __m128i index, __m128i mask, const int scale);
VPGATHERDD: __m256i _mm256_i32gather_epi32 ( int const * base, __m256i index, const int scale);
VPGATHERDD: __m256i _mm256_mask_i32gather_epi32 (__m256i src, int const * base, __m256i index, __m256i mask, const int scale);
VPGATHERQD: __m128i _mm_i64gather_epi32 (int const * base, __m128i index, const int scale);
VPGATHERQD: __m128i _mm_mask_i64gather_epi32 (__m128i src, int const * base, __m128i index, __m128i mask, const int scale);
VPGATHERQD: __m128i _mm256_i64gather_epi32 (int const * base, __m256i index, const int scale);
VPGATHERQD: __m128i _mm256_mask_i64gather_epi32 (__m128i src, int const * base, __m256i index, __m128i mask, const int scale);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-27, "Tipo 12 Condiciones de Excepción de Clase".
