---
summary: Determinar la bandera interrupt de usuario
---

## Operación

```text
CF := UIF;
ZF := AF := OF := PF := SF := 0;
```

## Banderas afectadas

Las banderas ZF, OF, AF, PF, SF se limpian y las banderas CF al valor de la bandera de interrupción del usuario.
