---
summary: Store Task Register
---

## Descripción

Tiendas el selector de segmento del registro de tareas (TR) en el operando de destino. El operando de destino puede ser un registro de proposito general o una ubicación de memoria. El selector de segmento almacenado con esta instrucción apunta al segmento del estado de tarea (TSS) para la tarea en curso.

Cuando el operando de destino es un registro de 32 bits, el selector de segmento de 16 bits se copia en los 16 bits inferiores del registro y los 16 bits superiores del registro se limpian. Cuando el operando de destino es una ubicación de memoria, el selector de segmento está escrito a la memoria como una cantidad de 16 bits, independientemente de tamaño de operando.

En modo de 64 bits, la operación es la misma. El tamaño del operando de memoria se fija en 16 bits. En las tiendas de registro, el TR de 2 bytes es cero extendido si se almacena en un registro de 64 bits.

La instrucción STR es útil sólo en el software del sistema operativo. Sólo se puede ejecutar en modo protegido.

## Operación

```text
DEST := TR(SegmentSelector);
```

## Banderas afectadas

None.
