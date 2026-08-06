---
summary: 旋转
---

## 说明

移动(旋转)第一个操作数(目标操作数)的位数,在第二个操作数(count 操作数)中指定的位数,并将结果存储为目标操作数. 目标操作数可以是寄存器或内存位置;计数操作数是无符号的整数,可以是CL寄存器中的即时值或值. 计数被遮掩到5位(如果在64位模式和REX.W=1).

旋转左侧(ROL)和旋转左侧(RCL)指令将所有位移到更显著的位移位置,除了最显著位移到最小位移位置. 旋转的右侧(ROR)和旋转的右侧(RCR)指令将所有位移到不太显著的位移位置,除了最小位,它被旋转到最显著的位移位置.

RCL和RCR指令将CF旗包含在旋转中. RCL指令将CF旗转换为最小位,并将最显著位转换为CF旗. RCR指令将CF旗转换为最显著位,将最小位转换为CF旗. 对于ROL和ROR指令,CF旗的原始值不是结果的一部分,但CF旗收到从一端转向另一端的位元副本.

OF旗只定义于1位旋转;它在其他所有情况下(RCL和RCR指令除外:一个零位旋转无所作为,即影响任何旗帜)都没有定义. 对于左旋,OF旗被设定为CF位(旋转后)和结果中最显著位的独占的OR. 对于右旋,OF旗被设定为结果的两个最显著位的独占的OR.

在64位模式中,使用REX前缀的形式为REX.R允许访问额外的注册(R8-R15). 使用REX.W将第一个操作数推广到64位,并导致计数操作数成为6位计数器.

## IA-32 架构兼容性

8086没有掩盖旋转计数. 然而,所有其他的IA-32处理器(从英特尔286处理器开始)确实将旋转计数遮掩到5位,结果最大计数为31位. 这种遮盖在所有操作模式(包括虚拟 8086 模式)中都做了,以减少指令的最大执行时间.

## 行动

```text
(* RCL and RCR Instructions *)
SIZE := OperandSize;
CASE (determine count) OF

    SIZE := 8: tempCOUNT := (COUNT AND 1FH) MOD 9;
    SIZE := 16: tempCOUNT := (COUNT AND 1FH) MOD 17;
    SIZE := 32: tempCOUNT := COUNT AND 1FH;
    SIZE := 64: tempCOUNT := COUNT AND 3FH;
ESAC;
IF OperandSize = 64
    THEN COUNTMASK = 3FH;
    ELSE COUNTMASK = 1FH;
FI;

(* RCL Instruction Operation *)
tempDEST := DEST;
WHILE (tempCOUNT  0)

    DO
          tempCF := MSB(tempDEST);
         tempDEST := (tempDEST  2) + CF;
          CF := tempCF;
          tempCOUNT := tempCOUNT  1;

    OD;
ELIHW;
IF (COUNT & COUNTMASK) = 1

    THEN OF := MSB(tempDEST) XOR CF;
    ELSE OF is undefined;
FI;
DEST := tempDEST;


(* RCR Instruction Operation *)
tempDEST := DEST;
IF (COUNT & COUNTMASK) = 1

    THEN OF := MSB(tempDEST) XOR CF;
    ELSE OF is undefined;
FI;
WHILE (tempCOUNT  0)
    DO

          tempCF := LSB(SRC);
          tempDEST := (tempDEST / 2) + (CF * 2SIZE);
          CF := tempCF;
          tempCOUNT := tempCOUNT  1;
    OD;
DEST := tempDEST;

(* ROL Instruction Operation *)
tempCOUNT := (COUNT & COUNTMASK) MOD SIZE
tempDEST := DEST;

WHILE (tempCOUNT  0)

    DO
          tempCF := MSB(tempDEST);
         tempDEST := (tempDEST  2) + tempCF;
          tempCOUNT := tempCOUNT  1;

    OD;
ELIHW;
IF (COUNT & COUNTMASK)  0

    THEN CF := LSB(tempDEST);
FI;
IF (COUNT & COUNTMASK) = 1

    THEN OF := MSB(tempDEST) XOR CF;
    ELSE OF is undefined;
FI;
DEST := tempDEST;

(* ROR Instruction Operation *)
tempCOUNT := (COUNT & COUNTMASK) MOD SIZE
tempDEST := DEST;

WHILE (tempCOUNT  0)

    DO
          tempCF := LSB(SRC);
         tempDEST := (tempDEST / 2) + (tempCF  2SIZE);
          tempCOUNT := tempCOUNT  1;

    OD;
ELIHW;
IF (COUNT & COUNTMASK)  0

    THEN CF := MSB(tempDEST);
FI;
IF (COUNT & COUNTMASK) = 1

    THEN OF := MSB(tempDEST) XOR MSB - 1(tempDEST);
    ELSE OF is undefined;
FI;
DEST := tempDEST;
```

## 受影响的旗帜

对于RCL和RCR指令,零位旋转无所作为,即影响无旗. 对于ROL和ROR指令,如果蒙面计数为0,则旗子不受影响. 如果蒙面计数为1,则OF旗受到影响,否则(蒙面计数大于1),OF旗没有定义.

对于所有指令,当蒙面计数为非零时,CF旗会受到影响. SF,ZF,AF,和PF旗总是不受影响.
