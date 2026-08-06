---
summary: 将单词转换为双词/ 将双词转换为四词
---

## 说明

将注册AX,EAX,或RAX(取决于操作数大小)中的操作数的大小翻一番,通过签号扩展方式将结果存储在注册DX:AX,EDX:EAX,或RDX:RAX中分别. CWD指令将AX寄存器中值的符号(bit 15)复制到DX寄存器中的每一个位位. CDQ指令将EAX寄存器中值的符号(bit 31)复制到EDX寄存器中的每一位位置. CQO指令(只有64位模式)将RAX寄存器中值的符号(bit 63)复制到RDX寄存器中的每一个位位.

CWD指令可用于从单词分割前的单词产生双词红利. CDQ指令可用于从双字分割前的双字产生四字红利. CQO指令可用于在四字分割前从四字产生双四字红利.

CWD和CDQ mnemonics参考了相同的操作码. CWD指令用于操作数大小属性为16,CDQ指令用于操作数大小属性为32时. 一些组装器在使用CWD时可能会将操作数大小强制至16,在使用CDQ时可能会强制至32. 另一些则可能将这些mnemonics作为同义词(CWD/CDQ)处理,并使用操作数大小属性的当前设置来决定要转换的值大小,而不管所使用的mnemonic.

在64位模式中,使用REX.W前缀将操作提升到64位. CQO mnemonics将同样的操作码与CWD/CDQ参照. 参见本节开头的汇总图,用于编码数据和限制.

## 行动

```text
IF OperandSize = 16 (* CWD instruction *)

    THEN
          DX := SignExtend(AX);

   ELSE IF OperandSize = 32 (* CDQ instruction *)

          EDX := SignExtend(EAX); FI;
    ELSE IF 64-Bit Mode and OperandSize = 64 (* CQO instruction*)

          RDX := SignExtend(RAX); FI;
FI;
```

## 受影响的旗帜

None.
