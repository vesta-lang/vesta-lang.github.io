---
summary: Comparar valores en coma flotante y Set EFLAGS
---

## Descripción

Realiza una comparación no ordenada de los contenidos de los registros ST(0) y ST(i) y establece las banderas de estado ZF, PF y CF en el registro EFLAGS según los resultados (ver la tabla abajo). El signo de cero se ignora para las comparaciones, por lo que 0.0 es igual a +0.0.

**FCOMI/FCOMIP/ FUCOMI/FUCOMIP Resultados**

| Resultados de comparación* | ZF | PF | CF |
| --- | --- | --- | --- |
| ST0 > ST(i) | 0 | 0 | 0 |
| ST0 < ST(i) | 0 | 0 | 1 |
| ST0 = ST(i) | 1 | 0 | 0 |
| Sin orden** | 1 | 1 | 1 |

## Compatibilidad de arquitectura IA-32

Las instrucciones FCOMI/FCOMIP/FUCOMI/FUCOMIP fueron introducidas a la arquitectura IA-32 en los procesadores familiares P6 y no están disponibles en los procesadores IA-32 anteriores.

FCOMI/FCOMIP/ FUCOMI/FUCOMIP--Compare valores en coma flotante y Set EFLAGS

## Operación

```text
CASE (relation of operands) OF

    ST(0) > ST(i):  ZF, PF, CF := 000;

    ST(0) < ST(i):  ZF, PF, CF := 001;

    ST(0) = ST(i):  ZF, PF, CF := 100;

ESAC;

IF Instruction is FCOMI or FCOMIP
    THEN

        IF ST(0) or ST(i) = NaN or unsupported format

                THEN
                      #IA

                  IF FPUControlWord.IM = 1

                            THEN
                                  ZF, PF, CF := 111;

                      FI;
          FI;
FI;

IF Instruction is FUCOMI or FUCOMIP
    THEN

        IF ST(0) or ST(i) = QNaN, but not SNaN or unsupported format

                THEN
                      ZF, PF, CF := 111;

                ELSE (* ST(0) or ST(i) is SNaN or unsupported format *)
                       #IA;

                  IF FPUControlWord.IM = 1

                            THEN
                                  ZF, PF, CF := 111;

                      FI;
          FI;
FI;

IF Instruction is FCOMIP or FUCOMIP
    THEN
          PopRegisterStack;

FI;

FPU Flags Affected

C1                  Set to 0.

C0, C2, C3          Not affected.
```

## Excepciones coma flotante

```text
#IS                 Stack underflow occurred.
```

```text
#IA                 (FCOMI or FCOMIP instruction) One or both operands are NaN values or have unsupported
```

formats.

(Instrucción FUCOMI o FUCOMIP) Uno o ambos operandos son valores SNaN (pero no QNaNs) o tienen formatos no definidos. Detección de un valor QNaN no genera una excepción de operando no válido.

FCOMI/FCOMIP/ FUCOMI/FUCOMIP--Compare valores en coma flotante y Set EFLAGS
