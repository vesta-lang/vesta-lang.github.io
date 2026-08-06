---
summary: Empty MMX Technology State
---

## Descripción

Establece los valores de todas las etiquetas en la palabra etiqueta x87 FPU para vaciar (todas las 1s). Esta operación marca los registros de datos x87 FPU (que están aliados a los registros de tecnología MMX) disponibles para su uso por instrucciones x87 FPU coma flotante. (Ver Figura 8-7 en la palabra Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1, para el formato de la palabra etiqueta x87 FPU.) Todas las demás instrucciones MMX (excepto la instrucción EMMS) establecen todas las etiquetas en x87 FPU palabra etiqueta para validar (todos 0s).

La instrucción EMMS debe ser utilizada para limpiar el estado de tecnología MMX al final de todos los procedimientos de tecnología MMX o subrutinas y antes de llamar a otros procedimientos o subrutinas que pueden ejecutar instrucciones x87 coma flotante. Si la instrucción una coma flotante carga uno de los registros en la pila de registro de datos x87 FPU antes de que la palabra etiqueta x87 FPU haya sido restablecida por la instrucción EMMS, puede ocurrir un flujo de registro x87 coma flotante que resultará en una excepción x87 coma flotante o resultado incorrecto.

La operación EMMS es la misma en modos no-64-bit y modo 64-bit.

## Operación

```text
x87FPUTagWord := FFFFH;
```

## Intel C/C++ compilador intrínseco

```c
void _mm_empty();
```

## Banderas afectadas

None
