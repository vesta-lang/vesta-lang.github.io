---
summary: 折叠式托普指针
---

## 说明

从 FPU 状态单词的 TOP 字段中减去一个(命令顶端指针). 如果 TOP 字段包含一个 0,则设置为 7. 此指令的效果是将堆栈旋转为一个位置. FPU数据登记册和标记登记册的内容不受影响。

此指令的操作在非64位模式和64位模式中是相同的.

## 行动

```text
IF TOP = 0

    THEN TOP := 7;
    ELSE TOP := TOP  1;
FI;

FPU Flags Affected
The C1 flag is set to 0. The C0, C2, and C3 flags are undefined.
```

## 浮点 例外

None.
