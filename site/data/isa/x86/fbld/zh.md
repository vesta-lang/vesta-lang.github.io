---
summary: 装入二进制编码小数
---

## 说明

将 BCD 源操作数 转换成双倍扩展精度 浮点 格式,并将值推向 FPU 堆栈. 源操作数的加载没有四舍五入错误. 源操作数的标志保存下来,包括-0.

包装的BCD位数假设在0到9之间;指令不检查无效位数(AH通过FH). 试图加载无效编码会产生未定义的结果 。

此指令的操作在非64位模式和64位模式中是相同的.

## 行动

```text
TOP := TOP - 1;
ST(0) := ConvertToDoubleExtendedPrecisionFP(SRC);

FPU Flags Affected

C1                  Set to 1 if stack overflow occurred; otherwise, set to 0.

C0, C2, C3          Undefined.
```

## 浮点 例外

```text
#IS                 Stack overflow occurred.
```
