---
summary: Escribir lista de registros específicos modelo
---

## Descripción

Esta instrucción escribe una lista proporcionada por software de hasta 64 MSRs con valores cargados de memoria.

WRMSRLIST toma tres entradas implícitas operandos:

* RSI: Dirección lineal de una tabla de direcciones MSR (8 bytes por dirección)1. * RDI: Dirección lineal de una tabla de la que se cargan los datos MSR (8 bytes por MSR). * RCX: 64 bitmask de bits válidos para los MSRs. Bit 0 es el bit válido para la entrada 0 en cada tabla, etc.

Para cada bit RCX [n] de 0 a 63, si RCX[n] es 1, WRMSRLIST escribirá el MSR especificado en la entrada [n] en la tabla basada en RSI con el valor leído de la memoria en la entrada [n] en la tabla basada en RDI.

Esto implica un máximo de 64 MSR que pueden ser procesados por esta instrucción. El procesador limpiará RCX[n] después de que termine de manejar ese MSR. Similar a operaciones de cuerda repetidas, WRMSRLIST apoya la terminación parcial para interrupciones, excepciones y trampas. En estas situaciones, el registro RIP guardado indicará la instrucción MSRLIST, mientras que el registro RCX habrá borrado bits correspondientes a todas las iteraciones completadas.

Esta instrucción debe ejecutarse a nivel de privilegios 0; de lo contrario, una excepción de protección general #GP(0) se genera. Esta instrucción realiza cheques específicos de MSR de la misma manera que WRMSR.

Al igual que WRMSRNS (y a diferencia de WRMSR), WRMSRLIST no se define como una instrucción serializadora (ver "Instrucciones de serialización" en el Capítulo 11 del Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 3A). Esto significa que el software no debe confiar en WRMSRLIST para drenar todas las escrituras amortiguadas a la memoria antes de que la siguiente instrucción sea traída y ejecutada. Por razones de aplicación, algunos procesadores pueden serializarse cuando escriben ciertos MSR, aunque eso no esté garantizado.

Como WRMSR y WRMSRNS, WRMSRLIST asegura que todas las operaciones antes de WRMSRLIST no usen ningún nuevo valor MSR y que todas las operaciones después de WRMSRLIST utilizan los nuevos valores. Una excepción a esta regla es ciertos eventos de monitorización de rendimiento relacionados con la tienda que sólo cuentan las tiendas cuando se drenan a la memoria. Puesto que WRMSRLIST no es una instrucción serializadora, si el software utiliza WRMSRLIST para cambiar los controles para tales eventos de monitorización de rendimiento, las tiendas emitidas antes de WRMSRLIST pueden ser contados sobre la base de los controles establecidos por WRMSRLIST. El software puede insertar la instrucción SERIALIZE antes del WRMSRLIST si así lo desea.

Los MSR que causan una invalidación TLB cuando se escriben a través de WRMSR (por ejemplo, MTRR) también causarán la misma invalidación TLB cuando se escribe por WRMSRLIST.

En lugares donde WRMSR está siendo utilizado como un proxy para una instrucción de serialización, se puede utilizar una instrucción de serialización diferente (por ejemplo, SERIALIZE).

WRMSRLIST escribe MSRs en orden, lo que significa que el procesador asegurará que un MSR en iteración "n" se escribirá sólo después de las iteraciones anteriores ("n-1"). Si el MSR más viejo escribe tenía un efecto secundario que afecta el comportamiento del siguiente MSR, el procesador asegurará que el efecto secundario es honrado.

Se permite al procesador (pero no se requiere) "cargar adelante" en la lista. Los siguientes son ejemplos de cosas que el procesador puede hacer:

* Utilice un viejo tipo de memoria o entrada TLB para cargas o tiendas a la memoria que contengan las tablas a pesar de un MSR

escrito por una iteración anterior cambiando MTRR o invalidando TLBs.

1. Dado que las direcciones MSR son sólo de 32 bits de ancho, se reservan los bits 63:32 de cada mesa de dirección MSR.

* Causa un fallo de pagina para el acceso a una entrada de mesa después de la nth, a pesar de que el procesador ha escrito solamente n MSRs.1

## Operación

```text
DO WHILE RCX != 0
    MSR_index := position of least significant bit set in RCX;
    Load MSR_address_table_entry from 8 bytes at the linear address RSI + (MSR_index * 8);
    IF MSR_address_table_entry[63:32] != 0 THEN #GP(0); FI;
    MSR_address := MSR_address_table_entry[31:0];
    Load MSR_data from 8 bytes at the linear address RDI + (MSR_index * 8);
    IF WRMSR of MSR_data to the MSR with address MSR_address would #GP THEN #GP(0); FI;
    Load the MSR with address MSR_address with MSR_data;
    RCX[MSR_index] := 0;
    Allow delivery of any pending interrupts or traps;

OD;
```

## Banderas afectadas

None.
