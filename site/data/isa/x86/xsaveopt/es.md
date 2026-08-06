---
summary: Save Processor Extended States Optimized
---

## Descripción

Realiza un ahorro total o parcial de componentes estatales procesadores en la zona XSAVE ubicada en la dirección de memoria especificada por el operando de destino. El par de registro implícito EDX:EAX especifica una máscara de instrucciones de 64 bits. Los componentes específicos del estado guardados corresponden a los bits fijados en el bitmap (RFBM), que es el lógico-AND de EDX:EAX y XCR0.

El formato del área XSAVE se detalla en la Sección 13.4, "XSAVE Area", de Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1. Como FXRSTOR y FXSAVE, el formato de memoria utilizado para el estado x87 depende de un prefijo REX.W; ver Sección 13.5.1, "x87 Estado" de Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1.

Sección 13.9, "Operación de XSAVEOPT", de Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1 proporciona una descripción detallada del funcionamiento de la instrucción XSAVEOPT. Los siguientes temas proporcionan un esbozo de alto nivel:

* La ejecución de XSAVEOPT es similar a la de XSAVE. XSAVEOPT difiere de XSAVE en que puede utilizar el init y

optimizaciones modificadas. El rendimiento de XSAVEOPT será igual o mejor que el de XSAVE.

* XSAVEOPT ahorra componente de estado i sólo si RFBM[i] = 1 y XINUSE[i] = 1.1 (XINUSE es un mapa de bits por el cual

procesador rastrea el estado de varios componentes del estado. Véase Sección 13.6, "Processor Tracking ofXSAVE- Estado gestionado", de Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1.) Incluso si ambas partes son 1,XSAVEOPTpuede optimizar y no guardar el componente de estado i si (1) componente de estado no se ha modificado desde la última ejecución deXRSTORoXRSTORS; y 2) esta ejecución deXSAVEScorresponde a la última ejecución deXRSTORoXRSTORSpor el valor interno XRSTOR INFO (véase la sección de la Operación infra).

* XSAVEOPT no modifica bytes 511:464 de la región heredada del área de XSAVE (ver Sección 13.4.1, "Región Legada de un área XSAVE" de Intel(R) 64 e IA-32 Arquitecturas Software Manual del desarrollador, Volumen 1).

* XSAVEOPT lee el campo XSTATE BV del encabezado XSAVE (ver Sección 13.4.2, "XSAVE Header", del Intel(R)

64 e IA-32 Architectures Software Developer's Manual, Volumen 1) y escribe un valor modificado de nuevo a la memoria como sigue. Si RFBM[i] = 1, XSAVEOPT escribe XSTATE BV[i] con el valor de XINUSE[i]. Si RFBM[i] = 0, XSAVEOPT escribe XSTATE BV[i] con el valor que lee de la memoria (no modifica el bit). XSAVEOPT no escribe a ninguna parte del encabezado XSAVE aparte del campo XSTATE BV.

* XSAVEOPT siempre utiliza el formato estándar de la región extendida de la zona XSAVE (ver Sección 13.4.3, "Región avanzada de un área XSAVE" de Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1).

El uso de un operando de destino no alineado a los límites de 64 bytes (en modos de 64 bits o de 32 bits) resultará en una excepción de protección general (#GP). En modo de 64 bits, se ignoran los 32 bits superiores de RDX y RAX.

1. Hay una excepción hecha para MXCSR y MXCSR MASK, que pertenecen al componente estatal 1 - SSE. XSAVEOPT siempre guarda estos a la memoria si RFBM[1] = 1 o RFBM[2] = 1, independientemente del valor de XINUSE.

Véase Sección 13.6, "Processor Tracking ofXSAVE-Managed State", de Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1 para la discusión del bitmapXMODIFIEDy de la cantidad XRSTOR INFO.

## Operación

```text
RFBM := XCR0 AND EDX:EAX; /* bitwise logical AND */
OLD_BV := XSTATE_BV field from XSAVE header;
TO_BE_SAVED := RFBM AND XINUSE;

IF in VMX non-root operation
    THEN VMXNR := 1;
    ELSE VMXNR := 0;

FI;
LAXA := linear address of XSAVE area;

IF XRSTOR_INFO = CPL,VMXNR,LAXA,00000000_00000000H

    THEN TO_BE_SAVED := TO_BE_SAVED AND XMODIFIED;
FI;

IF TO_BE_SAVED[0] = 1
    THEN store x87 state into legacy region of XSAVE area;

FI;

IF TO_BE_SAVED[1]
    THEN store XMM registers into legacy region of XSAVE area; // this step does not save MXCSR or MXCSR_MASK

FI;

IF RFBM[1] = 1 or RFBM[2] = 1
    THEN store MXCSR and MXCSR_MASK into legacy region of XSAVE area;

FI;

FOR i := 2 TO 62
    IF TO_BE_SAVED[i] = 1

THEN save XSAVE state component i at offset n from base of XSAVE area (n enumerated by CPUID.0DH.i:EBX);
    FI;

ENDFOR;

XSTATE_BV field in XSAVE header := (OLD_BV AND NOT RFBM) OR (XINUSE AND RFBM);
```

## Banderas afectadas

None.

## Intel C/C++ compilador intrínseco

```c
XSAVEOPT void _xsaveopt( void * , unsigned __int64);
XSAVEOPT void _xsaveopt64( void * , unsigned __int64);
```
