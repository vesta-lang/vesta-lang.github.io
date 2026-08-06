---
summary: Retorno del procedimiento
---

## Descripción

Transfiere el control del programa a una dirección de retorno situada en la parte superior de la pila. La dirección se coloca generalmente en la pila por una instrucción CALL, y el retorno se hace a la instrucción que sigue la instrucción CALL.

El operando de origen opcional especifica el número de bytes de pila para ser lanzado después de que la dirección de retorno se ha superado; el predeterminado no es ninguno. Este operando se puede utilizar para liberar los parámetros de la pila que fueron pasados al procedimiento llamado y ya no son necesarios. Debe ser utilizado cuando la instrucción CALL utilizada para cambiar a un nuevo procedimiento utiliza una puerta de llamada con un recuento de palabras no cero para acceder al nuevo procedimiento. Aquí, el operando de origen para la instrucción RET debe especificar el mismo número de bytes que se especifica en el campo de cuenta de palabras de la puerta de llamada.

La instrucción RET se puede utilizar para ejecutar tres tipos diferentes de retornos:

* Retorno cercano - Retorno a un procedimiento de convocatoria dentro del segmento actual del código (el segmento actualmente señalado)

a) Por el registro de CS), a veces referido como un retorno intrasegment.

* Retorno lejano - Retorno a un procedimiento de llamada ubicado en un segmento diferente al segmento de código actual,

a veces se refiere como un retorno intersegmento.

* Retorno a un nivel de privilegios muy elevado - Retorno a un nivel de privilegio diferente al de la actual

ejecutar programa o procedimiento.

El tipo de retorno de nivel intermedio sólo puede ejecutarse en modo protegido. Vea la sección titulada "Procedimientos de llamada usando Call and RET" en el capítulo 6 de Intel(R) 64 e IA-32 Arquitecturas Software Developer's Manual, Volumen 1, para información detallada sobre retornos cercanos, lejanos e inter-privilege-level.

Al ejecutar un regreso cercano, el procesador abre el puntero de instruccion (offset) de la parte superior de la pila en el registro EIP y comienza la ejecución del programa en el nuevo puntero de instruccion. El registro CS no cambia.

Al ejecutar un retorno lejano, el procesador abre el puntero de instruccion de vuelta desde la parte superior de la pila en el registro EIP, luego aparece el selector de segmento desde la parte superior de la pila en el registro CS. El procesador entonces comienza la ejecución del programa en el nuevo segmento de código en el nuevo puntero de instruccion.

Los mecánicos de un retorno de distancia entre niveles de privilegios son similares a un retorno de intersección, excepto que el procesador examina los niveles de privilegios y los derechos de acceso de los segmentos de código y pila que se están devolviendo para determinar si se permite la transferencia de control. Los registros de los segmentos DS, ES, FS y GS son aclarados por la instrucción RET durante un retorno entre privilegios si se refieren a segmentos que no se permiten acceder al nuevo nivel de privilegios. Como un interruptor de pila también ocurre en un nivel de retorno entre privilegios, los registros ESP y SS se cargan de la pila.

Si los parámetros se pasan al procedimiento llamado durante una llamada de nivel interprivilegio, el operando de origen opcional debe ser utilizado con la instrucción RET para liberar los parámetros en el retorno. Aquí, los parámetros se liberan tanto de la pila del procedimiento llamado y la pila del procedimiento de llamada (es decir, la pila que se devuelve a).

En modo de 64 bits, el tamaño de operación predeterminado de esta instrucción es el tamaño de la dirección de pila, es decir, 64 bits. Esto se aplica a retornos cercanos, no retornos lejanos; el tamaño de operación predeterminado de retornos lejanos es de 32 bits.

Consulte el capítulo 6, "Procedure Calls, Interrupts, and Excepcionions", y el capítulo 18, "Control-flow Enforcement Technology (CET)," en el Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1, para detalles CET.

Cuando las transiciones FRED están habilitadas, una ejecución de RET lejano que cambiaría CPL causa una excepción de protección general, al igual que una ejecución de RET lejano que entraría en modo de compatibilidad cuando CPL es 0.

Ordenación de instrucciones. Las instrucciones después de un retorno lejano pueden ser arrebatadas de memoria antes de que las instrucciones anteriores completen la ejecución, pero no ejecutarán (incluso especulativamente) hasta que todas las instrucciones antes del retorno lejano hayan completado la ejecución (las instrucciones posteriores pueden ejecutarse antes de que los datos almacenados por las instrucciones anteriores se hayan vuelto mundialmente visibles).

A diferencia de CALL indirecto cercano y casi indirecto JMP, el procesador no ejecutará especulativamente la siguiente instrucción secuencial después de un RET cercano a menos que esa instrucción sea también el objetivo de un salto o es un objetivo en un predictor de rama.

## Operación

```text
(* Near return *)
IF instruction = near return

    THEN;
          IF OperandSize = 32
                THEN
                      IF top 4 bytes of stack not within stack limits
                            THEN #SS(0); FI;
                      EIP := Pop();
                      IF ShadowStackEnabled(CPL)
                            tempSsEIP = ShadowStackPop4B();
                            IF EIP != TempSsEIP
                                  THEN #CP(NEAR_RET); FI;
                      FI;
                ELSE
                      IF OperandSize = 64
                            THEN
                                  IF top 8 bytes of stack not within stack limits
                                        THEN #SS(0); FI;
                                  RIP := Pop();
                                  IF ShadowStackEnabled(CPL)
                                        tempSsEIP = ShadowStackPop8B();
                                        IF RIP != tempSsEIP
                                              THEN #CP(NEAR_RET); FI;
                                  FI;
                            ELSE (* OperandSize = 16 *)
                                  IF top 2 bytes of stack not within stack limits
                                        THEN #SS(0); FI;
                                  tempEIP := Pop();
                                  tempEIP := tempEIP AND 0000FFFFH;
                                  IF tempEIP not within code segment limits
                                        THEN #GP(0); FI;
                                  EIP := tempEIP;
                                  IF ShadowStackEnabled(CPL)
                                        tempSsEip = ShadowStackPop4B();
                                        IF EIP != tempSsEIP
                                              THEN #CP(NEAR_RET); FI;
                                  FI;
                      FI;
          FI;

          IF instruction has immediate operand


                THEN (* Release parameters from stack *)
                    IF StackAddressSize = 32
                             THEN
                                   ESP := ESP + SRC;
                             ELSE
                               IF StackAddressSize = 64
                                         THEN
                                               RSP := RSP + SRC;
                                     ELSE (* StackAddressSize = 16 *)
                                               SP := SP + SRC;
                                   FI;
                       FI;

          FI;
FI;

(* Real-address mode or virtual-8086 mode *)
IF ((PE = 0) or (PE = 1 AND VM = 1)) and instruction = far return

    THEN
          IF OperandSize = 32
                THEN
                       IF top 8 bytes of stack not within stack limits
                             THEN #SS(0); FI;
                       EIP := Pop();
                       CS := Pop(); (* 32-bit pop, high-order 16 bits discarded *)
                ELSE (* OperandSize = 16 *)
                       IF top 4 bytes of stack not within stack limits
                             THEN #SS(0); FI;
                       tempEIP := Pop();
                       tempEIP := tempEIP AND 0000FFFFH;
                       IF tempEIP not within code segment limits
                             THEN #GP(0); FI;
                       EIP := tempEIP;
                       CS := Pop(); (* 16-bit pop *)
          FI;

    IF instruction has immediate operand
          THEN (* Release parameters from stack *)
                SP := SP + (SRC AND FFFFH);

    FI;
FI;

(* Protected mode, not virtual-8086 mode *)
IF (PE = 1 and VM = 0 and IA32_EFER.LMA = 0) and instruction = far return

    THEN
          IF OperandSize = 32
                THEN
                       IF second doubleword on stack is not within stack limits
                             THEN #SS(0); FI;
                ELSE (* OperandSize = 16 *)
                       IF second word on stack is not within stack limits
                             THEN #SS(0); FI;
          FI;
          IF return code segment selector is NULL
                THEN #GP(0); FI;
          IF return code segment selector addresses descriptor beyond descriptor table limit


                THEN #GP(selector); FI;
          Obtain descriptor to which return code segment selector points from descriptor table;
          IF return code segment descriptor is not a code segment

                THEN #GP(selector); FI;
          IF return code segment selector RPL < CPL

                THEN #GP(selector); FI;
          IF return code segment descriptor is conforming and return code segment DPL > return code segment selector RPL

                THEN #GP(selector); FI;

        IF return code segment descriptor is non-conforming and return code segment DPL  return code segment selector RPL

                THEN #GP(selector); FI;
          IF return code segment descriptor is not present

                THEN #NP(selector); FI:
          IF return code segment selector RPL > CPL

                THEN GOTO RETURN-TO-OUTER-PRIVILEGE-LEVEL;
                ELSE GOTO RETURN-TO-SAME-PRIVILEGE-LEVEL;
          FI;
FI;

RETURN-TO-SAME-PRIVILEGE-LEVEL:
    IF the return instruction pointer is not within the return code segment limit
          THEN #GP(0); FI;
    IF OperandSize = 32
          THEN
                EIP := Pop();
                CS := Pop(); (* 32-bit pop, high-order 16 bits discarded *)
         ELSE (* OperandSize = 16 *)
                EIP := Pop();
                EIP := EIP AND 0000FFFFH;
                CS := Pop(); (* 16-bit pop *)
    FI;
    IF instruction has immediate operand
          THEN (* Release parameters from stack *)
               IF StackAddressSize = 32
                      THEN
                            ESP := ESP + SRC;
                    ELSE (* StackAddressSize = 16 *)
                            SP := SP + SRC;
                FI;
    FI;
    IF ShadowStackEnabled(CPL)
          (* SSP must be 8 byte aligned *)
          IF SSP AND 0x7 != 0
                THEN #CP(FAR-RET/IRET); FI;
          tempSsCS = shadow_stack_load 8 bytes from SSP+16;
          tempSsLIP = shadow_stack_load 8 bytes from SSP+8;
          prevSSP = shadow_stack_load 8 bytes from SSP;
          SSP = SSP + 24;
          (* do a 64 bit-compare to check if any bits beyond bit 15 are set *)
          tempCS = CS; (* zero pad to 64 bit *)
          IF tempCS != tempSsCS
                THEN #CP(FAR-RET/IRET); FI;
          (* do a 64 bit-compare; pad CSBASE+RIP with 0 for 32 bit LIP*)
          IF CSBASE + RIP != tempSsLIP
                THEN #CP(FAR-RET/IRET); FI;


          (* prevSSP must be 4 byte aligned *)
          IF prevSSP AND 0x3 != 0

                THEN #CP(FAR-RET/IRET); FI;
          (* In legacy mode SSP must be in low 4GB *)
          IF prevSSP[63:32] != 0

                THEN #GP(0); FI;
          SSP := prevSSP
    FI;

RETURN-TO-OUTER-PRIVILEGE-LEVEL:
    IF top (16 + SRC) bytes of stack are not within stack limits (OperandSize = 32)
    or top (8 + SRC) bytes of stack are not within stack limits (OperandSize = 16)
                THEN #SS(0); FI;
    Read return segment selector;
    IF stack segment selector is NULL
          THEN #GP(0); FI;
    IF return stack segment selector index is not within its descriptor table limits
          THEN #GP(selector); FI;
    Read segment descriptor pointed to by return segment selector;
    IF stack segment selector RPL  RPL of the return code segment selector
    or stack segment is not a writable data segment
    or stack segment descriptor DPL  RPL of the return code segment selector
                THEN #GP(selector); FI;
    IF stack segment not present
          THEN #SS(StackSegmentSelector); FI;
    IF the return instruction pointer is not within the return code segment limit
          THEN #GP(0); FI;
    IF OperandSize = 32
          THEN
                EIP := Pop();
                CS := Pop(); (* 32-bit pop, high-order 16 bits discarded; segment descriptor loaded *)
                CS(RPL) := ReturnCodeSegmentSelector(RPL);
                IF instruction has immediate operand
                       THEN (* Release parameters from called procedure's stack *)
                          IF StackAddressSize = 32
                                   THEN
                                         ESP := ESP + SRC;
                               ELSE (* StackAddressSize = 16 *)
                                         SP := SP + SRC;
                             FI;
                FI;
                tempESP := Pop();
                tempSS := Pop(); (* 32-bit pop, high-order 16 bits discarded; seg. descriptor loaded *)
         ELSE (* OperandSize = 16 *)
                EIP := Pop();
                EIP := EIP AND 0000FFFFH;
                CS := Pop(); (* 16-bit pop; segment descriptor loaded *)
                CS(RPL) := ReturnCodeSegmentSelector(RPL);
                IF instruction has immediate operand
                       THEN (* Release parameters from called procedure's stack *)
                          IF StackAddressSize = 32
                                   THEN
                                         ESP := ESP + SRC;
                               ELSE (* StackAddressSize = 16 *)


                                    SP := SP + SRC;
                        FI;
            FI;
            tempESP := Pop();
            tempSS := Pop(); (* 16-bit pop; segment descriptor loaded *)
      FI;
IF ShadowStackEnabled(CPL)
      (* check if 8 byte aligned *)
      IF SSP AND 0x7 != 0
            THEN #CP(FAR-RET/IRET); FI;
      IF ReturnCodeSegmentSelector(RPL) !=3
            THEN
                  tempSsCS = shadow_stack_load 8 bytes from SSP+16;
                  tempSsLIP = shadow_stack_load 8 bytes from SSP+8;
                  tempSSP = shadow_stack_load 8 bytes from SSP;
                  SSP = SSP + 24;
                  (* Do 64 bit compare to detect bits beyond 15 being set *)
                  tempCS = CS; (* zero extended to 64 bit *)
                  IF tempCS != tempSsCS
                        THEN #CP(FAR-RET/IRET); FI;
                  (* Do 64 bit compare; pad CSBASE+RIP with 0 for 32 bit LA *)
                  IF CSBASE + RIP != tempSsLIP
                        THEN #CP(FAR-RET/IRET); FI;
                  (* check if 4 byte aligned *)
                  IF tempSSP AND 0x3 != 0
                        THEN #CP(FAR-RET/IRET); FI;
      FI;
FI;
      tempOldCPL = CPL;

     CPL := ReturnCodeSegmentSelector(RPL);

     ESP := tempESP;

     SS := tempSS;

     tempOldSSP = SSP;

     IF ShadowStackEnabled(CPL)

          IF CPL = 3

          THEN tempSSP := IA32_PL3_SSP; FI;

          IF tempSSP[63:32] != 0

          THEN #GP(0); FI;

          SSP := tempSSP

     FI;

     (* Now past all faulting points; safe to free the token. The token free is done using the old SSP

     * and using a supervisor override as old CPL was a supervisor privilege level *)

     IF ShadowStackEnabled(tempOldCPL)

          expected_token_value = tempOldSSP | BUSY_BIT (* busy bit - bit position 0 - must be set *)

          new_token_value = tempOldSSP       (* clear the busy bit *)

          shadow_stack_lock_cmpxchg8b(tempOldSSP, new_token_value, expected_token_value)

     FI;

FI;

FOR each SegReg in (ES, FS, GS, and DS)
      DO
            tempDesc := descriptor cache for SegReg (* hidden part of segment register *)
            IF (SegmentSelector == NULL) OR (tempDesc(DPL) < CPL AND tempDesc(Type) is (data or non-conforming code)))


           THEN (* Segment register invalid *)
                 SegmentSelector := 0; (*Segment selector becomes null*)

      FI;
OD;

IF instruction has immediate operand

      THEN (* Release parameters from calling procedure's stack *)

          IF StackAddressSize = 32
                  THEN

                        ESP := ESP + SRC;
                ELSE (* StackAddressSize = 16 *)

                        SP := SP + SRC;
            FI;

FI;

(* IA-32e Mode *)
    IF (PE = 1 and VM = 0 and IA32_EFER.LMA = 1) and instruction = far return
          THEN
                IF OperandSize = 32
                      THEN
                            IF second doubleword on stack is not within stack limits
                                  THEN #SS(0); FI;
                            IF first or second doubleword on stack is not in canonical space
                                  THEN #SS(0); FI;
                      ELSE
                            IF OperandSize = 16
                                  THEN
                                        IF second word on stack is not within stack limits
                                              THEN #SS(0); FI;
                                        IF first or second word on stack is not in canonical space
                                              THEN #SS(0); FI;
                                  ELSE (* OperandSize = 64 *)
                                        IF first or second quadword on stack is not in canonical space
                                              THEN #SS(0); FI;
                            FI
                FI;
          IF return code segment selector is NULL
                THEN GP(0); FI;
          IF return code segment selector addresses descriptor beyond descriptor table limit
                THEN GP(selector); FI;
          IF return code segment selector addresses descriptor in non-canonical space
                THEN GP(selector); FI;
          Obtain descriptor to which return code segment selector points from descriptor table;
          IF return code segment descriptor is not a code segment
                THEN #GP(selector); FI;
          IF return code segment descriptor has L-bit = 1 and D-bit = 1
                THEN #GP(selector); FI;
          IF return code segment selector RPL < CPL or (CR4.FRED = 1 and return code segment selector RPL > CPL)
                THEN #GP(selector); FI;
          IF return code segment descriptor is conforming and return code segment DPL > return code segment selector RPL
                THEN #GP(selector); FI;

        IF return code segment descriptor is non-conforming and return code segment DPL  return code segment selector RPL

                THEN #GP(selector); FI;
          IF CR4.FRED = 1 and CPL = 0 and L-bit is 0 in return code segment descriptor


                THEN #GP(selector); FI;
          IF return code segment descriptor is not present

                THEN #NP(selector); FI:
          IF return code segment selector RPL > CPL

                THEN GOTO IA-32E-MODE-RETURN-TO-OUTER-PRIVILEGE-LEVEL;
                ELSE GOTO IA-32E-MODE-RETURN-TO-SAME-PRIVILEGE-LEVEL;
          FI;
    FI;

IA-32E-MODE-RETURN-TO-SAME-PRIVILEGE-LEVEL:
IF the return instruction pointer is not within the return code segment limit

    THEN #GP(0); FI;
IF the return instruction pointer is not within canonical address space

    THEN #GP(0); FI;
IF OperandSize = 32

    THEN
          EIP := Pop();
          CS := Pop(); (* 32-bit pop, high-order 16 bits discarded *)

    ELSE
          IF OperandSize = 16
                THEN
                       EIP := Pop();
                       EIP := EIP AND 0000FFFFH;
                       CS := Pop(); (* 16-bit pop *)
               ELSE (* OperandSize = 64 *)
                       RIP := Pop();
                       CS := Pop(); (* 64-bit pop, high-order 48 bits discarded *)
          FI;

FI;
IF instruction has immediate operand

    THEN (* Release parameters from stack *)
         IF StackAddressSize = 32
                THEN
                       ESP := ESP + SRC;
                ELSE
                       IF StackAddressSize = 16
                             THEN
                                   SP := SP + SRC;
                          ELSE (* StackAddressSize = 64 *)
                                   RSP := RSP + SRC;
                       FI;
          FI;

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
    IF CSBASE + RIP != tempSsLIP (* 64 bit compare *)


          THEN #CP(FAR-RET/IRET); FI;
    IF tempSSP AND 0x3 != 0 (* check if aligned to 4 bytes *)

          THEN #CP(FAR-RET/IRET); FI;
    IF (CS.L = 0 AND tempSSP[63:32] != 0) OR

        (CS.L = 1 AND tempSSP is not canonical relative to the current paging mode)
          THEN #GP(0); FI;

    SSP := tempSSP
FI;

IA-32E-MODE-RETURN-TO-OUTER-PRIVILEGE-LEVEL:
IF top (16 + SRC) bytes of stack are not within stack limits (OperandSize = 32)
or top (8 + SRC) bytes of stack are not within stack limits (OperandSize = 16)

    THEN #SS(0); FI;
IF top (16 + SRC) bytes of stack are not in canonical address space (OperandSize =32)
or top (8 + SRC) bytes of stack are not in canonical address space (OperandSize = 16)
or top (32 + SRC) bytes of stack are not in canonical address space (OperandSize = 64)

    THEN #SS(0); FI;
Read return stack segment selector;
IF stack segment selector is NULL

    THEN
          IF new CS descriptor L-bit = 0
                THEN #GP(selector);
          IF stack segment selector RPL = 3
                THEN #GP(selector);

FI;
IF return stack segment descriptor is not within descriptor table limits

          THEN #GP(selector); FI;
IF return stack segment descriptor is in non-canonical address space

          THEN #GP(selector); FI;
Read segment descriptor pointed to by return segment selector;
IF stack segment selector RPL  RPL of the return code segment selector
or stack segment is not a writable data segment
or stack segment descriptor DPL  RPL of the return code segment selector

    THEN #GP(selector); FI;
IF stack segment not present

    THEN #SS(StackSegmentSelector); FI;
IF the return instruction pointer is not within the return code segment limit

    THEN #GP(0); FI:
IF the return instruction pointer is not within canonical address space

    THEN #GP(0); FI;
IF OperandSize = 32

    THEN
          EIP := Pop();
          CS := Pop(); (* 32-bit pop, high-order 16 bits discarded, segment descriptor loaded *)
          CS(RPL) := ReturnCodeSegmentSelector(RPL);
          IF instruction has immediate operand
                THEN (* Release parameters from called procedure's stack *)
                    IF StackAddressSize = 32
                             THEN
                                   ESP := ESP + SRC;
                             ELSE
                                   IF StackAddressSize = 16
                                         THEN
                                               SP := SP + SRC;


                                     ELSE (* StackAddressSize = 64 *)
                                               RSP := RSP + SRC;

                                   FI;
                       FI;
          FI;
          tempESP := Pop();
          tempSS := Pop(); (* 32-bit pop, high-order 16 bits discarded, segment descriptor loaded *)
    ELSE
          IF OperandSize = 16
                THEN
                       EIP := Pop();
                       EIP := EIP AND 0000FFFFH;
                       CS := Pop(); (* 16-bit pop; segment descriptor loaded *)
                       CS(RPL) := ReturnCodeSegmentSelector(RPL);
                       IF instruction has immediate operand

                             THEN (* Release parameters from called procedure's stack *)
                               IF StackAddressSize = 32
                                         THEN
                                               ESP := ESP + SRC;
                                         ELSE
                                               IF StackAddressSize = 16
                                                     THEN
                                                           SP := SP + SRC;
                                                ELSE (* StackAddressSize = 64 *)
                                                           RSP := RSP + SRC;
                                               FI;
                                   FI;

                       FI;
                       tempESP := Pop();
                       tempSS := Pop(); (* 16-bit pop; segment descriptor loaded *)
               ELSE (* OperandSize = 64 *)
                       RIP := Pop();
                       CS := Pop(); (* 64-bit pop; high-order 48 bits discarded; seg. descriptor loaded *)
                       CS(RPL) := ReturnCodeSegmentSelector(RPL);
                       IF instruction has immediate operand

                             THEN (* Release parameters from called procedure's stack *)
                                   RSP := RSP + SRC;

                       FI;
                       tempESP := Pop();
                       tempSS := Pop(); (* 64-bit pop; high-order 48 bits discarded; seg. desc. loaded *)
          FI;
FI;

IF ShadowStackEnabled(CPL)
    (* check if 8 byte aligned *)
    IF SSP AND 0x7 != 0
          THEN #CP(FAR-RET/IRET); FI;
    IF ReturnCodeSegmentSelector(RPL) !=3
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

          IF CSBASE + RIP != tempSsLIP

                 THEN #CP(FAR-RET/IRET); FI;

          (* check if 4 byte aligned *)

          IF tempSSP AND 0x3 != 0

                 THEN #CP(FAR-RET/IRET); FI;

     FI;

FI;

tempOldCPL = CPL;

CPL := ReturnCodeSegmentSelector(RPL);

ESP := tempESP;

SS := tempSS;

tempOldSSP = SSP;

IF ShadowStackEnabled(CPL)

     IF CPL = 3

          THEN tempSSP := IA32_PL3_SSP; FI;

     IF (CS.L = 0 AND tempSSP[63:32] != 0) OR

          (CS.L = 1 AND tempSSP is not canonical relative to the current paging mode)

          THEN #GP(0); FI;

     SSP := tempSSP

FI;

(* Now past all faulting points; safe to free the token. The token free is done using the old SSP

* and using a supervisor override as old CPL was a supervisor privilege level *)

IF ShadowStackEnabled(tempOldCPL)

     expected_token_value = tempOldSSP | BUSY_BIT   (* busy bit - bit position 0 - must be set *)

     new_token_value = tempOldSSP                   (* clear the busy bit *)

     shadow_stack_lock_cmpxchg8b(tempOldSSP, new_token_value, expected_token_value)

FI;

FOR each of segment register (ES, FS, GS, and DS)
    DO
          IF segment register points to data or non-conforming code segment
          and CPL > segment descriptor DPL; (* DPL in hidden part of segment register *)
                THEN SegmentSelector := 0; (* SegmentSelector invalid *)
          FI;
    OD;

IF instruction has immediate operand
    THEN (* Release parameters from calling procedure's stack *)
         IF StackAddressSize = 32
                THEN
                      ESP := ESP + SRC;
                ELSE
                      IF StackAddressSize = 16
                            THEN
                                  SP := SP + SRC;
                          ELSE (* StackAddressSize = 64 *)
                                  RSP := RSP + SRC;
                      FI;
          FI;

FI;
```

## Banderas afectadas

None.

## Descripción

Rota los bits de operando de origen derecho por el valor de cuenta especificado en imm8 sin afectar las banderas aritméticas. El resultado está escrito al operando de destino. Esta instrucción no es compatible en modo real y modo virtual-8086. El tamaño de operando es siempre 32 bits si no en modo de 64 bits. En modo de 64 bits tamaño de operando 64 requiere VEX.W1. VEX.W1 es ignorado en modos no-64-bit. Un intento de ejecutar esta instrucción con VEX.L no igual a 0 causará #UD.

## Operación

```text
IF (OperandSize = 32)

    y := imm8 AND 1FH;
    DEST := (SRC >> y) | (SRC << (32-y));
ELSEIF (OperandSize = 64)
    y := imm8 AND 3FH;
    DEST := (SRC >> y) | (SRC << (64-y));
FI;
```

## Banderas afectadas

None.

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-29, "Tipo 13 Condiciones de Excepción de Clase".

RORX -- girar derecho lógica sin afectar las banderas
