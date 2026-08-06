---
summary: Mover a/desde Registros de Debug
---

## Descripción

Mueva el contenido de un registro de depuración (DR0, DR1, DR2, DR3, DR4, DR5, DR6, o DR7) a un registro de proposito general o viceversa. El tamaño de operando para estas instrucciones es siempre 32 bits en modos no-64-bit, independientemente del atributo el operando-size. (Ver Sección 20.2, "Debug Registers", de Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 3A, para una descripción detallada de las banderas y campos en los registros de depuración.)

Las instrucciones deben ejecutarse a nivel de privilegios 0 o en modo de direccion real.

Cuando la bandera de extensión de depuración (DE) en el registro CR4 es clara, estas instrucciones funcionan en registros de depuración de una manera compatible con procesadores Intel386 e Intel486. En este modo, las referencias a DR4 y DR5 se refieren a DR6 y DR7, respectivamente. Cuando se establece la bandera DE en CR4, los intentos de referencia DR4 y DR5 resultan en una excepción no definida código de operación (#UD). (El registro CR4 fue añadido a la Arquitectura IA-32 comenzando con el procesador Pentium.)

A nivel el código de operación, el campo reg dentro del byte ModR/M especifica cuál de los registros de depuración es cargado o leído. Los dos pedazos en el campo mod son ignorados. El campo r/m especifica el registro de proposito general cargado o leído.

En modo de 64 bits, el tamaño de operación predeterminado de la instrucción es de 64 bits. El uso del prefijo REX.B permite el acceso a registros adicionales (R8R15). Se ignora el uso del prefijo REX.W o 66H. El uso del prefijo REX.R causa una excepción inválida. Vea la tabla resumen al comienzo de esta sección para la codificación de datos y límites.

## Operación

```text
IF ((DE = 1) and (SRC or DEST = DR4 or DR5))

    THEN
          #UD;

    ELSE
          DEST := SRC;

FI;
```

## Banderas afectadas

Las banderas OF, SF, ZF, AF, PF y CF quedan indefinidas.
