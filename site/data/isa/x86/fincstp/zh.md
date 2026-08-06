---
summary: 堆栈-托普指针
---

## 说明

在 FPU 状态单词的 TOP 字段中添加一个(插入 栈指针 的顶部). 如果 TOP 字段包含一个 7,则设置为 0. 此指令的效果是将堆栈旋转为一个位置. FPU数据登记册和标记登记册的内容不受影响。 此操作不等同于弹出堆栈, 因为上一个顶层寄存器的标记不是空的 。

此指令的操作在非64位模式和64位模式中是相同的.

## 行动

```text
IF TOP = 7

    THEN TOP := 0;
    ELSE TOP := TOP + 1;
FI;

FPU Flags Affected
The C1 flag is set to 0. The C0, C2, and C3 flags are undefined.
```

## 浮点 例外

None.
