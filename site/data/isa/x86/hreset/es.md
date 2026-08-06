---
summary: Historia Reiniciar
---

## Descripción

Pide al procesador que reajuste selectivamente componentes seleccionados de la historia del hardware mantenidos por el procesador lógico actual. La operación HRESET es controlada por el implícito EAX operando. Se ignora el valor del imm8 operando explícito. Esta instrucción sólo se puede ejecutar a nivel de privilegios 0.

La instrucción HRESET se puede utilizar para solicitar el restablecimiento de múltiples componentes de la historia del hardware. Antes de la ejecución de HRESET, el software del sistema debe tomar los siguientes pasos:

1. Enumerar las capacidades HRESET a través de CPUID.20H.00H:EBX, lo que indica qué componentes de la historia del hardware pueden ser restaurados.

2. Sólo los bits enumerados por CPUID.20H.00H:EBX se pueden configurar en el IA32 HRESET ENABLE MSR.

HRESET causa una excepción de protección general (#GP) si EAX establece los bits que no están fijados en el IA32 HRESET EN- ABLE MSR.

Cualquier intento de ejecutar la instrucción HRESET dentro de una región transaccional resultará en un aborto de transacción.

## Operación

```text
IF EAX = 0

  THEN NOP
  ELSE

      FOREACH i such that EAX[i] = 1
         Reset prediction history for feature i

FI
```

## Banderas afectadas

None.
