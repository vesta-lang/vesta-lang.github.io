---
summary: Reúne los valores de Qword empaquetados usando índices de Dword/Qword firmados
---

## Descripción

La instrucción carga condicionalmente hasta 2 o 4 valores de qword de las direcciones de memoria especificadas por el operando de memoria (el segundo operando) y utilizando índices de qword. El operando de memoria utiliza la forma VSIB del byte SIB para especificar un registro de proposito general operando como base común, un registro vectorial para una serie de índices relativos a la base y un factor de escala constante.

La máscara operando (el tercer operando) especifica la operación de carga condicional de cada dirección de memoria y la actualización correspondiente de cada elemento de datos del operando de destino (el primer operando). La condicionalidad es especificada por el bit mas significativo de cada elemento de datos del registro de máscaras. Si no se establece el bit de máscara de un elemento, el elemento correspondiente del registro de destino se deja sin cambios. El ancho del elemento de datos en el registro de destino y el registro de máscaras son idénticos. El registro completo de máscaras se establecerá a cero por esta instrucción a menos que la instrucción cause una excepción.

Usando índices de dwords en la mitad inferior del registro de máscaras, la instrucción carga condicionalmente hasta 2 o 4 valores de qwords del VSIB que se dirige a operando de memoria, y actualiza el registro de destino.

Esta instrucción puede suspenderse por una excepción si por lo menos un elemento ya está recogido (es decir, si la excepción es activada por un elemento que no sea el más adecuado con su conjunto de bits de máscara). Cuando esto sucede, el registro de destino y la máscara operando se actualizan parcialmente; los elementos que se han reunido se colocan en el registro de destino y tienen sus bits de máscara fijados a cero. Si alguna trampa o interrupción está pendiente de elementos ya recogidos, serán entregados en lugar de la excepción; en este caso, EFLAG.RF se establece a uno por lo que un punto de instrucción no es re-triggered cuando la instrucción es continuada.

Si el tamaño de los datos y el tamaño de índice son diferentes, parte del registro de destino y parte del registro de máscaras no corresponden a ningún elemento que se esté reuniendo. Esta instrucción establece esas partes a cero. Puede hacer esto a uno o ambos registros, incluso si la instrucción desencadena una excepción, e incluso si la instrucción desencadena la excepción antes de reunir elementos.

VEX.128 versión: La instrucción reunirá dos valores de qword. Para índices de dwords, sólo se utilizan los dos índices inferiores en el índice de vectores.

VEX.256 versión: La instrucción reunirá cuatro valores de qword. Para índices de dwords, sólo se utilizan los cuatro índices inferiores en el índice de vectores.

Note that:

* Si cualquier par del índice, máscara o registro de destino son los mismos, esta instrucción resulta una falla UD. * Los valores pueden leerse de memoria en cualquier orden. Ordenación de memoria con otras instrucciones sigue el Intel-

64 modelo de gestión de memoria.

* Las fallas se entregan de una manera correcta a la izquierda. Es decir, si una falla es activada por un elemento y entregada, todo

Los elementos más cercanos a la LSB del destino serán completados (y no culpar). Los elementos individuales más cercanos al MSB pueden o no ser completados. Si un elemento dado desencadena múltiples fallas, se entregan en el orden convencional.

* Los elementos pueden ser recogidos en cualquier orden, pero las faltas deben ser entregadas en orden derecho a izquierda; así, elementos a

la izquierda de un defecto uno puede ser recogido antes de la culpa es entregado. Una aplicación dada de esta instrucción es repetible - dados los mismos valores de entrada y estado arquitectónico, se reunirá el mismo conjunto de elementos a la izquierda del fallo.

* Esta instrucción no realiza cheques de AC, y así nunca entregará una falla de AC. * Esta instrucción causará un #UD si el atributo tamaño de la dirección es de 16-bit. * Esta instrucción causará un #UD si el operando de memoria está codificado sin el byte SIB. * Esta instrucción no debe usarse para acceder a la memoria mapeado I/O como el orden de las cargas individuales que hace

es la implementación específica, y algunas implementaciones pueden utilizar cargas más grandes que el tamaño del elemento de datos o elementos de carga un número indeterminado de veces.

* El índice escalado puede requerir más bits que los bits de dirección utilizados por el procesador (por ejemplo, en 32-

modo bit, si la escala es mayor que uno). En este caso, los bits mas significativo más allá del número de bits de dirección son ignorados.

## Operación

```text
DEST := SRC1;
BASE_ADDR: base register encoded in VSIB addressing;
VINDEX: the vector index register encoded by VSIB addressing;
SCALE: scale factor encoded by SIB:[7:6];
DISP: optional 1, 4 byte displacement;
MASK := SRC3;

VPGATHERDQ (VEX.128 version)
MASK[MAXVL-1:128] := 0;
FOR j := 0 to 1

    i := j * 64;
    IF MASK[63+i] THEN

          MASK[i +63:i] := FFFFFFFF_FFFFFFFFH; // extend from most significant bit
    ELSE

          MASK[i +63:i] := 0;
    FI;
ENDFOR
FOR j := 0 to 1
    k := j * 32;
    i := j * 64;
    DATA_ADDR := BASE_ADDR + (SignExtend(VINDEX[k+31:k])*SCALE + DISP);
    IF MASK[63+i] THEN

          DEST[i +63:i] := FETCH_64BITS(DATA_ADDR); // a fault exits the instruction
    FI;
    MASK[i +63:i] := 0;
ENDFOR
DEST[MAXVL-1:128] := 0;


VPGATHERQQ (VEX.128 version)
MASK[MAXVL-1:128] := 0;
FOR j := 0 to 1

    i := j * 64;
    IF MASK[63+i] THEN

          MASK[i +63:i] := FFFFFFFF_FFFFFFFFH; // extend from most significant bit
    ELSE

          MASK[i +63:i] := 0;
    FI;
ENDFOR
FOR j := 0 to 1
    i := j * 64;
    DATA_ADDR := BASE_ADDR + (SignExtend(VINDEX1[i+63:i])*SCALE + DISP);
    IF MASK[63+i] THEN

          DEST[i +63:i] := FETCH_64BITS(DATA_ADDR); // a fault exits the instruction
    FI;
    MASK[i +63:i] := 0;
ENDFOR
DEST[MAXVL-1:128] := 0;

VPGATHERQQ (VEX.256 version)
MASK[MAXVL-1:256] := 0;
FOR j := 0 to 3

    i := j * 64;
    IF MASK[63+i] THEN

          MASK[i +63:i] := FFFFFFFF_FFFFFFFFH; // extend from most significant bit
    ELSE

          MASK[i +63:i] := 0;
    FI;
ENDFOR
FOR j := 0 to 3
    i := j * 64;
    DATA_ADDR := BASE_ADDR + (SignExtend(VINDEX1[i+63:i])*SCALE + DISP);
    IF MASK[63+i] THEN

          DEST[i +63:i] := FETCH_64BITS(DATA_ADDR); // a fault exits the instruction
    FI;
    MASK[i +63:i] := 0;
ENDFOR
DEST[MAXVL-1:256] := 0;

VPGATHERDQ (VEX.256 version)
MASK[MAXVL-1:256] := 0;
FOR j := 0 to 3

    i := j * 64;
    IF MASK[63+i] THEN

          MASK[i +63:i] := FFFFFFFF_FFFFFFFFH; // extend from most significant bit
    ELSE

          MASK[i +63:i] := 0;
    FI;
ENDFOR
FOR j := 0 to 3
    k := j * 32;
    i := j * 64;
    DATA_ADDR := BASE_ADDR + (SignExtend(VINDEX1[k+31:k])*SCALE + DISP);


    IF MASK[63+i] THEN
          DEST[i +63:i] := FETCH_64BITS(DATA_ADDR); // a fault exits the instruction

    FI;
    MASK[i +63:i] := 0;
ENDFOR
DEST[MAXVL-1:256] := 0;
```

## Intel C/C++ compilador intrínseco

```c
VPGATHERDQ: __m128i _mm_i32gather_epi64 (__int64 const * base, __m128i index, const int scale);
VPGATHERDQ: __m128i _mm_mask_i32gather_epi64 (__m128i src, __int64 const * base, __m128i index, __m128i mask, const int scale);
VPGATHERDQ: __m256i _mm256_i32gather_epi64 (__int64 const * base, __m128i index, const int scale);
VPGATHERDQ: __m256i _mm256_mask_i32gather_epi64 (__m256i src, __int64 const * base, __m128i index, __m256i mask, const int scale);
VPGATHERQQ: __m128i _mm_i64gather_epi64 (__int64 const * base, __m128i index, const int scale);
VPGATHERQQ: __m128i _mm_mask_i64gather_epi64 (__m128i src, __int64 const * base, __m128i index, __m128i mask, const int scale);
VPGATHERQQ: __m256i _mm256_i64gather_epi64 __(int64 const * base, __m256i index, const int scale);
VPGATHERQQ: __m256i _mm256_mask_i64gather_epi64 (__m256i src, __int64 const * base, __m256i index, __m256i mask, const int scale);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-27, "Tipo 12 Condiciones de Excepción de Clase".
