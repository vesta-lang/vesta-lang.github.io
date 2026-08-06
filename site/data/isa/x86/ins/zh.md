---
summary: 从端口输入字符串
---

## 说明

复制由 源操作数(第二操作数)指定的I/O端口到 目标操作数(第一操作数)的数据. 源操作数是一个I/O端口地址(从0到65,535),从DX寄存器读取. 目标操作数是一个内存位置,其地址从ES:DI,ES:EDI或RDI登记册中读取(取决于指令的地址大小属性,分别为16,32或64). (ES段不能被一个段覆盖前缀所覆盖. ) 正在访问的I/O端口的大小(即源和目标操作数的大小)是由一个8位I/O端口的操作码或由16位或32位I/O端口的指令的操作数大小属性决定的.

在组装码级别上,允许此指令的两种形式:"explient-操作数"形式和"nooperands"形式. 显式-操作数形式(与INS mnemonic一起指定)允许源和目标操作数明确指定. 在这里,源操作数必须是"DX",目标操作数应该是表示I/O端口大小和目的地地址的符号. 提供这种明确的操作数表格是为了提供文件;然而,请注意,这种表格所提供的文件可能具有误导性。 也就是说,目标操作数符号必须指定操作数的正确类型(大小)(字节,单词,或双词),但不必指定正确的位置. 位置总是由 ES:(E)DI 注册符指定,在 INS 指令执行前必须正确加载.

No-操作数格式提供了INS指令的字节,单词和双词版本的"短表". 这里还有DX被处理器假设为源操作数,ES:(E)DI被假设为目标操作数. I/O端口的大小在选择元音时指定: INSB(字节),INSW(字节),或INSD(双词).

在字节,单词,或双词从I/O端口转移到内存位置之后,DI/EDI/RDI的寄存器根据EFLAGS寄存器中DF旗的设置自动递增或递减. (如果DF旗为0,则(E)DI寄存器递增;如果(E)DI寄存器为1,则(E)DI寄存器递减. ) (E)DI寄存器递增或递减1个字节操作,2个字节操作,4个字节操作.

INS,INSB,INSW,和INSD 指令前可以使用REP的前缀,用于块输入ECX字节,单词,或双词. 参见Intel(R)64和IA-32架构软件开发者手册第2B卷中的"REP/REPE/REPZ/REPNE/REPNZ--Repeat字符串操作前缀"第4章中的REP前缀描述.

这些指令仅用于访问位于处理器I/O地址空间的I/O端口. 有关访问I/O地址空间I/O端口的更多信息,见Intel(R)64和IA-32 Architecture Software开发者手册第1卷第20章"输入/输出".

在64位模式下,默认地址大小为64位,32位地址大小使用前缀67H支持. 内存目的地的地址由RDI或EDI指定. 16位地址大小不支持64位模式. 操作数大小没有晋级.

如果由于写入而出现例外或VM退出,这些指令可以从 I/O 端口读取,而不写到 内存位置 (例如. #PF) (英语). 如果这有问题,例如因为I/O端口读取有副作用,软件应该确保写入内存位置不会引起例外或VM退出.

## 行动

```text
IF ((PE = 1) and ((CPL > IOPL) or (VM = 1)))

    THEN (* Protected mode with CPL > IOPL or virtual-8086 mode *)

        IF (Any I/O Permission Bit for I/O port being accessed = 1)

                THEN (* I/O operation is not allowed *)
                      #GP(0);

                ELSE (* I/O operation is allowed *)
                      DEST := SRC; (* Read from I/O port *)

          FI;
    ELSE (Real Mode or Protected Mode with CPL IOPL *)

          DEST := SRC; (* Read from I/O port *)
FI;

Non-64-bit Mode:

IF (Byte transfer)

   THEN IF DF = 0

          THEN (E)DI := (E)DI + 1;
          ELSE (E)DI := (E)DI  1; FI;
    ELSE IF (Word transfer)

        THEN IF DF = 0

                THEN (E)DI := (E)DI + 2;
                ELSE (E)DI := (E)DI  2; FI;
          ELSE (* Doubleword transfer *)

             THEN IF DF = 0

                      THEN (E)DI := (E)DI + 4;
                      ELSE (E)DI := (E)DI  4; FI;
          FI;
FI;

FI64-bit Mode:

IF (Byte transfer)

   THEN IF DF = 0

          THEN (E|R)DI := (E|R)DI + 1;
          ELSE (E|R)DI := (E|R)DI  1; FI;
    ELSE IF (Word transfer)

        THEN IF DF = 0

                THEN (E)DI := (E)DI + 2;
                ELSE (E)DI := (E)DI  2; FI;
          ELSE (* Doubleword transfer *)

             THEN IF DF = 0

                      THEN (E|R)DI := (E|R)DI + 4;


                ELSE (E|R)DI := (E|R)DI  4; FI;

          FI;
FI;
```

## 受影响的旗帜

None.
