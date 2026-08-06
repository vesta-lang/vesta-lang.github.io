---
summary: Juego Bandera Interrupt
---

## Descripción

En la mayoría de los casos, STI establece la bandera de interrupción (IF) en el registro EFLAGS. Esto permite al procesador responder a interrupciones de hardware enmascarables.

Si IF = 0, las interrupciones de hardware enmascarables permanecen inhibidas en el límite de instrucción después de una ejecución de STI. (El efecto retardado de esta instrucción se proporciona para permitir que las interrupciones estén habilitadas justo antes de regresar de un procedimiento o de una subrutina. Por ejemplo, si una instrucción STI es seguida por una instrucción RET, la instrucción RET se permite ejecutar antes de que se reconozcan interrupciones externas. No se pueden reconocer interrupciones si una ejecución de CLI inmediatamente sigue tal ejecución de STI.) La inhibición termina después de la entrega de otro evento (por ejemplo, excepción) o la ejecución de la siguiente instrucción.

La bandera de la IF y las instrucciones de STI y CLI no prohíben la generación de excepciones y interrupciones no visibles (NMIs). Sin embargo, los NMI (y las interrupciones de la gestión del sistema) pueden ser inhibidos en el límite de instrucción después de una ejecución de STI que comienza con IF = 0.

La operación es diferente en dos modos definidos como sigue:

* Modo PVI (interrupciones virtuales de movimiento protegido): CR0.PE = 1, EFLAGS.VM = 0, CPL = 3, y CR4.PVI = 1; * Modo VME (extensiones modo virtual-8086): CR0.PE = 1, EFLAGS.VM = 1, y CR4.VME = 1.

Si IOPL < 3, EFLAGS.VIP = 1, y el modo VME o el modo PVI es activo, STI establece la bandera VIF en el registro EFLAGS, dejando IF no afectada.

La tabla 4-22 indica la acción de la instrucción STI dependiendo del modo de operación del procesador, IOPL, CPL y EFLAGS.VIP.

** Tabla de decisión para los resultados de STI**

| Modo | IOPL | EFLAGS.VIP | Resultado STI |
| --- | --- | --- | --- |
| l-address | X1 | X | IF = 1 |
| , no PVI2 | CPL | X | IF = 1 |
|  | < CPL | X | Fallo #GP |
|  | 3 | X | IF = 1 |

## Operación

```text
IF CR0.PE = 0 (* Executing in real-address mode *)
    THEN IF := 1; (* Set Interrupt Flag *)
    ELSE
          IF IOPL  CPL (* CPL = 3 if EFLAGS.VM = 1 *)
                THEN IF := 1; (* Set Interrupt Flag *)
                ELSE
                      IF VME mode OR PVI mode
                            THEN
                                  IF EFLAGS.VIP = 0
                                        THEN VIF := 1; (* Set Virtual Interrupt Flag *)
                                        ELSE #GP(0);
                                  FI;
                            ELSE #GP(0);
                      FI;
          FI;

FI;
```

## Banderas afectadas

O la bandera IF o la bandera VIF se establece a 1. Otras banderas no son afectadas.
