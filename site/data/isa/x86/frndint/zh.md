---
summary: 回合到整数
---

## 说明

根据当前四舍五入模式(设置FPU控制字的RC字段),将ST(0)登记册中的源值四舍五入到最接近的整体值,并将结果存储在ST(0)中.

如果源值为 ,则该值不变。 如果源值不是整体值,则生成 浮点 不精确结果例外(#P).

此指令的操作在非64位模式和64位模式中是相同的.

## 行动

```text
ST(0) := RoundToIntegralValue(ST(0));

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
#IA                 Source operand is an SNaN value or unsupported format.
```

```text
#D                  Source operand is a denormal value.
```

```text
#P                  Source operand is not an integral value.
```
