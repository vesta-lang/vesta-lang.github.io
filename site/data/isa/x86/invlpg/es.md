---
summary: Invalidate TLB Entries
---

## Descripción

Invalida las entradas de taquillas laterales de traducción (TLB) especificadas con el operando de origen. El operando de origen es una dirección de memoria. El procesador determina la página que contiene esa dirección y elimina todas las entradas de TLB para esa página.1

La instrucción INVLPG es una instrucción privilegiada. Cuando el procesador se ejecuta en modo protegido, el CPL debe ser 0 para ejecutar esta instrucción.

La instrucción INVLPG normalmente hace fluir las entradas TLB sólo para la página especificada; sin embargo, en algunos casos, puede fluir más entradas, incluso toda la TLB. La instrucción invalida las entradas TLB asociadas con el PCID actual y puede o no hacerlo para las entradas TLB asociadas con otros PCIDs. (Si los PCID están deshabilitados -- CR4.PCIDE = 0 -- el PCID actual es 000H.) La instrucción también invalida cualquier entrada TLB global para la página especificada, independientemente de PCID.

For more details on operations that flush the TLB, see "MOV--Move to/from Control Registers" in the Intel(R) 64 and IA-32 Architectures Software Developer's Manual, Volume 2B, and Section 5.10.4.1, "Operations that Invalidate TLBs and Paging-Structure Caches," in the Intel(R) 64 and IA-32 Architectures Software Developer's Manual, Volume 3A.

La operación de esta instrucción es la misma en todos los modos no-64-bit. También opera lo mismo en modo 64-bit, excepto si la dirección de memoria está en forma no canónica. En este caso, INVLPG es el mismo que un NOP.

## Compatibilidad de arquitectura IA-32

La instrucción INVLPG es dependiente de la implementación, y su función puede ser implementada de manera diferente en diferentes familias de procesadores Intel 64 o IA-32. Esta instrucción no es compatible con los procesadores IA-32 antes que el procesador Intel486.

## Operación

```text
Invalidate(RelevantTLBEntries);
Continue; (* Continue execution *)
```

## Banderas afectadas

None.
