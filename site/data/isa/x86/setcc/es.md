---
summary: Set Byte on Condition
---

## Descripción

Se establece el operando de destino a 0 o 1 dependiendo de la configuración de las banderas de estado (CF, SF, OF, ZF y PF) en el registro EFLAGS. El operando de destino señala un registro de byte o un byte en memoria. El código de condición sufijo (cc) indica la condición para la que se está probando.

Los términos "arriba" y "bajo" se asocian con la bandera CF y se refieren a la relación entre dos valores enteros no identificados. Los términos "verdedor" e "menos" están asociados con las banderas SF y OF y se refieren a la relación entre dos valores enteros firmados.

Muchas de las instrucciones SETcc códigos de operación tienen mnemonía alternativa. Por ejemplo, SETG (conjunto si mayor) y SETNLE (conjunto si no menos o igual) tienen el mismo código de operación y prueba para la misma condición: ZF es igual a 0 y SF igual a OF. Estas mnemonias alternativas se proporcionan para hacer el código más inteligible. Apéndice B, "EFLAGS Códigos de Estado", en Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1, muestra la mnemonics alternativa para varias condiciones de prueba.

Algunos idiomas representan uno lógico como entero con todos los bits fijados. Esta representación se puede obtener eligiendo la condición lógicamente opuesta para la instrucción SETcc, luego decrementando el resultado. Por ejemplo, para probar el desbordamiento, utilice la instrucción SETNO, luego decrementar el resultado.

El campo reg del byte ModR/M no se utiliza para la instrucción SETCC y los bits código de operación son ignorados por el procesador.

En modo IA-64, el tamaño de operando se fija en 8 bits. El uso del prefijo REX permite un tratamiento uniforme a los registros adicionales de byte. De lo contrario, la operación de esta instrucción es la misma que en el modo legado y el modo de compatibilidad.

## Operación

```text
IF condition
    THEN DEST := 1;
    ELSE DEST := 0;

FI;
```

## Banderas afectadas

None.
