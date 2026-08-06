---
summary: Compute Reciprocals of valores en coma flotante de precisión simple empaquetados
---

## Descripción

Realiza una computación SIMD de los reciprocales aproximados de los cuatro valores en coma flotante de precisión simple empaquetados en el operando de origen (segundo operando) almacena los resultados de coma flotante de precisión simple empaquetados en el operando de destino. El operando de origen puede ser un registro XMM o una ubicación de memoria de 128 bits. El operando de destino es un registro XMM. Ver Figura 10-5 en Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1, para una ilustración de una operación SIMD coma flotante de precisión simple.

El error relativo para esta aproximación es:

```text
    |Relative Error|  1.5  2-12
```

La instrucción RCPPS no se ve afectada por los bits de control de redondeo en el registro MXCSR. Cuando un valor fuente es un 0.0, se devuelve un signo del valor fuente. Un valor de fuente denormal se trata como un 0,0 (del mismo signo). Pequeños resultados (ver Sección 4.9.1.5, "Numeric Underflow Excepción (#U)" en Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1) siempre se desbordan a 0.0, con el signo del operando. (Los valores de entrada superiores o iguales a tención1.111111110100000000B2125 Las vidas están garantizadas para no producir resultados minúsculos; los valores de entrada menos o igual a TEN1.00000000110000001B*2126 están garantizados para producir resultados minúsculos, que a su vez se desbordan a 0.0; y los valores de entrada entre esta gama pueden o no producir resultados minúsculos, dependiendo de la implementaciónNa

En modo de 64 bits, el uso de un prefijo REX en forma de REX.R permite esta instrucción para acceder a registros adicionales (XMM8-XMM15).

128-bit Legacy SSE versión: La segunda fuente puede ser un registro XMM o una ubicación de memoria de 128 bits. El destino no es distinto del registro XMM de primera fuente y los bits superiores (MAXVL-1:128) del destino de registro YMM correspondiente no son modificados.

VEX.128 versión codificada: el primer operando de origen es un registro XMM o 128-bit ubicación de memoria. El operando de destino es un registro XMM. Los bits superiores (MAXVL-1:128) del destino de registro YMM correspondiente se ponen a cero.

VEX.256 versión codificada: El primer operando de origen es un registro YMM. El segundo operando de origen puede ser un registro YMM o una ubicación de memoria de 256 bits. El operando de destino es un registro YMM.

Nota: En VEX-versiones codificadas, VEX.vvvv está reservado y debe ser 1111b, de lo contrario las instrucciones #UD.

## Operación

```text
RCPPS (128-bit Legacy SSE Version)
DEST[31:0] := APPROXIMATE(1/SRC[31:0])
DEST[63:32] := APPROXIMATE(1/SRC[63:32])
DEST[95:64] := APPROXIMATE(1/SRC[95:64])
DEST[127:96] := APPROXIMATE(1/SRC[127:96])
DEST[MAXVL-1:128] (Unmodified)

VRCPPS (VEX.128 Encoded Version)
DEST[31:0] := APPROXIMATE(1/SRC[31:0])
DEST[63:32] := APPROXIMATE(1/SRC[63:32])
DEST[95:64] := APPROXIMATE(1/SRC[95:64])
DEST[127:96] := APPROXIMATE(1/SRC[127:96])
DEST[MAXVL-1:128] := 0

VRCPPS (VEX.256 Encoded Version)
DEST[31:0] := APPROXIMATE(1/SRC[31:0])
DEST[63:32] := APPROXIMATE(1/SRC[63:32])
DEST[95:64] := APPROXIMATE(1/SRC[95:64])
DEST[127:96] := APPROXIMATE(1/SRC[127:96])
DEST[159:128] := APPROXIMATE(1/SRC[159:128])
DEST[191:160] := APPROXIMATE(1/SRC[191:160])
DEST[223:192] := APPROXIMATE(1/SRC[223:192])
DEST[255:224] := APPROXIMATE(1/SRC[255:224])
```

## Intel C/C++ compilador intrínseco

```c
RCCPS __m128 _mm_rcp_ps(__m128 a) RCPPS __m256 _mm256_rcp_ps (__m256 a);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-21, "Tipo 4 Condiciones de Excepción", además:

```text
#UD               If VEX.vvvv  1111B.
```
