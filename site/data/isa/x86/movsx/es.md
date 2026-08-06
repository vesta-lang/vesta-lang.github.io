---
summary: Muévete con Sign-Extension
---

## Descripción

Copia el contenido del operando de origen (registrado o ubicación de memoria) al operando de destino (registrado) y el signo extiende el valor a 16 o 32 bits (ver Figura 7-6 en el Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1). El tamaño del valor convertido depende del atributo el operando-size.

En modo de 64 bits, el tamaño de operación predeterminado de la instrucción es de 32 bits. El uso del prefijo REX.R permite el acceso a registros adicionales (R8-R15). El uso del prefijo REX.W promueve la operación a 64 bits. Vea la tabla resumen al comienzo de esta sección para la codificación de datos y límites.

## Operación

```text
DEST := SignExtend(SRC);
```

## Banderas afectadas

None.
