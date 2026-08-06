---
summary: 比较 标量 命令的 双精度浮点 值和设置 EFLAGS
---

## 说明

比较操作数 1(第一操作数)和操作数 2(第二操作数)的低四字中的双精度浮点值,并根据结果(无顺序,大于,小于,或等于)在EFLAGS登记册中设置ZF,PF和CF旗. EFLAGS登记册中的OF、SF和AF旗帜被设定为0。 如果 源操作数 是 NaN( QNaN 或 SNaN) , 则返回未排序的结果 。

操作数 1是一个XMM的寄存器;操作数 2可以是XMM寄存器或64位内存位置. COMISD指令与UCOMISD指令不同,因为它在源操作数为QNaN或SNaN时,表示SIMD 浮点无效操作例外(#I). UCOMISD指令只表示一个源操作数是SNaN的无效操作例外.

EFLAGS 寄存器如果生成未卸载的 SIMD 浮点 例外,则不更新.

VEX.vvvv和EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

软件应确保VCOMISD的编码与VEX.L=0. 用 VEX.L = 1 编码 VCOMISD 可能会在不同处理器代代遇到不可预测的行为.

## 行动

```text
COMISD (All Versions)
RESULT :=OrderedCompare(DEST[63:0] <> SRC[63:0]) {
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
VCOMISD int _mm_comi_round_sd(__m128d a, __m128d b, int imm, int sae);
VCOMISD int _mm_comieq_sd (__m128d a, __m128d b) VCOMISD int _mm_comilt_sd (__m128d a, __m128d b) VCOMISD int _mm_comile_sd (__m128d a, __m128d b) VCOMISD int _mm_comigt_sd (__m128d a, __m128d b) VCOMISD int _mm_comige_sd (__m128d a, __m128d b) VCOMISD int _mm_comineq_sd (__m128d a, __m128d b);
```

## SIMD 浮点 例外

无效(如果是SNaN或QNaN 操作数),异常.

## 其他例外

VEX-encoded指令,参见表2-20"第3类例外条件".

EVEX-encoded 指令,参见表2-50,"Type E3NF Class Exception Centers".

Additionally:

```text
#UD               If VEX.vvvv != 1111B or EVEX.vvvv != 1111B.
```
