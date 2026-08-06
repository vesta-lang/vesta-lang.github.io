---
summary: 弹出全部 通用寄存器
---

## 说明

流行双词(POPAD)或单词(POPA)从堆栈进入通用寄存器. 登记册按下列顺序装入: EDI,ESI,EBP,EBX,EDX,ECX,以及EAX(如果操作数的大小属性为32)和DI,SI,BP,BX,DX,CX,AX(如果操作数的大小属性为16). (这些指令推翻了 PUSHA/PUSHAD 指令的操作. ) ESP 或 SP 寄存器的堆栈值被忽略. 相反,ESP或SP寄存器在装入每个寄存器后进行递增.

POPA(pop all)和POPAD(pop all double)的mnemonics参考了相同的操作码. POPA指令用于操作数大小属性为16,POPAD指令用于操作数大小属性为32时. 一些组装器在使用POPA时可能会将操作数大小强制至16,在使用POPAD时可能会强制至32(必要时使用操作数-大小的超前缀[66H]). 其他人可能将这些mnemonics作为同义词(POPA/POPAD)处理,并使用操作数大小属性的当前设置来确定从堆栈中弹出值的大小,而不管所使用的mnemonic. (当前代码片段的片段描述符中的D旗决定了操作数大小属性.

此指令以非64位模式描述的方式执行 。 在64位模式下无效 。

## 行动

```text
IF 64-Bit Mode
    THEN
          #UD;

ELSE
    IF OperandSize = 32 (* Instruction = POPAD *)
    THEN
          EDI := Pop();
          ESI := Pop();
          EBP := Pop();
          Increment ESP by 4; (* Skip next 4 bytes of stack *)
          EBX := Pop();
          EDX := Pop();
          ECX := Pop();
          EAX := Pop();
    ELSE (* OperandSize = 16, instruction = POPA *)
          DI := Pop();
          SI := Pop();
          BP := Pop();
          Increment ESP by 2; (* Skip next 2 bytes of stack *)
          BX := Pop();
          DX := Pop();
          CX := Pop();
          AX := Pop();
    FI;

FI;
```

## 受影响的旗帜

None.
