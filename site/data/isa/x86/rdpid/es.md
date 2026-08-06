---
summary: Read Processor ID
---

## Descripción

Lea el valor del IA32 TSC AUX MSR (dirección C0000103H) en el registro de destino. El valor de los prefijos CS.D y operando-size (66H y REX.W) no afectan el comportamiento de la instrucción RDPID.

## Operación

```text
DEST := IA32_TSC_AUX
```

## Banderas afectadas

None.
