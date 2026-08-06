---
summary: Halt
---

## Descripción

Detiene la ejecución de la instrucción y coloca al procesador en un estado HALT. Una interrupción activada (incluyendo NMI y SMI), una excepción de depuración, la señal BINIT#, la señal INIT#, o la señal RESET# reanudará la ejecución. Si una interrupción (incluyendo NMI) se utiliza para reanudar la ejecución después de una instrucción HLT, el puntero de instruccion salvado (CS:EIP) apunta a la instrucción siguiendo la instrucción HLT.

Cuando una instrucción HLT se ejecuta en un procesador Intel 64 o IA-32 que apoya la tecnología Intel Hyper-Threading, sólo el procesador lógico que ejecuta la instrucción se detiene. Los otros procesadores lógicos en el procesador físico permanecen activos, a menos que se detengan individualmente ejecutando una instrucción HLT.

La instrucción HLT es una instrucción privilegiada. Cuando el procesador se ejecuta en protegido o modo virtual-8086, el nivel de privilegio de un programa o procedimiento debe ser 0 para ejecutar la instrucción HLT.

La operación de esta instrucción es la misma en modos no-64-bit y modo 64-bit.

## Operación

```text
Enter Halt state;
```

## Banderas afectadas

None.
