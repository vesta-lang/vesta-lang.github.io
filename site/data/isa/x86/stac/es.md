---
summary: Set AC Flag en EFLAGS Register
---

## Descripción

Establece el bit de la bandera AC en el registro EFLAGS. Esto puede permitir la comprobación de la alineación de los accesos a los datos del modo de usuario. Esto permite accesos explícitos de datos de control-mode a páginas de usuario, incluso si el bit SMAP se establece en el registro CR4. La operación de esta instrucción es la misma en modos no-64-bit y modo 64-bit. Intenta ejecutar STAC cuando CPL > 0 causa #UD.

## Operación

```text
EFLAGS.AC := 1;
```

## Banderas afectadas

Set de aire acondicionado. Otras banderas no son afectadas.
