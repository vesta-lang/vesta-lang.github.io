---
summary: Identificador de procesos invalidados
---

## Descripción

Invalidates mappings in the translation lookaside buffers (TLBs) and paging-structure caches based on processcontext identifier (PCID). (Ver Sección 5.10, "Caching Translation Information", en el Manual del Desarrollador de Software de Arquitectura Intel 64 e IA-32, Volumen 3A.) La invalidación se basa en el tipo INVPCID especificado en el registro operando y el descriptor INVPCID especificado en el operando de memoria.

Fuera del modo 64-bit, el registro operando es siempre 32 bits, independientemente del valor de CS.D. En modo de 64 bits el registro operando tiene 64 bits.

Actualmente hay cuatro tipos INVPCID definidos:

* Inválido de dirección individual: Si el tipo INVPCID es 0, el procesador lógico invalida las asignaciones -excepto las traducciones globales- para la dirección lineal y PCID especificados en el descriptor INVPCID.1 En algunos casos, la instrucción puede invalidar traducciones o asignaciones globales para otras direcciones lineales (o otros PCIDs) también.

* Anulación de un solo contexto: Si el tipo INVPCID es 1, el procesador lógico invalida todas las asignaciones - excepto

traducción global - asociado con el PCID especificado en el descriptor INVPCID. En algunos casos, la instrucción puede invalidar traducciones o asignaciones globales para otros PCIDs también.

* La invalidación de todo contexto, incluidas las traducciones globales: Si el tipo INVPCID es 2, el procesador lógico invalida

todos los mapas, incluyendo traducciones globales, asociados con cualquier PCID.

* Inválido de todo contexto: Si el tipo INVPCID es 3, el procesador lógico invalida todas las asignaciones--excepto global

traducción - asociado con cualquier PCID. En algún caso, la instrucción también puede invalidar las traducciones globales.

El descriptor INVPCID consta de 128 bits y consta de un PCID y una dirección lineal como se muestra en la Figura 3-20. Para INVPCID tipo 0, el procesador utiliza los 64 bits completos de la dirección lineal incluso fuera del modo 64-bit; la dirección lineal no se utiliza para otros tipos INVPCID.

```text
                    127                                        64 63               12 11 0
```

```text
                                  Linear Address                      Reserved (must be zero) PCID
```

Figura 3-20. INVPCID Descriptor

1. Si las estructuras de paging mapean la dirección lineal usando una página más grande de 4 KBytes y hay múltiples entradas de TLB para esa página (ver Sección 5.10.2.3, "Detalles de uso TLB", en el Manual de Desarrolladores de Software de Arquitecturas Intel(R) 64 e IA-32, Volumen 3A), la instrucción invalida todos ellos.

Si CR4.PCIDE = 0, un procesador lógico no cache información para cualquier PCID que no sea 000H. En este caso,

las ejecuciones con los tipos de INVPCID 0 y 1 sólo se permiten si el PCID especificado en el descriptor INVPCID es 000H;

ejecuciones con INVPCID tipos 2 y 3 mapas invalidados sólo para PCID 000H. Tenga en cuenta que CR4.PCIDE debe ser 0 fuera del modo IA-32e (ver Sección 5.10.1, "Procesos-Context Identificadores (PCIDs)," del Intel(R) 64 e IA-32 Archi-

tectures Software Developer's Manual, Volumen 3A).

## Operación

```text
INVPCID_TYPE := value of register operand;      // must be in the range of 03

INVPCID_DESC := value of memory operand;

CASE INVPCID_TYPE OF

0:             // individual-address invalidation

       PCID := INVPCID_DESC[11:0];

       L_ADDR := INVPCID_DESC[127:64];

       Invalidate mappings for L_ADDR associated with PCID except global translations;

       BREAK;

1:             // single PCID invalidation

       PCID := INVPCID_DESC[11:0];

       Invalidate all mappings associated with PCID except global translations;

       BREAK;

2:             // all PCID invalidation including global translations

       Invalidate all mappings for all PCIDs, including global translations;

       BREAK;

3:             // all PCID invalidation retaining global translations

       Invalidate all mappings for all PCIDs except global translations;

       BREAK;

ESAC;
```

## Intel C/C++ compilador intrínseco

```c
INVPCID void _invpcid(unsigned __int32 type, void * descriptor);
```

## SIMD coma flotante Excepciones

None.
