---
summary: Prueba de bit empaquetado
---

## Descripción

VTESTPS realiza una comparación bitwise de todos los bits de señal de los elementos de precisión individuales empaquetados en la operación de primera fuente y bits de señal correspondientes en el segundo operando de origen. Si el AND de la fuente bits de señal con los bits de signo de dest produce todos los ceros, el ZF se establece de lo contrario el ZF está claro. Si el AND de la fuente bits de señal con los bits de signo de dest invertido produce todos los ceros el CF se establece de lo contrario el CF está claro. Un intento de ejecutar VTESTPS con VEX.W=1 causará #UD.

VTESTPD realiza una comparación bitwise de todos los bits de signos de los elementos de doble precisión en la operación de primera fuente y los bits de señal correspondientes en el segundo operando de origen. Si el AND de la fuente bits de señal con los bits de signo de dest produce todos los ceros, el ZF se establece de lo contrario el ZF está claro. Si el AND el signo fuente bits con los bits de signo de dest invertido produce todos los ceros el CF se establece de lo contrario el CF está claro. Un intento de ejecutar VTESTPS con VEX.W=1 causará #UD.

El registro de primera fuente se especifica en el campo de regre ModR/M.

Versión 128-bit: El primer registro de origen es un registro XMM. El segundo registro de fuente puede ser un registro XMM o una ubicación de memoria de 128 bits. El registro de destino no está modificado.

VEX.256 versión codificada: El primer registro de origen es un registro YMM. El segundo registro de fuente puede ser un registro YMM o una ubicación de memoria de 256 bits. El registro de destino no está modificado.

Nota: En VEX-versiones codificadas, VEX.vvvv está reservado y debe ser 1111b, de lo contrario las instrucciones #UD.

## Operación

```text
VTESTPS (128-bit version)
TEMP[127:0] := SRC[127:0] AND DEST[127:0]
IF (TEMP[31] = TEMP[63] = TEMP[95] = TEMP[127] = 0)

    THEN ZF := 1;
    ELSE ZF := 0;

TEMP[127:0] := SRC[127:0] AND NOT DEST[127:0]
IF (TEMP[31] = TEMP[63] = TEMP[95] = TEMP[127] = 0)

    THEN CF := 1;
    ELSE CF := 0;
DEST (unmodified)
AF := OF := PF := SF := 0;

VTESTPS (VEX.256 encoded version)
TEMP[255:0] := SRC[255:0] AND DEST[255:0]
IF (TEMP[31] = TEMP[63] = TEMP[95] = TEMP[127]= TEMP[160] =TEMP[191] = TEMP[224] = TEMP[255] = 0)

    THEN ZF := 1;
    ELSE ZF := 0;

TEMP[255:0] := SRC[255:0] AND NOT DEST[255:0]
IF (TEMP[31] = TEMP[63] = TEMP[95] = TEMP[127]= TEMP[160] =TEMP[191] = TEMP[224] = TEMP[255] = 0)

    THEN CF := 1;
    ELSE CF := 0;
DEST (unmodified)
AF := OF := PF := SF := 0;

VTESTPD (128-bit version)
TEMP[127:0] := SRC[127:0] AND DEST[127:0]
IF ( TEMP[63] = TEMP[127] = 0)

    THEN ZF := 1;
    ELSE ZF := 0;

TEMP[127:0] := SRC[127:0] AND NOT DEST[127:0]
IF ( TEMP[63] = TEMP[127] = 0)

    THEN CF := 1;
    ELSE CF := 0;
DEST (unmodified)
AF := OF := PF := SF := 0;

VTESTPD (VEX.256 encoded version)
TEMP[255:0] := SRC[255:0] AND DEST[255:0]
IF (TEMP[63] = TEMP[127] = TEMP[191] = TEMP[255] = 0)

    THEN ZF := 1;
    ELSE ZF := 0;

TEMP[255:0] := SRC[255:0] AND NOT DEST[255:0]
IF (TEMP[63] = TEMP[127] = TEMP[191] = TEMP[255] = 0)

    THEN CF := 1;
    ELSE CF := 0;
DEST (unmodified)
AF := OF := PF := SF := 0;
```

## Intel C/C++ compilador intrínseco

```c
VTESTPS int _mm256_testz_ps (__m256 s1, __m256 s2);
int _mm256_testc_ps (__m256 s1, __m256 s2);
int _mm256_testnzc_ps (__m256 s1, __m128 s2);
int _mm_testz_ps (__m128 s1, __m128 s2);
int _mm_testc_ps (__m128 s1, __m128 s2);
int _mm_testnzc_ps (__m128 s1, __m128 s2);
VTESTPD int _mm256_testz_pd (__m256d s1, __m256d s2);
int _mm256_testc_pd (__m256d s1, __m256d s2);
int _mm256_testnzc_pd (__m256d s1, __m256d s2);
int _mm_testz_pd (__m128d s1, __m128d s2);
int _mm_testc_pd (__m128d s1, __m128d s2);
int _mm_testnzc_pd (__m128d s1, __m128d s2);
```

## Banderas afectadas

Las banderas OF, AF, PF, SF se limpian y las banderas ZF, CF se establecen según la operación.

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-21, "Tipo 4 Condiciones de Excepción".

Additionally:

```text
#UD               If VEX.vvvv  1111B.
```

If VEX.W = 1 for VTESTPS or VTESTPD.
