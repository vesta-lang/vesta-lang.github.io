---
summary: Cuenta el número de Trailing Zero Bits
---

## Descripción

TZCNT cuenta el número de bits menos significativo cero en operando de origen (segundo operando) y devuelve el resultado en el operando de destino (primer operando). TZCNT es una extensión de la instrucción BSF. La clave diferencia entre las instrucciones TZCNT y BSF es que cuando el operando de origen es cero, TZCNT produce el tamaño de operando al operando de destino, mientras que BSF hojas el operando de destino sin modificar.

En los procesadores que no soportan TZCNT, la codificación de byte de instrucciones se ejecuta como BSF.

## Operación

```text
temp := 0
DEST := 0
DO WHILE ( (temp < OperandSize) and (SRC[ temp] = 0) )

    temp := temp +1
    DEST := DEST+ 1
OD

IF DEST = OperandSize
    CF := 1

ELSE
    CF := 0

FI

IF DEST = 0
    ZF := 1

ELSE
    ZF := 0

FI
```

## Banderas afectadas

ZF se establece a 1 en caso de salida cero (menos significativo bit de la fuente se establece), y a 0 de lo contrario, CF se establece a 1 si la entrada fue cero y se despejó de otra manera. Las banderas de SF, PF y AF no están definidas.

## Intel C/C++ compilador intrínseco

```c
TZCNT unsigned __int32 _tzcnt_u32(unsigned __int32 src);
TZCNT unsigned __int64 _tzcnt_u64(unsigned __int64 src);
```
