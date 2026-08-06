---
summary: Store Local Descriptor Table Register
---

## Descripción

Tiendas el selector de segmento del registro local de la tabla de descriptores (LDTR) en el operando de destino. El operando de destino puede ser un registro de proposito general o una ubicación de memoria. El selector de segmento almacenado con esta instrucción apunta al descriptor de segmento (ubicado en el GDT) para el LDT actual. Esta instrucción sólo se puede ejecutar en modo protegido.

Fuera del modo IA-32e, cuando el operando de destino es un registro de 32 bits, el selector de segmento de 16 bits es copiado en los 16 bits de bajo orden del registro. Los 16 bits de alto orden del registro se limpian para los procesadores del Pentium 4, Intel Xeon y P6 de la familia. Quedan indefinidas para procesadores Pentium, Intel486, e Intel386. Cuando el operando de destino es una ubicación de memoria, el selector de segmento está escrito a la memoria como una cantidad de 16 bits, independientemente del tamaño de operando.

En modo de compatibilidad, cuando el operando de destino es un registro de 32 bits, el selector de segmento de 16 bits se copia en los 16 bits de bajo orden del registro. Los 16 bits de alto orden del registro se limpian. Cuando el operando de destino es una ubicación de memoria, el selector de segmento está escrito a la memoria como una cantidad de 16 bits, independientemente del tamaño de operando.

En modo de 64 bits, el uso de un prefijo REX en forma de REX.R permite el acceso a registros adicionales (R8-R15). El comportamiento de SLDT con un registro de 64 bits es para examinar el selector de 16 bits y almacenarlo en el registro. Si el destino es memoria y tamaño de operando es 64, SLDT escribirá el selector de 16 bits a la memoria como una cantidad de 16 bits, independientemente del tamaño de operando.

## Operación

```text
DEST := LDTR(SegmentSelector);
```

## Banderas afectadas

None.
