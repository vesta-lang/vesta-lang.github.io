---
summary: Instrucción indefinida
---

## Descripción

Genera una excepción de código de operación no válido. Esta instrucción se proporciona para la prueba de software para generar explícitamente una excepción de código de operación no válido. Los códigos de operación para esta instrucción están reservados para este propósito. Aparte de criar la excepción de código de operación no válido, esta instrucción no tiene efecto en el estado del procesador o la memoria. A pesar de que es la ejecución de la instrucción UD que causa la excepción de código de operación no válido, el puntero de instruccion salvado por la entrega de la excepción referencia la instrucción UD (y no la siguiente instrucción). La operación de esta instrucción es la misma en modos no-64-bit y modo 64-bit.

## Operación

```text
#UD (* Generates invalid opcode exception *);
```

## Banderas afectadas

None.
