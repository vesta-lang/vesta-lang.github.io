---
summary: 装入字符串
---

## 说明

从源操作数装入一个字节,单词,或双词,分别装入AL,AX,或EAX的寄存器. 源操作数是一个内存位置,其地址从DS:ESI或DS:SI注册处读取(取决于指令的地址大小属性,分别为32或16). DS段可能会被覆盖,并带有一个段覆盖前缀.

在组装码级别上,允许此指令的两种形式:"explient-操作数"形式和"nooperands"形式. 明文的-操作数形式(与LODS mnemonic一起指定)允许明确指定源操作数. 在这里,源操作数应该是一个表示源值大小和位置的符号. 然后自动选择目标操作数来匹配源操作数的大小(字节操作数的AL注册,字节操作数的AX,双字节操作数的EAX). 提供这种明确的操作数表格是为了提供文件;然而,请注意,这种表格所提供的文件可能具有误导性。 也就是说,源操作数符号必须指定操作数的正确类型(大小)(字节,单词,或双词),但不必指定正确的位置. 位置总是由DS:(E)SI登记器指定,在执行负载字符串指令前必须正确加载.

No-操作数格式提供了LODS指令的字节,单词和双词版本的"短表". 这里还假定DS:(E)SI为源操作数,而AL,AX,或EAX登记册为目标操作数. 源和 目标操作数 的大小以元音选择 : LODSB(字节装入寄存器 AL),LODSW(字节装入AX),或LODSD(双字装入EAX).

在字节,单词,或双词从内存位置转到AL,AX,或EAX注册后,(E)SI注册会根据EFLAGS注册中DF旗的设置自动递增或递减. (如果DF旗为0,则(E)SI登记册递增;如果DF旗为1,则ESI登记册递减. ) (E)SI登记册递增或递减1个字节操作,2个字节操作,4个字节操作.

在64位模式中,使用REX.W前缀将操作提升到64位. LODS/LODSQ在地址(R)SI上将四字装入RAX. 然后(R)SI寄存器根据EFLAGS寄存器中DF旗的设置自动递增或递减.

LODS,LODSB,LODSW,和LODSD 指令前可以使用REP 前缀,用于块负载的ECX字节,单词,或双词. 然而,更多时候,这些指令是在LOOP构造内使用的,因为通常需要在进行下一次传输之前进一步处理移入登记册的数据。 参见Intel(R)64和IA-32架构软件开发者手册第2B卷中的"REP/REPE/REPZ/REPNE/REPNZ--Repeat字符串操作前缀"第4章中的REP前缀描述.

## 行动

```text
IF AL := SRC; (* Byte load *)
    THEN AL := SRC; (* Byte load *)

        IF DF = 0

                THEN (E)SI := (E)SI + 1;
                ELSE (E)SI := (E)SI  1;
          FI;
ELSE IF AX := SRC; (* Word load *)

   THEN IF DF = 0

                THEN (E)SI := (E)SI + 2;
                ELSE (E)SI := (E)SI  2;
          IF;
    FI;
ELSE IF EAX := SRC; (* Doubleword load *)

   THEN IF DF = 0

                THEN (E)SI := (E)SI + 4;
                ELSE (E)SI := (E)SI  4;
          FI;
    FI;
ELSE IF RAX := SRC; (* Quadword load *)

   THEN IF DF = 0

                THEN (R)SI := (R)SI + 8;
                ELSE (R)SI := (R)SI  8;
          FI;
    FI;
FI;
```

## 受影响的旗帜

None.
