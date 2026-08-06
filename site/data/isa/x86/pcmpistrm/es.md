---
summary: Envasado Comparar Pendientes de longitud implícita, Máscara de retorno
---

## Descripción

La instrucción compara datos de dos cadenas basadas en el valor codificado en el byte imm8 (ver Sección 4.1, "Imm8 Control Byte Operation for PCMPESTRI / PCMPESTRM / PCMPISTRI / PCMPISTRM") generando una máscara almacenada a XMM0.

Cada cadena está representada por un solo valor. El valor es un xmm (o posiblemente m128 para el segundo operando) que contiene los elementos de datos de la cadena (datos de byte o palabra). Cada byte/palabra de entrada se aumenta con una etiqueta válida/inválida. Un byte/palabra se considera válido sólo si tiene un índice más bajo que el byte/palabra null menos significativo. (El byte/palabra null menos significativo también se considera inválido.)

La operación de comparación y agregación se realiza de acuerdo con el valor codificado de los campos de bits imm8 (ver Sección 4.1). Como se define por imm8[6], IntRes2 se almacena luego en los bits menos significativo de XMM0 (cero extendido a 128 bits) o se expande en un byte/palabra-mask y luego se almacena en XMM0.

Tenga en cuenta que las Banderas Aritméticas están escritas de manera no estándar para suministrar la información más relevante:

```text
    CFlag  Reset if IntRes2 is equal to zero, set otherwise
    ZFlag  Set if any byte/word of xmm2/mem128 is null, reset otherwise
    SFlag  Set if any byte/word of xmm1 is null, reset otherwise
    OFlag  IntRes2[0]
    AFlag  Reset
    PFlag  Reset
```

Nota: En VEX.128 versiones codificadas, bits (MAXVL-1:128) de XMM0 se ponen a cero. VEX.vvvv está reservado y debe ser 1111b, VEX.L debe ser 0, de lo contrario la instrucción será #UD.

Efectivo tamaño de operando

Modo operativo/tamaño operando 1 operando 2 Resultado 16 bit xmm xmm/m128 XMM0 32 bit xmm/m128 XMM0 64 bit xmm xmm/m128 XMM0

Intel C/C++ Compiler Equivalente Intrínseco para la máscara de retorno   m128i  mm cmpistrm (  m128i a,   m128i b, modo int de const);

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
