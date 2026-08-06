---
summary: Llamada de sistema rápido
---

## Descripción

SYSCALL invoca a un controlador de sistema operativo a nivel de privilegios 0. Su operación depende de si las transiciones FRED están habilitadas.

Operación Cuando las transiciones FRED no están habilitadas

Cuando las transiciones FRED no están habilitadas, SYSCALL invoca el controlador de sistema operativo cargando RIP del IA32 LSTAR MSR (después de guardar la dirección de la instrucción siguiente SYSCALL en RCX). (MSR escribe asegura que el IA32 LSTAR MSR siempre contenga una dirección canónica.) El controlador del sistema operativo regresa utilizando la instrucción SYSRET.

SYSCALLtambién salvaRFLAGSenR11y luego máscarasRFLAGSusando el IA32 FMASKMSR (MSRdirecciónC0000084H); específicamente, el procesador se aclaraRFLAGScada bit correspondiente a un poco que se establece en el IA32 FMASKMSR.

SYSCALL carga los selectores de CS y SS con valores derivados de bits 47:32 del IA32 STAR MSR. Sin embargo, los caches descriptores CS y SS no están cargados de los descriptores (en GDT o LDT) referenciados por esos selectores. En cambio, los caches descriptor están cargados con valores fijos. Vea la sección Operación para más detalles. Es responsabilidad del software OS asegurar que los descriptores (en GDT o LDT) referenciados por esos valores selectores correspondan a los valores fijos cargados en los caches descriptores; la instrucción SYSCALL no garantiza esta correspondencia.

La instrucción SYSCALL no ahorra el puntero de pila (RSP). Si el controlador de sistema operativo cambiará el puntero de pila, es la responsabilidad del software guardar el valor anterior del puntero de pila. Esto podría hacerse antes de ejecutar SYSCALL, con software restaurando el puntero de pila con la instrucción siguiente SYSCALL (que se ejecutará después de SYSRET). Alternativamente, el controlador de sistema OS puede guardar el puntero de pila y restaurarlo antes de ejecutar SYSRET.

Cuando las pilas de sombras están habilitadas en un nivel de privilegio donde se invoca la instrucción SYSCALL, el SSP se salva al IA32 PL3 SSP MSR. Si las pilas de sombra están habilitadas a nivel de privilegio 0, el SSP está cargado con 0. Consulte el capítulo 6, "Procedure Calls, Interrupts, and Excepcionions", y el capítulo 18, "Control-flow Enforcement Technology (CET)," en el manual de desarrollo de software de arquitecturas Intel(R) 64 e IA-32, Volumen 1, para detalles adicionales de CET.

Cuando las transiciones FRED están habilitadas

Cuando las transiciones FRED están habilitadas, SYSCALL invoca el manejador del sistema operativo realizando la entrega de eventos FRED. Ver la sección 8.3, "FRED Event Delivery", en el Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 3. El evento se entrega con el tipo de evento 7 y el vector 1. Con las transiciones de FRED, el controlador OS utiliza la instrucción ERETU para volver a llamar código operativo en CPL 3.

Ordenación de instrucciones. Las instrucciones posteriores a un SYSCALL pueden ser arrebatadas de memoria antes de la ejecución completa de instrucciones anteriores, pero no ejecutarán (incluso especulativamente) hasta que todas las instrucciones anteriores al SYSCALL hayan completado la ejecución (las instrucciones posteriores pueden ejecutarse antes de que los datos almacenados por las instrucciones anteriores se hayan vuelto mundialmente visibles).

## Operación

```text
IF IA32_EFER.LMA = 0 OR CS.L = 0 (* SYSCALL can be used only in 64-bit mode *)

    THEN #UD;
ELSE IF CR4.FRED = 0


THEN

IF IA32_EFER.SCE = 0

      THEN #UD;

      ELSE

      RCX := RIP;                                            (* Will contain address of next instruction *)

      RIP := IA32_LSTAR;

      R11 := RFLAGS;

      RFLAGS := RFLAGS AND NOT(IA32_FMASK);

      CS.Selector := IA32_STAR[47:32] AND FFFCH (* Operating system provides CS; RPL forced to 0 *)

      (* Set rest of CS to a fixed value *)

      CS.Base := 0;                                          (* Flat segment *)

      CS.Limit := FFFFFH;                                    (* With 4-KByte granularity, implies a 4-GByte limit *)

      CS.Type := 11;                                         (* Execute/read code, accessed *)

      CS.S := 1;

      CS.DPL := 0;

      CS.P := 1;

      CS.L := 1;                                             (* Entry is to 64-bit mode *)

      CS.D := 0;                                             (* Required if CS.L = 1 *)

      CS.G := 1;                                             (* 4-KByte granularity *)

      IF ShadowStackEnabled(CPL)
            THEN (* adjust so bits 63:N get the value of bit N1, where N is the CPU's maximum linear-address width *)
                  IA32_PL3_SSP := LA_adjust(SSP);
                  (* With shadow stacks enabled the system call is supported from Ring 3 to Ring 0 *)
                  (* OS supporting Ring 0 to Ring 0 system calls or Ring 1/2 to ring 0 system call *)
                  (* Must preserve the contents of IA32_PL3_SSP to avoid losing ring 3 state *)

      FI;

      CPL := 0;

      IF ShadowStackEnabled(CPL)
            SSP := 0;

      FI;
      IF EndbranchEnabled(CPL)

            IA32_S_CET.TRACKER = WAIT_FOR_ENDBRANCH
            IA32_S_CET.SUPPRESS = 0
      FI;

                      SS.Selector := IA32_STAR[47:32] + 8;   (* SS just above CS *)
                      (* Set rest of SS to a fixed value *)  (* Flat segment *)
                      SS.Base := 0;                          (* With 4-KByte granularity, implies a 4-GByte limit *)
                      SS.Limit := FFFFFH;                    (* Read/write data, accessed *)
                      SS.Type := 3;
                      SS.S := 1;                             (* 32-bit stack segment *)
                      SS.DPL := 0;                           (* 4-KByte granularity *)
                      SS.P := 1;
                      SS.B := 1;                             (* save instruction length on stack *)
                      SS.G := 1;
          FI;
    ELSE (* CR4.FRED = 1 *)
          FRED event delivery of SYSCALL;
FI;
```

## Banderas afectadas

All.
