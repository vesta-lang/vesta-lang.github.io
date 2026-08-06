---
summary: Convertir Unsigned Integer en valores en coma flotante de precisión doble escalares
---

## Descripción

Convierte un entero sin firma de doble palabra (o unsigned quadword integer si tamaño de operando es 64 bits) en el segundo operando de origen a un valor en coma flotante de precisión doble en el operando de destino. El resultado se almacena en el bajo cuádpago del operando de destino. Cuando la conversión es inexacta, el valor devuelto se redondea según los bits de control de redondeo en el registro MXCSR.

El segundo operando de origen puede ser un registro de proposito general o una ubicación de memoria de 32/64 bits. La primera fuente y operandos de destino son registros XMM. Los bits (127:64) del destino de registro XMM se copian de los bits correspondientes en el primer operando de origen. Bits (MAXVL-1:128) del registro de destino se ponen a cero.

Versión EVEX.W1: promueve la instrucción para utilizar el valor de entrada de 64 bits en modo de 64 bits.

Versión EVEX.W0: se ignora el intento de codificar esta instrucción con redondeo integrado EVEX.

## Operación

```text
VCVTUSI2SD (EVEX Encoded Version)
IF (SRC2 *is register*) AND (EVEX.b = 1)

    THEN
          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(EVEX.RC);

    ELSE
          SET_ROUNDING_MODE_FOR_THIS_INSTRUCTION(MXCSR.RC);

FI;
IF 64-Bit Mode And OperandSize = 64
THEN

    DEST[63:0] := Convert_UInteger_To_Double_Precision_Floating_Point(SRC2[63:0]);
ELSE

    DEST[63:0] := Convert_UInteger_To_Double_Precision_Floating_Point(SRC2[31:0]);
FI;
DEST[127:64] := SRC1[127:64]
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ compilador intrínseco

```c
VCVTUSI2SD __m128d _mm_cvtu32_sd( __m128d s, unsigned a);
VCVTUSI2SD __m128d _mm_cvtu64_sd( __m128d s, unsigned __int64 a);
VCVTUSI2SD __m128d _mm_cvt_roundu64_sd( __m128d s, unsigned __int64 a, int r);
```

## SIMD coma flotante Excepciones

Precision.

## Otras excepciones

Ver Tabla 2-50, "Tipo E3NF Clase Condiciones de Excepción" si W1; de lo contrario, ver Tabla 2-61, "Tipo E10NF Clase Condiciones de Excepción".
