---
summary: Palabra de estado de la máquina de carga
---

## Descripción

Carga el operando de origen en la palabra estado de la máquina, bits 0 a 15 de registro CR0. El operando de origen puede ser un registro de proposito general de 16 bits o una ubicación de memoria. Sólo los 4 bits del operando de origen (que contiene las banderas PE, MP, EM y TS) se cargan en CR0. Las banderas PG, CD, NW, AM, WP, NE y ET de CR0 no se ven afectadas. El atributo el operando-size no tiene efecto en esta instrucción.

Si la bandera PE del operando de origen (bit 0) se establece a 1, la instrucción hace que el procesador cambie a modo protegido. Mientras que en modo protegido, la instrucción LMSW no se puede utilizar para limpiar la bandera PE y forzar un cambio de nuevo a modo de direccion real.

La instrucción LMSW se proporciona para uso en el software del sistema operativo; no debe ser utilizado en los programas de aplicación. En protegidos o modo virtual-8086, sólo se puede ejecutar en CPL 0.

Esta instrucción se proporciona para la compatibilidad con el procesador Intel 286; los programas y procedimientos destinados a ejecutar en procesadores IA-32 e Intel 64 comenzando con procesadores Intel386 deben utilizar la instrucción MOV (registros de control) para cargar todo el registro CR0. La instrucción MOV CR0 se puede utilizar para establecer y limpiar la bandera PE en CR0, permitiendo un procedimiento o programa para cambiar entre modos protegidos y de dirección real.

Esta instrucción es una instrucción serializadora.

La operación de esta instrucción es la misma en modos no-64-bit y modo 64-bit. Tenga en cuenta que el tamaño de operando se fija en 16 bits.

Ver "Cambios para el comportamiento de la instrucción en VMX Operación no-rota" en el capítulo 27 de Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 3C, para obtener más información sobre el comportamiento de esta instrucción en VMX operación no-raíz.

## Operación

```text
CR0[0:3] := SRC[0:3];
```

## Banderas afectadas

None.
