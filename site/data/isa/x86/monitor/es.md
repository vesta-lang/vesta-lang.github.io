---
summary: Configurar la dirección de monitor
---

## Descripción

El hardware de monitoreo de la dirección de armas de instrucción MONITOR utilizando una dirección especificada en EAX (el rango de dirección que los controles de hardware de monitoreo para las operaciones de la tienda pueden determinarse utilizando CPUID). Una tienda a una dirección dentro del rango de dirección especificado activa el hardware de monitoreo. El estado del hardware de monitor es utilizado por MWAIT.

La dirección se especifica en RAX/EAX/AX y el tamaño se basa en el tamaño efectivo de la dirección de la instrucción codificada. Por defecto, el segmento DS se utiliza para crear una dirección lineal que se monitoriza. Se pueden usar anulaciones de segmento.

ECX y EDX también se utilizan. Ellos comunican otra información a MONITOR. ECX especifica extensiones opcionales. EDX especifica indirectas opcionales; no cambia el comportamiento arquitectónico de la instrucción. Para el procesador Pentium 4 (familia 15, modelo 3), no se definen extensiones ni indicios. Insinuaciones indefinidas en EDX son ignoradas por el procesador; extensiones indefinidas en ECX levanta una falla de protección general.

El rango de direcciones debe utilizar la memoria del tipo de revés. Sólo la memoria de paso atrás activará correctamente el hardware de monitoreo. Información adicional sobre la determinación del rango de dirección a utilizar para evitar falsos despertares se describe en el capítulo 11, "Multiple-Processor Management", del Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 3A.

La instrucción MONITOR se ordena como una operación de carga con respecto a otras transacciones de memoria. La instrucción está sujeta a la comprobación de permisos y fallas asociadas con una carga de byte. Como una carga, MONITOR establece el A-bit pero no el D-bit en las tablas de página.

CPUID.01H:ECX.MONITOR[3] indica la disponibilidad de MONITOR y MWAIT en el procesador. Cuando se establece, MONITOR se puede ejecutar sólo a nivel de privilegios 0 (utilizar a cualquier otro nivel de privilegios resulta en una excepción de código de operación no válido). El sistema operativo o sistema BIOS puede deshabilitar esta instrucción utilizando el IA32 MISC ENABLE MSR; desactivar MONITOR aclara la bandera CPUID característica y hace que la ejecución genere una excepción de código de operación no válido.

La operación de la instrucción es la misma en modos no-64-bit y modo 64-bit.

## Operación

```text
MONITOR sets up an address range for the monitor hardware using the content of EAX (RAX in 64-bit mode) as an effective address
and puts the monitor hardware in armed state. Always use memory of the write-back caching type. A store to the specified address
range will trigger the monitor hardware. The content of ECX and EDX are used to communicate other information to the monitor
hardware.
```

## Intel C/C++ compilador intrínseco

```c
MONITOR void _mm_monitor(void const *p, unsigned extensions,unsigned hints);
```

## Excepciones numéricas

None.
