---
summary: Empujar todo registros de proposito general
---

## Descripción

Empuja el contenido de los registros de proposito general sobre la pila. Los registros se almacenan en la pila en el siguiente orden: EAX, ECX, EDX, EBX, ESP (valor original), EBP, ESI y EDI (si el atributo de operado actual es 32) y AX, CX, DX, BX, SP (valor original), BP, SI Estas instrucciones realizan el funcionamiento inverso de las instrucciones POPA/POPAD. El valor presionado para el registro ESP o SP es su valor antes de presionar el primer registro (ver la sección "Operación" a continuación).

El PUSHA (push all) y PUSHAD (push all double) mnemonics referir el mismo código de operación. La instrucción PUSHA está destinada para su uso cuando el operando-size atributo es 16 y la instrucción PUSHAD para cuando el atributo operadsize es 32. Algunos montadores pueden forzar el tamaño de operando a 16 cuando se utiliza PUSHA y a 32 cuando se utiliza PUSHAD. Otros pueden tratar estos mnemonics como sinónimos (PUSHA/PUSHAD) y utilizar el ajuste actual del atributo el operando-size para determinar el tamaño de los valores a ser empujados de la pila, independientemente de la mnemónica utilizada.

En el modo de direccion real, si el registro ESP o SP es 1, 3, o 5 cuando PUSHA/PUSHAD ejecuta: se genera una excepción #SS pero no se entrega (el error de pila reportado evita la entrega de #SS). A continuación, el procesador genera un

```text
#DF exception and enters a shutdown state as described in the #DF discussion in Chapter 7 of the Intel(R) 64 and
```

IA-32 Architectures Software Developer's Manual, Volumen 3A.

Esta instrucción se ejecuta como se describe en modo de compatibilidad y modo legado. No es válido en modo de 64 bits.

## Operación

```text
IF 64-bit Mode
    THEN #UD

FI;
IF OperandSize = 32 (* PUSHAD instruction *)

    THEN
          Temp := (ESP);
          Push(EAX);
          Push(ECX);
          Push(EDX);
          Push(EBX);
          Push(Temp);
          Push(EBP);
          Push(ESI);
          Push(EDI);

    ELSE (* OperandSize = 16, PUSHA instruction *)
          Temp := (SP);
          Push(AX);
          Push(CX);
          Push(DX);
          Push(BX);
          Push(Temp);


          Push(BP);
          Push(SI);
          Push(DI);
FI;
```

## Banderas afectadas

None.
