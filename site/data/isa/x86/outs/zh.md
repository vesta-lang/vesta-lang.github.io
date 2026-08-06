---
summary: 输出字符串到端口
---

## 说明

复制数据从源操作数(第二个操作数)到用目标操作数(第一个操作数)指定的I/O端口. 源操作数是一个内存位置,其地址从DS:SI,DS:ESI或RSI登记册中读取(取决于指令的地址大小属性,分别为16,32或64). (DS段可能会被覆盖,并带有一个段覆盖前缀. ) 目标操作数是一个从DX寄存器读取的I/O端口地址(从0到65,535). 正在访问的I/O端口的大小(即源和目标操作数的大小)是由一个8位I/O端口的操作码或一个16位或32位I/O端口的指令的操作数大小属性决定的.

在组装码级别上,允许此指令的两种形式:"explient-操作数"形式和"nooperands"形式. 显式-操作数形式(与OUTS mnemonic一起指定)允许源和目标操作数明确指定. 在这里,源操作数应该是表示I/O端口和源地址大小的符号,目标操作数必须是DX. 提供这种明确的操作数表格是为了提供文件;然而,请注意,这种表格所提供的文件可能具有误导性。 也就是说,源操作数符号必须指定操作数的正确类型(大小)(字节,单词,或双词),但不必指定正确的位置. 位置总是由DS:(E)SI或RSI的登记器指定,在执行OUTS指令前必须正确加载.

No-操作数格式提供了OUTS指令的字节,单词和双词版本的"短表". 这里还有DS:(E)SI被假定为源操作数,DX被假定为目标操作数. I/O端口的大小在选择元音时指定: OUTSB(字节),OUTSW(字节),或OUTSD(双词).

在字节,单词,或双词从内存位置转到I/O端口后,SI/ESI/RSI寄存器会根据EFLAGS寄存器中DF旗的设置自动递增或递减. (如果DF旗为0,则(E)SI寄存器递增;如果DF寄存器旗为1,则SI/ESI/RSI寄存器递减. ) SI/ESI/RSI寄存器递增或递减1为字节操作,2为单词操作,4为双词操作.

OUTS,OUTSB,OUTSW,和OUTSD 指令前可以使用REP的前缀,用于块输入ECX字节,单词,或双词. 见"REP/REPE/REPZ/REPNE/REPNZ--重复字符串操作前缀"在此.

用于描述 REP 前缀的章节。 此指令仅用于访问位于处理器I/O地址空间的I/O端口. 有关访问I/O地址空间I/O端口的更多信息,见Intel(R)64和IA-32 Architecture Software开发者手册第1卷第20章"输入/输出".

在64位模式中,默认的操作数大小为32位;操作数大小不通过使用REX.W来推广. 在64位模式中,默认地址大小为64位,默认使用RSI指定64位地址. 使用ESI的32位地址是使用前缀67H支持的,但16位地址不支持64位模式.

## IA-32 架构兼容性

在执行了OUTS,OUTSB,OUTSW,或OUTSD指令后,Pentium处理器确保EWBE# pin在开始执行下一个指令前已经被采样. (注意,如果EWBE#不活动,则指令可以预设,但直到EWBE# pin被采样为活性. ) 只有Pentium处理器家族有EWBE# pin.

对于Pentium 4,Intel(R)Xeon(R),以及P6处理器家族,在OUTS,OUTSB,OUTSW,或OUTSD指令执行时,处理器在交易的数据阶段完成之前不会执行下一个指令.

## 行动

```text
IF ((PE = 1) and ((CPL > IOPL) or (VM = 1)))
    THEN (* Protected mode with CPL > IOPL or virtual-8086 mode *)
         IF (Any I/O Permission Bit for I/O port being accessed = 1)
                THEN (* I/O operation is not allowed *)
                      #GP(0);
                ELSE (* I/O operation is allowed *)
                      DEST := SRC; (* Writes to I/O port *)
          FI;
    ELSE (Real Mode or Protected Mode or 64-Bit Mode with CPL  IOPL *)
          DEST := SRC; (* Writes to I/O port *)

FI;

Byte transfer:
    IF 64-bit mode
          Then
                IF 64-Bit Address Size
                      THEN
                          IF DF = 0
                                  THEN RSI := RSI RSI + 1;
                                  ELSE RSI := RSI or  1;
                            FI;
                      ELSE (* 32-Bit Address Size *)
                          IF DF = 0
                                  THEN ESI := ESI + 1;
                                  ELSE ESI := ESI  1;
                            FI;
                FI;
          ELSE
               IF DF = 0
                      THEN (E)SI := (E)SI + 1;
                      ELSE (E)SI := (E)SI  1;
                FI;
    FI;

Word transfer:
    IF 64-bit mode
          Then
                IF 64-Bit Address Size


                      THEN
                          IF DF = 0
                                  THEN RSI := RSI RSI + 2;
                                  ELSE RSI := RSI or  2;

                            FI;

                      ELSE (* 32-Bit Address Size *)
                          IF DF = 0
                                  THEN ESI := ESI + 2;
                                  ELSE ESI := ESI  2;

                            FI;

                FI;

          ELSE
               IF DF = 0
                      THEN (E)SI := (E)SI + 2;
                      ELSE (E)SI := (E)SI  2;

                FI;

    FI;

Doubleword transfer:

    IF 64-bit mode

          Then

                IF 64-Bit Address Size

                      THEN
                          IF DF = 0
                                  THEN RSI := RSI RSI + 4;
                                  ELSE RSI := RSI or  4;

                            FI;

                      ELSE (* 32-Bit Address Size *)
                          IF DF = 0
                                  THEN ESI := ESI + 4;
                                  ELSE ESI := ESI  4;

                            FI;

                FI;

          ELSE
               IF DF = 0
                      THEN (E)SI := (E)SI + 4;
                      ELSE (E)SI := (E)SI  4;

                FI;

    FI;
```

## 受影响的旗帜

None.
