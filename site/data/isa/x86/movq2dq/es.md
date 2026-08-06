---
summary: Move Quadword de MMX Technology a XMM Register
---

## Descripción

Mueva el cuádpalo del operando de origen (segundo operando) al cuádpalo bajo del operando de destino (primer operando). El operando de origen es un registro de tecnología MMX y el operando de destino es un registro XMM.

Esta instrucción causa una transición de la operación de tecnología x87 FPU a MMX (es decir, la palabra x87 FPU top-of-puntero de pila se establece a 0 y la palabra etiqueta x87 FPU se establece a todos los 0s [válidos]). Si esta instrucción se ejecuta mientras que una excepción x87 FPU coma flotante está pendiente, la excepción se maneja antes de la instrucción MOVQ2DQ se ejecuta.

En modo de 64 bits, el uso del prefijo REX.R permite esta instrucción para acceder a registros adicionales (XMM8-XMM15).

## Operación

```text
DEST[63:0] := SRC[63:0];
DEST[127:64] := 00000000000000000H;
```

## Intel C/C++ compilador intrínseco

```c
MOVQ2DQ__128i _mm_movpi64_epi64 ( __m64 a);
```

## SIMD coma flotante Excepciones

None.
