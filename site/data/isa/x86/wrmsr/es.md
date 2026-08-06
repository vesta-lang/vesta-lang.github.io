---
summary: Escriba al modelo de registro específico
---

## Descripción

Escribe el contenido de los registros EDX:EAX en el registro específico del modelo de 64 bits (MSR) especificado en el registro ECX. (En los procesadores que soportan la arquitectura Intel 64, se ignoran los 32 bits de alto orden de RCX).Los contenidos del registro EDX se copian a 32 bits de alto orden del MSR seleccionado y los contenidos del registro EAX se copian a 32 bits de bajo orden del MSR. (En los procesadores que soportan la arquitectura Intel 64, se ignoran los 32 bits de alto orden de cada uno de los RAX y RDX).Los bits indefinidos o reservados en un MSR deben establecerse en valores previamente leídos.

Esta instrucción debe ejecutarse a nivel de privilegios 0 o en modo de direccion real; de lo contrario, una excepción de protección general #GP(0) se genera. Especificar una dirección MSR reservada o no ampliada en ECX también causará una excepción de protección general. El procesador también generará una excepción de protección general si el software intenta escribir a bits en un MSR reservado.

Cuando la instrucción WRMSR se utiliza para escribir a un MTRR, los TLB son invalidados. Esto incluye entradas globales (ver Sección 5.10.2, "Translation Lookaside Buffers (TLBs)" del Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 3A).

Funciones de control de MSR para testabilidad, localización de ejecución, monitoreo de rendimiento y errores de control de máquina. Capítulo 2, "Model-Specific Registers (MSRs)," de Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 4, enumera todos los MSR que pueden ser escritos con esta instrucción y sus direcciones. Tenga en cuenta que cada familia procesador tiene su propio conjunto de MSRs. La instrucción WRMSR es una instrucción de serialización (ver "Instrucción de serialización" en el capítulo 9 de Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 3A). Tenga en cuenta que WRMSR al IA32 TSC DEADLINE MSR (MSR index 6E0H) y los MSR X2APIC (MSR indices 802H a 83FH) no están serializando.

La instrucción CPUID debe utilizarse para determinar si se admiten MSR (CPUID.01H:EDX[5] = 1) antes de usar esta instrucción.

## Compatibilidad de arquitectura IA-32

Los MSR y la capacidad de leerlos con la instrucción WRMSR fueron introducidos en la arquitectura IA-32 con el procesador Pentium. La ejecución de esta instrucción por un procesador IA-32 antes que el procesador Pentium resulta en una excepción de código de operación no válido #UD.

## Operación

```text
MSR[ECX] := EDX:EAX;
```

## Banderas afectadas

None.
