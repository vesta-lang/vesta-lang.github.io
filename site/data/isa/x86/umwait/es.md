---
summary: Monitor de nivel de usuario
---

## Descripción

UMWAIT instruye al procesador para entrar en un estado optimizado dependiente de la implementación mientras monitorea una gama de direcciones. El estado optimizado puede ser un estado optimizado de potencia/rendimiento ligero o un estado optimizado de potencia/rendimiento mejorado. La selección entre los dos estados se rige por el bit de registro de entrada explícito[0] operando de origen.

UMWAIT está disponible cuando CPUID.07H.00H:ECX.WAITPKG[5] se enumera como 1. UMWAIT puede ser ejecutado a cualquier nivel de privilegio. La operación de esta instrucción es la misma en modos no-64-bit y en modo 64-bit.

El registro de entrada contiene información como el estado optimizado preferido que el procesador debe introducir como se describe en la tabla siguiente. Los bits más que el bit 0 están reservados y resultarán en #GP si no cero.

**UMWAIT Input Register Bit Definitions**

| Valor del bit | Nombre del Estado | Hora de despertar | Ahorros de energía | Otros beneficios |
| --- | --- | --- | --- | --- |
| bit[0] = 0 | C0.2 | Más lento | Más grande | Mejora el rendimiento de los otros hilos SMT en el mismo núcleo. |
| bit[0] = 1 | C0.1 | Más rápido. | Más pequeña | N/A |
| bits[31:1] | N/A | N/A | N/A | Reservado |

## Operación

```text
os_deadline := TSC+(IA32_UMWAIT_CONTROL[31:2]<<2)
instr_deadline := UINT64(EDX:EAX)

IF os_deadline < instr_deadline:
    deadline := os_deadline
    using_os_deadline := 1

ELSE:
    deadline := instr_deadline
    using_os_deadline := 0

WHILE monitor hardware armed AND TSC < deadline:
    implementation_dependent_optimized_state(Source register, deadline, IA32_UMWAIT_CONTROL[0] )

IF using_os_deadline AND TSC  deadline:
    RFLAGS.CF := 1

ELSE:
    RFLAGS.CF := 0

RFLAGS.AF,PF,SF,ZF,OF := 0
```

## Intel C/C++ compilador intrínseco

```c
UMWAIT uint8_t _umwait(uint32_t control, uint64_t counter);
```

## Excepciones numéricas

None.
