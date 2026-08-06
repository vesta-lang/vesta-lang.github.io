---
summary: Valores Permute entero
---

## Descripción

Permute 128 bit datos enteros deel primer operando de origen(segundooperando) ysegundo operando de origen(terceroperando) utilizando bits en los resultados inmediatos de 8 bits y almacenar enel operando de destino(primero)operando). El primer operando de origen es un registro YMM, el segundo operando de origen es un registro YMM o una ubicación de memoria de 256 bits, y el operando de destino es un registro YMM.

```text
             SRC2                       Y1                             Y0
```

```text
             SRC1                       X1                             X0
```

```text
             DEST                   X0, X1, Y0, or Y1                  X0, X1, Y0, or Y1
```

Figure 5-22. VPERM2I128 Operation

Imm8[1:0] selecciona la fuente para el primer destino campo de 128 bits, imm8[5:4] selecciona la fuente para el segundo campo de destino. Si se establece imm8[3], el campo de 128 bits bajo se pone a cero. Si imm8[7] se establece, el campo de alto 128 bits se pone a cero. VEX.L debe ser 1, de lo contrario la instrucción será #UD.

## Operación

```text
VPERM2I128
CASE IMM8[1:0] of
0: DEST[127:0] := SRC1[127:0]
1: DEST[127:0] := SRC1[255:128]
2: DEST[127:0] := SRC2[127:0]
3: DEST[127:0] := SRC2[255:128]
ESAC
CASE IMM8[5:4] of
0: DEST[255:128] := SRC1[127:0]
1: DEST[255:128] := SRC1[255:128]
2: DEST[255:128] := SRC2[127:0]
3: DEST[255:128] := SRC2[255:128]
ESAC
IF (imm8[3])
DEST[127:0] := 0
FI

IF (imm8[7])
DEST[255:128] := 0
FI
```

## Intel C/C++ compilador intrínseco

```c
VPERM2I128: __m256i _mm256_permute2x128_si256 (__m256i a, __m256i b, int control);
```

## SIMD coma flotante Excepciones

None

## Otras excepciones

Ver Tabla 2-23, "Tipo 6 Condiciones de Excepción de Clase".

Additionally:

```text
#UD                 If VEX.L = 0,
```

If VEX.W = 1.
