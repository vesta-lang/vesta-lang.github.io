---
summary: Multiply firmada
---

## Descripción

Realiza una multiplicación firmada de dos operandos. Esta instrucción tiene tres formas, dependiendo del número de operandos.

* Forma One-operando -- Esta forma es idéntica a la utilizada por la instrucción MUL. Aquí, el operando de origen (en

un registro de proposito generaloubicación de memoria) se multiplica por el valor en el AL, AX,EAXoRAXregistro (dependiendo deel tamaño de operando) y el producto (twice el tamaño de la entradaoperando) se almacena en el AX, DX:AX,EDX:EAXoRDX:RAXregistros, respectivamente.

* Forma de dos operando -- Con este formulario el operando de destino (el primer operando) se multiplica por la fuente

operando (segundo operando). El operando de destino es un registro de proposito general y el operando de origen es un valor inmediato, un registro de proposito general o una ubicación de memoria. El producto intermedio (twice el tamaño de la entrada operando) es truncado y almacenado en la ubicación el operando de destino.

* Forma de tres operando -- Esta forma requiere un operando de destino (el primer operando) y dos operandos de origen

(el segundo y el tercero operandos). Aquí, el primer operando de origen (que puede ser un registro de proposito general o una ubicación de memoria) se multiplica por el segundo operando de origen (un valor inmediato). El producto intermedio (twice el tamaño del primer operando de origen) es truncado y almacenado en el operando de destino (un registro de proposito general).

Cuando un valor inmediato se utiliza como un operando, se muestra en la longitud del formato el operando de destino.

Las banderas CF y OF se establecen cuando el valor entero firmado del producto intermedio difiere del producto extendido operando-size-truncated, de lo contrario las banderas CF y OF se limpian.

Las tres formas de la instrucción IMUL son similares en que la longitud del producto se calcula al doble de la longitud de los operandos. Con la forma de un operando, el producto se almacena exactamente en el destino. Con las dos y tres formas de operación, sin embargo, el resultado es truncado a la longitud del destino antes de que se almacena en el

registro de destino. Debido a esta truncación, se debe probar la bandera CF o OF para asegurar que no se pierdan partes significativas.

Las formas de dos y tres operando también se pueden utilizar con operandos sin signo porque la mitad inferior del producto es el mismo independientemente de que los operandos esté firmado o no firmado. Sin embargo, las banderas CF y OF no pueden utilizarse para determinar si la mitad superior del resultado no es cero.

En modo de 64 bits, el tamaño de operación predeterminado de la instrucción es de 32 bits. El uso del prefijo REX.R permite el acceso a registros adicionales (R8-R15). El uso del prefijo REX.W promueve la operación a 64 bits. El uso de REX.W modifica los tres

forms of the instruction as follows.

* Una forma de operando --el operando de origen (en un registro de proposito general de 64 bits o ubicación de memoria) es

multiplicado por el valor en el registro RAX y el producto se almacena en los registros RDX:RAX.

* Forma de dos operando - el operando de origen es promovido a 64 bits si es un registro o una ubicación de memoria. El

operando de destino es promovido a 64 bits.

* Forma de tres operando - el primer operando de origen (ya sea un registro o una ubicación de memoria) y destino

operando son ascendidos a 64 bits. Si el operando de origen es un inmediato, es signo extendido a 64 bits.

## Operación

```text
IF (NumberOfOperands = 1)
   THEN IF (OperandSize = 8)

          THEN
                TMP_XP := AL  SRC (* Signed multiplication; TMP_XP is a signed integer at twice the width of the SRC *);
                AX := TMP_XP[15:0];

             IF SignExtend(TMP_XP[7:0]) = TMP_XP

                      THEN CF := 0; OF := 0;
                      ELSE CF := 1; OF := 1; FI;

        ELSE IF OperandSize = 16

                THEN
                      TMP_XP := AX  SRC (* Signed multiplication; TMP_XP is a signed integer at twice the width of the SRC *)
                      DX:AX := TMP_XP[31:0];

                  IF SignExtend(TMP_XP[15:0]) = TMP_XP

                            THEN CF := 0; OF := 0;
                            ELSE CF := 1; OF := 1; FI;

             ELSE IF OperandSize = 32

                      THEN
                            TMP_XP := EAX  SRC (* Signed multiplication; TMP_XP is a signed integer at twice the width of the SRC*)
                            EDX:EAX := TMP_XP[63:0];

                       IF SignExtend(TMP_XP[31:0]) = TMP_XP

                                  THEN CF := 0; OF := 0;
                                  ELSE CF := 1; OF := 1; FI;
                      ELSE (* OperandSize = 64 *)
                            TMP_XP := RAX  SRC (* Signed multiplication; TMP_XP is a signed integer at twice the width of the SRC *)
                            EDX:EAX := TMP_XP[127:0];

                       IF SignExtend(TMP_XP[63:0]) = TMP_XP

                                  THEN CF := 0; OF := 0;
                                  ELSE CF := 1; OF := 1; FI;
                      FI;
          FI;


   ELSE IF (NumberOfOperands = 2)

          THEN

                TMP_XP := DEST  SRC (* Signed multiplication; TMP_XP is a signed integer at twice the width of the SRC *)
                DEST := TruncateToOperandSize(TMP_XP);

             IF SignExtend(DEST)  TMP_XP

                      THEN CF := 1; OF := 1;

                      ELSE CF := 0; OF := 0; FI;

        ELSE (* NumberOfOperands = 3 *)

                TMP_XP := SRC1  SRC2 (* Signed multiplication; TMP_XP is a signed integer at twice the width of the SRC1 *)
                DEST := TruncateToOperandSize(TMP_XP);

             IF SignExtend(DEST)  TMP_XP

                      THEN CF := 1; OF := 1;

                      ELSE CF := 0; OF := 0; FI;

    FI;

FI;
```

## Banderas afectadas

Para la forma operando de la instrucción, las banderas CF y OF se fijan cuando partes significativas se llevan a la mitad superior del resultado y se aclaran cuando el resultado encaja exactamente en la mitad inferior del resultado. Para las formas de dos y tres operando de la instrucción, las banderas CF y OF se establecen cuando el resultado debe ser truncado para caber en el tamaño el operando de destino y se aclara cuando el resultado se ajusta exactamente en el tamaño el operando de destino. Las banderas SF, ZF, AF y PF quedan indefinidas.
