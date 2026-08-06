---
summary: Guardar Procesador Supervisor de Estados Extendidos
---

## Descripción

Realiza un ahorro total o parcial de componentes estatales procesadores en la zona XSAVE ubicada en la dirección de memoria especificada por el operando de destino. El par de registro implícito EDX:EAX especifica una máscara de instrucciones de 64 bits. Los componentes específicos del estado guardados corresponden a los bits fijados en el bitmap (RFBM), el lógico- AND de EDX:EAX y el lógico-OR de XCR0 con el IA32 XSS MSR. XSAVES se puede ejecutar sólo si CPL = 0.

El formato del área XSAVE se detalla en la Sección 13.4, "XSAVE Area", del Manual de Desarrolladores de Software de Arquitectura Intel(R) 64 e IA-32, Volumen 1. Como FXRSTOR y FXSAVE, el formato de memoria utilizado para el estado x87 depende de un prefijo REX.W; ver Sección 13.5.1, "x87 Estado", del Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1.

Sección 13.11, "Operación de XSAVES", de Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1 proporciona una descripción detallada del funcionamiento de la instrucción XSAVES. Los siguientes temas proporcionan un esbozo de alto nivel:

* La ejecución de XSAVES es similar a la de XSAVEC. XSAVES difiere de XSAVEC en que puede ahorrar estado

componentes correspondientes a los bits establecidos en el IA32 XSS MSR y que puede utilizar la optimización modificada.

* XSAVES ahorra componente de estado i sólo si RFBM[i] = 1 y XINUSE[i] = 1.1 (XINUSE es un mapa de bits por el cual

procesador rastrea el estado de varios componentes del estado. Véase Sección 13.6, "Processor Tracking ofXSAVE- Estado gestionado", de Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1.) Incluso si ambas partes son 1,XSAVESpuede optimizar y no guardar el componente de estado i si (1) componente de estado no se ha modificado desde la última ejecución deXRSTORoXRSTORS; y 2) esta ejecución deXSAVEScorresponde a la última ejecución deXRSTORoXRSTORSpor XRSTOR INFO (véase la sección de la Operación infra).

* XSAVES no modifica bytes 511:464 de la región heredada del área de XSAVE (ver Sección 13.4.1, "Región Legada de un área XSAVE", del Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1).

* XSAVESescribe la lógicaANDdeRFBMyXINUSEal campo XSTATE BV delXSAVEheader.2 (ver Sección 13.4.2, "XSAVEHeader", del Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1.)XSAVESestablece el bit 63 del campo XCOMP BV y establece bits 62:0 de ese campo aRFBM[62:0]. XSAVES no escribe a ninguna parte del encabezado XSAVE aparte de los campos XSTATE BV y XCOMP BV.

* XSAVES siempre utiliza el formato compacto de la región extendida de la zona XSAVE (ver Sección 13.4.3, "Región avanzada de un área XSAVE", del Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1).

El uso de un operando de destino no alineado a los límites de 64 bytes (en modos de 64 bits o de 32 bits) resulta en una excepción de protección general (#GP). En modo de 64 bits, se ignoran los 32 bits superiores de RDX y RAX.

1. Hay una excepción para el componente 1 del estado (SSE). MXCSR es parte del estado SSE, pero XINUSE[1] puede ser 0 incluso si MXCSR no tiene su valor inicial de 1F80H. En este caso, la optimización de entrada no se aplica y XSAVEC salvará el estado SSE mientras RFBM[1] = 1 y la optimización modificada no se esté aplicando.

2. Hay una excepción para el componente 1 del estado (SSE). MXCSR es parte del estado SSE, pero XINUSE[1] puede ser 0 incluso si MXCSR no tiene su valor inicial de 1F80H. En este caso, XSAVES establece XSTATE BV[1] a 1 tanto como RFBM[1] = 1.

Véase Sección 13.6, "Processor Tracking ofXSAVE-Managed State", de Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1 para la discusión del bitmapXMODIFIEDy de la cantidad XRSTOR INFO.

## Operación

```text
RFBM := (XCR0 OR IA32_XSS) AND EDX:EAX;            /* bitwise logical OR and AND */

IF in VMX non-root operation

     THEN VMXNR := 1;

     ELSE VMXNR := 0;

FI;

LAXA := linear address of XSAVE area;

COMPMASK := RFBM OR 80000000_00000000H;

TO_BE_SAVED := RFBM AND XINUSE;

IF XRSTOR_INFO = CPL,VMXNR,LAXA,COMPMASK

     THEN TO_BE_SAVED := TO_BE_SAVED AND XMODIFIED;

FI;

IF MXCSR  1F80H AND RFBM[1]

     THEN TO_BE_SAVED[1] = 1;

FI;

IF TO_BE_SAVED[0] = 1
    THEN store x87 state into legacy region of XSAVE area;

FI;

IF TO_BE_SAVED[1] = 1
    THEN store SSE state into legacy region of XSAVE area; // this step saves the XMM registers, MXCSR, and MXCSR_MASK

FI;

NEXT_FEATURE_OFFSET = 576;             // Legacy area and XSAVE header consume 576 bytes

FOR i := 2 TO 62

     IF RFBM[i] = 1

          THEN

           IF TO_BE_SAVED[i]

                     THEN

                       save XSAVE state component i at offset NEXT_FEATURE_OFFSET from base of XSAVE area;

                       IF i = 8  // state component 8 is for PT state

                            THEN IA32_RTIT_CTL.TraceEn[bit 0] := 0;

                       FI;

           FI;

NEXT_FEATURE_OFFSET = NEXT_FEATURE_OFFSET + n (n enumerated by CPUID.0DH.i:EAX);

     FI;

ENDFOR;

NEW_HEADER := RFBM AND XINUSE;
IF MXCSR  1F80H AND RFBM[1]

    THEN NEW_HEADER[1] = 1;
FI;
XSTATE_BV field in XSAVE header := NEW_HEADER;
XCOMP_BV field in XSAVE header := COMPMASK;
```

## Banderas afectadas

None.

## Intel C/C++ compilador intrínseco

```c
XSAVES void _xsaves( void * , unsigned __int64);
XSAVES64 void _xsaves64( void * , unsigned __int64);
```
