---
summary: 比较字符串 操作数
---

## 说明

将字节,单词,双词,或四字与指定的第一源操作数与字节,单词,双词,或四字与指定的第二源操作数进行对比,并根据结果在EFLAGS登记册中设置状态标志.

源操作数都位于记忆中. 第一源操作数的地址从DS:SI,DS:ESI或RSI读取(取决于指令的地址大小属性分别为16,32或64). 第二源操作数的地址从ES:DI,ES:EDI或RDI读取(同样取决于指令的地址大小属性为16,32或64). DS段可能会被一个段覆盖前缀所覆盖,但ES段不能被覆盖.

在组装码级别上,允许此指令的两种形式:"explient-操作数"形式和"nooperands"形式. 显式-操作数形式(与CMPS mnemonic一起指定)允许明确指定两个源操作数. 在这里,源操作数应该是表示源值大小和位置的符号. 提供了这种明确的操作数表格,以便提供文件。 然而,请注意,该表格提供的文件可能具有误导性。 也就是说,源操作数符号必须指定操作数的正确类型(大小)(字节,单词,或双字,四字),但它们不必指定正确的loca-

腾讯网. 源操作数的位置总是由DS:(E)SI(或RSI)和ES:(E)DI(或RDI)的登记册指定,在执行比较字符串指令前必须正确加载.

No-操作数格式提供了CMPS指令的字节,单词和双词版本的"短表". 这里还有DS:(E)SI(或RSI)和ES:(E)DI(或RDI)登记册由处理器承担,以指定源操作数的位置. 源操作数 的大小选择为元音 : CMPSB(字形比较),CMPSW(字形比较),CMPSD(双字比较),或CMPSQ(使用REX.W进行四字比较).

比较后,(E/R)SI和(E/R)DI根据EFLAGS登记册中DF旗的设置自动登记增量或减量. (如果DF旗为0,则(E/R)SI和(E/R)DI注册增量;如果DF旗为1,则注册减量. ) 字节操作的注册增量或减量为1,字节操作增量为2,双字操作增量为4. 如果操作数大小为64,则RSI和RDI在四字操作中登记增量8.

CMPS,CMPSB,CMPSW,CMPSD,和CMPSQ指令的前缀可以使用REP前缀进行块比较. 然而,这些指令会更经常地用于LOOP构造中,在进行下一次比较之前,根据状态标志的设置进行一些动作. 参见Intel(R)64和IA-32架构软件开发者手册第2B卷中的"REP/REPE/REPZ/REPNE/REPNZ--Repeat字符串操作前缀"第4章中的REP前缀描述.

在64位模式下,指令的默认地址大小为64位,32位地址大小使用前缀67H支持. 使用REX.W前缀将双字操作推广到64位(参见CMPSQ). 参见本节开头的汇总图,用于编码数据和限制.

## 行动

```text
temp := SRC1 - SRC2;
SetStatusFlags(temp);

IF (64-Bit Mode)
    THEN
          IF (Byte comparison)

        THEN IF DF = 0

                THEN
                      (R|E)SI := (R|E)SI + 1;
                      (R|E)DI := (R|E)DI + 1;

                ELSE
                      (R|E)SI := (R|E)SI  1;
                      (R|E)DI := (R|E)DI  1;

                FI;
          ELSE IF (Word comparison)

             THEN IF DF = 0

                      THEN
                            (R|E)SI := (R|E)SI + 2;
                            (R|E)DI := (R|E)DI + 2;

                      ELSE
                            (R|E)SI := (R|E)SI  2;
                            (R|E)DI := (R|E)DI  2;

                      FI;
          ELSE IF (Doubleword comparison)

             THEN IF DF = 0

                      THEN
                            (R|E)SI := (R|E)SI + 4;
                            (R|E)DI := (R|E)DI + 4;

                      ELSE
                            (R|E)SI := (R|E)SI  4;
                            (R|E)DI := (R|E)DI  4;

                      FI;


          ELSE (* Quadword comparison *)

             THEN IF DF = 0

                      (R|E)SI := (R|E)SI + 8;
                      (R|E)DI := (R|E)DI + 8;
                ELSE
                      (R|E)SI := (R|E)SI  8;
                      (R|E)DI := (R|E)DI  8;
                FI;
          FI;
    ELSE (* Non-64-bit Mode *)
          IF (byte comparison)

        THEN IF DF = 0

                THEN
                      (E)SI := (E)SI + 1;
                      (E)DI := (E)DI + 1;

                ELSE
                      (E)SI := (E)SI  1;
                      (E)DI := (E)DI  1;

                FI;
          ELSE IF (Word comparison)

             THEN IF DF = 0

                      (E)SI := (E)SI + 2;
                      (E)DI := (E)DI + 2;
                ELSE
                      (E)SI := (E)SI  2;
                      (E)DI := (E)DI  2;
                FI;
          ELSE (* Doubleword comparison *)

             THEN IF DF = 0

                      (E)SI := (E)SI + 4;
                      (E)DI := (E)DI + 4;
                ELSE
                      (E)SI := (E)SI  4;
                      (E)DI := (E)DI  4;
                FI;
          FI;
FI;
```

## 受影响的旗帜

CF,OF,SF,ZF,AF,和PF的旗帜根据比较的临时结果设置.
