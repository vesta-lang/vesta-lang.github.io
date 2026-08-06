---
summary: Salto
---

## Descripción

Transfiere el control del programa a un punto diferente en la secuencia de instrucciones sin grabar información de retorno. El destino (target) operando especifica la dirección de la instrucción a la que se salta. Este operando puede ser un valor inmediato, un registro de proposito general, o una ubicación de memoria.

Esta instrucción se puede utilizar para ejecutar cuatro tipos diferentes de saltos:

* Cerca de salto - Un salto a una instrucción dentro del segmento de código actual (el segmento actualmente apuntado por el

Registro de CS), a veces referido como un salto intrasegment.

* Salto corto - Un salto cerca donde el rango de saltos se limita a 128 a +127 del valor actual EIP. * Salto lejano: Un salto a una instrucción situada en un segmento diferente al segmento de código actual pero en el

mismo nivel de privilegios, a veces referido como un salto de intersección.

* Interruptor de tareas - Un salto a una instrucción ubicada en una tarea diferente.

Un interruptor de tarea sólo puede ejecutarse en modo protegido (ver Capítulo 10, en el Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 3A, para información sobre el funcionamiento de los interruptores de tareas con la instrucción JMP).

Saltos cercanos y cortos. Al ejecutar un salto cerca, el procesador salta a la dirección (dentro del segmento de código actual) que se especifica con el objetivo operando. El objetivo operando especifica una compensación absoluta (que es una compensación de la base del segmento de código) o una compensación relativa (un desplazamiento firmado en relación con el actual

valor del puntero de instruccion en el registro EIP). Un salto cercano a una compensación relativa de 8 bits (rel8) se denomina un salto corto. El registro CS no se cambia en saltos cercanos y cortos.

Un offset absoluto se especifica indirectamente en un registro de proposito general o una ubicación de memoria (r/m16 o r/m32). El atributo el operando-size determina el tamaño del objetivo operando (16 o 32 bits). Los offsets absolutos se cargan directamente en el registro EIP. Si el atributo el operando-size es 16, los dos bytes superiores del registro EIP se limpian, dando como resultado un tamaño máximo puntero de instruccion de 16 bits.

Un offset relativo (rel8, rel16 o rel32) se especifica generalmente como una etiqueta en código de montaje, pero a nivel de código de máquina, se codifica como un valor inmediato firmado de 8, 16 o 32 bits. Este valor se añade al valor del registro EIP. (Aquí, el registro EIP contiene la dirección de la instrucción siguiendo la instrucción JMP). Al utilizar offsets relativos, el código de operación (para saltos cortos vs. cercanos) y el atributo el operando-size (para saltos relativos cercanos) determina el tamaño del objetivo operando (8, 16 o 32 bits).

Extremo Salta en Real-Address o modo virtual-8086. Al ejecutar un salto lejano en dirección real o modo virtual-8086, el procesador salta al segmento de código y se compensa con el objetivo operando. Aquí el objetivo operando especifica una dirección absoluta directa con un puntero (ptr16:16 o ptr16:32) o indirectamente con una ubicación de memoria (m16:16 o m16:32). Con el método puntero, el segmento y la dirección del procedimiento llamado se codifica en la instrucción, utilizando una dirección de 4 bytes (16-bit tamaño de operando) o 6-byte (32-bit tamaño de operando) de lejos inmediata. Con el método indirecto, el objetivo operando especifica una ubicación de memoria que contiene una dirección de 4 bytes (16-bit tamaño de operando) o 6-byte (32-bit tamaño de operando). La dirección está cargada directamente en los registros CS y EIP. Si el atributo el operando-size es 16, los dos bytes superiores del registro EIP se limpian.

Far Jumps en modo protegido. Cuando el procesador está operando en modo protegido, la instrucción JMP se puede utilizar para realizar los siguientes tres tipos de saltos lejanos:

* Un salto lejano a un segmento de código conformante o no conforme. * Un salto lejano a través de una puerta de llamada. * Un interruptor de tarea.

(La instrucción JMP no se puede utilizar para realizar saltos de distancia de nivel intermedio.)

En modo protegido, el procesador siempre utiliza la parte el selector de segmento de la dirección remota para acceder al descriptor correspondiente en el GDT o LDT. El tipo de descriptor (segmento de código, puerta de llamada, puerta de tarea, o TSS) y los derechos de acceso determinan el tipo de salto a realizar.

Si el descriptor seleccionado es para un segmento de código, se realiza un salto lejano a un segmento de código al mismo nivel de privilegios. (Si el segmento de código seleccionado está a un nivel de privilegio diferente y el segmento de código no está conformando, se genera una excepción de protección general.) Un salto lejano al mismo nivel de privilegios en modo protegido es muy similar a uno realizado en dirección real o modo virtual-8086. El objetivo operando especifica una dirección absoluta directa con un puntero (ptr16:16 o ptr16:32) o indirectamente con una ubicación de memoria (m16:16 o m16:32). El atributo el operando-size determina el tamaño del offset (16 o 32 bits) en la dirección remota. El nuevo código selector de segmento y su descriptor se cargan en el registro CS, y el offset de la instrucción se carga en el registro EIP. Tenga en cuenta que una puerta de llamada (descrita en el párrafo siguiente) también se puede utilizar para realizar una llamada a un segmento de código al mismo nivel de privilegios. El uso de este mecanismo proporciona un nivel adicional de indirectidad y es el método preferido de hacer saltos entre segmentos de código de 16 bits y 32 bits.

Al ejecutar un salto lejano a través de una puerta de llamada, el selector de segmento especificado por el objetivo operando identifica la puerta de llamada. (La parte offset del objetivo operando es ignorada.) El procesador luego salta al segmento de código especificado en el descriptor de la puerta de llamada y comienza a ejecutar la instrucción en el offset especificado en la puerta de llamada. No se produce ningún interruptor de pila. Aquí nuevamente, el objetivo operando puede especificar la dirección de la puerta de llamada directamente con un puntero (ptr16:16 o ptr16:32) o indirectamente con una ubicación de memoria (m16:16 o m16:32).

Ejecutar un interruptor de tarea con la instrucción JMP es algo similar a ejecutar un salto a través de una puerta de llamada. Aquí el objetivo operando especifica el selector de segmento de la puerta de tarea para la tarea que se está cambiando a (y se ignora la parte offset del objetivo operando). La puerta de tarea a su vez apunta al TSS para la tarea, que contiene los selectores del segmento para el código de la tarea y los segmentos de la pila. El TSS también contiene el valor EIP para la siguiente instrucción que debía ejecutarse antes de que se suspendiera la tarea. Este valor puntero de instruccion se carga en el registro EIP para que la tarea comience a ejecutar de nuevo en esta siguiente instrucción.

La instrucción JMP también puede especificar el selector de segmento del TSS directamente, que elimina la indirecta de la puerta de tarea. Ver Capítulo 10 en Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 3A, para información detallada sobre la mecánica de un interruptor de tarea.

Cuando la ejecución de una instrucción JMP afecta a un interruptor de tarea, la bandera de tarea anidada (NT) no se establece en el registro EFLAGS y el nuevo campo de enlace de tareas anterior de TSS no se carga con el selector TSS de la antigua tarea. Por lo tanto, el regreso a la tarea anterior no puede llevarse a cabo ejecutando la instrucción IRET. Las tareas de cambio con la instrucción JMP difieren a este respecto de la instrucción CALL que establece la bandera NT y guarda la información de enlace de tarea anterior, permitiendo un retorno a la tarea de llamada con una instrucción IRET.

Consulte el capítulo 6, "Procedure Calls, Interrupts, and Excepcionions" y el capítulo 18, "Control-flow Enforcement Technology (CET)" en el manual de desarrollo de software de arquitecturas Intel(R) 64 e IA-32, Volumen 1, para detalles CET.

En modo 64-Bit. El tamaño de la operación de la instrucción se fija en 64 bits. Si un selector apunta a una puerta, entonces RIP iguala el desplazamiento de 64 bits tomado de la puerta; de lo contrario RIP iguala la compensación de cero-extended del puntero lejano referenciado en la instrucción.

Cuando las transiciones FRED están habilitadas, una ejecución de JMP lejano que hace referencia a una puerta de llamada causa una excepción de protección general, al igual que una ejecución de JMP lejano que entraría en modo de compatibilidad cuando CPL es 0.

Vea la tabla resumen al comienzo de esta sección para la codificación de datos y límites.

Ordenación de instrucciones. Las instrucciones después de un salto lejano pueden ser arrebatadas de la memoria antes de que las instrucciones anteriores completen la ejecución, pero no ejecutarán (incluso especulativamente) hasta que todas las instrucciones anteriores al salto lejano hayan completado la ejecución (las instrucciones posteriores pueden ejecutarse antes de que los datos almacenados por las instrucciones anteriores se hayan vuelto mundialmente visibles).

Las instrucciones secuencialmente siguiendo una instrucción casi indirecta JMP (es decir, las que no están en el objetivo) pueden ser ejecutadas especulativamente. Si el software necesita prevenir esto (por ejemplo, para prevenir un canal lateral de ejecución especulativa), entonces una instrucción INT3 o LFENCE código de operación puede ser colocado después de la JMP indirecta cercana para bloquear la ejecución especulativa.

## Operación

```text
IF near jump
    IF 64-bit Mode
          THEN
                IF near relative jump
                 THEN
                      tempRIP := RIP + DEST; (* RIP is instruction following JMP instruction*)
                 ELSE (* Near absolute jump *)
                      tempRIP := DEST;
                FI;
          ELSE
                IF near relative jump
                 THEN
                      tempEIP := EIP + DEST; (* EIP is instruction following JMP instruction*)
                 ELSE (* Near absolute jump *)
                      tempEIP := DEST;
                FI;
    FI;

   IF (IA32_EFER.LMA = 0 or target mode = Compatibility mode) and tempEIP outside code segment limit

          THEN #GP(0); FI
    IF 64-bit mode and tempRIP is not canonical

          THEN #GP(0);
    FI;

   IF OperandSize = 32

           THEN
                EIP := tempEIP;

           ELSE

             IF OperandSize = 16
                  THEN (* OperandSize = 16 *)

                            EIP := tempEIP AND 0000FFFFH;

                   ELSE (* OperandSize = 64)


                            RIP := tempRIP;
                FI;
     FI;
    IF (JMP near indirect, absolute indirect)
          IF EndbranchEnabledAndNotSuppressed(CPL)
                IF CPL = 3

                      THEN
                            IF ( no 3EH prefix OR IA32_U_CET.NO_TRACK_EN == 0 )
                                  THEN
                                        IA32_U_CET.TRACKER = WAIT_FOR_ENDBRANCH
                            FI;

                      ELSE
                            IF ( no 3EH prefix OR IA32_S_CET.NO_TRACK_EN == 0 )
                                  THEN
                                        IA32_S_CET.TRACKER = WAIT_FOR_ENDBRANCH
                            FI;

                FI;
          FI;
    FI;
FI;

IF far jump and (PE = 0 or (PE = 1 AND VM = 1)) (* Real-address or virtual-8086 mode *)

     THEN
           tempEIP := DEST(Offset); (* DEST is ptr16:32 or [m16:32] *)
           IF tempEIP is beyond code segment limit
                THEN #GP(0); FI;
           CS := DEST(segment selector); (* DEST is ptr16:32 or [m16:32] *)

         IF OperandSize = 32

                 THEN
                      EIP := tempEIP; (* DEST is ptr16:32 or [m16:32] *)

              ELSE (* OperandSize = 16 *)

                      EIP := tempEIP AND 0000FFFFH; (* Clear upper 16 bits *)
           FI;
FI;

IF far jump and (PE = 1 and VM = 0)

(* IA-32e mode or protected mode, not virtual-8086 mode *)
     THEN
           IF effective address in the CS, DS, ES, FS, GS, or SS segment is illegal or segment selector in target operand NULL
                      THEN #GP(0); FI;
           IF segment selector index not within descriptor table limits
                THEN #GP(new selector); FI;
          Read type and access rights of segment descriptor;

        IF (IA32_EFER.LMA = 0)

                THEN
                      IF segment type is not a conforming or nonconforming code segment, call gate, task gate, or TSS
                            THEN #GP(segment selector); FI;

                ELSE
                      IF segment type is not a conforming or nonconforming code segment or call gate
                            THEN #GP(segment selector); FI;

          FI;
          Depending on type and access rights:

                GO TO CONFORMING-CODE-SEGMENT;
                GO TO NONCONFORMING-CODE-SEGMENT;
                GO TO CALL-GATE;
                GO TO TASK-GATE;


                GO TO TASK-STATE-SEGMENT;
     ELSE

           #GP(segment selector);
FI;
CONFORMING-CODE-SEGMENT:

   IF L-Bit = 1 and D-BIT = 1 and IA32_EFER.LMA = 1

          THEN GP(new code segment selector); FI;
     IF DPL > CPL

          THEN #GP(segment selector); FI;
    IF CR4.FRED = 1 and CPL = 0 and L-bit = 0

          THEN GP(new code segment selector); FI;
     IF segment not present

          THEN #NP(segment selector); FI;
    tempEIP := DEST(Offset);

   IF OperandSize = 16

           THEN tempEIP := tempEIP AND 0000FFFFH;
    FI;

   IF (IA32_EFER.LMA = 0 or target mode = Compatibility mode) and

    tempEIP outside code segment limit
          THEN #GP(0); FI

    IF tempEIP is non-canonical
          THEN #GP(0); FI;

    IF ShadowStackEnabled(CPL)
          IF (IA32_EFER.LMA and DEST(segment selector).L) = 0
                (* If target is legacy or compatibility mode then the SSP must be in low 4GB *)
                IF (SSP & 0xFFFFFFFF00000000 != 0)
                       THEN #GP(0); FI;
          FI;

    FI;
    CS := DEST[segment selector]; (* Segment descriptor information also loaded *)
    CS(RPL) := CPL
    EIP := tempEIP;
    IF EndbranchEnabled(CPL)

          IF CPL = 3
                THEN
                       IA32_U_CET.TRACKER = WAIT_FOR_ENDBRANCH
                       IA32_U_CET.SUPPRESS = 0
                ELSE
                       IA32_S_CET.TRACKER = WAIT_FOR_ENDBRANCH
                       IA32_S_CET.SUPPRESS = 0

          FI;
    FI;
END;
NONCONFORMING-CODE-SEGMENT:

   IF L-Bit = 1 and D-BIT = 1 and IA32_EFER.LMA = 1

          THEN GP(new code segment selector); FI;

   IF (RPL > CPL) OR (DPL  CPL)

          THEN #GP(code segment selector); FI;
    IF CR4.FRED = 1 and CPL = 0 and L-bit = 0

          THEN GP(new code segment selector); FI;
    IF segment not present

          THEN #NP(segment selector); FI;
    tempEIP := DEST(Offset);

   IF OperandSize = 16


           THEN tempEIP := tempEIP AND 0000FFFFH; FI;

   IF (IA32_EFER.LMA = 0 OR target mode = Compatibility mode)

    and tempEIP outside code segment limit
          THEN #GP(0); FI

    IF tempEIP is non-canonical THEN #GP(0); FI;
    IF ShadowStackEnabled(CPL)

          IF (IA32_EFER.LMA and DEST(segment selector).L) = 0
                (* If target is legacy or compatibility mode then the SSP must be in low 4GB *)
                IF (SSP & 0xFFFFFFFF00000000 != 0)
                       THEN #GP(0); FI;

          FI;
    FI;
    CS := DEST[segment selector]; (* Segment descriptor information also loaded *)
    CS(RPL) := CPL;
    EIP := tempEIP;
    IF EndbranchEnabled(CPL)

          IF CPL = 3
                THEN
                       IA32_U_CET.TRACKER = WAIT_FOR_ENDBRANCH
                       IA32_U_CET.SUPPRESS = 0
                ELSE
                       IA32_S_CET.TRACKER = WAIT_FOR_ENDBRANCH
                       IA32_S_CET.SUPPRESS = 0

          FI;
    FI;
END;

CALL-GATE:
    IF call gate DPL < CPL or call gate DPL < call gate segment-selector RPL or CR4.FRED = 1
                THEN #GP(call gate selector); FI;
    IF call gate not present
          THEN #NP(call gate selector); FI;
    IF call gate code-segment selector is NULL
          THEN #GP(0); FI;
    IF call gate code-segment selector index outside descriptor table limits
          THEN #GP(code segment selector); FI;
    Read code segment descriptor;
    IF code-segment segment descriptor does not indicate a code segment
    or code-segment segment descriptor is conforming and DPL > CPL

   or code-segment segment descriptor is non-conforming and DPL  CPL

                THEN #GP(code segment selector); FI;

   IF IA32_EFER.LMA = 1 and (code-segment descriptor is not a 64-bit code segment

    or code-segment segment descriptor has both L-Bit and D-bit set)
                THEN #GP(code segment selector); FI;

    IF code segment is not present
          THEN #NP(code-segment selector); FI;

     tempEIP := DEST(Offset);

    IF GateSize = 16

           THEN tempEIP := tempEIP AND 0000FFFFH; FI;

   IF (IA32_EFER.LMA = 0 OR target mode = Compatibility mode) AND tempEIP

    outside code segment limit
          THEN #GP(0); FI

    CS := DEST[SegmentSelector]; (* Segment descriptor information also loaded *)
    CS(RPL) := CPL;


    EIP := tempEIP;
    IF EndbranchEnabled(CPL)

          IF CPL = 3
                THEN
                      IA32_U_CET.TRACKER = WAIT_FOR_ENDBRANCH;
                      IA32_U_CET.SUPPRESS = 0
                ELSE
                      IA32_S_CET.TRACKER = WAIT_FOR_ENDBRANCH;
                      IA32_S_CET.SUPPRESS = 0

          FI;
    FI;
END;
TASK-GATE:
    IF task gate DPL < CPL
    or task gate DPL < task gate segment-selector RPL

          THEN #GP(task gate selector); FI;
    IF task gate not present

          THEN #NP(gate selector); FI;
    Read the TSS segment selector in the task-gate descriptor;
    IF TSS segment selector local/global bit is set to local
    or index not within GDT limits
    or descriptor is not a TSS segment
    or TSS descriptor specifies that the TSS is busy

          THEN #GP(TSS selector); FI;
     IF TSS not present

          THEN #NP(TSS selector); FI;
     SWITCH-TASKS to TSS;
     IF EIP not within code segment limit

          THEN #GP(0); FI;
END;
TASK-STATE-SEGMENT:

    IF TSS DPL < CPL
    or TSS DPL < TSS segment-selector RPL
    or TSS descriptor indicates TSS not available

          THEN #GP(TSS selector); FI;
    IF TSS is not present

          THEN #NP(TSS selector); FI;
    SWITCH-TASKS to TSS;
    IF EIP not within code segment limit

          THEN #GP(0); FI;
END;
```

## Banderas afectadas

Todas las banderas se ven afectadas si se produce un interruptor de tarea; ninguna bandera se ve afectada si no se produce un interruptor de tarea.
