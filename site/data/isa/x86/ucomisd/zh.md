---
summary: 无序比较 标量 双精度浮点 值和设置 EFLAGS
---

## 说明

对操作数 1(第一操作数)和操作数 2(第二操作数)的低四字中的双精度浮点值进行无序比较,并根据结果(无序,大于,少于,或等于)在EFLAGS登记册中设置ZF,PF和CF旗. EFLAGS登记册中的OF、SF和AF旗帜被设定为0。 如果 源操作数 是 NaN( QNaN 或 SNaN) , 则返回未排序的结果 。

Operand 1 is an XMM register; operand 2 can be an XMM register or a 64 bit memory

location.

UCOMISD指令与COMISD指令的不同之处在于,它只当一个源操作数是SNaN时,才表示一个SIMD 浮点无效的操作例外(#I). COMISD指令只表示一个源操作数是SNaN或QNaN的无效操作例外.

EFLAGS 寄存器如果生成未卸载的 SIMD 浮点 例外,则不更新.

说明: VEX.vvvv和EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

软件应确保VCOMISD的编码与VEX.L=0. 用 VEX.L = 1 编码 VCOMISD 可能会在不同处理器代代遇到不可预测的行为.

## 行动

```text
(V)UCOMISD (All Versions)
RESULT := UnorderedCompare(DEST[63:0] <> SRC[63:0]) {
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
VUCOMISD int _mm_comi_round_sd(__m128d a, __m128d b, int imm, int sae);
UCOMISD int _mm_ucomieq_sd(__m128d a, __m128d b) UCOMISD int _mm_ucomilt_sd(__m128d a, __m128d b) UCOMISD int _mm_ucomile_sd(__m128d a, __m128d b) UCOMISD int _mm_ucomigt_sd(__m128d a, __m128d b) UCOMISD int _mm_ucomige_sd(__m128d a, __m128d b) UCOMISD int _mm_ucomineq_sd(__m128d a, __m128d b);
```

## SIMD 浮点 例外

无效( 如果 SNaN 操作数), 异常 。

## 其他例外

VEX-encoded 指令,参见表2-20,"第3类例外条件",另外:

```text
#UD               If VEX.vvvv != 1111B.
```

EVEX-encoded 指令,参见表2-50,"Type E3NF Class Exception Centers".
