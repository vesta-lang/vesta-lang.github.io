---
summary: 数据从字符串移动到字符串
---

## 说明

将第二个 操作数(源操作数)指定的字节,单词或双词移动到第一个 操作数(目标操作数)指定的位置. 来源和目标操作数都位于内存中. 源操作数的地址从DS:ESI或DS:SI注册处读取(取决于指令的地址大小属性,分别为32或16). 目标操作数的地址从ES:EDI或ES:DI注册处读取(同样取决于指令的地址大小属性). DS段可能会被一个段覆盖前缀所覆盖,但ES段不能被覆盖.

在组装码级别上,允许此指令的两种形式:"explient-操作数"形式和"nooperands"形式. 显式-操作数形式(与MOVS mnemonic一起指定)允许源和目标操作数明确指定. 在这里,源和目标操作数应该分别是表示源值大小和位置以及目的地的符号. 提供这种明确的操作数表格是为了提供文件;然而,请注意,这种表格所提供的文件可能具有误导性。 也就是说,源和目标操作数符号必须指定操作数的正确类型(大小)(字节,单词,或双词),但它们不必指定正确的位置. 源和目标操作数的位置总是由DS:(E)SI和ES:(E)DI登记器指定,在执行移动字符串指令前必须正确加载.

No-操作数格式提供了MOVS指令的字节,单词和双词版本的"短表". 这里还假定DS:(E)SI和ES:(E)DI分别是来源和目标操作数. 源和 目标操作数 的大小以元音选择 : MOVSB(字节移动),MOVSW(字节移动),或MOVSD(双字移动).

移动操作后,(E)SI和(E)DI登记册根据EFLAGS登记册中DF旗的设置自动递增或递减. (如果DF旗为0,则(E)SI和(E)DI注册是英寸 -

mended;如果DF旗为1,则(E)SI和(E)DI注册减少. )注册增加或减少1个字节操作,2个字节操作,4个字节操作.

NOTE

为了提高性能,较近期的处理器支持在MOVS和MOVSB启动的字符串存储操作中修改处理器的操作. 见Intel(R)64和IA-32 Architectures软件开发者手册第1卷第7.3.9.3节关于快弦操作的更多信息.

该MOVS, MOVSB, MOVSW,以及MOVSD指示前可添加REP前缀( 见 "REP/REPE/REPZ /REPNE/REPNZ用于描述REP前缀)用于块移动ECX字节,单词,或双词.

在64位模式下,指令的默认地址大小为64位,32位地址大小使用前缀67H支持. 64位地址由RSI和RDI指定;32位地址由ESI和EDI指定. 使用REX.W前缀将双字操作推广到64位. 参见本节开头的汇总图,用于编码数据和限制.

## 行动

```text
DEST := SRC;
Non-64-bit Mode:
IF (Byte move)

   THEN IF DF = 0

          THEN
                (E)SI := (E)SI + 1;
                (E)DI := (E)DI + 1;

          ELSE
                (E)SI := (E)SI  1;
                (E)DI := (E)DI  1;

          FI;
    ELSE IF (Word move)

        THEN IF DF = 0

                (E)SI := (E)SI + 2;
                (E)DI := (E)DI + 2;
                FI;
          ELSE
                (E)SI := (E)SI  2;
                (E)DI := (E)DI  2;
          FI;
    ELSE IF (Doubleword move)

        THEN IF DF = 0

                (E)SI := (E)SI + 4;
                (E)DI := (E)DI + 4;
                FI;
          ELSE
                (E)SI := (E)SI  4;
                (E)DI := (E)DI  4;
          FI;
FI;
64-bit Mode:
IF (Byte move)

   THEN IF DF = 0

          THEN
                (R|E)SI := (R|E)SI + 1;
                (R|E)DI := (R|E)DI + 1;


          ELSE
                (R|E)SI := (R|E)SI  1;
                (R|E)DI := (R|E)DI  1;

          FI;
    ELSE IF (Word move)

        THEN IF DF = 0

                (R|E)SI := (R|E)SI + 2;
                (R|E)DI := (R|E)DI + 2;
                FI;
          ELSE
                (R|E)SI := (R|E)SI  2;
                (R|E)DI := (R|E)DI  2;
          FI;
    ELSE IF (Doubleword move)

        THEN IF DF = 0

                (R|E)SI := (R|E)SI + 4;
                (R|E)DI := (R|E)DI + 4;
                FI;
          ELSE
                (R|E)SI := (R|E)SI  4;
                (R|E)DI := (R|E)DI  4;
          FI;
    ELSE IF (Quadword move)

        THEN IF DF = 0

                (R|E)SI := (R|E)SI + 8;
                (R|E)DI := (R|E)DI + 8;
                FI;
          ELSE
                (R|E)SI := (R|E)SI  8;
                (R|E)DI := (R|E)DI  8;
          FI;
FI;
```

## 受影响的旗帜

None.
