---
summary: Escriba datos a un paquete Trace del procesador
---

## Descripción

Esta instrucción lee los datos en el operando de origen y lo envía al hardware Intel Processor Trace para ser codificado en un paquete PTW si TriggerEn, ContextEn, FilterEn y PTWEn están listos para 1. Para más detalles sobre estos valores, consulte Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 3C, Sección 36.2.2, "Software Trace Instrumentation with PTWRITE." El tamaño de los datos es de 64 bits si se utiliza REX.W en modo de 64 bits, de lo contrario 32 bits de datos se copian desde el operando de origen.

Nota: La instrucción será #UD si se utiliza el prefijo 66H.

## Operación

```text
IF (IA32_RTIT_STATUS.TriggerEn & IA32_RTIT_STATUS.ContextEn & IA32_RTIT_STATUS.FilterEn & IA32_RTIT_CTL.PTWEn) = 1
    PTW.PayloadBytes := Encoded payload size;
    PTW.IP := IA32_RTIT_CTL.FUPonPTW
    IF IA32_RTIT_CTL.FUPonPTW = 1
          Insert FUP packet with IP of PTWRITE;
    FI;

FI;
```

## Banderas afectadas

None.
