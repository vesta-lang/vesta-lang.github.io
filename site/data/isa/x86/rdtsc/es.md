---
summary: Lea Time-Stamp Counter
---

## Descripción

Lee el valor actual del contador de tiempo del procesador (un MSR de 64 bits) en los registros EDX:EAX. El registro EDX se carga con los 32 bits de alto orden del MSR y el registro EAX se carga con los 32 bits de bajo orden. (En los procesadores que apoyan la arquitectura Intel 64, se limpian los 32 bits de alto orden de cada uno de RAX y RDX).

El procesador aumenta monotonicamente el contador MSR cada ciclo del reloj y lo restablece a 0 cuando el procesador se reinicia. Ver "Time-Stamp Counter" en el capítulo 20 del Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 3B, para detalles específicos del comportamiento de contador de sellos de tiempo.

La bandera desactivada (TSD) en el registro CR4 restringe el uso de la instrucción RDTSC como sigue. Cuando la bandera es clara, la instrucción RDTSC se puede ejecutar a cualquier nivel de privilegio; cuando se establece la bandera, la instrucción sólo se puede ejecutar a nivel de privilegios 0.

El contador de tiempo también se puede leer con la instrucción RDMSR, al ejecutar a nivel de privilegios 0.

La instrucción RDTSC no es una instrucción serializante. No necesariamente espera hasta que todas las instrucciones anteriores hayan sido ejecutadas antes de leer el contador. Del mismo modo, las instrucciones posteriores pueden comenzar la ejecución antes de que se realice la operación de lectura. Los siguientes elementos pueden guiar el software que busca ordenar ejecuciones de RDTSC:

* Si el software requiere que RDTSC se ejecute sólo después de que todas las instrucciones anteriores hayan ejecutado y todas las cargas anteriores son visibles a nivel mundial,1 puede ejecutar LFENCE inmediatamente antes de RDTSC.

* Si el software requiere que RDTSC sea ejecutado sólo después de todas las instrucciones anteriores han ejecutado y todas las anteriores

cargas y tiendas son mundialmente visibles, puede ejecutar la secuencia MFENCE;LFENCE inmediatamente antes de RDTSC.

* Si el software requiere que RDTSC sea ejecutado antes de la ejecución de cualquier instrucción posterior (incluyendo cualquier

accesos de memoria), puede ejecutar la secuencia LFENCE inmediatamente después de RDTSC.

Esta instrucción fue introducida por el procesador Pentium.

Ver "Cambios para el comportamiento de la instrucción en VMX Operación no-rota" en el capítulo 27 de Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 3C, para obtener más información sobre el comportamiento de esta instrucción en VMX operación no-raíz.

## Operación

```text
IF (CR4.TSD = 0) or (CPL = 0) or (CR0.PE = 0)
    THEN EDX:EAX := TimeStampCounter;
    ELSE (* CR4.TSD = 1 and (CPL = 1, 2, or 3) and CR0.PE = 1 *)
          #GP(0);

FI;
```

## Banderas afectadas

None.

1. Una carga se considera visible a nivel mundial cuando se determina el valor a cargar.
