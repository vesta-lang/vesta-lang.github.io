---
summary: Save Processor Extended States
---

## Descripción

Realiza un ahorro total o parcial de componentes estatales procesadores en la zona XSAVE ubicada en la dirección de memoria especificada por el operando de destino. El par de registro implícito EDX:EAX especifica una máscara de instrucciones de 64 bits. Los componentes específicos del estado guardados corresponden a los bits fijados en el bitmap (RFBM), que es el lógico-AND de EDX:EAX y XCR0.

El formato del área XSAVE se detalla en la Sección 13.4, "XSAVE Area", de Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1. Como FXRSTOR y FXSAVE, el formato de memoria utilizado para el estado x87 depende de un prefijo REX.W; ver Sección 13.5.1, "x87 Estado" de Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1.

Sección 13.7, "Operación de XSAVE", de Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1 proporciona una descripción detallada del funcionamiento de la instrucción XSAVE. Los siguientes temas proporcionan un esbozo de alto nivel:

* XSAVE ahorra componente de estado i si y sólo si RFBM[i] = 1.1 * XSAVE no modifica bytes 511:464 de la región heredada de la zona de XSAVE (ver Sección 13.4.1, "Legacy

Region of an XSAVE Area" de Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1).

* XSAVE lee el campo XSTATE BV del encabezado XSAVE (ver Sección 13.4.2, "XSAVE Header" de Intel(R) 64 y

IA-32 Architectures Software Developer's Manual, Volumen 1) y escribe un valor modificado de nuevo a la memoria como sigue. Si RFBM[i] = 1, XSAVE escribe XSTATE BV[i] con el valor de XINUSE[i]. (XINUSE es un bitmap por el cual el procesador rastrea el estado de varios componentes del estado. Véase Sección 13.6, "Processor Tracking of XSAVE- Managed State" de Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1.) Si RFBM[i] = 0, XSAVE escribe XSTATE BV[i] con el valor que leyó de memoria (no modifica el bit). XSAVE no escribe a ninguna parte del encabezado XSAVE aparte del campo XSTATE BV.

* XSAVE siempre utiliza el formato estándar de la región extendida de la zona XSAVE (ver Sección 13.4.3, "Región avanzada de un área XSAVE" de Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1).

El uso de un operando de destino no alineado a los límites de 64 bytes (en modos de 64 bits o de 32 bits) resulta en una excepción de protección general (#GP). En modo de 64 bits, se ignoran los 32 bits superiores de RDX y RAX.

1. Se hace una excepción para MXCSR y MXCSR MASK, que pertenecen al componente estatal 1 - SSE. XSAVE guarda estos valores a la memoria si RFBM[1] o RFBM[2] es 1.

## Operación

```text
RFBM := XCR0 AND EDX:EAX; /* bitwise logical AND */
OLD_BV := XSTATE_BV field from XSAVE header;

IF RFBM[0] = 1
    THEN store x87 state into legacy region of XSAVE area;

FI;

IF RFBM[1] = 1
    THEN store XMM registers into legacy region of XSAVE area; // this step does not save MXCSR or MXCSR_MASK

FI;

IF RFBM[1] = 1 OR RFBM[2] = 1
    THEN store MXCSR and MXCSR_MASK into legacy region of XSAVE area;

FI;

FOR i := 2 TO 62
    IF RFBM[i] = 1

THEN save XSAVE state component i at offset n from base of XSAVE area (n enumerated by CPUID.0DH.i:EBX);
    FI;

ENDFOR;

XSTATE_BV field in XSAVE header := (OLD_BV AND NOT RFBM) OR (XINUSE AND RFBM);
```

## Banderas afectadas

None.

## Intel C/C++ compilador intrínseco

```c
XSAVE void _xsave( void * , unsigned __int64);
XSAVE void _xsave64( void * , unsigned __int64);
```
