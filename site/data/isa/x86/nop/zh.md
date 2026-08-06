---
summary: 无操作
---

## 说明

此指令不执行操作 。 它是一个单字节或多字节的NOP,在指令流中占据空间但不影响机器上下文,除了EIP寄存器.

NOP的多字节形式可以在有模型编码的处理器上找到:

* CPUID.01H:EAX[Bytes 11:8] = 0110B or 1111B

多字节 NOP 指令不会改变寄存器的内容,也不会发布内存操作. 该指令的操作在非64位模式和64位模式中是相同的.

## 行动

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

## 受影响的旗帜

None.
