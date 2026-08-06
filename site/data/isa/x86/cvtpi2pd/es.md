---
summary: Convertir Integers Dword en valores en coma flotante de precisión doble empaquetados
---

## Descripción

Convierte dos enteros de doble palabra firmados en el operando de origen (segundo operando) a dos valores en coma flotante de precisión doble empaquetados en el operando de destino (primer operando).

El operando de origen puede ser un registro de tecnología MMX o una ubicación de memoria de 64 bits. El operando de destino es un registro XMM. Además, dependiendo de la configuración el operando:

* Para operandos xmm, mm: la instrucción causa una transición de la operación de tecnología x87 FPU a MMX (que

es, el x87 FPU top-of-puntero de pila se establece a 0 y la palabra etiqueta x87 FPU se establece a todos los 0s [válidos]). Si esta instrucción se ejecuta mientras que una excepción x87 FPU coma flotante está pendiente, la excepción se maneja antes de la instrucción CVTPI2PD se ejecuta.

* Para operandos xmm, m64: la instrucción no causa una transición a la tecnología MMX y no toma

x87 FPU exceptions.

En modo de 64 bits, el uso del prefijo REX.R permite esta instrucción para acceder a registros adicionales (XMM8-XMM15).

## Operación

```text
DEST[63:0] := Convert_Integer_To_Double_Precision_Floating_Point(SRC[31:0]);
DEST[127:64] := Convert_Integer_To_Double_Precision_Floating_Point(SRC[63:32]);
```

## Intel C/C++ compilador intrínseco

```c
CVTPI2PD __m128d _mm_cvtpi32_pd(__m64 a);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Véase la sección 25.25.3, "Excepción de condiciones de Legacy SIMD Instrucciones de funcionamiento en los registros MMX" en el manual de desarrollo de software de arquitecturas Intel(R) 64 e IA-32, Volumen 3B.
