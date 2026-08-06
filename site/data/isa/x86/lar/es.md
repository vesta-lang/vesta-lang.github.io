---
summary: Derechos de acceso de carga
---

## Descripción

Carga los derechos de acceso del descriptor de segmento especificado por el segundo operando (operando de origen) en el primer operando (operando de destino) y establece la bandera ZF en el registro EFLAGS. El operando de origen (que puede ser un registro o una ubicación de memoria) contiene el selector de segmento para el descriptor de segmento que se accede. Si el operando de origen es una dirección de memoria, sólo se accede a 16 bits de datos. El operando de destino es un registro para fines generales.

El procesador realiza cheques de acceso como parte del proceso de carga. Una vez cargado en el registro de destino, el software puede realizar cheques adicionales sobre la información de derechos de acceso.

Los derechos de acceso para un descriptor de segmento incluyen campos ubicados en la segunda palabra doble (bytes 47) del descriptor de segmento. Los siguientes campos están cargados por la instrucción LAR:

* Bits 7:0 son devueltos como 0 * Bits 11:8 devuelve el tipo de segmento. * Un poco 12 devuelve la bandera S. * Bits 14:13 devolver el DPL. * Un poco 15 devuelve la bandera P. * Los siguientes campos son devueltos sólo si el tamaño de operando es mayor de 16 bits:

-- Bits 19:16 are undefined.

-- Bit 20 devuelve el bit disponible en el descriptor.

- El Bit 21 devuelve la bandera L.

- El bit 22 devuelve la bandera D/B.

- El bit 23 devuelve la bandera G.

-- Bits 31:24 are returned as 0.

Cuando el tamaño de operando es de 16 bits, sólo se devuelven los 16 bits bajos identificados anteriormente; los bits superiores del destino son sin modificar. Cuando el tamaño de operando es de 32 bits, el valor de 32 bits identificado anteriormente se carga en el operando de destino; las partes superiores del destino se limpian. Cuando el operando es de 64 bits, el valor de 32 bits es ceroextended a 64 bits y se carga en el operando de destino. (El comportamiento con tamaños operando de 32 bits y 64 bits es idéntico).

Esta instrucción realiza los siguientes cheques antes de cargar los derechos de acceso en el registro de destino:

* Comprueba que el selector de segmento no es NULL. * Comprueba que el selector de segmento apunta a un descriptor que está dentro de los límites de la GDT o LDT siendo

accessed

* Comprueba que el tipo de descriptor es válido para esta instrucción. Todos los descriptores del segmento de código y datos son válidos para

(se puede acceder con) la instrucción LAR. El segmento del sistema válido y los tipos de descriptores de puerta se dan en

| * | Si el segmento no es un segmento de código de conformidad, comprueba que el descriptor de segmento especificado es visible en |
| --- | --- |
|  | el CPL (es decir, si el CPL y el RPL del selector de segmento son menos o igual al DPL del segmento |
|  | selector). |

** Tipos de segmento y puerta**

| * | Si el segmento no es un segmento de código de conformidad, comprueba que el descriptor de segmento especificado es visible en |
| --- | --- |
|  | el CPL (es decir, si el CPL y el RPL del selector de segmento son menos o igual al DPL del segmento |
|  | selector). |

## Operación

```text
IF Offset(SRC) > descriptor table limit
    THEN
          ZF := 0;
    ELSE
          SegmentDescriptor := descriptor referenced by SRC;

        IF SegmentDescriptor(Type)  conforming code segment

          and (CPL > DPL) or (RPL > DPL)
          or SegmentDescriptor(Type) is not valid for instruction

                THEN
                      ZF := 0;

                ELSE
                      DEST := access rights from SegmentDescriptor as given in Description section;
                      ZF := 1;

          FI;
FI;
```

## Banderas afectadas

La bandera ZF se fija a 1 si los derechos de acceso se cargan con éxito; de lo contrario, se pone a cero a 0.
