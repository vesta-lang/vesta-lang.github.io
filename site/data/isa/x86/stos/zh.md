---
summary: 存储字符串
---

## 说明

在非64位和默认的64位模式中;将一个字节,单词,或双词从AL,AX,或EAX寄存器(分别)存储到目标操作数中. 目标操作数是一个内存位置,其地址从ES:EDI或ES:DI寄存器中读取(取决于指令的地址大小属性和操作模式). ES 段不能被一个段覆盖前缀所覆盖 。

在组装码层面,允许两种形式的指令:"explient-操作数"形式和"nooperands"形式. 明文的-操作数形式(与STOS mnemonic一起指定)允许明确指定目标操作数. 在这里,目标操作数应该是表示目的地值大小和位置的符号. 然后自动选择源操作数来匹配目标操作数的大小(字节操作数的AL注册,字节操作数的AX,双字节操作数的EAX). 提供了明确的操作数表格,以便提供文件;但请注意,该表格提供的文件可能具有误导性。 也就是说,目标操作数符号必须指定操作数的正确类型(大小)(字节,单词,或双词),但不必指定正确的位置. 该位置总是由ES:(E)DI注册系统指定. 在执行商店字符串指令之前, 必须正确加载这些 。

No-操作数形式提供了字节,单词,双词,以及STOS指令的四字版本的"短表". 这里还有ES:(E)DI被假定为目标操作数和AL,AX,或者EAX被假定为源操作数. 目的地和源操作数的大小由mnemonic选择: STOSB(字节读自寄存器 AL),STOSW(字节读自AX),STOSD(字节读自EAX).

在字节,单词,或双词从寄存器转移到内存位置之后,(E)DI寄存器会根据EFLAGS寄存器中DF旗的设置进行递增或递减. 如果DF旗为0,则递增寄存器;如果DF旗为1,则递减寄存器(对于字节操作,则递增或递减1,对于字节操作,则递减2,对于双字节操作,则递减4).

NOTE

为了提高性能,较近期的处理器支持在STOS和STOSB启动的字符串存储操作中修改处理器的操作. 见Intel(R)64和IA-32 Architectures软件开发者手册第1卷第7.3.9.3节关于快弦操作的更多信息.

在64位模式下,默认地址大小为64位,32位地址大小使用前缀67H支持. 使用REX前缀,形式为REX.W,在双词操作数上促进操作到64位. 推广的无操作数 mnemonic是STOSQ. STOSQ(及其明显的操作数变体)将 RAX 登记册中的四字存储到

目的地由RDI或EDI地址. 参见本节开头的汇总图,用于编码数据和限制.

STOS,STOSB,STOSW,STOSD,STOSQ的指令前可以使用REP的前缀,用于ECX字节的块存储,单词,或双词. 然而,这些指令更常在LOOP构造内使用,因为数据需要移动到AL,AX或EAX登记册中才能存储. 见"REP/REPE/REPZ".

/REPNE/REPNZ--Repeat字符串操作前缀"在本章中对REP前缀的描述.

## 行动

```text
Non-64-bit Mode:
IF (Byte store)

    THEN
          DEST := AL;
                THEN IF DF = 0
                      THEN (E)DI := (E)DI + 1;
                      ELSE (E)DI := (E)DI  1;
                FI;

    ELSE IF (Word store)
          THEN
                DEST := AX;
                      THEN IF DF = 0
                            THEN (E)DI := (E)DI + 2;
                            ELSE (E)DI := (E)DI  2;
                      FI;
          FI;

    ELSE IF (Doubleword store)
          THEN
                DEST := EAX;
                      THEN IF DF = 0
                            THEN (E)DI := (E)DI + 4;
                            ELSE (E)DI := (E)DI  4;
                      FI;
          FI;

FI;

64-bit Mode:
IF (Byte store)

    THEN
          DEST := AL;
                THEN IF DF = 0
                      THEN (R|E)DI := (R|E)DI + 1;
                      ELSE (R|E)DI := (R|E)DI  1;
                FI;

    ELSE IF (Word store)
          THEN
                DEST := AX;
                      THEN IF DF = 0
                            THEN (R|E)DI := (R|E)DI + 2;
                            ELSE (R|E)DI := (R|E)DI  2;
                      FI;
          FI;

    ELSE IF (Doubleword store)


          THEN
                DEST := EAX;
                      THEN IF DF = 0
                            THEN (R|E)DI := (R|E)DI + 4;
                            ELSE (R|E)DI := (R|E)DI  4;
                      FI;

          FI;
    ELSE IF (Quadword store using REX.W )

          THEN
                DEST := RAX;
                      THEN IF DF = 0
                            THEN (R|E)DI := (R|E)DI + 8;
                            ELSE (R|E)DI := (R|E)DI  8;
                      FI;

          FI;
FI;
```

## 受影响的旗帜

None.
