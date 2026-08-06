---
summary: Mover condicional
---

## Descripción

Cada una de las instrucciones de CMOVcc realiza una operación de movimiento si las banderas de estado en el registro EFLAGS (CF, OF, PF, SF y ZF) se encuentran en un estado (o condición). Un código de condición (cc) se asocia con cada instrucción para indicar la condición que se está probando. Si la condición no está satisfecha, no se realiza un movimiento y la ejecución continúa con la instrucción siguiendo la instrucción CMOVcc.

Específicamente, CMOVcc carga datos de su operando de origen en un registro temporal incondicionalmente (independientemente del código de condiciones y las banderas de estado en el registro EFLAGS). Si el código de condición asociado con la instrucción (cc) está satisfecho, los datos del registro temporal se copian luego en el operando de destino de la instrucción.

Estas instrucciones pueden mover valores de 16 bits, 32 bits o 64 bits de memoria a un registro de proposito general o de un registro de proposito general a otro. No se admiten movimientos condicionales de 8 bits de registro operandos.

La condición para cada CMOVcc mnemonic se da en la columna de descripción de la tabla anterior. Los términos "menos" y "mayor" se utilizan para las comparaciones de enteros con signo y los términos "arriba" y "bajo" se utilizan para enteros sin signo.

Debido a que un estado particular de las banderas de estado puede a veces ser interpretado de dos maneras, dos mnemonics se definen para algunos códigos de operación. Por ejemplo, la instrucción CMOVA (movimiento condicional si arriba) y la instrucción CMOVNBE (movimiento condicional si no por debajo o por igual) son mnemonía alternativa para el código de operación 0F 47H.

Las instrucciones CMOVcc fueron introducidas en procesadores familiares P6; sin embargo, estas instrucciones pueden no ser apoyadas por todos los procesadores IA-32. El software puede determinar si las instrucciones CMOVcc son compatibles mediante la comprobación de la información de características del procesador con la instrucción CPUID (ver "CPUID--CPU Identificación" en este capítulo).

En modo de 64 bits, el tamaño de operación predeterminado de la instrucción es de 32 bits. El uso del prefijo REX.R permite el acceso a registros adicionales (R8-R15). El uso del prefijo REX.W promueve la operación a 64 bits. Vea la tabla resumen al comienzo de esta sección para la codificación de datos y límites.

## Operación

```text
temp := SRC

IF condition TRUE
    THEN DEST := temp;

ELSE IF (OperandSize = 32 and IA-32e mode active)
    THEN DEST[63:32] := 0;

FI;
```

## Banderas afectadas

None.
