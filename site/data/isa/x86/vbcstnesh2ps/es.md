---
summary: Carga FP16 Element y Convertir en FP32 Element con Broadcast
---

## Descripción

Esta instrucción carga un elemento FP16 de memoria, lo convierte a FP32, y lo transmite a un registro SIMD.

Esta instrucción no genera excepciones coma flotante y no consulta ni actualiza MXCSR.

Los denormales FP16 de entrada se convierten a números FP32 normales y no se tratan como cero. Como cualquier número de FP16 puede ser representado en FP32, el resultado de la conversión es exacto y no se necesita redondeo.

## Operación

```text
VBCSTNESH2PS dest, src (VEX encoded version)
VL = (128, 256)
KL = VL/32

FOR i in range(0, KL):
    tmp.dword[i].word[0] = src.word[0] // read 16b from memory

FOR i in range(0, KL):
    dest.dword[i] = convert_fp16_to_fp32(tmp.dword[i].word[0]) //SAE

DEST[MAXVL-1:VL] := 0
```

## Banderas afectadas

None.

## Intel C/C++ compilador intrínseco

```c
VBCSTNESH2PS __m128 _mm_bcstnesh_ps (const _Float16* __A);
VBCSTNESH2PS __m256 _mm256_bcstnesh_ps (const _Float16* __A);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-22, "Tipo 5 Condiciones de Excepción de Clase".
