---
summary: Monitor Wait
---

## Descripción

La instrucción MWAIT proporciona indicios para permitir al procesador entrar en un estado optimizado dependiente de la implementación. Hay dos principales usos específicos: monitor de rango de direcciones y gestión de energía avanzada. Ambos usos de MWAIT requieren el uso de la instrucción MONITOR.

CPUID.01H:ECX.MONITOR[3] indica la disponibilidad de MONITOR y MWAIT en el procesador. Cuando se establece, MWAIT se puede ejecutar sólo a nivel de privilegios 0 (utilizar a cualquier otro nivel de privilegios resulta en una excepción de código de operación no válido). El sistema operativo o sistema BIOS puede deshabilitar esta instrucción utilizando el IA32 MISC ENABLE MSR; desactivar MWAIT aclara la bandera CPUID característica y hace que la ejecución genere una excepción de código de operación no válido.

La operación de esta instrucción es la misma en modos no-64-bit y modo 64-bit.

ECX especifica extensiones opcionales para la instrucción MWAIT. EAX puede contener indicios como el estado optimizado preferido que el procesador debe entrar. Los primeros procesadores para implementar MWAIT apoyaron sólo el valor cero para EAX y ECX. Los procesadores posteriores permitieron establecer ECX[0] para permitir interrupciones enmascaradas como eventos de ruptura para MWAIT (ver abajo). El software puede utilizar la instrucción CPUID para determinar las extensiones e indicios soportados por el procesador.

MWAIT para monitorización de alcance

Para el monitoreo de rango de dirección, la instrucción MWAIT funciona con la instrucción MONITOR. Las dos instrucciones permiten que la definición de una dirección en la que esperar (MONITOR) y una operación optimizada dependiente de la implementación comiencen en la dirección de espera (MWAIT). La ejecución de MWAIT es un indicio al procesador de que puede entrar en un estado optimizado dependiente de la implementación mientras espera un evento o una operación de la tienda a la gama de direcciones armada por MONITOR.

La siguiente causa es que el procesador salga del estado optimizado-dependiente de la implementación: una tienda al rango de dirección armada por la instrucción MONITOR, una NMI o SMI, una excepción de depuración, una excepción de comprobación de máquina, la señal BINIT#, la señal INIT# y la señal RESET#. Otros acontecimientos que dependen de la aplicación también pueden hacer que el procesador abandone el estado optimizado que depende de la aplicación.

Además, una interrupción externa hace que el procesador salga del estado optimizado-dependiente de la implementación, ya sea (1) si la interrupción se entrega al software (por ejemplo, como sería si HLT hubiera sido ejecutado en lugar de MWAIT); o (2) si ECX[0] = 1. El software puede ejecutar MWAIT con ECX[0] = 1 solo si CPUID.05H:ECX[1] = 1. (Las condiciones específicas de la implementación pueden resultar en una interrupción que hace que el procesador salga del estado optimizado dependiente de la implementación, incluso si las interrupciones están enmascaradas y ECX[0] = 0.)

Después de la salida del estado optimizado dependiente de la implementación, el control pasa a la instrucción siguiendo la instrucción MWAIT. Una interrupción pendiente que no está enmascarada (incluyendo un NMI o un SMI) puede ser entregada antes de la ejecución de esa instrucción. A diferencia de la instrucción HLT, la instrucción MWAIT no soporta un reinicio en la instrucción MWAIT después del manejo de un SMI.

Si la instrucción MONITOR anterior no armó con éxito un rango de dirección o si la instrucción MONITOR no ha sido ejecutada antes de ejecutar MWAIT, entonces el procesador no entrará en el estado optimizado dependiente de la implementación. La ejecución se reanudará en la instrucción siguiendo el MWAIT.

MWAIT para Power Management

MWAIT acepta un indicio y una extensión opcional al procesador que puede entrar en un determinado estado objetivo C mientras espera un evento o una operación de la tienda a la gama de direcciones armada por MONITOR. El apoyo a las extensiones MWAIT para la gestión de energía está indicado por CPUID.05H:ECX[0] reportando 1.

EAX y ECX se utilizan para comunicar la información adicional a la instrucción MWAIT, como el tipo de estado optimizado que el procesador debe entrar. ECX especifica extensiones opcionales para la instrucción MWAIT. EAX puede contener indicios como el estado optimizado preferido que el procesador debe entrar. Las condiciones específicas de aplicación pueden hacer que un procesador ignore la pista e ingrese un estado optimizado diferente. Las implementaciones de procesadores futuros pueden implementar varios estados optimizados "esperando" y seleccionarán entre aquellos estados basados en el argumento indirecto.

En el cuadro 4-10 se describe el significado de los registros ECX y EAX para las extensiones MWAIT.

```text
          Bits                          Table 4-10. MWAIT Extension Register (ECX)
```

0                                                                                  Description

31: 1 El tratado interrumpe como eventos de descanso incluso si se enmascara (por ejemplo, incluso si EFLAGS.IF = 0). Puede establecerse sólo si CPUID.05H:ECX[1] = 1.

Reserved

```text
          Bits                             Table 4-11. MWAIT Hints Register (EAX)
```

3:0 Descripción 7:4 Sub-Estado dentro de un estado C, indicado por bits [7:4] Meta C-estado* Valor de 0 significa C1; 1 significa C2 y así en valor de 011B significa C0

31: 8 Nota: Los estados de destino C para las extensiones MWAIT son estados C específicos para procesadores, no ACPI C-estados Reservados

Tenga en cuenta que si MWAIT se utiliza para entrar en cualquiera de los estados C que son numéricamente superiores a C1, una tienda al rango de direcciones armada por la instrucción MONITOR hará que el procesador salga de MWAIT sólo si la tienda fue originada por otros agentes procesadores. Una tienda de agentes no procesadores podría no causar que el procesador salga de MWAIT en tales casos.

Para más detalles de las extensiones MWAIT, véase Capítulo 17, "Power and Thermal Management", de Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volume 3A.

## Operación

```text
(* MWAIT takes the argument in EAX as a hint extension and is architected to take the argument in ECX as an instruction extension
MWAIT EAX, ECX *)
{
WHILE ( ("Monitor Hardware is in armed state")) {

    implementation_dependent_optimized_state(EAX, ECX); }
Set the state of Monitor Hardware as triggered;
}
```

## Intel C/C++ compilador intrínseco

```c
MWAIT void _mm_mwait(unsigned extensions, unsigned hints) Example MONITOR/MWAIT instruction pair must be coded in the same loop because execution of the MWAIT instruction will trigger the monitor hardware. It is not a proper usage to execute MONITOR once and then execute MWAIT in a loop. Setting up MONITOR without executing MWAIT has no adverse effects. Typically the MONITOR/MWAIT pair is used in a sequence, such as: EAX = Logical Address(Trigger) ECX = 0 (*Hints *) EDX = 0 (* Hints *) IF ( !trigger_store_happened) { MONITOR EAX, ECX, EDX IF ( !trigger_store_happened ) { MWAIT EAX, ECX } } The above code sequence makes sure that a triggering store does not happen between the first check of the trigger and the execution of the monitor instruction. Without the second check that triggering store would go unnoticed. Typical usage of MONITOR and MWAIT would have the above code sequence within a loop.;
```

## Excepciones numéricas

None.
