---
summary: Carga BF16 Element y Convertir en FP32 Element Con Broadcast
---

## Descripción

Esta instrucción carga un elemento BF16 de memoria, lo convierte a FP32, y lo transmite a un registro SIMD.

Esta instrucción no genera excepciones coma flotante y no consulta ni actualiza MXCSR.

Como cualquier número de BF16 puede ser representado en FP32, el resultado de la conversión es exacto y no se necesita redondeo.

## Operación

```text
VBCSTNEBF162PS dest, src (VEX encoded version)
VL = (128, 256)
KL = VL/32

FOR i in range(0, KL):
    tmp.dword[i].word[0] = src.word[0] // reads 16b from memory

FOR i in range(0, KL):
    dest.dword[i] = make_fp32(TMP.dword[i].word[0])

DEST[MAXVL-1:VL] := 0
```

## Banderas afectadas

None.

## Intel C/C++ compilador intrínseco

```c
VBCSTNEBF162PS __m128 _mm_bcstnebf16_ps (const __bf16* __A);
VBCSTNEBF162PS __m256 _mm256_bcstnebf16_ps (const __bf16* __A);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-22, "Tipo 5 Condiciones de Excepción de Clase".
