---
summary: Bit Field Extract
---

## Descripción

Extrae bits contiguos del primer operando de origen (el segundo operando) utilizando un valor índice y un valor de longitud especificado en el segundo operando de origen (el tercer operando). El bit 7:0 del segundo operando de origen especifica la posición inicial de extracción de bits. Un valor START superior al tamaño de operando no extraerá ningún bit del segundo operando de origen. El bit 15:8 del segundo operando de origen especifica el número máximo de bits (LENGTH) comenzando en la posición START para extraer. Sólo se extraen posiciones de bit hasta (OperandSize -1) del primer operando de origen. Los bits extraídos se escriben en el registro de destino, a partir del bit menos significativo. Todos los bits de orden más alto en el operando de destino (estando en posición de bit LENGTH) se ponen a cero. El destino registra se pone a cero si no se extraen bits.

Esta instrucción no es compatible en modo real y modo virtual-8086. El tamaño de operando es siempre 32 bits si no en modo de 64 bits. En modo de 64 bits tamaño de operando 64 requiere VEX.W1. VEX.W1 es ignorado en modos no-64-bit. Un intento de ejecutar esta instrucción con VEX.L no igual a 0 causará #UD.

## Operación

```text
START := SRC2[7:0];
LEN := SRC2[15:8];
TEMP := ZERO_EXTEND_TO_512 (SRC1 );
DEST := ZERO_EXTEND(TEMP[START+LEN -1: START]);
ZF := (DEST = 0);
```

## Banderas afectadas

ZF se actualiza en función del resultado. AF, SF y PF quedan indefinidas. Todas las otras banderas están limpias.

## Intel C/C++ compilador intrínseco

```c
BEXTR unsigned __int32 _bextr_u32(unsigned __int32 src, unsigned __int32 start. unsigned __int32 len);
BEXTR unsigned __int64 _bextr_u64(unsigned __int64 src, unsigned __int32 start. unsigned __int32 len);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-29, "Tipo 13 Condiciones de Excepción", además:

```text
#UD                       If VEX.W = 1.
```
