---
summary: Lea Random SEED
---

## Descripción

Carga un hardware generado valor aleatorio y almacenarlo en el registro de destino. El valor aleatorio se genera a partir de un generador de bits aleatorios mejorados NRBG (Non Deterministic Random Bit Generator) que cumple con NIST SP800-90B y NIST SP800-90C en el modo de construcción XOR. El tamaño del valor aleatorio se determina por el tamaño del registro de destino y el modo operativo. La bandera de acarreo indica si hay un valor aleatorio disponible en el momento en que se ejecuta la instrucción. CF=1 indica que los datos en el destino son válidos. De lo contrario CF=0 y los datos en el operando de destino serán devueltos como ceros para el ancho especificado. Todas las otras banderas se ven obligadas a 0 en cualquier situación. El software debe verificar el estado de CF=1 para determinar si se ha devuelto un valor de semilla al azar válido, de lo contrario se espera que se saque y vuelva a ejecutar RDSEED (ver Sección 1.2).

La instrucción RDSEED está disponible en todos los niveles de privilegios. La instrucción RDSEED ejecuta normalmente dentro o fuera de una región de transacción.

En modo de 64 bits, el tamaño de operando predeterminado de la instrucción es de 32 bits. El uso de un prefijo REX en forma de REX.B permite el acceso a registros adicionales (R8-R15). Utilizar un prefijo REX en forma de REX.W promueve la operación a 64 bits operandos. Vea la tabla resumen al comienzo de esta sección para la codificación de datos y límites.

## Operación

```text
IF HW_NRND_GEN.ready = 1
    THEN
          CASE of
                operand size is 64: DEST[63:0] := HW_NRND_GEN.data;
                operand size is 32: DEST[31:0] := HW_NRND_GEN.data;
                operand size is 16: DEST[15:0] := HW_NRND_GEN.data;
          ESAC;
          CF := 1;
    ELSE
          CASE of
                operand size is 64: DEST[63:0] := 0;
                operand size is 32: DEST[31:0] := 0;
                operand size is 16: DEST[15:0] := 0;
          ESAC;
          CF := 0;

FI;

OF, SF, ZF, AF, PF := 0;
```

## Banderas afectadas

La bandera CF se establece según el resultado (ver la sección "Operación" arriba). Las banderas OF, SF, ZF, AF y PF se fijan en 0.

C/C++ Compilador Equivalente Intrínseco

RDSEED int  rdseed16 step( unsigned short * ); RDSEED int  rdseed32 step( unsigned int * ); RDSEED int  rdseed64 step( unsigned   int64 *);
