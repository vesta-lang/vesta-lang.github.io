---
summary: Store x87 FPU State
---

## Descripción

Almacena el estado FPU actual (entorno operativo y pila de registro) en el destino especificado en memoria, y luego reinicia el FPU. Los cheques de instrucción FSAVE y descriptores pendientes coma flotante excepciones antes de almacenar el estado FPU; la instrucción FNSAVE no.

El entorno operativo FPU consta de la palabra de control FPU, palabra de estado, palabra de etiqueta, puntero de instruccion, puntero de datos, y último código de operación. Figuras 8-9 a 8-12 en Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1, mostrar el diseño en memoria del entorno almacenado, dependiendo del modo operativo del procesador (protegido o real) y el atributo operando-size actual (16-bit o 32-bit). En modo virtual-8086, se utilizan los diseños de modo real. Los contenidos de la pila de registro FPU se almacenan en los 80 bytes inmediatamente después de la imagen del entorno operativo.

La imagen guardada refleja el estado de la FPU después de todas las instrucciones coma flotante anteriores a la instrucción FSAVE/FNSAVE en el flujo de instrucción se han ejecutado.

Después de que el estado FPU se ha salvado, el FPU se reinicia a los mismos valores predeterminados a los que se establece con las instrucciones FINIT/FNINIT (ver "FINIT/FNINIT--Initialize coma flotante Unit" en este capítulo).

Las instrucciones FSAVE/FNSAVE se utilizan típicamente cuando el sistema operativo necesita realizar un interruptor de contexto, un controlador de excepción necesita utilizar el FPU, o un programa de aplicación necesita pasar un FPU "limpio" a un procedimiento.

El ensamblador emite dos instrucciones para la instrucción FSAVE (una instrucción FWAIT seguida de una instrucción FNSAVE), y el procesador ejecuta cada una de estas instrucciones por separado. Si se genera una excepción para cualquiera de estas instrucciones, el guardar EIP apunta a la instrucción que causó la excepción.

La operación de esta instrucción es la misma en modos no-64-bit y modo 64-bit.

## Compatibilidad de arquitectura IA-32

Para los coprocesadores de matemáticas Intel y FPU antes del procesador Intel Pentium, se debe ejecutar una instrucción FWAIT antes de intentar leer de la imagen de memoria almacenada con una instrucción FSAVE/FNSAVE anterior. Esta instrucción FWAIT ayuda a asegurar que la operación de almacenamiento se haya completado.

Al operar un procesador Pentium o Intel486 en modo compatibilidad MS-DOS, es posible (bajo circunstancias inusuales) interrumpir una instrucción FNSAVE antes de ser ejecutado a descriptor una excepción FPU pendiente. Vea la sección titulada "No-Wait FPU Instrucciones pueden obtener FPU Interrupt in Window" en el Apéndice D del Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1, para una descripción de estas circunstancias. Una instrucción FNSAVE no se puede interrumpir de esta manera en procesadores Intel posteriores, excepto para el procesador Intel QuarkTM X1000.

## Operación

```text
(* Save FPU State and Registers *)

DEST[FPUControlWord] := FPUControlWord;
DEST[FPUStatusWord] := FPUStatusWord;
DEST[FPUTagWord] := FPUTagWord;
DEST[FPUDataPointer] := FPUDataPointer;
DEST[FPUInstructionPointer] := FPUInstructionPointer;
DEST[FPULastInstructionOpcode] := FPULastInstructionOpcode;

DEST[ST(0)] := ST(0);
DEST[ST(1)] := ST(1);
DEST[ST(2)] := ST(2);
DEST[ST(3)] := ST(3);
DEST[ST(4)]:= ST(4);
DEST[ST(5)] := ST(5);
DEST[ST(6)] := ST(6);
DEST[ST(7)] := ST(7);

(* Initialize FPU *)

FPUControlWord := 037FH;
FPUStatusWord := 0;
FPUTagWord := FFFFH;
FPUDataPointer := 0;
FPUInstructionPointer := 0;
FPULastInstructionOpcode := 0;

FPU Flags Affected
The C0, C1, C2, and C3 flags are saved and then cleared.
```

## Excepciones coma flotante

None.
