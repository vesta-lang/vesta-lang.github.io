---
summary: Muévete de y a los registros de máscaras
---

## Descripción

Copie valores del operando de origen (segundo operando) al operando de destino (primer operando). La fuente y operandos de destino pueden ser registros de máscaras, ubicación de memoria o propósito general. La instrucción no puede utilizarse para transferir datos entre los registros de propósito general y los lugares de memoria.

Cuando se mueve a un registro de máscaras, el resultado es cero extendido al tamaño MAX KL (es decir, 64 bits actualmente). Cuando se mueve a un registro de proposito general (GPR), el resultado es cero-extended al tamaño del destino. En modo de 32 bits, el tamaño de destino GPR predeterminado es de 32 bits. En modo de 64 bits, el tamaño de destino GPR predeterminado es de 64 bits. Tenga en cuenta que VEX.W sólo se puede utilizar para modificar el tamaño del GPR operando en modo 64b.

## Operación

```text
KMOVW
IF *destination is a memory location*

    DEST[15:0] := SRC[15:0]
IF *destination is a mask register or a GPR *

    DEST := ZeroExtension(SRC[15:0])

KMOVB
IF *destination is a memory location*

    DEST[7:0] := SRC[7:0]
IF *destination is a mask register or a GPR *

    DEST := ZeroExtension(SRC[7:0])

KMOVQ
IF *destination is a memory location or a GPR*

    DEST[63:0] := SRC[63:0]
IF *destination is a mask register*

    DEST := ZeroExtension(SRC[63:0])

KMOVD
IF *destination is a memory location*

    DEST[31:0] := SRC[31:0]
IF *destination is a mask register or a GPR *

    DEST := ZeroExtension(SRC[31:0])
```

## Intel C/C++ compilador intrínseco

```c
KMOVW __mmask16 _mm512_kmov(__mmask16 a);
```

## Banderas afectadas

None.

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones con RRoperandocodificación, ver Tabla 2-65, "TYPE K20Definición de ExcepciónVEX-Instrucciones de OpMask codificadas w/o Memory Arg)." Instrucciones con RM o MRoperandocodificación, ver Tabla 2-66, "TYPE K21Definición de ExcepciónVEX-Instrucciones de OpMask codificadas a la memoria)."
