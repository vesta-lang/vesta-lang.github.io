---
summary: 免费 浮点 注册
---

## 说明

将 FPU 标记寄存器中与寄存器 ST( i) 相关的标记设置为空 (11B) 。 ST(i)和FPU堆式顶尖指针(TOP)的内容不受影响.

此指令的操作在非64位模式和64位模式中是相同的.

## 行动

```text
TAG(i) := 11B;

FPU Flags Affected
C0, C1, C2, C3 undefined.
```

## 浮点 例外

None
