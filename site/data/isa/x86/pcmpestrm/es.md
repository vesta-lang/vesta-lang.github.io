---
summary: Envasado Comparar Pendientes de longitud de explícito, Máscara de retorno
---

## Descripción

La instrucción compara datos de dos fragmentos de cadena basados en el valor codificado en el byte imm8 contol (ver Sección 4.1, "Imm8 Control Byte Operation for PCMPESTRI / PCMPESTRM / PCMPISTRI / PCMPISTRM"), y genera una máscara almacenada a XMM0.

Cada fragmento de cadena está representado por dos valores. El primer valor es un xmm (o posiblemente m128 para el segundo operando) que contiene los elementos de datos de la cadena (datos de byte o palabra). El segundo valor se almacena en un registro de longitud de entrada. El registro de longitud de entrada es EAX/RAX (para xmm1) o EDX/RDX (para xmm2/m128). La longitud representa el número de bytes/words que son válidos para los datos xmm/m128 respectivos.

La longitud de cada entrada se interpreta como el valor absoluto del valor en el registro de longitud. El cálculo de valor absoluto satura a 16 (para bytes) y 8 (para palabras), basado en el valor de imm8[bit3] cuando el valor en el registro de longitud es mayor de 16 (8) o menos de -16 (-8).

Las operaciones de comparación y agregación se realizan según el valor codificado de los campos de bits imm8 (véase la sección 4.1). Como se define por imm8[6], IntRes2 se almacena luego en los bits menos significativo de XMM0 (cero extendido a 128 bits) o se expande en un byte/palabra-mask y luego se almacena en XMM0.

Tenga en cuenta que las Banderas Aritméticas están escritas de manera no estándar para suministrar la información más relevante:

```text
    CFlag  Reset if IntRes2 is equal to zero, set otherwise
    ZFlag  Set if absolute-value of EDX is < 16 (8), reset otherwise
    SFlag  Set if absolute-value of EAX is < 16 (8), reset otherwise
```

OFlag IntRes2[0]

```text
    AFlag  Reset
    PFlag  Reset
```

Nota: En VEX.128 versiones codificadas, bits (MAXVL-1:128) de XMM0 se ponen a cero. VEX.vvvv está reservado y debe ser 1111b, VEX.L debe ser 0, de lo contrario la instrucción será #UD.

Efectivo tamaño de operando

Modo operativo/tamañooperando 1 operando2 Longitud 1 Longitud 2 Resultado 16 bit xmm xmm/m128 EAX EDX XMM032 bit xmm xmm/m128 EAX EDX XMM064 bit xmm xmm/m128 EAX EDX XMM064 bits +REX.Wxmm xmm/m128 RAX RDX XMM0

Intel C/C++ Compiler Equivalente Intrínseco para Mask de Regreso   m128i  mm cmpestrm (  m128i a, int la,   m128i b, int lb, const int mode);

Intel C/C++ Compiler Intrínseco para leer los resultados de EFlag

int  mm cmpestra (  m128i a, int la,   m128i b, int lb, const int mode); int  mm cmpestrc (  m128i a, int la,   m128i b, int lb

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-21, "Tipo 4 Condiciones de Excepción", además, esta instrucción no causa #GP si el operando de memoria no está alineado a 16 Límites Byte, y:

```text
#UD                  If VEX.L = 1.
```

```text
                     If VEX.vvvv  1111B.
```
