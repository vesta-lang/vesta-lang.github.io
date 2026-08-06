---
summary: Mover o combinar valores en coma flotante de precisión simple escalares
---

## Descripción

Mueva unos valores en coma flotante de precisión simple escalares del operando de origen (segundo operando) al operando de destino (primer operando). La fuente y operandos de destino pueden ser registros XMM o ubicaciones de memoria de 32 bits. Esta instrucción se puede utilizar para mover un valor en coma flotante de precisión simple a y desde la palabra doble baja de un registro XMM y una ubicación de memoria de 32 bits, o para mover un valor en coma flotante de precisión simple entre las palabras dobles bajas de dos registros XMM. La instrucción no puede utilizarse para transferir datos entre los lugares de memoria.

Versión de Legacy: Cuando la fuente y operandos de destino son registros XMM, bits (MAXVL-1:32) del registro de destino correspondiente no están modificados. Cuando el operando de origen es una ubicación de memoria y destino

operando es un registro XMM, Bits (127:32) del operando de destino se pone a cero a todos los 0s, bits MAXVL:128 del operando de destino permanece sin cambios.

VEX y EVEX codificados sintaxis registro-register: Mueva unos valores en coma flotante de precisión simple escalares del segundo operando de origen (el tercer operando) al elemento de palabra doble baja del operando de destino (el primer operando). Los bits 127:32 del operando de destino son copiados del primer operando de origen (el segundo operando). Bits (MAXVL-1:128) del registro de destino correspondiente se ponen a cero.

VEX y EVEX sintaxis de carga de memoria codificada: Cuando el operando de origen es una ubicación de memoria y operando de destino es un XMM registros, bits MAXVL:32 del operando de destino se pone a cero a todos los 0s.

EVEX versiones codificadas: La palabra doble baja del destino se actualiza según la máscara de escritura.

Nota: Para instrucciones de formulario de memoria "VMOVSS m32, xmm1", VEX.vvvv está reservado y debe ser 1111b instrucción de otra manera #UD. Para instrucciones de formulario de memoria "VMOVSS mv {k1}, xmm1", EVEX.vvvv está reservado y debe ser 1111b instrucción de otra manera #UD.

El software debe asegurar que VMOVSS esté codificado con VEX.L=0. Codificar VMOVSS con VEX.L=1 puede encontrar un comportamiento impredecible en diferentes generaciones de procesadores.

## Operación

```text
VMOVSS (EVEX.LLIG.F3.0F.W0 11 /r When the Source Operand is Memory and the Destination is an XMM Register)

IF k1[0] or *no writemask*

     THEN DEST[31:0] := SRC[31:0]

     ELSE

     IF *merging-masking*           ; merging-masking

           THEN *DEST[31:0] remains unchanged*

           ELSE                     ; zeroing-masking

           THEN DEST[31:0] := 0

     FI;

FI;

DEST[MAXVL-1:32] := 0

VMOVSS (EVEX.LLIG.F3.0F.W0 10 /r When the Source Operand is an XMM Register and the Destination is Memory)

IF k1[0] or *no writemask*

     THEN DEST[31:0] := SRC[31:0]

     ELSE *DEST[31:0] remains unchanged*        ; merging-masking

FI;

VMOVSS (EVEX.LLIG.F3.0F.W0 10/11 /r Where the Source and Destination are XMM Registers)

IF k1[0] or *no writemask*

     THEN DEST[31:0] := SRC2[31:0]

     ELSE

     IF *merging-masking*           ; merging-masking

           THEN *DEST[31:0] remains unchanged*

           ELSE                     ; zeroing-masking

           THEN DEST[31:0] := 0

     FI;

FI;

DEST[127:32] := SRC1[127:32]

DEST[MAXVL-1:128] := 0


MOVSS (Legacy SSE Version When the Source and Destination Operands are Both XMM Registers)
DEST[31:0] := SRC[31:0]
DEST[MAXVL-1:32] (Unmodified)

VMOVSS (VEX.128.F3.0F 11 /r Where the Destination is an XMM Register)
DEST[31:0] := SRC2[31:0]
DEST[127:32] := SRC1[127:32]
DEST[MAXVL-1:128] := 0

VMOVSS (VEX.128.F3.0F 10 /r Where the Source and Destination are XMM Registers)
DEST[31:0] := SRC2[31:0]
DEST[127:32] := SRC1[127:32]
DEST[MAXVL-1:128] := 0

VMOVSS (VEX.128.F3.0F 10 /r When the Source Operand is Memory and the Destination is an XMM Register)
DEST[31:0] := SRC[31:0]
DEST[MAXVL-1:32] := 0

MOVSS/VMOVSS (When the Source Operand is an XMM Register and the Destination is Memory)
DEST[31:0] := SRC[31:0]

MOVSS (Legacy SSE Version when the Source Operand is Memory and the Destination is an XMM Register)
DEST[31:0] := SRC[31:0]
DEST[127:32] := 0
DEST[MAXVL-1:128] (Unmodified)
```

## Intel C/C++ compilador intrínseco

```c
VMOVSS __m128 _mm_mask_load_ss(__m128 s, __mmask8 k, float * p);
VMOVSS __m128 _mm_maskz_load_ss( __mmask8 k, float * p);
VMOVSS __m128 _mm_mask_move_ss(__m128 sh, __mmask8 k, __m128 sl, __m128 a);
VMOVSS __m128 _mm_maskz_move_ss( __mmask8 k, __m128 s, __m128 a);
VMOVSS void _mm_mask_store_ss(float * p, __mmask8 k, __m128 a);
MOVSS __m128 _mm_load_ss(float * p) MOVSS void_mm_store_ss(float * p, __m128 a) MOVSS __m128 _mm_move_ss(__m128 a, __m128 b);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones no codificadas en EVEX, ver Tabla 2-22, "Tipo 5 Condiciones de Excepción," adicionalmente:

```text
#UD               If VEX.vvvv != 1111B.
```

Instrucciones codificadas por EVEX, ver Tabla 2-60, "Tipo E10 Clase Condiciones de Excepción."
