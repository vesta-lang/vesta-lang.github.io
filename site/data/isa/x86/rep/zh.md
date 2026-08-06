---
summary: 重复字符串操作( 前缀)
---

## 说明

重复字符串指示计数器中指定的次数。 计数寄存器是CX,ECX,或RCX,视指令的地址大小而定. REP(repeat)mnemonic是一个前缀,可以添加到INS,OUTS,MOVS,LODS,以及STOS指令中.

REP前缀仅适用于一次一个字符串指令. 要重复一个指令块,请使用 LOOP 指令或其他循环构造. REP前缀导致相关指令被重复,直到寄存器中的计数降为0.

每个字符串指令都使用源地址,目的地地址,或者两者兼有. 源地址为DS:SI,DS:ESI,或DS:RSI,视指令地址大小而定;DS段可能被指令前缀所压倒. 目的地地址为ES:DI,ES:EDI,或ES:RDI,视指令的地址大小而定;ES段可能不会被覆盖. (注意,在64位模式中,CS,DS,ES,和SS部分的基址被作为零处理. )

同样,计数器的大小是指令的地址大小. 因此,64位模式的默认计数寄存器是RCX; REX.W对地址大小和计数寄存器没有影响. 如果使用 67H 来覆盖默认地址大小,则计数寄存器的大小也会被覆盖.

重复的字符串操作可以通过例外或中断中止. 当这种情况发生时,登记册状态得到保存,以便在从例外或中断处理器返回时恢复字符串操作。 源和目的注册点指要运行的下一个字符串元素,EIP注册点指字符串指令,ECX注册点在指令上次成功迭代后拥有的值. 这种机制允许长弦操作在不影响系统中断响应时间的情况下进行.

谨慎使用 REP INS 和 REP OUTS 指令. 并非所有 I/O 端口都能使用 句柄 执行这些指令的速度 。 注意REP STOS指令是快速初始化大块内存的方法.

REP INS可以在不写给内存位置的情况下从I/O端口读取,如果由于写出(如#PF)而发生例外或VM退出. 如果这有问题,例如因为I/O端口读取有副作用,软件应该确保写入内存位置不会引起例外或VM退出.

## 行动

```text
IF AddressSize = 16
  THEN
     Use CX for CountReg;
     Implicit Source/Dest operand for memory use of SI/DI;
  ELSE IF AddressSize = 64
     THEN Use RCX for CountReg;
     Implicit Source/Dest operand for memory use of RSI/RDI;
  ELSE
     Use ECX for CountReg;
     Implicit Source/Dest operand for memory use of ESI/EDI;

FI;
WHILE CountReg  0

    DO
          Service pending interrupts (if any);
          Execute associated string instruction;
          CountReg := (CountReg  1);

    OD;
```

## 受影响的旗帜

None.
