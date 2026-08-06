---
summary: 装入 MXCSR 登记册
---

## 说明

将 源操作数 装入 MXCSR 控制/状态登记册。 源操作数是一个32位的内存位置. 见英特尔(R)64和IA-32架构软件开发者手册第1卷第10章中的"MXCSR控制与状态登记册",关于MXCSR登记册及其内容的说明.

LDMXCSR指令一般与(V)STMXCSR指令结合使用,该指令将MXCSR寄存器的内容存储在内存中.

重置时默认的MXCSR值为1F80H.

如果a(V)LDMXCSR指令清除一个SIMD 浮点例外罩位并设置相应的例外旗位,则不会立即生成一个SIMD 浮点例外. 只有在符合以下两项条件的下一个指令执行时才会产生例外:

* 指令必须在 XMM 或 YMM 登记器 操作数 上运行, * 指示导致报告特定的SIMD 浮点例外。

此指令的操作在非64位模式和64位模式中是相同的.

如果VLDMXCSR被用VEX.L=1编码,试图执行用VEX.L=1编码的指令,将导致#UD例外.

说明: 在VEX-encoded版本中,VEX.vvvv是保留的,必须是1111b,否则指令会#UD.

## 行动

```text
MXCSR := m32;

C/C++ Compiler Intrinsic Equivalent
_mm_setcsr(unsigned int i)
```

## 数字例外

None.

## 其他例外

见表2-22,"第5类例外条件",另外:

```text
#GP                 For an attempt to set reserved bits in MXCSR.
```

```text
#UD                 If VEX.vvvv  1111B.
```
