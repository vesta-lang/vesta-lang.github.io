---
summary: Tienda Extended Bounds Usando la Traducción de Dirección
---

## Descripción

BNDSTX utiliza la dirección lineal construida a partir del desplazamiento y registro base de la forma de dirección SIB del operando de memoria (mib) para realizar la traducción de la dirección para almacenar a la entrada de la tabla. Los límites en el operando de origen bnd están escritos a los límites inferiores y superiores en el BTE. El contenido del registro índice de mib está escrito al campo de valor puntero en el BTE.

Esta instrucción no causa el acceso a la memoria a la dirección lineal de mib ni la dirección efectiva a la que se refiere la base, y no lee ni escribe ninguna bandera.

Segment overrides se aplican a la computación de la dirección lineal con la base de mib, y se utilizan durante la traducción de la dirección para generar la dirección de la entrada de la tabla. Por defecto, se supone que la dirección del BTE es la dirección lineal. No hay controles de segmentación realizados en la base de mib.

La base de mib no se comprobará por violación de direcciones canónicas ya que no accede a la memoria.

Cualquier codificación de esta instrucción que no especifique el registro base o índice tratará esos registros como cero (constant). La forma reg-reg de esta instrucción seguirá siendo un NOP.

El campo de escala del byte SIB no tiene ningún efecto en estas instrucciones y es ignorado.

El registro consolidado puede ser parcialmente actualizado en fallos de memoria. El orden en el que se cargan operandos de memoria es específico de la implementación.

## Operación

```text
base := mib.SIB.base ? mib.SIB.base + Disp: 0;
ptr_value := mib.SIB.index ? mib.SIB.index : 0;

Outside 64-bit Mode
A_BDE[31:0] := (Zero_extend32(base[31:12] << 2) + (BNDCFG[31:12] <<12 );
A_BT[31:0] := LoadFrom(A_BDE);
IF A_BT[0] equal 0 Then

    BNDSTATUS := A_BDE | 02H;
    #BR;
FI;
A_DEST[31:0] := (Zero_extend32(base[11:2] << 4) + (A_BT[31:2] << 2 ); // address of Bound table entry
A_DEST[8][31:0] := ptr_value;
A_DEST[0][31:0] := BND.LB;
A_DEST[4][31:0] := BND.UB;


In 64-bit Mode
A_BDE[63:0] := (Zero_extend64(base[47+MAWA:20] << 3) + (BNDCFG[63:12] <<12 );1
A_BT[63:0] := LoadFrom(A_BDE);
IF A_BT[0] equal 0 Then

    BNDSTATUS := A_BDE | 02H;
    #BR;
FI;
A_DEST[63:0] := (Zero_extend64(base[19:3] << 5) + (A_BT[63:3] << 3 ); // address of Bound table entry
A_DEST[16][63:0] := ptr_value;
A_DEST[0][63:0] := BND.LB;
A_DEST[8][63:0] := BND.UB;
```

## Intel C/C++ compilador intrínseco

```c
BNDSTX: _bnd_store_ptr_bounds(const void **ptr_addr, const void *ptr_val);
```

## Banderas afectadas

None.
