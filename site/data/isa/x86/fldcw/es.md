---
summary: Carga x87 FPU Control Word
---

## Descripción

Carga el operando de origen de 16 bits en la palabra de control FPU. El operando de origen es una ubicación de memoria. Esta instrucción se utiliza normalmente para establecer o cambiar el modo de operación de FPU.

Si una o más banderas de excepción se establecen en la palabra de estado FPU antes de cargar una nueva palabra de control FPU y la nueva palabra de control desenmascara una o más de esas excepciones, la excepción una coma flotante se generará en la ejecución de la siguiente instrucción coma flotante (excepto las instrucciones de coma flotante no espera, ver la sección titulada "Capítulo de Excepción Intel" Para evitar levantar excepciones al cambiar los modos operativos FPU, despejar cualquier excepción pendiente (utilizando la instrucción FCLEX o FNCLEX) antes de cargar la nueva palabra de control.

La operación de esta instrucción es la misma en modos no-64-bit y modo 64-bit.

## Operación

```text
FPUControlWord := SRC;

FPU Flags Affected
C0, C1, C2, C3 undefined.
```

## Excepciones coma flotante

Ninguna; sin embargo, esta operación podría desenmascarar una excepción pendiente en la palabra de estado FPU. Esa excepción se genera después de la ejecución de la siguiente instrucción "esperando" coma flotante.
