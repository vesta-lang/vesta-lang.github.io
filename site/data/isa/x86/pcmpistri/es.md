---
summary: Envasado Comparar Pendientes de longitud implícita, Índice de retorno
---

## Descripción

La instrucción compara datos de dos cadenas basadas en el valor codificado en el byte de control imm8 (ver Sección 4.1, "Imm8 Control Byte Operation for PCMPESTRI / PCMPESTRM / PCMPISTRI / PCMPISTRM"), y genera un índice almacenado a ECX.

Cada cadena está representada por un solo valor. El valor es un xmm (o posiblemente m128 para el segundo operando) que contiene los elementos de datos de la cadena (datos de byte o palabra). Cada byte/palabra de entrada se aumenta con una etiqueta válida/inválida. Un byte/palabra se considera válido sólo si tiene un índice más bajo que el byte/palabra null menos significativo. (El byte/palabra null menos significativo también se considera inválido.)

Las operaciones de comparación y agregación se realizan según el valor codificado de los campos de bits imm8 (véase la sección 4.1). El índice del primer (o último, según imm8[6]) conjunto bit de IntRes2 es devuelto en ECX. Si no hay bits en IntRes2, ECX se establece a 16 (8).

Tenga en cuenta que las Banderas Aritméticas están escritas de manera no estándar para suministrar la información más relevante:

```text
    CFlag  Reset if IntRes2 is equal to zero, set otherwise
    ZFlag  Set if any byte/word of xmm2/mem128 is null, reset otherwise
    SFlag  Set if any byte/word of xmm1 is null, reset otherwise
```

OFlag IntRes2[0]

```text
    AFlag  Reset
    PFlag  Reset
```

Nota: En VEX.128 versión codificada, VEX.vvvv está reservado y debe ser 1111b, VEX.L debe ser 0, de lo contrario la instrucción será #UD.

Efectivo tamaño de operando operando 1 operando 2 Resultado Modo operativo/tamaño xmm/m128 ECX 16 bit xmm/m128 ECX 32 bit xmm xmm/m128 ECX 64 bit

Intel C/C++ Compiler Equivalente Intrínseco para el índice de retorno int  mm cmpistri (  m128i a,   m128i b, modo int const);

Intel C/C++ Compiler Intrínseco para leer los resultados de EFlag

int  mm cmpistra (  m128i a,   m128i b, const int mode); int  mm cmpistrc (   m128i a,   m128i b, const int mode); int  mm cm pistro ( m128i a,   m128i b, const int moders)

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-21, "Tipo 4 Condiciones de Excepción", además, esta instrucción no causa #GP si el operando de memoria no está alineado a 16 Límites Byte, y:

```text
#UD               If VEX.L = 1.
```

```text
                  If VEX.vvvv  1111B.
```
