---
summary: 装入有效地址
---

## 说明

计算第二个操作数(即源操作数)的有效地址,并将其存储在第一个操作数(即目标操作数)中. 源操作数是指定的内存地址(抵消部分),其中处理器之一处理模式;目标操作数是一个通用寄存器. 地址大小和操作数大小属性影响本指令执行的动作,如下表所示. 指令的操作数大小属性由选定的寄存器决定;地址大小属性由代码段属性决定.

** 非64位模式 LEA 操作附地址和 操作数大小 属性**

| 操作大小 | 地址大小 | 已执行的动作 |
| --- | --- | --- |
| 16 | 16位有效地址计算a | nd 存储在请求的 16 位注册目的地 。 |
| 16 | 3232位有效地址被计算. request 16位注册目的地. | 地址的下十六位元存储于 |
| 32 | 16位有效地址被计算. request 32位注册目的地. | 16 位地址为零延伸并存储在 |

** 64 位模式 LEA 操作地址和 操作数大小 属性**

| 操作大小 | 地址大小 | 已执行的动作 |
| --- | --- | --- |
| 16 | 3232位有效地址计算( | 使用 67H 前缀). 地址的下16位是 |
|  | 存储在请求的 16 位寄存器中 | 目的地(使用 66H 前缀). |
| 16 | 64位64位有效地址计算( | 默认地址大小). 地址的下十六位数 |

## 行动

```text
IF OperandSize = 16 and AddressSize = 16

    THEN
          DEST := EffectiveAddress(SRC); (* 16-bit address *)

   ELSE IF OperandSize = 16 and AddressSize = 32

          THEN
                temp := EffectiveAddress(SRC); (* 32-bit address *)
                DEST := temp[0:15]; (* 16-bit address *)

          FI;

   ELSE IF OperandSize = 32 and AddressSize = 16

          THEN
                temp := EffectiveAddress(SRC); (* 16-bit address *)
                DEST := ZeroExtend(temp); (* 32-bit address *)

          FI;

   ELSE IF OperandSize = 32 and AddressSize = 32

          THEN
                DEST := EffectiveAddress(SRC); (* 32-bit address *)

          FI;

   ELSE IF OperandSize = 16 and AddressSize = 64

          THEN
                temp := EffectiveAddress(SRC); (* 64-bit address *)
                DEST := temp[0:15]; (* 16-bit address *)

          FI;

   ELSE IF OperandSize = 32 and AddressSize = 64

          THEN
                temp := EffectiveAddress(SRC); (* 64-bit address *)
                DEST := temp[0:31]; (* 16-bit address *)

          FI;

   ELSE IF OperandSize = 64 and AddressSize = 64

          THEN
                DEST := EffectiveAddress(SRC); (* 64-bit address *)

          FI;
FI;
```

## 受影响的旗帜

None.
