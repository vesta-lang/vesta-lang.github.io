---
summary: Call to Interrupt Procedure
---

## Descripción

La instrucción INT n genera una llamada al manipulador de interrupción o excepción especificada con el operando de destino (ver la sección titulada "Interruptas y Excepciones" en el capítulo 6 del Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1). El operando de destino especifica un vector de 0 a 255, codificado como un valor intermedio sin señal de 8 bits. Cada vector proporciona un índice a un descriptor de puerta en el IDT. Los primeros 32 vectores son reservados por Intel para el uso del sistema. Algunos de estos vectores se utilizan para las excepciones generadas internamente.

Cuando se utiliza la entrega de eventos IDT, el vector proporciona un índice a un descriptor de puerta en el IDT. Los primeros 32 vectores son reservados por Intel para el uso del sistema. Algunos de estos vectores se utilizan para las excepciones generadas internamente. Cuando se utiliza la entrega de eventos FRED, el vector se guarda en la pila del manipulador del evento.

La instrucción INT n es la mnemónica general para ejecutar una llamada generada por software a un controlador de interrupción. ElINTOla instrucción es una mnemónica especial para llamar a la excepción del desbordamiento (#OF), excepción 4. El desbordamiento interrumpe comprueba la bandera OF en el registro EFLAGS y llama al manipulador interrumpido de desbordamiento si la bandera OF se fija en 1. (La instrucción INTO no se puede utilizar en modo de 64 bits.)

La instrucción INT3 utiliza un código de operación de un byte (CC) y está destinada a llamar al manipulador de la excepción de depuración con una excepción de punto de ruptura (#BP). (Esta forma de un byte es útil porque puede reemplazar el primer byte de cualquier instrucción en la que se desea un punto de ruptura, incluyendo otras instrucciones de un byte, sin sobreescribir otras instrucciones.)

La instrucción INT1 también utiliza un código de operación de un byte (F1) y genera una excepción de depuración (#DB) sin fijar ningún bit en los proveedores DR6.1 Hardware pueden utilizar la instrucción INT1 para depuración de hardware. Por eso, Intel recomienda que los proveedores de software utilicen la instrucción INT3 para los puntos de ruptura del software.

Una interrupción generada por la instrucción INTO, INT3 o INT1 difiere de una generada por INT n de las siguientes maneras:

* Los cheques IOPL normales no ocurren en modo virtual-8086. La interrupción se toma (sin falta) con cualquier IOPL

value.

* La redirección interrumpida habilitada por extensiones el modo virtual-8086 (VME) no ocurre. La interrupción es

Siempre manejado por un manejador de modo protegido.

* La entrega de eventos FRED utiliza el tipo de evento 4 (interrumpir software) para INT n pero utiliza el tipo de evento 5 (software privatizado)

excepción) para INT1 y tipo de evento 6 (excepción de software) para INT3 y INTO.

(Estas características no corresponden a CD01, CD03, o CD04, los códigos de operación "normal" de 2 bytes para INT 1, INT 3, y INT 4, respectivamente. Los ensambladores Intel y Microsoft no generarán el CD03 código de operación de cualquier mnemonic, pero este código de operación puede ser creado por definición de código numérico directa o por código automodificador.)

El funcionamiento y el uso de estas instrucciones dependen significativamente de si las transiciones FRED han sido habilitadas mediante el establecimiento de CR4.FRED. Si CR4.FRED = 0, se utiliza la entrega de eventos IDT; de lo contrario, se utiliza la entrega de eventos FRED. Las secciones siguientes se aplican según se indica.

1. El ICEBP mnemónico también se ha utilizado para la instrucción con código de operación F1.

Con IDT entrega de eventos

Con la entrega de eventos IDT, la acción de la instrucción INT n (incluyendo las instrucciones INTO, INT3 y INT1) es similar a la de una llamada de lejos hecha con la instrucción CALL. La diferencia principal es que con la instrucción INT n, el registro EFLAGS es empujado a la pila antes de la dirección de retorno. (La dirección de retorno es una dirección muy lejos que consiste en los valores actuales de los registros CS y EIP.) Los retornos de los procedimientos de interrupción se manejan con la instrucción IRET, que abre la información EFLAGS y la dirección de retorno de la pila.

Cada una de las instrucciones INT n, INTO y INT3 genera una excepción de protección general (#GP) si el CPL es mayor que el valor DPL en el descriptor de puerta seleccionado en el IDT. En cambio, la instrucción INT1 puede ofrecer un #DB incluso si el CPL es mayor que el DPL de descriptor 1 en el IDT. (Este comportamiento apoya el uso de INT1 por proveedores de hardware que realizan depuración de hardware.)

El vector especifica un descriptor interrumpido en la tabla de descriptor interrumpido (IDT); es decir, proporciona índice en el IDT. El descriptor interrumpido seleccionado a su vez contiene un puntero a un procedimiento de interrupción o excepción. En modo protegido, el IDT contiene una serie de descriptores de 8 bytes, cada uno de los cuales es una puerta de interrupción, puerta trampa, o puerta de tarea. En modo de direccion real, el IDT es una serie de punteros de 4 bytes de código de 2 bytes selector de segmento y un puntero de instruccion de 2 bytes, cada uno de los cuales apunta directamente a un procedimiento en el segmento seleccionado. (Nota que en modo de direccion real, el IDT se llama la mesa vectorial interrumpida, y sus punteros se llaman vectores interrumpidos.)

En el cuadro de decisión que figura a continuación se indica qué medidas se adoptan en la parte inferior del cuadro teniendo en cuenta las condiciones en la parte superior del cuadro. Cada Y en la sección inferior de la tabla de decisiones representa un procedimiento definido en la sección "Operación" para esta instrucción (excepto #GP).

** Tabla de decisión**

| PE | 0 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| VM |  |  |  |  | 0 | 1 | 1 |  |
| IOPL |  |  |  |  |  | <3 | =3 |  |

## Operación

```text
The following operational description applies not only to the INT n, INTO, INT3, or INT1 instructions, but also to the
delivery of external interrupts, nonmaskable interrupts (NMIs), and exceptions. Some of these events push onto
the stack an error code.

The operational description specifies numerous checks whose failure may result in delivery of a nested exception.
In these cases, the original event is not delivered.

The operational description specifies the error code delivered by any nested exception. In some cases, the error
code is specified with a pseudofunction error_code(num,idt,ext), where idt and ext are bit values. The pseudofunc-
tion produces an error code as follows: (1) if idt is 0, the error code is (num & FCH) | ext; (2) if idt is 1, the error
code is (num << 3) | 2 | ext.

In many cases, the pseudofunction error_code is invoked with a pseudovariable EXT. The value of EXT depends on
the nature of the event whose delivery encountered a nested exception: if that event is a software interrupt (INT n,
INT3, or INTO), EXT is 0; otherwise (including INT1), EXT is 1.

IF PE = 0

    THEN
          GOTO REAL-ADDRESS-MODE;

   ELSE (* PE = 1 *)
        IF (EFLAGS.VM = 1 AND CR4.VME = 0 AND IOPL < 3 AND INT n)

                THEN
                       #GP(0); (* Bit 0 of error code is 0 because INT n *)

                ELSE
                      IF (EFLAGS.VM = 1 AND CR4.VME = 1 AND INT n)
                            THEN
                                  Consult bit n of the software interrupt redirection bit map in the TSS;
                                  IF bit n is clear
                                        THEN (* redirect interrupt to 8086 program interrupt handler *)
                                              Push EFLAGS[15:0]; (* if IOPL < 3, save VIF in IF position and save IOPL position as 3 *)
                                              Push CS;
                                              Push IP;
                                              IF IOPL = 3


                                                     THEN IF := 0; (* Clear interrupt flag *)
                                                     ELSE VIF := 0; (* Clear virtual interrupt flag *)
                                              FI;
                                              TF := 0; (* Clear trap flag *)
                                              load CS and EIP (lower 16 bits only) from entry n in interrupt vector table referenced from TSS;
                                        ELSE
                                              IF IOPL = 3
                                                     THEN GOTO PROTECTED-MODE;
                                                     ELSE #GP(0); (* Bit 0 of error code is 0 because INT n *)
                                              FI;
                                  FI;
                            ELSE (* Protected mode, IA-32e mode, or virtual-8086 mode interrupt *)

                            IF (IA32_EFER.LMA = 0)

                                        THEN (* Protected mode, or virtual-8086 mode interrupt *)
                                              GOTO PROTECTED-MODE;

                                        ELSE (* IA-32e mode interrupt *)
                                        GOTO IA-32e-MODE;
                                  FI;
                      FI;
          FI;
FI;
REAL-ADDRESS-MODE:
    IF ((vector_number << 2) + 3) is not within IDT limit
          THEN #GP; FI;
    IF stack not large enough for a 6-byte return information
          THEN #SS; FI;
    Push (EFLAGS[15:0]);
    IF := 0; (* Clear interrupt flag *)
    TF := 0; (* Clear trap flag *)
    AC := 0; (* Clear AC flag *)
    Push(CS);
    Push(IP);
    (* No error codes are pushed in real-address mode*)
    CS := IDT(Descriptor (vector_number << 2), selector));
    EIP := IDT(Descriptor (vector_number << 2), offset)); (* 16 bit offset AND 0000FFFFH *)
END;

PROTECTED-MODE:
    IF ((vector_number << 3) + 7) is not within IDT limits
    or selected IDT descriptor is not an interrupt-, trap-, or task-gate type
          THEN #GP(error_code(vector_number,1,EXT)); FI;
          (* idt operand to error_code set because vector is used *)
    IF software interrupt (* Generated by INT n, INT3, or INTO; does not apply to INT1 *)
          THEN
                IF gate DPL < CPL (* PE = 1, DPL < CPL, software interrupt *)
                      THEN #GP(error_code(vector_number,1,0)); FI;
                      (* idt operand to error_code set because vector is used *)
                      (* ext operand to error_code is 0 because INT n, INT3, or INTO*)
    FI;
    IF gate not present
          THEN #NP(error_code(vector_number,1,EXT)); FI;
          (* idt operand to error_code set because vector is used *)
    IF task gate (* Specified in the selected interrupt table descriptor *)
          THEN GOTO TASK-GATE;


          ELSE GOTO TRAP-OR-INTERRUPT-GATE; (* PE = 1, trap/interrupt gate *)
    FI;
END;

IA-32e-MODE:
    IF INTO and CS.L = 1 (64-bit mode)
          THEN #UD;
    FI;
    IF CR4.FRED = 0
          THEN
                IF ((vector_number << 4) + 15) is not in IDT limits
                or selected IDT descriptor is not an interrupt-, or trap-gate type
                       THEN #GP(error_code(vector_number,1,EXT));
                       (* idt operand to error_code set because vector is used *)
                FI;
                IF software interrupt (* Generated by INT n, INT3, or INTO; does not apply to INT1 *)
                       THEN
                             IF gate DPL < CPL (* PE = 1, DPL < CPL, software interrupt *)
                                   THEN #GP(error_code(vector_number,1,0));
                                   (* idt operand to error_code set because vector is used *)
                                   (* ext operand to error_code is 0 because INT n, INT3, or INTO*)
                             FI;
                FI;
                IF gate not present
                       THEN #NP(error_code(vector_number,1,EXT));
                       (* idt operand to error_code set because vector is used *)
                FI;
                GOTO TRAP-OR-INTERRUPT-GATE; (* Trap/interrupt gate *)
          ELSE (* CR4.FRED = 1 *)
                FRED event delivery of software interrupt, exception, hardware interrupt, or non-maskable interrupt;

END;

TASK-GATE: (* PE = 1, task gate *)
    Read TSS selector in task gate (IDT descriptor);
          IF local/global bit is set to local or index not within GDT limits
                THEN #GP(error_code(TSS selector,0,EXT)); FI;
                (* idt operand to error_code is 0 because selector is used *)
          Access TSS descriptor in GDT;
          IF TSS descriptor specifies that the TSS is busy (low-order 5 bits set to 00001)
                THEN #GP(error_code(TSS selector,0,EXT)); FI;
                (* idt operand to error_code is 0 because selector is used *)
          IF TSS not present
                THEN #NP(error_code(TSS selector,0,EXT)); FI;
                (* idt operand to error_code is 0 because selector is used *)
    SWITCH-TASKS (with nesting) to TSS;
    IF interrupt caused by fault with error code
          THEN
                IF stack limit does not allow push of error code
                       THEN #SS(EXT); FI;
                Push(error code);
    FI;
    IF EIP not within code segment limit
          THEN #GP(EXT); FI;

END;


TRAP-OR-INTERRUPT-GATE:
    Read new code-segment selector for trap or interrupt gate (IDT descriptor);
    IF new code-segment selector is NULL
          THEN #GP(EXT); FI; (* Error code contains NULL selector *)
    IF new code-segment selector is not within its descriptor table limits
          THEN #GP(error_code(new code-segment selector,0,EXT)); FI;
          (* idt operand to error_code is 0 because selector is used *)
    Read descriptor referenced by new code-segment selector;
    IF descriptor does not indicate a code segment or new code-segment DPL > CPL
          THEN #GP(error_code(new code-segment selector,0,EXT)); FI;
          (* idt operand to error_code is 0 because selector is used *)
    IF new code-segment descriptor is not present,
          THEN #NP(error_code(new code-segment selector,0,EXT)); FI;
          (* idt operand to error_code is 0 because selector is used *)
    IF new code segment is non-conforming with DPL < CPL
          THEN
                IF VM = 0
                       THEN
                             GOTO INTER-PRIVILEGE-LEVEL-INTERRUPT;
                             (* PE = 1, VM = 0, interrupt or trap gate, nonconforming code segment,
                             DPL < CPL *)
                       ELSE (* VM = 1 *)

                       IF new code-segment DPL  0

                                   THEN #GP(error_code(new code-segment selector,0,EXT));
                                   (* idt operand to error_code is 0 because selector is used *)
                             GOTO INTERRUPT-FROM-VIRTUAL-8086-MODE; FI;
                             (* PE = 1, interrupt or trap gate, DPL < CPL, VM = 1 *)
                FI;
          ELSE (* PE = 1, interrupt or trap gate, DPL  CPL *)
                IF VM = 1
                       THEN #GP(error_code(new code-segment selector,0,EXT));
                       (* idt operand to error_code is 0 because selector is used *)
                IF new code segment is conforming or new code-segment DPL = CPL
                       THEN
                             GOTO INTRA-PRIVILEGE-LEVEL-INTERRUPT;
                       ELSE (* PE = 1, interrupt or trap gate, nonconforming code segment, DPL > CPL *)
                             #GP(error_code(new code-segment selector,0,EXT));
                             (* idt operand to error_code is 0 because selector is used *)
                FI;
    FI;
END;

INTER-PRIVILEGE-LEVEL-INTERRUPT:
    (* PE = 1, interrupt or trap gate, non-conforming code segment, DPL < CPL *)
    IF (IA32_EFER.LMA = 0) (* Not IA-32e mode *)
          THEN
          (* Identify stack-segment selector for new privilege level in current TSS *)
                IF current TSS is 32-bit
                       THEN
                             TSSstackAddress := (new code-segment DPL << 3) + 4;
                             IF (TSSstackAddress + 5) > current TSS limit
                                   THEN #TS(error_code(current TSS selector,0,EXT)); FI;
                                   (* idt operand to error_code is 0 because selector is used *)


                             NewSS := 2 bytes loaded from (TSS base + TSSstackAddress + 4);
                             NewESP := 4 bytes loaded from (TSS base + TSSstackAddress);
                       ELSE (* current TSS is 16-bit *)
                             TSSstackAddress := (new code-segment DPL << 2) + 2
                             IF (TSSstackAddress + 3) > current TSS limit

                                   THEN #TS(error_code(current TSS selector,0,EXT)); FI;
                                   (* idt operand to error_code is 0 because selector is used *)
                             NewSS := 2 bytes loaded from (TSS base + TSSstackAddress + 2);
                             NewESP := 2 bytes loaded from (TSS base + TSSstackAddress);
                FI;
                IF NewSS is NULL
                       THEN #TS(EXT); FI;
                IF NewSS index is not within its descriptor-table limits

             or NewSS RPL  new code-segment DPL

                       THEN #TS(error_code(NewSS,0,EXT)); FI;
                       (* idt operand to error_code is 0 because selector is used *)
                Read new stack-segment descriptor for NewSS in GDT or LDT;

             IF new stack-segment DPL  new code-segment DPL

                or new stack-segment Type does not indicate writable data segment
                       THEN #TS(error_code(NewSS,0,EXT)); FI;
                       (* idt operand to error_code is 0 because selector is used *)

                IF NewSS is not present
                       THEN #SS(error_code(NewSS,0,EXT)); FI;
                       (* idt operand to error_code is 0 because selector is used *)
                       NewSSP := IA32_PLi_SSP (* where i = new code-segment DPL *)

          ELSE (* IA-32e mode *)
                IF IDT-gate IST = 0
                       THEN TSSstackAddress := (new code-segment DPL << 3) + 4;
                       ELSE TSSstackAddress := (IDT gate IST << 3) + 28;
                FI;
                IF (TSSstackAddress + 7) > current TSS limit
                       THEN #TS(error_code(current TSS selector,0,EXT); FI;
                       (* idt operand to error_code is 0 because selector is used *)
                NewRSP := 8 bytes loaded from (current TSS base + TSSstackAddress);
                NewSS := new code-segment DPL; (* NULL selector with RPL = new CPL *)
                IF IDT-gate IST = 0
                       THEN
                             NewSSP := IA32_PLi_SSP (* where i = new code-segment DPL *)
                       ELSE
                             NewSSPAddress = IA32_INTERRUPT_SSP_TABLE_ADDR + (IDT-gate IST << 3)
                             (* Check if shadow stacks are enabled at CPL 0 *)
                             IF ShadowStackEnabled(CPL 0)
                                   THEN NewSSP := 8 bytes loaded from NewSSPAddress; FI;
                FI;

    FI;
    IF IDT gate is 32-bit

                THEN
                       IF new stack does not have room for 24 bytes (error code pushed)
                       or 20 bytes (no error code pushed)
                             THEN #SS(error_code(NewSS,0,EXT)); FI;
                             (* idt operand to error_code is 0 because selector is used *)

                FI
          ELSE

                IF IDT gate is 16-bit


                       THEN
                             IF new stack does not have room for 12 bytes (error code pushed)
                             or 10 bytes (no error code pushed);
                                   THEN #SS(error_code(NewSS,0,EXT)); FI;
                                   (* idt operand to error_code is 0 because selector is used *)

                ELSE (* 64-bit IDT gate*)
                       IF StackAddress is non-canonical
                             THEN #SS(EXT); FI; (* Error code contains NULL selector *)

          FI;
    FI;
    IF (IA32_EFER.LMA = 0) (* Not IA-32e mode *)

          THEN
                IF instruction pointer from IDT gate is not within new code-segment limits
                       THEN #GP(EXT); FI; (* Error code contains NULL selector *)
                ESP := NewESP;
                SS := NewSS; (* Segment descriptor information also loaded *)

          ELSE (* IA-32e mode *)
                IF instruction pointer from IDT gate contains a non-canonical address
                       THEN #GP(EXT); FI; (* Error code contains NULL selector *)
                RSP := NewRSP & FFFFFFFFFFFFFFF0H;
                SS := NewSS;

    FI;
    IF IDT gate is 32-bit

          THEN
                CS:EIP := Gate(CS:EIP); (* Segment descriptor information also loaded *)

          ELSE
                IF IDT gate 16-bit
                       THEN
                             CS:IP := Gate(CS:IP);
                             (* Segment descriptor information also loaded *)
                       ELSE (* 64-bit IDT gate *)
                             CS:RIP := Gate(CS:RIP);
                             (* Segment descriptor information also loaded *)
                FI;

    FI;
    IF IDT gate is 32-bit

                THEN
                       Push(far pointer to old stack);
                       (* Old SS and ESP, 3 words padded to 4 *)
                       Push(EFLAGS);
                       Push(far pointer to return instruction);
                       (* Old CS and EIP, 3 words padded to 4 *)
                       Push(ErrorCode); (* If needed, 4 bytes *)

                ELSE
                       IF IDT gate 16-bit
                             THEN
                                   Push(far pointer to old stack);
                                   (* Old SS and SP, 2 words *)
                                   Push(EFLAGS(15:0]);
                                   Push(far pointer to return instruction);
                                   (* Old CS and IP, 2 words *)
                                   Push(ErrorCode); (* If needed, 2 bytes *)
                             ELSE (* 64-bit IDT gate *)
                                   Push(far pointer to old stack);


                          (* Old SS and SP, each an 8-byte push *)

                          Push(RFLAGS); (* 8-byte push *)

                          Push(far pointer to return instruction);

                          (* Old CS and RIP, each an 8-byte push *)

                          Push(ErrorCode); (* If needed, 8-bytes *)

           FI;

FI;

IF ShadowStackEnabled(CPL) AND CPL = 3

      THEN

           IF IA32_EFER.LMA = 0

                THEN IA32_PL3_SSP := SSP;

                ELSE (* adjust so bits 63:N get the value of bit N1, where N is the CPU's maximum linear-address width *)

                     IA32_PL3_SSP := LA_adjust(SSP);

           FI;

FI;

CPL := new code-segment DPL;

CS(RPL) := CPL;

IF ShadowStackEnabled(CPL)

      oldSSP := SSP

      SSP := NewSSP

      IF SSP & 0x07 != 0

           THEN #GP(0); FI;

      (* Token and CS:LIP:oldSSP pushed on shadow stack must be contained in a naturally aligned 32-byte region *)

      IF (SSP & ~0x1F) != ((SSP  24) & ~0x1F)

           #GP(0); FI;

      IF ((IA32_EFER.LMA and CS.L) = 0 AND SSP[63:32] != 0)

           THEN #GP(0); FI;

      expected_token_value = SSP                   (* busy bit - bit position 0 - must be clear *)

      new_token_value = SSP | BUSY_BIT             (* Set the busy bit *)

      IF shadow_stack_lock_cmpxchg8b(SSP, new_token_value, expected_token_value) != expected_token_value

           THEN #GP(0); FI;

      IF oldSS.DPL != 3

           ShadowStackPush8B(oldCS); (* Padded with 48 high-order bits of 0 *)

           ShadowStackPush8B(oldCSBASE + oldRIP); (* Padded with 32 high-order bits of 0 for 32 bit LIP*)

           ShadowStackPush8B(oldSSP);

      FI;

FI;

IF EndbranchEnabled (CPL)

      IA32_S_CET.TRACKER = WAIT_FOR_ENDBRANCH;

      IA32_S_CET.SUPPRESS = 0

FI;

IF IDT gate is interrupt gate

      THEN IF := 0 (* Interrupt flag set to 0, interrupts disabled *); FI;

TF := 0;

VM := 0;

RF := 0;

NT := 0;

END;

INTERRUPT-FROM-VIRTUAL-8086-MODE:
    (* Identify stack-segment selector for privilege level 0 in current TSS *)
    IF current TSS is 32-bit
          THEN
                IF TSS limit < 9


                       THEN #TS(error_code(current TSS selector,0,EXT)); FI;
                       (* idt operand to error_code is 0 because selector is used *)
                NewSS := 2 bytes loaded from (current TSS base + 8);
                NewESP := 4 bytes loaded from (current TSS base + 4);
          ELSE (* current TSS is 16-bit *)
                IF TSS limit < 5
                       THEN #TS(error_code(current TSS selector,0,EXT)); FI;
                       (* idt operand to error_code is 0 because selector is used *)
                NewSS := 2 bytes loaded from (current TSS base + 4);
                NewESP := 2 bytes loaded from (current TSS base + 2);
    FI;
    IF NewSS is NULL
          THEN #TS(EXT); FI; (* Error code contains NULL selector *)
    IF NewSS index is not within its descriptor table limits

   or NewSS RPL  0

          THEN #TS(error_code(NewSS,0,EXT)); FI;
          (* idt operand to error_code is 0 because selector is used *)
    Read new stack-segment descriptor for NewSS in GDT or LDT;

   IF new stack-segment DPL  0 or stack segment does not indicate writable data segment

          THEN #TS(error_code(NewSS,0,EXT)); FI;
          (* idt operand to error_code is 0 because selector is used *)
    IF new stack segment not present
          THEN #SS(error_code(NewSS,0,EXT)); FI;
          (* idt operand to error_code is 0 because selector is used *)
    NewSSP := IA32_PL0_SSP (* the new code-segment DPL must be 0 *)
    IF IDT gate is 32-bit
          THEN

                IF new stack does not have room for 40 bytes (error code pushed)
                or 36 bytes (no error code pushed)

                       THEN #SS(error_code(NewSS,0,EXT)); FI;
                       (* idt operand to error_code is 0 because selector is used *)
          ELSE (* IDT gate is 16-bit)
                IF new stack does not have room for 20 bytes (error code pushed)
                or 18 bytes (no error code pushed)
                       THEN #SS(error_code(NewSS,0,EXT)); FI;
                       (* idt operand to error_code is 0 because selector is used *)
    FI;
    IF instruction pointer from IDT gate is not within new code-segment limits
          THEN #GP(EXT); FI; (* Error code contains NULL selector *)
    tempEFLAGS := EFLAGS;
    VM := 0;
    TF := 0;
    RF := 0;
    NT := 0;
    IF service through interrupt gate
          THEN IF = 0; FI;
    TempSS := SS;
    TempESP := ESP;
    SS := NewSS;
    ESP := NewESP;
    (* Following pushes are 16 bits for 16-bit IDT gates and 32 bits for 32-bit IDT gates;
    Segment selector pushes in 32-bit mode are padded to two words *)
    Push(GS);
    Push(FS);


    Push(DS);
    Push(ES);
    Push(TempSS);
    Push(TempESP);
    Push(TempEFlags);
    Push(CS);
    Push(EIP);
    GS := 0; (* Segment registers made NULL, invalid for use in protected mode *)
    FS := 0;
    DS := 0;
    ES := 0;
    CS := Gate(CS); (* Segment descriptor information also loaded *)
    CS(RPL) := 0;
    CPL := 0;
    IF IDT gate is 32-bit

          THEN
                EIP := Gate(instruction pointer);

          ELSE (* IDT gate is 16-bit *)
                EIP := Gate(instruction pointer) AND 0000FFFFH;

    FI;
    IF ShadowStackEnabled(0)

          oldSSP := SSP
          SSP := NewSSP
          IF SSP & 0x07 != 0

                THEN #GP(0); FI;
          (* Token and CS:LIP:oldSSP pushed on shadow stack must be contained in a naturally aligned 32-byte region *)

        IF (SSP & ~0x1F) != ((SSP  24) & ~0x1F)

                #GP(0); FI;
    IF ((IA32_EFER.LMA and CS.L) = 0 AND SSP[63:32] != 0)

          THEN #GP(0); FI;
    expected_token_value = SSP (* busy bit - bit position 0 - must be clear *)
    new_token_value = SSP | BUSY_BIT (* Set the busy bit *)
    IF shadow_stack_lock_cmpxchg8b(SSP, new_token_value, expected_token_value) != expected_token_value

          THEN #GP(0); FI;
    FI;
    IF EndbranchEnabled (CPL)

          IA32_S_CET.TRACKER = WAIT_FOR_ENDBRANCH;
          IA32_S_CET.SUPPRESS = 0
    FI;
(* Start execution of new routine in Protected Mode *)
END;

INTRA-PRIVILEGE-LEVEL-INTERRUPT:
    NewSSP = SSP;
    CHECK_SS_TOKEN = 0
    (* PE = 1, DPL = CPL or conforming segment *)
    IF IA32_EFER.LMA = 1 (* IA-32e mode *)
          IF IDT-descriptor IST  0
                THEN
                      TSSstackAddress := (IDT-descriptor IST << 3) + 28;
                      IF (TSSstackAddress + 7) > TSS limit
                            THEN #TS(error_code(current TSS selector,0,EXT)); FI;
                            (* idt operand to error_code is 0 because selector is used *)
                      NewRSP := 8 bytes loaded from (current TSS base + TSSstackAddress);


                ELSE NewRSP := RSP;
          FI;
          IF IDT-descriptor IST  0

                IF ShadowStackEnabled(CPL)
                       THEN
                             NewSSPAddress = IA32_INTERRUPT_SSP_TABLE_ADDR + (IDT gate IST << 3)
                             NewSSP := 8 bytes loaded from NewSSPAddress
                             CHECK_SS_TOKEN = 1

                FI;
          FI;
    FI;
    IF 32-bit gate (* implies IA32_EFER.LMA = 0 *)
          THEN

                IF current stack does not have room for 16 bytes (error code pushed)
                or 12 bytes (no error code pushed)

                       THEN #SS(EXT); FI; (* Error code contains NULL selector *)
          ELSE IF 16-bit gate (* implies IA32_EFER.LMA = 0 *)

                IF current stack does not have room for 8 bytes (error code pushed)
                or 6 bytes (no error code pushed)

                       THEN #SS(EXT); FI; (* Error code contains NULL selector *)
          ELSE (* IA32_EFER.LMA = 1, 64-bit gate*)

                       IF NewRSP contains a non-canonical address
                             THEN #SS(EXT); (* Error code contains NULL selector *)

          FI;
    FI;
    IF (IA32_EFER.LMA = 0) (* Not IA-32e mode *)

          THEN
                IF instruction pointer from IDT gate is not within new code-segment limit
                       THEN #GP(EXT); FI; (* Error code contains NULL selector *)

          ELSE
                IF instruction pointer from IDT gate contains a non-canonical address
                       THEN #GP(EXT); FI; (* Error code contains NULL selector *)
                RSP := NewRSP & FFFFFFFFFFFFFFF0H;

    FI;
    IF IDT gate is 32-bit (* implies IA32_EFER.LMA = 0 *)

          THEN
                Push (EFLAGS);
                Push (far pointer to return instruction); (* 3 words padded to 4 *)
                CS:EIP := Gate(CS:EIP); (* Segment descriptor information also loaded *)
                Push (ErrorCode); (* If any *)

          ELSE
                IF IDT gate is 16-bit (* implies IA32_EFER.LMA = 0 *)
                       THEN
                             Push (FLAGS);
                             Push (far pointer to return location); (* 2 words *)
                             CS:IP := Gate(CS:IP);
                             (* Segment descriptor information also loaded *)
                             Push (ErrorCode); (* If any *)
                       ELSE (* IA32_EFER.LMA = 1, 64-bit gate*)
                             Push(far pointer to old stack);
                             (* Old SS and SP, each an 8-byte push *)
                             Push(RFLAGS); (* 8-byte push *)
                             Push(far pointer to return instruction);
                             (* Old CS and RIP, each an 8-byte push *)


                            Push(ErrorCode); (* If needed, 8 bytes *)
                            CS:RIP := GATE(CS:RIP);
                            (* Segment descriptor information also loaded *)
                FI;
    FI;
    CS(RPL) := CPL;
    IF ShadowStackEnabled(CPL)
          IF CHECK_SS_TOKEN == 1
                THEN
                      IF NewSSP & 0x07 != 0
                            THEN #GP(0); FI;
          (* Token and CS:LIP:oldSSP pushed on shadow stack must be contained in a naturally aligned 32-byte region *)

        IF (NewSSP & ~0x1F) != ((NewSSP  24) & ~0x1F)

                #GP(0); FI;

                      IF ((IA32_EFER.LMA and CS.L) = 0 AND NewSSP[63:32] != 0)
                            THEN #GP(0); FI;

                      expected_token_value = NewSSP (* busy bit - bit position 0 - must be clear *)
                      new_token_value = NewSSP | BUSY_BIT (* Set the busy bit *)
                      IF shadow_stack_lock_cmpxchg8b(NewSSP, new_token_value, expected_token_value) != expected_token_value

                            THEN #GP(0); FI;
          FI;
          (* Align to next 8 byte boundary *)
          tempSSP = SSP;

       Shadow_stack_store 4 bytes of 0 to (NewSSP - 4)

          SSP = newSSP & 0xFFFFFFFFFFFFFFF8H;
          (* push cs:lip:ssp on shadow stack *)
          ShadowStackPush8B(oldCS); (* Padded with 48 high-order bits of 0 *)
          ShadowStackPush8B(oldCSBASE + oldRIP); (* Padded with 32 high-order bits of 0 for 32 bit LIP*)
          ShadowStackPush8B(tempSSP);
    FI;
    IF EndbranchEnabled (CPL)
          IF CPL = 3

                THEN
                      IA32_U_CET.TRACKER = WAIT_FOR_ENDBRANCH
                      IA32_U_CET.SUPPRESS = 0

                ELSE
                      IA32_S_CET.TRACKER = WAIT_FOR_ENDBRANCH
                      IA32_S_CET.SUPPRESS = 0

          FI;
    FI;
    IF IDT gate is interrupt gate

          THEN IF := 0; FI; (* Interrupt flag set to 0; interrupts disabled *)
    TF := 0;
    NT := 0;
    VM := 0;
    RF := 0;
END;
```

## Banderas afectadas

El registro EFLAGS es empujado a la pila. Las banderas IF, TF, NT, AC, RF y VM pueden ser limpiadas, dependiendo de

el modo de funcionamiento del procesador cuando se ejecuta la instrucción INT (ver la sección "Operación"). Si

interrumpir utiliza una puerta de tarea, cualquier bandera puede ser fijada o limpiada, controlada por la imagen EFLAGS de la nueva tarea TSS.
