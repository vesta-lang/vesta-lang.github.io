---
summary: 为程序参数制作堆栈框架
---

## 说明

为程序创建堆栈框架(由动态存储空间和1-32帧指针存储空间组成). 第一个操作数(imm16)指定了堆栈框架中动态存储的大小(即为程序在堆栈上动态分配的字节数). 第二个操作数(imm8)给出了该程序的词典巢穴等级(0至31). 筑巢级(imm8 mod 32)和OperandSize属性决定框架指针存储空间的字节大小.

嵌入级决定了从前一个帧复制到新堆栈帧的"显示区域"中的帧指针数量. 帧指针的默认大小是 StackAddrSize 属性,但是可以使用 66H 前缀来覆盖. 因此,操作Size属性决定了每个帧指针的大小,这些指针将被复制到堆栈帧中,并且数据从SP/ESP/RSP寄存器转移到BP/EBP/RBP寄存器中.

提供ENTER和伴奏的LEAVE指令支持块结构语言. ENTER指令(在使用时)通常是一个程序中的第一个指令,用于为一个程序设置一个新的堆栈框架. 然后使用LEAVE指令在程序的末尾(就在RET指令之前)释放堆栈框架.

如果筑巢级为0,处理器将BP/EBP/RBP寄存器的帧指针推到堆栈上,将SP/ESP/RSP寄存器的当前栈指针复制到BP/EBP/RBP寄存器中,并加载SP/ESP/RSP寄存器,以当前堆栈点值减去大小为操作数的值. 对于1或以上的筑巢水平,处理器在调整栈指针之前,会在堆栈上推进额外的帧指针. 这些额外的框架指针为所谓的程序提供了连接到堆栈上其他嵌套框架的入口点. 参见Intel(R)64和IA-32架构软件开发者手册第1卷第6章中的"程序要求block-Structured languages",以了解ENTER指令动作的更多信息.

ENTER 指令在使用 栈指针 (当前堆栈段内) 最终值的写作时会生成 页面错误 。

在64位模式下,默认操作大小为64位;32位操作大小无法编码. 使用 66H 前缀修改框指针 操作数大小 到 16 比特.

当使用 66H 前缀并导致操作Size 属性小于 StackAddrSize 时,软件负责下列事项:

* 同伴 LEAVE 指令还必须使用 66H 前缀, * 执行"66H ENTER"前在 RBP/EBP 登记册中的值必须在相同的16KByte区域内.

当前 栈指针(RSP/ESP),因此"66H ENTER"之后的RBP/EBP的值仍然是堆栈中的有效地址. 这保证了"66H LEAVE"可以从堆栈中恢复16位数据.

## 行动

```text
AllocSize := imm16;
NestingLevel := imm8 MOD 32;
IF (OperandSize = 64)

    THEN
          Push(RBP); (* RSP decrements by 8 *)
          FrameTemp := RSP;

   ELSE IF OperandSize = 32

          THEN
                Push(EBP); (* (E)SP decrements by 4 *)
                FrameTemp := ESP; FI;

   ELSE (* OperandSize = 16 *)

                Push(BP); (* RSP or (E)SP decrements by 2 *)
                FrameTemp := SP;
FI;

IF NestingLevel = 0

    THEN GOTO CONTINUE;
FI;

IF (NestingLevel > 1)
    THEN FOR i := 1 to (NestingLevel - 1)
          DO
                IF (OperandSize = 64)
                       THEN
                             RBP := RBP - 8;
                             Push([RBP]); (* Quadword push *)
                       ELSE IF OperandSize = 32
                             THEN
                                   IF StackSize = 32
                                         EBP := EBP - 4;
                                         Push([EBP]); (* Doubleword push *)
                                   ELSE (* StackSize = 16 *)
                                         BP := BP - 4;
                                         Push([BP]); (* Doubleword push *)
                                   FI;
                             FI;
                       ELSE (* OperandSize = 16 *)
                             IF StackSize = 64
                                   THEN
                                         RBP := RBP - 2;
                                         Push([RBP]); (* Word push *)
                             ELSE IF StackSize = 32
                                   THEN
                                         EBP := EBP - 2;
                                         Push([EBP]); (* Word push *)
                                   ELSE (* StackSize = 16 *)
                                         BP := BP - 2;
                                         Push([BP]); (* Word push *)
                             FI;
                       FI;
    OD;

FI;

IF (OperandSize = 64) (* nestinglevel 1 *)


    THEN
          Push(FrameTemp); (* Quadword push and RSP decrements by 8 *)

    ELSE IF OperandSize = 32
          THEN
                Push(FrameTemp); FI; (* Doubleword push and (E)SP decrements by 4 *)

    ELSE (* OperandSize = 16 *)
                Push(FrameTemp); (* Word push and RSP|ESP|SP decrements by 2 *)

FI;

CONTINUE:
IF 64-Bit Mode (StackSize = 64)

    THEN
                RBP := FrameTemp;

             RSP := RSP - AllocSize;

    ELSE IF OperandSize = 32
          THEN
                EBP := FrameTemp;

             ESP := ESP - AllocSize; FI;

    ELSE (* OperandSize = 16 *)
                BP := FrameTemp[15:1]; (* Bits 16 and above of applicable RBP/EBP are unmodified *)

             SP := SP - AllocSize;

FI;

END;
```

## 受影响的旗帜

None.
