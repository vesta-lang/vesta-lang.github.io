---
summary: Convertir Exponents of valores en coma flotante de precisión doble empaquetados en Doble
---

## Descripción

Extrae a los exponentes sesgados de la representación coma flotante de precisión doble normalizada de cada elemento de datos qword del operando de origen (el segundo operando) como valor entero firmado imparcial, o convierte la representación denormal de los datos de entrada a valores integer negativos imparciales. Cada valor entero del exponente imparcial se convierte en valor en coma flotante de precisión doble y se escribe a los elementos qword correspondientes del operando de destino (el primer operando) como números coma flotante de precisión doble.

El operando de destino es un registro ZMM/YMM/XMM actualizado bajo la máscara de escritura. El operando de origen puede ser un registro ZMM/YMM/XMM, un 512/256/128-bit ubicación de memoria, o un vector 512/256/128-bit transmitido desde una ubicación de memoria de 64 bits.

EVEX.vvvv está reservado y debe ser 1111b, de lo contrario las instrucciones #UD.

Cada operación GETEXP convierte el valor exponente en el número una coma flotante (valor de entrada en representación denormal). En el cuadro 5-13 figuran casos especiales de valores de entrada.

The formula is:

GETEXP(x) = floor(log2(viviendas)) El piso de notación (x) representa el número entero más grande que no exceda el número real x.

** Casos especiales de VGETEXPPD/SD**

| Entrada operando | Resultado | Comentarios |
| --- | --- | --- |
| src1 = NaN | QNaN(src1) |  |
| 0 < \|src1\| < INF | floor(log2(\ impersrc1\ eterna)) | Si (SRC = SNaN) entonces #IE |
| \| src1\| = +INF | +INF | Si (SRC = denormal) entonces #DE |
| \| src1\| = 0 | -INF |  |

## Operación

```text
NormalizeExpTinyDPFP(SRC[63:0])
{


   // Jbit is the hidden integral bit of a floating-point number. In case of denormal number it has the value of ZERO.

   Src.Jbit := 0;

   Dst.exp := 1;

   Dst.fraction := SRC[51:0];

   WHILE(Src.Jbit = 0)

   {

      Src.Jbit := Dst.fraction[51];        // Get the fraction MSB

      Dst.fraction := Dst.fraction << 1 ;             // One bit shift left

      Dst.exp-- ;              // Decrement the exponent

   }

   Dst.fraction := 0;          // zero out fraction bits

   Dst.sign := 1;              // Return negative sign

   TMP[63:0] := MXCSR.DAZ? 0 : (Dst.sign << 63) OR (Dst.exp << 52) OR (Dst.fraction) ;

   Return (TMP[63:0]);

}

ConvertExpDPFP(SRC[63:0])

{

   Src.sign := 0;              // Zero out sign bit

   Src.exp := SRC[62:52];

   Src.fraction := SRC[51:0];

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

   ELSE            // check if denormal operand (notice that MXCSR.DAZ = 0)

   {

      IF ((Src.exp = 0) AND (Src.fraction != 0))

      {

         TMP[63:0] := NormalizeExpTinyDPFP(SRC[63:0]) ;               // Get Normalized Exponent

         Set #DE

      }

      ELSE              // exponent value is correct

      {

         TMP[63:0] := (Src.sign << 63) OR (Src.exp << 52) OR (Src.fraction) ;

      }

      TMP := SAR(TMP, 52) ;                // Shift Arithmetic Right

      TMP := TMP  1023;                   // Subtract Bias

      Return CvtI2D(TMP);                  // Convert INT to double precision floating-point number

   }

}

VGETEXPPD (EVEX encoded versions)
(KL, VL) = (2, 128), (4, 256), (8, 512)
FOR j := 0 TO KL-1

    i := j * 64


IF k1[j] OR *no writemask*

     THEN

        IF (EVEX.b = 1) AND (SRC *is memory*)

             THEN

             DEST[i+63:i] :=

        ConvertExpDPFP(SRC[63:0])

             ELSE

             DEST[i+63:i] :=

        ConvertExpDPFP(SRC[i+63:i])

        FI;

     ELSE

        IF *merging-masking*         ; merging-masking

             THEN *DEST[i+63:i] remains unchanged*

             ELSE                    ; zeroing-masking

             DEST[i+63:i] := 0

        FI

FI;

ENDFOR

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VGETEXPPD __m512d _mm512_getexp_pd(__m512d a);
VGETEXPPD __m512d _mm512_mask_getexp_pd(__m512d s, __mmask8 k, __m512d a);
VGETEXPPD __m512d _mm512_maskz_getexp_pd( __mmask8 k, __m512d a);
VGETEXPPD __m512d _mm512_getexp_round_pd(__m512d a, int sae);
VGETEXPPD __m512d _mm512_mask_getexp_round_pd(__m512d s, __mmask8 k, __m512d a, int sae);
VGETEXPPD __m512d _mm512_maskz_getexp_round_pd( __mmask8 k, __m512d a, int sae);
VGETEXPPD __m256d _mm256_getexp_pd(__m256d a);
VGETEXPPD __m256d _mm256_mask_getexp_pd(__m256d s, __mmask8 k, __m256d a);
VGETEXPPD __m256d _mm256_maskz_getexp_pd( __mmask8 k, __m256d a);
VGETEXPPD __m128d _mm_getexp_pd(__m128d a);
VGETEXPPD __m128d _mm_mask_getexp_pd(__m128d s, __mmask8 k, __m128d a);
VGETEXPPD __m128d _mm_maskz_getexp_pd( __mmask8 k, __m128d a);
```

## SIMD coma flotante Excepciones

Invalid, Denormal.

## Otras excepciones

Ver Tabla 2-48, "Tipo E2 Clase Condiciones de Excepción".

Additionally:

```text
#UD               If EVEX.vvvv != 1111B.
```
