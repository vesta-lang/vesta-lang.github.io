---
summary: Move Quadword desde XMM a MMX Technology Register
---

## Descripción

Mueva el bajo cuádpago del operando de origen (segundo operando) al operando de destino (primer operando). El operando de origen es un registro XMM y el operando de destino es un registro de tecnología MMX.

Esta instrucción causa una transición de la operación de tecnología x87 FPU a MMX (es decir, la palabra x87 FPU top-of-puntero de pila se establece a 0 y la palabra etiqueta x87 FPU se establece a todos los 0s [válidos]). Si esta instrucción se ejecuta mientras que una excepción x87 FPU coma flotante está pendiente, la excepción se maneja antes de la instrucción MOVDQ2Q se ejecuta.

En modo de 64 bits, el uso del prefijo REX.R permite esta instrucción para acceder a registros adicionales (XMM8-XMM15).

## Operación

```text
DEST := SRC[63:0];
```

## Intel C/C++ compilador intrínseco

```c
MOVDQ2Q __m64 _mm_movepi64_pi64 ( __m128i a);
```

## SIMD coma flotante Excepciones

None.
