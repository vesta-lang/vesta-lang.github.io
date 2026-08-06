---
summary: Convertir Exponents of valores en coma flotante de precisión simple escalares en Single
---

## Descripción

Extrae el exponente sesgado de la representación coma flotante de precisión simple normalizada del elemento de datos de doble palabra del operando de origen (el tercer operando) como valor entero firmado imparcial, o convierte la representación denormal de los datos de entrada a valores de entero negativos imparciales. El valor entero del exponente imparcial se convierte en valor en coma flotante de precisión simple y se escribe al operando de destino (el primer operando) como números coma flotante de precisión simple. Los bits (127:32) del destino de registro XMM se copian de los bits correspondientes en el primer operando de origen.

El destino debe ser un registro XMM, el operando de origen puede ser un registro XMM o un flotador32 ubicación de memoria.

Si se utiliza la escritura, el elemento de palabra doble bajo del operando de destino se actualiza condicionalmente dependiendo del valor de máscara de escritura registro k1. Si no se utiliza la escritura, el elemento de palabra doble bajo del operando de destino se actualiza incondicionalmente.

Cada operación GETEXP convierte el valor exponente en el número una coma flotante (valor de entrada en representación denormal). En el cuadro 5-15 figuran casos especiales de valores de entrada.

The formula is:

GETEXP(x) = floor(log2(Principalidad)) El piso de notación (x) representa el número máximo entero no superior al número real x.

El uso de software de las instrucciones VGETEXPxx y VGETMANTxx generalmente implica una combinación de operación GETEXP y operación GETMANT (ver VGETMANTPD). Así la instrucción VGETEXPxx no requiere software a las excepciones descriptor SIMD coma flotante.

## Operación

```text
// NormalizeExpTinySPFP(SRC[31:0]) is defined in the Operation section of VGETEXPPS
// ConvertExpSPFP(SRC[31:0]) is defined in the Operation section of VGETEXPPS


VGETEXPSS (EVEX encoded version)

IF k1[0] OR *no writemask*

THEN DEST[31:0] :=

        ConvertExpDPFP(SRC2[31:0])

ELSE

     IF *merging-masking*           ; merging-masking

        THEN *DEST[31:0] remains unchanged*

        ELSE                        ; zeroing-masking

            DEST[31:0]:= 0

        FI

FI;

ENDFOR

DEST[127:32] := SRC1[127:32]

DEST[MAXVL-1:128] := 0
```

## Intel C/C++ compilador intrínseco

```c
VGETEXPSS __m128 _mm_getexp_ss( __m128 a, __m128 b);
VGETEXPSS __m128 _mm_mask_getexp_ss(__m128 s, __mmask8 k, __m128 a, __m128 b);
VGETEXPSS __m128 _mm_maskz_getexp_ss( __mmask8 k, __m128 a, __m128 b);
VGETEXPSS __m128 _mm_getexp_round_ss( __m128 a, __m128 b, int sae);
VGETEXPSS __m128 _mm_mask_getexp_round_ss(__m128 s, __mmask8 k, __m128 a, __m128 b, int sae);
VGETEXPSS __m128 _mm_maskz_getexp_round_ss( __mmask8 k, __m128 a, __m128 b, int sae);
```

## SIMD coma flotante Excepciones

Invalid, Denormal

## Otras excepciones

Ver Tabla 2-49, "Tipo E3 Clase Condiciones de Excepción".
