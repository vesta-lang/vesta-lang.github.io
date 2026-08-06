---
summary: Producto de las palabras firmadas con acumulación de Dword (4-Iteraciones)
---

## Descripción

Esta instrucción compute 4 secuencial registro fuente-block dot-products de dos palabras firmadas operandos con acumulación de doble palabra; ver Figura 8-1 abajo. El operando de memoria se selecciona secuencialmente en cada uno de los cuatro pasos.

En el cuadro anterior, la notación de "+3" se utiliza para denotar que la instrucción accede a 4 registros de fuentes basados en ese operando; las fuentes son consecutivas, comienzan en un múltiplo de 4 límites, y contienen el registro codificado operando.

Esta instrucción admite la supresión de la falla de memoria. Todo el operando de memoria está cargado si cualquier parte de los 16 bits más bajos de la máscara se fija a 1 o si se utiliza una codificación "sin máscaras".

El tipo tuple Tuple1 4X implica que cuatro elementos de 32 bits (16 bytes) se refieren a la parte de operación de memoria de esta instrucción.

```text
                                    16b       16b                              16b       16b
```

```text
                                    a3        a2                               a1        a0
```

```text
                                    b1        b0                               b1        b0
```

```text
                                         32b                                        32b
                                         c1                                         c0
```

```text
                                    c1=c1+a2*b0+a3*b1                          c0=c0+a0*b0+a1*b1
```

```text
                                         32b                                        32b
```

Figura 8-1. Registro Fuente-Block Dot Producto de dos operaciones de Word firmadas con acumulación de doble palabra1

NOTES: 1. Para fines de ilustración, una instancia de producto de punto de punto de origen se muestra fuera de los cuatro.

## Operación

```text
src_reg_id is the 5 bit index of the vector register specified in the instruction as the src1 register.

VP4DPWSSD dest, src1, src2

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
               DEST.dword[i] := DEST.dword[i] + p1dword + p2dword

    ELSE IF *zeroing*:
         DEST.dword[i] := 0

    ELSE
         DEST.dword[i] := ORIGDEST.dword[i]

DEST[MAX_VL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VP4DPWSSD __m512i _mm512_4dpwssd_epi32(__m512i, __m512ix4, __m128i *);
VP4DPWSSD __m512i _mm512_mask_4dpwssd_epi32(__m512i, __mmask16, __m512ix4, __m128i *);
VP4DPWSSD __m512i _mm512_maskz_4dpwssd_epi32(__mmask16, __m512i, __m512ix4, __m128i *);
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
