---
summary: Saltar si la condición es Met
---

## Descripción

Comprueba el estado de uno o más de las banderas de estado en el registro EFLAGS (CF, OF, PF, SF y ZF) y, si las banderas están en el estado especificado (condición), realiza un salto a la instrucción de destino especificada por el operando de destino. Un código de condición (cc) se asocia con cada instrucción para indicar la condición que se está probando. Si la condición no está satisfecha, el salto no se realiza y la ejecución continúa con la instrucción siguiendo la instrucción Jcc.

La instrucción de destino se especifica con un offset relativo (un offset firmado en relación con el valor actual del puntero de instruccion en el registro EIP). Un offset relativo (rel8, rel16, o rel32) se especifica generalmente como una etiqueta en código de montaje, pero a nivel de código de máquina, se codifica como un valor inmediato firmado, de 8 bits o de 32 bits, que se añade al puntero de instruccion. La codificación de instrucciones es más eficiente para los offsets de 128 a +127. Si el atributo el operando-size es 16, los dos bytes superiores del registro EIP se limpian, dando como resultado un tamaño máximo puntero de instruccion de 16 bits.

Las condiciones para cada Jcc mnemonic se dan en la columna "Descripción" de la tabla en la página anterior. Los términos "menos" y "mayor" se utilizan para las comparaciones de enteros con signo y los términos "arriba" y "bajo" se utilizan para enteros sin signo.

Debido a que un estado particular de las banderas de estado puede a veces ser interpretado de dos maneras, dos mnemonics se definen para algunos códigos de operación. Por ejemplo, la instrucción JA (jump if above) y la instrucción JNBE (jump if not below or equal) son mnemonics suplentes para el código de operación 77H.

La instrucción Jcc no soporta saltos lejanos (jugos a otros segmentos de código). Cuando el objetivo para el salto condicional está en un segmento diferente, use la condición opuesta de la condición que se está probando para la instrucción Jcc, y luego acceda al objetivo con un salto lejano incondicional (instrucción JMP) al otro segmento. Por ejemplo, el siguiente salto condicional es ilegal:

JZ FARLABEL;

Para lograr este salto lejano, utilice las siguientes dos instrucciones: JNZ BEYOND; JMP FARLABEL; BEYOND:

Las instrucciones JRCXZ, JECXZ y JCXZ difieren de otras instrucciones de Jcc porque no verifican banderas de estado. En lugar de eso, verifican RCX, ECX o CX para 0. El registro es determinado por el atributo tamaño de la dirección. Estas instrucciones son útiles cuando se utilizan al principio de un bucle que termina con una instrucción de bucle condicional (como LOOPNE). Se pueden utilizar para evitar que una secuencia de instrucciones entre en un bucle cuando RCX, ECX o CX es 0. Esto haría que el bucle ejecutara 264, 232 o 64K veces (no cero veces).

Todos los saltos condicionales se convierten en garras de código de una o dos líneas de caché, independientemente de la dirección de salto o caqueabilidad.

En modo de 64 bits, tamaño de operando se fija en 64 bits. JMP Short es RIP = RIP + signo de compensación de 8 bits extendido a 64 bits. JMP Cerca es RIP = RIP + 32 bits de señal offset extendido a 64 bits.

## Operación

```text
IF condition
    THEN
          tempEIP := EIP + SignExtend(DEST);
          IF OperandSize = 16
                THEN tempEIP := tempEIP AND 0000FFFFH;
          FI;
    IF tempEIP is not within code segment limit
          THEN #GP(0);
          ELSE EIP := tempEIP
    FI;

FI;
```

## Banderas afectadas

None.
