---
summary: Scale escalar Float32 Relación calidad/precio con Float32
---

## Descripción

Realiza una coma flotante escala de los valores en coma flotante de precisión simple escalares en el primer operando de origen multiplicando por 2 al poder del valor flotador32 en segundo operando de origen.

La ecuación de esta operación es dada por:

```text
xmm1 := xmm2*2floor(xmm3).
```

Planta (xmm3) significa valor máximo entero xmm3.

Si el resultado no puede ser representado en una sola precisión, entonces se emite la respuesta de desbordamiento adecuada (para el escalado positivo operando), o la respuesta de subida adecuada (para el escalado negativo operando). Las respuestas de desbordamiento y desbordamiento dependen del modo de redondeo (para redondeo compatible con IEEE), así como de otros ajustes en MXCSR (fotos de máscara de visualización, bit FTZ) y en el bit SAE.

EVEX versión codificada: El primer operando de origen es un registro XMM. El segundo operando de origen es un registro XMM o una ubicación de memoria. El operando de destino es un registro XMM actualizado condicionalmente con máscara de escritura k1.

En el cuadro 5-37 y el cuadro 5-41 figuran valores de entrada especiales.

## Operación

```text
SCALE(SRC1, SRC2)
{

                ; Check for denormal operands
TMP_SRC2 := SRC2
TMP_SRC1 := SRC1
IF (SRC2 is denormal AND MXCSR.DAZ) THEN TMP_SRC2=0
IF (SRC1 is denormal AND MXCSR.DAZ) THEN TMP_SRC1=0
/* SRC2 is a 32 bits floating-point value */
DEST[31:0] := TMP_SRC1[31:0] * POW(2, Floor(TMP_SRC2[31:0]))
}


VSCALEFSS (EVEX encoded version)

IF (EVEX.b= 1) and SRC2 *is a register*

     THEN

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

     ELSE

     SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;

IF k1[0] OR *no writemask*

     THEN DEST[31:0] := SCALE(SRC1[31:0], SRC2[31:0])

     ELSE

     IF *merging-masking*                ; merging-masking

           THEN *DEST[31:0] remains unchanged*

           ELSE                          ; zeroing-masking

           DEST[31:0] := 0

     FI

FI;

DEST[127:32] := SRC1[127:32]

DEST[MAXVL-1:128] := 0
```

## Intel C/C++ compilador intrínseco

```c
VSCALEFSS __m128 _mm_scalef_round_ss(__m128 a, __m128 b, int);
VSCALEFSS __m128 _mm_mask_scalef_round_ss(__m128 s, __mmask8 k, __m128 a, __m128 b, int);
VSCALEFSS __m128 _mm_maskz_scalef_round_ss(__mmask8 k, __m128 a, __m128 b, int);
```

## SIMD coma flotante Excepciones

Desbordamiento, Desbordamiento, Inválido, Precisión, Denormal (para Src1). Denormal no se reporta para Src2.

## Otras excepciones

Ver Tabla 2-49, "Tipo E3 Clase Condiciones de Excepción".

VSCATTERDPS/VSCATTERDPD/VSCATTERQPS/VSCATTERQPD--Scatter Packed Single Precision, valores en coma flotante de precisión doble empaquetados con índices de Dword y Qword

Código de operación/ Op/E 64/32 CPUID Característica Descripción Instrucción n bit Mode Soporte de bandera

EVEX.128.66.0F38.W0 A2 /vsib A V/V (AVX512VL AND Usando índices de dwords firmados, dispersión de un solo-

VSCATTERDPS vm32x {k1}, xmm1 AVX512F) O precisión valores en coma flotante a la memoria utilizando

```text
                                                   AVX10.1        writemask k1.
```

EVEX.256.66.0F38.W0 A2 /vsib A V/V (AVX512VL AND Usando índices de dwords firmados, dispersión de un solo-

```text
                                                   AVX512F) OR    precision floating-point values to memory using
```

VSCATTERDPS vm32y {k1}, ymm1

```text
                                                   AVX10.1        writemask k1.
```

EVEX.512.66.0F38.W0 A2 /vsib A V/V AVX512F Usando índices de dwords firmados, dispersión de un solo-

```text
                                                   OR AVX10.1     precision floating-point values to memory using
```

VSCATTERDPS vm32z {k1}, zmm1                                      writemask k1.

EVEX.128.66.0F38.W1 A2 /vsib A V/V (AVX512VL AND Usando índices de dwords firmados, dispersión doble

VSCATTERDPD vm32x {k1}, xmm1 AVX512F) O precisión valores en coma flotante a la memoria utilizando

```text
                                                   AVX10.1        writemask k1.
```

EVEX.256.66.0F38.W1 A2 /vsib A V/V (AVX512VL AND Usando índices de dwords firmados, dispersión doble

VSCATTERDPD vm32y {k1}, ymm1 AVX512F) O precisión valores en coma flotante a la memoria utilizando

```text
                                                   AVX10.1        writemask k1.
```

EVEX.512.66.0F38.W1 A2 /vsib A V/V AVX512F Usando índices de dword firmados, dispersión doble

```text
                                                   OR AVX10.1     precision floating-point values to memory using
```

VSCATTERDPD vm32z {k1}, zmm1 writemask k1.

EVEX.128.66.0F38.W0 A3 /vsib A V/V (AVX512VL AND Usando índices de qwords firmados, dispersión de un solo-

```text
                                                   AVX512F) OR    precision floating-point values to memory using
```

VSCATTERQPS vm64x {k1}, xmm1                       AVX10.1        writemask k1.

EVEX.256.66.0F38.W0 A3 /vsib A V/V (AVX512VL AND Usando índices de qwords firmados, dispersión de un solo-

VSCATTERQPS vm64y {k1}, xmm1 AVX512F) O precisión valores en coma flotante a la memoria utilizando

```text
                                                   AVX10.1        writemask k1.
```

EVEX.512.66.0F38.W0 A3 /vsib A V/V AVX512F Usando índices de qwords firmados, dispersión de un solo-

```text
                                                   OR AVX10.1     precision floating-point values to memory using
```

VSCATTERQPS vm64z {k1}, ymm1 writemask k1.

EVEX.128.66.0F38.W1 A3 /vsib A V/V (AVX512VL AND Usando índices de qwords firmados, dispersión doble

```text
                                                   AVX512F) OR    precision floating-point values to memory using
```

VSCATTERQPD vm64x {k1}, xmm1                       AVX10.1        writemask k1.

EVEX.256.66.0F38.W1 A3 /vsib A V/V (AVX512VL AND Usando índices de qwords firmados, dispersión doble

VSCATTERQPD vm64y {k1}, ymm1 AVX512F) O precisión valores en coma flotante a la memoria utilizando

```text
                                                   AVX10.1        writemask k1.
```

EVEX.512.66.0F38.W1 A3 /vsib A V/V AVX512F Usando índices de qword firmados, dispersión doble

```text
                                                   OR AVX10.1     precision floating-point values to memory using
```

VSCATTERQPD vm64z {k1}, zmm1 writemask k1.

## Descripción

Almacena hasta cuatro, ocho o 16 elementos de precisión simples (o dos, cuatro o ocho elementos de doble precisión) en doble palabra/cuadword vector xmm1, ymm1 o zmm1, a las ubicaciones de memoria señaladas por la dirección base BASE ADDR y el vector de índice VINDEX, con escala SCALE. Los elementos se especifican a través del VSIB (es decir, el registro índice es un registro vectorial, conteniendo índices empaquetados). Los elementos sólo serán almacenados si su bit de máscara correspondiente es uno. El registro completo de máscaras se establecerá a cero por esta instrucción a menos que desencadena una excepción.

Esta instrucción puede ser suspendida por una excepción si al menos un elemento ya está disperso (es decir, si la excepción es activada por un elemento que no sea el más adecuado con su conjunto de bits de máscara). Cuando esto sucede, el registro de destino y el registro de máscaras (k1) se actualizan parcialmente. Si alguna trampa o interrupción está pendiente de elementos ya dispersos, serán entregados en lugar de la excepción; en este caso, EFLAG.RF se establece a uno por lo que un punto de instrucción no es re-triggered cuando la instrucción es continuada.

Note that:

* Sólo se garantiza que se ordenen los índices vectoriales superpuestos entre sí (de LSB a

MSB de los registros fuente). Tenga en cuenta que esto también incluye índices de vectores superpuestos parcialmente. Los escritos que no se superponen pueden ocurrir en cualquier orden. El pedido de memoria con otras instrucciones sigue el modelo de pedidos de memoria Intel-64. Tenga en cuenta que esto no tiene en cuenta los índices no superpuestos que mapean en los mismos lugares de dirección física.

* Si dos o más índices de destino se superponen completamente, el(s) escrito(s) "arriba" puede ser saltado. * Las fallas se entregan de una manera correcta a la izquierda. Es decir, si una falla es activada por un elemento y entregada, todo

Los elementos más cercanos a la LSB del registro fuente xmm, ymm, o zmm serán completados (y no predeterminados). Los elementos individuales más cercanos al MSB pueden o no ser completados. Si un elemento dado desencadena múltiples fallas, se entregan en el orden convencional.

* Los elementos pueden ser dispersos en cualquier orden, pero las faltas deben ser entregadas en un orden derecho a izquierda; por lo tanto, elementos a

la izquierda de un defecto uno puede ser dispersado antes de la culpa es entregado. Una aplicación dada de esta instrucción es repetible - dados los mismos valores de entrada y estado arquitectónico, el mismo conjunto de elementos a la izquierda de la falla uno será dispersado.

* Esta instrucción no realiza cheques de AC, y así nunca entregará una falla de AC. * No válido con direcciones efectivas de 16 bits. Entregará una falla #UD. * Si esta instrucción se sobrescribe a sí misma y luego toma una falla, sólo un subconjunto de elementos se puede completar antes

la culpa se entrega (como se describe anteriormente). Si el controlador de fallas completa e intenta volver a ejecutar esta instrucción, la nueva instrucción será ejecutada, y la dispersión no se completará.

Tenga en cuenta que la presencia de VSIB byte se aplica en esta instrucción. Por lo tanto, la instrucción fallará #UD si ModRM.rm es diferente a 100b.

Esta instrucción tiene reglas especiales disp8*N y alineación. N se considera el tamaño de un único elemento vectorial.

El índice escalado puede requerir más bits que los bits de dirección utilizados por el procesador (por ejemplo, en modo 32 bits, si la escala es mayor que uno). En este caso, los bits mas significativo más allá del número de bits de dirección son ignorados.

La instrucción fallará #UD si se especifica el registro de máscara k0.

## Operación

```text
BASE_ADDR stands for the memory operand base address (a GPR); may not exist
VINDEX stands for the memory operand vector of indices (a ZMM register)
SCALE stands for the memory operand scalar (1, 2, 4 or 8)
DISP is the optional 1 or 4 byte displacement

VSCATTERDPS/VSCATTERDPD/VSCATTERQPS/VSCATTERQPD--Scatter Packed Single Precision, Packed Double Precision Floating-

VSCATTERDPS (EVEX encoded versions)
(KL, VL)= (4, 128), (8, 256), (16, 512)
FOR j := 0 TO KL-1

    i := j * 32
    IF k1[j] OR *no writemask*

          THEN MEM[BASE_ADDR +SignExtend(VINDEX[i+31:i]) * SCALE + DISP] :=
                SRC[i+31:i]
                k1[j] := 0

    FI;
ENDFOR
k1[MAX_KL-1:KL] := 0

VSCATTERDPD (EVEX encoded versions)
(KL, VL)= (2, 128), (4, 256), (8, 512)
FOR j := 0 TO KL-1

    i := j * 64
    k := j * 32
    IF k1[j] OR *no writemask*

          THEN MEM[BASE_ADDR +SignExtend(VINDEX[k+31:k]) * SCALE + DISP] :=
                SRC[i+63:i]
                k1[j] := 0

    FI;
ENDFOR
k1[MAX_KL-1:KL] := 0

VSCATTERQPS (EVEX encoded versions)
(KL, VL)= (4, 128), (8, 256), (16, 512)
FOR j := 0 TO KL-1

    i := j * 32
    k := j * 64
    IF k1[j] OR *no writemask*

          THEN MEM[BASE_ADDR + (VINDEX[k+63:k]) * SCALE + DISP] :=
                SRC[i+31:i]
                k1[j] := 0

    FI;
ENDFOR
k1[MAX_KL-1:KL] := 0

VSCATTERQPD (EVEX encoded versions)
(KL, VL)= (2, 128), (4, 256), (8, 512)
FOR j := 0 TO KL-1

    i := j * 64
    IF k1[j] OR *no writemask*

          THEN MEM[BASE_ADDR + (VINDEX[i+63:i]) * SCALE + DISP] :=
                SRC[i+63:i]
                k1[j] := 0

    FI;
ENDFOR
k1[MAX_KL-1:KL] := 0

VSCATTERDPS/VSCATTERDPD/VSCATTERQPS/VSCATTERQPD--Scatter Packed Single Precision, Packed Double Precision Floating-
```

## Intel C/C++ compilador intrínseco

```c
VSCATTERDPD void _mm512_i32scatter_pd(void * base, __m512i vdx, __m512d a, int scale);
VSCATTERDPD void _mm512_mask_i32scatter_pd(void * base, __mmask8 k, __m512i vdx, __m512d a, int scale);
VSCATTERDPS void _mm512_i32scatter_ps(void * base, __m512i vdx, __m512 a, int scale);
VSCATTERDPS void _mm512_mask_i32scatter_ps(void * base, __mmask16 k, __m512i vdx, __m512 a, int scale);
VSCATTERQPD void _mm512_i64scatter_pd(void * base, __m512i vdx, __m512d a, int scale);
VSCATTERQPD void _mm512_mask_i64scatter_pd(void * base, __mmask8 k, __m512i vdx, __m512d a, int scale);
VSCATTERQPS void _mm512_i64scatter_ps(void * base, __m512i vdx, __m512 a, int scale);
VSCATTERQPS void _mm512_mask_i64scatter_ps(void * base, __mmask8 k, __m512i vdx, __m512 a, int scale);
VSCATTERDPD void _mm256_i32scatter_pd(void * base, __m256i vdx, __m256d a, int scale);
VSCATTERDPD void _mm256_mask_i32scatter_pd(void * base, __mmask8 k, __m256i vdx, __m256d a, int scale);
VSCATTERDPS void _mm256_i32scatter_ps(void * base, __m256i vdx, __m256 a, int scale);
VSCATTERDPS void _mm256_mask_i32scatter_ps(void * base, __mmask8 k, __m256i vdx, __m256 a, int scale);
VSCATTERQPD void _mm256_i64scatter_pd(void * base, __m256i vdx, __m256d a, int scale);
VSCATTERQPD void _mm256_mask_i64scatter_pd(void * base, __mmask8 k, __m256i vdx, __m256d a, int scale);
VSCATTERQPS void _mm256_i64scatter_ps(void * base, __m256i vdx, __m256 a, int scale);
VSCATTERQPS void _mm256_mask_i64scatter_ps(void * base, __mmask8 k, __m256i vdx, __m256 a, int scale);
VSCATTERDPD void _mm_i32scatter_pd(void * base, __m128i vdx, __m128d a, int scale);
VSCATTERDPD void _mm_mask_i32scatter_pd(void * base, __mmask8 k, __m128i vdx, __m128d a, int scale);
VSCATTERDPS void _mm_i32scatter_ps(void * base, __m128i vdx, __m128 a, int scale);
VSCATTERDPS void _mm_mask_i32scatter_ps(void * base, __mmask8 k, __m128i vdx, __m128 a, int scale);
VSCATTERQPD void _mm_i64scatter_pd(void * base, __m128i vdx, __m128d a, int scale);
VSCATTERQPD void _mm_mask_i64scatter_pd(void * base, __mmask8 k, __m128i vdx, __m128d a, int scale);
VSCATTERQPS void _mm_i64scatter_ps(void * base, __m128i vdx, __m128 a, int scale);
VSCATTERQPS void _mm_mask_i64scatter_ps(void * base, __mmask8 k, __m128i vdx, __m128 a, int scale);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-63, "Tipo E12 Clase Condiciones de Excepción".

VSCATTERDPS/VSCATTERDPD/VSCATTERQPS/VSCATTERQPD--Scatter Packed Single Precision, Packed Double Precision Floating-
