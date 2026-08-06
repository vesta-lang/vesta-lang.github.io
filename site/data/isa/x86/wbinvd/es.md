---
summary: Escribe Atrás e Invalidate Cache
---

## Descripción

Escribe todas las líneas de caché modificadas en el caché interno del procesador a la memoria principal e invalida los caches internos. La instrucción entonces emite un ciclo de bus de función especial que dirige caches externos para también escribir datos modificados y otro ciclo de bus para indicar que los caches externos deben ser invalidados.

Después de ejecutar esta instrucción, el procesador no espera que los caches externos completen sus operaciones de repaso y repulsión antes de proceder con ejecución de instrucciones. Es la responsabilidad del hardware responder a las señales de caché de vuelta y flujo. La cantidad de tiempo o ciclos para WBINVD para completar variará debido al tamaño y otros factores de diferentes jerarquías de caché. Como consecuencia, el uso de la instrucción WBINVD puede tener un impacto en el tiempo de respuesta del procesador lógico interrumpir/evento. Información adicional del comportamiento de WBINVD en una jerarquía de caché con topología compartida jerárquica se puede encontrar en el capítulo 2 del Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 3A.

La instrucción WBINVD es una instrucción privilegiada. Cuando el procesador se ejecuta en modo protegido, el CPL de un programa o procedimiento debe ser 0 para ejecutar esta instrucción. Esta instrucción también es una instrucción serializadora (ver "Instrucciones de serialización" en el capítulo 9 de Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 3A).

En situaciones en que la coherencia de caché con memoria principal no es una preocupación, el software puede utilizar la instrucción INVD.

La operación de esta instrucción es la misma en modos no-64-bit y modo 64-bit.

## Compatibilidad de arquitectura IA-32

La instrucción WBINVD es dependiente de la implementación, y su función puede ser implementada de manera diferente en futuros procesadores Intel 64 e IA-32. La instrucción no se apoya en los procesadores IA-32 antes que el procesador Intel486.

## Operación

```text
WriteBack(InternalCaches);
Flush(InternalCaches);
SignalWriteBack(ExternalCaches);
SignalFlush(ExternalCaches);
Continue; (* Continue execution *)

void _wbinvd(void)Flags Affected

None.
```
