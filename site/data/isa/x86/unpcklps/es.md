---
summary: Mochila e Interleave Low valores en coma flotante de precisión simple empaquetados
---

## Descripción

Realiza un paquete entrelazado de los valores en coma flotante de precisión simple baja del primer operando de origen y el segundo operando de origen.

128-bit Legacy SSE versión: La segunda fuente puede ser un registro XMM o una ubicación de memoria de 128 bits. El destino no es distinto del registro XMM de primera fuente y los bits superiores (MAXVL-1:128) del destino de registro ZMM correspondiente no son modificados. Al desempacar desde un operando de memoria, una implementación puede buscar sólo los 64 bits apropiados; sin embargo, la alineación a los límites de 16 bytes y la comprobación normal de segmentos seguirá siendo aplicada.

VEX.128 versión codificada: El primer operando de origen es un registro XMM. El segundo operando de origen puede ser un registro XMM o una ubicación de memoria de 128 bits. El operando de destino es un registro XMM. Los bits superiores (MAXVL-1:128) del destino de registro ZMM correspondiente se ponen a cero.

VEX.256 versión codificada: El primer operando de origen es un registro YMM. El segundo operando de origen puede ser un registro YMM o una ubicación de memoria de 256 bits. El operando de destino es un registro YMM.

SRC1 X7  X6  X5  X4  X3                                                            X2  X1  X0

SRC2 Y7  Y6  Y5  Y4  Y3                                                            Y2  Y1  Y0

DEST Y5  X5  Y4  X4  Y1                                                            X1  Y0  X0

Figura 4-28. Operación VUNPCKLPS

EVEX.512 versión codificada: El primer operando de origen es un registro ZMM. El segundo operando de origen es un registro ZMM, una ubicación de memoria de 512 bits, o un vector de 512 bits emitido desde una ubicación de memoria de 32 bits. El operando de destino es un registro ZMM, actualizado condicionalmente utilizando máscara de escritura k1.

EVEX.256 versión codificada: El primer operando de origen es un registro YMM. El segundo operando de origen es un registro YMM, una ubicación de memoria de 256 bits, o un vector de 256 bits emitido desde una ubicación de memoria de 32 bits. El operando de destino es un registro YMM, actualizado condicionalmente utilizando máscara de escritura k1.

EVEX.128 versión codificada: El primer operando de origen es un registro XMM. El segundo operando de origen es un registro XMM, una ubicación de memoria de 128 bits, o un vector de 128 bits emitido desde una ubicación de memoria de 32 bits. El operando de destino es un registro XMM, actualizado condicionalmente utilizando máscara de escritura k1.

## Operación

```text
VUNPCKLPS (EVEX Encoded Version When SRC2 is a ZMM Register)
(KL, VL) = (4, 128), (8, 256), (16, 512)
IF VL >= 128

    TMP_DEST[31:0] := SRC1[31:0]
    TMP_DEST[63:32] := SRC2[31:0]
    TMP_DEST[95:64] := SRC1[63:32]
    TMP_DEST[127:96] := SRC2[63:32]
FI;
IF VL >= 256
    TMP_DEST[159:128] := SRC1[159:128]
    TMP_DEST[191:160] := SRC2[159:128]
    TMP_DEST[223:192] := SRC1[191:160]
    TMP_DEST[255:224] := SRC2[191:160]
FI;
IF VL >= 512
    TMP_DEST[287:256] := SRC1[287:256]
    TMP_DEST[319:288] := SRC2[287:256]
    TMP_DEST[351:320] := SRC1[319:288]
    TMP_DEST[383:352] := SRC2[319:288]
    TMP_DEST[415:384] := SRC1[415:384]
    TMP_DEST[447:416] := SRC2[415:384]
    TMP_DEST[479:448] := SRC1[447:416]
    TMP_DEST[511:480] := SRC2[447:416]
FI;
FOR j := 0 TO KL-1


     i := j * 32

     IF k1[j] OR *no writemask*

          THEN DEST[i+31:i] := TMP_DEST[i+31:i]

          ELSE

                  IF *merging-masking*           ; merging-masking

                      THEN *DEST[i+31:i] remains unchanged*

                      ELSE *zeroing-masking*     ; zeroing-masking

                      DEST[i+31:i] := 0

                  FI

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0

VUNPCKLPS (EVEX Encoded Version When SRC2 is Memory)

(KL, VL) = (4, 128), (8, 256), (16, 512)

FOR j := 0 TO KL-1

     i := j * 31

     IF (EVEX.b = 1)

          THEN TMP_SRC2[i+31:i] := SRC2[31:0]

          ELSE TMP_SRC2[i+31:i] := SRC2[i+31:i]

     FI;

ENDFOR;

IF VL >= 128

TMP_DEST[31:0] := SRC1[31:0]

TMP_DEST[63:32] := TMP_SRC2[31:0]

TMP_DEST[95:64] := SRC1[63:32]

TMP_DEST[127:96] := TMP_SRC2[63:32]

FI;

IF VL >= 256

     TMP_DEST[159:128] := SRC1[159:128]

     TMP_DEST[191:160] := TMP_SRC2[159:128]

     TMP_DEST[223:192] := SRC1[191:160]

     TMP_DEST[255:224] := TMP_SRC2[191:160]

FI;

IF VL >= 512

     TMP_DEST[287:256] := SRC1[287:256]

     TMP_DEST[319:288] := TMP_SRC2[287:256]

     TMP_DEST[351:320] := SRC1[319:288]

     TMP_DEST[383:352] := TMP_SRC2[319:288]

     TMP_DEST[415:384] := SRC1[415:384]

     TMP_DEST[447:416] := TMP_SRC2[415:384]

     TMP_DEST[479:448] := SRC1[447:416]

     TMP_DEST[511:480] := TMP_SRC2[447:416]

FI;

FOR j := 0 TO KL-1

     i := j * 32

     IF k1[j] OR *no writemask*

          THEN DEST[i+31:i] := TMP_DEST[i+31:i]

          ELSE

                  IF *merging-masking*           ; merging-masking

                      THEN *DEST[i+31:i] remains unchanged*

                      ELSE *zeroing-masking*     ; zeroing-masking

                      DEST[i+31:i] := 0

                  FI


    FI;
ENDFOR
DEST[MAXVL-1:VL] := 0

UNPCKLPS (VEX.256 Encoded Version)
DEST[31:0] := SRC1[31:0]
DEST[63:32] := SRC2[31:0]
DEST[95:64] := SRC1[63:32]
DEST[127:96] := SRC2[63:32]
DEST[159:128] := SRC1[159:128]
DEST[191:160] := SRC2[159:128]
DEST[223:192] := SRC1[191:160]
DEST[255:224] := SRC2[191:160]
DEST[MAXVL-1:256] := 0

VUNPCKLPS (VEX.128 Encoded Version)
DEST[31:0] := SRC1[31:0]
DEST[63:32] := SRC2[31:0]
DEST[95:64] := SRC1[63:32]
DEST[127:96] := SRC2[63:32]
DEST[MAXVL-1:128] := 0

UNPCKLPS (128-bit Legacy SSE Version)
DEST[31:0] := SRC1[31:0]
DEST[63:32] := SRC2[31:0]
DEST[95:64] := SRC1[63:32]
DEST[127:96] := SRC2[63:32]
DEST[MAXVL-1:128] (Unmodified)
```

## Intel C/C++ compilador intrínseco

```c
VUNPCKLPS __m512 _mm512_unpacklo_ps(__m512 a, __m512 b);
VUNPCKLPS __m512 _mm512_mask_unpacklo_ps(__m512 s, __mmask16 k, __m512 a, __m512 b);
VUNPCKLPS __m512 _mm512_maskz_unpacklo_ps(__mmask16 k, __m512 a, __m512 b);
VUNPCKLPS __m256 _mm256_unpacklo_ps (__m256 a, __m256 b);
VUNPCKLPS __m256 _mm256_mask_unpacklo_ps(__m256 s, __mmask8 k, __m256 a, __m256 b);
VUNPCKLPS __m256 _mm256_maskz_unpacklo_ps(__mmask8 k, __m256 a, __m256 b);
UNPCKLPS __m128 _mm_unpacklo_ps (__m128 a, __m128 b);
VUNPCKLPS __m128 _mm_mask_unpacklo_ps(__m128 s, __mmask8 k, __m128 a, __m128 b);
VUNPCKLPS __m128 _mm_maskz_unpacklo_ps(__mmask8 k, __m128 a, __m128 b);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Instrucciones no código EVEX, ver Tabla 2-21, "Tipo 4 Condiciones de Excepción de Clase".

Instrucciones codificadas por EVEX, ver Tabla 2-52, "Tipo E4NF Clase Condiciones de Excepción."

CHAPTER 5

5.1 TERNARY BIT VECTOR LOGIC TABLE

Las instrucciones VPTERNLOGD/VPTERNLOGQ funcionan con elementos dword/qword y toman tres bits de los elementos de datos de entrada respectivos para formar un conjunto de 32/64 índices, donde cada valor de 3 bits proporciona un índice en una tabla de búsqueda de 8 bits representada por el byte imm8 de la instrucción. Los 256 posibles valores del byte imm8 se construyen como una tabla lógica booleana de 16x16. Las 16 filas de la tabla usan los 4 bits inferiores de imm8 como índice de filas. Las 16 columnas son referenciadas por imm8[7:4]. Las 16 columnas de la tabla están presentes en dos mitades, con 8 columnas mostradas en la Tabla 5-1 para el valor índice de columnas entre 0:7, seguido por la Tabla 5-2 mostrando las 8 columnas correspondientes al índice de columna 8:15. Esta sección presenta los dos mitades de la tabla de entrada 256 utilizando una notación corta que representa expresiones lógicas booleanas simples o compuestas con tres datos de fuente de bits de entrada. Los tres datos de la fuente de bits de entrada serán denotados con las letras mayúsculas: A, B, C; donde A representa un poco del primer operando de origen (también el operando de destino), B y C representan un poco de la 2a y 3a operandos de origen. Cada entrada del mapa toma la forma de una expresión lógica que consiste en una de las expresiones más componentes. Cada expresión de componente consiste en un operador booleano no deseado o binario y operandos asociado. Cada operador booleano binario se expresa en letras minúsculas, y operandos concatenado después del operador lógico. The unary operator `not' is expressed using `!'. Además, la expresión condicional "A?B:C" expresa un resultado retornando B si se establece A, devolviendo C de otra manera. Un operador booleano binario es seguido por dos operandos, por ejemplo, yAB. Para una expresión binaria compuesta que contiene componentes comunicativos y que comprende el mismo operador lógico, se omite el 2o operador lógico y tres operandos se pueden concatenar en secuencia, por ejemplo, y ABC. Cuando el segundo operando de la primera expresión booleana binaria proviene del resultado de otra expresión booleana, la segunda expresión booleana se concatena después de la maleta superior operando de la primera expresión lógica, por ejemplo, norBnandAC. Cuando el resultado es independiente de un operando, que operando se omite en la expresión lógica, por ejemplo, ceros o norCB. La expresión de 3 entradas "majorABC" devuelve 0 si dos o más bits de entrada son 0, devuelve 1 si dos o más bits de entrada son 1. La expresión de 3 entradas "minorABC" devuelve 1 si dos o más bits de entrada son 0, devuelve 0 si dos o más bits de entrada son 1. Las funciones de lógica de bits de bloque de construcción utilizadas en la tabla 5-1 y la tabla 5-2 incluyen:

* Constantes: TRUE (1), FALSE (0); * Función siniestra: ¡No! * Funciones binarias: y, nand, o, ni, xor, xnor; * Función condicional: Seleccionar (?:); * Funciones terciarias: mayores, menores.

:              Cuadro 5-1. Bajo 8 columnas del 16x16 Mapa de VPTERNLOG Boolean Logic Operaciones

Imm [7:4] [3:0]00H 0H 1H 2H 3H 4H 5H 6H 7H 01H 02H FALSEandAnorBC norBnandAC andA!B norCnandBA yA!C yAxorBC yAnandBC03H 04HniABC norCB norBxorAC A?!B:norBC norCxorBA A?!C:norBC A?xorBC:norB A?nandBC:no05H 06HC rBC07H 08HandCnorBA norBxnorAC andC!B norBnorAC C?norBA:and C?norBA:A C?!B:andBA C?!09HBA0AH 0BHnorBA norBandAC C?!B:norBA !B C?norBA:xnor A?!C:!B A?xorBC:!B A?nandBC:!0CHBA0DH 0EHandBnorAC norCxnorBA B?norAC:y B?norAC:A andB!C norCnorBA B?!C:andAC B?!0FHAC

```text
        norCA      norCandBA  B?norAC:xnor A?!B:!C     B?!C:norAC !C                  A?xorBC:!C A?nandBC:!C
```

AC

```text
        norAxnorBC A?norBC:xorB B?norAC:C  xorBorAC    C?norBA:B xorCorBA             xorCB       B?!C:orAC
```

C

```text
        norAandBC minorABC    C?!B:!A      nandBorAC B?!C:!A      nandCorBA           A?xorBC:nan nandCB
```

dBC

```text
        norAnandBC A?norBC:and andCxorBA   A?!B:andBC  andBxorAC  A?!C:andBC          A?xorBC:and xorAandBC
                            BC                                                        BC
```

```text
        norAxorBC  A?norBC:xnor C?xorBA:norB A?!B:xnorBC B?xorAC:norA A?!C:xnorBC xnorABC         A?nandBC:xn
```

orBC

```text
                   BC         A                        C
```

```text
        andC!A     A?norBC:C andCnandBA A?!B:C         C?!A:andBA xorCA               xorCandBA A?nandBC:C
```

```text
        C?!A:norBA C?!A:!B    C?nandBA:no C?nandBA:!B B?xorAC:!A  B?xorAC:nan C?nandBA:xn nandBxnorAC
                              rBA                                 dAC                 orBA
```

```text
        andB!A     A?norBC:B B?!A:andAC xorBA          andBnandAC A?!C:B              xorBandAC A?nandBC:B
```

```text
        B?!A:norAC B?!A:!C    B?!A:xnorAC C?xorBA:nan B?nandAC:no B?nandAC:!C B?nandAC:xn nandCxnorBA
                                           dBA         rAC                            orAC
```

```text
        norAnorBC xorAorBC    B?!A:C       A?!B:orBC   C?!A:B     A?!C:orBC           B?nandAC:C A?nandBC:or
```

BC

```text
        !A         nandAorBC C?nandBA:!A nandBA        B?nandAC:!A nandCA             nandAxnorBC nandABC
```

La tabla 5-2 muestra la mitad del mapa de 256 entradas correspondiente a los valores índices de columna 8:15.

:               Cuadro 5-2. Alto 8 columnas del 16x16 Mapa de VPTERNLOG Boolean Logic Operaciones

Imm [7:4] [3:0]00H 08H 09H 0AH 0BH 0CH 0DH 0EH 0FH 01H 02HandABC andAxnorBC andCA B?andAC:A andBA C?andBA:A andAorBC A03H 04HA?andBC:nor B?andAC:!C A?C:norBC C?A:!B A?B:norBC B?A:!C xnorAorBC orAnorBC05HBC06H 07HandCxnorBA B?andAC:xor B?andAC:C B?andAC:orA C?xnorBA:an B?A:xorAC B?A:C B?A:orAC08HAC C dBA09H 0AHA?andBC:!B xnorBandAC A?C:!B nandBnandA xnorBA B?A:nandAC A?orBC:!B orA!B0BH C 0CH 0DHandBxnorAC C?andBA:xor B?xnorAC:an B?xnorAC:A C?andBA:B C?andBA:orB C?A:B C?A:orBA0EHBA dAC A0FH

```text
        A?andBC:!C xnorCandBA xnorCA       C?A:nandBA A?B:!C       nandCnandB A?orBC:!C            orA!C
```

A

```text
        A?andBC:xor xorABC      A?C:xorBC  B?xnorAC:orA A?B:xorBC  C?xnorBA:orB A?orBC:xorBC orAxorBC
        BC                                 C                       A
```

xnorAandBC A?xnorBC:na A?C:nandBC nandBxorAC A?B:nandBC nandCxorBA A?orBCnandB orAnandBC

```text
                ndBC                                                          C
```

```text
        andCB   A?xnorBC:an andCorAB       B?C:A     andBorAC      C?B:A      majorABC             orAandBC
```

dBC

```text
        B?C:norAC xnorCB        xnorCorBA C?orBA:!B  xnorBorAC B?orAC:!C      A?orBC:xnorB orAxnorBC
```

C

```text
        A?andBC:C A?xnorBC:C C             B?C:orAC  A?B:C         B?orAC:xorAC orCandBA           orCA
```

```text
        B?C:!A  B?C:nandAC orCnorBA        orC!B     B?orAC:!A     B?orAC:nand orCxnorBA           nandBnorAC
```

AC

```text
        A?andBC:B A?xnorBC:B A?C:B         C?orBA:xorBA B          C?B:orBA   orBandAC             orBA
```

```text
        C?B!A   C?B:nandBA C?orBA:!A       C?orBA:nand orBnorAC    orB!C      orBxnorAC nandCnorBA
```

BA

```text
        A?andBC:orB A?xnorBC:orB A?C:orBC  orCxorBA  A?B:orBC      orBxorAC   orCB                 orABC
        C       C
```

```text
        nandAnandB nandAxorBC orC!A        orCnandBA orB!A         orBnandAC nandAnorBC TRUE
```

C

El cuadro 5-1 y el cuadro 5-2 traducen cada uno del valor posible del byte imm8 a una expresión booleana. Estas tablas también se pueden utilizar por software para traducir expresiones booleanas a constantes numéricas para formar el valor imm8 necesario para construir la sintaxis VPTERNLOG. Hay un conjunto único de tres constantes de byte (F0H, CCH, AAH) que se pueden utilizar para este propósito como entrada operandos en conjunto con las expresiones booleanas definidas en esas tablas. La asignación inversa puede expresarse como:

Result_imm8 = Table_Lookup_Entry(0F0H, 0CCH, 0AAH)

Table Lookup Entry es la expresión booleana definida en Tabla 5-1 y Tabla 5-2.

5.2 INSTRUCTIONS (V)

El capítulo 5 continúa una discusión alfabética de las instrucciones Intel(R) 64 y IA-32 (V). Véase también: Capítulo 3, "Referencia del Conjunto de Instrucciones, A-L", en Intel(R) 64 e IA-32 Arquitecturas Software Manual del Desarrollador, Volumen

2A; Capítulo 5, "Instruction Set Reference, V", en Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 2B; y Capítulo 5, "Instruction Set Reference, V", en el Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 2D.
