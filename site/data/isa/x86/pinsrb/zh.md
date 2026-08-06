---
summary: 插入字节/字节/字节
---

## 说明

复制源操作数(第二代操作数)的字节/dword/qword,并在与伯爵操作数(第三代操作数)指定的位置插入目标操作数(第一代操作数). (目的地寄存器中的其他元素不动. ) 源操作数可以是通用寄存器或内存位置. (当源操作数是一个通用寄存器时,PINSRB复制了寄存器的低字节. ) 目标操作数是一个XMM寄存器. 计数操作数为8位即时. 在 XMM 记录器中指定 qword[dword,字节] 位置时, 操作数 计数的 [2, 4] 最小位指定位置 。

在64位模式中,没有用VEX/EVEX编码,使用REX前缀形式为REX.R,允许此指令访问额外的注册(XMM8-XMM15,R8-15). 使用REX.W允许使用64位普通用途登记册。

128位遗产 SSE 版本 : 相应的YMM目的地注册保持不变的位数(MAXVL-1:128).

VEX.128 编码版本 : 目的地的位数(MAXVL-1:128)登记被清零. VEX.L必须是0,否则指令会#UD. 在非64位模式下试图执行VPINSRQ将导致#UD.

EVEX.128 编码版本 : 目的地的位数(MAXVL-1:128)登记被清零. EVEX.L'L必须是0,否则指令会#UD.

## 行动

```text
CASE OF

    PINSRB: SEL := COUNT[3:0];
                MASK := (0FFH << (SEL * 8));
                TEMP := (((SRC[7:0] << (SEL *8)) AND MASK);

    PINSRD: SEL := COUNT[1:0];
                MASK := (0FFFFFFFFH << (SEL * 32));
                TEMP := (((SRC << (SEL *32)) AND MASK) ;

    PINSRQ: SEL := COUNT[0]
                MASK := (0FFFFFFFFFFFFFFFFH << (SEL * 64));
                TEMP := (((SRC << (SEL *64)) AND MASK) ;

ESAC;
          DEST := ((DEST AND NOT MASK) OR TEMP);

VPINSRB (VEX/EVEX Encoded Version)
SEL := imm8[3:0]
DEST[127:0] := write_b_element(SEL, SRC2, SRC1)
DEST[MAXVL-1:128] := 0

VPINSRD (VEX/EVEX Encoded Version)
SEL := imm8[1:0]
DEST[127:0] := write_d_element(SEL, SRC2, SRC1)
DEST[MAXVL-1:128] := 0

VPINSRQ (VEX/EVEX Encoded Version)
SEL := imm8[0]
DEST[127:0] := write_q_element(SEL, SRC2, SRC1)
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ 内在编译器

```c
PINSRB __m128i _mm_insert_epi8 (__m128i s1, int s2, const int ndx);
PINSRD __m128i _mm_insert_epi32 (__m128i s2, int s, const int ndx);
PINSRQ __m128i _mm_insert_epi64(__m128i s2, __int64 s, const int ndx);
```

## 受影响的旗帜

None.

## SIMD 浮点 例外

None.

## 其他例外

EVEX-encoded 指令,参见表2-22,"第5类例外条件".

EVEX-encoded discription,参见表2-59"Type E9NF类例外条件".

Additionally:

```text
#UD               If VEX.L = 1 or EVEX.L'L > 0.
```
