---
summary: 双精度左移
---

## 说明

SHLD指令用于64位或以上的多精度移位.

指令将第一个操作数(目标操作数)的位数向左移到第三个操作数(操作数伯爵)指定的位数. 第二个操作数(源操作数)提供位从右移(以零位的目标操作数开始).

目标操作数可以是寄存器或内存位置;源操作数是寄存器. 计数操作数是一个无符号的整数,可以存储在即时字节或CL寄存器中. 如果计数操作数是CL,则值班计数是CL的逻辑AND和一个计数罩. 在非64位模式和默认的64位模式中;只使用点数中的0到4位. 这把计数掩盖在0到31之间 如果一个计数大于操作数大小,则结果未定义.

如果计数为1或更多,则CF旗会填充目标操作数中最后一个位移出. 对于1位移位,如果出现符号变化,则设置OF旗;否则,则清除. 如果计数操作数为0,则旗帜不受影响.

在64位模式下,指令的默认操作大小为32位. 使用REX的前缀形式为REX.R,允许访问额外的注册(R8-R15). 使用REX前缀,形式为REX.W,促进运行到64位(将计数罩提升到6位). 参见本节开头的汇总图,用于编码数据和限制.

## 行动

```text
IF (In 64-Bit Mode and REX.W = 1)
    THEN COUNT := COUNT MOD 64;
    ELSE COUNT := COUNT MOD 32;

FI
SIZE := OperandSize;
tempDEST := DEST;
IF COUNT > SIZE

    THEN (* Bad parameters *)
          tempDEST is undefined;


          CF, OF, SF, ZF, AF, PF are undefined;
    ELSE IF COUNT > 0 (* Perform the shift *)

          CF := BIT[tempDEST, SIZE  COUNT];
          (* Last bit shifted out on exit *)
          FOR i := SIZE  1 DOWN TO COUNT

                DO
                      Bit(tempDEST, i) := Bit(tempDEST, i  COUNT);

                OD;
          FOR i := COUNT  1 DOWN TO 0

                DO
                      BIT[tempDEST, i] := BIT[SRC, i  COUNT + SIZE];

                OD;
FI;
DEST := tempDEST;
```

## 受影响的旗帜

如果计数为1或更多,则CF旗会填充目标操作数中最后一个位移出,SF,ZF,PF旗会按照结果的值设置. 对于1位移位,如果出现符号变化,则设置OF旗;否则,则清除. 对于大于1位的转动,OF旗没有定义. 如果发生转动,则AF旗未定义. 如果计数操作数为0,则旗帜不受影响. 如果计数大于操作数大小,则未定义旗帜.
