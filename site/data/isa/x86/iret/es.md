---
summary: Retorno interrumpido
---

## Descripción

Devuelve el control del programa de una excepción o interrumpe a un programa o procedimiento que fue interrumpido por una excepción, una interrupción externa o una interrupción generada por software. Estas instrucciones también se utilizan para realizar un retorno de una tarea anidada. (Una tarea anidada se crea cuando una instrucción CALL se utiliza para iniciar un interruptor de tarea o cuando una interrupción o excepción causa un interruptor de tarea a un controlador de interrupción o excepción.) Vea la sección titulada "Task Linking" en el capítulo 10 del Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 3A.

IRET y IRETD son mnemonics para el mismo código de operación. El IRETD mnemonic (interrupt return double) está diseñado para su uso cuando regresa de una interrupción al utilizar el tamaño de operando de 32 bits; sin embargo, la mayoría de los montadores utilizan el IRET mnemonic intercambiablemente para ambos tamaños operando.

En modo de direccion real, la instrucción IRET realiza un retorno lejano al programa o procedimiento interrumpido. Durante esta operación, el procesador abre la imagen puntero de instruccion de retorno, código de retorno selector de segmento y EFLAGS de la pila a los registros EIP, CS y EFLAGS, respectivamente, y luego vuelve a ejecutar el programa o procedimiento interrumpido.

En modo protegido, la acción de la instrucción IRET depende de la configuración de las banderas NT y VM en el registro EFLAGS y la bandera VM en la imagen EFLAGS almacenada en la pila actual. Dependiendo de la configuración de estas banderas, el procesador realiza los siguientes tipos de retornos interrumpidos:

* Regresa desde modo virtual-8086. * Vuelve a modo virtual-8086. * Retorno de nivel de propiedad. * Retorno de nivel intermedio. * Regrese de la tarea anidada (cambio de tinta).

Si la bandera NT (EFLAGS) se pone a cero, la instrucción IRET realiza un retorno lejos del procedimiento de interrupción, sin un interruptor de tarea. El segmento de código que se devuelve debe ser igual o menos privilegiado que la rutina del controlador de interrupción (como indica el campo RPL del código selector de segmento saltó de la pila).

Al igual que con un modo de direccion real interrumpe el retorno, la instrucción IRET aparece el retorno puntero de instruccion, código de retorno selector de segmento, y la imagen EFLAGS de la pila a los registros EIP, CS, y EFLAGS, respectivamente, y luego reanudar la ejecución del programa o procedimiento interrumpido. Si el regreso es a otro nivel de privilegio, la instrucción IRET también aparece el puntero de pila y SS de la pila, antes de reanudar la ejecución del programa. Si el retorno es a modo virtual-8086, el procesador también abre los registros del segmento de datos de la pila.

Si se establece la bandera NT, la instrucción IRET realiza un interruptor de tarea (retorno) de una tarea anidada (una tarea llamada con una instrucción CALL, una interrupción o una excepción) de vuelta a la tarea llamada o interrumpida. El estado actualizado de la tarea que ejecuta la instrucción IRET se guarda en su TSS. Si la tarea vuelve a entrar, se ejecuta el código que sigue la instrucción IRET.

Si se establece la bandera NT y el procesador está en modo IA-32e, la instrucción IRET causa una excepción de protección general.

Si las interrupciones no visibles (NMIs) están bloqueadas (ver Sección 7.7.1, "Mantenimiento de Múltiples NMIs" en Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 3A), la ejecución de la instrucción IRET desbloquea NMIs.

Este desbloqueo ocurre incluso si la instrucción causa una falla. En tal caso, los NMI se desenmascaran antes de que se invoque el manejador de excepción.

En modo de 64 bits, el tamaño de operación predeterminado de la instrucción es de 32 bits. El uso del prefijo REX.W promueve la operación a 64 bits (IRETQ). Vea la tabla resumen al comienzo de esta sección para la codificación de datos y límites.

Consulte el capítulo 6, "Procedure Calls, Interrupts, and Excepcionions" y el capítulo 18, "Control-flow Enforcement Technology (CET)" en el manual de desarrollo de software de arquitecturas Intel(R) 64 e IA-32, Volumen 1, para detalles CET.

Cuando las transiciones FRED están habilitadas, una ejecución de IRET que cambiaría CPL causa una excepción de protección general, al igual que una ejecución de IRET que entraría en modo de compatibilidad cuando CPL es 0.

Ordenación de instrucciones. IRET es una instrucción serializante. Ver la sección 11.3 del Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 3A.

Ver "Cambios para el comportamiento de la instrucción en VMX Operación no-rota" en el capítulo 28 de Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 3C, para obtener más información sobre el comportamiento de esta instrucción en VMX operación no-raíz.

## Operación

```text
IF PE = 0
    THEN GOTO REAL-ADDRESS-MODE;

ELSIF (IA32_EFER.LMA = 0)
    THEN
          IF (EFLAGS.VM = 1)
                THEN GOTO RETURN-FROM-VIRTUAL-8086-MODE;
                ELSE GOTO PROTECTED-MODE;
          FI;
    ELSE GOTO IA-32e-MODE;

FI;

REAL-ADDRESS-MODE;
    IF OperandSize = 32
          THEN
                EIP := Pop();
                CS := Pop(); (* 32-bit pop, high-order 16 bits discarded *)
                tempEFLAGS := Pop();
                EFLAGS := (tempEFLAGS AND 257FD5H) OR (EFLAGS AND 1A0000H);

        ELSE (* OperandSize = 16 *)

                EIP := Pop(); (* 16-bit pop; clear upper 16 bits *)
                CS := Pop(); (* 16-bit pop *)
                EFLAGS[15:0] := Pop();
    FI;
    END;

RETURN-FROM-VIRTUAL-8086-MODE:
(* Processor is in virtual-8086 mode when IRET is executed and stays in virtual-8086 mode *)

   IF IOPL = 3 (* Virtual mode: PE = 1, VM = 1, IOPL = 3 *)
        THEN IF OperandSize = 32

                THEN
                      EIP := Pop();
                      CS := Pop(); (* 32-bit pop, high-order 16 bits discarded *)
                      EFLAGS := Pop();
                      (* VM, IOPL,VIP and VIF EFLAG bits not modified by pop *)
                      IF EIP not within CS limit
                            THEN #GP(0); FI;

             ELSE (* OperandSize = 16 *)

                      EIP := Pop(); (* 16-bit pop; clear upper 16 bits *)


                     CS := Pop(); (* 16-bit pop *)
                     EFLAGS[15:0] := Pop(); (* IOPL in EFLAGS not modified by pop *)
                     IF EIP not within CS limit

                           THEN #GP(0); FI;
               FI;
         ELSE

             #GP(0); (* Trap to virtual-8086 monitor: PE = 1, VM = 1, IOPL < 3 *)

    FI;
END;

PROTECTED-MODE:

   IF NT = 1
        THEN GOTO TASK-RETURN; (* PE = 1, VM = 0, NT = 1 *)

    FI;

   IF OperandSize = 32

          THEN

                EIP := Pop();

                CS := Pop(); (* 32-bit pop, high-order 16 bits discarded *)

                tempEFLAGS := Pop();

        ELSE (* OperandSize = 16 *)

                EIP := Pop(); (* 16-bit pop; clear upper bits *)

                CS := Pop(); (* 16-bit pop *)

                tempEFLAGS := Pop(); (* 16-bit pop; clear upper bits *)

    FI;

   IF tempEFLAGS(VM) = 1 and CPL = 0

          THEN GOTO RETURN-TO-VIRTUAL-8086-MODE;

          ELSE GOTO PROTECTED-MODE-RETURN;

    FI;

TASK-RETURN: (* PE = 1, VM = 0, NT = 1 *)

    SWITCH-TASKS (without nesting) to TSS specified in link field of current TSS;
    Mark the task just abandoned as NOT BUSY;
    IF EIP is not within CS limit

          THEN #GP(0); FI;
END;

RETURN-TO-VIRTUAL-8086-MODE:

   (* Interrupted procedure was in virtual-8086 mode: PE = 1, CPL=0, VM = 1 in flag image *)

    (* If shadow stack or indirect branch tracking at CPL3 then #GP(0) *)
    IF CR4.CET AND (IA32_U_CET.ENDBR_EN OR IA32_U_CET.SHSTK_EN)

          THEN #GP(0); FI;
    shadowStackEnabled = ShadowStackEnabled(CPL)
    IF EIP not within CS limit

          THEN #GP(0); FI;
    EFLAGS := tempEFLAGS;
    ESP := Pop();
    SS := Pop(); (* Pop 2 words; throw away high-order word *)
    ES := Pop(); (* Pop 2 words; throw away high-order word *)
    DS := Pop(); (* Pop 2 words; throw away high-order word *)
    FS := Pop(); (* Pop 2 words; throw away high-order word *)
    GS := Pop(); (* Pop 2 words; throw away high-order word *)
    IF shadowStackEnabled

          (* check if 8 byte aligned *)
          IF SSP AND 0x7 != 0


            THEN #CP(FAR-RET/IRET); FI;
FI;

CPL := 3;

(* Resume execution in Virtual-8086 mode *)

tempOldSSP = SSP;

(* Now past all faulting points; safe to free the token. The token free is done using the old SSP

* and using a supervisor override as old CPL was a supervisor privilege level *)

IF shadowStackEnabled

      expected_token_value = tempOldSSP | BUSY_BIT (* busy bit - bit position 0 - must be set *)

      new_token_value = tempOldSSP                       (* clear the busy bit *)

      shadow_stack_lock_cmpxchg8b(tempOldSSP, new_token_value, expected_token_value)

FI;

END;

PROTECTED-MODE-RETURN: (* PE = 1 *)

    IF CS(RPL) > CPL
          THEN GOTO RETURN-TO-OUTER-PRIVILEGE-LEVEL;

          ELSE GOTO RETURN-TO-SAME-PRIVILEGE-LEVEL; FI;

END;

RETURN-TO-OUTER-PRIVILEGE-LEVEL:

   IF OperandSize = 32

          THEN
                tempESP := Pop();
                tempSS := Pop(); (* 32-bit pop, high-order 16 bits discarded *)

   ELSE IF OperandSize = 16

          THEN
                tempESP := Pop(); (* 16-bit pop; clear upper bits *)
                tempSS := Pop(); (* 16-bit pop *)

        ELSE (* OperandSize = 64 *)

                tempRSP := Pop();
                tempSS := Pop(); (* 64-bit pop, high-order 48 bits discarded *)
    FI;

   IF new mode  64-Bit Mode

          THEN
                IF EIP is not within CS limit
                      THEN #GP(0); FI;

          ELSE (* new mode = 64-bit mode *)
                IF RIP is non-canonical
                            THEN #GP(0); FI;

    FI;
    EFLAGS (CF, PF, AF, ZF, SF, TF, DF, OF, NT) := tempEFLAGS;

   IF OperandSize = 32 or OperandSize = 64

          THEN EFLAGS(RF, AC, ID) := tempEFLAGS; FI;
    IF CPL  IOPL

          THEN EFLAGS(IF) := tempEFLAGS; FI;

   IF CPL = 0

          THEN
                EFLAGS(IOPL) := tempEFLAGS;

             IF OperandSize = 32 or OperandSize = 64

                      THEN EFLAGS(VIF, VIP) := tempEFLAGS; FI;
    FI;
    IF ShadowStackEnabled(CPL)


          (* check if 8 byte aligned *)
          IF SSP AND 0x7 != 0

                THEN #CP(FAR-RET/IRET); FI;
          IF CS(RPL) != 3

                THEN
                       tempSsCS = shadow_stack_load 8 bytes from SSP+16;
                       tempSsLIP = shadow_stack_load 8 bytes from SSP+8;
                       tempSSP = shadow_stack_load 8 bytes from SSP;
                       SSP = SSP + 24;
                       (* Do 64 bit compare to detect bits beyond 15 being set *)
                       tempCS = CS; (* zero padded to 64 bit *)
                       IF tempCS != tempSsCS
                             THEN #CP(FAR-RET/IRET); FI;
                       (* Do 64 bit compare; pad CSBASE+RIP with 0 for 32 bit LIP *)
                       IF CSBASE + RIP != tempSsEIP
                             THEN #CP(FAR-RET/IRET); FI;
                       (* check if 4 byte aligned *)
                       IF tempSSP AND 0x3 != 0
                             THEN #CP(FAR-RET/IRET); FI;

          FI;
    FI;
    tempOldCPL = CPL;
    CPL := CS(RPL);

          IF OperandSize = 64
                THEN
                       RSP := tempRSP;
                       SS := tempSS;

          ELSE
                ESP := tempESP;
                SS := tempSS;

          FI;
          IF new mode != 64-Bit Mode

                THEN
                       IF EIP is not within CS limit
                             THEN #GP(0); FI;

          ELSE (* new mode = 64-bit mode *)
                IF RIP is non-canonical
                       THEN #GP(0); FI;

          FI;
          tempOldSSP = SSP;
          IF ShadowStackEnabled(CPL)

                IF CPL = 3
                       THEN tempSSP := IA32_PL3_SSP; FI;

          IF ((IA32_EFER.LMA AND CS.L) = 0 AND tempSSP[63:32] != 0) OR
              ((IA32_EFER.LMA AND CS.L) = 1 AND tempSSP is not canonical relative to the current paging mode)
                THEN #GP(0); FI;

          SSP := tempSSP
          FI;
          (* Now past all faulting points; safe to free the token. The token free is done using the old SSP
           * and using a supervisor override as old CPL was a supervisor privilege level *)
          IF ShadowStackEnabled(tempOldCPL)

                expected_token_value = tempOldSSP | BUSY_BIT (* busy bit - bit position 0 - must be set *)
                new_token_value = tempOldSSP (* clear the busy bit *)
                shadow_stack_lock_cmpxchg8b(tempOldSSP, new_token_value, expected_token_value)


          FI;

    FOR each SegReg in (ES, FS, GS, and DS)
          DO
                tempDesc := descriptor cache for SegReg (* hidden part of segment register *)
                IF (SegmentSelector == NULL) OR (tempDesc(DPL) < CPL AND tempDesc(Type) is (data or non-conforming code)))
                      THEN (* Segment register invalid *)
                            SegmentSelector := 0; (*Segment selector becomes null*)
                FI;
          OD;

END;

RETURN-TO-SAME-PRIVILEGE-LEVEL: (* PE = 1, RPL = CPL *)
   IF new mode  64-Bit Mode

          THEN
                IF EIP is not within CS limit
                      THEN #GP(0); FI;

          ELSE (* new mode = 64-bit mode *)
                IF RIP is non-canonical
                            THEN #GP(0); FI;

    FI;
    EFLAGS (CF, PF, AF, ZF, SF, TF, DF, OF, NT) := tempEFLAGS;
    IF OperandSize = 32 or OperandSize = 64

          THEN EFLAGS(RF, AC, ID) := tempEFLAGS; FI;
    IF CPL  IOPL

          THEN EFLAGS(IF) := tempEFLAGS; FI;
    IF CPL = 0

           THEN
                 EFLAGS(IOPL) := tempEFLAGS;
                 IF OperandSize = 32 or OperandSize = 64
                      THEN EFLAGS(VIF, VIP) := tempEFLAGS; FI;

    FI;
    IF ShadowStackEnabled(CPL)

          IF SSP AND 0x7 != 0 (* check if aligned to 8 bytes *)
                THEN #CP(FAR-RET/IRET); FI;

          tempSsCS = shadow_stack_load 8 bytes from SSP+16;
          tempSsLIP = shadow_stack_load 8 bytes from SSP+8;
          tempSSP = shadow_stack_load 8 bytes from SSP;
          SSP = SSP + 24;
          tempCS = CS; (* zero padded to 64 bit *)
          IF tempCS != tempSsCS (* 64 bit compare; CS zero padded to 64 bits *)

                THEN #CP(FAR-RET/IRET); FI;
          IF CSBASE + RIP != tempSsLIP (* 64 bit compare; CSBASE+RIP zero padded to 64 bit for 32 bit LIP *)

                THEN #CP(FAR-RET/IRET); FI;
          IF tempSSP AND 0x3 != 0 (* check if aligned to 4 bytes *)

                THEN #CP(FAR-RET/IRET); FI;
          IF ((IA32_EFER.LMA AND CS.L) = 0 AND tempSSP[63:32] != 0) OR

             ((IA32_EFER.LMA AND CS.L) = 1 AND tempSSP is not canonical relative to the current paging mode)
                THEN #GP(0); FI;

    FI;
    IF ShadowStackEnabled(CPL)

          IF IA32_EFER.LMA = 1
          (* In IA-32e-mode the IRET may be switching stacks if the interrupt/exception was delivered
           through an IDT with a non-zero IST *)


         (* In IA-32e mode for same CPL IRET there is always a stack switch. The below check verifies if the

         stack switch was to self stack and if so, do not try to free the token on this shadow stack. If the

         tempSSP was not to same stack then there was a stack switch so do attempt to free the token *)

              IF tempSSP != SSP

                   THEN

                   expected_token_value = SSP | BUSY_BIT  (* busy bit - bit position 0 - must be set *)

                   new_token_value = SSP                  (* clear the busy bit *)

                   shadow_stack_lock_cmpxchg8b(SSP, new_token_value, expected_token_value)

              FI;

         FI;

         SSP := tempSSP

    FI;
END;

IA-32e-MODE:
    IF NT = 1
          THEN #GP(0);

   ELSE IF OperandSize = 32

          THEN
                EIP := Pop();
                CS := Pop();
                tempEFLAGS := Pop();

        ELSE IF OperandSize = 16

                THEN
                      EIP := Pop(); (* 16-bit pop; clear upper bits *)
                      CS := Pop(); (* 16-bit pop *)
                      tempEFLAGS := Pop(); (* 16-bit pop; clear upper bits *)

                FI;

        ELSE (* OperandSize = 64 *)

                THEN
                            RIP := Pop();
                            CS := Pop(); (* 64-bit pop, high-order 48 bits discarded *)
                            tempRFLAGS := Pop();

    FI;
    IF CS.RPL < CPL or (CR4.FRED = 1 and CS.RPL > CPL)

          THEN #GP(CS.selector); FI;
    IF CS.RPL > CPL

          THEN GOTO RETURN-TO-OUTER-PRIVILEGE-LEVEL;
          ELSE (* CS.RPL = CPL *)

                IF CR4.FRED = 1 and CPL = 0 and CS.L = 0
                      THEN #GP(CS.selector); FI;

                IF instruction began in 64-Bit Mode
                      THEN

                       IF OperandSize = 32

                                  THEN
                                        ESP := Pop();
                                        SS := Pop(); (* 32-bit pop, high-order 16 bits discarded *)

                       ELSE IF OperandSize = 16

                                  THEN
                                        ESP := Pop(); (* 16-bit pop; clear upper bits *)
                                        SS := Pop(); (* 16-bit pop *)

                            ELSE (* OperandSize = 64 *)

                                        RSP := Pop();
                                        SS := Pop(); (* 64-bit pop, high-order 48 bits discarded *)


                    FI;
        FI;
        GOTO RETURN-TO-SAME-PRIVILEGE-LEVEL; FI;

END;
```

## Banderas afectadas

Todas las banderas y campos del registro EFLAGS son potencialmente modificadas, dependiendo del modo de operación del procesador. Si realiza un retorno de una tarea anidada a una tarea anterior, el registro EFLAGS se modificará según la imagen EFLAGS almacenada en el TSS de la tarea anterior.
