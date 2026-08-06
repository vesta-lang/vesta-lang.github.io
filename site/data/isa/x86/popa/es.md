---
summary: Pop All registros de proposito general
---

## Descripción

Palabras dobles Pops (POPAD) o palabras (POPA) de la pila en los registros de proposito general. Los registros se cargan en el siguiente orden: EDI, ESI, EBP, EBX, EDX, ECX y EAX (si el operando-size atributo es 32) y DI, SI, BP, BX, DX, CX y AX (si el operando-size es 16). (Estas instrucciones revierten el funcionamiento de las instrucciones PUSHA/PUSHAD.) Se ignora el valor de la pila para el registro ESP o SP. En su lugar, el registro ESP o SP se aumenta después de que cada registro se carga.

El POPA (pop all) y POPAD (pop all double) mnemonics hacen referencia al mismo código de operación. La instrucción POPA es para uso cuando el operando-size atributo es 16 y la instrucción POPAD para cuando el operando-size atributo es 32. Algunos montadores pueden forzar el tamaño de operando a 16 cuando se utiliza POPA y a 32 cuando se utiliza POPAD (utilizando el operando-size override prefix [66H] si es necesario). Otros pueden tratar estos mnemonics como sinónimos (POPA/POPAD) y utilizar el ajuste actual del atributo el operando-size para determinar el tamaño de los valores que se han de extraer de la pila, independientemente de la mnemónica utilizada. (La bandera D en el descriptor del segmento de código actual determina el atributo de tamaño el operando).

Esta instrucción se ejecuta como se describe en modos no-64-bit. No es válido en modo de 64 bits.

## Operación

```text
IF 64-Bit Mode
    THEN
          #UD;

ELSE
    IF OperandSize = 32 (* Instruction = POPAD *)
    THEN
          EDI := Pop();
          ESI := Pop();
          EBP := Pop();
          Increment ESP by 4; (* Skip next 4 bytes of stack *)
          EBX := Pop();
          EDX := Pop();
          ECX := Pop();
          EAX := Pop();
    ELSE (* OperandSize = 16, instruction = POPA *)
          DI := Pop();
          SI := Pop();
          BP := Pop();
          Increment ESP by 2; (* Skip next 2 bytes of stack *)
          BX := Pop();
          DX := Pop();
          CX := Pop();
          AX := Pop();
    FI;

FI;
```

## Banderas afectadas

None.
