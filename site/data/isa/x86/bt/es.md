---
summary: Prueba de bits
---

## Descripción

Selecciona el bit en un bit string (especificado con el primer operando, llamado la base de bits) en la bit-posición designada por el bit offset (especificado por el segundo operando) y almacena el valor del bit en la bandera CF. El bit base operando puede ser un registro o una ubicación de memoria; el bit offset operando puede ser un registro o un valor inmediato:

* Si el bit base operando especifica un registro, la instrucción toma el modulo 16, 32, o 64 del bit offset

operando (tamaño de modulo depende del modo y tamaño de registro; operandos de 64 bits están disponibles sólo en modo de 64 bits).

* Si el bit base operando especifica una ubicación de memoria, el operando representa la dirección del byte en memoria

que contiene la base bit (bit 0 del byte especificado) de la cadena bit. El rango de la posición del bit que puede ser referenciado por el operando offset depende del tamaño de operando.

See also: Bit(BitBase, BitOffset) on page 3-11.

Algunos ensambladores soportan compensaciones de bit inmediatas superiores a 31 utilizando el campo de compensación de bits inmediato en combinación con el campo de desplazamiento del operando de memoria. En este caso, los 3 o 5 bits de bajo orden (3 para 16 bits operandos, 5 para 32 bits operandos) de la compensación inmediata se almacenan en el campo de compensación inmediata de bits, y los bits de alto orden se desplazan y se combinan con el desplazamiento de byte en el modo de dirección por el ensamblador. El procesador ignorará los bits de alta orden si no son cero.

Al acceder a un poco de memoria, el procesador puede acceder a 4 bytes a partir de la dirección de memoria para un tamaño de operando de 32 bits, utilizando la siguiente relación:

```text
    Effective Address + (4  (BitOffset DIV 32))
```

O, puede acceder a 2 bytes a partir de la dirección de memoria para un operando de 16 bits, utilizando esta relación:

```text
    Effective Address + (2  (BitOffset DIV 16))
```

Puede hacerlo incluso cuando sólo un solo byte necesita ser accedido para alcanzar el bit dado. Al utilizar este mecanismo de solución de bits, el software debe evitar las áreas de referencia de la memoria cercanas a los agujeros espaciales. En particular, debe evitar referencias a los registros I/O de memoria. En cambio, el software debe utilizar las instrucciones MOV para cargar o almacenar a estas direcciones, y utilizar el formulario de registro de estas instrucciones para manipular los datos.

En modo de 64 bits, el tamaño de operación predeterminado de la instrucción es de 32 bits. El uso de un prefijo REX en forma de REX.R permite el acceso a registros adicionales (R8-R15). Utilizar un prefijo REX en forma de REX.W promueve la operación a 64 bits operandos. Vea la tabla resumen al comienzo de esta sección para la codificación de datos y límites.

## Operación

```text
CF := Bit(BitBase, BitOffset);
```

## Banderas afectadas

La bandera CF contiene el valor del bit seleccionado. La bandera ZF no está afectada. Las banderas OF, SF, AF y PF quedan indefinidas.
