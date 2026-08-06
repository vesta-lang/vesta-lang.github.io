---
summary: 未签名除法
---

## 说明

在AX,DX:AX,EDX:EAX,或RDX:RAX登记册(dividend)中由源操作数(divisor)除去未签名的值,并将结果存储在AX(AH:AL),DX:AX,EDX:EAX,或RDX:RAX登记册中. 源操作数可以是通用寄存器,也可以是内存位置. 此指令的动作取决于 操作数大小 (dividend/divisor) 。 使用64位操作数的分区只可用64位模式.

非整体结果被截断(选择)到0. 其余的总是小于大小的分数. 过度流用#DE(潜水错误)例外表示,而不是用CF旗表示.

在64位模式下,指令的默认操作大小为32位. 使用REX.R前缀可以访问额外的登记册(R8-R15). 使用REX.W前缀将操作提升到64位. 在应用REX.W时的64位模式中,指令用RDX:RAX将未署名值除以源操作数,并将商号存储在RAX,其余为RDX.

参见本节开头的汇总图,用于编码数据和限制. 见表3-17。

**DIV Action**

| 单词/字节 | AX | r/m8 | AL | AH | 255 |
| --- | --- | --- | --- | --- | --- |
| 双字/双字 | DX:AX | r/m16 | AX | DX | 65,535 |
| 四字/双字 | EDX:EAX | r/m32 | EAX | EDX | 232 - 1 |
| 双词/ | RDX:RAX | r/m64 | RAX | RDX | 264 - 1 |
| 四个字 |  |  |  |  |  |
| DIV - 未签名的分割 |  |  |  |  |  |

## 行动

```text
IF SRC = 0

    THEN #DE; FI; (* Divide Error *)
IF OperandSize = 8 (* Word/Byte Operation *)

    THEN
          temp := AX / SRC;
          IF temp > FFH
                THEN #DE; (* Divide error *)
                ELSE
                       AL := temp;
                       AH := AX MOD SRC;
          FI;

   ELSE IF OperandSize = 16 (* Doubleword/word operation *)

          THEN
                temp := DX:AX / SRC;
                IF temp > FFFFH
                       THEN #DE; (* Divide error *)
                ELSE
                       AX := temp;
                       DX := DX:AX MOD SRC;
                FI;

          FI;
    ELSE IF Operandsize = 32 (* Quadword/doubleword operation *)

          THEN
                temp := EDX:EAX / SRC;
                IF temp > FFFFFFFFH
                       THEN #DE; (* Divide error *)
                ELSE
                       EAX := temp;
                       EDX := EDX:EAX MOD SRC;
                FI;

          FI;
    ELSE IF 64-Bit Mode and Operandsize = 64 (* Doublequadword/quadword operation *)

          THEN
                temp := RDX:RAX / SRC;
                IF temp > FFFFFFFFFFFFFFFFH
                       THEN #DE; (* Divide error *)
                ELSE
                       RAX := temp;
                       RDX := RDX:RAX MOD SRC;
                FI;

          FI;
FI;
```

## 受影响的旗帜

CF,OF,SF,ZF,AF,和PF的旗帜没有定义.
