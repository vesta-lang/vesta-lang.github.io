---
summary: Convertir palabra en Doble palabra/Convertir doble palabra en Quadword
---

## Descripción

Doble el tamaño del operando en el registro AX, EAX, o RAX (dependiendo del tamaño de operando) por medio de extensión de señal y almacena el resultado en los registros DX:AX, EDX:EAX, o RDX:RAX, respectivamente. La instrucción CWD copia el signo (bit 15) del valor en el registro AX en cada posición bit en el registro DX. La instrucción CDQ copia el signo (bit 31) del valor en el registro EAX en cada posición del bit en el registro EDX. La instrucción CQO (disponible únicamente en modo de 64 bits) copia el signo (bit 63) del valor en el registro RAX en cada posición del bit en el registro RDX.

La instrucción CWD se puede utilizar para producir un dividendo de doble palabra de una palabra antes de división palabra. La instrucción CDQ se puede utilizar para producir un dividendo de cuádruple de una palabra doble antes de la división de doble palabra. La instrucción CQO se puede utilizar para producir un dividendo de cuádpago doble de un cuádpalo antes de una división de cuádpago.

Los CWD y CDQ mnemonics hacen referencia al mismo código de operación. La instrucción CWD es para uso cuando el operando-size atributo es 16 y la instrucción CDQ para cuando el operando-size atributo es 32. Algunos montadores pueden forzar el tamaño de operando a 16 cuando se utiliza CWD y a 32 cuando se utiliza CDQ. Otros pueden tratar estos mnemonics como sinónimos (CWD/CDQ) y utilizar el ajuste actual del atributo el operando-size para determinar el tamaño de los valores a convertir, independientemente de la mnemónica utilizada.

En modo de 64 bits, el uso del prefijo REX.W promueve el funcionamiento a 64 bits. El CQO mnemonics hace referencia al mismo código de operación que CWD/CDQ. Vea la tabla resumen al comienzo de esta sección para la codificación de datos y límites.

## Operación

```text
IF OperandSize = 16 (* CWD instruction *)

    THEN
          DX := SignExtend(AX);

   ELSE IF OperandSize = 32 (* CDQ instruction *)

          EDX := SignExtend(EAX); FI;
    ELSE IF 64-Bit Mode and OperandSize = 64 (* CQO instruction*)

          RDX := SignExtend(RAX); FI;
FI;
```

## Banderas afectadas

None.
