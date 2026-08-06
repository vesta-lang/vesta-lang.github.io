---
summary: Configuración de nivel de usuario Dirección de monitores
---

## Descripción

El hardware de monitoreo de la dirección de armas UMONITOR utilizando una dirección especificada en el registro de origen (el rango de dirección que los controles de hardware de monitoreo para las operaciones de almacenamiento pueden determinarse utilizando el CPUID.05H). Una tienda a una dirección dentro del rango de dirección especificado activa el hardware de monitoreo. El estado del hardware de monitor es utilizado por UMWAIT.

El contenido del registro de fuentes es una dirección efectiva. Por defecto, el segmento DS se utiliza para crear una dirección lineal que se monitoriza. Se pueden usar anulaciones de segmento. El rango de direcciones debe utilizar la memoria del tipo de revés. Sólo la memoria de paso está garantizada para activar correctamente el hardware de monitoreo. La información adicional sobre la determinación del rango de dirección a utilizar para evitar falsos despertares se describe en el capítulo 11, "Multiple- Processor Management", del Intel(R) 64 y el Manual de Desarrolladores de Software de Arquitecturas IA-32, Volumen 3A.

La instrucción UMONITOR se ordena como una operación de carga con respecto a otras transacciones de memoria. La instrucción está sujeta a la comprobación de permisos y fallas asociadas con una carga de byte. Como una carga, UMONITOR establece el A-bit pero no el D-bit en las tablas de página.

UMONITOR y UMWAIT están disponibles cuando CPUID.07H.00H:ECX.WAITPKG[5] se enumera como 1. UMONITOR y UMWAIT pueden ser ejecutados a cualquier nivel de privilegio. Excepto por el ancho del registro de origen, la operación de la instrucción es la misma en modos no-64-bit y en modo 64-bit.

UMONITOR no interopera con la instrucción MWAIT heredada. Si UMONITOR fue ejecutado antes de ejecutar MWAIT y después de la ejecución más reciente de la instrucción MONITOR heredada, MWAIT no entrará en un estado optimizado. La ejecución continuará con la instrucción siguiente MWAIT.

La instrucción UMONITOR causa un aborto transaccional cuando se utiliza dentro de una región transaccional.

El ancho del registro de origen (16b, 32b o 64b) se determina por el ancho de dirección eficaz, que se ve afectado de la forma estándar por la configuración del modo de máquina y 67 prefijo.

## Operación

```text
UMONITOR sets up an address range for the monitor hardware using the content of source register as an effective
address and puts the monitor hardware in armed state. A store to the specified address range will trigger the
monitor hardware.
```

## Intel C/C++ compilador intrínseco

```c
UMONITOR void _umonitor(void *address);
```

## Excepciones numéricas

None.

1. El campo Mod del byte ModR/M debe tener valor 11B.
