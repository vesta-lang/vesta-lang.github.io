---
summary: Bandera de tareas clara en CR0
---

## Descripción

Limpia la bandera (TS) en el registro CR0. Esta instrucción está destinada a ser utilizada en los procedimientos del sistema operativo. Es una instrucción privilegiada que sólo se puede ejecutar en un CPL de 0. Se permite ejecutarlo en modo realaddress para permitir la inicialización de modo protegido.

El procesador establece la bandera TS cada vez que se produce un interruptor de tarea. La bandera se utiliza para sincronizar el ahorro del contexto FPU en aplicaciones multitarea. Vea la descripción de la bandera del TS en la sección titulada "Registros de control" en el capítulo 2 del Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 3A, para obtener más información sobre esta bandera.

La operación CLTS es la misma en modos no-64-bit y modo 64-bit.

Ver Capítulo 27, "Estructuras de Control de Máquinas Virtuales", de Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 3C, para obtener más información sobre el comportamiento de esta instrucción en VMX operación no raíz.

## Operación

```text
CR0.TS[bit 3] := 0;
```

## Banderas afectadas

The TS flag in CR0 register is cleared.
