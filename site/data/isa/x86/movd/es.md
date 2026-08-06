---
summary: Mover la palabra doble/Move Quadword
---

## Descripción

Copia una palabra doble del operando de origen (segundo operando) al operando de destino (primer operando). La fuente y operandos de destino pueden ser registros de tecnología registros de proposito general, registros MMX, registros XMM o ubicaciones de memoria de 32 bits. Esta instrucción se puede utilizar para mover una palabra doble a y desde la palabra doble baja de un registro de tecnología MMX y un registro de proposito general o una ubicación de memoria de 32 bits, o a y desde la palabra doble baja de un registro XMM y un registro de proposito general o una ubicación de memoria de 32 bits. La instrucción no puede utilizarse para transferir datos entre los registros de tecnología MMX, entre los registros XMM, entre registros de proposito general o entre los lugares de memoria.

Cuando el operando de destino es un registro de tecnología MMX, el operando de origen está escrito a la palabra doble baja del registro, y el registro es de cero-extended a 64 bits. Cuando el operando de destino es un registro XMM, el operando de origen está escrito a la palabra doble baja del registro, y el registro es de cero-extended a 128 bits.

En modo de 64 bits, el tamaño de operación predeterminado de la instrucción es de 32 bits. El uso del prefijo REX.B permite el acceso a registros adicionales (R8-R15). El uso del prefijo REX.W promueve la operación a 64 bits. Vea la tabla resumen al comienzo de esta sección para la codificación de datos y límites.

MOVD/Q con destino XMM:

Mueva un entero dword/qword del operando de origen y lo almacena en los bajos 32/64-bits del registro de destino XMM. Las partes superiores del destino se ponen a cero. El operando de origen puede ser un registro de 32/64-bits o ubicación de memoria de 32/64-bit.

128-bit Legacy SSE versión: Bits (MAXVL-1:128) del correspondiente registro de destino YMM no se modifican. La operación Qword requiere el uso de REX.W=1.

VEX.128 versión codificada: Bits (MAXVL-1:128) del registro de destino se ponen a cero. La operación Qword requiere el uso de VEX.W=1.

EVEX.128 versión codificada: Bits (MAXVL-1:128) del registro de destino se ponen a cero. La operación Qword requiere el uso de EVEX.W=1.

MOVD/Q with 32/64 reg/mem destination:

Almacena el bajo dword/qword de la fuente XMM registro a 32/64-bit ubicación de memoria o registro de proposito general. La operación Qword requiere el uso de REX.W=1, VEX.W=1, o EVEX.W=1.

Nota: VEX.vvvv y EVEX.vvvv están reservados y deben ser 1111b instrucciones de lo contrario #UD.

Si VMOVD o VMOVQ está codificado con VEX.L= 1, un intento de ejecutar la instrucción codificada con VEX.L= 1 causará una excepción #UD.

## Operación

```text
MOVD (When Destination Operand is an MMX Technology Register)

    DEST[31:0] := SRC;
    DEST[63:32] := 00000000H;

MOVD (When Destination Operand is an XMM Register)
    DEST[31:0] := SRC;
    DEST[127:32] := 000000000000000000000000H;
    DEST[MAXVL-1:128] (Unmodified)

MOVD (When Source Operand is an MMX Technology or XMM Register)
    DEST := SRC[31:0];


VMOVD (VEX-Encoded Version when Destination is an XMM Register)
    DEST[31:0] := SRC[31:0]
    DEST[MAXVL-1:32] := 0

MOVQ (When Destination Operand is an XMM Register)
    DEST[63:0] := SRC[63:0];
    DEST[127:64] := 0000000000000000H;
    DEST[MAXVL-1:128] (Unmodified)

MOVQ (When Destination Operand is r/m64)
    DEST[63:0] := SRC[63:0];

MOVQ (When Source Operand is an XMM Register or r/m64)
    DEST := SRC[63:0];

VMOVQ (VEX-Encoded Version When Destination is an XMM Register)
    DEST[63:0] := SRC[63:0]
    DEST[MAXVL-1:64] := 0

VMOVD (EVEX-Encoded Version When Destination is an XMM Register)
DEST[31:0] := SRC[31:0]
DEST[MAXVL-1:32] := 0

VMOVQ (EVEX-Encoded Version When Destination is an XMM Register)
DEST[63:0] := SRC[63:0]
DEST[MAXVL-1:64] := 0
```

## Intel C/C++ compilador intrínseco

```c
MOVD __m64 _mm_cvtsi32_si64 (int i ) MOVD int _mm_cvtsi64_si32 ( __m64m ) MOVD __m128i _mm_cvtsi32_si128 (int a) MOVD int _mm_cvtsi128_si32 ( __m128i a) MOVQ __int64 _mm_cvtsi128_si64(__m128i);
MOVQ __m128i _mm_cvtsi64_si128(__int64);
VMOVD __m128i _mm_cvtsi32_si128( int);
VMOVD int _mm_cvtsi128_si32( __m128i );
VMOVQ __m128i _mm_cvtsi64_si128 (__int64);
VMOVQ __int64 _mm_cvtsi128_si64(__m128i );
VMOVQ __m128i _mm_loadl_epi64( __m128i * s);
VMOVQ void _mm_storel_epi64( __m128i * d, __m128i s);
```

## Banderas afectadas

None.

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones no codificadas en EVEX, ver Tabla 2-22, "Tipo 5 Condiciones de Excepción de Clase".

Instrucciones codificadas por EVEX, ver Tabla 2-59, "Tipo E9NF Clase Condiciones de Excepción."

Additionally:

```text
#UD               If VEX.L = 1.
```

If VEX.vvvv != 1111B or EVEX.vvvv != 1111B.
