---
summary: 执行 SM4 四轮加密
---

## 说明

SM4RNDS4指令执行四轮SM4加密. 该指令在独立的128位车道上运行. 详情见:https://tools.ietf.org/html/draft-ribose-cfrg-sm4-10。 参见"VSM4KEY4-Perform Four rounds of SM4 密钥 Exploration" 对于"箱表".

## 行动

```text
// see the VSM4KEY4 instruction for the definition of ROL32, lower_t

define L_RND(dword):
    tmp := dword
    tmp := tmp ^ ROL32(dword, 2)
    tmp := tmp ^ ROL32(dword, 10)
    tmp := tmp ^ ROL32(dword, 18)
    tmp := tmp ^ ROL32(dword, 24)
    return tmp

define T_RND(dword):
    return L_RND(lower_t(dword))

define F_RND(X0, X1, X2, X3, round_key):
    return X0 ^ T_RND(X1 ^ X2 ^ X3 ^ round_key)


VSM4RNDS4 DEST, SRC1, SRC2
VL = (128, 256) // VEX versions
KL := VL/128

for i in 0..KL-1:
    P[0] := SRC1.xmm[i].dword[0]
    P[1] := SRC1.xmm[i].dword[1]
    P[2] := SRC1.xmm[i].dword[2]
    P[3] := SRC1.xmm[i].dword[3]

    C[0] := F_RND(P[0], P[1], P[2], P[3], SRC2.xmm[i].dword[0])
    C[1] := F_RND(P[1], P[2], P[3], C[0], SRC2.xmm[i].dword[1])
    C[2] := F_RND(P[2], P[3], C[0], C[1], SRC2.xmm[i].dword[2])
    C[3] := F_RND(P[3], C[0], C[1], C[2], SRC2.xmm[i].dword[3])

    DEST.xmm[i].dword[0] := C[0]
    DEST.xmm[i].dword[1] := C[1]
    DEST.xmm[i].dword[2] := C[2]
    DEST.xmm[i].dword[3] := C[3]

DEST[MAXVL-1:VL] := 0
```

## 受影响的旗帜

None.

## Intel C/C++ 内在编译器

```c
VSM4RNDS4 __m128i _mm_sm4rnds4_epi32 (__m128i __A, __m128i __B);
VSM4RNDS4 __m256i _mm256_sm4rnds4_epi32 (__m256i __A, __m256i __B);
```

## SIMD 浮点 例外

None.

## 其他例外

参见表2-23"第6类例外条件".
