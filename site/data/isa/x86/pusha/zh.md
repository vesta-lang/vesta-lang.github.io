---
summary: 推动全部 通用寄存器
---

## 说明

将 通用寄存器 的内容推到堆栈上。 登记册按以下顺序存放在堆栈上: EAX,ECX,EDX,EBX,ESP(原值),EBP,ESI,以及EDI(如果当前操作数的大小属性为32)和AX,CX,DX,BX,SP(原值),BP,SI,和DI(如果操作数的大小属性为16). 这些指令执行POPA/POPAD指令的反向操作. ESP或SP寄存器的推值是在推动第一个寄存器之前的值(见下文"操作"部分).

PUSHA(全部推)和PUSHAD(全部推双)mnemonics参考了相同的操作码. PUSHA指令用于操作数大小属性为16,PUSHAD指令用于运行大小属性为32时. 一些组装器在使用PUSHA时可能会将操作数大小强制至16,在使用PUSHAD时可能会强制至32. 其他人可能将这些mnemonics作为同义词(PUSHA/PUSHAD)处理,并使用操作数大小属性的当前设置来确定从堆栈中推出的值大小,而不管使用的mnemonic.

在实地址模式中,如果ESP或SP寄存器在PUSHA/PUSHAD执行时为1,3或5:生成#SS例外但未交付(所报告的堆栈错误阻止#SS交付). 接下来,处理器生成一个

```text
#DF exception and enters a shutdown state as described in the #DF discussion in Chapter 7 of the Intel(R) 64 and
```

IA-32 架构软件开发者手册,第3A卷.

此指令以兼容模式和遗留模式执行 。 在64位模式下无效 。

## 行动

```text
IF 64-bit Mode
    THEN #UD

FI;
IF OperandSize = 32 (* PUSHAD instruction *)

    THEN
          Temp := (ESP);
          Push(EAX);
          Push(ECX);
          Push(EDX);
          Push(EBX);
          Push(Temp);
          Push(EBP);
          Push(ESI);
          Push(EDI);

    ELSE (* OperandSize = 16, PUSHA instruction *)
          Temp := (SP);
          Push(AX);
          Push(CX);
          Push(DX);
          Push(BX);
          Push(Temp);


          Push(BP);
          Push(SI);
          Push(DI);
FI;
```

## 受影响的旗帜

None.
