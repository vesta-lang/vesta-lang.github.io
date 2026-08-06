---
summary: Establecer bandera interrupt de usuario
---

## Descripción

STUI establece la bandera de interrupción del usuario (UIF). Su efecto tiene lugar inmediatamente; una interrupción del usuario puede ser entregada en el límite de instrucción después de STUI. (Esto contrasta con STI, cuyo efecto se retrasa por una instrucción).

Una ejecución de STUI dentro de una región transaccional causa un aborto transaccional; el aborto carga EAX ya que habría sido debido a una ejecución de STI.

## Operación

```text
UIF := 1;
```

## Banderas afectadas

None.
