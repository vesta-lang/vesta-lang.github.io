---
summary: Un poco de rotación derecha
---

## Descripción

Rota los bits en los elementos de datos individuales (doblewords, o quadword) en el primer operando de origen a la derecha por el número de bits especificados en el conteo operando. Si el valor especificado por el conteo operando es mayor que 31 (para las palabras dobles), o 63 (para un cuadword), entonces se utiliza el conteo operando modulo del tamaño de los datos (32 o 64).

EVEX.128 versión codificada: El operando de destino es un registro XMM. El operando de origen es un registro XMM o una ubicación de memoria (para forma inmediata). El conteo operando puede venir ya sea de un registro XMM o una ubicación de memoria o de 8 bits inmediatamente. Bits (MAXVL-1:128) del registro ZMM correspondiente se ponen a cero.

EVEX.256 versión codificada: El operando de destino es un registro YMM. El operando de origen es un registro YMM o una ubicación de memoria (para forma inmediata). El conteo operando puede venir ya sea de un registro XMM o una ubicación de memoria o de 8 bits inmediatamente. Bits (MAXVL-1:256) del registro ZMM correspondiente se ponen a cero.

EVEX.512 versión codificada: El operando de destino es un registro ZMM actualizado según la máscara de escritura. Para el conteo operando en forma inmediata, el operando de origen puede ser un registro ZMM, una ubicación de memoria de 512 bits o un vector de 512 bits transmitido desde una ubicación de memoria de 32/64 bits, el conteo operando es un vector de 8 bits inmediato. Para el recuento operando en forma variable, el primer operando de origen (el segundo operando) es un registro ZMM y el contador operando (el tercero operando) es un registro ZMM, una ubicación de memoria de 512 bits o un vector de 512 bits emitido desde una ubicación de memoria

## Operación

```text
RIGHT_ROTATE_DWORDS(SRC, COUNT_SRC)
COUNT := COUNT_SRC modulo 32;
DEST[31:0] := (SRC >> COUNT) | (SRC << (32 - COUNT));

RIGHT_ROTATE_QWORDS(SRC, COUNT_SRC)
COUNT := COUNT_SRC modulo 64;
DEST[63:0] := (SRC >> COUNT) | (SRC << (64 - COUNT));

VPRORD (EVEX encoded versions)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask* THEN

             IF (EVEX.b = 1) AND (SRC1 *is memory*)

                  THEN DEST[i+31:i] := RIGHT_ROTATE_DWORDS( SRC1[31:0], imm8)

                  ELSE DEST[i+31:i] := RIGHT_ROTATE_DWORDS(SRC1[i+31:i], imm8)

             FI;

     ELSE

             IF *merging-masking*         ; merging-masking

                  THEN *DEST[i+31:i] remains unchanged*

                  ELSE *zeroing-masking*               ; zeroing-masking

                    DEST[i+31:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VPRORVD (EVEX encoded versions)
(KL, VL) = (4, 128), (8, 256), (16, 512)
FOR j := 0 TO KL-1

    i := j * 32
    IF k1[j] OR *no writemask* THEN

                IF (EVEX.b = 1) AND (SRC2 *is memory*)
                      THEN DEST[i+31:i] := RIGHT_ROTATE_DWORDS(SRC1[i+31:i], SRC2[31:0])
                      ELSE DEST[i+31:i] := RIGHT_ROTATE_DWORDS(SRC1[i+31:i], SRC2[i+31:i])

                FI;


     ELSE

             IF *merging-masking*         ; merging-masking

                  THEN *DEST[i+31:i] remains unchanged*

                  ELSE *zeroing-masking*             ; zeroing-masking

                    DEST[i+31:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VPRORQ (EVEX encoded versions)

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask* THEN

             IF (EVEX.b = 1) AND (SRC1 *is memory*)

                  THEN DEST[i+63:i] := RIGHT_ROTATE_QWORDS(SRC1[63:0], imm8)

                  ELSE DEST[i+63:i] := RIGHT_ROTATE_QWORDS(SRC1[i+63:i], imm8])

             FI;

     ELSE

             IF *merging-masking*         ; merging-masking

                  THEN *DEST[i+63:i] remains unchanged*

                  ELSE *zeroing-masking*             ; zeroing-masking

                    DEST[i+63:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VPRORVQ (EVEX encoded versions)

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask* THEN

             IF (EVEX.b = 1) AND (SRC2 *is memory*)

                  THEN DEST[i+63:i] := RIGHT_ROTATE_QWORDS(SRC1[i+63:i], SRC2[63:0])

                  ELSE DEST[i+63:i] := RIGHT_ROTATE_QWORDS(SRC1[i+63:i], SRC2[i+63:i])

             FI;

     ELSE

             IF *merging-masking*         ; merging-masking

                  THEN *DEST[i+63:i] remains unchanged*

                  ELSE *zeroing-masking*             ; zeroing-masking

                    DEST[i+63:i] := 0

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VPRORD __m512i _mm512_ror_epi32(__m512i a, int imm);
VPRORD __m512i _mm512_mask_ror_epi32(__m512i a, __mmask16 k, __m512i b, int imm);
VPRORD __m512i _mm512_maskz_ror_epi32( __mmask16 k, __m512i a, int imm);
VPRORD __m256i _mm256_ror_epi32(__m256i a, int imm);
VPRORD __m256i _mm256_mask_ror_epi32(__m256i a, __mmask8 k, __m256i b, int imm);
VPRORD __m256i _mm256_maskz_ror_epi32( __mmask8 k, __m256i a, int imm);
VPRORD __m128i _mm_ror_epi32(__m128i a, int imm);
VPRORD __m128i _mm_mask_ror_epi32(__m128i a, __mmask8 k, __m128i b, int imm);
VPRORD __m128i _mm_maskz_ror_epi32( __mmask8 k, __m128i a, int imm);
VPRORQ __m512i _mm512_ror_epi64(__m512i a, int imm);
VPRORQ __m512i _mm512_mask_ror_epi64(__m512i a, __mmask8 k, __m512i b, int imm);
VPRORQ __m512i _mm512_maskz_ror_epi64(__mmask8 k, __m512i a, int imm);
VPRORQ __m256i _mm256_ror_epi64(__m256i a, int imm);
VPRORQ __m256i _mm256_mask_ror_epi64(__m256i a, __mmask8 k, __m256i b, int imm);
VPRORQ __m256i _mm256_maskz_ror_epi64( __mmask8 k, __m256i a, int imm);
VPRORQ __m128i _mm_ror_epi64(__m128i a, int imm);
VPRORQ __m128i _mm_mask_ror_epi64(__m128i a, __mmask8 k, __m128i b, int imm);
VPRORQ __m128i _mm_maskz_ror_epi64( __mmask8 k, __m128i a, int imm);
VPRORVD __m512i _mm512_rorv_epi32(__m512i a, __m512i cnt);
VPRORVD __m512i _mm512_mask_rorv_epi32(__m512i a, __mmask16 k, __m512i b, __m512i cnt);
VPRORVD __m512i _mm512_maskz_rorv_epi32(__mmask16 k, __m512i a, __m512i cnt);
VPRORVD __m256i _mm256_rorv_epi32(__m256i a, __m256i cnt);
VPRORVD __m256i _mm256_mask_rorv_epi32(__m256i a, __mmask8 k, __m256i b, __m256i cnt);
VPRORVD __m256i _mm256_maskz_rorv_epi32(__mmask8 k, __m256i a, __m256i cnt);
VPRORVD __m128i _mm_rorv_epi32(__m128i a, __m128i cnt);
VPRORVD __m128i _mm_mask_rorv_epi32(__m128i a, __mmask8 k, __m128i b, __m128i cnt);
VPRORVD __m128i _mm_maskz_rorv_epi32(__mmask8 k, __m128i a, __m128i cnt);
VPRORVQ __m512i _mm512_rorv_epi64(__m512i a, __m512i cnt);
VPRORVQ __m512i _mm512_mask_rorv_epi64(__m512i a, __mmask8 k, __m512i b, __m512i cnt);
VPRORVQ __m512i _mm512_maskz_rorv_epi64( __mmask8 k, __m512i a, __m512i cnt);
VPRORVQ __m256i _mm256_rorv_epi64(__m256i a, __m256i cnt);
VPRORVQ __m256i _mm256_mask_rorv_epi64(__m256i a, __mmask8 k, __m256i b, __m256i cnt);
VPRORVQ __m256i _mm256_maskz_rorv_epi64(__mmask8 k, __m256i a, __m256i cnt);
VPRORVQ __m128i _mm_rorv_epi64(__m128i a, __m128i cnt);
VPRORVQ __m128i _mm_mask_rorv_epi64(__m128i a, __mmask8 k, __m128i b, __m128i cnt);
VPRORVQ __m128i _mm_maskz_rorv_epi64(__mmask8 k, __m128i a, __m128i cnt);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones codificadas por EVEX, ver Tabla 2-51, "Tipo E4 Clase Condiciones de Excepción."

VPSCATTERDD/VPSCATTERDQ/VPSCATTERQD/VPSCATTERQQ--Scatter Packed Dword, Qword empaquetado con Dword firmada, índices de Qword firmado

Código de operación/ Op/ 64/32 CPUID Característica Descripción Instrucción En bit Mode Bandera

Support

EVEX.128.66.0F38.W0 A0 /vsib A V/V (AVX512VL AND Usando índices de dwords firmados, esparcir los valores de dword a la memoria utilizando máscara de escritura k1. VPSCATTERDD vm32x {k1}, xmm1 AVX512F) OR AVX10.1

EVEX.256.66.0F38.W0 A0 /vsib A V/V (AVX512VL AND Usando índices de dwords firmados, valores de dwords

```text
                                                      AVX512F) OR    to memory using writemask k1.
```

VPSCATTERDD vm32y {k1}, ymm1 AVX10.1

EVEX.512.66.0F38.W0 A0 /vsib A V/V AVX512F Usar índices de dwords firmados, valores de dwords

```text
                                                      OR AVX10.1     to memory using writemask k1.
```

VPSCATTERDD vm32z {k1}, zmm1

EVEX.128.66.0F38.W1 A0 /vsib A V/V (AVX512VL AND Usando índices de dwords firmados, valores de qwords scatter

```text
                                                      AVX512F) OR    to memory using writemask k1.
```

VPSCATTERDQ vm32x {k1}, xmm1 AVX10.1

EVEX.256.66.0F38.W1 A0 /vsib A V/V (AVX512VL AND Usando índices de dwords firmados, valores de qwords scatter

```text
                                                      AVX512F) OR    to memory using writemask k1.
```

VPSCATTERDQ vm32x {k1}, ymm1 AVX10.1

EVEX.512.66.0F38.W1 A0 /vsib A V/V AVX512F Usando índices de dwords firmados, valores de qwords scatter

```text
                                                      OR AVX10.1     to memory using writemask k1.
```

VPSCATTERDQ vm32y {k1}, zmm1

EVEX.128.66.0F38.W0 A1 /vsib A V/V (AVX512VL AND Usando índices de qwords firmados, valores de dwords

```text
                                                      AVX512F) OR    to memory using writemask k1.
```

VPSCATTERQD vm64x {k1}, xmm1 AVX10.1

EVEX.256.66.0F38.W0 A1 /vsib A V/V (AVX512VL AND Usando índices de qwords firmados, valores de dwords

```text
                                                      AVX512F) OR    to memory using writemask k1.
```

VPSCATTERQD vm64y {k1}, xmm1                          AVX10.1

EVEX.512.66.0F38.W0 A1 /vsib A V/V AVX512F Usando índices de qwords firmados, valores de dwords

```text
                                                      OR AVX10.1     to memory using writemask k1.
```

VPSCATTERQD vm64z {k1}, ymm1

EVEX.128.66.0F38.W1 A1 /vsib A V/V (AVX512VL AND Usando índices de qwords firmados, valores de qword scatter

```text
                                                      AVX512F) OR    to memory using writemask k1.
```

VPSCATTERQQ vm64x {k1}, xmm1                          AVX10.1

EVEX.256.66.0F38.W1 A1 /vsib A V/V (AVX512VL AND Usando índices de qwords firmados, esparcir valores de qword a la memoria utilizando máscara de escritura k1. VPSCATTERQQ vm64y {k1}, ymm1 AVX512F) OR AVX10.1

EVEX.512.66.0F38.W1 A1 /vsib A V/V AVX512F Usando índices de qwords firmados, valores de qwords scatter

```text
                                                      OR AVX10.1     to memory using writemask k1.
```

VPSCATTERQQ vm64z {k1}, zmm1

## Descripción

Almacena hasta 16 elementos (8 elementos para índices de qword) en vector de doblepa o 8 elementos en vector de cuadrícula a los lugares de memoria apuntados por dirección base BASE ADDR y vector de índice VINDEX, con escala SCALE. Los elementos se especifican a través del VSIB (es decir, el registro índice es un registro vectorial, conteniendo índices empaquetados). Los elementos sólo serán almacenados si su bit de máscara correspondiente es uno. El registro completo de máscaras se establecerá a cero por esta instrucción a menos que desencadena una excepción.

VPSCATTERDD/VPSCATTERDQ/VPSCATTERQD/VPSCATTERQQ--Scatter Packed Dword, Packed Qword with Signed Dword, Signed

Esta instrucción puede ser suspendida por una excepción si al menos un elemento ya está disperso (es decir, si la excepción es activada por un elemento que no sea el más adecuado con su conjunto de bits de máscara). Cuando esto sucede, el registro de destino y el registro de máscaras se actualizan parcialmente. Si alguna trampa o interrupción está pendiente de elementos ya dispersos, serán entregados en lugar de la excepción; en este caso, EFLAG.RF se establece a uno por lo que un punto de instrucción no es re-triggered cuando la instrucción es continuada.

Note that:

* Sólo se garantiza que se ordenen los índices vectoriales superpuestos entre sí (de LSB a

MSB de los registros fuente). Tenga en cuenta que esto también incluye índices de vectores superpuestos parcialmente. Los escritos que no se superponen pueden ocurrir en cualquier orden. El pedido de memoria con otras instrucciones sigue el modelo de pedidos de memoria Intel-64. Tenga en cuenta que esto no tiene en cuenta los índices no superpuestos que mapean en los mismos lugares de dirección física.

* Si dos o más índices de destino se superponen completamente, el(s) escrito(s) "arriba" puede ser saltado. * Las fallas se entregan de una manera correcta a la izquierda. Es decir, si una falla es activada por un elemento y entregada, todo

Los elementos más cercanos a la LSB del destino ZMM serán completados (y no aprendió). Los elementos individuales más cercanos al MSB pueden o no ser completados. Si un elemento dado desencadena múltiples fallas, se entregan en el orden convencional.

* Los elementos pueden ser dispersos en cualquier orden, pero las faltas deben ser entregadas en un orden derecho a izquierda; por lo tanto, elementos a

la izquierda de un defecto uno puede ser recogido antes de la culpa es entregado. Una aplicación dada de esta instrucción es repetible - dados los mismos valores de entrada y estado arquitectónico, se reunirá el mismo conjunto de elementos a la izquierda del fallo.

* Esta instrucción no realiza cheques de AC, y así nunca entregará una falla de AC. * No válido con direcciones efectivas de 16 bits. Entregará una falla #UD. * Si esta instrucción se sobrescribe a sí misma y luego toma una falla, sólo un subconjunto de elementos se puede completar antes

la culpa se entrega (como se describe anteriormente). Si el controlador de fallas completa e intenta volver a ejecutar esta instrucción, la nueva instrucción será ejecutada, y la dispersión no se completará.

Tenga en cuenta que la presencia de VSIB byte se aplica en esta instrucción. Por lo tanto, la instrucción fallará #UD si ModRM.rm es diferente a 100b.

Esta instrucción tiene reglas especiales disp8*N y alineación. N se considera el tamaño de un único elemento vectorial.

El índice escalado puede requerir más bits que los bits de dirección utilizados por el procesador (por ejemplo, en modo 32 bits, si la escala es mayor que uno). En este caso, los bits mas significativo más allá del número de bits de dirección son ignorados.

La instrucción fallará #UD si se especifica el registro de máscara k0.

La instrucción fallará #UD si EVEX.Z = 1.

## Operación

```text
BASE_ADDR stands for the memory operand base address (a GPR); may not exist
VINDEX stands for the memory operand vector of indices (a ZMM register)
SCALE stands for the memory operand scalar (1, 2, 4 or 8)
DISP is the optional 1 or 4 byte displacement

VPSCATTERDD (EVEX encoded versions)
(KL, VL)= (4, 128), (8, 256), (16, 512)
FOR j := 0 TO KL-1

    i := j * 32
    IF k1[j] OR *no writemask*

          THEN MEM[BASE_ADDR +SignExtend(VINDEX[i+31:i]) * SCALE + DISP] := SRC[i+31:i]
                k1[j] := 0

    FI;
ENDFOR
k1[MAX_KL-1:KL] := 0

VPSCATTERDD/VPSCATTERDQ/VPSCATTERQD/VPSCATTERQQ--Scatter Packed Dword, Packed Qword with Signed Dword, Signed

VPSCATTERDQ (EVEX encoded versions)
(KL, VL)= (2, 128), (4, 256), (8, 512)
FOR j := 0 TO KL-1

    i := j * 64
    k := j * 32
    IF k1[j] OR *no writemask*

          THEN MEM[BASE_ADDR +SignExtend(VINDEX[k+31:k]) * SCALE + DISP] := SRC[i+63:i]
                k1[j] := 0

    FI;
ENDFOR
k1[MAX_KL-1:KL] := 0

VPSCATTERQD (EVEX encoded versions)
(KL, VL)= (2, 128), (4, 256), (8, 512)
FOR j := 0 TO KL-1

    i := j * 32
    k := j * 64
    IF k1[j] OR *no writemask*

          THEN MEM[BASE_ADDR + (VINDEX[k+63:k]) * SCALE + DISP] := SRC[i+31:i]
                k1[j] := 0

    FI;
ENDFOR
k1[MAX_KL-1:KL] := 0

VPSCATTERQQ (EVEX encoded versions)
(KL, VL)= (2, 128), (4, 256), (8, 512)
FOR j := 0 TO KL-1

    i := j * 64
    IF k1[j] OR *no writemask*

          THEN MEM[BASE_ADDR + (VINDEX[j+63:j]) * SCALE + DISP] := SRC[i+63:i]
    FI;
ENDFOR
k1[MAX_KL-1:KL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VPSCATTERDD void _mm512_i32scatter_epi32(void * base, __m512i vdx, __m512i a, int scale);
VPSCATTERDD void _mm256_i32scatter_epi32(void * base, __m256i vdx, __m256i a, int scale);
VPSCATTERDD void _mm_i32scatter_epi32(void * base, __m128i vdx, __m128i a, int scale);
VPSCATTERDD void _mm512_mask_i32scatter_epi32(void * base, __mmask16 k, __m512i vdx, __m512i a, int scale);
VPSCATTERDD void _mm256_mask_i32scatter_epi32(void * base, __mmask8 k, __m256i vdx, __m256i a, int scale);
VPSCATTERDD void _mm_mask_i32scatter_epi32(void * base, __mmask8 k, __m128i vdx, __m128i a, int scale);
VPSCATTERDQ void _mm512_i32scatter_epi64(void * base, __m256i vdx, __m512i a, int scale);
VPSCATTERDQ void _mm256_i32scatter_epi64(void * base, __m128i vdx, __m256i a, int scale);
VPSCATTERDQ void _mm_i32scatter_epi64(void * base, __m128i vdx, __m128i a, int scale);
VPSCATTERDQ void _mm512_mask_i32scatter_epi64(void * base, __mmask8 k, __m256i vdx, __m512i a, int scale);
VPSCATTERDQ void _mm256_mask_i32scatter_epi64(void * base, __mmask8 k, __m128i vdx, __m256i a, int scale);
VPSCATTERDQ void _mm_mask_i32scatter_epi64(void * base, __mmask8 k, __m128i vdx, __m128i a, int scale);
VPSCATTERQD void _mm512_i64scatter_epi32(void * base, __m512i vdx, __m256i a, int scale);
VPSCATTERQD void _mm256_i64scatter_epi32(void * base, __m256i vdx, __m128i a, int scale);
VPSCATTERQD void _mm_i64scatter_epi32(void * base, __m128i vdx, __m128i a, int scale);
VPSCATTERQD void _mm512_mask_i64scatter_epi32(void * base, __mmask8 k, __m512i vdx, __m256i a, int scale);
VPSCATTERQD void _mm256_mask_i64scatter_epi32(void * base, __mmask8 k, __m256i vdx, __m128i a, int scale);
VPSCATTERQD void _mm_mask_i64scatter_epi32(void * base, __mmask8 k, __m128i vdx, __m128i a, int scale);
VPSCATTERDD/VPSCATTERDQ/VPSCATTERQD/VPSCATTERQQ--Scatter Packed Dword, Packed Qword with Signed Dword, Signed VPSCATTERQQ void _mm512_i64scatter_epi64(void * base, __m512i vdx, __m512i a, int scale);
VPSCATTERQQ void _mm256_i64scatter_epi64(void * base, __m256i vdx, __m256i a, int scale);
VPSCATTERQQ void _mm_i64scatter_epi64(void * base, __m128i vdx, __m128i a, int scale);
VPSCATTERQQ void _mm512_mask_i64scatter_epi64(void * base, __mmask8 k, __m512i vdx, __m512i a, int scale);
VPSCATTERQQ void _mm256_mask_i64scatter_epi64(void * base, __mmask8 k, __m256i vdx, __m256i a, int scale);
VPSCATTERQQ void _mm_mask_i64scatter_epi64(void * base, __mmask8 k, __m128i vdx, __m128i a, int scale);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-63, "Tipo E12 Clase Condiciones de Excepción".

VPSCATTERDD/VPSCATTERDQ/VPSCATTERQD/VPSCATTERQQ--Scatter Packed Dword, Packed Qword with Signed Dword, Signed
