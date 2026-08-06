---
summary: Comparar y cambiar Bytes
---

## Descripción

Compara el valor de 64 bits en EDX:EAX (o valor de 128 bits en RDX:RAX si tamaño de operando es de 128 bits) con el operando (operando de destino). Si los valores son iguales, el valor de 64 bits en ECX:EBX (o valor de 128 bits en RCX:RBX) se almacena en el operando de destino. De lo contrario, el valor en el operando de destino se carga en EDX:EAX (o RDX:RAX). El operando de destino es una ubicación de memoria de 8 bytes (o ubicación de memoria de 16 bytes si tamaño de operando es de 128 bits). Para el EDX:EAX y ECX:EBX pares de registro, EDX y ECX contienen los 32 bits de alto orden y EAX y EBX contienen los 32 bits de bajo orden de un valor de 64 bits. Para el RDX:RAX y RCX:RBX pares de registro, RDX y RCX contienen los 64 bits de alto orden y RAX y RBX contienen los 64bits de bajo orden de un valor de 128 bits.

Esta instrucción se puede utilizar con un prefijo LOCK para permitir que la instrucción se ejecute atómicamente. Para simplificar la interfaz al bus del procesador, el operando de destino recibe un ciclo de escritura sin tener en cuenta el resultado de la comparación. El operando de destino se escribe de nuevo si la comparación falla; de lo contrario, el operando de origen se escribe en el destino. (El procesador nunca produce una lectura cerrada sin producir también una escritura cerrada.)

En modo 64-bit, el tamaño de operación predeterminado es de 64 bits. El uso del prefijo REX.W promueve la operación a 128 bits. Tenga en cuenta que CMPXCHG16B requiere que el destino (memoria) operando sea 16-byte alineado. Vea la tabla resumen al comienzo de esta sección para la codificación de datos y límites. Para obtener información sobre la bandera CPUID que indica CMPX- CHG16B, consulte el Capítulo 21 en el Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1.

## Compatibilidad de arquitectura IA-32

Esta codificación de instrucciones no es compatible con procesadores Intel antes que los procesadores de Pentium.

## Operación

```text
IF (64-Bit Mode and OperandSize = 64)
    THEN
          TEMP128 := DEST

        IF (RDX:RAX = TEMP128)

                THEN
                      ZF := 1;
                      DEST := RCX:RBX;

                ELSE
                      ZF := 0;
                      RDX:RAX := TEMP128;
                      DEST := TEMP128;
                      FI;

          FI
    ELSE

          TEMP64 := DEST;

        IF (EDX:EAX = TEMP64)

                THEN
                      ZF := 1;
                      DEST := ECX:EBX;

                ELSE
                      ZF := 0;
                      EDX:EAX := TEMP64;
                      DEST := TEMP64;
                      FI;

          FI;
FI;
```

## Banderas afectadas

La bandera ZF se establece si el operando de destino y EDX:EAX son iguales; de lo contrario se pone a cero. Las banderas CF, PF, AF, SF y OF no son afectadas.
