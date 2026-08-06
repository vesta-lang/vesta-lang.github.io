---
summary: 从端口输入
---

## 说明

复制由第二个 操作数 (源操作数) 指定的 I/O 端口到 目标操作数 (第一个 操作数) 的值. 源操作数可以是字节即时或DX注册;目标操作数可以是注册AL,AX,或EAX,视访问端口大小而定(分别为8,16或32位). 使用DX寄存器作为源操作数允许访问0到65,535的I/O端口地址;使用字节即时允许访问I/O端口地址0到255.

当访问8位I/O端口时,操作码决定端口大小;当访问16位和32位I/O端口时,操作数大小属性决定端口大小. 在机器代码级别上,I/O指令在访问8位I/O端口时较短. 在这里,端口地址的上八位位将是0.

此指令仅用于访问位于处理器I/O地址空间的I/O端口. 有关访问I/O地址空间I/O端口的更多信息,见Intel(R)64和IA-32 Architecture Software开发者手册第1卷第20章"输入/输出".

此指令的操作在非64位模式和64位模式中是相同的.

## 行动

```text
IF ((PE = 1) and ((CPL > IOPL) or (VM = 1)))

    THEN (* Protected mode with CPL > IOPL or virtual-8086 mode *)

        IF (Any I/O Permission Bit for I/O port being accessed = 1)

                THEN (* I/O operation is not allowed *)
                      #GP(0);

                ELSE ( * I/O operation is allowed *)
                      DEST := SRC; (* Read from selected I/O port *)

          FI;
    ELSE (Real Mode or Protected Mode with CPL  IOPL *)

          DEST := SRC; (* Read from selected I/O port *)
FI;
```

## 受影响的旗帜

None.
