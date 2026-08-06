---
summary: Bandera AC clara en EFLAGS Registro
---

## Descripción

Limpia el bit de la bandera AC en el registro EFLAGS. Esto desactiva cualquier comprobación de alineación de los accesos de datos de modo de usuario. Si el bit SMAP se establece en el registro CR4, esto permite el acceso explícito de los datos de control-mode a las páginas de usuario.

La operación de esta instrucción es la misma en modos no-64-bit y modo 64-bit. Intenta ejecutar CLAC cuando CPL > 0 causa #UD.

## Operación

```text
EFLAGS.AC := 0;
```

## Banderas afectadas

Un aire limpio. Otras banderas no son afectadas.
