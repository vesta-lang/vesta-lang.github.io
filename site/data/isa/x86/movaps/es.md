---
summary: Mover los Alineados valores en coma flotante de precisión simple empaquetados
---

## Descripción

Moves 4, 8 o 16 valores en coma flotante de precisión simple del operando de origen (segundo operando) al operando de destino (primer operando). Esta instrucción se puede utilizar para cargar unaXMM, YMMoZMMregistro de un 128-bit, 256-bit o 512-bitubicación de memoria, para almacenar el contenido de unXMM, YMMoZMMregistro en un 128-bit, 256-bit o 512-bitubicación de memoria, o mover datos entre dosXMM, dosYMMo dosZMMregistros.

Cuando la fuente o operando de destino es un operando de memoria, el operando debe estar alineado en una versión de 16 bytes (128-bit), 32-byte (VEX.256 versión codificada) o 64-byte (EVEX.512 versión codificada) límite o un límite general-

se generará una excepción de protección (#GP). Para EVEX.512 versiones codificadas, el operando debe estar alineado al tamaño del operando de memoria. Para mover valores en coma flotante de precisión simple a y desde lugares de memoria no deseados, utilice la instrucción VMOVUPS.

Nota: VEX.vvvv y EVEX.vvvv están reservados y deben ser 1111b instrucciones de lo contrario #UD.

EVEX.512 versión codificada:

Mueva 512 bits de valores en coma flotante de precisión simple empaquetados del operando de origen (segundo operando) al operando de destino (primer operando). Esta instrucción se puede utilizar para cargar un registro ZMM de un flotador de 512 bits32 ubicación de memoria, para almacenar el contenido de un registro ZMM en un registro flotador32 ubicación de memoria, o para mover datos entre dos registros ZMM. Cuando la fuente o operando de destino es un operando de memoria, el operando debe estar alineado en un límite de 64 bytes o una excepción de protección general (#GP) se generará. Para mover valores de punto flotante de precisión única a y desde lugares de memoria no deseados, utilice la instrucción VMOVUPS.

VEX.256 y EVEX.256 versión codificada:

Mueva 256 bits de valores en coma flotante de precisión simple empaquetados del operando de origen (segundo operando) al operando de destino (primer operando). Esta instrucción se puede utilizar para cargar un registro YMM de 256 bits ubicación de memoria, para almacenar el contenido de un registro YMM en una ubicación de memoria de 256 bits, o para mover datos entre dos registros YMM. Cuando la fuente o operando de destino es un operando de memoria, el operando debe estar alineado en un límite de 32 bytes o una excepción de protección general (#GP) se generará.

128-bit versions:

Mueva 128 bits de valores en coma flotante de precisión simple empaquetados del operando de origen (segundo operando) al operando de destino (primer operando). Esta instrucción se puede utilizar para cargar un registro XMM de 128 bits ubicación de memoria, para almacenar el contenido de un registro XMM en una ubicación de memoria de 128 bits, o para mover datos entre dos registros XMM. Cuando la fuente o operando de destino es un operando de memoria, el operando debe estar alineado en un límite de 16 bytes o una excepción de protección general (#GP) se generará. Para mover valores de punto flotante de precisión única a y desde lugares de memoria no deseados, utilice la instrucción VMOVUPS.

128-bit Legacy SSE versión: Bits (MAXVL-1:128) del correspondiente registro de destino ZMM no se modifican.

(E)VEX.128 versión codificada: Bits (MAXVL-1:128) del destino ZMM registro se ponen a cero.

## Operación

```text
VMOVAPS (EVEX Encoded Versions, Register-Copy Form)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask*

     THEN DEST[i+31:i] := SRC[i+31:i]

     ELSE

             IF *merging-masking*         ; merging-masking

                 THEN *DEST[i+31:i] remains unchanged*

                 ELSE DEST[i+31:i] := 0   ; zeroing-masking

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0


VMOVAPS (EVEX Encoded Versions, Store Form)      ; merging-masking
(KL, VL) = (4, 128), (8, 256), (16, 512)
FOR j := 0 TO KL-1

    i := j * 32
    IF k1[j] OR *no writemask*

          THEN DEST[i+31:i] :=
                SRC[i+31:i]

          ELSE *DEST[i+31:i] remains unchanged*
    FI;
ENDFOR;

VMOVAPS (EVEX Encoded Versions, Load Form)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

i := j * 32

IF k1[j] OR *no writemask*

     THEN DEST[i+31:i] := SRC[i+31:i]

     ELSE

             IF *merging-masking*           ; merging-masking

                 THEN *DEST[i+31:i] remains unchanged*

                 ELSE DEST[i+31:i] := 0     ; zeroing-masking

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VMOVAPS (VEX.256 Encoded Version, Load - and Register Copy)
DEST[255:0] := SRC[255:0]
DEST[MAXVL-1:256] := 0

VMOVAPS (VEX.256 Encoded Version, Store-Form)
DEST[255:0] := SRC[255:0]

VMOVAPS (VEX.128 Encoded Version, Load - and Register Copy)
DEST[127:0] := SRC[127:0]
DEST[MAXVL-1:128] := 0

MOVAPS (128-bit Load- and Register-Copy- Form Legacy SSE Version)
DEST[127:0] := SRC[127:0]
DEST[MAXVL-1:128] (Unmodified)

(V)MOVAPS (128-bit Store-Form Version)
DEST[127:0] := SRC[127:0]
```

## Intel C/C++ compilador intrínseco

```c
VMOVAPS __m512 _mm512_load_ps( void * m);
VMOVAPS __m512 _mm512_mask_load_ps(__m512 s, __mmask16 k, void * m);
VMOVAPS __m512 _mm512_maskz_load_ps( __mmask16 k, void * m);
VMOVAPS void _mm512_store_ps( void * d, __m512 a);
VMOVAPS void _mm512_mask_store_ps( void * d, __mmask16 k, __m512 a);
VMOVAPS __m256 _mm256_mask_load_ps(__m256 a, __mmask8 k, void * s);
VMOVAPS __m256 _mm256_maskz_load_ps( __mmask8 k, void * s);
VMOVAPS void _mm256_mask_store_ps( void * d, __mmask8 k, __m256 a);
VMOVAPS __m128 _mm_mask_load_ps(__m128 a, __mmask8 k, void * s);
VMOVAPS __m128 _mm_maskz_load_ps( __mmask8 k, void * s);
VMOVAPS void _mm_mask_store_ps( void * d, __mmask8 k, __m128 a);
MOVAPS __m256 _mm256_load_ps (float * p);
MOVAPS void _mm256_store_ps(float * p, __m256 a);
MOVAPS __m128 _mm_load_ps (float * p);
MOVAPS void _mm_store_ps(float * p, __m128 a);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones no código EVEX, ver Excepciones Tipo1.SSE en la tabla 2-18, "Tipo 1 Clase Condiciones de Excepción", adicionalmente:

```text
#UD               If VEX.vvvv != 1111B.
```

Instrucciones codificadas por EVEX, ver Tabla 2-46, "Tipo E1 Clase Condiciones de Excepción."
