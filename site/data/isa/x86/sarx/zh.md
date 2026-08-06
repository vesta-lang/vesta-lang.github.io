---
summary: 移动不影响旗帜
---

## 说明

将第一个源操作符(第二个源操作符)的位移到左侧或右侧,由第二个源操作符(第三个源操作符)中指定的 COUNT 值表示. 结果写给目标操作数(第一个操作数).

转动算术右侧(SARX)和转动逻辑右侧(SHRX)指令将目标操作数的位移到右侧(转动不太显著的位移位置),SARX在转动时保留并宣传最显著的位移(符号位).

逻辑左移 (SHLX) 将 目标操作数 的位移到左移 (向更显著的位移位置) .

此指令不支持真实模式和 虚拟 8086 模式 。 操作数大小如果不是64位模式,总是32位. 在64位模式操作数大小 64中需要VEX.W1. VEX.W1在非64位模式中被忽略. 试图用不等于0的 VEX.L 执行此指令将导致 #UD.

如果 第一源操作数 中指定的值超过 OperondSize -1,则 COUNT 值被遮掩.

SARX,SHRX,和SHLX指令不更新旗帜.

## 行动

```text
TEMP := SRC1;
IF VEX.W1 and CS.L = 1
THEN

    countMASK := 3FH;
ELSE

    countMASK := 1FH;
FI
COUNT := SRC2 AND countMASK;

DO WHILE (COUNT  0)
    IF instruction is SHLX
          THEN
                TEMP := TEMP *2;


         ELSE IF instruction is SHRX

         THEN

                TEMP := TEMP /2; //unsigned divide

         ELSE   // SARX

                TEMP := TEMP /2; // signed divide, round toward negative infinity

    FI;

    COUNT := COUNT - 1;

OD

DEST := TEMP;
```

## 受影响的旗帜

None.

## SIMD 浮点 例外

None.

## 其他例外

参见表2-29"十三类例外条件".
