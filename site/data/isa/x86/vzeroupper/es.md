---
summary: Zero Upper Bits of YMM y ZMM Registers
---

## Descripción

En modo de 64 bits, la instrucción cero los bits en posiciones 128 y superiores en YMM0-YMM15 y ZMM0-ZMM15. Fuera del modo 64-bit, ceros esos bits sólo en YMM0-YMM7 y ZMM0-ZMM7. VZEROUPPER no modifica los 128 bits inferiores de estos registros y no modifica ZMM16-ZMM31.

Esta instrucción se recomienda cuando se transfiere entre AVX y el código SSE heredado; eliminará las penas de rendimiento causadas por falsas dependencias.

Nota: VEX.vvvv está reservado y debe ser 1111b instrucciones de lo contrario #UD. En Compatibilidad y modo de 32 bits heredado sólo se modifican los 8 registros inferiores.

## Operación

```text
simd_reg_file[][] is a two dimensional array representing the SIMD register file containing all the overlapping xmm, ymm, and zmm
registers present in that implementation. The major dimension is the register number: 0 for xmm0, ymm0, and zmm0; 1 for xmm1,
ymm1, and zmm1; etc. The minor dimension size is the width of the implemented SIMD state measured in bits.

VZEROUPPER
IF (64-bit mode)

    limit :=15
ELSE

    limit := 7
FOR i in 0 .. limit:

    simd_reg_file[i][MAXVL-1:128] := 0
```

## Intel C/C++ compilador intrínseco

```c
VZEROUPPER: _mm256_zeroupper();
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-25, "Tipo 8 Condiciones de Excepción de Clase".

CHAPTER 6

6.1 INSTRUCTIONS (W-Z)

El capítulo 6 continúa una discusión alfabética de las instrucciones Intel(R) 64 y IA-32 (W-Z). Véase también: Capítulo 3, "Instruction Set Reference, A-L", en el Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 2A; Capítulo 4, "Instruction Set Reference, M-U", en Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 2B; y Capítulo 5, "Instruction Set Reference, V", en el Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 2D.
