---
summary: 输出到端口
---

## 说明

将第二个 操作数 (源操作数) 的值复制到用 目标操作数 (第一个 操作数)指定的 I/O 端口. 源操作数可以根据访问端口的大小(分别为8,16,或32位)注册AL,AX,或EAX;目标操作数可以是字节即时或DX注册. 使用字节即时允许访问I/O端口地址0至255;使用DX寄存器作为源操作数允许访问0至65,535的I/O端口.

正在访问的I/O端口的大小由8位I/O端口的操作码或16位或32位I/O端口的指令的操作数大小属性决定.

在机器代码级别上,I/O指令在访问8位I/O端口时较短. 在这里,端口地址的上八位位将是0.

此指令仅用于访问位于处理器I/O地址空间的I/O端口. 有关访问I/O地址空间I/O端口的更多信息,见Intel(R)64和IA-32 Architecture Software开发者手册第1卷第20章"输入/输出".

此指令的操作在非64位模式和64位模式中是相同的.

## IA-32 架构兼容性

执行 OUT 指令后,Pentium(R) 处理器确保EWBE# pin在开始执行下一个指令前被采样. (注意,如果EWBE#不活动,则指令可以预设,但直到EWBE# pin被采样为活性. ) 只有Pentium处理器家族有EWBE# pin.

## 行动

```text
IF ((PE = 1) and ((CPL > IOPL) or (VM = 1)))
    THEN (* Protected mode with CPL > IOPL or virtual-8086 mode *)
         IF (Any I/O Permission Bit for I/O port being accessed = 1)
                THEN (* I/O operation is not allowed *)
                      #GP(0);
                ELSE ( * I/O operation is allowed *)
                      DEST := SRC; (* Writes to selected I/O port *)
          FI;
    ELSE (Real Mode or Protected Mode with CPL  IOPL *)
          DEST := SRC; (* Writes to selected I/O port *)

FI;
```

## 受影响的旗帜

None.
