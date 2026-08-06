---
summary: 未签名的乘法
---

## 说明

执行第一个操作数(目标操作数)和第二个操作数(源操作数)的无符号乘法,并将结果存储在目标操作数中. 目的地操作是位于注册AL,AX或EAX的隐含操作符(取决于操作符的大小);源操作符位于通用注册符或内存位置. 如表4-9所示,本指令的动作和结果的位置取决于操作码和操作数大小.

结果存储在注册AX,注册对 DX:AX,或注册对 EDX:EAX(取决于操作数大小),产品高序位分别包含在注册AH,DX,或EDX中. 如果产品高序位为0,则清除CF和OF旗;否则则设置旗.

在64位模式下,指令的默认操作大小为32位. 使用REX.R前缀可以访问额外的登记册(R8-R15). 使用REX.W前缀将操作提升到64位.

参见本节开头的汇总图,用于编码数据和限制.

**MUL Results**

| 操作大小 | 来源1 | 来源2 | 目标 |
| --- | --- | --- | --- |
| 字节 | AL | r/m8 | AX |
| 单词 | AX | r/m16 | DX:AX |
| 双字 | EAX | r/m32 | EDX:EAX |
| 四方词 | RAX | r/m64 | RDX:RAX |

## 行动

```text
IF (Byte operation)
    THEN
          AX := AL  SRC;
    ELSE (* Word or doubleword operation *)
          IF OperandSize = 16
                THEN
                      DX:AX := AX  SRC;
                ELSE IF OperandSize = 32
                      THEN EDX:EAX := EAX  SRC; FI;
                ELSE (* OperandSize = 64 *)
                      RDX:RAX := RAX  SRC;
          FI;


FI;
```

## 受影响的旗帜

如果结果的上半部分为0,则OF和CF旗设为0;否则,则设为1. SF,ZF,AF,和PF旗没有定义.
