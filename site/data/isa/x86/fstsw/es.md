---
summary: Tienda x87 FPU Status Word
---

## Descripción

Almacena el valor actual de la palabra estado x87 FPU en la ubicación de destino. El operando de destino puede ser una ubicación de memoria de dos bytes o el registro AX. Los cheques de instrucción FSTSW y descriptores pendientes desenmascarar las excepciones coma flotante antes de almacenar la palabra de estado; la instrucción FNSTSW no.

La forma FNSTSW AX de la instrucción se utiliza principalmente en ramificación condicional (por ejemplo, después de una instrucción de comparación FPU o una instrucción FPREM, FPREM1 o FXAM), donde la dirección de la rama depende del estado de las banderas de código de estado FPU. (Ver la sección titulada "Branching and Conditional Moves on FPU Condition Codes" en el capítulo 8 de Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1.) Esta instrucción también se puede utilizar para invocar controladores de excepción (por examinar las banderas de excepción) en entornos que no utilizan interrupciones. Cuando se ejecuta la instrucción FNSTSW AX, el registro AX se actualiza antes de que el procesador ejecute otras instrucciones. El estado almacenado en el registro AX está garantizado por lo tanto desde la terminación de la instrucción FPU anterior.

El ensamblador emite dos instrucciones para la instrucción FSTSW (una instrucción FWAIT seguida de una instrucción FNSTSW), y el procesador ejecuta cada una de estas instrucciones por separado. Si se genera una excepción para cualquiera de estas instrucciones, el guardar EIP apunta a la instrucción que causó la excepción.

La operación de esta instrucción es la misma en modos no-64-bit y modo 64-bit.

## Compatibilidad de arquitectura IA-32

Al operar un procesador Pentium o Intel486 en modo compatibilidad MS-DOS, es posible (bajo circunstancias inusuales) interrumpir una instrucción FNSTSW antes de ser ejecutado a descriptor una excepción FPU pendiente. Vea la sección titulada "No-Wait FPU Instrucciones pueden obtener FPU Interrupt in Window" en el Apéndice D del Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1, para una descripción de estas circunstancias. Una instrucción FNSTSW no se puede interrumpir de esta manera en procesadores Intel posteriores, excepto para el procesador Intel QuarkTM X1000.

## Operación

```text
DEST := FPUStatusWord;

FPU Flags Affected

The C0, C1, C2, and C3 are undefined.
```

## Excepciones coma flotante

None.
