---
summary: Ajustar RPL Campo de selector de segmento
---

## Descripción

Compare los campos RPL de dos selectores de segmento. El primer operando (el operando de destino) contiene un selector de segmento y el segundo operando (operando de origen) contiene el otro. (El campo RPL se encuentra en los bits 0 y 1 de cada operando.) Si el campo RPL del operando de destino es menos que el campo RPL del operando de origen, la bandera ZF se establece y el campo RPL del operando de destino se aumenta para igualar el del operando de origen. De lo contrario, la bandera ZF se pone a cero y ningún cambio se hace al operando de destino. (el operando de destino puede ser un registro de palabras o una ubicación de memoria; el operando de origen debe ser un registro de palabras.)

La instrucción ARPL se proporciona para uso mediante procedimientos de sistema operativo (cuando sea, también puede ser utilizada por aplicaciones). Se utiliza generalmente para ajustar el RPL de un selector de segmento que ha sido pasado al sistema operativo por un programa de aplicación para que coincida con el nivel de privilegio del programa de aplicación. Aquí el selector de segmento pasó al sistema operativo se coloca en el operando de destino y selector de segmento para el segmento de código del programa de aplicación se coloca en el operando de origen. (El campo RPL en el operando de origen representa el nivel de privilegio del programa de aplicación.) La ejecución de la instrucción ARPL asegura entonces que el RPL del selector de segmento recibido por el sistema operativo no es menor (no tiene un privilegio superior) que el nivel de privilegio del programa de aplicación (el selector de segmento para el segmento de código de aplicación siguiente puede ser leído una llamada).

Esta instrucción se ejecuta como se describe en modo de compatibilidad y modo legado. No es encodable en modo de 64 bits.

Ver "Comprobar privilegios de acceso de llamadas" en el capítulo 3, "Protected-Mode Memory Management", de Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volume 3A, para obtener más información sobre el uso de esta instrucción.

## Operación

```text
IF 64-BIT MODE

    THEN
          See MOVSXD;

    ELSE
          IF DEST[RPL] < SRC[RPL]
                THEN
                      ZF := 1;
                      DEST[RPL] := SRC[RPL];
                ELSE
                      ZF := 0;
          FI;

FI;
```

## Banderas afectadas

La bandera ZF se establece a 1 si el campo RPL del operando de destino es menos que el del operando de origen; de lo contrario, se establece a 0.
