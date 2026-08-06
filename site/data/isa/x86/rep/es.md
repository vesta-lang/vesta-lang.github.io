---
summary: Operación de cuerda de repetición (Prefijo)
---

## Descripción

Repita una instrucción de cadena el número de veces especificado en el registro de cuenta. El registro de cuenta es CX, ECX, o RCX, dependiendo del tamaño de la dirección de la instrucción. El REP (repeat) mnemonic es un prefijo que se puede añadir a las instrucciones INS, OUTS, MOVS, LODS y STOS.

Los prefijos REP se aplican sólo a una instrucción de cadena a la vez. Para repetir un bloque de instrucciones, utilice la instrucción LOOP u otra construcción de bucle. Los prefijos REP hacen que la instrucción asociada sea repetida hasta que el recuento en el registro sea decrementado a 0.

Cada una de las instrucciones de cadena utiliza una dirección de origen, una dirección de destino o ambas. La dirección de origen es DS:SI, DS:ESI, o DS:RSI, dependiendo del tamaño de la dirección de la instrucción; el segmento DS puede ser superado por un prefijo de instrucción. La dirección de destino es ES:DI, ES:EDI, o ES:RDI, dependiendo del tamaño de la dirección de la instrucción; el segmento ES puede no ser superado. (Nota que, en modo de 64 bits, las direcciones de base de los segmentos CS, DS, ES y SS se tratan como cero).

Del mismo modo, el tamaño del registro de cuenta es el tamaño de la dirección de la instrucción. Así, el registro de cuenta predeterminado en modo de 64 bits es RCX; REX.W no tiene efecto en el tamaño de la dirección y el registro de cuenta. Si 67H se utiliza para anular el tamaño de la dirección predeterminada, el tamaño del registro de cuenta también está anulado.

Una operación de cadena de repetición puede suspenderse por una excepción o interrupción. Cuando esto sucede, el estado de los registros se conserva para permitir que la operación de cadena se reanude a un regreso de la excepción o interrumpe el manejador. La fuente y los registros de destino apuntan a los siguientes elementos de cadena a ser operados, el registro EIP apunta a la instrucción de cadena, y el registro ECX tiene el valor que tenía después de la última iteración exitosa de la instrucción. Este mecanismo permite que las operaciones de cadena larga continúen sin afectar el tiempo de respuesta interrumpida del sistema.

Utilice las instrucciones REP INS y REP OUTS con precaución. No todos los puertos I/O pueden descriptor la tasa a la que se ejecutan estas instrucciones. Tenga en cuenta que una instrucción REP STOS es la manera más rápida de inicializar un gran bloque de memoria.

REP INS puede leer desde el puerto I/O sin escribir a la ubicación de memoria si se produce una excepción o salida VM debido a la escritura (por ejemplo, #PF). Si esto sería problemático, por ejemplo, porque el puerto de I/O leído tiene efectos secundarios, el software debe asegurar la escritura a la ubicación de memoria no causa una excepción o salida VM.

## Operación

```text
IF AddressSize = 16
  THEN
     Use CX for CountReg;
     Implicit Source/Dest operand for memory use of SI/DI;
  ELSE IF AddressSize = 64
     THEN Use RCX for CountReg;
     Implicit Source/Dest operand for memory use of RSI/RDI;
  ELSE
     Use ECX for CountReg;
     Implicit Source/Dest operand for memory use of ESI/EDI;

FI;
WHILE CountReg  0

    DO
          Service pending interrupts (if any);
          Execute associated string instruction;
          CountReg := (CountReg  1);

    OD;
```

## Banderas afectadas

None.
