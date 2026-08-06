---
summary: Serializar la ejecución de la instrucción
---

## Descripción

Serializa la ejecución de la instrucción. Antes de que la siguiente instrucción sea traída y ejecutada, la instrucción SERIALIZE asegura que todas las modificaciones a banderas, registros y memoria por instrucciones anteriores se completen, drenando todos los escritos amortiguados a la memoria. Esta instrucción también es una instrucción serializadora tal como se define en la sección "Instruciones de serialización" en el capítulo 11 de Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 3A.

SERIALIZE no modifica registros, banderas aritméticas o memoria.

## Operación

```text
Wait_On_Fetch_And_Execution_Of_Next_Instruction_Until(preceding_instructions_complete_and_preceding_stores_globally_visible);
```

## Intel C/C++ compilador intrínseco

```c
SERIALIZE void _serialize(void);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Si se utiliza el prefijo LOCK.

```text
#UD                 If CPUID.07H.00H:EDX.SERIALIZE[14] = 0.
```
