---
summary: Lista de registros específicos modelo
---

## Descripción

Esta instrucción lee una lista proporcionada por software de hasta 64 MSRs y almacena sus valores en la memoria.

RDMSRLIST toma tres entradas implícitas operandos:

* RSI: Dirección lineal de una tabla de direcciones MSR (8 bytes por dirección)1. * RDI: Dirección lineal de una tabla en la que se almacenan los datos MSR (8 bytes por MSR). * RCX: 64 bitmask de bits válidos para los MSRs. Bit 0 es el bit válido para la entrada 0 en cada tabla, etc.

Para cada bit RCX [n] de 0 a 63, si RCX[n] es 1, RDMSRLIST leerá el MSR especificado en la entrada [n] en la tabla basada en RSI y lo escribirá a la memoria en la entrada [n] en la tabla basada en RDI.

Esto implica un máximo de 64 MSR que pueden ser procesados por esta instrucción. El procesador limpiará RCX[n] después de que termine de manejar ese MSR. Similar a operaciones de cuerda repetidas, RDMSRLIST apoya la terminación parcial para interrupciones, excepciones y trampas. En estas situaciones, el registro RIP guardado indicará la instrucción RDMSRLIST, mientras que el registro RCX habrá borrado bits correspondientes a todas las iteraciones completadas.

Esta instrucción debe ejecutarse a nivel de privilegios 0; de lo contrario, una excepción de protección general #GP(0) se genera. Esta instrucción realiza cheques específicos de MSR de la misma manera que RDMSR.

Aunque RDMSRLIST accede a las entradas en las dos tablas en orden, las lecturas reales de los MSR se pueden realizar fuera de orden: para entradas de mesa m < n, el procesador puede leer el MSR para entrada n antes de leer el MSR para entrada m. (Esto puede ser cierto también para una secuencia de ejecuciones de RDMSR.) El pedido está garantizado si la dirección de la IA32 BARRIER MSR (2FH) aparece en la tabla de direcciones MSR. Específicamente, si IA32 BARRIER aparece en la entrada m, entonces el MSR leído para cualquier entrada n con n > m no ocurrirá hasta (1) todas las instrucciones antes de RDMSRLIST han completado localmente; y (2) MSR se han leído para todas las entradas de la tabla antes de la entrada m.

Se permite al procesador (pero no se requiere) "cargar adelante" en la lista. Por ejemplo, puede causar un fallo de pagina para un acceso a una entrada de mesa después de la nth, a pesar de que el procesador ha leído solamente n MSRs.2

## Operación

```text
DO WHILE RCX != 0

    MSR_index := position of least significant bit set in RCX;
    Load MSR_address_table_entry from 8 bytes at the linear address RSI + (MSR_index * 8);
    IF MSR_address_table_entry[63:32] != 0 THEN #GP(0); FI;
    MSR_address := MSR_address_table_entry[31:0];
    IF RDMSR of the MSR with address MSR_address would #GP THEN #GP(0); FI;
    Store the value of the MSR with address MSR_address into 8 bytes at the linear address RDI + (MSR_index * 8);
    RCX[MSR_index] := 0;
    Allow delivery of any pending interrupts or traps;
OD;

1. Since MSR addresses are only 32-bits wide, bits 63:32 of each MSR address table entry is reserved.

2. For example, the processor may take a page fault due to a linear address for the 10th entry in the MSR address table despite only
    having completed the MSR reads up to entry 5.
```

## Banderas afectadas

None.
