---
summary: ASCII 在乘法后调整 AX
---

## 说明

调整两个未拆卸的 BCD 值的乘法结果,以创建一对未拆卸的 (第 10 个基数) BCD 值. AX 寄存器是此指令的隐含源和 目标操作数 。 AAM指令只有在遵循MUL指令时才有用,该指令将两个解开的BCD值(二进制乘法)相乘,并在AX寄存器中存储一个单词结果. AAM指令随后调整了AX寄存器的内容,以包含正确的2位无包装(第10基)BCD结果.

本指令的通用版本允许调整AX的内容,以创建任意数字基数的两个无包装数字(见下文"操作"部分). 在此,imm8字节设置为选定的数字基数(例如八进制的08H,十进制的0AH,或十二进制的0CH). AAM mnemonic被所有组装器解释为指调整到ASCII(基础10)值. 要适应另一个数字基中的值,指令必须在机器代码(D4 imm8)中进行手编码.

此指令以兼容模式和遗留模式执行 。 在64位模式下无效 。

## 行动

```text
IF 64-Bit Mode
    THEN
          #UD;
    ELSE
          tempAL := AL;
          AH := tempAL / imm8; (* imm8 is set to 0AH for the AAM mnemonic *)
          AL := tempAL MOD imm8;

FI;

The immediate value (imm8) is taken from the second byte of the instruction.
```

## 受影响的旗帜

SF,ZF,和PF旗按照AL登记册中产生的二进制值设置. OF, AF,和CF旗没有定义.
