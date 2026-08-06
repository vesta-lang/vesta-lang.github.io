---
summary: 扫描字符串
---

## 说明

在非64位模式和默认的64位模式中: 本指令将使用 内存操作数 指定的字节,单词,双词或四词与 AL,AX 或 EAX 中的值进行比较. 随后它将状态标志设置在EFLAGS记录结果. 内存操作数地址从ES:(E)DI寄存器读取(取决于指令的地址大小属性和当前运行模式). 请注意, ES 无法被段覆盖前缀所覆盖 。

在编组码级别上,允许有两种形式的本指令. 显式-操作数形式和无显式-操作数形式. 显式-操作数形式(使用SCAS mnemonic指定)允许一个内存操作数明确指定. 内存操作数必须是表示操作数值大小和位置的符号. 然后自动选择寄存器操作数,以匹配内存操作数的大小(AL寄存器用于字节比较,AX用于字节比较,EAX用于双词比较). 提供了明确的操作数表格,以允许文件。 请注意,该表格提供的文件可能具有误导性。 也就是说,内存操作数符号必须指定操作数的正确类型(大小)(字节,单词,或双词),但不必指定正确的位置. 位置总是由ES:(E)DI指定.

指令的无操作数形式使用SCAS的简称. 同样,ES:(E)DI被假定为内存操作数和AL,AX,或EAX被假定为寄存器操作数. 操作数的大小由元音选择: SCASB(字形比较),SCASW(字形比较),或SCASD(双字比较).

比较后,(E)DI寄存器根据EFLAGS寄存器中DF旗的设置自动递增或递减. 如果DF旗为0,则(E)DI登记册递增;如果DF旗为1,则(E)DI登记册递减. 收录器增减1个字节操作,2个字节操作,4个字节操作.

SCAS, SCASB, SCASW, SCASD,以及SCASQ可在REP块比较的前缀ECX字节,词,双字,或四字. 然而,这些指令往往会被用在LOOP构造中,在状态标志的设置基础上进行一些动作. 见"REP/REPE/REPZ/REPNE/REPNZ--重复弦动".

前缀"在本章中用于描述REP前缀.

在64位模式下,指令的默认地址大小为64位,32位地址大小使用前缀支持

67H (英语). 使用REX前缀,形式为REX.W,在双词操作数上促进操作到64位. 64位 nooperand mnemonic为SCASQ. 中国植物物种信息数据库. 内存操作数的地址在RDI或EDI中指定,而AL/AX/EAX/RAX可以作为寄存器操作数. 比较后,目的地登记册递增

或被当前操作数大小(取决于DF旗的值)降低. 参见本节开头的汇总图,用于编码数据和限制.

## 行动

```text
Non-64-bit Mode:
IF (Byte comparison)

    THEN
          temp := AL - SRC;
          SetStatusFlags(temp);
                THEN IF DF = 0
                      THEN (E)DI := (E)DI + 1;
                      ELSE (E)DI := (E)DI  1; FI;

    ELSE IF (Word comparison)
          THEN
               temp := AX - SRC;
                SetStatusFlags(temp);
                IF DF = 0
                      THEN (E)DI := (E)DI + 2;
                      ELSE (E)DI := (E)DI  2; FI;
          FI;

    ELSE IF (Doubleword comparison)
          THEN
                temp := EAX  SRC;
                SetStatusFlags(temp);
                IF DF = 0
                      THEN (E)DI := (E)DI + 4;
                      ELSE (E)DI := (E)DI  4; FI;
          FI;

FI;

64-bit Mode:
IF (Byte comparison)

    THEN
          temp := AL - SRC;
          SetStatusFlags(temp);
                THEN IF DF = 0
                      THEN (R|E)DI := (R|E)DI + 1;
                      ELSE (R|E)DI := (R|E)DI  1; FI;

    ELSE IF (Word comparison)
          THEN
               temp := AX - SRC;
                SetStatusFlags(temp);
                IF DF = 0
                      THEN (R|E)DI := (R|E)DI + 2;
                      ELSE (R|E)DI := (R|E)DI  2; FI;
          FI;


    ELSE IF (Doubleword comparison)
          THEN
                temp := EAX  SRC;
                SetStatusFlags(temp);
                IF DF = 0
                      THEN (R|E)DI := (R|E)DI + 4;
                      ELSE (R|E)DI := (R|E)DI  4; FI;
          FI;

    ELSE IF (Quadword comparison using REX.W )
          THEN

             temp := RAX - SRC;

                SetStatusFlags(temp);
                IF DF = 0

                      THEN (R|E)DI := (R|E)DI + 8;
                      ELSE (R|E)DI := (R|E)DI  8;
                FI;
    FI;
FI;
```

## 受影响的旗帜

OF,SF,ZF,AF,PF,和CF旗根据比较的临时结果设置.
