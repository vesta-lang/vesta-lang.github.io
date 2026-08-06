---
summary: No hay operación
---

## Descripción

Esta instrucción no funciona. Es un NOP de un byte o multi-byte que ocupa espacio en la secuencia de instrucciones pero no afecta el contexto de la máquina, excepto el registro EIP.

La forma multibyte de NOP está disponible en procesadores con codificación modelo:

* CPUID.01H:EAX[Bytes 11:8] = 0110B or 1111B

La instrucción NOP multibyte no altera el contenido de un registro y no emitirá una operación de memoria. La operación de la instrucción es la misma en modos no-64-bit y modo 64-bit.

## Operación

```text
The one-byte NOP instruction is an alias mnemonic for the XCHG (E)AX, (E)AX instruction.

The multi-byte NOP instruction performs no operation on supported processors and generates undefined opcode
exception on processors that do not support the multi-byte NOP instruction.

The memory operand form of the instruction allows software to create a byte sequence of "no operation" as one
instruction. For situations where multiple-byte NOPs are needed, the recommended operations (32-bit mode and
64-bit mode) are:

                   Table 4-12. Recommended Multi-Byte Sequence of NOP Instruction

Length             Assembly                                                Byte Sequence
2 bytes            66 NOP                                                  66 90H
3 bytes            NOP DWORD ptr [EAX]                                     0F 1F 00H
4 bytes            NOP DWORD ptr [EAX + 00H]                               0F 1F 40 00H
5 bytes            NOP DWORD ptr [EAX + EAX*1 + 00H]                       0F 1F 44 00 00H
6 bytes            66 NOP DWORD ptr [EAX + EAX*1 + 00H]                    66 0F 1F 44 00 00H
7 bytes            NOP DWORD ptr [EAX + 00000000H]                         0F 1F 80 00 00 00 00H
8 bytes            NOP DWORD ptr [EAX + EAX*1 + 00000000H]                 0F 1F 84 00 00 00 00 00H
9 bytes            66 NOP DWORD ptr [EAX + EAX*1 + 00000000H]              66 0F 1F 84 00 00 00 00 00H
```

## Banderas afectadas

None.
