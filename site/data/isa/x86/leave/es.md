---
summary: Salida de procedimiento de alto nivel
---

## Descripción

Libera el marco de pila establecido por una instrucción ENTER anterior. La instrucción LEAVE copia el puntero del marco (en el registro EBP) en el registro el puntero de pila (ESP), que libera el espacio de la pila asignado al marco de la pila. El viejo puntero de marco (el puntero de marco para el procedimiento de llamada que fue guardado por la instrucción ENTER) se salta de la pila en el registro EBP, restaurando el marco de la pila del procedimiento de llamada.

Una instrucción RET se ejecuta comúnmente siguiendo una instrucción LEAVE para devolver el control del programa al procedimiento de llamada.

Ver "Procedimiento de llamadas para lenguajes bloqueados" en el capítulo 6 de Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1, para información detallada sobre el uso de las instrucciones ENTER y LEAVE.

En modo de 64 bits, el tamaño de operación predeterminado de la instrucción es de 64 bits; la operación de 32 bits no se puede codificar. Vea la tabla resumen al comienzo de esta sección para la codificación de datos y límites.

## Operación

```text
IF StackAddressSize = 32

    THEN
          ESP := EBP;

   ELSE IF StackAddressSize = 64

          THEN RSP := RBP; FI;

   ELSE IF StackAddressSize = 16

          THEN SP := BP; FI;
FI;

IF OperandSize = 32

    THEN EBP := Pop();

   ELSE IF OperandSize = 64

          THEN RBP := Pop(); FI;

   ELSE IF OperandSize = 16

          THEN BP := Pop(); FI;
FI;
```

## Banderas afectadas

None.
