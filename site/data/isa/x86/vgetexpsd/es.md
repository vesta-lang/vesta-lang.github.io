---
summary: Convertir Exponents of valores en coma flotante de precisión doble escalares en Doble
---

## Descripción

Extrae el exponente sesgado de la representación coma flotante de precisión doble normalizada del elemento de datos qword bajo del operando de origen (el tercer operando) como valor entero firmado imparcial, o convierte la representación denormal de los datos de entrada a valores integer negativos imparciales. El valor entero del exponente imparcial se convierte en valor en coma flotante de precisión doble y se escribe al operando de destino (el primer operando) como números coma flotante de precisión doble. Los bits (127:64) del destino de registro XMM se copian de los bits correspondientes en el primer operando de origen.

El destino debe ser un registro XMM, el operando de origen puede ser un registro XMM o un flotador64 ubicación de memoria.

Si se utiliza el escribir, el elemento de cuádpago bajo del operando de destino se actualiza condicionalmente dependiendo del valor del registro máscara de escritura k1. Si no se utiliza el escribir, el elemento de cuádpo bajo del operando de destino se actualiza incondicionalmente.

Cada operación GETEXP convierte el valor exponente en el número una coma flotante (valor de entrada en representación denormal). En el cuadro 5-13 figuran casos especiales de valores de entrada.

The formula is:

GETEXP(x) = floor(log2(Principalidad)) El piso de notación (x) representa el número máximo entero no superior al número real x.

## Operación

```text
// NormalizeExpTinyDPFP(SRC[63:0]) is defined in the Operation section of VGETEXPPD

// ConvertExpDPFP(SRC[63:0]) is defined in the Operation section of VGETEXPPD


VGETEXPSD (EVEX encoded version)

IF k1[0] OR *no writemask*

     THEN DEST[63:0] :=

           ConvertExpDPFP(SRC2[63:0])

     ELSE

     IF *merging-masking*              ; merging-masking

           THEN *DEST[63:0] remains unchanged*

           ELSE                        ; zeroing-masking

           DEST[63:0] := 0

     FI

FI;

DEST[127:64] := SRC1[127:64]

DEST[MAXVL-1:128] := 0
```

## Intel C/C++ compilador intrínseco

```c
VGETEXPSD __m128d _mm_getexp_sd( __m128d a, __m128d b);
VGETEXPSD __m128d _mm_mask_getexp_sd(__m128d s, __mmask8 k, __m128d a, __m128d b);
VGETEXPSD __m128d _mm_maskz_getexp_sd( __mmask8 k, __m128d a, __m128d b);
VGETEXPSD __m128d _mm_getexp_round_sd( __m128d a, __m128d b, int sae);
VGETEXPSD __m128d _mm_mask_getexp_round_sd(__m128d s, __mmask8 k, __m128d a, __m128d b, int sae);
VGETEXPSD __m128d _mm_maskz_getexp_round_sd( __mmask8 k, __m128d a, __m128d b, int sae);
```

## SIMD coma flotante Excepciones

Invalid, Denormal

## Otras excepciones

Ver Tabla 2-49, "Tipo E3 Clase Condiciones de Excepción".
