---
summary: Enqueue Command
---

## Descripción

La instrucción ENQCMD permite que el software escriba comandos para encuue registers, que son registros especiales de dispositivos a los que se accede utilizando I/O (MMIO).

Los registros esperan que los escritos tengan el siguiente formato:

511 32 31 30 20 19 0 DEVICE SPECIFIC COMMAND

```text
                                                                        PRIV RESERVED     PASID
```

Figura 3-11. Datos de 64-Byte Escrito para Encuue Registers

Bits 19:0 transmiten el identificador de espacio de dirección de proceso (PASID), un valor que el software del sistema puede asignar a los hilos de software individuales. El bit 31 contiene identificación de privilegios (0 = usuario; 1 = supervisor). Los dispositivos que implementan registros de encuue pueden utilizar estos dos valores junto con un comando específico de dispositivo en los 60 bytes superiores.

La instrucción ENQCMD comienza leyendo 64 bytes de datos de comando de su fuente operando de memoria. Esta es una carga ordinaria con caqueabilidad y pedidos de memoria implicados normalmente por el tipo de memoria. El operando de origen no necesita ser alineado, y no hay garantía de que todos los 64 bytes están cargados atómico. Bits 31:0 del operando de origen debe ser cero.

La instrucción entonces formatea esos 64 bytes en datos de comandos con un formato consistente con el que se da en la Figura 3-11:

* Mando[19:0] obtener IA32 PASID[19:0].1 * El mando [30:20] es cero. * Command[31] es 0 (indicando al usuario; este valor se utiliza independientemente de CPL). * Comando[511:32] conseguir bits 511:32 del operando de origen que fue leído de memoria.

La instrucción ENQCMD utiliza una tienda de encuue (definida a continuación) para escribir estos datos de comandos al operando de destino. La dirección del operando de destino se especifica en un registro de proposito general como compensación en el segmento ES (el segmento no puede ser superado).2 La dirección lineal de destino debe ser alineada de 64 bytes. El funcionamiento de una tienda enqueue ignora el tipo de memoria de la dirección de memoria de destino.

1. Se espera que el software del sistema cargue el IA32 PASID MSR para que los bits 19:0 contengan el PASID del hilo de software actual. El bit válido de MSR, IA32 PASID[31], debe ser 1. Para más detalles sobre el IA32 PASID MSR, consulte el Manual de Desarrolladores de Software de Arquitecturas Intel(R) 64 e IA-32, Volumen 4.

2. En modo de 64 bits, la anchura del registro operando es de 64 bits (32 bits con un prefijo 67H). Modo exterior de 64 bits cuando CS.D = 1, el ancho es de 32 bits (16 bits con un prefijo 67H). Fuera del modo 64-bit cuando CS.D=0, el ancho es de 16 bits (32 bits con un prefijo 67H).

Una tienda de encuues no se ordena en relación con tiendas mayores a la memoria WB o WC (incluyendo tiendas no temporales) o a las ejecuciones de la CLFLUSHOPT o CLWB (cuando se aplica a direcciones distintas a la de la tienda de encuue). El software puede hacer cumplir tal orden ejecutando una instrucción de esgrima como SFENCE o MFENCE antes de la tienda de encuue.

Una tienda de encuues no escribe los datos en la jerarquía de caché, ni recoge ningún dato en la jerarquía de caché. Los datos de comando de una tienda de encuue nunca se combinan con el de cualquier otra tienda a la misma dirección.

A diferencia de otras tiendas, una tienda enqueue devuelve un estado, que la instrucción ENQCMD carga en la bandera ZF en el registro RFLAGS:

* ZF = 0 (success) informa que los datos de comandos de 64 bytes fueron escritos de forma atómica a un registro de entrada del dispositivo

y ha sido aceptado por el dispositivo. (No garantiza que el dispositivo haya actuado en el comando; puede que lo haya solicitado para la ejecución posterior.)

* ZF = 1 (retry) informa que los datos de comando no fueron aceptados. Este estado es devuelto si el destino

dirección es un registro de la entrada, pero el comando no fue aceptado debido a la capacidad u otras razones temporales. Este estado también se devuelve si la dirección de destino no era un registro de encuue (incluido el caso de una dirección de memoria); en estos casos, la tienda se deja caer y se escribe ni a MMIO ni a la memoria.

La disponibilidad de la instrucción ENQCMD está indicada por la presencia de la bandera CPUID ENQCMD (CPUID.07H.00H:ECX[29]).

## Operación

```text
IF IA32_PASID[31] = 0
    THEN #GP;

ELSE
    COMMAND := (SRC & ~FFFFFFFFH) | (IA32_PASID & FFFFFH);
    DEST := COMMAND;

FI;
```

## Intel C/C++ compilador intrínseco

```c
ENQCMD int_enqcmd(void *dst, const void *src);
```

## Banderas afectadas

La bandera ZF se establece si la terminación de la tienda de encuue devuelve el estado de la reingresación; de lo contrario se pone a cero. Todas las otras banderas están limpias.

## SIMD coma flotante Excepciones

None.
