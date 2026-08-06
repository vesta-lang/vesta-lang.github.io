---
summary: 移动字节遮罩 Op/ 64/ 32 位 CPUID
---

## 说明

创建由源操作数(第二操作数)每个字节中最显著位组成的遮罩,并存储结果为目标操作数(第一操作数)的低字节或单词.

字节口罩为8位为64位源操作数,16位为128位源操作数,32位为256位源操作数. 目标操作数是一个通用寄存器.

在64位模式下,指令可以访问额外的注册(XMM8-XMM15, R8-R15与 a 一起使用时REX.R前缀。 默认的操作数大小为64位,模式为64位.

遗产 SSE 版本 : 源操作数是一个MMX技术登记册.

128位遗产 SSE 版本 : 源操作数是一个XMM登记册.

VEX.128 编码版本 : 源操作数是一个XMM登记册.

VEX.256 编码版本 : 源操作数是一个YMM登记册.

说明: VEX.vvvv是保留的,必须是1111b.

## 行动

```text
PMOVMSKB (With 64-bit Source Operand and r32)

    r32[0] := SRC[7];
    r32[1] := SRC[15];
    (* Repeat operation for bytes 2 through 6 *)
    r32[7] := SRC[63];
    r32[31:8] := ZERO_FILL;


(V)PMOVMSKB (With 128-bit Source Operand and r32)
    r32[0] := SRC[7];
    r32[1] := SRC[15];
    (* Repeat operation for bytes 2 through 14 *)
    r32[15] := SRC[127];
    r32[31:16] := ZERO_FILL;

VPMOVMSKB (With 256-bit Source Operand and r32)
r32[0] := SRC[7];
r32[1] := SRC[15];
(* Repeat operation for bytes 3rd through 31*)
r32[31] := SRC[255];

PMOVMSKB (With 64-bit Source Operand and r64)
    r64[0] := SRC[7];
    r64[1] := SRC[15];
    (* Repeat operation for bytes 2 through 6 *)
    r64[7] := SRC[63];
    r64[63:8] := ZERO_FILL;

(V)PMOVMSKB (With 128-bit Source Operand and r64)
    r64[0] := SRC[7];
    r64[1] := SRC[15];
    (* Repeat operation for bytes 2 through 14 *)
    r64[15] := SRC[127];
    r64[63:16] := ZERO_FILL;

VPMOVMSKB (With 256-bit Source Operand and r64)
r64[0] := SRC[7];
r64[1] := SRC[15];
(* Repeat operation for bytes 2 through 31*)
r64[31] := SRC[255];
r64[63:32] := ZERO_FILL;
```

## Intel C/C++ 内在编译器

```c
PMOVMSKB int _mm_movemask_pi8(__m64 a) (V)PMOVMSKB int _mm_movemask_epi8 ( __m128i a) VPMOVMSKB int _mm256_movemask_epi8 ( __m256i a);
```

## 受影响的旗帜

None.

## 数字例外

None.

## 其他例外

见表2-24,"第7类例外条件",另外:

```text
#UD                 If VEX.vvvv  1111B.
```
