---
summary: 乘号
---

## 说明

执行两个 操作数 的签名乘法。 本指令有三种形式,视操作数的数量而定.

* One-操作数表型--这个表型与MUL指令所使用的表型相同. 这里,源操作数(在

一个通用寄存器或内存位置)乘以在AL,AX,EAX或RAX寄存器中的值(取决于操作大小)和产品(输入操作器大小的两倍)分别存储在AX,DX:AX,EDX:EAX或RDX:RAX寄存器中的值.

* 2- 操作数 形式 - 用这个形式, 目标操作数(第一个 操作数) 乘以来源

操作数(第二个操作数). 目标操作数是一个通用寄存器,源操作数是一个直接值,一个通用寄存器,或者一个内存位置. 中间产物(与输入量操作数的大小翻两番)被截断并储存在目标操作数的位置.

* 3-操作数形式 - 这个形式需要目标操作数(第一个操作数)和两个源操作数.

(第二和第三个操作数). 在此,第一源操作数(可以是通用寄存器或内存位置)乘以第二源操作数(即时值). 中间产物(二倍于第一源操作数的尺寸)被切换并储存在目标操作数(a 通用寄存器)中.

当一个即时值被用作操作数时,其符号扩展为目标操作数格式的长度.

当中间产物的签名整数值与扩展的操作数大小的三联产品不同时,CF和OF旗被设定,否则CF和OF旗被清除.

IMUL指令的三种形式相似,即产品长度计算为操作数长度的两倍. 采用单操作数形式,产品完全储存在目的地. 但是,有了两面三面体的表格,结果在储存在目的地之前会缩短到目的地的长度。

目的地注册。 由于这种截断,应测试CF或OF旗,以确保不丢失显著位.

两加三-操作数的表格也可以使用无符号的操作数,因为产品的下半部是相同的,无论操作数是签名还是未签名. 然而,不能使用CF和OF旗来确定结果的上半部是否为非零.

在64位模式下,指令的默认操作大小为32位. 使用REX.R前缀可以访问额外的登记册(R8-R15). 使用REX.W前缀将操作提升到64位. 使用 REX.W 修改 3

forms of the instruction as follows.

* 1-操作数形式 - 源操作数(在64位的通用寄存器或内存位置中)是

乘以 RAX 寄存器中的值,产品存储在 RDX: RAX 寄存器中.

* 2-操作数形式--源操作数如果是一个寄存器或内存位置,则升级为64位. 该

目标操作数晋级64位.

* 3- 操作数 形式 - 第一源操作数( 注册或 内存位置) 和目的地

操作数晋级64位. 如果源操作数是即时的,则其标志扩展至64位.

## 行动

```text
IF (NumberOfOperands = 1)
   THEN IF (OperandSize = 8)

          THEN
                TMP_XP := AL  SRC (* Signed multiplication; TMP_XP is a signed integer at twice the width of the SRC *);
                AX := TMP_XP[15:0];

             IF SignExtend(TMP_XP[7:0]) = TMP_XP

                      THEN CF := 0; OF := 0;
                      ELSE CF := 1; OF := 1; FI;

        ELSE IF OperandSize = 16

                THEN
                      TMP_XP := AX  SRC (* Signed multiplication; TMP_XP is a signed integer at twice the width of the SRC *)
                      DX:AX := TMP_XP[31:0];

                  IF SignExtend(TMP_XP[15:0]) = TMP_XP

                            THEN CF := 0; OF := 0;
                            ELSE CF := 1; OF := 1; FI;

             ELSE IF OperandSize = 32

                      THEN
                            TMP_XP := EAX  SRC (* Signed multiplication; TMP_XP is a signed integer at twice the width of the SRC*)
                            EDX:EAX := TMP_XP[63:0];

                       IF SignExtend(TMP_XP[31:0]) = TMP_XP

                                  THEN CF := 0; OF := 0;
                                  ELSE CF := 1; OF := 1; FI;
                      ELSE (* OperandSize = 64 *)
                            TMP_XP := RAX  SRC (* Signed multiplication; TMP_XP is a signed integer at twice the width of the SRC *)
                            EDX:EAX := TMP_XP[127:0];

                       IF SignExtend(TMP_XP[63:0]) = TMP_XP

                                  THEN CF := 0; OF := 0;
                                  ELSE CF := 1; OF := 1; FI;
                      FI;
          FI;


   ELSE IF (NumberOfOperands = 2)

          THEN

                TMP_XP := DEST  SRC (* Signed multiplication; TMP_XP is a signed integer at twice the width of the SRC *)
                DEST := TruncateToOperandSize(TMP_XP);

             IF SignExtend(DEST)  TMP_XP

                      THEN CF := 1; OF := 1;

                      ELSE CF := 0; OF := 0; FI;

        ELSE (* NumberOfOperands = 3 *)

                TMP_XP := SRC1  SRC2 (* Signed multiplication; TMP_XP is a signed integer at twice the width of the SRC1 *)
                DEST := TruncateToOperandSize(TMP_XP);

             IF SignExtend(DEST)  TMP_XP

                      THEN CF := 1; OF := 1;

                      ELSE CF := 0; OF := 0; FI;

    FI;

FI;
```

## 受影响的旗帜

对于一个操作数形式的指令,CF和OF旗是在将大位带入结果的上半部时设置的,在结果完全与结果的下半部相符时清除. 对于指令的2和3-操作数形式,在结果必须切换以适应目标操作数大小时,CF和OF旗被设定,并在结果完全符合目标操作数大小时清除. SF,ZF,AF,和PF旗没有定义.
