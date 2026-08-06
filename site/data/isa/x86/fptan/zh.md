---
summary: 部分正切
---

## 说明

在寄存器 ST( 0) 中计算 源操作数 的大致正切值, 将结果存储为 ST( 0) , 并将一个 1.0 推到 FPU 寄存器堆栈中 。 源操作数必须用弧度给出,并且必须小于+/-263. 该

以下表格显示计算各种类别部分正切值时获得的未显示结果:

数字,假设不存在下流。

** FPTAN 结果**

| ST(0) SRC | ST(0) DEST |
| --- | --- |
| - | * |
| -F | - F to + F |
| -0 | -0 |
| +0 | +0 |
| +F | - F to + F |
| + | * |
| 纳恩 | 纳恩 |

## 行动

```text
IF ST(0) < 263
    THEN
          C2 := 0;
          ST(0) := fptan(ST(0)); // approximation of tan
          TOP := TOP - 1;
          ST(0) := 1.0;
    ELSE (* Source operand is out-of-range *)
          C2 := 1;

FI;

FPU Flags Affected

C1                      Set to 0 if stack underflow occurred; set to 1 if stack overflow occurred.

                        Set if result was rounded up; cleared otherwise.

C2                      Set to 1 if outside range (-263 < source operand < +263); otherwise, set to 0.

C0, C3                  Undefined.
```

## 浮点 例外

```text
#IS                     Stack underflow or overflow occurred.
```

```text
#IA                     Source operand is an SNaN value, , or unsupported format.
```

```text
#D                      Source operand is a denormal value.
```

```text
#U                      Result is too small for destination format.
```

```text
#P                      Value cannot be represented exactly in destination format.
```
