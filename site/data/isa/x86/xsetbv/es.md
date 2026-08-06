---
summary: Set Extended registro de control
---

## Descripción

Escribe el contenido de los registros EDX:EAX en el registro de control extendido de 64 bits (XCR) especificado en el registro ECX. (En los procesadores que soportan la arquitectura Intel 64, se ignoran los 32 bits de alto orden de RCX).Los contenidos del registro EDX se copian a 32 bits de alto orden del XCR seleccionado y los contenidos del registro EAX se copian a 32 bits de bajo orden del XCR. (En los procesadores que soportan la arquitectura Intel 64, se ignoran los 32 bits más altos de cada uno de RAX y RDX).Los bits indefinidos o reservados en un XCR deben establecerse en valores previamente leídos.

Esta instrucción debe ejecutarse a nivel de privilegios 0 o en modo de direccion real; de lo contrario, una excepción de protección general #GP(0) se genera. Especificar un XCR reservado o unimplementado en ECX también causará una excepción de protección general. El procesador también generará una excepción de protección general si el software intenta escribir a bits reservados en un XCR.

Actualmente, sólo XCR0 es compatible. Así, todos los otros valores de ECX están reservados y causarán un #GP(0). Tenga en cuenta que el bit 0 de XCR0 (correspondiente a estado x87) debe ser fijado a 1; la instrucción causará un #GP(0) si se hace un intento de limpiar este bit. Además, la instrucción causa una#GP(0)si se intenta establecerXCR0[2] (AVXestado) mientras se limpiaXCR0[1] (SSEestado); es necesario establecer ambos bits para utilizarAVXinstrucciones; Sección 13.3, "Permitir el conjunto de características de XSAVE y las características de XSAVE-Enabled", de Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1.

## Operación

```text
XCR[ECX] := EDX:EAX;
```

## Banderas afectadas

None.

## Intel C/C++ compilador intrínseco

```c
XSETBV void _xsetbv( unsigned int, unsigned __int64);
```
