---
summary: 无序比较 标量 FP16 值和设置 EFLAGS
---

## 说明

本指令比较了操作数 1(第一操作数)和操作数 2(第二操作数)的低词中的FP16值,并根据结果(无序,大于,少于,或等于)在EFLAGS登记册中设置ZF,PF和CF旗. EFLAGS登记册中的 OF, SF 和 AF 旗帜被设定为 0 。 如果 源操作数 是 NaN( QNaN 或 SNaN) , 则返回未排序的结果 。

操作数 1是一个XMM登记册;操作数 2可以是XMM登记册或16位内存位置.

VUCOMISH指令与VCOMISH指令不同,因为它只表示一个SIMD 浮点无效的操作例外(#I),只要一个源操作数是SNaN. COMISS指令表示一个源操作数是QNaN或SNaN时的无效数字例外.

EFLAGS 寄存器如果生成未卸载的 SIMD 浮点 例外,则不更新. EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

## 行动

```text
VUCOMISH
RESULT := UnorderedCompare(SRC1.fp16[0],SRC2.fp16[0])
if RESULT is UNORDERED:

    ZF, PF, CF := 1, 1, 1
else if RESULT is GREATER_THAN:

    ZF, PF, CF := 0, 0, 0
else if RESULT is LESS_THAN:

    ZF, PF, CF := 0, 0, 1
else: // RESULT is EQUALS

    ZF, PF, CF := 1, 0, 0

OF, AF, SF := 0, 0, 0
```

## Intel C/C++ 内在编译器

```c
VUCOMISH int _mm_ucomieq_sh (__m128h a, __m128h b);
VUCOMISH int _mm_ucomige_sh (__m128h a, __m128h b);
VUCOMISH int _mm_ucomigt_sh (__m128h a, __m128h b);
VUCOMISH int _mm_ucomile_sh (__m128h a, __m128h b);
VUCOMISH int _mm_ucomilt_sh (__m128h a, __m128h b);
VUCOMISH int _mm_ucomineq_sh (__m128h a, __m128h b);
```

## SIMD 浮点 例外

Invalid, Denormal.

## 其他例外

EVEX-encoded 指令,参见表2-50,"Type E3NF Class Exception Centers".
