---
summary: 添加
---

## 说明

添加目的地和 源操作数,并将总和存储在目的地位置. 目标操作数始终是一个FPU的登记册;源操作数可以是一个登记册或内存位置. 内存中的源操作数可以是单精度或双精度浮点格式,也可以是单词或双词整数格式.

无操作数版本的指令将ST(0)注册的内容添加到ST(1)注册中. Oneoperand版本将内存位置(或浮点或整数)的内容添加到ST(0)寄存器的内容中. 双操作数版本,将ST(0)注册的内容加入ST(i)注册或反之. ST( 0) 中的值可以通过编码加倍:

FADD ST(0), ST(0);

FADDP指令在存储结果后执行附加操作,将FPU寄存堆栈弹出. 要弹出寄存器堆栈,处理器将ST(0)寄存器标记为空,并将 栈指针 (TOP) 递增为 1 。 (无操作数版本的浮点添加指令总是导致寄存器堆栈被弹出. 在一些组装器中,此指令的元音是FADD而不是FADDP. )

FIADD指令将整数源操作数转换成双倍扩展精度浮点格式后再执行添加.

下页的表格显示在增加各类数字时获得的结果,假设既不溢出也不流出。

当两个反向标志的操作数的总和为0时,结果为+0,但向-模式方向的回合除外,在这种情况下,结果为-0. 源操作数为整数0时,作为+0处理.

当两个操作数都是同一标志的无限时,结果就是预期的标志. 如果两个操作数都是无限的反向标志,则生成无效操作例外. 见表3-20。

** FADD/FADDP/FIADD 结果**

| - F or - I | - | -F | SRC | SRC | +/- F or | +/- | 0 | + | 纳恩 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| -0 | - | DEST | -0 | +/-0 | DEST |  | + | Na | N |

## 行动

```text
IF Instruction = FIADD

    THEN
          DEST := DEST + ConvertToDoubleExtendedPrecisionFP(SRC);

    ELSE (* Source operand is floating-point value *)
          DEST := DEST + SRC;

FI;

IF Instruction = FADDP

    THEN
          PopRegisterStack;

FI;

FPU Flags Affected

C1                      Set to 0 if stack underflow occurred.

                        Set if result was rounded up; cleared otherwise.

C0, C2, C3              Undefined.
```

## 浮点 例外

```text
#IS                     Stack underflow occurred.
```

```text
#IA                     Operand is an SNaN value or unsupported format.
```

操作数是无穷无尽的不同于符号.

```text
#D                      Source operand is a denormal value.
```

```text
#U                      Result is too small for destination format.
```

```text
#O                      Result is too large for destination format.
```

```text
#P                      Value cannot be represented exactly in destination format.
```
