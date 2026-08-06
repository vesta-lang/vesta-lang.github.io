---
summary: Carga x87 FPU Medio ambiente
---

## Descripción

Carga el entorno operativo x87 FPU completo de memoria en los registros FPU. El operando de origen especifica el primer byte de los datos del entorno operativo en memoria. Estos datos se escriben típicamente a la ubicación de memoria especificada por una instrucción FSTENV o FNSTENV.

El entorno operativo FPU consta de la palabra de control FPU, palabra de estado, palabra de etiqueta, puntero de instruccion, puntero de datos, y último código de operación. Figuras 8-9 a 8-12 en Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1, mostrar el diseño en memoria del entorno cargado, dependiendo del modo operativo del procesador (protegido o real) y el atributo operando-size actual (16-bit o 32-bit). En modo virtual-8086, se utilizan los diseños de modo real.

La instrucción FLDENV debe ejecutarse en el mismo modo operativo que la instrucción FSTENV/FNSTENV correspondiente.

Si una o más banderas de excepción desenmascaradas se establecen en la nueva palabra de estado FPU, la excepción de una coma flotante se generará en la ejecución de la siguiente instrucción coma flotante (excepto las instrucciones de coma flotante no espera, ver la sección titulada "Manejo de Excepciones Software" en el capítulo 8 del Intel(R) 64 e IA-32 Architectures Software Manual de desarrollador, Volumen 1) Para evitar generar excepciones al cargar un nuevo entorno, despejar todas las banderas de excepción en la palabra de estado FPU que se está cargando.

Si se produce una página o un límite de culpa durante la ejecución de esta instrucción, el estado de los registros x87 FPU vistos por el manipulador de fallas puede ser diferente al estado cargado de la memoria. En tales situaciones, el controlador de fallas debe ignorar el estado de los registros x87 FPU, descriptor la falla, y el retorno. La instrucción FLDENV completará la carga de los registros x87 FPU sin inconsistencia de contexto resultante.

La operación de esta instrucción es la misma en modos no-64-bit y modo 64-bit.

## Operación

```text
FPUControlWord := SRC[FPUControlWord];
FPUStatusWord := SRC[FPUStatusWord];
FPUTagWord := SRC[FPUTagWord];
FPUDataPointer := SRC[FPUDataPointer];
FPUInstructionPointer := SRC[FPUInstructionPointer];
FPULastInstructionOpcode := SRC[FPULastInstructionOpcode];

FPU Flags Affected

The C0, C1, C2, C3 flags are loaded.
```

## Excepciones coma flotante

Ninguna; sin embargo, si una excepción desenmascarada está cargada en la palabra de estado, se genera en la ejecución de la siguiente instrucción coma flotante "esperando".
