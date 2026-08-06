---
summary: 小数调整 AL 后添加
---

## 说明

调整两个打包的BCD值的总和,以创建打包的BCD结果. AL登记册是隐含的来源和目标操作数. DAA指令只有在遵循ADD指令时才有用,该指令增加了(二进制加)两个2位数,打包的BCD值并在AL寄存器中存储一个字节结果. DAA指令然后调整AL寄存器的内容,以包含正确的2位数,包装的BCD结果. 如果检测到小数携带,则相应设定CF和AF的旗帜.

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
                     AL := AL + 6;
                     CF := old_CF or (Carry from AL := AL + 6);
                       AF := 1;

                 ELSE
                       AF := 0;

          FI;
         IF ((old_AL > 99H) or (old_CF = 1))

                THEN
                     AL := AL + 60H;
                       CF := 1;

                ELSE
                       CF := 0;

          FI;
FI;

Example     Before: AL=79H BL=35H EFLAGS(OSZAPC)=XXXXXX
ADD AL, BL  After: AL=AEH BL=35H EFLAGS(0SZAPC)=110000
            Before: AL=AEH BL=35H EFLAGS(OSZAPC)=110000
DAA         After: AL=14H BL=35H EFLAGS(0SZAPC)=X00111
            Before: AL=2EH BL=35H EFLAGS(OSZAPC)=110000
DAA         After: AL=34H BL=35H EFLAGS(0SZAPC)=X00101
```

## 受影响的旗帜

如果值的调整结果为十进制,则CF 和 AF 标记以结果的两位数中的任何一位表示(见上文"操作"部分)。 SF,ZF,PF的旗帜根据结果设置. OF旗帜未定义.
