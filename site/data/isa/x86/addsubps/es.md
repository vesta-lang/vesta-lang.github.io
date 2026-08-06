---
summary: Packed coma flotante de precisión simple Add/Subtract
---

## Descripción

Añade valores en coma flotante de precisión simple del primer operando de origen (segundo operando) con los valores en coma flotante de precisión simple correspondiente del segundo operando de origen (tercer operando); almacena el resultado en los valores de número impar del operando de destino (primer operando). Sube los valores en coma flotante de precisión simple numerado del segundo operando de origen de los valores flotantes de precisión única correspondientes en el primer operando de origen; almacena el resultado en los valores numerados del operando de destino.

En modo de 64 bits, el uso de un prefijo REX en forma de REX.R permite esta instrucción para acceder a registros adicionales (XMM8-XMM15).

128-bit Legacy SSE versión: La segunda fuente puede ser un registro XMM o una ubicación de memoria de 128 bits. El destino no es distinto del registro XMM de primera fuente y los bits superiores (MAXVL-1:128) del destino de registro YMM correspondiente no son modificados. Véase la Figura 3-4.

VEX.128 versión codificada: el primer operando de origen es un registro XMM o 128-bit ubicación de memoria. El operando de destino es un registro XMM. Los bits superiores (MAXVL-1:128) del destino de registro YMM correspondiente se ponen a cero.

VEX.256 versión codificada: El primer operando de origen es un registro YMM. El segundo operando de origen puede ser un registro YMM o una ubicación de memoria de 256 bits. El operando de destino es un registro YMM.

ADDSUBPS xmm1, xmm2/m128

[127:96]           [95:64]                                     [63:32]           [31:0]        xmm2/ m128

xmm1[127:96] + xmm1[95:64] - xmm2/ xmm1[63:32] +                                 xmm1[31:0] -  RESULT:

xmm2/m128[127:96]  m128[95:64]                                 xmm2/m128[63:32]  xmm2/m128[31:0] xmm1

[127:96]           [95:64]                                     [63:32]           [31:0]

OM15992

Figura 3-4. ADDSUBPS--Packed coma flotante de precisión simple Add/Subtract

## Operación

```text
ADDSUBPS (128-bit Legacy SSE Version)
DEST[31:0] := DEST[31:0] - SRC[31:0]
DEST[63:32] := DEST[63:32] + SRC[63:32]
DEST[95:64] := DEST[95:64] - SRC[95:64]
DEST[127:96] := DEST[127:96] + SRC[127:96]
DEST[MAXVL-1:128] (Unmodified)

VADDSUBPS (VEX.128 Encoded Version)
DEST[31:0] := SRC1[31:0] - SRC2[31:0]
DEST[63:32] := SRC1[63:32] + SRC2[63:32]
DEST[95:64] := SRC1[95:64] - SRC2[95:64]
DEST[127:96] := SRC1[127:96] + SRC2[127:96]
DEST[MAXVL-1:128] := 0

VADDSUBPS (VEX.256 Encoded Version)
DEST[31:0] := SRC1[31:0] - SRC2[31:0]
DEST[63:32] := SRC1[63:32] + SRC2[63:32]
DEST[95:64] := SRC1[95:64] - SRC2[95:64]
DEST[127:96] := SRC1[127:96] + SRC2[127:96]
DEST[159:128] := SRC1[159:128] - SRC2[159:128]
DEST[191:160] := SRC1[191:160] + SRC2[191:160]
DEST[223:192] := SRC1[223:192] - SRC2[223:192]
DEST[255:224] := SRC1[255:224] + SRC2[255:224]
```

## Intel C/C++ compilador intrínseco

```c
ADDSUBPS __m128 _mm_addsub_ps(__m128 a, __m128 b) VADDSUBPS __m256 _mm256_addsub_ps (__m256 a, __m256 b) Exceptions When the source operand is a memory operand, the operand must be aligned on a 16-byte boundary or a general- protection exception (#GP) will be generated.;
```

## SIMD coma flotante Excepciones

Overflow, Underflow, Invalid, Precision, Denormal.

## Otras excepciones

Ver Tabla 2-19, "Tipo 2 Condiciones de Excepción de Clase".

ADOX - Adición de entero sin firma de dos operandos con bandera de desbordamiento

Código de operación/ Op/ 64/32bit CPUID Descripción Instrucciones

```text
                      En Mode           Feature
```

Soporte Bandera

F3 0F 38 F6 /r RM V/VADXAdiciones no firmadasr32con OF,r/m32ar32, escribe OF. ADOX r32, r/m32

F3 REX.w 0F 38 F6 /r RM V/N.E.         ADXAdiciones no firmadasr64con OF,r/m64ar64, escribe OF. ADOX r64, r/m64

## Descripción

Realiza una adición sin firmar del operando de destino (primer operando), el operando de origen (segundo operando) y el desbordamiento (OF) y almacena el resultado en el operando de destino. El operando de destino es un registro para fines generales, mientras que el operando de origen puede ser un registro de proposito general o ubicación de memoria. El estado de OF representa una carga de una adición anterior. La instrucción establece la bandera OF con el porte generado por la adición no firmada de los operandos.

La instrucción ADOX se ejecuta en el contexto de la adición de multiprecisión, donde se agrega una serie de operandos con una cadena de carga. Al comienzo de una cadena de adiciones, ejecutamos una instrucción a cero la OF (por ejemplo. XOR).

Esta instrucción se soporta en modo real y modo virtual-8086. El tamaño de operando es siempre 32 bits si no en modo de 64 bits.

En modo 64-bit, el tamaño de operación predeterminado es de 32 bits. Utilizando un Prefijo REX en forma de REX.R permite el acceso a registros adicionales (R8-15). Utilizando REX Prefix en forma de REX.W promueve la operación a 64 bits.

ADOX ejecuta normalmente dentro o fuera de una región de transacción. Nota: ADOX define las banderas CF y OF de forma diferente a las instrucciones ADD/ADC definidas en Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 2A.

## Operación

```text
IF OperandSize is 64-bit

    THEN OF:DEST[63:0] := DEST[63:0] + SRC[63:0] + OF;
    ELSE OF:DEST[31:0] := DEST[31:0] + SRC[31:0] + OF;
FI;
```

## Banderas afectadas

OF se actualiza sobre la base del resultado. Las banderas CF, SF, ZF, AF y PF no están modificadas.

## Intel C/C++ compilador intrínseco

```c
unsigned char _addcarryx_u32 (unsigned char c_in, unsigned int src1, unsigned int src2, unsigned int *sum_out);
unsigned char _addcarryx_u64 (unsigned char c_in, unsigned __int64 src1, unsigned __int64 src2, unsigned __int64 *sum_out);
```

## SIMD coma flotante Excepciones

None.

ADOX - Adición de entero sin firma de dos operandos con bandera de desbordamiento
