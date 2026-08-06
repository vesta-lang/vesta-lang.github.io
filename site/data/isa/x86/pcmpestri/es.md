---
summary: Envasado Comparar Pendientes de longitud de explícito, Índice de retorno
---

## Descripción

La instrucción compara y procesa datos de dos fragmentos de cadena basados en el valor codificado en el byte de control imm8 (ver Sección 4.1, "Imm8 Control Byte Operation for PCMPESTRI / PCMPESTRM / PCMPISTRI / PCMP- ISTRM"), y genera un índice almacenado en el registro de cuenta (ECX).

Cada fragmento de cadena está representado por dos valores. El primer valor es un xmm (o posiblemente m128 para el segundo operando) que contiene los elementos de datos de la cadena (datos de byte o palabra). El segundo valor se almacena en un registro de longitud de entrada. El registro de longitud de entrada es EAX/RAX (para xmm1) o EDX/RDX (para xmm2/m128). La longitud representa el número de bytes/words que son válidos para los datos xmm/m128 respectivos.

La longitud de cada entrada se interpreta como el valor absoluto del valor en el registro de longitud. El cálculo de valor absoluto satura a 16 (para bytes) y 8 (para palabras), basado en el valor de imm8[bit3] cuando el valor en el registro de longitud es mayor de 16 (8) o menos de -16 (-8).

Las operaciones de comparación y agregación se realizan según el valor codificado de los campos de bits imm8 (véase la sección 4.1). El índice del primer (o último, según imm8[6]) conjunto bit de IntRes2 (ver Sección 4.1.4) se devuelve en ECX. Si no hay bits en IntRes2, ECX se establece a 16 (8).

Tenga en cuenta que las Banderas Aritméticas están escritas de manera no estándar para suministrar la información más relevante:

```text
    CFlag  Reset if IntRes2 is equal to zero, set otherwise
    ZFlag  Set if absolute-value of EDX is < 16 (8), reset otherwise
    SFlag  Set if absolute-value of EAX is < 16 (8), reset otherwise
    OFlag  IntRes2[0]
    AFlag  Reset
    PFlag  Reset
```

Eficaciatamaño de operando operando 1 operando2 Duración 1 Duración 2 Resultado Modo de funcionamiento/tamaño xmm xmm/m128 EAX EDX ECXxmm xmm xmm/m128 EAX EDX ECX32 bit xmm xmm/m128 EAX EDX ECX64 bit xmm xmm/m128 RAX RDX ECX64 bits +REX.W

Intel C/C++ Compiler Equivalente Intrínseco para el índice de retorno int  mm cmpestri (  m128i a, int la,   m128i b, int lb, const int mode);

Intel C/C++ Compiler Intrínseco para leer los resultados de EFlag

int  mm cmpestra (  m128i a, int la,   m128i b, int lb, const int mode); int  mm cmpestrc (  m128i a, int la,   m128i b, int lb

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
