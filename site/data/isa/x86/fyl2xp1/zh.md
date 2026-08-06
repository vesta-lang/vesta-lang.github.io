---
summary: 计算y 对数2(x+1)
---

## 说明

计算(ST(1) log2(ST(0) + 1.0)),将结果存储于寄存器ST(1),并弹出FPU寄存器堆栈. ST( 0) 中的 源操作数 必须是在 :

```text
     (1  2 / 2) )to(1  2 / 2)
```

ST(1)中的源操作数可以从-到+. 如果ST(0)操作数超出其可接受范围,则结果未定义,软件不应依赖生成例外. 在某些情况下,ST(0)超出范围时可能会产生例外,但这种行为是具体的执行,没有保证.

下表显示在使用各类数字的对数epsilon时获得的结果,假设不存在下流.

**FYL2XP1 Results**

| -(1 - ( | 2 / 2 )) to -0 | -0 | +0 | +0 to +(1 - ( | 2 / 2 )) | 纳恩 |
| --- | --- | --- | --- | --- | --- | --- |
|  | + | * | * | - |  | 纳恩 |
|  | +F | +0 | -0 | -F |  | 纳恩 |
|  | +0 | +0 | -0 | -0 |  | 纳恩 |
|  | -0 | -0 | +0 | +0 |  | 纳恩 |
|  | -F | -0 | +0 | +F |  | 纳恩 |
|  | - | * | * | + |  | 纳恩 |
|  | 纳恩 | 纳恩 | 纳恩 | 纳恩 |  | 纳恩 |

## 行动

```text
ST(1) := ST(1)  log2(ST(0) + 1.0);
PopRegisterStack;


FPU Flags Affected

C1                  Set to 0 if stack underflow occurred.

                    Set if result was rounded up; cleared otherwise.

C0, C2, C3          Undefined.
```

## 浮点 例外

```text
#IS                 Stack underflow occurred.
```

```text
#IA                 Either operand is an SNaN value or unsupported format.
```

```text
#D                  Source operand is a denormal value.
```

```text
#U                  Result is too small for destination format.
```

```text
#O                  Result is too large for destination format.
```

```text
#P                  Value cannot be represented exactly in destination format.
```
