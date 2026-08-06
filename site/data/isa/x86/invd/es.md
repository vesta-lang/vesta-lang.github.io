---
summary: Caches internos invalidados
---

## Descripción

Invalidados (flushes) los caches internos del procesador y emite un ciclo de bus de función especial que dirige caches externos para también flush sí mismos. Los datos mantenidos en caches internos no se escriben de nuevo a la memoria principal.

Después de ejecutar esta instrucción, el procesador no espera a que los caches externos completen su operación de lavado antes de proceder con la ejecución de la instrucción. Es responsabilidad del hardware responder a la señal de flujo de caché.

La instrucción INVD es una instrucción privilegiada. Cuando el procesador se ejecuta en modo protegido, el CPL de un programa o procedimiento debe ser 0 para ejecutar esta instrucción.

La instrucción INVD se puede utilizar cuando el caché se utiliza como memoria temporal y el contenido de caché debe ser invalidado en lugar de escribir de nuevo a la memoria. Cuando el caché se utiliza como memoria temporal, ningún dispositivo externo debe estar escribiendo activamente datos a la memoria principal.

Use esta instrucción con cuidado. Los datos almacenados internamente y no escritos de nuevo a la memoria principal se perderán. Tenga en cuenta que los datos de un dispositivo externo a la memoria principal (por ejemplo, a través de un PCIWrite) pueden almacenarse temporalmente en los caches; estos datos pueden perderse cuando se ejecuta una instrucción INVD. A menos que haya un requisito específico o beneficio para recortar caches sin escribir líneas de caché modificadas (por ejemplo, memoria temporal, pruebas o recuperación de fallas cuando la coherencia de caché con memoria principal no es una preocupación), el software debe utilizar la instrucción WBINVD.

En los procesadores que soportan la memoria reservada del procesador, la instrucción INVD no se puede ejecutar cuando se activan las protecciones de memoria reservadas del procesador. Véase la sección 39.5, "EPCand Management ofEPCPáginas", en Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 3D.

En los procesadores que soportan SEAM, la instrucción INVD no se puede ejecutar cuando la gama SEAM está protegida. Véase la sección 35.4, "Protección de memoria", en el Manual de Desarrolladores de Software de Arquitectura Intel(R) 64 e IA-32, Volumen 3.

Algunos procesadores evitan la ejecución de INVD después de BIOS la ejecución es completa. Reportan esto enumerando CPUID.07H.01H:EAX[30] como 1. En tales procesadores, INVD no se puede ejecutar si bit 0 de SR BIOS DONE (MSR dirección 151H) es 1.

La operación de esta instrucción es la misma en modos no-64-bit y modo 64-bit.

## Compatibilidad de arquitectura IA-32

La instrucción INVD es dependiente de la implementación; puede ser implementada de manera diferente en diferentes familias de procesadores Intel 64 o IA-32. Esta instrucción no es compatible con los procesadores IA-32 antes que el procesador Intel486.

## Operación

```text
Flush(InternalCaches);
SignalFlush(ExternalCaches);
Continue (* Continue execution *)
```

## Banderas afectadas

None.
