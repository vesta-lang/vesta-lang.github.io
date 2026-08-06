---
summary: ASCII 区分前调整 AX
---

## 说明

调整两个未拆分的 BCD 位数(在 AL 寄存器中最小的位数和在 AH 寄存器中最显著的位数),这样在结果上进行的分割操作将产生正确的未拆分的 BCD 值. AAD指令只有在一个DIV指令之前有用,该指令将AX寄存器中的调整值(二进制除法)除以一个解开的BCD值.

AAD指令将AL寄存器中的值设定为(AL + 10) * AH)),然后将AH注册符清除为00H. AX 寄存器中的值随后等于登记器 AH 和 AL 中原未拆卸的两位数(第10基数)的二进制等值.

本指令的通用版本允许调整任意数字基数(见下文"操作"部分)的两个无包装的位数,方法是将imm8字节设置到选定的数字基数(例如八进制的08H,十进制的0AH,或十二进制的0CH). AAD mnemonic被所有组装器解释为指调整ASCII(基础10)值. 要在另一个数字基数中调整值,指令必须在机器代码(D5 imm8)中进行手编码.

此指令以兼容模式和遗留模式执行 。 在64位模式下无效 。

## 行动

```text
IF 64-Bit Mode
    THEN
          #UD;
    ELSE
          tempAL := AL;
          tempAH := AH;
          AL := (tempAL + (tempAH  imm8)) AND FFH;
          (* imm8 is set to 0AH for the AAD mnemonic.*)
          AH := 0;

FI;
The immediate value (imm8) is taken from the second byte of the instruction.
```

## 受影响的旗帜

SF,ZF,和PF的旗帜按照AL登记册中产生的二进制值设置;OF,AF,和CF的旗帜没有定义.
