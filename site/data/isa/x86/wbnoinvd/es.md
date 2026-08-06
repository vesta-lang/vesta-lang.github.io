---
summary: Escriba atrás y no invalidar la caché
---

## Descripción

La instrucción WBNOINVD escribe todas las líneas de caché modificadas en el caché interno del procesador a la memoria principal, pero no invalida los caches internos.

Después de ejecutar esta instrucción, el procesador no espera que los caches externos completen su operación de escritura antes de proceder con ejecución de instrucciones. Es responsabilidad del hardware responder a la señal de devolución de caché. La cantidad de tiempo o ciclos para WBNOINVD para completar variará debido al tamaño y otros factores de diferentes jerarquías de caché. Como consecuencia, el uso de la instrucción WBNOINVD puede tener un impacto en el tiempo de respuesta del procesador lógico interrumpir/evento.

La instrucción WBNOINVD es una instrucción privilegiada. Cuando el procesador se ejecuta en modo protegido, el CPL de un programa o procedimiento debe ser 0 para ejecutar esta instrucción. Esta instrucción también es una instrucción serializadora (ver "Instrucciones de serialización" en el capítulo 9 de Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 3A).

La operación de esta instrucción es la misma en modos no-64-bit y modo 64-bit.

## Operación

```text
WriteBack(InternalCaches);
Continue; (* Continue execution *)
```

## Intel C/C++ compilador intrínseco

```c
WBNOINVD void _wbnoinvd(void);
```

## Banderas afectadas

None.
