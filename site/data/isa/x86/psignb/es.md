---
summary: Embalado SIGN
---

## Descripción

(V)PSIGNB/(V)PSIGNW/(V)PSIGND niega cada elemento de datos del operando de destino (el primer operando) si el valor entero firmado del elemento de datos correspondiente en el operando de origen (el segundo operando) es inferior a cero. Si el valor entero firmado de un elemento de datos en el operando de origen es positivo, el elemento de datos correspondiente en el operando de destino no se cambia. Si un elemento de datos en el operando de origen es cero, el elemento de datos correspondiente en el operando de destino se establece a cero.

(V)PSIGNB opera en bytes firmados. (V)PSIGNW funciona con palabras firmadas de 16 bits. (V)PSIGND opera en enteros firmados de 32 bits.

Legacy SSE instrucciones: Ambos operandos pueden ser registros MMX. En modo de 64 bits, utilice el prefijo REX para acceder a registros adicionales.

128-bit Legacy SSE versión: La primera fuente y operandos de destino son registros XMM. El segundo operando de origen es un registro XMM o una ubicación de memoria de 128 bits. Bits (MAXVL-1:128) del correspondiente registro de destino YMM no se modifican.

VEX.128 versión codificada: La primera fuente y operandos de destino son registros XMM. El segundo operando de origen es un registro XMM o una ubicación de memoria de 128 bits. Bits (MAXVL-1:128) del destino YMM registro se ponen a cero. VEX.L debe ser 0, de lo contrario las instrucciones #UD.

VEX.256 versión codificada: La primera fuente y operandos de destino son registros YMM. El segundo operando de origen es un registro YMM o una ubicación de memoria de 256 bits.

## Operación

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

## Intel C/C++ compilador intrínseco

```c
PSIGNB __m64 _mm_sign_pi8 (__m64 a, __m64 b) (V)PSIGNB __m128i _mm_sign_epi8 (__m128i a, __m128i b) VPSIGNB __m256i _mm256_sign_epi8 (__m256i a, __m256i b) PSIGNW __m64 _mm_sign_pi16 (__m64 a, __m64 b) (V)PSIGNW __m128i _mm_sign_epi16 (__m128i a, __m128i b) VPSIGNW __m256i _mm256_sign_epi16 (__m256i a, __m256i b) PSIGND __m64 _mm_sign_pi32 (__m64 a, __m64 b) (V)PSIGND __m128i _mm_sign_epi32 (__m128i a, __m128i b) VPSIGND __m256i _mm256_sign_epi32 (__m256i a, __m256i b);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-21, "Tipo 4 Condiciones de Excepción", además:

```text
#UD               If VEX.L = 1.
```
