---
summary: 按下字、双字或四字键到堆栈
---

## 说明

减少栈指针,然后将源操作数存储在堆栈顶部. 地址和操作数大小的确定和使用如下:

* 地址大小 。 当前代码框描述符中的 D 旗决定默认地址大小; 可能是

被指令前缀( 67H) 覆盖 。

地址大小仅在内存中引用一个 源操作数 时使用.

* 操作数大小 (英语). 当前代码框描述符中的 D 旗决定默认 操作数大小; 它可能

被指令前缀(66H或REX.W)所覆盖.

操作数大小(16,32或64位)决定栈指针的减速量(2,4或8).

如果 源操作数 是一个小于 操作数大小 的即时大小,则将一个符号扩展值推到堆栈上. 如果源操作数是一个分段寄存器(16位),而操作数大小是64位,则将一个零扩展值推到堆栈上;如果操作数大小是32位,则或者将一个零扩展值推到堆栈上,或者使用16位移动将段选择子写到堆栈上. 对于最后一个案例,所有最近的Intel Core和Intel Atom处理器都进行16位移动,使得堆栈位置的上部没有修改.

* 堆叠地址大小 。 除64位模式外,当前堆栈框描述符中的B旗决定

栈指针的大小(16或32位);在64位模式中,栈指针的大小总是64位.

堆栈地址大小决定了栈指针在内存中写到堆栈时的宽度,以及栈指针的减值. (如上所述,栈指针减值的金额由操作数大小确定. )

如果操作数大小小于堆栈地址大小,则PUSH指令可能导致对齐栈指针(a 栈指针,未在双字或四字边界上对齐).

PUSH ESP 指令将 ESP 记录的值推到指令执行前就已存在. 如果一个PUSH指令使用一个内存操作数,其中ESP记录器用于计算操作数地址,则操作数的地址在ESP记录器降温前计算.

如果 ESP 或 SP 寄存器在 实地址模式 中执行 PUSH 指令时为 1,则生成堆栈错误例外(#SS) (因为违反了堆栈部分的极限). 它的交付遇到第二个堆叠过失例外(同样的原因),导致生成双过失例外(#DF). 交付双故障例外会遇到第三个堆栈故障例外,逻辑处理器进入关闭模式. 见英特尔(R)64和IA-32架构软件开发者手册第7章关于双过失例外的讨论,第3A卷.

## IA-32 架构兼容性

对于来自Intel 286 on的IA-32处理器,PUSH ESP指令将ESP记录器的值推到执行指令之前就已经存在的. (This is also true for Intel 64 architecture, real-address and virtual- 8086 modes of IA-32 architecture.) For the Intel(R) 8086 processor, the PUSH SP instruction pushes the new value of the SP register (that is the value after it has been decremented by 2).

## 行动

```text
(* See Description section for possible sign-extension or zero-extension of source operand and for *)

(* a case in which the size of the memory store may be smaller than the instruction's operand size *)

IF StackAddrSize = 64

THEN

IF OperandSize = 64

           THEN

           RSP := RSP  8;

           Memory[SS:RSP] := SRC;                        (* push quadword *)

ELSE IF OperandSize = 32

           THEN

           RSP := RSP  4;

           Memory[SS:RSP] := SRC;                        (* push dword *)

           ELSE (* OperandSize = 16 *)

           RSP := RSP  2;

           Memory[SS:RSP] := SRC;                        (* push word *)

FI;

ELSE IF StackAddrSize = 32                               (* push quadword *)
                                                         (* push dword *)
    THEN                                                 (* push word *)

          IF OperandSize = 64

                THEN

                    ESP := ESP  8;
                    Memory[SS:ESP] := SRC;
          ELSE IF OperandSize = 32

                THEN

                    ESP := ESP  4;
                    Memory[SS:ESP] := SRC;
                ELSE (* OperandSize = 16 *)

                    ESP := ESP  2;
                    Memory[SS:ESP] := SRC;


          FI;                                            (* push dword *)
                                                         (* push word *)
    ELSE (* StackAddrSize = 16 *)

          IF OperandSize = 32

                THEN

                    SP := SP  4;
                    Memory[SS:SP] := SRC;
                ELSE (* OperandSize = 16 *)

                    SP := SP  2;
                    Memory[SS:SP] := SRC;
          FI;

FI;
```

## 受影响的旗帜

None.
