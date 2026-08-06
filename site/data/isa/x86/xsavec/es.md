---
summary: Guardar Estados Procesadores Extendidos Con Compactación
---

## Descripción

Realiza un ahorro total o parcial de componentes estatales procesadores en la zona XSAVE ubicada en la dirección de memoria especificada por el operando de destino. El par de registro implícito EDX:EAX especifica una máscara de instrucciones de 64 bits. Los componentes específicos del estado guardados corresponden a los bits fijados en el bitmap (RFBM), que es el lógico-AND de EDX:EAX y XCR0.

El formato del área XSAVE se detalla en la Sección 13.4, "XSAVE Area", de Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1. Como FXRSTOR y FXSAVE, el formato de memoria utilizado para el estado x87 depende de un prefijo REX.W; ver Sección 13.5.1, "x87 Estado" de Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1.

Sección 13.10, "Operación de XSAVEC", de Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1 proporciona una descripción detallada del funcionamiento de la instrucción XSAVEC. Los siguientes temas proporcionan un esbozo de alto nivel:

* La ejecución de XSAVEC es similar a la de XSAVE. XSAVEC difiere de XSAVE en que utiliza la compactación y que

puede utilizar la optimización de entrada.

* XSAVEC ahorra componente de estado i si y sólo si RFBM[i] = 1 y XINUSE[i] = 1.1 (XINUSE es un bitmap por el cual

el procesador rastrea el estado de varios componentes del estado. Véase la sección 13.6, "Processor Tracking of XSAVE- Managed State" de Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1.)

* XSAVEC no modifica bytes 511:464 de la región heredada del área de XSAVE (ver Sección 13.4.1, "Región Legada de un área XSAVE" de Intel(R) 64 e IA-32 Arquitecturas Software Manual del desarrollador, Volumen 1).

* XSAVECescribe la lógicaANDdeRFBMyXINUSEal campo XSTATE BV delXSAVEheader.2,3 (See Section 13.4.2, "XSAVEHeader" de Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1.)XSAVECestablece el bit 63 del campo XCOMP BV y establece bits 62:0 de ese campo aRFBM[62:0]. XSAVEC no escribe a ninguna parte del encabezado XSAVE aparte de los campos XSTATE BV y XCOMP BV.

* XSAVEC siempre utiliza el formato compacto de la región extendida de la zona XSAVE (ver Sección 13.4.3, "Región avanzada de un área XSAVE" de Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1).

El uso de un operando de destino no alineado a los límites de 64 bytes (en modos de 64 bits o de 32 bits) resulta en una excepción de protección general (#GP). En modo de 64 bits, se ignoran los 32 bits superiores de RDX y RAX.

1. Hay una excepción para el componente 1 del estado (SSE). MXCSR es parte del estado SSE, pero XINUSE[1] puede ser 0 incluso si MXCSR no tiene su valor inicial de 1F80H. En este caso, XSAVEC ahorra estado SSE mientras RFBM[1] = 1.

2. A diferencia de XSAVE y XSAVEOPT, XSAVEC limpia bits en el campo XSTATE BV que corresponden a bits que están claros en RFBM.

3. Hay una excepción para el componente 1 del estado (SSE). MXCSR es parte del estado SSE, pero XINUSE[1] puede ser 0 incluso si MXCSR no tiene su valor inicial de 1F80H. En este caso, XSAVEC establece XSTATE BV[1] a 1 tanto como RFBM[1] = 1.

## Operación

```text
/* bitwise logical AND */
                                 /* bitwise logical AND */
RFBM := XCR0 AND EDX:EAX;
TO_BE_SAVED := RFBM AND XINUSE;
If MXCSR  1F80H AND RFBM[1]

    TO_BE_SAVED[1] = 1;
FI;

IF TO_BE_SAVED[0] = 1
    THEN store x87 state into legacy region of XSAVE area;

FI;

IF TO_BE_SAVED[1] = 1
    THEN store SSE state into legacy region of XSAVE area; // this step saves the XMM registers, MXCSR, and MXCSR_MASK

FI;

NEXT_FEATURE_OFFSET = 576;       // Legacy area and XSAVE header consume 576 bytes

FOR i := 2 TO 62

IF RFBM[i] = 1

     THEN

         IF TO_BE_SAVED[i]

                  THEN save XSAVE state component i at offset NEXT_FEATURE_OFFSET from base of XSAVE area;

         FI;

NEXT_FEATURE_OFFSET = NEXT_FEATURE_OFFSET + n (n enumerated by CPUID.0DH.i:EAX);

FI;

ENDFOR;

XSTATE_BV field in XSAVE header := TO_BE_SAVED;
XCOMP_BV field in XSAVE header := RFBM OR 80000000_00000000H;
```

## Banderas afectadas

None.

## Intel C/C++ compilador intrínseco

```c
XSAVEC void _xsavec( void * , unsigned __int64);
XSAVEC64 void _xsavec64( void * , unsigned __int64);
```
