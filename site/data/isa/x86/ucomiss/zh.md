---
summary: 无序比较 标量 单精度浮点 值和设置 EFLAGS
---

## 说明

比较操作数 1(第一操作数)和操作数 2(第二操作数)的低双词中的单精度浮点值,并根据结果(无顺序,大于,小于,或等于)在EFLAGS登记册中设置ZF,PF和CF旗. EFLAGS登记册中的OF、SF和AF旗帜被设定为0。 如果 源操作数 是 NaN( QNaN 或 SNaN) , 则返回未排序的结果 。

操作数 1是一个XMM的寄存器;操作数 2可以是XMM寄存器或32位内存位置.

UCOMISS指令与COMISS指令不同,因为它只表示一个SIMD 浮点无效的操作例外(#I),只要一个源操作数是SNaN. COMISS指令在源操作数为QNaN或SNaN时表示无效操作例外.

EFLAGS 寄存器如果生成未卸载的 SIMD 浮点 例外,则不更新.

说明: VEX.vvvv和EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

软件应确保VCOMISS的编码与VEX.L=0. 用 VEX.L = 1 编码 VCOMISS 可能会在不同处理器代代遇到不可预测的行为.

## 行动

```text
(V)UCOMISS (All Versions)
RESULT := UnorderedCompare(DEST[31:0] <> SRC[31:0]) {
(* Set EFLAGS *) CASE (RESULT) OF

    UNORDERED: ZF,PF,CF := 111;
    GREATER_THAN: ZF,PF,CF := 000;
    LESS_THAN: ZF,PF,CF := 001;
    EQUAL: ZF,PF,CF := 100;
ESAC;
OF, AF, SF := 0; }
```

## Intel C/C++ 内在编译器

```c
VUCOMISS     int _mm_comi_round_ss(__m128 a, __m128 b, int imm, int sae);
UCOMISS      int _mm_ucomieq_ss(__m128 a, __m128 b);
UCOMISS      int _mm_ucomilt_ss(__m128 a, __m128 b);
UCOMISS      int _mm_ucomile_ss(__m128 a, __m128 b);
UCOMISS  int _mm_ucomigt_ss(__m128 a, __m128 b);
UCOMISS  int _mm_ucomige_ss(__m128 a, __m128 b);
UCOMISS  int _mm_ucomineq_ss(__m128 a, __m128 b);
```

## SIMD 浮点 例外

无效( 如果 SNaN 操作数), 异常 。

## 其他例外

VEX-encoded 指令,参见表2-20,"第3类例外条件",另外:

```text
#UD               If VEX.vvvv != 1111B.
```

EVEX-encoded 指令,参见表2-50,"Type E3NF Class Exception Centers".
