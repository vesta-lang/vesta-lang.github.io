---
summary: Convertir valores en coma flotante de precisión doble empaquetados en Integers de Dword embalado
---

## Descripción

Convierte dos valores en coma flotante de precisión doble empaquetados en el operando de origen (segundo operando) a dos enteros de doble palabra firmados en el operando de destino (primer operando).

El operando de origen puede ser un registro XMM o una ubicación de memoria de 128 bits. El operando de destino es un registro de tecnología MMX.

Cuando una conversión es inexacta, el valor devuelto se redondea según los bits de control de redondeo en el registro MXCSR. Si un resultado convertido es mayor que el entero de doble palabra firmado máximo, la coma flotante excepción de operación no válida se genera, y si esta excepción está enmascarada, el valor entero integer indefinido 80000000H es devuelto.

Esta instrucción causa una transición de la operación de tecnología x87 FPU a MMX (es decir, la palabra x87 FPU top-of-puntero de pila se establece a 0 y la palabra etiqueta x87 FPU se establece a todos los 0s [válidos]). Si esta instrucción se ejecuta mientras que una excepción x87 FPU coma flotante está pendiente, la excepción se maneja antes de la instrucción CVTPD2PI se ejecuta.

En modo de 64 bits, el uso del prefijo REX.R permite esta instrucción para acceder a registros adicionales (XMM8-XMM15).

## Operación

```text
DEST[31:0] := Convert_Double_Precision_Floating_Point_To_Integer32(SRC[63:0]);
DEST[63:32] := Convert_Double_Precision_Floating_Point_To_Integer32(SRC[127:64]);
```

## Intel C/C++ compilador intrínseco

```c
CVTPD1PI __m64 _mm_cvtpd_pi32(__m128d a);
```

## SIMD coma flotante Excepciones

Invalid, Precision.

## Otras excepciones

Véase la sección 25.25.3, "Excepción de condiciones de Legacy SIMD Instrucciones de funcionamiento en los registros MMX" en el manual de desarrollo de software de arquitecturas Intel(R) 64 e IA-32, Volumen 3B.
