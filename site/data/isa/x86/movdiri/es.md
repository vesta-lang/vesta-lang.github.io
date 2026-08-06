---
summary: Mover la palabra doble como tienda directa
---

## Descripción

Mueva el entero de doble palabra en el operando de origen (segundo operando) al operando de destino (primer operando) utilizando una operación de tienda directa. El operando de origen es un registro de proposito general. El operando de destino es una ubicación de memoria de 32 bits. En modo de 64 bits, el tamaño de operación predeterminado de la instrucción es de 32 bits. El uso del prefijo REX.R permite el acceso a registros adicionales (R8-R15). El uso del prefijo REX.W promueve la operación a 64 bits. Vea tabla resumen al comienzo de esta sección para la codificación de datos y límites.

La tienda directa se implementa utilizando el protocolo de tipo de memoria de escritura (WC) para escribir datos. Utilizando este protocolo, el procesador no escribe los datos en la jerarquía de caché, ni recoge la línea correspondiente de caché de la memoria en la jerarquía de caché. Si la dirección de destino está en caché, la línea se escribe de nuevo (si se modifica) y se invalida del caché, antes de la tienda directa. A diferencia de las tiendas con indicios no temporales que permiten descamados (UC) y protegidos por escrito (WP) tipo de memoria para el destino para anular el indicio no temporal, las tiendas directas siempre siguen el protocolo de memoria tipo WC independientemente del tipo de memoria de la dirección de destino (incluyendo los tipos UC y WP).

A diferencia de las tiendas de WC y las tiendas con indicios no temporales, las tiendas directas son elegibles para el desalojo inmediato del búfer de combinación de escritura, y por lo tanto no combinado con tiendas más jóvenes (incluyendo tiendas directas) a la misma dirección. El WC más antiguo y las tiendas no temporales que se celebran en el búfer de escritura se pueden combinar con tiendas directas más jóvenes a la misma dirección. Las tiendas directas se ordenan débilmente en relación con otras tiendas. El software que desee ordenar más fuerte debe utilizar una instrucción de esgrima (MFENCE o SFENCE) antes o después de una tienda directa para hacer cumplir el pedido deseado.

Las tiendas directas emitidas por MOVDIRI a un destino alineado a un límite de 4 bytes (8-byte límite si se utiliza con REX.W prefijo) garantizan la atomicidad de 4 bytes (8-byte con REX.W prefijo). Esto significa que los datos llegan al destino en una única transacción de escritura de 4 bytes (o 8 bytes). Si el destino no está alineado para el tamaño de la escritura, las tiendas directas emitidas por MOVDIRI se dividen y llegan al destino en dos partes. Cada parte de esta tienda directa dividida no se fusionará con tiendas más jóvenes, pero puede llegar al destino en cualquier orden. La disponibilidad de la instrucción MOVDIRI está indicada por la presencia de la bandera CPUID MOVDIRI (bit 27 del registro ECX en hoja 07H, véase "CPUID--CPU Identificación" en el Manual Intel(R) 64 e IA-32 Architectures Software Developer, Volume 2A).

## Operación

```text
DEST := SRC;
```

## Intel C/C++ compilador intrínseco

```c
MOVDIRI void _directstoreu_u32(void *dst, uint32_t val) MOVDIRI void _directstoreu_u64(void *dst, uint64_t val);
```
