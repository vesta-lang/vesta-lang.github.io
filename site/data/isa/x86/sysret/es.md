---
summary: Retorno de la llamada de sistema rápido
---

## Descripción

SYSRET es una instrucción compañera a la instrucción SYSCALL. Devuelve de un controlador de sistema OS a código de usuario a nivel de privilegios 3. Lo hace cargando RIP de RCX y cargando RFLAGS de R11.1 Con un tamaño de operando de 64 bits, SYSRET permanece en modo de 64 bits; de lo contrario, entra en modo de compatibilidad y sólo se cargan los 32 bits bajos de los registros.

SYSRET carga los selectores de CS y SS con valores derivados de bits 63:48 del IA32 STAR MSR. Sin embargo, los caches descriptores CS y SS no están cargados de los descriptores (en GDT o LDT) referenciados por esos selectores. En cambio, los caches descriptor están cargados con valores fijos. Vea la sección Operación para más detalles. Es responsabilidad del software OS asegurar que los descriptores (en GDT o LDT) referenciados por esos valores selectores correspondan a los valores fijos cargados en los caches descriptores; la instrucción SYSRET no garantiza esta correspondencia.

La instrucción SYSRET no modifica el puntero de pila (ESP o RSP). Por eso, es necesario que el software cambie a la pila de usuario. El sistema operativo puede cargar el usuario puntero de pila (si fue guardado después de SYSCALL) antes de ejecutar SYSRET; alternativamente, el código de usuario puede cargar el puntero de pila (si fue guardado antes de SYSCALL) después de recibir el control de SYSRET.

Si el sistema operativo carga el puntero de pila antes de ejecutar SYSRET, debe asegurarse de que el manejador de cualquier interrupción o excepción entre restaurar el puntero de pila y la ejecución exitosa de SYSRET no se invoca con la pila de usuario. Puede hacerlo utilizando enfoques como los siguientes:

* Interrupciones externas. El sistema operativo puede evitar que una interrupción externa sea entregada aclarando EFLAGS.IF

antes de cargar el usuario puntero de pila.

* Interrupciones no visibles (NMIs). El sistema operativo puede asegurar que el controlador NMI sea invocado con la pila correcta por

usando el mecanismo de la tabla de la pila de interrupción (IST) para la puerta 2 (NMI) en el IDT (ver Sección 7.14.5, "Interrupt Stack Table", en Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 3A).

* Excepciones de protección general (#GP). La instrucción SYSRET genera #GP(0) si el valor de RCX no es

canónico. El sistema operativo puede abordar esta posibilidad utilizando uno o más de los siguientes enfoques:

-- Confirmando que el valor de RCX es canónico antes de ejecutar SYSRET.

-- Usando paging para asegurar que la instrucción SYSCALL nunca ahorrará un valor no canónico en RCX.

-- Utilizando el mecanismo IST para la puerta 13 (#GP) en el IDT.

Cuando las pilas de sombras están habilitadas a nivel de privilegio 3 la instrucción carga SSP con valor de IA32 PL3 SSP MSR. Consulte el capítulo 6, "Procedure Calls, Interrupts, and Excepcionions", y el capítulo 18, "Control-flow Enforcement Technology (CET)," en el manual de desarrollo de software de arquitecturas Intel(R) 64 e IA-32, Volumen 1, para detalles adicionales de CET.

La instrucción no se puede ejecutar cuando las transiciones FRED están habilitadas. Un sistema operativo que ha habilitado las transiciones FRED debe utilizar ERETU en su lugar.

1. Independientemente del valor de R11, las banderas RF y VM son siempre 0 en RFLAGS después de la ejecución de SYSRET. Además, todos los bits reservados en RFLAGS conservan los valores fijos.

Ordenación de instrucciones. Las instrucciones posteriores a un SYSRET pueden ser arrebatadas de memoria antes de la ejecución completa de instrucciones anteriores, pero no ejecutarán (incluso especulativamente) hasta que todas las instrucciones anteriores al SYSRET hayan completado la ejecución (las instrucciones posteriores pueden ejecutarse antes de que los datos almacenados por las instrucciones anteriores se hayan vuelto mundialmente visibles).

## Operación

```text
IF (CS.L  1 ) or (IA32_EFER.LMA  1) or (IA32_EFER.SCE  1) or (CR4.FRED = 1)

(* Not in 64-Bit Mode or SYSCALL/SYSRET not enabled in IA32_EFER or FRED enabled *)
    THEN #UD; FI;

IF (CPL  0) THEN #GP(0); FI;

IF (operand size is 64-bit)

     THEN (* Return to 64-Bit Mode *)

     IF (RCX is not canonical) THEN #GP(0);

     RIP := RCX;

     ELSE (* Return to Compatibility Mode *)

     RIP := ECX;

FI;

RFLAGS := (R11 & 3C7FD7H) | 2;                (* Clear RF, VM, reserved bits; set bit 1 *)

IF (operand size is 64-bit)

     THEN CS.Selector := IA32_STAR[63:48]+16;

     ELSE CS.Selector := IA32_STAR[63:48];

FI;

CS.Selector := CS.Selector OR 3;              (* RPL forced to 3 *)

(* Set rest of CS to a fixed value *)

CS.Base := 0;                                 (* Flat segment *)

CS.Limit := FFFFFH;                           (* With 4-KByte granularity, implies a 4-GByte limit *)

CS.Type := 11;                                (* Execute/read code, accessed *)

CS.S := 1;

CS.DPL := 3;

CS.P := 1;

IF (operand size is 64-bit)

     THEN (* Return to 64-Bit Mode *)

     CS.L := 1;                               (* 64-bit code segment *)

     CS.D := 0;                               (* Required if CS.L = 1 *)

     ELSE (* Return to Compatibility Mode *)

     CS.L := 0;                               (* Compatibility mode *)

     CS.D := 1;                               (* 32-bit code segment *)

FI;

CS.G := 1;                                    (* 4-KByte granularity *)

CPL := 3;

IF ShadowStackEnabled(CPL)

     SSP := IA32_PL3_SSP;

FI;

SS.Selector := (IA32_STAR[63:48]+8) OR 3;     (* RPL forced to 3 *)
(* Set rest of SS to a fixed value *)         (* Flat segment *)
SS.Base := 0;                                 (* With 4-KByte granularity, implies a 4-GByte limit *)
SS.Limit := FFFFFH;                           (* Read/write data, accessed *)
SS.Type := 3;
SS.S := 1;                                    (* 32-bit stack segment*)
SS.DPL := 3;                                  (* 4-KByte granularity *)
SS.P := 1;
SS.B := 1;
SS.G := 1;
```

## Banderas afectadas

All.
