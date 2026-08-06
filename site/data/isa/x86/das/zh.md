---
summary: 减法后小数调整 AL
---

## 说明

调整两个打包的BCD值的减值结果,以创建打包的BCD结果. AL登记册是隐含的来源和目标操作数. DAS指令只有在遵循SUB指令时才有用,该指令会减去一个二位数(二位数减值),将BCD值从另一位数包装起来,并将一个字节结果存储在AL寄存器中. DAS指令然后调整AL寄存器的内容,以包含正确的2位数,包装的BCD结果. 如果检测到十进制借入,则相应设置CF和AF旗.

本指令在兼容模式和遗留模式中执行如上所述. 在64位模式下无效 。

## 行动

```text
IF 64-Bit Mode
    THEN
          #UD;
    ELSE
          old_AL := AL;
          old_CF := CF;
          CF := 0;
         IF (((AL AND 0FH) > 9) or AF = 1)
                THEN
                    AL := AL - 6;

                  CF := old_CF or (Borrow from AL := AL - 6);

                      AF := 1;
                ELSE

                      AF := 0;
          FI;
         IF ((old_AL > 99H) or (old_CF = 1))

                 THEN

                  AL := AL - 60H;

                      CF := 1;
          FI;
FI;

Example     Before: AL = 35H, BL = 47H, EFLAGS(OSZAPC) = XXXXXX
SUB AL, BL  After: AL = EEH, BL = 47H, EFLAGS(0SZAPC) = 010111
            Before: AL = EEH, BL = 47H, EFLAGS(OSZAPC) = 010111
DAA         After: AL = 88H, BL = 47H, EFLAGS(0SZAPC) = X10111
```

## 受影响的旗帜

如果值的调整导致以结果的两位数中的任何一位借入一个小数(见上文"操作"部分),则设定了CF和AF的标记. SF,ZF,PF的旗帜根据结果设置. OF旗帜未定义.
