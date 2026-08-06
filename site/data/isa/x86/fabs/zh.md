---
summary: 绝对值
---

## 说明

清除 ST( 0) 的符号位以创建 操作数 的绝对值。 下表列出在创建各类数字的绝对值时获得的结果.

```text
                                 ST(0) SRC  Table 3-19. Results Obtained from FABS
```

ST(0) DEST -

```text
                                      -F                                                                   +
                                      -0                                                                          +F
                                      +0                                                                          +0
                                      +F                                                                          +0
```

+F +

```text
                                     NaN                                                                   +
```

NOTES : (英语).                                                                                                           NaN F表示有限浮点值.

此指令的操作在非64位模式和64位模式中是相同的.

## 行动

```text
ST(0) := |ST(0)|;

FPU Flags Affected

C1                    Set to 0.

C0, C2, C3            Undefined.
```

## 浮点 例外

```text
#IS                   Stack underflow occurred.
```
