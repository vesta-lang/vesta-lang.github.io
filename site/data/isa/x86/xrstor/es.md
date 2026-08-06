---
summary: Restaurar los Estados Extendidos
---

## Descripción

Realiza una restauración total o parcial de los componentes del estado procesador de la zona XSAVE ubicada en la dirección de memoria especificada por el operando de origen. El par de registro implícito EDX:EAX especifica una máscara de instrucciones de 64 bits. Los componentes de estado específicos restaurados corresponden a los bits establecidos en el bitmap de la alimentación solicitada (RFBM), que es el lógico-AND de EDX:EAX y XCR0.

El formato del área XSAVE se detalla en la Sección 13.4, "XSAVE Area", de Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1. Como FXRSTOR y FXSAVE, el formato de memoria utilizado para el estado x87 depende de un prefijo REX.W; ver Sección 13.5.1, "x87 Estado" de Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1.

Sección 13.8, "Operación de XRSTOR", de Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1 proporciona una descripción detallada del funcionamiento de la instrucción XRSTOR. Los siguientes temas proporcionan un esbozo de alto nivel:

* La ejecución de XRSTOR puede tomar una de dos formas: estándar y compactado. Bit 63 del campo XCOMP BV en el

El encabezado XSAVE determina qué forma se utiliza: valor 0 especifica la forma estándar, mientras que el valor 1 especifica la forma compactada.

* Si RFBM[i] = 0, XRSTOR no actualiza el componente de estado i.1 * Si RFBM[i] = 1 y bit i está claro en el campo XSTATE BV en el encabezado XSAVE, XRSTOR inicializa estado

component i.

* Si RFBM[i] = 1 y XSTATE BV[i] = 1, XRSTOR carga el componente del estado i del área XSAVE. * La forma estándar de XRSTOR trata MXCSR (que es parte del componente de estado 1 - SSE) diferente del

XMM se registra. Si se trata de cargar MXCSR con un valor ilegal, una excepción de protección general (#GP) ocurre.

* XRSTOR carga el valor interno XRSTOR INFO, que se puede utilizar para optimizar una ejecución posterior de

XSAVEOPT or XSAVES.

* Inmediatamente después de una ejecución de XRSTOR, el procesador rastrea como en uso (no en configuración inicial) cualquier

componente estatal i para el cual RFBM[i] = 1 y XSTATE BV[i] = 1; rastrea como modificado cualquier componente estatal i para el cual RFBM[i] = 0.

El uso de un operando de origen no alineado a los límites de 64 bits (para modos de 64 bits y 32 bits) resulta en una excepción de protección general (#GP). En modo de 64 bits, se ignoran los 32 bits superiores de RDX y RAX.

Véase Sección 13.6, "Processor Tracking ofXSAVE-Managed State", de Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1 para la discusión de los bitmapsXINUSEyXMODIFIEDy de la cantidad XRSTOR INFO.

1. Hay una excepción si RFBM[1] = 0 y RFBM[2] = 1. En este caso, la forma estándar de XRSTOR cargará MXCSR de memoria, aunque MXCSR es parte del componente estatal 1 - SSE. La forma compactada de XRSTOR no hace esta excepción.

## Operación

```text
RFBM := XCR0 AND EDX:EAX; /* bitwise logical AND */
COMPMASK := XCOMP_BV field from XSAVE header;
RSTORMASK := XSTATE_BV field from XSAVE header;

IF COMPMASK[63] = 0
    THEN
          /* Standard form of XRSTOR */
          TO_BE_RESTORED := RFBM AND RSTORMASK;
          TO_BE_INITIALIZED := RFBM AND NOT RSTORMASK;

          IF TO_BE_RESTORED[0] = 1
                THEN
                       XINUSE[0] := 1;
                       load x87 state from legacy region of XSAVE area;

          ELSIF TO_BE_INITIALIZED[0] = 1
                THEN
                       XINUSE[0] := 0;
                       initialize x87 state;

          FI;

          IF RFBM[1] = 1 OR RFBM[2] = 1
                THEN load MXCSR from legacy region of XSAVE area;

          FI;

          IF TO_BE_RESTORED[1] = 1
                THEN
                       XINUSE[1] := 1;
                       load XMM registers from legacy region of XSAVE area; // this step does not load MXCSR

          ELSIF TO_BE_INITIALIZED[1] = 1
                THEN
                       XINUSE[1] := 0;
                       set all XMM registers to 0; // this step does not initialize MXCSR

          FI;

          FOR i := 2 TO 62
                IF TO_BE_RESTORED[i] = 1
                       THEN
                             XINUSE[i] := 1;
                             load XSAVE state component i at offset n from base of XSAVE area;
                                   // n enumerated by CPUID.0DH.i:EBX)
                ELSIF TO_BE_INITIALIZED[i] = 1
                       THEN
                             XINUSE[i] := 0;
                             initialize XSAVE state component i;
                FI;

          ENDFOR;

    ELSE
          /* Compacted form of XRSTOR */
          IF CPUID.0DH.01H:EAX.XSAVEC[1] = 0
                THEN /* compacted form not supported */
                       #GP(0);
          FI;


     FORMAT = COMPMASK AND 7FFFFFFF_FFFFFFFFH;
     RESTORE_FEATURES = FORMAT AND RFBM;
     TO_BE_RESTORED := RESTORE_FEATURES AND RSTORMASK;
     FORCE_INIT := RFBM AND NOT FORMAT;
     TO_BE_INITIALIZED = (RFBM AND NOT RSTORMASK) OR FORCE_INIT;

     IF TO_BE_RESTORED[0] = 1
           THEN
                 XINUSE[0] := 1;
                 load x87 state from legacy region of XSAVE area;

     ELSIF TO_BE_INITIALIZED[0] = 1
           THEN
                 XINUSE[0] := 0;
                 initialize x87 state;

     FI;

     IF TO_BE_RESTORED[1] = 1
           THEN
                 XINUSE[1] := 1;
                 load SSE state from legacy region of XSAVE area; // this step loads the XMM registers and MXCSR

     ELSIF TO_BE_INITIALIZED[1] = 1
           THEN
                 set all XMM registers to 0;
                 XINUSE[1] := 0;
                 MXCSR := 1F80H;

     FI;

     NEXT_FEATURE_OFFSET = 576;            // Legacy area and XSAVE header consume 576 bytes

     FOR i := 2 TO 62

     IF FORMAT[i] = 1

              THEN

              IF TO_BE_RESTORED[i] = 1

                        THEN

                        XINUSE[i] := 1;

                        load XSAVE state component i at offset NEXT_FEATURE_OFFSET from base of XSAVE area;

              FI;

NEXT_FEATURE_OFFSET = NEXT_FEATURE_OFFSET + n (n enumerated by CPUID.0DH.i:EAX);

     FI;

     IF TO_BE_INITIALIZED[i] = 1

              THEN

              XINUSE[i] := 0;

              initialize XSAVE state component i;

     FI;

     ENDFOR;

FI;

XMODIFIED := NOT RFBM;

IF in VMX non-root operation
    THEN VMXNR := 1;
    ELSE VMXNR := 0;

FI;
LAXA := linear address of XSAVE area;


XRSTOR_INFO := CPL,VMXNR,LAXA,COMPMASK;
```

## Banderas afectadas

None.

## Intel C/C++ compilador intrínseco

```c
XRSTOR void _xrstor( void * , unsigned __int64);
XRSTOR void _xrstor64( void * , unsigned __int64);
```
