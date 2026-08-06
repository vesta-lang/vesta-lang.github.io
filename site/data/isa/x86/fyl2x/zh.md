---
summary: 计算 Y 对数2x
---

## 说明

计算(ST(1)日志2(ST(0))),将结果存储于寄存器ST(1),并弹出FPU寄存器堆栈. ST( 0) 中的 源操作数 必须是非零正数 。

下表显示在计算各类数字时得出的结果,假设既不溢出也不流出。

**FYL2X Results**

| ST(1) | -F | * | * | ** | +F | -0 | -F | - | 纳恩 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  | -0 | * | * | * | +0 | -0 | -0 | * | 纳恩 |
|  | +0 | * | * | * | -0 | +0 | +0 | * | 纳恩 |
|  | +F | * | * | ** | -F | +0 | +F | + | 纳恩 |
|  | + | * | * | - | - | * | + | + | 纳恩 |

## 行动

```text
ST(1) := ST(1)  log2ST(0);
PopRegisterStack;

FPU Flags Affected

C1                        Set to 0 if stack underflow occurred.

                          Set if result was rounded up; cleared otherwise.

C0, C2, C3                Undefined.
```

## 浮点 例外

```text
#IS                       Stack underflow occurred.
```

```text
#IA                       Either operand is an SNaN or unsupported format.
```

登记号ST(0)中的源操作数是一个负限值(不是-0)。

```text
#Z                        Source operand in register ST(0) is +/-0.
```

```text
#D                        Source operand is a denormal value.
```

```text
#U                        Result is too small for destination format.
```

```text
#O                        Result is too large for destination format.
```

```text
#P                        Value cannot be represented exactly in destination format.
```
