---
summary: 更改符号
---

## 说明

补充 ST( 0) 的符号位 。 此操作将正值变为等量的负值,反之亦然. 下表列出改变各类数字标志时获得的结果.

** FCHS 结果**

| ST(0) SRC | ST(0) DEST |
| --- | --- |
| + |  |
| +F |  |
| +0 |  |
| -0 |  |
| -F |  |
| - |  |
| 纳恩 |  |

## 行动

```text
SignBit(ST(0)) := NOT (SignBit(ST(0)));

FPU Flags Affected

C1                  Set to 0.

C0, C2, C3          Undefined.
```

## 浮点 例外

```text
#IS                 Stack underflow occurred.
```
