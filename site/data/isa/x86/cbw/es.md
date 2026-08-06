---
summary: Convertir Byte en Word/Convertir Word en Doubleword/Convertir Doble Palabra
---

## Descripción

Doble el tamaño del operando de origen por medio de extensión de signo. La instrucción CBW (convertir byte a word) copia el signo (bit 7) en el operando de origen en cada bit en el registro AH. La instrucción CWDE (convertir palabra a palabra doble) copia el signo (bit 15) de la palabra en el registro AX en los 16 pedazos altos del registro EAX.

CBW y CWDE hacen referencia al mismo código de operación. La instrucción CBW es para uso cuando el operando-size atributo es 16; CWDE es para uso cuando el operando-size atributo es 32. Algunos montadores pueden forzar el tamaño de operando. Otros pueden tratar estos dos mnemonics como sinónimos (CBW/CWDE) y utilizar el ajuste de atributo el operando-size para determinar el tamaño de los valores a convertir.

En modo de 64 bits, el tamaño de operación predeterminado es el tamaño del registro de destino. El uso del prefijo REX.W promueve esta instrucción (CDQE cuando se promueve) para operar en operandos de 64 bits. En cuyo caso, CDQE copia el signo (bit 31) de la palabra doble en el registro EAX en los 32 bits altos de RAX.

## Operación

```text
IF OperandSize = 16 (* Instruction = CBW *)
    THEN
          AX := SignExtend(AL);
    ELSE IF (OperandSize = 32, Instruction = CWDE)
          EAX := SignExtend(AX); FI;
    ELSE (* 64-Bit Mode, OperandSize = 64, Instruction = CDQE*)
          RAX := SignExtend(EAX);

FI;
```

## Banderas afectadas

None.
