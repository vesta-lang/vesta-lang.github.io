---
summary: 将字节转换为字节/转换为双字节/转换为双字节
---

## 说明

通过标志扩展方式将源操作数的尺寸增加一倍. CBW(将字节转换为单词)指令将源操作数中的符号(bit 7)复制到AH登记册中的每一个位. CWDE(将单词转换成双词)指令将AX寄存器中单词的符号(bit 15)复制到EAX寄存器的高16位.

CBW和CWDE参考了相同的操作码. CBW指令用于操作数大小属性为16时; 2. CWDE是用于操作数大小属性为32时. 一些装配器可能强迫操作数大小. 其他可能将这两个mnemonics作为同义词(CBW/CWDE),并使用操作数大小属性的设置来确定要转换的值大小.

在64位模式中,默认操作大小是目的地寄存器的大小. 使用REX.W前缀可促进此指令(CDQE在推广时)在64位操作数上运行. 在这种情况下,CDQE将EAX登记册中双字的符号(bit 31)复制到RAX的高位32位.

## 行动

```text
IF OperandSize = 16 (* Instruction = CBW *)
    THEN
          AX := SignExtend(AL);
    ELSE IF (OperandSize = 32, Instruction = CWDE)
          EAX := SignExtend(AX); FI;
    ELSE (* 64-Bit Mode, OperandSize = 64, Instruction = CDQE*)
          RAX := SignExtend(EAX);

FI;
```

## 受影响的旗帜

None.
