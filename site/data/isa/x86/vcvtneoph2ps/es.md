---
summary: Convertir Odd Elements of Packed FP16 Values a FP32 Values
---

## Descripción

Esta instrucción carga elementos FP16 empaquetados de memoria, convierte los elementos extraños a FP32, y escribe el resultado al registro de destino SIMD.

Esta instrucción no genera excepciones coma flotante y no consulta ni actualiza MXCSR.

Los denormales FP16 de entrada se convierten a números FP32 normales y no se tratan como cero. Como cualquier número de FP16 puede ser representado en FP32, el resultado de la conversión es exacto y no se necesita redondeo.

## Operación

```text
VCVTNEOPH2PS dest, src (VEX encoded version)
VL = (128, 256)
KL = VL/32

FOR i in range(0, KL):
    dest.dword[i] = convert_fp16_to_fp32(src.dword[i].word[1]) //SAE

DEST[MAXVL-1:VL] := 0
```

## Banderas afectadas

None.

## Intel C/C++ compilador intrínseco

```c
VCVTNEOPH2PS __m128 _mm_cvtneoph_ps (const __m128h* __A);
VCVTNEOPH2PS __m256 _mm256_cvtneoph_ps (const __m256h* __A);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-21, "Tipo 4 Condiciones de Excepción".
