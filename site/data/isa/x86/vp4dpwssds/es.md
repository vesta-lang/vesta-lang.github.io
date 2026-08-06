---
summary: Producto de las palabras firmadas con acumulación de Dword y saturación
---

## Descripción

Esta instrucción compute 4 secuencial registro fuente-block dot-products de dos palabras firmadas operandos con acumulación de doble palabra y saturación firmada. El operando de memoria se selecciona secuencialmente en cada uno de los cuatro pasos.

En el cuadro anterior, la notación de "+3" se utiliza para denotar que la instrucción accede a 4 registros de fuentes basados en ese operando; las fuentes son consecutivas, comienzan en un múltiplo de 4 límites, y contienen el registro codificado operando.

Esta instrucción admite la supresión de la falla de memoria. Todo el operando de memoria está cargado si cualquier parte de los 16 bits más bajos de la máscara se fija a 1 o si se utiliza una codificación "sin máscaras".

El tipo tuple Tuple1 4X implica que cuatro elementos de 32 bits (16 bytes) se refieren a la parte de operación de memoria de esta instrucción.

## Operación

```text
src_reg_id is the 5 bit index of the vector register specified in the instruction as the src1 register.

VP4DPWSSDS dest, src1, src2
(KL,VL) = (16,512)
N := 4

ORIGDEST := DEST
src_base := src_reg_id & ~ (N-1) // for src1 operand

FOR i := 0 to KL-1:
    IF k1[i] or *no writemask*:
         FOR m := 0 to N-1:
               t := SRC2.dword[m]
               p1dword := reg[src_base+m].word[2*i] * t.word[0]
               p2dword := reg[src_base+m].word[2*i+1] * t.word[1]
               DEST.dword[i] := SIGNED_DWORD_SATURATE(DEST.dword[i] + p1dword + p2dword)
    ELSE IF *zeroing*:
         DEST.dword[i] := 0
    ELSE
         DEST.dword[i] := ORIGDEST.dword[i]

DEST[MAX_VL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VP4DPWSSDS __m512i _mm512_4dpwssds_epi32(__m512i, __m512ix4, __m128i *);
VP4DPWSSDS __m512i _mm512_mask_4dpwssds_epi32(__m512i, __mmask16, __m512ix4, __m128i *);
VP4DPWSSDS __m512i _mm512_maskz_4dpwssds_epi32(__mmask16, __m512i, __m512ix4, __m128i *);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

See Type E4; additionally:

```text
#UD               If the EVEX broadcast bit is set to 1.
```

```text
#UD               If the MODRM.mod = 0b11.
```
