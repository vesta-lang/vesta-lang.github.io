---
summary: Aproximación a la Cuadrícula Recíproca de escalar Flotación de una sola precisión
---

## Descripción

Computa la raíz cuadrada recíproca del valor bajo flotador32 en el segundo operando de origen (el tercer operando) y almacenar el resultado al operando de destino (el primer operando). La raíz cuadrada recíproca aproximada se evalúa con menos de 2^-28 de error relativo máximo antes de redondeo final. El resultado final es redondeado a < 2^-23 error relativo antes de escribir al elemento bajo flota32 del destino según la máscara de escritura k1. Los bits 127:32 del destino se copian de los bits correspondientes del primer operando de origen (el segundo operando).

Si algún elemento fuente es NaN, el valor fuente NaN silencioso es devuelto para ese elemento. Números de origen negativo (no cero), así como -, devolver la NaN canónica y establecer la Bandera Inválida (#I).

Un valor de -0 debe regresar - y establecer las banderas DivByZero (#Z). Los números negativos deben devolver NaN y establecer la bandera Inválida (#I). Note sin embargo que la instrucción desactiva la entrada a cero del mismo signo, por lo que los denormales negativos regresan - y establecer la bandera DivByZero.

El primer operando de origen es un registro XMM. El segundo operando de origen es un registro XMM o una ubicación de memoria de 32 bits. El operando de destino es un registro XMM.

En https://software.intel.com/en-us/articles/reference-implementations-for-IA-approximation-instructions-vrcp14-vrsqrt14-vrcp28-vrsqrt28-vrsqrt28-vexp2.

## Operación

```text
VRSQRT28SS (EVEX Encoded Versions)

IF k1[0] OR *no writemask* THEN

             DEST[31: 0] := (1.0/ SQRT(SRC[31: 0]));

ELSE

     IF *merging-masking*           ; merging-masking

           THEN *DEST[31: 0] remains unchanged*

           ELSE                     ; zeroing-masking

             DEST[31: 0] := 0

     FI;

FI;

ENDFOR;

DEST[127:32] := SRC1[127: 32]

DEST[MAXVL-1:128] := 0



                             Table 8-10. VRSQRT28SS Special Cases

Input Value                  Result Value              Comments
NAN
X = 2-2n                     QNAN(input)               If (SRC = SNaN) then #I
X<0
X = -0 or negative denormal  2n
X = +0 or positive denormal
X = +INF                     QNaN_Indefinite           Including -INF

                             -INF                      #Z

                             +INF                      #Z

                             +0
```

## Intel C/C++ compilador intrínseco

```c
VRSQRT28SS __m128 _mm_rsqrt28_round_ss(__m128 a, __m128 b, int rounding);
VRSQRT28SS __m128 _mm_mask_rsqrt28_round_ss(__m128 s, __mmask8 m,__m128 a,__m128 b, int rounding);
VRSQRT28SS __m128 _mm_maskz_rsqrt28_round_ss(__mmask8 m,__m128 a,__m128 b, int rounding);
```

## SIMD coma flotante Excepciones

Inválido (si la entrada SNaN), Divide-by-zero.

## Otras excepciones

Ver Tabla 2-49, "Tipo E3 Clase Condiciones de Excepción".

VSCATTERPF0DPS/VSCATTERPF0QPS/VSCATTERPF0DPD/VSCATTERPF0QPD--Sparse Prefetch Packed SP/DP Data Values with Signed Dword, Signed Qword Indices Using T0 Hint With Intent to Write

Código de operación/ Op/ 64/32 CPUID Descripción Instrucción En bit Mode Feature Support Flag

EVEX.512.66.0F38.W0 C6 /5 /vsib A V/V AVX512PF Usando índices de dwords firmados, prefetch sparse byte

VSCATTERPF0DPS vm32z {k1} ubicaciones de memoria que contienen datos de precisión simple utilizando máscara de escritura k1 y T0 indirecta con intención de escribir.

EVEX.512.66.0F38.W0 C7 /5 /vsib A V/V AVX512PF Usando índices de qwords firmados, localizaciones de memoria de byte prefetch escasos que contienen datos de precisión únicos utilizando VSCATTERPF0QPS vm64z {k1} máscara de escritura k1 y T0 indirecta con intención de escribir.

EVEX.512.66.0F38.W1 C6 /5 /vsib A V/V AVX512PF Usando índices de dwords firmados, localizaciones de memoria de byte prefetch escasos que contienen datos de doble precisión VSCATTERPF0DPD vm32y {k1} utilizando máscara de escritura k1 y T0 indirecta con intención de escribir.

EVEX.512.66.0F38.W1 C7 /5 /vsib A V/V AVX512PF Usando índices de qwords firmados, prefetch sparse byte

VSCATTERPF0QPD vm64z {k1} ubicaciones de memoria que contienen datos de doble precisión utilizando máscara de escritura k1 y T0 indirecta con intención de escribir.

## Descripción

La instrucción prefija condicionalmente hasta dieciséis elementos de datos de byte de 32 bits o ocho de 64 bits. Los elementos se especifican a través del VSIB (es decir, el registro índice es un zmm, que contiene índices empaquetados). Los elementos sólo serán prefechados si su parte de máscara correspondiente es uno.

las líneas de caché se introducirán en el estado exclusivo (RFO) especificado por una pista de localización (T0):

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

VSCATTERPF0DPS/VSCATTERPF0QPS/VSCATTERPF0DPD/VSCATTERPF0QPD--Sparse Prefetch Packed SP/DP Data Values with


VSCATTERPF0DPS (EVEX Encoded Version)
(KL, VL) = (16, 512)
FOR j := 0 TO KL-1

    i := j * 32
    IF k1[j]

          Prefetch( [BASE_ADDR + SignExtend(VINDEX[i+31:i]) * SCALE + DISP], Level=0, RFO = 1)
    FI;
ENDFOR

VSCATTERPF0DPD (EVEX Encoded Version)
(KL, VL) = (8, 512)
FOR j := 0 TO KL-1

    i := j * 64
    k := j * 32
    IF k1[j]

          Prefetch( [BASE_ADDR + SignExtend(VINDEX[k+31:k]) * SCALE + DISP], Level=0, RFO = 1)
    FI;
ENDFOR

VSCATTERPF0QPS (EVEX Encoded Version)
(KL, VL) = (8, 256)
FOR j := 0 TO KL-1

    i := j * 64
    IF k1[j]

          Prefetch( [BASE_ADDR + SignExtend(VINDEX[i+63:i]) * SCALE + DISP], Level=0, RFO = 1)
    FI;
ENDFOR

VSCATTERPF0QPD (EVEX Encoded Version)
(KL, VL) = (8, 512)
FOR j := 0 TO KL-1

    i := j * 64
    k := j * 64
    IF k1[j]

          Prefetch( [BASE_ADDR + SignExtend(VINDEX[k+63:k]) * SCALE + DISP], Level=0, RFO = 1)
    FI;
ENDFOR
```

## Intel C/C++ compilador intrínseco

```c
VSCATTERPF0DPD void _mm512_prefetch_i32scatter_pd(void *base, __m256i vdx, int scale, int hint);
VSCATTERPF0DPD void _mm512_mask_prefetch_i32scatter_pd(void *base, __mmask8 m, __m256i vdx, int scale, int hint);
VSCATTERPF0DPS void _mm512_prefetch_i32scatter_ps(void *base, __m512i vdx, int scale, int hint);
VSCATTERPF0DPS void _mm512_mask_prefetch_i32scatter_ps(void *base, __mmask16 m, __m512i vdx, int scale, int hint);
VSCATTERPF0QPD void _mm512_prefetch_i64scatter_pd(void * base, __m512i vdx, int scale, int hint);
VSCATTERPF0QPD void _mm512_mask_prefetch_i64scatter_pd(void * base, __mmask8 m, __m512i vdx, int scale, int hint);
VSCATTERPF0QPS void _mm512_prefetch_i64scatter_ps(void * base, __m512i vdx, int scale, int hint);
VSCATTERPF0QPS void _mm512_mask_prefetch_i64scatter_ps(void * base, __mmask8 m, __m512i vdx, int scale, int hint);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-64, "Tipo E12NP Clase Condiciones de Excepción".

VSCATTERPF0DPS/VSCATTERPF0QPS/VSCATTERPF0DPD/VSCATTERPF0QPD--Sparse Prefetch Packed SP/DP Valores de datos con

VSCATTERPF1DPS/VSCATTERPF1QPS/VSCATTERPF1DPD/VSCATTERPF1QPD--Sparse Prefetch Packed SP/DP Valores de datos con Dword firmada, índices de Qword firmados utilizando T1 Hint con la intención de escribir

Código de operación/ Op/ 64/32 CPUID Descripción Instrucción En bit Mode Feature Support Flag

EVEX.512.66.0F38.W0 C6 /6 /vsib A V/V AVX512PF Usando índices de dwords firmados, memoria de byte espaciada prefetch

VSCATTERPF1DPS vm32z {k1} localizaciones que contienen datos de precisión únicos utilizando la pista máscara de escritura k1 y T1 con intención de escribir.

EVEX.512.66.0F38.W0 C7 /6 /vsib A V/V AVX512PF Usando índices de qwords firmados, localizaciones de memoria de byte prefetch escasos que contienen datos de precisión únicos utilizando máscara de escritura VSCATTERPF1QPS vm64z {k1} k1 y T1 indirecta con intención de escribir.

EVEX.512.66.0F38.W1 C6 /6 /vsib A V/V AVX512PF Usando índices de dwords firmados, localizaciones de memoria de byte prefetch escasas que contienen datos de doble precisión usando VSCATTERPF1DPD vm32y {k1} máscara de escritura k1 y T1 indirecta con intención de escribir.

EVEX.512.66.0F38.W1 C7 /6 /vsib A V/V AVX512PF Usando índices de qwords firmados, memoria de byte prefetch escasa

VSCATTERPF1QPD vm64z {k1} localizaciones que contienen datos de doble precisión utilizando máscara de escritura k1 y T1 pista con intención de escribir.

## Descripción

La instrucción prefija condicionalmente hasta dieciséis elementos de datos de byte de 32 bits o ocho de 64 bits. Los elementos se especifican a través del VSIB (es decir, el registro índice es un zmm, que contiene índices empaquetados). Los elementos sólo serán prefechados si su parte de máscara correspondiente es uno.

las líneas de caché se introducirán en el estado exclusivo (RFO) especificado por una pista de localización (T1):

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

VSCATTERPF1DPS/VSCATTERPF1QPS/VSCATTERPF1DPD/VSCATTERPF1QPD--Sparse Prefetch Packed SP/DP Data Values With


VSCATTERPF1DPS (EVEX Encoded Version)
(KL, VL) = (16, 512)
FOR j := 0 TO KL-1

    i := j * 32
    IF k1[j]

          Prefetch( [BASE_ADDR + SignExtend(VINDEX[i+31:i]) * SCALE + DISP], Level=1, RFO = 1)
    FI;
ENDFOR

VSCATTERPF1DPD (EVEX Encoded Version)
(KL, VL) = (8, 512)
FOR j := 0 TO KL-1

    i := j * 64
    k := j * 32
    IF k1[j]

          Prefetch( [BASE_ADDR + SignExtend(VINDEX[k+31:k]) * SCALE + DISP], Level=1, RFO = 1)
    FI;
ENDFOR

VSCATTERPF1QPS (EVEX Encoded Version)
(KL, VL) = (8, 512)
FOR j := 0 TO KL-1

    i := j * 64
    IF k1[j]

          Prefetch( [BASE_ADDR + SignExtend(VINDEX[i+63:i]) * SCALE + DISP], Level=1, RFO = 1)
    FI;
ENDFOR

VSCATTERPF1QPD (EVEX Encoded Version)
(KL, VL) = (8, 512)
FOR j := 0 TO KL-1

    i := j * 64
    k := j * 64
    IF k1[j]

          Prefetch( [BASE_ADDR + SignExtend(VINDEX[k+63:k]) * SCALE + DISP], Level=1, RFO = 1)
    FI;
ENDFOR
```

## Intel C/C++ compilador intrínseco

```c
VSCATTERPF1DPD void _mm512_prefetch_i32scatter_pd(void *base, __m256i vdx, int scale, int hint);
VSCATTERPF1DPD void _mm512_mask_prefetch_i32scatter_pd(void *base, __mmask8 m, __m256i vdx, int scale, int hint);
VSCATTERPF1DPS void _mm512_prefetch_i32scatter_ps(void *base, __m512i vdx, int scale, int hint);
VSCATTERPF1DPS void _mm512_mask_prefetch_i32scatter_ps(void *base, __mmask16 m, __m512i vdx, int scale, int hint);
VSCATTERPF1QPD void _mm512_prefetch_i64scatter_pd(void * base, __m512i vdx, int scale, int hint);
VSCATTERPF1QPD void _mm512_mask_prefetch_i64scatter_pd(void * base, __mmask8 m, __m512i vdx, int scale, int hint);
VSCATTERPF1QPS void _mm512_prefetch_i64scatter_ps(void *base, __m512i vdx, int scale, int hint);
VSCATTERPF1QPS void _mm512_mask_prefetch_i64scatter_ps(void *base, __mmask8 m, __m512i vdx, int scale, int hint);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-64, "Tipo E12NP Clase Condiciones de Excepción".

VSCATTERPF1DPS/VSCATTERPF1QPS/VSCATTERPF1DPD/VSCATTERPF1QPD--Sparse Prefetch Packed SP/DP Valores de datos con
