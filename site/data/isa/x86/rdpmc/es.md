---
summary: Lea las contadoras de control de rendimiento
---

## Descripción

Lea el contenido del contador de monitoreo de rendimiento (PMC) especificado en ECX inscrito en los registros EDX:EAX. (En los procesadores que soportan la arquitectura Intel 64, se ignoran los 32 bits de alto orden de RCX).El registro EDX se carga con los 32 bits de alto orden del PMC y el registro EAX se carga con los 32 bits de bajo orden. (En los procesadores que soportan la arquitectura Intel 64, los 32 bits de alto orden de cada uno de RAX y RDX están despejados.) Si se implementan menos de 64 bits en el PMC que se lee, bits unimplementados devueltos a EDX:EAX tendrá valor cero.

La anchura de las PMC en los procesadores que apoyan la vigilancia del rendimiento arquitectónico (CPUID.0AH:EAX[7:0] 0)

reportado por CPUID.0AH:EAX[23:16]. En los procesadores que no soportan la vigilancia del rendimiento arquitectónico (CPUID.0AH:EAX[7:0]=0), la anchura del rendimiento de uso general PMCs es de 40 bits, mientras que los anchos de PMCs de uso especial son específicos de implementación.

El uso de ECX para especificar un PMC depende de si el procesador es compatible con el monitoreo de rendimiento arquitectónico:

* Si el procesador no apoya la vigilancia del rendimiento arquitectónico (CPUID.0AH:EAX[7:0]=0), ECX[30:0]

especifica el índice del PMC para ser leído. La configuración ECX[31] selecciona el modo de lectura "fast" si es compatible. En este modo, RDPMC devuelve bits 31:0 del PMC en EAX mientras limpia EDX a cero.

* Si el procesador apoya la vigilancia del rendimiento arquitectónico (CPUID.0AH:EAX[7:0] 0), ECX[31:16]

especifica el tipo de PMC mientras que ECX[15:0] especifica el índice del PMC para ser leído dentro de ese tipo. Actualmente se definen los siguientes tipos PMC:

-- Los contadores de uso general utilizan el tipo 0. Para leer IA32 PMCx, uno de los siguientes debe mantener el índice x:

* Es menos que el valor enumerado por CPUID.0AH:EAX[15:8]; o * Es al menos 31 y el valor enumerado por CPUID.23H.01H:EAX[x] es 1.

-- Los contadores de funcionamiento fijo utilizan el tipo 4000H. Para leer IA32 FIXED CTRx, uno de los siguientes debe mantener el índice x:

* Es menos que el valor enumerado por CPUID.0AH:EDX[4:0]; * Es al menos 31 y el valor enumerado por CPUID.0AH:ECX[x] es 1; o * Es al menos 31 y el valor enumerado por CPUID.23H.01H:EBX[x] es 1.

-- Las métricas de rendimiento usan el tipo 2000H. Este tipo sólo se puede utilizar si IA32_PERF_CAPABILITIES.PERF_MET- RICS AVAILABLE[bit 15]=1. Para este tipo, el índice en ECX[15:0] es específico de la implementación.

Especificar una codificación PMC sin soporte causará una excepción de protección general #GP(0). Para los detalles de PMC ver Capítulo 21, "Últimas Documentos de Subdivisión", en el Manual de Desarrolladores de Software de Arquitecturas Intel(R) 64 e IA-32, Volumen 3B.

Cuando se encuentra en modo protegido o virtual 8086, la bandera Controlador de Desempeño (PCE) en el registro CR4 restringe el uso de la instrucción RDPMC. Cuando se establece la bandera PCE, la instrucción RDPMC se puede ejecutar a cualquier nivel de privilegio; cuando la bandera es clara, la instrucción sólo se puede ejecutar a nivel de privilegios 0. (Cuando en modo realaddress, la instrucción RDPMC siempre está habilitada.) Los PMC también se pueden leer con la instrucción RDMSR, al ejecutar a nivel de privilegios 0.

Los procesadores que soportan las métricas de rendimiento también pueden apoyar la limpieza en la lectura si se establece el IA32_PERF_CAPABILITIES.RDPMC_METRICS_CLEAR[bit 19]. Desde el IA32 PERF CAPABILITIES MSR

Enumere las características PMU no-arquitectural, el software debe comprobar DisplayFamily y DisplayModel para confirmar que el procesador admite la funcionalidad descrita en el siguiente párrafo.

Cuando se establece el IA32_FIXED_CTR_CTRL.METRICS_CLEAR_EN[bit 14], una instrucción RDPMC para PERF METRICS (es decir, cuando ECX=0x2000'0000) despeja los recursos relacionados con PERF METRICS, así como el control de funcionamiento fijo contador 3 después de la lectura se realiza. Cuando METRICS CLEAR EN está claro, la instrucción RDPMC sólo lee PERF METRICS.

La instrucción RDPMC no es una instrucción serializante; es decir, no implica que todos los eventos causados por las instrucciones anteriores hayan sido completados o que los eventos causados por las instrucciones posteriores no hayan comenzado. Si se desea un recuento exacto del evento, el software debe insertar una instrucción de serialización (como la instrucción CPUID) antes y/o después de la instrucción RDPMC.

Realizar lecturas rápidas de espalda a espalda no está garantizada a ser monotónica. Para garantizar la monotonicidad en las lecturas traseras, se debe colocar una instrucción serializante entre las dos instrucciones RDPMC.

La instrucción RDPMC puede ejecutarse en modo de dirección de 16 bits o modo virtual-8086; sin embargo, el contenido completo del registro ECX se utiliza para seleccionar el PMC, y el recuento de eventos se almacena en los registros completos EAX y EDX. La instrucción RDPMC se introdujo en la arquitectura IA-32 en el procesador Pentium Pro y el procesador Pentium con tecnología MMX. Los procesadores de Pentium anteriores tienen PMCs, pero deben leerse con la instrucción RDMSR.

## Operación

```text
MSCB = Most Significant Counter Bit (* Model-specific *)
IF (((CR4.PCE = 1) or (CPL = 0) or (CR0.PE = 0)) and (ECX indicates a supported counter))

    THEN
          EAX := counter[31:0];
          EDX := ZeroExtend(counter[MSCB:32]);

    ELSE (* ECX is not valid or CR4.PCE is 0 and CPL is 1, 2, or 3 and CR0.PE is 1 *)
          #GP(0);

FI;
```

## Banderas afectadas

None.
