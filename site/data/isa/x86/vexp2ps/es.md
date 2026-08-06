---
summary: Aproximación a la Exponencial 2^x de Packed coma flotante de precisión simple
---

## Descripción

Computa la evaluación exponencial base-2 aproximada de los valores de punto flotante de precisión único en el operado fuente (el segundo operand) y almacena los resultados en el operado de destino (el primer operand) utilizando el scriptmask k1. El exponencial base-2 aproximado se evalúa con menos de 2^-23 de error relativo.

Los valores de entrada denormales se tratan como ceros y no indican #DE, independientemente de MXCSR.DAZ. Los resultados denormales se dividen a ceros y no indican #UE, independientemente de MXCSR.FTZ.

El operando de origen es un registro ZMM, una ubicación de memoria de 512 bits, o un vector de 512 bits emitido desde una ubicación de memoria de 32 bits. El operando de destino es un registro ZMM, actualizado condicionalmente utilizando máscara de escritura k1.

EVEX.vvvv está reservado y debe ser 1111b instrucciones de lo contrario #UD.

En https://software.intel.com/en-us/articles/reference-implementations-for-IA-approximation-instructions-vrcp14-vrcp28-vrsqrt28-vrsqrt28-vexp2.

## Operación

```text
VEXP2PS

(KL, VL) = (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask* THEN

             IF (EVEX.b = 1) AND (SRC *is memory*)

                  THEN DEST[i+31:i] := EXP2_23_SP(SRC[31:0])

                  ELSE DEST[i+31:i] := EXP2_23_SP(SRC[i+31:i])

             FI;

ELSE

     IF *merging-masking*                 ; merging-masking

             THEN *DEST[i+31:i] remains unchanged*

             ELSE                         ; zeroing-masking

                  DEST[i+31:i] := 0

     FI;

FI;

ENDFOR;



Source Input                   Table 8-2. Special Values Behavior  Comments
NaN               Result                                           If (SRC = SNaN) then #I
+                 QNaN(src)
+/-0              +                                                Exact result
-                 1.0f
Integral value N  +0.0f                                            Exact result
                  2^ (N)
```

## Intel C/C++ compilador intrínseco

```c
VEXP2PS __m512 _mm512_exp2a23_round_ps (__m512 a, int sae);
VEXP2PS __m512 _mm512_mask_exp2a23_round_ps (__m512 a, __mmask16 m, __m512 b, int sae);
VEXP2PS __m512 _mm512_maskz_exp2a23_round_ps (__mmask16 m, __m512 b, int sae);
```

## SIMD coma flotante Excepciones

Inválido (si entrada SNaN), Desbordamiento.

## Otras excepciones

Ver Tabla 2-48, "Tipo E2 Clase Condiciones de Excepción".

VGATHERPF0DPS/VGATHERPF0QPS/VGATHERPF0DPD/VGATHERPF0QPD--Sparse Prefetch Packed SP/DP Valores de datos con Dword firmada, índices de Qword firmados utilizando T0 Hint

Código de operación/ Op/ 64/32 CPUID Descripción Instrucción En bit Mode Feature Support Flag

EVEX.512.66.0F38.W0 C6 /1 /vsib A V/V AVX512PF Usando índices de dword firmados, prefetch sparse byte VGATHERPF0DPS vm32z {k1} memoria local que contiene datos de precisión simple

usando la pista de omask k1 y T0.

EVEX.512.66.0F38.W0 C7 /1 /vsib A V/V AVX512PF Usando índices de qwords firmados, prefetch sparse byte VGATHERPF0QPS vm64z {k1} de memoria que contiene datos de precisión únicos utilizando la pista de omask k1 y T0.

EVEX.512.66.0F38.W1 C6 /1 /vsib A V/V AVX512PF Usando índices de dwords firmados, prefetch sparse byte VGATHERPF0DPD vm32y {k1} memoria localizaciones que contienen datos de doble precisión usando la insignia de opmask k1 y T0.

EVEX.512.66.0F38.W1 C7 /1 /vsib A V/V AVX512PF Usando índices de qword firmados, prefetch sparse byte VGATHERPF0QPD vm64z {k1} memoria local que contiene datos de doble precisión

usando la pista de omask k1 y T0.

## Descripción

La instrucción prefija condicionalmente hasta dieciséis elementos de datos de byte de 32 bits o ocho de 64 bits. Los elementos se especifican a través del VSIB (es decir, el registro índice es un zmm, que contiene índices empaquetados). Los elementos sólo serán prefechados si su parte de máscara correspondiente es uno.

Las líneas prefetched se cargan a una ubicación en la jerarquía de caché especificada por una pista de localización (T0):

* T0 (datos temporales)--preparar datos en el caché de primer nivel.

[PS data] Para índices de dword, la instrucción preverá dieciséis lugares de memoria. Para los índices de qword, la instrucción preverá ocho valores.

Para índices de dword y qword, la instrucción pretraerá ocho ubicaciones de memoria.

Note that:

(1) Los prefijos pueden ocurrir en cualquier orden (o no en absoluto). La instrucción es una pista.

(2) La máscara se deja sin cambios.

(3) No válido con direcciones efectivas de 16 bits. Entregará una falla #UD.

(4) No FP ni fallas de memoria pueden ser producidas por esta instrucción.

(5) Prefetches no descriptor cache line splits

(6) A #UD se señaliza si el operando de memoria está codificado sin el byte SIB.

## Operación

```text
BASE_ADDR stands for the memory operand base address (a GPR); may not exist.
VINDEX stands for the memory operand vector of indices (a vector register).
SCALE stands for the memory operand scalar (1, 2, 4 or 8).
DISP is the optional 1, 2 or 4 byte displacement.
PREFETCH(mem, Level, State) Prefetches a byte memory location pointed by `mem' into the cache level specified by `Level'; a request
for exclusive/ownership is done if `State' is 1. Note that the memory location ignore cache line splits. This operation is considered a
hint for the processor and may be skipped depending on implementation.

VGATHERPF0DPS/VGATHERPF0QPS/VGATHERPF0DPD/VGATHERPF0QPD--Sparse Prefetch Packed SP/DP Data Values With Signed


VGATHERPF0DPS (EVEX Encoded Version)
(KL, VL) = (16, 512)
FOR j := 0 TO KL-1

    i := j * 32
    IF k1[j]

          Prefetch( [BASE_ADDR + SignExtend(VINDEX[i+31:i]) * SCALE + DISP], Level=0, RFO = 0)
    FI;
ENDFOR

VGATHERPF0DPD (EVEX Encoded Version)
(KL, VL) = (8, 512)
FOR j := 0 TO KL-1

    i := j * 64
    k := j * 32
    IF k1[j]

          Prefetch( [BASE_ADDR + SignExtend(VINDEX[k+31:k]) * SCALE + DISP], Level=0, RFO = 0)
    FI;
ENDFOR

VGATHERPF0QPS (EVEX Encoded Version)
(KL, VL) = (8, 256)
FOR j := 0 TO KL-1

    i := j * 64
    IF k1[j]

          Prefetch( [BASE_ADDR + SignExtend(VINDEX[i+63:i]) * SCALE + DISP], Level=0, RFO = 0)
    FI;
ENDFOR

VGATHERPF0QPD (EVEX Encoded Version)
(KL, VL) = (8, 512)
FOR j := 0 TO KL-1

    i := j * 64
    k := j * 64
    IF k1[j]

          Prefetch( [BASE_ADDR + SignExtend(VINDEX[k+63:k]) * SCALE + DISP], Level=0, RFO = 0)
    FI;
ENDFOR
```

## Intel C/C++ compilador intrínseco

```c
VGATHERPF0DPD void _mm512_mask_prefetch_i32gather_pd(__m256i vdx, __mmask8 m, void * base, int scale, int hint);
VGATHERPF0DPS void _mm512_mask_prefetch_i32gather_ps(__m512i vdx, __mmask16 m, void * base, int scale, int hint);
VGATHERPF0QPD void _mm512_mask_prefetch_i64gather_pd(__m512i vdx, __mmask8 m, void * base, int scale, int hint);
VGATHERPF0QPS void _mm512_mask_prefetch_i64gather_ps(__m512i vdx, __mmask8 m, void * base, int scale, int hint);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-64, "Tipo E12NP Clase Condiciones de Excepción".

VGATHERPF0DPS/VGATHERPF0QPS/VGATHERPF0DPD/VGATHERPF0QPD--Sparse Prefetch Packed SP/DP Data Values With Signed

VGATHERPF1DPS/VGATHERPF1QPS/VGATHERPF1DPD/VGATHERPF1QPD--Sparse Prefetch Packed SP/DP Valores de datos con Dword firmada, índices de Qword firmados utilizando T1 Hint

Código de operación/ Op/ 64/32 CPUID Descripción Instrucción En bit Mode Feature Support Flag

EVEX.512.66.0F38.W0 C6 /2 /vsib A V/V AVX512PF Usando índices de dwords firmados, localizaciones de memoria de byte prefetch escasos que contienen datos de precisión únicos utilizando VGATHERPF1DPS vm32z {k1} opmask k1 y T1 indirect.

EVEX.512.66.0F38.W0 C7 /2 /vsib A V/V AVX512PF Usando índices de qwords firmados, prefetch sparse byte

Ubicaciones de memoria VGATHERPF1QPS vm64z {k1} que contienen datos de precisión únicos utilizando la pista de omask k1 y T1.

EVEX.512.66.0F38.W1 C6 /2 /vsib A V/V AVX512PF Usando índices de dwords firmados, localizaciones de memoria de byte prefetch escasos que contienen datos de doble precisión usando VGATHERPF1DPD vm32y {k1} opmask k1 y T1 indirect.

EVEX.512.66.0F38.W1 C7 /2 /vsib A V/V AVX512PF Usando índices de qwords firmados, localizaciones de memoria de byte espaciadas prefetch que contienen datos de doble precisión utilizando VGATHERPF1QPD vm64z {k1} opmask k1 y T1 indirecta.

## Descripción

La instrucción prefija condicionalmente hasta dieciséis elementos de datos de byte de 32 bits o ocho de 64 bits. Los elementos se especifican a través del VSIB (es decir, el registro índice es un zmm, que contiene índices empaquetados). Los elementos sólo serán prefechados si su parte de máscara correspondiente es uno.

Las líneas prefetched se cargan a una ubicación en la jerarquía de caché especificada por una pista de localidad (T1):

* T1 (datos temporales)--preparar datos en el segundo nivel de caché.

[PS data] Para índices de dword, la instrucción preverá dieciséis lugares de memoria. Para los índices de qword, la instrucción preverá ocho valores.

Para índices de dword y qword, la instrucción pretraerá ocho ubicaciones de memoria.

Note that:

(1) Los prefijos pueden ocurrir en cualquier orden (o no en absoluto). La instrucción es una pista.

(2) La máscara se deja sin cambios.

(3) No válido con direcciones efectivas de 16 bits. Entregará una falla #UD.

(4) No FP ni fallas de memoria pueden ser producidas por esta instrucción.

(5) Prefetches no descriptor cache line splits

(6) A #UD se señaliza si el operando de memoria está codificado sin el byte SIB.

## Operación

```text
BASE_ADDR stands for the memory operand base address (a GPR); may not exist.
VINDEX stands for the memory operand vector of indices (a vector register).
SCALE stands for the memory operand scalar (1, 2, 4 or 8).
DISP is the optional 1, 2 or 4 byte displacement.
PREFETCH(mem, Level, State) Prefetches a byte memory location pointed by `mem' into the cache level specified by `Level'; a request
for exclusive/ownership is done if `State' is 1. Note that the memory location ignore cache line splits. This operation is considered a
hint for the processor and may be skipped depending on implementation.

VGATHERPF1DPS/VGATHERPF1QPS/VGATHERPF1DPD/VGATHERPF1QPD--Sparse Prefetch Packed SP/DP Data Values With Signed


VGATHERPF1DPS (EVEX Encoded Version)
(KL, VL) = (16, 512)
FOR j := 0 TO KL-1

    i := j * 32
    IF k1[j]

          Prefetch( [BASE_ADDR + SignExtend(VINDEX[i+31:i]) * SCALE + DISP], Level=1, RFO = 0)
    FI;
ENDFOR

VGATHERPF1DPD (EVEX Encoded Version)
(KL, VL) = (8, 512)
FOR j := 0 TO KL-1

    i := j * 64
    k := j * 32
    IF k1[j]

          Prefetch( [BASE_ADDR + SignExtend(VINDEX[k+31:k]) * SCALE + DISP], Level=1, RFO = 0)
    FI;
ENDFOR

VGATHERPF1QPS (EVEX Encoded Version)
(KL, VL) = (8, 256)
FOR j := 0 TO KL-1

    i := j * 64
    IF k1[j]

          Prefetch( [BASE_ADDR + SignExtend(VINDEX[i+63:i]) * SCALE + DISP], Level=1, RFO = 0)
    FI;
ENDFOR

VGATHERPF1QPD (EVEX Encoded Version)
(KL, VL) = (8, 512)
FOR j := 0 TO KL-1

    i := j * 64
    k := j * 64
    IF k1[j]

          Prefetch( [BASE_ADDR + SignExtend(VINDEX[k+63:k]) * SCALE + DISP], Level=1, RFO = 0)
    FI;
ENDFOR
```

## Intel C/C++ compilador intrínseco

```c
VGATHERPF1DPD void _mm512_mask_prefetch_i32gather_pd(__m256i vdx, __mmask8 m, void * base, int scale, int hint);
VGATHERPF1DPS void _mm512_mask_prefetch_i32gather_ps(__m512i vdx, __mmask16 m, void * base, int scale, int hint);
VGATHERPF1QPD void _mm512_mask_prefetch_i64gather_pd(__m512i vdx, __mmask8 m, void * base, int scale, int hint);
VGATHERPF1QPS void _mm512_mask_prefetch_i64gather_ps(__m512i vdx, __mmask8 m, void * base, int scale, int hint);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-64, "Tipo E12NP Clase Condiciones de Excepción".

VGATHERPF1DPS/VGATHERPF1QPS/VGATHERPF1DPD/VGATHERPF1QPD--Sparse Prefetch Packed SP/DP Data Values With Signed
