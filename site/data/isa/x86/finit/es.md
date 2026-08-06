---
summary: Inicializar la unidad coma flotante
---

## Descripción

Establece el control FPU, estado, etiqueta, puntero de instruccion y data pointer registra a sus estados predeterminados. La palabra de control FPU se establece en 037FH (redondeada a la más cercana, todas las excepciones enmascaradas, precisión de 64 bits). La palabra estado se pone a cero (no hay banderas de excepción establecidas, TOP se establece a 0). Los registros de datos en la pila de registro son dejados sin cambios, pero todos son etiquetados como vacíos (11B). Tanto la instrucción como los punteros de datos están aclarados.

La instrucción FINIT comprueba y descriptores cualquier excepción coma flotante sin máscaras pendientes antes de realizar la inicialización; la instrucción FNINIT no.

El ensamblador emite dos instrucciones para la instrucción FINIT (una instrucción FWAIT seguida de una instrucción FNINIT), y el procesador ejecuta cada una de estas instrucciones por separado. Si se genera una excepción para cualquiera de estas instrucciones, el guardar EIP apunta a la instrucción que causó la excepción.

La operación de esta instrucción es la misma en modos no-64-bit y modo 64-bit.

## Compatibilidad de arquitectura IA-32

Al operar un procesador Pentium o Intel486 en modo compatibilidad MS-DOS, es posible (bajo circunstancias inusuales) interrumpir una instrucción FNINIT antes de ser ejecutado a descriptor una excepción FPU pendiente. Vea la sección titulada "No-Wait FPU Instrucciones pueden obtener FPU Interrupt in Window" en el Apéndice D del Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1, para una descripción de estas circunstancias. Una instrucción FNINIT no se puede interrumpir de esta manera en procesadores Intel posteriores, excepto para el procesador Intel QuarkTM X1000.

En el coprocesador de matemáticas Intel387, la instrucción FINIT/FNINIT no aclara la instrucción y los punteros de datos.

Esta instrucción afecta sólo al x87 FPU. No afecta los registros XMM y MXCSR.

## Operación

```text
FPUControlWord := 037FH;
FPUStatusWord := 0;
FPUTagWord := FFFFH;
FPUDataPointer := 0;
FPUInstructionPointer := 0;
FPULastInstructionOpcode := 0;

FPU Flags Affected

C0, C1, C2, C3 set to 0.
```

## Excepciones coma flotante

None.
