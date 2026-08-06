---
summary: Convertir Integers Dword en valores en coma flotante de precisión simple empaquetados
---

## Descripción

Convierte dos enteros de doble palabra firmados en el operando de origen (segundo operando) a dos valores en coma flotante de precisión simple empaquetados en el operando de destino (primer operando).

El operando de origen puede ser un registro de tecnología MMX o una ubicación de memoria de 64 bits. El operando de destino es un registro XMM. Los resultados se almacenan en el bajo cuádpago del operando de destino, y el alto cuádpo permanece invariable. Cuando una conversión es inexacta, el valor devuelto se redondea según los bits de control de redondeo en el registro MXCSR.

Esta instrucción causa una transición de la operación de tecnología x87 FPU a MMX (es decir, la palabra x87 FPU top-of-puntero de pila se establece a 0 y la palabra etiqueta x87 FPU se establece a todos los 0s [válidos]). Si esta instrucción se ejecuta mientras que una excepción x87 FPU coma flotante está pendiente, la excepción se maneja antes de la instrucción CVTPI2PS se ejecuta.

En modo de 64 bits, el uso del prefijo REX.R permite esta instrucción para acceder a registros adicionales (XMM8-XMM15).

## Operación

```text
DEST[31:0] := Convert_Integer_To_Single_Precision_Floating_Point(SRC[31:0]);
DEST[63:32] := Convert_Integer_To_Single_Precision_Floating_Point(SRC[63:32]);
(* High quadword of destination unchanged *)
```

## Intel C/C++ compilador intrínseco

```c
CVTPI2PS __m128 _mm_cvtpi32_ps(__m128 a, __m64 b);
```

## SIMD coma flotante Excepciones

Precision.

## Otras excepciones

Véase la sección 25.25.3, "Excepción de condiciones de Legacy SIMD Instrucciones de funcionamiento en los registros MMX" en el manual de desarrollo de software de arquitecturas Intel(R) 64 e IA-32, Volumen 3B.
