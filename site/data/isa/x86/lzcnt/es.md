---
summary: Contar el número de ceros de plomo
---

## Descripción

LZCNT cuenta el número de bits mas significativo cero en un operando de origen (segundo operando) y devuelve el resultado en el destino (primer operando). LZCNT es una extensión de la instrucción BSR. La clave diferencia entre las instrucciones LZCNT y BSR es que cuando el operando de origen es cero, LZCNT produce el tamaño de operando al operando de destino, mientras que BSR hojas el operando de destino sin modificar.

En los procesadores que no soportan LZCNT, la codificación de byte de instrucciones se ejecuta como BSR.

## Operación

```text
temp := OperandSize - 1
DEST := 0
WHILE (temp >= 0) AND (Bit(SRC, temp) = 0)
DO

    temp := temp - 1
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

La bandera ZF se establece a 1 en caso de salida cero (mas significativo bit de la fuente está establecido), y a 0 de lo contrario, la bandera CF se establece a 1 si la entrada era cero y se despeja de otra manera. Las banderas de SF, PF y AF no están definidas.

## Intel C/C++ compilador intrínseco

```c
LZCNT unsigned __int32 _lzcnt_u32(unsigned __int32 src);
LZCNT unsigned __int64 _lzcnt_u64(unsigned __int64 src);
```
