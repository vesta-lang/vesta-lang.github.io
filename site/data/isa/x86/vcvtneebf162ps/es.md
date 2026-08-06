---
summary: Convertir Incluso elementos de los valores de BF16 empacados a los valores de FP32
---

## Descripción

Esta instrucción carga elementos BF16 empaquetados de memoria, convierte los elementos incluso a FP32, y escribe el resultado al registro de destino SIMD.

Esta instrucción no genera excepciones coma flotante y no consulta ni actualiza MXCSR.

Como cualquier número de BF16 puede ser representado en FP32, el resultado de la conversión es exacto y no se necesita redondeo.

## Operación

```text
VCVTNEEBF162PS dest, src (VEX encoded version)
VL = (128, 256)
KL = VL/32

FOR i in range(0, KL):
    dest.dword[i] = make_fp32(src.dword[i].word[0])

DEST[MAXVL-1:VL] := 0
```

## Banderas afectadas

None.

## Intel C/C++ compilador intrínseco

```c
VCVTNEEBF162PS __m128 _mm_cvtneebf16_ps (const __m128bh* __A);
VCVTNEEBF162PS __m256 _mm256_cvtneebf16_ps (const __m256bh* __A);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-21, "Tipo 4 Condiciones de Excepción".
