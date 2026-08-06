---
summary: Operación de cuerda de repetición mientras no Cero (Prefijo)
---

## Descripción

Repita una instrucción de cadena el número de veces especificado en el registro de cuenta o hasta que se establezca la bandera ZF. El registro de cuenta es CX, ECX, o RCX, dependiendo del tamaño de la dirección de la instrucción. Los REPNE (repetir mientras no igual) y REPNZ (repetir mientras no cero) mnemonics son prefijos que se pueden añadir a las instrucciones CMPS y SCAS. (El prefijo REPNZ es una forma sinónimo del prefijo REPNE).

Los prefijos REPNE/REPNZ se aplican sólo a una instrucción de cadena a la vez. Para repetir un bloque de instrucciones, utilice la instrucción LOOP u otra construcción de bucle. Estos prefijos repetidos hacen que la instrucción asociada sea repetida hasta que el recuento en registro sea decrementado a 0.

Los prefijos REPNE/REPNZ también verifican el estado de la bandera ZF después de cada iteración y terminan el bucle de repetición si se establece la bandera ZF. Cuando se prueban ambas condiciones de terminación, la causa de una terminación de repetición puede determinarse ya sea mediante la prueba del registro de cuenta con una instrucción JECXZ o mediante la prueba de la bandera ZF (con una instrucción JZ, JNZ o JNE).

La bandera ZF no requiere inicialización porque se comprueba sólo después de cada ejecución de CMPS y SCAS, y esas instrucciones actualizan la bandera ZF según los resultados de las comparaciones que hacen.

Cada una de las instrucciones de cadena utiliza una o dos direcciones de origen. La primera dirección de origen es DS:SI, DS:ESI, o DS:RSI, dependiendo del tamaño de la dirección de la instrucción; el segmento DS puede ser superado por un prefijo de instrucción. La segunda dirección de la fuente es ES:DI, ES:EDI, o ES:RDI, dependiendo del tamaño de la dirección de la instrucción; el segmento ES puede no ser superado. (Nota que, en modo de 64 bits, las direcciones de base de los segmentos CS, DS, ES y SS se tratan como cero).

Del mismo modo, el tamaño del registro de cuenta es el tamaño de la dirección de la instrucción. Así, el registro de cuenta predeterminado en modo de 64 bits es RCX; REX.W no tiene efecto en el tamaño de la dirección y el registro de cuenta. Si 67H se utiliza para anular el tamaño de la dirección predeterminada, el tamaño del registro de cuenta también está anulado.

Una operación de cadena de repetición puede suspenderse por una excepción o interrupción. Cuando esto sucede, el estado de los registros se conserva para permitir que la operación de cadena se reanude a un regreso de la excepción o interrumpe el manejador. La fuente y los registros de destino apuntan a los siguientes elementos de cadena a ser operados, el registro EIP apunta a la instrucción de cadena, y el registro ECX tiene el valor que tenía después de la última iteración exitosa de la instrucción. Este mecanismo permite que las operaciones de cadena larga continúen sin afectar el tiempo de respuesta interrumpida del sistema.

Cuando se produce una falla durante la ejecución de una instrucción CMPS o SCAS prefijada con REPNE o REPNZ, el valor EFLAGS es restaurado al estado antes de la ejecución de la instrucción. Dado que las instrucciones SCAS y CMPS no utilizan EFLAGS como entrada, el procesador puede reanudar la instrucción después del manipulador el fallo de pagina.

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
          IF CountReg = 0
                THEN exit WHILE loop; FI;
          IF ZF = 1
                THEN exit WHILE loop; FI;

    OD;
```

## Banderas afectadas

Ninguna; sin embargo, las instrucciones CMPS y SCAS establecen las banderas de estado en el registro EFLAGS.
