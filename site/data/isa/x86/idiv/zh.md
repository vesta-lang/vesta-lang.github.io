---
summary: 已签名的分割
---

## 说明

由 源操作数 (divisor) 除以 AX, DX: AX, 或 EDX: EAX (dividend) 中的(已签名) 值, 并将结果存储在 AX (AH: AL), DX: AX, 或 EDX: EAX 登记册中 。 源操作数可以是通用寄存器,也可以是内存位置. 此指令的动作取决于 操作数大小 (dividend/divisor) 。

非整体结果被截断(选择)到0. 其余的总是小于大小的分数. 过度流用#DE(潜水错误)例外表示,而不是用CF旗表示.

在64位模式下,指令的默认操作大小为32位. 使用REX.R前缀可以访问额外的登记册(R8-R15). 使用REX.W前缀将操作提升到64位. 在应用REX.W时的64位模式中,指令将RDX:RAX的签名值除以源操作数. RAX包含64位商数; RDX包含一个64位的剩余部分.

参见本节开头的汇总图,用于编码数据和限制. 见表3-53。

** IDIV 结果**

| 操作大小 | 红利 | 潜水员 | 引号 | 剩余部分 | 引号范围 |
| --- | --- | --- | --- | --- | --- |
| e                           AX |  | r/m8           AL |  | AH | -128 to +127 |

## 行动

```text
IF SRC = 0

    THEN #DE; (* Divide error *)
FI;

IF OperandSize = 8 (* Word/byte operation *)

    THEN
          temp := AX / SRC; (* Signed division *)
          IF (temp > 7FH) or (temp < 80H)
          (* If a positive result is greater than 7FH or a negative result is less than 80H *)
                THEN #DE; (* Divide error *)
                ELSE
                       AL := temp;
                       AH := AX SignedModulus SRC;
          FI;

   ELSE IF OperandSize = 16 (* Doubleword/word operation *)

          THEN
                temp := DX:AX / SRC; (* Signed division *)
                IF (temp > 7FFFH) or (temp < 8000H)
                (* If a positive result is greater than 7FFFH
                or a negative result is less than 8000H *)
                       THEN
                             #DE; (* Divide error *)
                       ELSE
                             AX := temp;
                             DX := DX:AX SignedModulus SRC;
                FI;

          FI;
    ELSE IF OperandSize = 32 (* Quadword/doubleword operation *)

                temp := EDX:EAX / SRC; (* Signed division *)
                IF (temp > 7FFFFFFFH) or (temp < 80000000H)
                (* If a positive result is greater than 7FFFFFFFH
                or a negative result is less than 80000000H *)

                       THEN
                             #DE; (* Divide error *)

                       ELSE
                             EAX := temp;
                             EDX := EDXE:AX SignedModulus SRC;

                FI;
          FI;
    ELSE IF OperandSize = 64 (* Doublequadword/quadword operation *)

                temp := RDX:RAX / SRC; (* Signed division *)
                IF (temp > 7FFFFFFFFFFFFFFFH) or (temp < 8000000000000000H)
                (* If a positive result is greater than 7FFFFFFFFFFFFFFFH
                or a negative result is less than 8000000000000000H *)

                       THEN
                             #DE; (* Divide error *)

                       ELSE
                             RAX := temp;
                             RDX := RDE:RAX SignedModulus SRC;

                FI;
          FI;
FI;
```

## 受影响的旗帜

CF,OF,SF,ZF,AF,和PF的旗帜没有定义.
