---
summary: Reanudación del modo de gestión del sistema
---

## Descripción

Devuelve el control del programa desde el modo de gestión del sistema (SMM) al programa de aplicación o procedimiento del sistema operativo que se interrumpió cuando el procesador recibió una interrupción SMM. El estado del procesador se restaura del vertedero creado al entrar en SMM. Si el procesador detecta información estatal inválida durante la restauración del estado, entra en el estado de cierre. La siguiente información inválida puede causar un cierre:

* Cualquier parte reservada de CR4 se establece a 1. * Cualquier combinación ilegal de bits en CR0, como (PG=1 y PE=0) o (NW=1 y CD=0). * (Intel Pentium e Intel486TM procesadores solamente.) El valor almacenado en el campo base de dumping del estado no es un 32-KByte

Dirección alineada.

El contenido de los registros específicos del modelo no se ve afectado por un retorno de SMM.

El mapa de estado SMM utilizado por RSM admite el contexto de proceso de resumición para modos no-64-bit y modo 64-bit.

Ver Capítulo 34, "Modo de gestión de sistemas", en el Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 3C, para obtener más información sobre SMM y el comportamiento de la instrucción RSM.

## Operación

```text
ReturnFromSMM;
IF (IA-32e mode supported) or (CPUID DisplayFamily_DisplayModel = 06H_0CH )

    THEN
          ProcessorState := Restore(SMMDump(IA-32e SMM STATE MAP));

    Else
          ProcessorState := Restore(SMMDump(Non-32-Bit-Mode SMM STATE MAP));

FI
```

## Banderas afectadas

All.
