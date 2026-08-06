---
summary: Mover 64 Bytes como tienda directa
---

## Descripción

Mueva 64-bytes como tienda directa con 64-byte escribir atomicidad de la dirección de memoria fuente a la dirección de memoria de destino. El operando de origen es un operando de memoria normal. El operando de destino es una ubicación de memoria especificado en un registro de proposito general. The register content is interpreted as an offset into ES segment without any segment override. En modo de 64 bits, el ancho operando registrado es de 64 bits (32 bits con prefijo 67H). Fuera del modo 64-bit, el ancho de registro es de 32-bits cuando CS.D=1 (16-bits con prefijo 67H), y 16-bits cuando CS.D=0 (32-bits con prefijo 67H). MOVDIR64B requiere que la dirección de destino sea alineada de 64 bytes. No se aplica ninguna restricción de alineación para operando de origen.

MOVDIR64B primero lee 64-bytes de la dirección de memoria fuente. A continuación, realiza una operación de tienda directa de 64 bytes a la dirección de destino. La operación de carga sigue el orden de lectura normal basado en el tipo de memoria de la dirección fuente. La tienda directa se implementa utilizando el protocolo de tipo de memoria (WC) que combina (WC) para escribir datos. Utilizando este protocolo, el procesador no escribe los datos en la jerarquía de caché, ni recoge la línea correspondiente de caché de la memoria en la jerarquía de caché. Si la dirección de destino está en caché, la línea es devuelta (si se modifica) e invalidada de la caché, antes de la tienda directa.

A diferencia de las tiendas con indicios no temporales que permiten el tipo de memoria UC/WP para el destino anular el indicio no temporal, las tiendas directas siempre siguen el protocolo de tipo de memoria WC independientemente del tipo de memoria de la dirección de destino (incluidos los tipos UC/WP). A diferencia de las tiendas de WC y las tiendas con indicios no temporales, las tiendas directas son elegibles para el desalojo inmediato del búfer de combinación de escritura, y por lo tanto no combinado con tiendas más jóvenes (incluyendo tiendas directas) a la misma dirección. El WC más antiguo y las tiendas no temporales que se celebran en el búfer de escritura se pueden combinar con tiendas directas más jóvenes a la misma dirección. Las tiendas directas se ordenan débilmente en relación con otras tiendas. El software que desee ordenar más fuerte debe utilizar una instrucción de esgrima (MFENCE o SFENCE) antes o después de una tienda directa para hacer cumplir el pedido deseado.

No hay garantía de atomicidad prevista para la operación de carga de 64 bytes desde la dirección de origen, y las implementaciones de procesadores pueden utilizar múltiples operaciones de carga para leer los 64 bytes. La tienda directa de 64 bytes emitida por MOVDIR64B garantiza una atomicidad de 64 bytes de escritura completa. Esto significa que los datos llegan al destino en una única transacción por escrito de 64 bytes.

La disponibilidad de la instrucción MOVDIR64B está indicada por la presencia de la bandera CPUID MOVDIR64B (bit 28 del registro ECX en hoja 07H, véase "CPUID--CPU Identificación" en el Manual Intel(R) 64 e IA-32 Architectures Software Developer, Volume 2A).

## Operación

```text
DEST := SRC;
```

## Intel C/C++ compilador intrínseco

```c
MOVDIR64B void _movdir64b(void *dst, const void* src);
```
