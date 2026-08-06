---
summary: 包装的 SIGN
---

## 说明

(V)PSIGNB/(V)PSIGNW/(V)PSIGND 否定了目的地运行符(第一个运行符)中每个数据元素,如果源运行符(第二个运行符)中对应数据元素的签名整数值小于零. 如果源操作数中一个数据元素的签名整数值为正数,则目标操作数中相应的数据元素不变. 如果源操作数中的数据元素为零,则目标操作数中的相应数据元素被设定为零.

(V)PSIGNB运行在已签名的字节上. (V)PSIGNW在16位签名单词上运行. (V)PSIGND在签名的32位整数上运行.

遗产 SSE 指令 : 两个操作数都可以是MMX注册. 在64位模式中,使用REX前缀访问额外的注册.

128位遗产 SSE 版本 : 第一个来源和目标操作数是XMM登记册. 第二源操作数是一个XMM的寄存器或128位的内存位置. 相应的YMM目的地注册保持不变的位数(MAXVL-1:128).

VEX.128 编码版本 : 第一个来源和目标操作数是XMM登记册. 第二源操作数是一个XMM的寄存器或128位的内存位置. 目的地YMM的位数(MAXVL-1:128)登记被清零. VEX.L必须是0,否则指令会#UD.

VEX.256 编码版本 : 第一个来源和目标操作数是YMM登记册. 第二源操作数是一个YMM的寄存器或256位的内存位置.

## 行动

```text
def byte_sign(control, input_val):
  if control<0:
    return negate(input_val)
  elif control==0:
    return 0
  return input_val

def word_sign(control, input_val):
  if control<0:
    return negate(input_val)
  elif control==0:
    return 0
  return input_val

def dword_sign(control, input_val):
  if control<0:
    return negate(input_val)
  elif control==0:
    return 0
  return input_val

PSIGNB srcdest, src // MMX 64-bit Operands
VL=64
KL := VL/8
for i in 0...KL-1:

  srcdest.byte[i] := byte_sign(src.byte[i], srcdest.byte[i])

PSIGNW srcdest, src // MMX 64-bit Operands
VL=64
KL := VL/16
FOR i in 0...KL-1:

  srcdest.word[i] := word_sign(src.word[i], srcdest.word[i])


PSIGND srcdest, src // MMX 64-bit Operands
VL=64
KL := VL/32
FOR i in 0...KL-1:

  srcdest.dword[i] := dword_sign(src.dword[i], srcdest.dword[i])

PSIGNB srcdest, src // SSE 128-bit Operands
VL=128
KL := VL/8
FOR i in 0...KL-1:

  srcdest.byte[i] := byte_sign(src.byte[i], srcdest.byte[i])

PSIGNW srcdest, src // SSE 128-bit Operands
VL=128
KL := VL/16
FOR i in 0...KL-1:

  srcdest.word[i] := word_sign(src.word[i], srcdest.word[i])

PSIGND srcdest, src // SSE 128-bit Operands
VL=128
KL := VL/32
FOR i in 0...KL-1:

  srcdest.dword[i] := dword_sign(src.dword[i], srcdest.dword[i])

VPSIGNB dest, src1, src2 // AVX 128-bit or 256-bit Operands
VL=(128,256)
KL := VL/8
FOR i in 0...KL-1:

  dest.byte[i] := byte_sign(src2.byte[i], src1.byte[i])
DEST[MAXVL-1:VL] := 0

VPSIGNW dest, src1, src2 // AVX 128-bit or 256-bit Operands
VL=(128,256)
KL := VL/16
FOR i in 0...KL-1:

  dest.word[i] := word_sign(src2.word[i], src1.word[i])
DEST[MAXVL-1:VL] := 0

VPSIGND dest, src1, src2 // AVX 128-bit or 256-bit Operands
VL=(128,256)
KL := VL/32
FOR i in 0...KL-1:

  dest.dword[i] := dword_sign(src2.dword[i], src1.dword[i])
DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
PSIGNB __m64 _mm_sign_pi8 (__m64 a, __m64 b) (V)PSIGNB __m128i _mm_sign_epi8 (__m128i a, __m128i b) VPSIGNB __m256i _mm256_sign_epi8 (__m256i a, __m256i b) PSIGNW __m64 _mm_sign_pi16 (__m64 a, __m64 b) (V)PSIGNW __m128i _mm_sign_epi16 (__m128i a, __m128i b) VPSIGNW __m256i _mm256_sign_epi16 (__m256i a, __m256i b) PSIGND __m64 _mm_sign_pi32 (__m64 a, __m64 b) (V)PSIGND __m128i _mm_sign_epi32 (__m128i a, __m128i b) VPSIGND __m256i _mm256_sign_epi32 (__m256i a, __m256i b);
```

## SIMD 浮点 例外

None.

## 其他例外

见表2-21,"第4类例外条件",另外:

```text
#UD               If VEX.L = 1.
```
