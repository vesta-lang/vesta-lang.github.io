---
summary: 装入整数
---

## 说明

将已签名的 源操作数 转换成双倍扩展精度 浮点 格式,并将值推向 FPU 寄存器堆栈 。 源操作数可以是单词,双词,也可以是四字整数. 它装入时没有四舍五入错误。 源操作数的标志保存下来.

此指令的操作在非64位模式和64位模式中是相同的.

## 行动

```text
TOP := TOP - 1;

ST(0) := ConvertToDoubleExtendedPrecisionFP(SRC);

FPU Flags Affected

C1                  Set to 1 if stack overflow occurred; set to 0 otherwise.

C0, C2, C3          Undefined.
```

## 浮点 例外

```text
#IS                 Stack overflow occurred.
```
