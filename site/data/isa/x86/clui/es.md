---
summary: Clear User Interrupt Flag
---

## Descripción

CLUI despeja la bandera de interrupción del usuario (UIF). Su efecto tiene lugar inmediatamente: una interrupción del usuario no puede ser entregada en el límite de instrucción después de CLUI. Una ejecución de CLUI dentro de una región transaccional causa un aborto transaccional; el aborto carga EAX ya que habría sido causado debido a una ejecución de CLI.

## Operación

```text
UIF := 0;
```

## Banderas afectadas

None.
