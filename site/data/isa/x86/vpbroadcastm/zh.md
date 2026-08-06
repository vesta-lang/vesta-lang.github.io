---
summary: 广播遮罩到矢量记录
---

## 说明

广播源操作数(第二个操作数)低字节/字节的零延伸64/32比特值到目标操作数(第一个操作数)的每个64/32比特元素. 源操作数是一个opmask寄存器. 目标操作数是一个ZMM登记册(EVEX.512),YMM登记册(EVEX.256),或XMM登记册(EVEX.128).

EVEX.vvvv是保留的,必须是1111b,否则指令会#UD.

## 行动

```text
VPBROADCASTMB2Q
(KL, VL) = (2, 128), (4, 256), (8, 512)
FOR j := 0 TO KL-1

    i := j*64
    DEST[i+63:i] := ZeroExtend(SRC[7:0])
ENDFOR
DEST[MAXVL-1:VL] := 0


VPBROADCASTMW2D
(KL, VL) = (4, 128), (8, 256), (16, 512)
FOR j := 0 TO KL-1

    i := j*32
    DEST[i+31:i] := ZeroExtend(SRC[15:0])
ENDFOR
DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
VPBROADCASTMB2Q __m512i _mm512_broadcastmb_epi64( __mmask8);
VPBROADCASTMW2D __m512i _mm512_broadcastmw_epi32( __mmask16);
VPBROADCASTMB2Q __m256i _mm256_broadcastmb_epi64( __mmask8);
VPBROADCASTMW2D __m256i _mm256_broadcastmw_epi32( __mmask8);
VPBROADCASTMB2Q __m128i _mm_broadcastmb_epi64( __mmask8);
VPBROADCASTMW2D __m128i _mm_broadcastmw_epi32( __mmask8);
```

## SIMD 浮点 例外

None

## 其他例外

EVEX-encoded discription,参见表2-56"Type E6NF类例外条件".
