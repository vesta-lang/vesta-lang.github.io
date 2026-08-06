---
summary: Lea el contador de tiempo y el ID del procesador
---

## Descripción

Lee el valor actual del contador de tiempo del procesador (un MSR de 64 bits) en los registros EDX:EAX y también lee el valor del IA32 TSC AUX MSR (dirección C0000103H) en el registro ECX. ElEDXregistro se carga con los 32 bits de alto orden del IA32 TSCMSR; elEAXregistro se carga con los 32 bits de bajo orden del IA32 TSCMSR; yECXregistro se carga con los 32 bits de bajo orden de IA32 TSC AUXMSR. En procesadores que soportan la arquitectura Intel 64, los 32 bits de alto orden de cada uno de RAX, RDX y RCX se limpian.

El procesador aumenta monotonicamente el contador MSR cada ciclo del reloj y lo restablece a 0 cuando el procesador se reinicia. Ver "Time-Stamp Counter" en el capítulo 20 del Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 3B, para detalles específicos del comportamiento de contador de sellos de tiempo.

La bandera desactivada (TSD) en el registro CR4 restringe el uso de la instrucción RDTSCP como sigue. Cuando la bandera es clara, la instrucción RDTSCP se puede ejecutar a cualquier nivel de privilegio; cuando se establece la bandera, la instrucción sólo se puede ejecutar a nivel de privilegios 0.

La instrucción RDTSCP no es una instrucción serializadora, pero espera hasta que todas las instrucciones anteriores hayan sido ejecutadas y todas las cargas anteriores sean visibles globalmente.1 Pero no espera que las tiendas anteriores sean visibles globalmente, y las instrucciones posteriores pueden comenzar la ejecución antes de que se realice la operación de lectura. Los siguientes elementos pueden guiar el software que busca ordenar ejecuciones de RDTSCP:

* Si el software requiere que RDTSCP sea ejecutado sólo después de que todas las tiendas anteriores sean mundialmente visibles, puede ejecutar

MFENCE inmediatamente antes de RDTSCP.

* Si el software requiere que RDTSCP sea ejecutado antes de la ejecución de cualquier instrucción posterior (incluyendo cualquier

accesos de memoria), puede ejecutar LFENCE inmediatamente después de RDTSCP.

Ver "Cambios para el comportamiento de la instrucción en VMX Operación no-rota" en el capítulo 27 de Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 3C, para obtener más información sobre el comportamiento de esta instrucción en VMX operación no-raíz.

## Operación

```text
IF (CR4.TSD = 0) or (CPL = 0) or (CR0.PE = 0)
    THEN
          EDX:EAX := TimeStampCounter;
          ECX := IA32_TSC_AUX[31:0];
    ELSE (* CR4.TSD = 1 and (CPL = 1, 2, or 3) and CR0.PE = 1 *)
          #GP(0);

FI;
```

## Banderas afectadas

None.

1. Una carga se considera visible a nivel mundial cuando se determina el valor a cargar.
