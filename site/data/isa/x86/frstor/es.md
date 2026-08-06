---
summary: Restore x87 FPU State
---

## Descripción

Carga el estado FPU (ambiente operativo y pila de registro) del área de memoria especificada con el operando de origen. Estos datos del estado se escriben típicamente a la ubicación de memoria especificada por una instrucción FSAVE/FNSAVE anterior.

El entorno operativo FPU consta de la palabra de control FPU, palabra de estado, palabra de etiqueta, puntero de instruccion, puntero de datos, y último código de operación. Figuras 8-9 a 8-12 en Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1, mostrar el diseño en memoria del entorno almacenado, dependiendo del modo operativo del procesador (protegido o real) y el atributo operando-size actual (16-bit o 32-bit). En modo virtual-8086, se utilizan los diseños de modo real. Los contenidos de la pila de registro FPU se almacenan en los 80 bytes inmediatamente después de la imagen del entorno operativo.

La instrucción FRSTOR debe ejecutarse en el mismo modo operativo que la instrucción FSAVE/FNSAVE correspondiente.

Si uno o más bits de excepción desenmascarados se establecen en la nueva palabra de estado FPU, la excepción una coma flotante se generará en la ejecución de la siguiente instrucción coma flotante (excepto las instrucciones de coma flotante no espera, ver la sección titulada "Manejo de Excepciones Software" en el capítulo 8 del Intel(R) 64 e IA-32 Architectures Software Manual de desarrollador, Volumen 1) Para evitar levantar excepciones al cargar un nuevo entorno operativo, despejar todas las banderas de excepción en la palabra de estado FPU que se está cargando.

La operación de esta instrucción es la misma en modos no-64-bit y modo 64-bit.

## Operación

```text
FPUControlWord := SRC[FPUControlWord];
FPUStatusWord := SRC[FPUStatusWord];
FPUTagWord := SRC[FPUTagWord];
FPUDataPointer := SRC[FPUDataPointer];
FPUInstructionPointer := SRC[FPUInstructionPointer];
FPULastInstructionOpcode := SRC[FPULastInstructionOpcode];

ST(0) := SRC[ST(0)];
ST(1) := SRC[ST(1)];
ST(2) := SRC[ST(2)];
ST(3) := SRC[ST(3)];
ST(4) := SRC[ST(4)];
ST(5) := SRC[ST(5)];
ST(6) := SRC[ST(6)];
ST(7) := SRC[ST(7)];

FPU Flags Affected

The C0, C1, C2, C3 flags are loaded.
```

## Excepciones coma flotante

Ninguna; sin embargo, si una excepción desenmascarada está cargada en la palabra de estado, se genera en la ejecución de la siguiente instrucción coma flotante "esperando".
