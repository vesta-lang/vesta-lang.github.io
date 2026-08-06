---
summary: Mover a/desde Registros de Control
---

## Descripción

Mueva el contenido de un registro de control (CR0, CR2, CR3, CR4, o CR8) a un registro de proposito general o el contenido de un registro de proposito general a un registro de control. El tamaño de operando para estas instrucciones es siempre 32 bits en modos no-64-bit, independientemente del atributo el operando-size. En un procesador capaz de 64 bits, una ejecución de MOV a CR fuera de modo de 64 bits ceros los 32 bits superiores del registro de control. (Ver "Registros de Control" en el Capítulo 2 de Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 3A, para una descripción detallada de las banderas y campos en los registros de control.) Esta instrucción se puede ejecutar sólo cuando el nivel de privilegio actual es 0.

A nivel el código de operación, el campo reg dentro del byte ModR/M especifica cuál de los registros de control está cargado o leído. Los 2 bits en el campo mod son ignorados. El campo r/m especifica el registro de proposito general cargado o leído. Algunos de los bits en CR0, CR3 y CR4 están reservados y deben ser escritos con ceros. Se ignora el intento de fijar cualquier bit reservado en CR0[31:0]. Intento establecer cualquier bit reservado en CR0[63:32] resultados en una excepción de protección general, #GP(0). Cuando los PCID no están habilitados, bits 2:0 y bits 11:5 de CR3 no se utilizan y los intentos de establecerlos son ignorados. Véase el siguiente párrafo para el tratamiento de bits reservados en CR3. Intentar establecer cualquier bit reservado en CR4 resultados en #GP(0). En Pentium 4, procesadores familiares Intel Xeon y P6, CR0.ET permanece establecido después de cualquier carga de CR0; los intentos de despejar este bit no tienen ningún impacto.

Normalmente, MAXPHYADDR es el valor enumerado en CPUID.80000008H:EAX[7:0]. Sin embargo, si IA32 TME ACTI-VATE[0] = 1 (indicando esoTMEha sido configurado),MAXPHYADDRse reduce por el valor de IA32 TME ACTI-VATE[39:36] cuando un procesador lógico está fuera del modo de arbitraje seguro (SEAM; ver el capítulo 35 del Intel(R) 64 y el Manual del Desarrollador de Software de Arquitecturas IA-32, Volumen 3); el valor no se reduce enSEAM. Un intento de establecer cualquier bit reservado en CR3[63:MAXPHYADDR] resultados en #GP(0).

En ciertos casos, estas instrucciones tienen el efecto secundario de invalidar las entradas en los TLB y los caches de paging-structure. Ver Sección 5.10.4.1, "Operaciones que Invalidan TLBs y Paging-Structure Caches", en Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 3A, para detalles.

Los siguientes efectos secundarios son específicos para la familia de procesadores Pentium 4, Intel Xeon y P6: al modificar PE o PG en el registro CR0, o PSE o PAE en el registro CR4, todas las entradas TLB son desactivadas, incluyendo entradas globales. El software no debe depender de esta funcionalidad en todos los procesadores Intel 64 o IA-32.

En modo de 64 bits, el tamaño de operación predeterminado de la instrucción es de 64 bits. El prefijo REX.R debe ser utilizado para acceder a CR8. El uso de REX.B permite el acceso a registros adicionales (R8-R15). Se ignora el uso del prefijo REX.W o el prefijo 66H. El uso del prefijo REX.R para especificar un registro que no sea CR8 causa una excepción de código de operación no válido. Vea la tabla resumen al comienzo de esta sección para la codificación de datos y límites.

Si CR4.PCIDE = 1, bit 63 del operando de origen a MOV a CR3 determina si la instrucción invalida las entradas en los TLB y los caches de paging-structure (ver Sección 5.10.4.1, "Operaciones que invalidan TLBs y Paging-Structure Caches", en el Volumen Intel(R) 64 y Manual de Arquitectura IA-32). La instrucción no modifica bit 63 de CR3, que está reservada y siempre 0.

Ver "Cambios para el comportamiento de la instrucción en VMX Operación no-rota" en el capítulo 27 de Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 3C, para obtener más información sobre el comportamiento de esta instrucción en VMX operación no-raíz.

## Operación

```text
DEST := SRC;
```

## Banderas afectadas

Las banderas OF, SF, ZF, AF, PF y CF quedan indefinidas.
