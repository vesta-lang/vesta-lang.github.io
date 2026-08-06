---
summary: Lea del registro específico modelo
---

## Descripción

Lea el contenido de un registro específico modelo de 64 bits (MSR) especificado en el registro ECX en los registros EDX:EAX. (En los procesadores que soportan la arquitectura Intel 64, se ignoran los 32 bits de alto orden de RCX).El registro EDX se carga con los 32 bits de alto orden del MSR y el registro EAX se carga con los 32 bits de bajo orden. (En los procesadores que soportan la arquitectura Intel 64, los 32 bits de alto orden de cada uno de RAX y RDX son despejados.) Si se implementan menos de 64 bits en el MSR que se lee, los valores devueltos a EDX:EAX en sitios de bits unimplementados quedan indefinidas.

Esta instrucción debe ejecutarse a nivel de privilegios 0 o en modo de direccion real; de lo contrario, se generará una excepción de protección general #GP(0). Especificar una dirección MSR reservada o no ampliada en ECX también causará una excepción de protección general.

Las funciones de control de MSR para testabilidad, localización de ejecución, supervisión de rendimiento y errores de comprobación de máquina. Capítulo 2, "Model-Specific Registers (MSRs)" de Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 4, enumera todos los MSR que se pueden leer con esta instrucción y sus direcciones. Tenga en cuenta que cada familia procesador tiene su propio conjunto de MSRs.

La instrucción CPUID debe utilizarse para determinar si se admiten MSR (CPUID.01H:EDX[5] = 1) antes de usar esta instrucción.

## Compatibilidad de arquitectura IA-32

Los MSR y la capacidad de leerlos con la instrucción RDMSR fueron introducidos en la arquitectura IA-32 con el procesador Pentium. La ejecución de esta instrucción por un procesador IA-32 antes que el procesador Pentium resulta en una excepción de código de operación no válido #UD. Ver "Cambios para el comportamiento de la instrucción en VMX Operación no-rota" en el capítulo 27 de Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 3C, para obtener más información sobre el comportamiento de esta instrucción en VMX operación no-raíz.

## Operación

```text
EDX:EAX := MSR[ECX];
```

## Banderas afectadas

None.
