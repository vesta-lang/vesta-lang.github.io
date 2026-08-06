---
summary: Multiplique no firmado
---

## Descripción

Realiza una multiplicación sin firmar de la primera operando (operando de destino) y la segunda operando (operando de origen) y almacena el resultado en el operando de destino. El operando de destino es un operando implícito ubicado en el registro AL, AX o EAX (dependiendo del tamaño del operando); el operando de origen se encuentra en un registro general o una ubicación de memoria. La acción de esta instrucción y la ubicación del resultado depende del código de operación y el tamaño de operando como se muestra en el cuadro 4-9.

El resultado se almacena en el registro AX, par de registro DX:AX, o par de registro EDX:EAX (dependiendo del tamaño de operando), con los bits de alto orden del producto contenidos en el registro AH, DX, o EDX, respectivamente. Si los bits de alto orden del producto son 0, las banderas CF y OF se limpian; de lo contrario, las banderas están establecidas.

En modo de 64 bits, el tamaño de operación predeterminado de la instrucción es de 32 bits. El uso del prefijo REX.R permite el acceso a registros adicionales (R8-R15). El uso del prefijo REX.W promueve la operación a 64 bits.

Vea la tabla resumen al comienzo de esta sección para la codificación de datos y límites.

**MUL Results**

| Tamaño de operando | Fuente 1 | Fuente 2 | Destino |
| --- | --- | --- | --- |
| Byte | AL | r/m8 | AX |
| Palabra | AX | r/m16 | DX:AX |
| Doble palabra | EAX | r/m32 | EDX:EAX |
| Quadword | RAX | r/m64 | RDX:RAX |

## Operación

```text
IF (Byte operation)
    THEN
          AX := AL  SRC;
    ELSE (* Word or doubleword operation *)
          IF OperandSize = 16
                THEN
                      DX:AX := AX  SRC;
                ELSE IF OperandSize = 32
                      THEN EDX:EAX := EAX  SRC; FI;
                ELSE (* OperandSize = 64 *)
                      RDX:RAX := RAX  SRC;
          FI;


FI;
```

## Banderas afectadas

Las banderas OF y CF se establecen a 0 si la mitad superior del resultado es 0; de lo contrario, se establecen a 1. Las banderas SF, ZF, AF y PF quedan indefinidas.
