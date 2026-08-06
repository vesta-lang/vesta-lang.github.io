---
summary: Verifique un Segmento para la lectura o escritura
---

## Descripción

Verifica si el código o segmento de datos especificado con el operando de origen es legible (VERR) o writable (VERW) del nivel de privilegio actual (CPL). El operando de origen es un registro de 16 bits o una ubicación de memoria que contiene el selector de segmento para verificar el segmento. Si el segmento es accesible y legible (VERR) o writable (VERW), se establece la bandera ZF; de lo contrario, la bandera ZF se pone a cero. Los segmentos de código nunca son verificables. Este cheque no se puede realizar en segmentos del sistema.

Para establecer la bandera ZF, se deben cumplir las siguientes condiciones:

* El selector de segmento no es NULL. * El selector debe denotar un descriptor dentro de los límites de la tabla descriptor (GDT o LDT). * El selector debe denotar el descriptor de un código o segmento de datos (no el de un segmento o puerta del sistema). * Para la instrucción VERR, el segmento debe ser legible. * Para la instrucción VERW, el segmento debe ser un segmento de datos computarizado. * Si el segmento no es un segmento de código conforme, el DPL del segmento debe ser mayor o igual a (tener

menos o el mismo privilegio que) tanto el CPL como el el selector de segmento de RPL.

La validación realizada es la misma que se realiza cuando un selector de segmento se carga en el registro DS, ES, FS o GS, y el acceso indicado (leer o escribir) se realiza. El valor del selector de segmento no puede resultar en una excepción de protección, lo que permite al software anticipar posibles problemas de acceso a segmentos.

La operación de esta instrucción es la misma en modos no-64-bit y modo 64-bit. El tamaño de operando se fija en 16 bits.

## Operación

```text
IF SRC(Offset) > (GDTR(Limit) or (LDTR(Limit))
    THEN ZF := 0; FI;

Read segment descriptor;

IF SegmentDescriptor(DescriptorType) = 0 (* System segment *)
or (SegmentDescriptor(Type)  conforming code segment)

and (CPL > DPL) or (RPL > DPL)
    THEN
          ZF := 0;
    ELSE

        IF ((Instruction = VERR) and (Segment readable))
        or ((Instruction = VERW) and (Segment writable))

                THEN
                      ZF := 1;

                ELSE
                      ZF := 0;


          FI;
FI;
```

## Banderas afectadas

La bandera ZF se establece a 1 si el segmento es accesible y legible (VERR) o writable (VERW); de lo contrario, se establece a 0.
