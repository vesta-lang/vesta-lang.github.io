---
summary: Registro de tareas de carga
---

## Descripción

Carga el operando de origen en el campo el selector de segmento del registro de tareas. El operando de origen (un registro general o una ubicación de memoria) contiene un selector de segmento que apunta a un segmento del estado de tarea (TSS). Después de que el selector de segmento esté cargado en el registro de tareas, el procesador utiliza el selector de segmento para localizar el descriptor de segmento para el TSS en la tabla descriptor global (GDT). Luego carga el límite de segmento y la dirección base para el TSS del descriptor de segmento en el registro de tareas. La tarea señalada por el registro de tareas está marcadamente ocupada, pero no se produce un cambio a la tarea.

La instrucción LTR se proporciona para uso en el software del sistema operativo; no debe ser utilizado en los programas de aplicación. Sólo se puede ejecutar en modo protegido cuando el CPL es 0. Es comúnmente utilizado en el código de inicialización para establecer la primera tarea a ejecutar.

El atributo el operando-size no tiene efecto en esta instrucción.

En modo de 64 bits, el tamaño de operando todavía se fija en 16 bits. La instrucción hace referencia a un descriptor de 16 bytes para cargar la base de 64 bits.

## Operación

```text
IF SRC is a NULL selector

    THEN #GP(0);

IF SRC(Offset) > descriptor table limit OR IF SRC(type)  global

    THEN #GP(segment selector); FI;
Read segment descriptor;

IF segment descriptor is not for an available TSS
    THEN #GP(segment selector); FI;

IF segment descriptor is not present
    THEN #NP(segment selector); FI;

TSSsegmentDescriptor(busy) := 1;
(* Locked read-modify-write operation on the entire descriptor when setting busy flag *)
TaskRegister(SegmentSelector) := SRC;
TaskRegister(SegmentDescriptor) := TSSSegmentDescriptor;
```

## Banderas afectadas

None.
