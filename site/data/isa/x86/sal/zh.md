---
summary: 移动
---

## 说明

将第一个 操作数 (目标操作数) 中的位移到左侧或右侧,以第二个 操作数 (count 操作数) 中指定的位数表示. 位移超越目标操作数边界的位移首先会转向CF旗,然后丢弃. 转向架操作结束后,CF旗中包含目标操作数中最后的位移.

目标操作数可以是寄存器或内存位置. 计数操作数可以是即时值或CL寄存器. 计数被遮掩到5位(或6位加64位的操作数). 计数范围以0至31为限(或63个有64位的操作数). 为1的计数提供了特殊的操作码编码.

左移算术(SAL)和左移逻辑(SHL)指令执行相同的操作;它们将目标操作数中的位移到左移(向更显著的位移位置). 对于每一班次计数,目标操作数中最显著的位移到CF旗中,最小的位移被清除(见Intel(R)64和IA-32架构软件开发者手册第1卷图7-7).

转动算术右侧(SAR)和转动逻辑右侧(SHR)指令将目标操作数的位移到右侧(转动不太显著的位移位置). 对于每个班次计数,目标操作数中最不重要的位移到CF旗中,而最显著的位移或者根据指令类型设置或者清除. SHR指令清除了最显著的位点(见Intel(R)64和IA-32架构软件开发者手册第1卷中的图7-8);SAR指令集或清除了最显著位点,以对应目标操作数中原值的符号(最显著位点). 实际上,SAR指令将空位位置的移位值用未移位值的符号填充(见Intel(R)64和IA-32架构软件开发者手册第1卷中的图7-9).

SAR 和 SHR 指令可以分别通过 2. 权限执行 目标操作数 的签名或未签名分割. 例如,使用 SAR 指令将一个签名的整数 1 位移到右边将值除以 2 。

使用 SAR 指令执行分区操作不会产生与 IDIV 指令相同的结果. 从 IDIV 指令的商号是四舍五入到零,而 SAR 指令的"引号"则是四舍五入到负无限。 这一差异仅对负数明显。 例如,当使用 IDIV 指令将 -9 乘以 4 时,结果为 -2,剩余为 -1. 如果使用 SAR 指令

移 -9 右转两个比特,结果为 -3,"剩余"为+3;然而,SAR指令只存储剩余中最显著的比特(在CF旗中).

OF旗只在1位移位时受到影响. 对于左转,如果结果中最显著的位点与CF旗相同(即原操作数的前两个位点是相同的),则OF旗设为0;否则则设为1. 对于SAR指令,所有1位移位的OF旗被清除. 对于SHR指令,OF旗被设定为原操作数中最显著的位.

在64位模式下,指令的默认操作大小为32位,CL的遮罩宽度为5位. 使用REX的前缀形式为REX.R,允许访问额外的注册(R8-R15). 使用REX前缀,形式为REX.W,促进运行到64位,并将CL的遮罩宽度设置到6位. 参见本节开头的汇总图,用于编码数据和限制.

## IA-32 架构兼容性

8086型机车不遮挡值班计数. 然而,所有其他的IA-32处理器(从英特尔286处理器开始)都确实遮掩了转向计数到5位,导致最高计数为31位. 这种遮盖在所有操作模式(包括虚拟 8086 模式)中都做了,以减少指令的最大执行时间.

## 行动

```text
IF OperandSize = 64
    THEN
          countMASK := 3FH;
    ELSE
          countMASK := 1FH;

FI

tempCOUNT := (COUNT AND countMASK);

origDEST := DEST;
tempDEST := DEST;

WHILE (tempCOUNT  0)

DO
    IF instruction is SAL or SHL
          THEN
                CF := MSB(tempDEST);
          ELSE (* Instruction is SAR or SHR *)
                CF := LSB(tempDEST);
    FI;
    IF instruction is SAL or SHL
          THEN
               tempDEST := tempDEST  2;
          ELSE
                IF instruction is SAR
                      THEN
                            tempDEST := tempDEST / 2; (* Signed divide, rounding toward negative infinity *)
                      ELSE (* Instruction is SHR *)
                            tempDEST := tempDEST / 2 ; (* Unsigned divide *)
                FI;
    FI;
    tempCOUNT := tempCOUNT  1;

OD;

(* Determine overflow for the various instructions *)
IF (COUNT and countMASK) = 1

    THEN
          IF instruction is SAL or SHL


                THEN
                      OF := MSB(tempDEST) XOR CF;

                ELSE
                      IF instruction is SAR
                            THEN
                                  OF := 0;
                            ELSE (* Instruction is SHR *)
                                  OF := MSB(origDEST);
                      FI;

          FI;
    ELSE IF (COUNT AND countMASK) = 0

          THEN
                All flags unchanged;

          ELSE (* COUNT not 1 or 0 *)
                OF := undefined;

    FI;
FI;
DEST := tempDEST;
```

## 受影响的旗帜

CF旗包含最后一个位移出目标操作数的值;对于SHL和SHR指令,在计数大于或等于目标操作数的大小(以位数计)时,它未定义. OF旗只为1位移位受到影响(见上文"描述");否则,则未定义. SF,ZF,PF的旗帜根据结果设置. 如果计数为0,则旗帜不受影响. 对于非零计数,AF旗没有定义.
