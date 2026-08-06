---
summary: 执行两轮 SHA256 操作
---

## 说明

SHA256RNDS2指令使用首个操作数的初始SHA256状态(C,D,G,H),第二个操作数的初始SHA256状态(A,B,E,F)进行2轮SHA256操作,并使用默认的操作数 xmm0进行下2个圆电文词和相应圆常数的预计算总和. 请注意,该指令只使用XMM0的两个下字。

更新后的SHA256状态(A,B,E,F)被写入第一个操作数,第二个操作数可以在以后的回合中作为更新的状态(C,D,G,H)使用.

## 行动

```text
SHA256RNDS2
A_0 := SRC2[127:96];
B_0 := SRC2[95:64];
C_0 := SRC1[127:96];
D_0 := SRC1[95:64];
E_0 := SRC2[63:32];
F_0 := SRC2[31:0];
G_0 := SRC1[63:32];
H_0 := SRC1[31:0];
WK0 := XMM0[31: 0];
WK1 := XMM0[63: 32];

FOR i = 0 to 1
    A_(i +1) := Ch (E_i, F_i, G_i) +1( E_i) +WKi+ H_i + Maj(A_i , B_i, C_i) +0( A_i);
    B_(i +1) := A_i;
    C_(i +1) := B_i ;
    D_(i +1) := C_i;
    E_(i +1) := Ch (E_i, F_i, G_i) +1( E_i) +WKi+ H_i + D_i;
    F_(i +1) := E_i ;
    G_(i +1) := F_i;
    H_(i +1) := G_i;

ENDFOR

DEST[127:96] := A_2;
DEST[95:64] := B_2;
DEST[63:32] := E_2;
DEST[31:0] := F_2;
```

## Intel C/C++ 内在编译器

```c
SHA256RNDS2 __m128i _mm_sha256rnds2_epu32(__m128i, __m128i, __m128i);
```

## 受影响的旗帜

None.

## SIMD 浮点 例外

None.

## 其他例外

参见表2-21"第4类例外条件".
