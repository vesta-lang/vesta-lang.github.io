---
summary: Límite del segmento de carga
---

## Descripción

Carga el límite de segmento del descriptor de segmento (ver abajo) especificado con el segundo operando (operando de origen) en el primer operando (operando de destino) y establece la bandera ZF en el registro EFLAGS. El operando de origen (que puede ser un registro o una ubicación de memoria) contiene el selector de segmento para el descriptor de segmento que se accede. Si el operando de origen es una dirección de memoria, sólo se accede a 16 bits de datos. El operando de destino es un registro de proposito general.

El procesador realiza cheques de acceso como parte del proceso de carga. Una vez cargado en el registro de destino, el software puede comparar el límite de segmento con el offset de un puntero.

El límite de segmento es un valor de 20 bits contenido en bytes 0 y 1 y en los primeros 4 bits de byte 6 del descriptor de segmento. Si el descriptor tiene un límite de segmento granular de byte (la bandera de granularidad se establece a 0), el operando de destino se carga con un valor granular de byte (límite de byte) como se lee en el descriptor. Si el descriptor tiene un límite de segmento granular (la bandera de granularidad se establece a 1), la instrucción LSL traducirá la página límite granular (límite de página) en un límite de byte antes de cargarla en el operando de destino. La traducción se realiza cambiando el límite de 20 bits "raw" izquierda 12 bits y llenando los 12 bits de bajo orden con 1s.

Cuando el tamaño de operando es de 16 bits, se calcula un límite válido de 32 bits de byte; sin embargo, los 16 bits superiores están truncados y sólo los 16 bits de bajo orden se cargan en el operando de destino; los bits superiores del destino no están modificados. Cuando el tamaño de operando es de 32 bits, el límite de byte de 32 bits se carga en el operando de destino; las partes superiores del destino se limpian. Cuando el operando es de 64 bits, el límite de byte de 32 bits es cero-extended a 64 bits y cargado en el operando de destino. (El comportamiento con tamaños operando de 32 bits y 64 bits es idéntico).

Esta instrucción realiza los siguientes cheques antes de cargar el límite de segmento en el registro de destino:

* Comprueba que el selector de segmento no es NULL. * Comprueba que el selector de segmento apunta a un descriptor que está dentro de los límites de la GDT o LDT siendo

accessed

* Comprueba que el tipo de descriptor es válido para esta instrucción. Todos los descriptores del segmento de código y datos son válidos para

(se puede acceder con) la instrucción LSL. Los tipos de descriptores especiales válidos y de la puerta se dan en

| * | Si el segmento no es un segmento de código conforme, la instrucción comprueba que el descriptor de segmento especificado |
| --- | --- |
|  | es visible en el CPL (es decir, si el CPL y el RPL del selector de segmento son menos o igual al DPL de |
|  | el selector de segmento). |
| If | el descriptor de segmento no se puede acceder o es un tipo inválido para la instrucción, la bandera ZF se pone a cero y no |

**Tipos descriptor de segmento y puerta**

| * | Si el segmento no es un segmento de código conforme, la instrucción comprueba que el descriptor de segmento especificado |
| --- | --- |
|  | es visible en el CPL (es decir, si el CPL y el RPL del selector de segmento son menos o igual al DPL de |
|  | el selector de segmento). |
| If | el descriptor de segmento no se puede acceder o es un tipo inválido para la instrucción, la bandera ZF se pone a cero y no |

## Operación

```text
IF SRC(Offset) > descriptor table limit
    THEN ZF := 0; FI;

Read segment descriptor;

IF SegmentDescriptor(Type)  conforming code segment

and (CPL > DPL) OR (RPL > DPL)
or Segment type is not valid for instruction

          THEN
                ZF := 0;

          ELSE
                temp := SegmentLimit([SRC]);
                IF (SegmentDescriptor(G) = 1)
                      THEN temp := (temp << 12) OR 00000FFFH;

             ELSE IF OperandSize = 32

                      THEN DEST := temp; FI;

             ELSE IF OperandSize = 64 (* REX.W used *)

                      THEN DEST := temp(* Zero-extended *); FI;

             ELSE (* OperandSize = 16 *)

                      DEST := temp AND FFFFH;
                FI;
FI;
```

## Banderas afectadas

La bandera ZF se establece a 1 si el límite de segmento se carga con éxito; de lo contrario, se establece a 0. Las banderas CF, OF, SF, AF y PF no se modifican.
