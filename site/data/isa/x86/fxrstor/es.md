---
summary: Restaurar x87 FPU, MMX, XMM y MXCSR State
---

## Descripción

Recarga los registros x87 FPU, MMX tecnología, XMM y MXCSR de la imagen de memoria de 512 bytes especificada en el operando de origen. Estos datos deben haber sido escritos a la memoria previamente utilizando la instrucción FXSAVE, y en el mismo formato que los modos operativos. El primer byte de los datos debe situarse en un límite de 16 bytes. Hay tres diseños distintos del mapa de estado FXSAVE: uno para el modo legado y compatibilidad, un segundo formato para el modo de 64 bits FXSAVE/FXRSTOR con REX.W=0, y el tercer formato es para el modo 64-bit con FXSAVE64/FXRSTOR64. La tabla 3-45 muestra el diseño de la información del estado del modo legado/compatibilidad en memoria y describe los campos en la imagen de memoria para las instrucciones FXRSTOR y FXSAVE. La tabla 3-48 muestra el diseño de la información del estado del modo 64-bit cuando se establece REX.W (FXSAVE64/FXRSTOR64). En la tabla 3-49 se muestra el diseño de la información del estado del modo 64 bits cuando REX.W está claro (FXSAVE/FXRSTOR).

La imagen del estado referenciada con una instrucción FXRSTOR debe haber sido guardada usando una instrucción FXSAVE o estar en el mismo formato que el requerido por Tabla 3-45, Tabla 3-48, o Tabla 3-49. La referencia a una imagen del estado guardada con una instrucción FSAVE, FNSAVE o diseño de campo incompatible resultará en una restauración incorrecta del estado.

La instrucción FXRSTOR no vacia hasta las excepciones x87 FPU. Para comprobar y plantear excepciones al cargar la información del estado x87 FPU con la instrucción FXRSTOR, utilice una instrucción FWAIT después de la instrucción FXRSTOR.

Si el bit OSFXSR en registro de control CR4 no está establecido, la instrucción FXRSTOR no puede restaurar los estados de los registros XMM y MXCSR. Este comportamiento depende de la implementación.

Si el estado MXCSR contiene una excepción desenmascarada con una bandera de estado correspondiente también conjunto, cargando el registro con la instrucción FXRSTOR no resultará en una condición de error SIMD coma flotante que se genera. Sólo la próxima ocurrencia de esta excepción desenmascarada resultará en la excepción que se genera.

Los bits 16 a 32 del registro MXCSR se definen como reservados y deben establecerse a 0. El intento de escribir un 1 en cualquiera de estos bits de la imagen del estado salvado resultará en que se genere una excepción de protección general (#GP).

Bytes 464:511 de una imagen FXSAVE están disponibles para el uso de software. FXRSTOR ignora el contenido de bytes 464:511 en una imagen de estado FXSAVE.

## Operación

```text
IF 64-Bit Mode

    THEN
         (x87 FPU, MMX, XMM15-XMM0, MXCSR) Load(SRC);

    ELSE
          (x87 FPU, MMX, XMM7-XMM0, MXCSR) := Load(SRC);

FI;

x87 FPU and SIMD Floating-Point Exceptions
None.
```
