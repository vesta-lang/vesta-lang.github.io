---
summary: Enqueue Command Supervisor
---

## Descripción

La instrucción ENQCMDS permite que el software del sistema escriba comandos para encuue registers, que son registros especiales de dispositivos a los que se accede utilizando I/O (MMIO).

Los registros esperan que los escritos tengan el formato dado en la Figura 3-11 y explicado en la sección sobre "ENQCMD--Enqueue Command".

La instrucción ENQCMDS comienza leyendo 64 bytes de datos de comando de su fuente operando de memoria. Esta es una carga ordinaria con caqueabilidad y pedidos de memoria implicados normalmente por el tipo de memoria. El operando de origen no necesita ser alineado, y no hay garantía de que todos los 64 bytes están cargados atómico. Bits 30:20 del operando de origen debe ser cero.

ENQCMDS formatos sus datos fuente de forma diferente de ENQCMD. Específicamente, los convierte en datos de comandos de la siguiente manera:

* Comando[19:0] conseguir pedazos 19:0 del operando de origen que fue leído de memoria. Estos 20 bits se comunican

un identificador de dirección-espacio de proceso (PASID).

* El mando [30:20] es cero. * Comando[511:31] conseguir bits 511:31 del operando de origen que fue leído de memoria. Bit 31 comunica a

identificación de privilegios (0 = usuario; 1 = supervisor).

La instrucción ENQCMDS utiliza una tienda de encuue (definida a continuación) para escribir estos datos de comandos al operando de destino. La dirección del operando de destino se especifica en un registro de proposito general como compensación en el segmento ES (el segmento no puede ser superado).1 La dirección lineal de destino debe ser alineada de 64 bytes. El funcionamiento de una tienda enqueue ignora el tipo de memoria de la dirección de memoria de destino.

Una tienda de encuues no se ordena en relación con tiendas mayores a la memoria WB o WC (incluyendo tiendas no temporales) o a las ejecuciones de la CLFLUSHOPT o CLWB (cuando se aplica a direcciones distintas a la de la tienda de encuue). El software puede hacer cumplir tal orden ejecutando una instrucción de esgrima como SFENCE o MFENCE antes de la tienda de encuue.

Una tienda de encuues no escribe los datos en la jerarquía de caché, ni recoge ningún dato en la jerarquía de caché. Los datos de comando de una tienda de encuue nunca se combinan con el de cualquier otra tienda a la misma dirección.

A diferencia de otras tiendas, una tienda enqueue devuelve un estado, que la instrucción ENQCMDS carga en la bandera ZF en el registro RFLAGS:

* ZF = 0 (success) informa que los datos de comandos de 64 bytes fueron escritos de forma atómica a un registro de entrada del dispositivo

y ha sido aceptado por el dispositivo. (No garantiza que el dispositivo haya actuado en el comando; puede que lo haya solicitado para la ejecución posterior.)

* ZF = 1 (retry) informa que los datos de comando no fueron aceptados. Este estado es devuelto si el destino

dirección es un registro de la entrada, pero el comando no fue aceptado debido a la capacidad u otras razones temporales.

1. En modo de 64 bits, la anchura del registro operando es de 64 bits (32 bits con un prefijo 67H). Modo exterior de 64 bits cuando CS.D = 1, el ancho es de 32 bits (16 bits con un prefijo 67H). Fuera del modo 64-bit cuando CS.D=0, el ancho es de 16 bits (32 bits con un prefijo 67H).

Este estado también se devuelve si la dirección de destino no era un registro de encuue (incluido el caso de una dirección de memoria); en estos casos, la tienda se deja caer y se escribe ni a MMIO ni a la memoria.

La instrucción ENQCMDS puede ejecutarse sólo si CPL= 0. La disponibilidad de la instrucción ENQCMDS está indicada por la presencia de la bandera CPUID ENQCMD (CPUID.07H.00H:ECX[29]).

## Operación

```text
DEST := SRC;
```

## Intel C/C++ compilador intrínseco

```c
ENQCMDS int_enqcmds(void *dst, const void *src);
```

## Banderas afectadas

La bandera ZF se establece si la terminación de la tienda de encuue devuelve el estado de la reingresación; de lo contrario se pone a cero. Todas las otras banderas están limpias.

## SIMD coma flotante Excepciones

None.
