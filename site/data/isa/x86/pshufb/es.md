---
summary: Bytes de rifa empaquetado
---

## Descripción

PSHUFB (sin prefijo VEX o EVEX) realiza un shuffle in-place de bytes en el operando de destino (el primer operando) de acuerdo con la máscara de control de los shuffle en el operando de origen (el segundo operando). La instrucción permuta los datos en el operando de destino, dejando la máscara shuffle sin afectar. Si se establece el bit mas significativo (bit[7]) de cada byte de la máscara de control de los shuffle, entonces el cero constante está escrito en el byte de resultado. Cada byte en la máscara de control shuffle forma un índice para permutar el byte correspondiente en el operando de destino. El valor de cada índice es el menos significativo 3 bits (operación de 64 bits) o 4 bits (128 bits de operación) del byte de control del shuffle. Véase la Figura 4-15 para un ejemplo de operación de 64 bits.

Las formas de 128 bits de PSHUFB dejan bits MAXVL1:128 del registro de destino sin cambios. Se generará un operando de memoria de 128 bits en un límite de 16 bytes o una excepción de protección general (#GP). En modo de 64 bits, el prefijo REX se puede utilizar para acceder a XMM8-XMM15.

Los siguientes artículos se aplican a VPSHUFB, codificado con un prefijo VEX o EVEX:

* Cada una de estas formas utiliza bytes de control de shuffle en su segundo operando de origen para seleccionar qué bytes en la primera

operando de origen para copiar al operando de destino.

* Estas formas operan en uno, dos o cuatro "lanes" de 16 bytes. Al igual que con la forma de 128-bit de PSHUFB (arriba), el bajo

4 bits de cada byte control shuffle determina cuál de 16 bytes en un carril fuente se copia al byte apropiado en el carril de destino correspondiente.

* Las versiones de 128-bit y 256-bit de estas formas cero bits superiores en el registro de destino más allá del

La instrucción es tamaño de operando.

* El EVEX-versiones codificadas actualiza su destino condicionalmente con máscara de escritura k1.

## Operación

```text
PSHUFB (with 64-bit MMX operands)
TEMP := DEST
FOR destpos := 0 TO 7

    shufbyte := SRC.byte[destpos];
    IF shufbyte & 80H = 80H

          THEN DEST.byte[destpos] := 0;
          ELSE

                srcpos := shufbyte & 07H;
                DEST.byte[destpos] := TEMP.byte[srcpos];
    FI;

PSHUFB (with 128-bit SSE operands)
TEMP := DEST;
FOR destpos := 0 TO 15

    shufbyte := SRC.byte[destpos];
    IF shufbyte & 80H = 80H

          THEN DEST.byte[destpos] := 0;
          ELSE

                srcpos := shufbyte & 0FH;
                DEST.byte[destpos] := TEMP.byte[srcpos];
    FI;

VPSHUFB (VEX.128 encoded version)
FOR destpos := 0 TO 15

    shufbyte := SRC2.byte[destpos];
    IF shufbyte & 80H = 80H

          THEN DEST.byte[destpos] := 0;
          ELSE

                srcpos := shufbyte & 0FH;
                DEST.byte[destpos] := SRC1.byte[srcpos];
    FI;
DEST[MAXVL1:128] := 0;

VPSHUFB (VEX.256 encoded version)
FOR lane := 0 to 1

    FOR lanepos := 0 TO 15
          destpos := 16 * lane + lanepos;
          shufbyte := SRC2.byte[destpos];
          IF shufbyte & 80H = 80H
                THEN DEST.byte[destpos] := 0;
                ELSE
                      srcpos := 16 * lane + (shufbyte & 0FH);
                      DEST.byte[destpos] := SRC1.byte[srcpos];
          FI;

DEST[MAXVL1:256] := 0;


VPSHUFB (EVEX encoded versions)

// VL is 128, 256, or 512, depending on instruction encoding

// no masking if EVEX.aaa = 0; zeroing if EVEX.z = 1

FOR lane := 0 to VL/128  1

FOR lanepos := 0 TO 15

destpos := 16 * lane + lanepos;

IF no masking OR k[destpos] = 1  // using selected bit from k register

     THEN

     shufbyte := SRC2.byte[destpos];

     IF shufbyte & 80H = 80H

           THEN DEST.byte[destpos] := 0;

           ELSE

                        srcpos := 16 * lane + (shufbyte & 0FH);

                        DEST.byte[destpos] := SRC1.byte[srcpos];

     FI;

     ELSE IF zeroing             // if not zeroing, DEST.byte[destpos] is unchanged

     THEN DEST.byte[destpos] := 0;

FI;

DEST[MAXVL1:VL] := 0;

                        07H 07H  FFH                  MM2         01H   00H  00H          00H
                                                      80H

                        04H 01H  07H                  MM1         02H   02H  FFH          01H
                                                      03H

                                                      MM1

                        04H 04H  00H                  00H         FFH   01H  01H          01H

                                                Figure 4-15. PSHUFB with 64-Bit Operands
```

## Intel C/C++ compilador intrínseco

```c
VPSHUFB __m512i _mm512_shuffle_epi8(__m512i a, __m512i b);
VPSHUFB __m512i _mm512_mask_shuffle_epi8(__m512i s, __mmask64 k, __m512i a, __m512i b);
VPSHUFB __m512i _mm512_maskz_shuffle_epi8( __mmask64 k, __m512i a, __m512i b);
VPSHUFB __m256i _mm256_mask_shuffle_epi8(__m256i s, __mmask32 k, __m256i a, __m256i b);
VPSHUFB __m256i _mm256_maskz_shuffle_epi8( __mmask32 k, __m256i a, __m256i b);
VPSHUFB __m128i _mm_mask_shuffle_epi8(__m128i s, __mmask16 k, __m128i a, __m128i b);
VPSHUFB __m128i _mm_maskz_shuffle_epi8( __mmask16 k, __m128i a, __m128i b);
PSHUFB: __m64 _mm_shuffle_pi8 (__m64 a, __m64 b) (V)PSHUFB: __m128i _mm_shuffle_epi8 (__m128i a, __m128i b) VPSHUFB:__m256i _mm256_shuffle_epi8(__m256i a, __m256i b);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones no codificadas por EVEX, ver Tabla 2-21, "Tipo 4 Condiciones de Excepción de Clase." Instruccion codificada por EVEX, ver Excepciones Tipo E4NF.nb en Tabla 2-52, "Tipo E4NF Condiciones de Excepción de Clase".
