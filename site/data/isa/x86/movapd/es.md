---
summary: Mover los Alineados valores en coma flotante de precisión doble empaquetados
---

## Descripción

Mueva 2, 4 o 8 valores en coma flotante de precisión doble del operando de origen (segundo operando) al operando de destino (primer operando). Esta instrucción se puede utilizar para cargar unaXMM, YMMoZMMregistro de un 128-bit, 256-bit o 512-bitubicación de memoria, para almacenar el contenido de unXMM, YMMoZMMregistro en un 128-bit, 256-bit o 512-bitubicación de memoria, o mover datos entre dosXMM, dosYMMo dosZMMregistros.

Cuando la fuente o operando de destino es un operando de memoria, el operando debe estar alineado en un límite de 16 bytes (128-bit versiones), 32-byte (256-bit versión) o 64-byte (EVEX.512 versión codificada) o una protección general

excepción (#GP) se generará. Para EVEX versiones codificadas, el operando debe estar alineado al tamaño del operando de memoria. Para mover valores en coma flotante de precisión doble a y desde lugares de memoria no deseados, utilice la instrucción VMOVUPD.

Nota: VEX.vvvv y EVEX.vvvv están reservados y deben ser 1111b instrucciones de lo contrario #UD.

EVEX.512 versión codificada:

Mueva 512 bits de valores en coma flotante de precisión doble empaquetados del operando de origen (segundo operando) al operando de destino (primer operando). Esta instrucción se puede utilizar para cargar un registro ZMM de un flotador de 512 bits64 ubicación de memoria, para almacenar el contenido de un registro ZMM en un flotador de 512 bits64 ubicación de memoria, o para mover datos entre dos registros ZMM. Cuando la fuente o operando de destino es un operando de memoria, el operando debe estar alineado en un límite de 64 bytes o una excepción de protección general (#GP) se generará. Para mover valores en coma flotante de precisión simple a y desde lugares de memoria no deseados, utilice la instrucción VMOVUPD.

VEX.256 y EVEX.256 versiones codificadas:

Mueva 256 bits de valores en coma flotante de precisión doble empaquetados del operando de origen (segundo operando) al operando de destino (primer operando). Esta instrucción se puede utilizar para cargar un registro YMM de 256 bits ubicación de memoria, para almacenar el contenido de un registro YMM en una ubicación de memoria de 256 bits, o para mover datos entre dos registros YMM. Cuando la fuente o operando de destino es un operando de memoria, el operando debe estar alineado en un límite de 32 bytes o una excepción de protección general (#GP) se generará. Para mover valores en coma flotante de precisión doble a y desde lugares de memoria no deseados, utilice la instrucción VMOVUPD.

128-bit versions:

Mueva 128 bits de valores en coma flotante de precisión doble empaquetados del operando de origen (segundo operando) al operando de destino (primer operando). Esta instrucción se puede utilizar para cargar un registro XMM de 128 bits ubicación de memoria, para almacenar el contenido de un registro XMM en una ubicación de memoria de 128 bits, o para mover datos entre dos registros XMM. Cuando la fuente o operando de destino es un operando de memoria, el operando debe estar alineado en un límite de 16 bytes o una excepción de protección general (#GP) se generará. Para mover valores de punto flotante de precisión única a y desde lugares de memoria no deseados, utilice la instrucción VMOVUPD.

128-bit Legacy SSE versión: Bits (MAXVL-1:128) del correspondiente registro de destino ZMM no se modifican.

(E)VEX.128 versión codificada: Bits (MAXVL-1:128) del destino ZMM destino de registro se ponen a cero.

## Operación

```text
VMOVAPD (EVEX Encoded Versions, Register-Copy Form)

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask*

     THEN DEST[i+63:i] := SRC[i+63:i]

     ELSE

             IF *merging-masking*        ; merging-masking

                 THEN *DEST[i+63:i] remains unchanged*

                 ELSE DEST[i+63:i] := 0  ; zeroing-masking

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0


VMOVAPD (EVEX Encoded Versions, Store-Form)      ; merging-masking
(KL, VL) = (2, 128), (4, 256), (8, 512)
FOR j := 0 TO KL-1

    i := j * 64
    IF k1[j] OR *no writemask*

          THEN DEST[i+63:i] := SRC[i+63:i]
          ELSE
          ELSE *DEST[i+63:i] remains unchanged*

    FI;
ENDFOR;

VMOVAPD (EVEX Encoded Versions, Load-Form)

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j] OR *no writemask*

     THEN DEST[i+63:i] := SRC[i+63:i]

     ELSE

             IF *merging-masking*           ; merging-masking

                 THEN *DEST[i+63:i] remains unchanged*

                 ELSE DEST[i+63:i] := 0     ; zeroing-masking

             FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VMOVAPD (VEX.256 Encoded Version, Load - and Register Copy)
DEST[255:0] := SRC[255:0]
DEST[MAXVL-1:256] := 0

VMOVAPD (VEX.256 Encoded Version, Store-Form)
DEST[255:0] := SRC[255:0]

VMOVAPD (VEX.128 Encoded Version, Load - and Register Copy)
DEST[127:0] := SRC[127:0]
DEST[MAXVL-1:128] := 0

MOVAPD (128-bit Load- and Register-Copy- Form Legacy SSE Version)
DEST[127:0] := SRC[127:0]
DEST[MAXVL-1:128] (Unmodified)

(V)MOVAPD (128-bit Store-Form Version)
DEST[127:0] := SRC[127:0]
```

## Intel C/C++ compilador intrínseco

```c
VMOVAPD __m512d _mm512_load_pd( void * m);
VMOVAPD __m512d _mm512_mask_load_pd(__m512d s, __mmask8 k, void * m);
VMOVAPD __m512d _mm512_maskz_load_pd( __mmask8 k, void * m);
VMOVAPD void _mm512_store_pd( void * d, __m512d a);
VMOVAPD void _mm512_mask_store_pd( void * d, __mmask8 k, __m512d a);
VMOVAPD __m256d _mm256_mask_load_pd(__m256d s, __mmask8 k, void * m);
VMOVAPD __m256d _mm256_maskz_load_pd( __mmask8 k, void * m);
VMOVAPD void _mm256_mask_store_pd( void * d, __mmask8 k, __m256d a);
VMOVAPD __m128d _mm_mask_load_pd(__m128d s, __mmask8 k, void * m);
VMOVAPD __m128d _mm_maskz_load_pd( __mmask8 k, void * m);
VMOVAPD void _mm_mask_store_pd( void * d, __mmask8 k, __m128d a);
MOVAPD __m256d _mm256_load_pd (double * p);
MOVAPD void _mm256_store_pd(double * p, __m256d a);
MOVAPD __m128d _mm_load_pd (double * p);
MOVAPD void _mm_store_pd(double * p, __m128d a);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones no-EVEX-encoded, ver Excepciones Tipo1.SSE2 en la tabla 2-18, "Tipo 1 Clase Condiciones de Excepción."

Instrucciones codificadas por EVEX, ver Tabla 2-46, "Tipo E1 Clase Condiciones de Excepción."

Additionally:

```text
#UD               If EVEX.vvvv != 1111B or VEX.vvvv != 1111B.
```
