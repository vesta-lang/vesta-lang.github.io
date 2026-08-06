---
summary: Carga de Libras Extendidas Usando Dirección Traducción
---

## Descripción

BNDLDX utiliza la dirección lineal construida a partir del registro base y el desplazamiento de la forma de dirección SIB del operando de memoria (mib) para realizar la traducción de dirección para acceder a una entrada de tabla fija y cargar condicionalmente los límites en el BTE al destino. El registro de destino se actualiza con los límites del BTE, si el contenido del registro índice de mib coincide con el valor puntero almacenado en el BTE.

Si la comparación de valor puntero falla, el destino se actualiza con los límites de INIT (lb = 0x0, ub = 0x0) (nota: como se articula anteriormente, el límite superior se representa utilizando el complemento de 1, por lo tanto, el valor 0x0 de los límites superiores permite el acceso a la memoria completa).

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
A_BT[31:0] := LoadFrom(A_BDE );
IF A_BT[0] equal 0 Then

    BNDSTATUS := A_BDE | 02H;
    #BR;
FI;
A_BTE[31:0] := (Zero_extend32(base[11:2] << 4) + (A_BT[31:2] << 2 );
Temp_lb[31:0] := LoadFrom(A_BTE);
Temp_ub[31:0] := LoadFrom(A_BTE + 4);
Temp_ptr[31:0] := LoadFrom(A_BTE + 8);
IF Temp_ptr equal ptr_value Then
    BND.LB := Temp_lb;
    BND.UB := Temp_ub;


ELSE
    BND.LB := 0;
    BND.UB := 0;

FI;

In 64-bit Mode
A_BDE[63:0] := (Zero_extend64(base[47+MAWA:20] << 3) + (BNDCFG[63:12] <<12 );1
A_BT[63:0] := LoadFrom(A_BDE);
IF A_BT[0] equal 0 Then

    BNDSTATUS := A_BDE | 02H;
    #BR;
FI;
A_BTE[63:0] := (Zero_extend64(base[19:3] << 5) + (A_BT[63:3] << 3 );
Temp_lb[63:0] := LoadFrom(A_BTE);
Temp_ub[63:0] := LoadFrom(A_BTE + 8);
Temp_ptr[63:0] := LoadFrom(A_BTE + 16);
IF Temp_ptr equal ptr_value Then
    BND.LB := Temp_lb;
    BND.UB := Temp_ub;
ELSE
    BND.LB := 0;
    BND.UB := 0;
FI;
```

## Banderas afectadas

None.
