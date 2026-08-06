---
summary: Zero XMM, YMM y Registros ZMM
---

## Descripción

En modo de 64 bits, la instrucción ceros XMM0-XMM15, YMM0-YMM15 y ZMM0-ZMM15. En el exterior del modo 64-bit, se cero sólo XMM0-XMM7, YMM0-YMM7, y ZMM0-ZMM7. VZEROALL no modifica ZMM16-ZMM31.

Nota: VEX.vvvv está reservado y debe ser 1111b, de lo contrario las instrucciones #UD. En Compatibilidad y modo de 32 bits heredado sólo se modifican los 8 registros inferiores.

## Operación

```text
simd_reg_file[][] is a two dimensional array representing the SIMD register file containing all the overlapping xmm, ymm, and zmm
registers present in that implementation. The major dimension is the register number: 0 for xmm0, ymm0, and zmm0; 1 for xmm1,
ymm1, and zmm1; etc. The minor dimension size is the width of the implemented SIMD state measured in bits. On a machine
supporting Intel AVX-512, the width is 512.

VZEROALL (VEX.256 encoded version)
IF (64-bit mode)

    limit :=15
ELSE

    limit := 7
FOR i in 0 .. limit:

    simd_reg_file[i][MAXVL-1:0] := 0
```

## Intel C/C++ compilador intrínseco

```c
VZEROALL:    _mm256_zeroall();
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-25, "Tipo 8 Condiciones de Excepción de Clase".
