---
summary: Mover o combinar valores en coma flotante de precisión doble escalares
---

## Descripción

Mueva unos valores en coma flotante de precisión doble escalares del operando de origen (segundo operando) al operando de destino (primer operando). La fuente y operandos de destino pueden ser registros XMM o ubicaciones de memoria de 64 bits. Esta instrucción se puede utilizar para mover un valor en coma flotante de precisión doble a y desde el cuadword bajo de un registro XMM y una ubicación de memoria de 64 bits, o para mover un valor en coma flotante de precisión doble entre los cuadwords bajos de dos registros XMM. La instrucción no puede utilizarse para transferir datos entre los lugares de memoria.

Versión de Legacy: Cuando la fuente y operandos de destino son registros XMM, bits MAXVL:64 del operando de destino permanece sin cambios. Cuando el operando de origen es una ubicación de memoria y operando de destino es un XMM

registra, el cuádword en bits 127:64 del operando de destino se pone a cero a todos los 0s, bits MAXVL:128 del operando de destino permanece sin cambios.

VEX y EVEX codificados sintaxis registro-register: Mueva unos valores en coma flotante de precisión doble escalares del segundo operando de origen (el tercer operando) al elemento de cuádpago bajo del operando de destino (el primer operando). Los bits 127:64 del operando de destino son copiados del primer operando de origen (el segundo operando). Bits (MAXVL-1:128) del registro de destino correspondiente se ponen a cero.

VEX y EVEX sintaxis de la memoria codificada: Cuando el operando de origen es una ubicación de memoria y operando de destino es un XMM registros, bits MAXVL:64 del operando de destino se pone a cero a todos los 0s.

EVEX versiones codificadas: El cuádpago bajo del destino se actualiza según la máscara de escritura.

Nota: For VMOVSD (memory store and load forms), VEX.vvvv and EVEX.vvvv are reserved and must be 1111b, otherwise instruction will #UD.

## Operación

```text
VMOVSD (EVEX.LLIG.F2.0F 10 /r: VMOVSD xmm1, m64 With Support for 32 Registers)

IF k1[0] or *no writemask*

     THEN DEST[63:0] := SRC[63:0]

     ELSE

     IF *merging-masking*           ; merging-masking

           THEN *DEST[63:0] remains unchanged*

           ELSE                     ; zeroing-masking

           THEN DEST[63:0] := 0

     FI;

FI;

DEST[MAXVL-1:64] := 0

VMOVSD (EVEX.LLIG.F2.0F 11 /r: VMOVSD m64, xmm1 With Support for 32 Registers)

IF k1[0] or *no writemask*

     THEN DEST[63:0] := SRC[63:0]

     ELSE *DEST[63:0] remains unchanged*        ; merging-masking

FI;

VMOVSD (EVEX.LLIG.F2.0F 11 /r: VMOVSD xmm1, xmm2, xmm3)

IF k1[0] or *no writemask*

     THEN DEST[63:0] := SRC2[63:0]

     ELSE

     IF *merging-masking*           ; merging-masking

           THEN *DEST[63:0] remains unchanged*

           ELSE                     ; zeroing-masking

           THEN DEST[63:0] := 0

     FI;

FI;

DEST[127:64] := SRC1[127:64]

DEST[MAXVL-1:128] := 0

MOVSD (128-bit Legacy SSE Version: MOVSD xmm1, xmm2)
DEST[63:0] := SRC[63:0]
DEST[MAXVL-1:64] (Unmodified)


VMOVSD (VEX.128.F2.0F 11 /r: VMOVSD xmm1, xmm2, xmm3)
DEST[63:0] := SRC2[63:0]
DEST[127:64] := SRC1[127:64]
DEST[MAXVL-1:128] := 0

VMOVSD (VEX.128.F2.0F 10 /r: VMOVSD xmm1, xmm2, xmm3)
DEST[63:0] := SRC2[63:0]
DEST[127:64] := SRC1[127:64]
DEST[MAXVL-1:128] := 0

VMOVSD (VEX.128.F2.0F 10 /r: VMOVSD xmm1, m64)
DEST[63:0] := SRC[63:0]
DEST[MAXVL-1:64] := 0

MOVSD/VMOVSD (128-bit Versions: MOVSD m64, xmm1 or VMOVSD m64, xmm1)
DEST[63:0] := SRC[63:0]

MOVSD (128-bit Legacy SSE Version: MOVSD xmm1, m64)
DEST[63:0] := SRC[63:0]
DEST[127:64] := 0
DEST[MAXVL-1:128] (Unmodified)
```

## Intel C/C++ compilador intrínseco

```c
VMOVSD __m128d _mm_mask_load_sd(__m128d s, __mmask8 k, double * p);
VMOVSD __m128d _mm_maskz_load_sd( __mmask8 k, double * p);
VMOVSD __m128d _mm_mask_move_sd(__m128d sh, __mmask8 k, __m128d sl, __m128d a);
VMOVSD __m128d _mm_maskz_move_sd( __mmask8 k, __m128d s, __m128d a);
VMOVSD void _mm_mask_store_sd(double * p, __mmask8 k, __m128d s);
MOVSD __m128d _mm_load_sd (double *p) MOVSD void _mm_store_sd (double *p, __m128d a) MOVSD __m128d _mm_move_sd ( __m128d a, __m128d b);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones no codificadas en EVEX, ver Tabla 2-22, "Tipo 5 Condiciones de Excepción," adicionalmente:

```text
#UD               If VEX.vvvv != 1111B.
```

Instrucciones codificadas por EVEX, ver Tabla 2-60, "Tipo E10 Clase Condiciones de Excepción."
