---
summary: Store x87 FPU Environment
---

## Descripción

Ahorra el entorno operativo FPU actual en la ubicación de memoria especificado con el operando de destino, y luego enmascara todas las excepciones coma flotante. El entorno operativo FPU consta de la palabra de control FPU, palabra de estado, palabra de etiqueta, puntero de instruccion, puntero de datos, y último código de operación. Figuras 8-9 a 8-12 en Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1, mostrar el diseño en memoria del entorno almacenado, dependiendo del modo operativo del procesador (protegido o real) y el atributo operando-size actual (16-bit o 32-bit). En modo virtual-8086, se utilizan los diseños de modo real.

La instrucción FSTENV comprueba y descriptores cualquier excepción coma flotante sin máscara pendiente antes de almacenar el entorno FPU; la instrucción FNSTENV no. La imagen guardada refleja el estado de la FPU después de todas las instrucciones coma flotante anteriores a la instrucción FSTENV/FNSTENV en el flujo de instrucción se han ejecutado.

Estas instrucciones se utilizan a menudo por los manipuladores de excepción porque proporcionan acceso a la instrucción FPU y los punteros de datos. El ambiente se guarda normalmente en la pila. Masking todas las excepciones después de salvar el medio ambiente evita que las excepciones coma flotante interrumpan el manejador de excepción.

El ensamblador emite dos instrucciones para la instrucción FSTENV (una instrucción FWAIT seguida de una instrucción FNSTENV), y el procesador ejecuta cada una de estas instrucciones por separado. Si se genera una excepción para cualquiera de estas instrucciones, el guardar EIP apunta a la instrucción que causó la excepción.

La operación de esta instrucción es la misma en modos no-64-bit y modo 64-bit.

## Compatibilidad de arquitectura IA-32

Al operar un procesador Pentium o Intel486 en modo compatibilidad MS-DOS, es posible (bajo circunstancias inusuales) interrumpir una instrucción FNSTENV antes de ser ejecutado a descriptor una excepción FPU pendiente. Vea la sección titulada "No-Wait FPU Instrucciones pueden obtener FPU Interrupt in Window" en el Apéndice D del Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1, para una descripción de estas circunstancias. Una instrucción FNSTENV no se puede interrumpir de esta manera en procesadores Intel posteriores, excepto para el procesador Intel QuarkTM X1000.

## Operación

```text
DEST[FPUControlWord] := FPUControlWord;
DEST[FPUStatusWord] := FPUStatusWord;
DEST[FPUTagWord] := FPUTagWord;
DEST[FPUDataPointer] := FPUDataPointer;
DEST[FPUInstructionPointer] := FPUInstructionPointer;
DEST[FPULastInstructionOpcode] := FPULastInstructionOpcode;

FPU Flags Affected

The C0, C1, C2, and C3 are undefined.
```

## Excepciones coma flotante

None.
