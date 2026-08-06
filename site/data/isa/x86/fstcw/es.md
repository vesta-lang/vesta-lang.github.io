---
summary: Tienda x87 FPU Control Word
---

## Descripción

Almacena el valor actual de la palabra de control FPU en el destino especificado en memoria. Los cheques de instrucción FSTCW y descriptores pendientes desenmascarar las excepciones coma flotante antes de almacenar la palabra de control; la instrucción FNSTCW no.

El ensamblador emite dos instrucciones para la instrucción FSTCW (una instrucción FWAIT seguida de una instrucción FNSTCW), y el procesador ejecuta cada una de estas instrucciones por separado. Si se genera una excepción para cualquiera de estas instrucciones, el guardar EIP apunta a la instrucción que causó la excepción.

La operación de esta instrucción es la misma en modos no-64-bit y modo 64-bit.

## Compatibilidad de arquitectura IA-32

Al operar un procesador Pentium o Intel486 en modo compatibilidad MS-DOS, es posible (bajo circunstancias inusuales) interrumpir una instrucción FNSTCW antes de ser ejecutado a descriptor una excepción FPU pendiente. Vea la sección titulada "No-Wait FPU Instrucciones pueden obtener FPU Interrupt in Window" en el Apéndice D del Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1, para una descripción de estas circunstancias. Una instrucción FNSTCW no se puede interrumpir de esta manera en procesadores Intel posteriores, excepto para el procesador Intel QuarkTM X1000.

## Operación

```text
DEST := FPUControlWord;

FPU Flags Affected
The C0, C1, C2, and C3 flags are undefined.
```

## Excepciones coma flotante

None.
