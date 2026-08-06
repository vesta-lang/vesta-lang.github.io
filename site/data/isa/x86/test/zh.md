---
summary: 逻辑比较
---

## 说明

计算第一个操作数(来源为1操作数)和第二个操作数(来源为2操作数)的位元逻辑AND,并根据结果设置SF,ZF,和PF 状态标志. 结果被丢弃。

在64位模式中,使用REX前缀的形式为REX.R允许访问额外的注册(R8-R15). 使用REX前缀,形式为REX.W,促进运行到64位. 参见本节开头的汇总图,用于编码数据和限制.

## 行动

```text
TEMP := SRC1 AND SRC2;
SF := MSB(TEMP);

IF TEMP = 0
    THEN ZF := 1;
    ELSE ZF := 0;

FI:

PF := BitwiseXNOR(TEMP[0:7]);
CF := 0;
OF := 0;


(* AF is undefined *)
```

## 受影响的旗帜

OF和CF旗设为0. SF,ZF,PF的旗帜根据结果设置(见上文"行动"部分). AF旗的状态没有定义.
