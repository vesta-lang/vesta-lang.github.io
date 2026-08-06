---
summary: 重复字符串操作而不为零( 前缀)
---

## 说明

重复字符串指示计数器中指定的次数,或直到ZF旗设定为止。 计数寄存器是CX,ECX,或RCX,视指令的地址大小而定. REPNE(不相等时重复)和REPNZ(不等于零时重复)mnemonics是前缀,可以添加到CMPS和SCAS指令中. (REPNZ前缀是REPNE前缀的同义词形式.

REPNE/REPNZ前缀仅适用于一次一个字符串指令. 要重复一个指令块,请使用 LOOP 指令或其他循环构造. 这些重复前缀导致相关指令被重复,直到寄存器中的计数降为0.

REPNE/REPNZ前缀也检查每次迭代后的ZF旗状态,如果ZF旗被设定,则终止重复循环. 当测试两种终止条件时,重复终止的原因可以通过使用JECXZ指令测试计数器或者测试ZF旗(使用JZ,JNZ,或JNE指令)来确定.

CMPS和SCAS每次执行后才检查,这些指令根据它们所作的比较结果更新了ZF旗,因此不需要初始化.

每个字符串指令都使用一个或两个源地址. 第一个源地址是DS:SI,DS:ESI,或DS:RSI,取决于指令的地址大小;DS段可能被指令前缀所压倒. 第二个源地址是ES:DI,ES:EDI,或ES:RDI,取决于指令的地址大小;ES段可能不会被覆盖. (注意,在64位模式中,CS,DS,ES,和SS部分的基址被作为零处理. )

同样,计数器的大小是指令的地址大小. 因此,64位模式的默认计数寄存器是RCX; REX.W对地址大小和计数寄存器没有影响. 如果使用 67H 来覆盖默认地址大小,则计数寄存器的大小也会被覆盖.

重复的字符串操作可以通过例外或中断中止. 当这种情况发生时,登记册状态得到保存,以便在从例外或中断处理器返回时恢复字符串操作。 源和目的注册点指要运行的下一个字符串元素,EIP注册点指字符串指令,ECX注册点在指令上次成功迭代后拥有的值. 这种机制允许长弦操作在不影响系统中断响应时间的情况下进行.

当在CMPS或SCAS指令执行过程中发生有REPNE或REPNZ前缀的过失时,在指令执行前,EFLAGS值恢复到状态. 由于SCAS和CMPS指令不使用EFLAGS作为输入,处理器可以在页面错误处理器后恢复指令.

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
          IF CountReg = 0
                THEN exit WHILE loop; FI;
          IF ZF = 1
                THEN exit WHILE loop; FI;

    OD;
```

## 受影响的旗帜

无;然而,CMPS和SCAS指令确实将状态标志设置在EFLAGS登记册中.
