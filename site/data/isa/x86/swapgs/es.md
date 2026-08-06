---
summary: Swap GS Base Register
---

## Descripción

SWAPGS intercambia el valor actual de registro de base GS con el IA32 KERNEL GS BASE MSR (MSR dirección C0000102H). La instrucción SWAPGS es una instrucción privilegiada destinada al uso por software del sistema.

Al utilizar SYSCALL para implementar llamadas del sistema, no hay pila de kernel en el punto de entrada del sistema operativo. Tampoco hay un método sencillo para obtener un puntero a las estructuras del núcleo desde las cuales se podría leer el núcleo puntero de pila. Así, el núcleo no puede guardar registros de propósito general ni memoria de referencia.

Por diseño, SWAPGS no requiere ningún registro de propósito general o operandos de memoria. No es necesario guardar registros antes de usar la instrucción. SWAPGS intercambia el indicador de datos CPL 0 del IA32 KERNEL GS BASE MSR con el registro de base GS. El núcleo puede utilizar el prefijo GS en referencias de memoria normales para acceder a estructuras de datos del núcleo. Del mismo modo, cuando el núcleo del sistema operativo se introduce utilizando una interrupción o excepción (donde el núcleo ya está establecido), SWAPGS se puede utilizar para obtener rápidamente un puntero a las estructuras de datos del núcleo.

El IA32 KERNEL GS BASE MSR solo es accesible mediante instrucciones RDMSR/WRMSR. Estas instrucciones sólo son accesibles a nivel de privilegios 0. La instrucción WRMSR asegura que el IA32 KERNEL GS BASE MSR contiene una dirección canónica.

La instrucción no se puede ejecutar cuando las transiciones FRED están habilitadas. Las transiciones FRED realizan el mismo intercambio al cambiar el CPL.

## Operación

```text
IF CS.L  1 (* Not in 64-Bit Mode *) OR CR4.FRED = 1

    THEN
          #UD; FI;

IF CPL  0

    THEN #GP(0); FI;

tmp := GS.base;
GS.base := IA32_KERNEL_GS_BASE;
IA32_KERNEL_GS_BASE := tmp;
```

## Banderas afectadas

None.
