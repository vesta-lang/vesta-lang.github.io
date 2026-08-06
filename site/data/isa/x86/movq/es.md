---
summary: Mover Quadword
---

## Descripción

Copie un cuadword del operando de origen (segundo operando) al operando de destino (primer operando). La fuente y operandos de destino pueden ser registros de tecnología MMX, registros XMM o ubicaciones de memoria de 64 bits. Esta instrucción se puede utilizar para mover un cuaderno entre dos registros de tecnología MMX o entre un registro de tecnología MMX y una ubicación de memoria de 64 bits, o para mover datos entre dos registros XMM o entre un registro XMM y una ubicación de memoria de 64 bits. La instrucción no puede utilizarse para transferir datos entre los lugares de memoria.

Cuando el operando de origen es un registro XMM, se mueve el cuadword bajo; cuando el operando de destino es un registro XMM, el cuadword se almacena en el cuadword bajo del registro, y el cuadword alto se pone a cero a todos los 0s.

En modo de 64 bits y si no codificado usando VEX/EVEX, el uso del prefijo REX en forma de REX.R permite esta instrucción para acceder a registros adicionales (XMM8-XMM15).

Nota: VEX.vvvv y EVEX.vvvv están reservados y deben ser 1111b, de lo contrario las instrucciones #UD.

Si VMOVQ está codificado con VEX.L= 1, un intento de ejecutar la instrucción codificada con VEX.L= 1 causará un

```text
#UD exception.
```

## Operación

```text
MOVQ Instruction When Operating on MMX Technology Registers and Memory Locations

    DEST := SRC;

MOVQ Instruction When Source and Destination Operands are XMM Registers
    DEST[63:0] := SRC[63:0];


    DEST[127:64] := 0000000000000000H;

MOVQ Instruction When Source Operand is XMM Register and Destination
operand is memory location:

    DEST := SRC[63:0];

MOVQ Instruction When Source Operand is Memory Location and Destination
operand is XMM register:

    DEST[63:0] := SRC;
    DEST[127:64] := 0000000000000000H;

VMOVQ (VEX.128.F3.0F 7E) With XMM Register Source and Destination
DEST[63:0] := SRC[63:0]
DEST[MAXVL-1:64] := 0

VMOVQ (VEX.128.66.0F D6) With XMM Register Source and Destination
DEST[63:0] := SRC[63:0]
DEST[MAXVL-1:64] := 0

VMOVQ (7E - EVEX Encoded Version) With XMM Register Source and Destination
DEST[63:0] := SRC[63:0]
DEST[MAXVL-1:64] := 0

VMOVQ (D6 - EVEX Encoded Version) With XMM Register Source and Destination
DEST[63:0] := SRC[63:0]
DEST[MAXVL-1:64] := 0

VMOVQ (7E) With Memory Source
DEST[63:0] := SRC[63:0]
DEST[MAXVL-1:64] := 0

VMOVQ (7E - EVEX Encoded Version) With Memory Source
DEST[63:0] := SRC[63:0]
DEST[:MAXVL-1:64] := 0

VMOVQ (D6) With Memory DEST
DEST[63:0] := SRC2[63:0]
```

## Banderas afectadas

None.

## Intel C/C++ compilador intrínseco

```c
VMOVQ __m128i _mm_loadu_si64( void * s);
VMOVQ void _mm_storeu_si64( void * d, __m128i s);
MOVQ m128i _mm_move_epi64(__m128i a);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Véase la sección 25.25.3, "Excepción de condiciones de Legacy SIMD Instrucciones de funcionamiento en los registros MMX" en el manual de desarrollo de software de arquitecturas Intel(R) 64 e IA-32, Volumen 3B.
