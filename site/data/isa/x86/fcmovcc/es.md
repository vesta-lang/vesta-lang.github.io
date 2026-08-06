---
summary: Coma flotante movimiento condicional
---

## Descripción

Pruebas las banderas de estado en el registro EFLAGS y mueve el operando de origen (segundo operando) al operando de destino (primer operando) si la condición de prueba dada es verdadera. La condición para cada os mnemónicos dados en la columna Descripción arriba y en el Capítulo 8 en el Intel(R) 64 e IA-32 Arquitecturas Software Manual del desarrollador, Volumen 1. El operando de origen está siempre en el registro ST(i) y el operando de destino es siempre ST(0).

Las instrucciones FCMOVcc son útiles para optimizar pequeñas construcciones IF. También ayudan a eliminar la sobrecarga de ramificación para las operaciones de IF y la posibilidad de subdivisiones erróneas por el procesador.

Un procesador no puede apoyar las instrucciones del FCMOVcc. El software puede comprobar si las instrucciones FCMOVcc son compatibles con la información de características del procesador con la instrucción CPUID (ver "COMISS--Comparar escalar Ordenado valores en coma flotante de precisión simple y Set EFLAGS" en este capítulo). Si se fijan los bits CMOV y FPU, se admiten las instrucciones FCMOVcc.

La operación de esta instrucción es la misma en modos no-64-bit y modo 64-bit.

## Compatibilidad de arquitectura IA-32

Las instrucciones FCMOVcc fueron introducidas a la Arquitectura IA-32 en los procesadores familiares P6 y no están disponibles en procesadores IA-32 anteriores.

## Operación

```text
IF condition TRUE
    THEN ST(0) := ST(i);

FI;

FPU Flags Affected

C1                        Set to 0 if stack underflow occurred.

C0, C2, C3                Undefined.
```

## Excepciones coma flotante

```text
#IS                       Stack underflow occurred.
```

Integer Flags Afectó a Ninguno.
