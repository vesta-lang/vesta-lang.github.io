---
summary: 存储 MXCSR 注册状态
---

## 说明

将 MXCSR 控制和状态登记册的内容存储到 目标操作数 。 目标操作数是一个32位的内存位置. MXCSR寄存器中保留的位数为0s. 此指令的操作在非64位模式和64位模式中是相同的. VEX.L必须是0,否则指令会#UD. 说明: 在VEX-encoded版本中,VEX.vvvv是保留的,必须是1111b,否则指令会#UD.

## 行动

```text
m32 := MXCSR;
```

## Intel C/C++ 内在编译器

```c
_mm_getcsr(void);
```

## SIMD 浮点 例外

None.

## 其他例外

见表2-22,"第5类例外条件",另外:

```text
#UD                  If VEX.L= 1,
```

```text
                     If VEX.vvvv  1111B.
```
