---
summary: 未签名但不影响旗帜的倍数
---

## 说明

进行隐式源操作数(EDX/RDX)和指定的源操作数(第三代操作数)的无符号乘法,并将结果的低半部分存储在第二目的地(第二代操作数),高半部分存储在第一代目标操作数(第一代操作数),不读写算旗. 这使得软件可以与载运操作和乘法互换的高效编程成为可能.

如果第一个和第二个操作数完全相同,它会包含乘法结果的高一半.

此指令不支持真实模式和 虚拟 8086 模式 。 操作数大小如果不是64位模式,总是32位. 在64位模式操作数大小 64中需要VEX.W1. VEX.W1在非64位模式中被忽略. 试图用不等于0的 VEX.L 执行此指令将导致 #UD.

## 行动

```text
// DEST1: ModRM:reg
// DEST2: VEX.vvvv
IF (OperandSize = 32)

    SRC1 := EDX;
    DEST2 := (SRC1*SRC2)[31:0];
    DEST1 := (SRC1*SRC2)[63:32];
ELSE IF (OperandSize = 64)
    SRC1 := RDX;

          DEST2 := (SRC1*SRC2)[63:0];
          DEST1 := (SRC1*SRC2)[127:64];
FI
```

## Intel C/C++ 内在编译器

```c
Auto-generated from high-level language when possible. unsigned int mulx_u32(unsigned int a, unsigned int b, unsigned int * hi);
unsigned __int64 mulx_u64(unsigned __int64 a, unsigned __int64 b, unsigned __int64 * hi);
```

## 受影响的旗帜

None.

## SIMD 浮点 例外

None.

## 其他例外

参见表2-29"十三类例外条件".
