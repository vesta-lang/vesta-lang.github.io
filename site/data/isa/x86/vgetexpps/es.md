---
summary: Convertir Exponents of valores en coma flotante de precisión simple empaquetados en Single
---

## Descripción

Extrae a los exponentes sesgados de la representación coma flotante de precisión simple normalizada de cada elemento dword del operando de origen (el segundo operando) como valor entero firmado imparcial, o convierte la representación denormal de los datos de entrada a valores enteros negativos imparciales. Cada valor entero del exponente imparcial se convierte en valor en coma flotante de precisión simple y se escribe a los elementos dword correspondientes del operando de destino (el primer operando) como números coma flotante de precisión simple.

El operando de destino es un registro ZMM/YMM/XMM actualizado bajo la máscara de escritura. El operando de origen puede ser un registro ZMM/YMM/XMM, un 512/256/128-bit ubicación de memoria, o un vector 512/256/128-bit transmitido desde una ubicación de memoria de 32 bits.

EVEX.vvvv está reservado y debe ser 1111b, de lo contrario las instrucciones #UD.

Cada operación GETEXP convierte el valor exponente en el número una coma flotante (valor de entrada en representación denormal). En el cuadro 5-15 figuran casos especiales de valores de entrada.

The formula is:

GETEXP(x) = floor(log2(Principalidad)) El piso de notación (x) representa el número máximo entero no superior al número real x.

El uso de software de las instrucciones VGETEXPxx y VGETMANTxx generalmente implica una combinación de operación GETEXP y operación GETMANT (ver VGETMANTPD). Así la instrucción VGETEXPxx no requiere software a las excepciones descriptor SIMD coma flotante.

** Casos especiales de VGETEXPPS/SS**

| Entrada operando | Resultado | Comentarios |
| --- | --- | --- |
| src1 = NaN | QNaN(src1) |  |
| 0 < \|src1\| < INF | floor(log2(\ impersrc1\ eterna)) | Si (SRC = SNaN) entonces #IE |
| \| src1\| = +INF | +INF | Si (SRC = denormal) entonces #DE |
| \| src1\| = 0 | -INF |  |
| ure 5-14 ilustra la funcionalidad VGETEXPPS | sobre valores de entrada con representación normalizada. |  |
| 31 | 30  29  28  27 26   25  24  23  22  21  20  19  18  17  16  15  14 | 13  12 11 10  9  8  7  6  5  4  3  2  1  0 |
| s | exp | Fracción |
| Src = 2^1 0 | 1   0   0   0    0  0   0   0   0   0   0   0   0   0   0   0   0 | 0   0  0  0   0  0  0  0  0  0  0  0  0  0 |
| SAR Src, 23 = 080h 0 | 0   0   0   0    0  0   0   0   0   0   0   0   0   0   0   0   0 | 0   0  0  0   0  0  1  0  0  0  0  0  0  0 |
| -Bias 1 | 1   1   1   1    1  1   1   1   1   1   1   1   1   1   1   1   1 | 1   1  1  1   1  1  1  0  0  0  0  0  0  1 |
| Tmp - Bias = 1 0 | 0   0   0   0    0  0   0   0   0   0   0   0   0   0   0   0   0 | 0   0  0  0   0  0  0  0  0  0  0  0  0  1 |
| Cvt_PI2PS(01h) = 2^0     0 | 0   1   1   1    1  1   1   1   0   0   0   0   0   0   0   0   0 | 0   0  0  0   0  0  0  0  0  0  0  0  0  0 |

Figura 5-14. Funcionalidad VGETEXPPS en valores de entrada normales

## Operación

```text
NormalizeExpTinySPFP(SRC[31:0])

{

   // Jbit is the hidden integral bit of a floating-point number. In case of denormal number it has the value of ZERO.

   Src.Jbit := 0;

   Dst.exp := 1;

   Dst.fraction := SRC[22:0];

   WHILE(Src.Jbit = 0)

   {

      Src.Jbit := Dst.fraction[22];           // Get the fraction MSB

      Dst.fraction := Dst.fraction << 1 ; // One bit shift left

      Dst.exp-- ;                    // Decrement the exponent

   }

   Dst.fraction := 0;                // zero out fraction bits

   Dst.sign := 1;                    // Return negative sign

   TMP[31:0] := MXCSR.DAZ? 0 : (Dst.sign << 31) OR (Dst.exp << 23) OR (Dst.fraction) ;

   Return (TMP[31:0]);

}

ConvertExpSPFP(SRC[31:0])

{

   Src.sign := 0;                    // Zero out sign bit

   Src.exp := SRC[30:23];

   Src.fraction := SRC[22:0];

   // Check for NaN

   IF (SRC = NaN)

   {

      IF ( SRC = SNAN ) SET IE;


         Return QNAN(SRC);
   }
   // Check for +INF
   IF (Src = +INF) RETURN (Src);

   // check if zero operand

   IF ((Src.exp = 0) AND ((Src.fraction = 0) OR (MXCSR.DAZ = 1))) Return (-INF);

   }

   ELSE              // check if denormal operand (notice that MXCSR.DAZ = 0)

   {

        IF ((Src.exp = 0) AND (Src.fraction != 0))

        {

                TMP[31:0] := NormalizeExpTinySPFP(SRC[31:0]) ;            // Get Normalized Exponent

                Set #DE

        }

        ELSE             // exponent value is correct

        {

                TMP[31:0] := (Src.sign << 31) OR (Src.exp << 23) OR (Src.fraction) ;

        }

        TMP := SAR(TMP, 23) ;               // Shift Arithmetic Right

        TMP := TMP  127;                   // Subtract Bias

        Return CvtI2S(TMP);                 // Convert INT to single precision floating-point number

   }

}

VGETEXPPS (EVEX encoded versions)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

   i := j * 32

   IF k1[j] OR *no writemask*

        THEN

                IF (EVEX.b = 1) AND (SRC *is memory*)

                     THEN

                         DEST[i+31:i] :=

                ConvertExpSPFP(SRC[31:0])

                     ELSE

                         DEST[i+31:i] :=

                ConvertExpSPFP(SRC[i+31:i])

                FI;

        ELSE

                IF *merging-masking*                   ; merging-masking

                     THEN *DEST[i+31:i] remains unchanged*

                     ELSE                              ; zeroing-masking

                         DEST[i+31:i] := 0

                FI

   FI;

ENDFOR

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VGETEXPPS __m512 _mm512_getexp_ps( __m512 a);
VGETEXPPS __m512 _mm512_mask_getexp_ps(__m512 s, __mmask16 k, __m512 a);
VGETEXPPS __m512 _mm512_maskz_getexp_ps( __mmask16 k, __m512 a);
VGETEXPPS __m512 _mm512_getexp_round_ps( __m512 a, int sae);
VGETEXPPS __m512 _mm512_mask_getexp_round_ps(__m512 s, __mmask16 k, __m512 a, int sae);
VGETEXPPS __m512 _mm512_maskz_getexp_round_ps( __mmask16 k, __m512 a, int sae);
VGETEXPPS __m256 _mm256_getexp_ps(__m256 a);
VGETEXPPS __m256 _mm256_mask_getexp_ps(__m256 s, __mmask8 k, __m256 a);
VGETEXPPS __m256 _mm256_maskz_getexp_ps( __mmask8 k, __m256 a);
VGETEXPPS __m128 _mm_getexp_ps(__m128 a);
VGETEXPPS __m128 _mm_mask_getexp_ps(__m128 s, __mmask8 k, __m128 a);
VGETEXPPS __m128 _mm_maskz_getexp_ps( __mmask8 k, __m128 a);
```

## SIMD coma flotante Excepciones

Invalid, Denormal.

## Otras excepciones

Ver Tabla 2-48, "Tipo E2 Clase Condiciones de Excepción".

Additionally:     If EVEX.vvvv != 1111B.

```text
#UD
```
