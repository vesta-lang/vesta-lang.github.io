---
summary: Llamada de sistema rápido
---

## Descripción

SYSENTER invoca a un controlador de sistema operativo a nivel de privilegios 0. Su operación depende de si las transiciones FRED están habilitadas.

Operación Cuando las transiciones FRED no están habilitadas

Cuando las transiciones FRED no están habilitadas, SYSENTER es una instrucción compañera a SYSEXIT. SYSENTER está optimizado para proporcionar el máximo rendimiento de las llamadas del sistema desde el código de usuario que se ejecuta a nivel de privilegios 3 a sistema operativo o procedimientos ejecutivos que se ejecutan a nivel de privilegios 0.

Cuando se ejecuta en modo IA-32e, la instrucción SYSENTER transfiere el procesador lógico al modo 64-bit; de lo contrario, el procesador lógico permanece en modo protegido.

Antes de ejecutar la instrucción SYSENTER, el software debe especificar el nivel de privilegio 0 segmento de código y punto de entrada de código, y el nivel de privilegio 0 segmento de pila y puntero de pila escribiendo valores a los siguientes MSR:

* IA32 SYSENTER CS (MSR dirección 174H) -- Los 16 bits más bajos de este MSR son el selector de segmento para el

nivel de privilegio 0 segmento de código. Este valor también se utiliza para determinar el selector de segmento del segmento de nivel de privilegios 0 pila (véase la sección Operación). Este valor no puede indicar un selector nulo.

* IA32 SYSENTER EIP (MSR dirección 176H) -- El valor de este MSR se carga en RIP (es decir, este valor

hace referencia a la primera instrucción del procedimiento operativo seleccionado o rutina). En modo protegido, sólo se cargan los bits 31:0.

* IA32 SYSENTER ESP (MSR dirección 175H) -- El valor de este MSR se carga en RSP (es decir, este valor

contiene el puntero de pila para el nivel de privilegio 0 pila). Este valor no puede representar una dirección no canónica. En modo protegido, sólo se cargan los bits 31:0.

MSR escribe asegura que las MSR IA32 SYSENTER EIP e IA32 SYSENTER ESP siempre contienen direcciones canónicas.

Si bien SYSENTER carga los selectores de CS y SS con valores derivados del IA32 SYSENTER CS MSR, los caches descriptores CS y SS no se cargan de los descriptores (en GDT o LDT) referenciados por esos selectores. En cambio, los caches descriptor están cargados con valores fijos. Vea la sección Operación para más detalles. Es responsabilidad del software OS asegurar que los descriptores (en GDT o LDT) referenciados por esos valores selectores correspondan a los valores fijos cargados en los caches descriptores; la instrucción SYSENTER no garantiza esta correspondencia.

La instrucción SYSENTER no puede ser invocada desde modo de direccion real.

Las instrucciones SYSENTER y SYSEXIT son instrucciones de acompañamiento, pero no constituyen un par de llamada/retorno. Al ejecutar una instrucción SYSENTER, el procesador no guarda información de estado para el código de usuario (por ejemplo, el puntero de instruccion), y ni la instrucción SYSENTER ni el SYSEXIT soporta parámetros de paso en la pila.

Para utilizar las instrucciones SYSENTER y SYSEXIT como instrucciones de acompañamiento para las transiciones entre el nivel de privilegio 3 código y el nivel de privilegios 0 procedimientos del sistema operativo, se deben seguir las siguientes convenciones:

* Descriptores de segmento para el nivel de privilegio 0 código y segmentos de pila y para el nivel de privilegio 3 código y

Los segmentos de pila deben ser contiguos en una tabla descriptor. Esta convención permite al procesador calcular los selectores del segmento del valor introducido en el SYSENTER CS MSR MSR.

* Las rutinas de llamada rápida "stub" ejecutadas por el código de usuario (típicamente en bibliotecas compartidas o DLL) deben guardar las

Requiere información IP y estado del procesador si se requiere un retorno al procedimiento de llamada. Del mismo modo,

El sistema operativo o los procedimientos ejecutivos llamados con instrucciones SYSENTER deben tener acceso y utilizar esta información de retorno y estado guardados al regresar al código de usuario.

Las instrucciones SYSENTER y SYSEXIT fueron introducidas en la arquitectura IA-32 en el procesador Pentium II. La disponibilidad de estas instrucciones en un procesador se indica con el SYSENTER/SYSEXIT presente (SEP) bandera de características devuelto al registro EDX por la instrucción CPUID. Un sistema operativo que califique la bandera SEP también debe calificar a la familia procesadora y modelo para asegurar que las instrucciones SYSENTER/SYSEXIT estén realmente presentes. Por ejemplo:

```text
IF CPUID SEP bit is set
```

```text
   THEN IF (Family = 6) and (Model < 3) and (Stepping < 3)
```

```text
          THEN
```

SYSENTER/SYSEXIT_Not_Supported; FI;

```text
          ELSE
```

SYSENTER/SYSEXIT_Supported; FI;

FI;

Cuando la instrucción CPUID se ejecuta en el procesador Pentium Pro (modelo 1), el procesador devuelve una bandera SEP como se establece, pero no soporta las instrucciones SYSENTER/SYSEXIT.

Cuando las pilas de sombras están habilitadas a nivel de privilegios donde se invoca la instrucción SYSENTER, el SSP se salva al IA32 PL3 SSP MSR. Si las pilas de sombra están habilitadas a nivel de privilegio 0, el SSP está cargado con 0. Consulte el capítulo 6, "Procedure Calls, Interrupts, and Excepcionions", y el capítulo 18, "Control-flow Enforcement Technology (CET)," en el manual de desarrollo de software de arquitecturas Intel(R) 64 e IA-32, Volumen 1, para detalles adicionales de CET.

Cuando las transiciones FRED están habilitadas

Cuando las transiciones FRED están habilitadas, SYSENTER invoca el manejador del sistema operativo realizando la entrega de eventos FRED. Ver la sección 8.3, "FRED Event Delivery", en Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 3. El evento se entrega con el tipo de evento 7 y el vector 2. Con las transiciones de FRED, el controlador OS utiliza la instrucción ERETU para volver a llamar código operativo en CPL 3.

Ordenación de instrucciones. Las instrucciones posteriores a un SYSENTER pueden ser arrebatadas de memoria antes de la ejecución completa de instrucciones anteriores, pero no ejecutarán (incluso especulativamente) hasta que todas las instrucciones anteriores al SYSENTER hayan completado la ejecución (las instrucciones posteriores pueden ejecutarse antes de que los datos almacenados por las instrucciones anteriores se hayan vuelto mundialmente visibles).

## Operación

```text
IF CR0.PE = 0 OR (CR4.FRED = 0 AND IA32_SYSENTER_CS[15:2] = 0)

    THEN #GP(0); FI;

IF CR4.FRED = 0                                        (* Ensures protected mode execution *)
    THEN                                               (* Mask interrupts *)
          RFLAGS.VM := 0;
          RFLAGS.IF := 0;
          IF in IA-32e mode
                THEN
                      RSP := IA32_SYSENTER_ESP;
                      RIP := IA32_SYSENTER_EIP;
          ELSE
                      ESP := IA32_SYSENTER_ESP[31:0];
                      EIP := IA32_SYSENTER_EIP[31:0];
          FI;

CS.Selector := IA32_SYSENTER_CS[15:0] AND FFFCH;

                                       (* Operating system provides CS; RPL forced to 0 *)

(* Set rest of CS to a fixed value *)

CS.Base := 0;                                          (* Flat segment *)

CS.Limit := FFFFFH;                                    (* With 4-KByte granularity, implies a 4-GByte limit *)

CS.Type := 11;                                         (* Execute/read code, accessed *)


     CS.S := 1;                                  (* Entry is to 64-bit mode *)
     CS.DPL := 0;                                (* Required if CS.L = 1 *)
     CS.P := 1;
     IF in IA-32e mode                           (* 32-bit code segment*)
                                                 (* 4-KByte granularity *)
           THEN
                 CS.L := 1;
                 CS.D := 0;

           ELSE
                 CS.L := 0;
                 CS.D := 1;

     FI;
     CS.G := 1;

     IF ShadowStackEnabled(CPL)
           THEN
                 IF IA32_EFER.LMA = 0
                       THEN IA32_PL3_SSP := SSP;
                       ELSE (* adjust so bits 63:N get the value of bit N1, where N is the CPU's maximum linear-address width *)
                             IA32_PL3_SSP := LA_adjust(SSP);
                 FI;

     FI;

     CPL := 0;

     IF ShadowStackEnabled(CPL)
           SSP := 0;

     FI;
     IF EndbranchEnabled(CPL)

           IA32_S_CET.TRACKER = WAIT_FOR_ENDBRANCH
           IA32_S_CET.SUPPRESS = 0
     FI;

          SS.Selector := CS.Selector + 8;        (* SS just above CS *)
          (* Set rest of SS to a fixed value *)  (* Flat segment *)
          SS.Base := 0;                          (* With 4-KByte granularity, implies a 4-GByte limit *)
          SS.Limit := FFFFFH;                    (* Read/write data, accessed *)
          SS.Type := 3;
          SS.S := 1;                             (* 32-bit stack segment*)
          SS.DPL := 0;                           (* 4-KByte granularity *)
          SS.P := 1;                             (* save instruction length on stack *)
          SS.B := 1;
          SS.G := 1;
    ELSE (* CR4.FRED = 1 *)
          FRED event delivery of SYSENTER;
FI;
```

## Banderas afectadas

VM, IF (ver Operación arriba).
