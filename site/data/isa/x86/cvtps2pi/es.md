---
summary: Convertir valores en coma flotante de precisión simple empaquetados en Integers de Dword embalado
---

## Descripción

Convierte dos valores en coma flotante de precisión simple empaquetados en el operando de origen (segundo operando) a dos enteros de doble palabra firmados en el operando de destino (primer operando).

El operando de origen puede ser un registro XMM o una ubicación de memoria de 128 bits. El operando de destino es un registro de tecnología MMX. Cuando el operando de origen es un registro XMM, los dos valores en coma flotante de precisión simple están contenidos en el bajo cuadword del registro. Cuando una conversión es inexacta, el valor devuelto se redondea según los bits de control de redondeo en el registro MXCSR. Si un resultado convertido es mayor que el entero de doble palabra firmado máximo, la coma flotante excepción de operación no válida se genera, y si esta excepción está enmascarada, el valor entero integer indefinido 80000000H es devuelto.

CVTPS2PI causa una transición de la operación de tecnología x87 FPU a MMX (es decir, la palabra x87 FPU top-of-puntero de pila se establece a 0 y la palabra etiqueta x87 FPU se establece a todos los 0s [valid]). Si esta instrucción se ejecuta mientras está pendiente una excepción x87 FPU punto flotante, la excepción se maneja antes de que se ejecute la instrucción CVTPS2PI.

En modo de 64 bits, el uso del prefijo REX.R permite esta instrucción para acceder a registros adicionales (XMM8-XMM15).

## Operación

```text
DEST[31:0] := Convert_Single_Precision_Floating_Point_To_Integer(SRC[31:0]);
DEST[63:32] := Convert_Single_Precision_Floating_Point_To_Integer(SRC[63:32]);
```

## Intel C/C++ compilador intrínseco

```c
CVTPS2PI __m64 _mm_cvtps_pi32(__m128 a);
```

## SIMD coma flotante Excepciones

Invalid, Precision.

## Otras excepciones

Véase la sección 25.25.3, "Excepción de condiciones de Legacy SIMD Instrucciones de funcionamiento en los registros MMX" en el manual de desarrollo de software de arquitecturas Intel(R) 64 e IA-32, Volumen 3B.
