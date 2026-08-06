---
summary: Procedimiento de llamada
---

## Descripción

Guarda el procedimiento que une la información sobre la pila y las ramas al procedimiento llamado especificado utilizando el objetivo operando. El objetivo operando especifica la dirección de la primera instrucción en el procedimiento llamado. El operando puede ser un valor inmediato, un registro de proposito general, o una ubicación de memoria.

Esta instrucción se puede utilizar para ejecutar cuatro tipos de llamadas:

* Llamada a un procedimiento en el segmento actual del código (el segmento actualmente señalado por el CS)

registro), a veces referido como una llamada intrasede.

* Far Call - Una llamada a un procedimiento situado en un segmento diferente al segmento de código actual, a veces

se refiere a una llamada intersegmentaria.

* Llamada a nivel de privilegios - Un llamado a un procedimiento en un segmento a un nivel de privilegios diferente a ese

del actual programa o procedimiento de ejecución.

* Interruptor de tareas - Una llamada a un procedimiento situado en una tarea diferente.

Estos últimos dos tipos de llamadas (llamadas de nivel intermedio y conmutador de tareas) sólo pueden ejecutarse en modo protegido. Ver "Procedimientos de llamada usando Call y RET" en el capítulo 6 de Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1, para obtener información adicional sobre llamadas cercanas, lejanas y de nivel intermedio. Vea el capítulo 10, "Manejo de clics", en el Manual de Software de Arquitecturas Intel(R) 64 e IA-32, Volumen 3A, para obtener información sobre el desempeño de los conmutadores de tareas con la instrucción CALL.

Cerca de Call. Al ejecutar una llamada cercana, el procesador empuja el valor del registro EIP (que contiene la compensación de la instrucción después de la instrucción CALL) en la pila (para uso posterior como un retorno-puntero de instruccion). El procesador luego se ramifica a la dirección en el segmento de código actual especificado por el objetivo operando. El objetivo operando especifica una compensación absoluta en el segmento de código (una compensación de la base del segmento de código) o una compensación relativa (un desplazamiento firmado en relación con el valor actual del puntero de instruccion en el registro EIP; este valor apunta a la instrucción siguiendo la instrucción CALL). El registro CS no se cambia en llamadas cercanas.

Para un llamado cercano absoluto, un offset absoluto se especifica indirectamente en un registro de proposito general o una ubicación de memoria (r/m16, r/m32, o r/m64). El atributo el operando-size determina el tamaño del objetivo operando (16, 32 o 64 bits). Cuando en el modo 64-bit, el tamaño de operando para llamada cercana (y todas las ramas cercanas) se ve obligado a 64-bits. Los offsets absolutos se cargan directamente en el registro EIP(RIP). Si el atributo el tamaño de operando es 16, los dos bytes superiores del registro EIP se limpian, dando como resultado un tamaño máximo puntero de instruccion de 16 bits. Al acceder a un offset absoluto indirectamente utilizando el puntero de pila [ESP] como registro base, el valor base utilizado es el valor del ESP antes de ejecutar la instrucción.

Un offset relativo (rel16 o rel32) se especifica generalmente como una etiqueta en código de montaje. Pero a nivel de código de máquina, se codifica como un valor inmediato firmado de 16 o 32 bits. Este valor se añade al valor del registro EIP(RIP). En el modo 64-bit el offset relativo es siempre un valor inmediato de 32-bit que se muestra extendido a 64-bits antes de que se añada al valor en el registro RIP para el cálculo objetivo. Como con compensaciones absolutas, el atributo el operando-size determina el tamaño del objetivo operando (16, 32 o 64 bits). En el modo 64-bit el objetivo operando siempre será de 64-bits porque el tamaño de operando es forzado a 64-bits para ramas cercanas.

Far Calls in Real-Address or modo virtual-8086. Al ejecutar una llamada de lejos en realaddress o modo virtual-8086, el procesador empuja el valor actual de los registros CS y EIP en la pila para su uso como un retorno-puntero de instruccion. A continuación, el procesador realiza una "direccional rama" al segmento de código y se compensa con el objetivo operando para el procedimiento llamado. El objetivo operando especifica una dirección absoluta directa con un puntero (ptr16:16 o ptr16:32) o indirectamente con una ubicación de memoria (m16:16 o m16:32). Con el método puntero, el segmento y la compensación del procedimiento llamado se codifica en la instrucción utilizando una dirección de 4 bytes (16-bit tamaño de operando) o 6-byte (32-bit tamaño de operando) de distancia inmediata. Con el método indirecto, el objetivo operando especifica una ubicación de memoria que contiene una dirección de 4 bytes (16-bit tamaño de operando) o 6-byte (32-bit tamaño de operando). El atributo el operando-size determina el tamaño del offset (16 o 32 bits) en la dirección remota. La dirección está cargada directamente en los registros CS y EIP. Si el atributo el operando-size es 16, los dos bytes superiores del registro EIP se limpian.

Far Calls en modo protegido. Cuando el procesador está operando en modo protegido, la instrucción CALL se puede utilizar para realizar los siguientes tipos de llamadas:

* Lejos llamados al mismo nivel de privilegios * Lejos llamados a un nivel de privilegio diferente (llamada de nivel de privilegios) * Interruptor de tareas (llamada a otra tarea)

En modo protegido, el procesador siempre utiliza la parte el selector de segmento de la dirección remota para acceder al descriptor correspondiente en el GDT o LDT. El tipo de descriptor (segmento de código, puerta de llamada, puerta de tarea, o TSS) y los derechos de acceso determinan el tipo de operación de llamada a realizar.

Si el descriptor seleccionado es para un segmento de código, se realiza una llamada a un segmento de código al mismo nivel de privilegios. (Si el segmento de código seleccionado está a un nivel de privilegios diferente y el segmento de código no está conformando, se genera una excepción de protección general.) Una llamada al mismo nivel de privilegios en modo protegido es muy similar a la realizada en dirección real o modo virtual-8086. El objetivo operando especifica una dirección absoluta directa con un puntero (ptr16:16 o ptr16:32) o indirectamente con una ubicación de memoria (m16:16 o m16:32). El atributo operandsize determina el tamaño del offset (16 o 32 bits) en la dirección remota. El nuevo código selector de segmento y su descriptor se cargan en el registro CS; el offset de la instrucción se carga en el registro EIP.

Una puerta de llamada (descrita en el párrafo siguiente) también puede utilizarse para realizar una llamada a un segmento de código al mismo nivel de privilegios. El uso de este mecanismo proporciona un nivel adicional de indirectidad y es el método preferido de hacer llamadas entre segmentos de código de 16 bits y 32 bits.

Al ejecutar una llamada inter-privilege-level far, el segmento de código para el procedimiento que se llama debe ser accedido a través de una puerta de llamada. El selector de segmento especificado por el objetivo operando identifica la puerta de llamada. El objetivo operando puede especificar la puerta de llamada selector de segmento directamente con un puntero (ptr16:16 o ptr16:32) o indirectamente con una ubicación de memoria (m16:16 o m16:32). El procesador obtiene el selector de segmento para el nuevo segmento de código y el nuevo puntero de instruccion (offset) del descriptor de la puerta de llamada. (El offset del objetivo operando es ignorado cuando se utiliza una puerta de llamada).

En las llamadas inter-privilege-level, el procesador cambia a la pila para el nivel de privilegio del procedimiento llamado. El selector de segmento para el nuevo segmento de pila se especifica en el TSS para la tarea actualmente en ejecución. La rama al nuevo segmento de código se produce después del interruptor de la pila. (Nota que cuando se utiliza una puerta de llamada para realizar una llamada a un segmento al mismo nivel de privilegios, no se produce ningún interruptor de pila.) En la nueva pila, el procesador empuja el selector de segmento y puntero de pila para la pila del procedimiento de llamada, un conjunto opcional de parámetros de la pila de procedimientos de llamada, y el selector de segmento y puntero de instruccion para el segmento de código del procedimiento de llamada. (Un valor en el descriptor de la puerta de llamada determina cuántos parámetros para copiar a la nueva pila.) Finalmente, las ramas del procesador a la dirección del procedimiento que se llama dentro del nuevo segmento de código.

Ejecutar un interruptor de tarea con la instrucción CALL es similar a ejecutar una llamada a través de una puerta de llamada. El objetivo operando especifica el selector de segmento de la puerta de tarea para la nueva tarea activada por el interruptor (el offset en el objetivo operando es ignorado). La puerta de tarea a su vez apunta al TSS para la nueva tarea, que contiene los selectores de segmentos para los segmentos de código y pila de la tarea. Tenga en cuenta que el TSS también contiene el valor EIP para la siguiente instrucción que debía ejecutarse antes de que se suspendiera la tarea de llamada. Este valor puntero de instruccion se carga en el registro EIP para volver a iniciar la tarea de llamada.

La instrucción CALL también puede especificar el selector de segmento del TSS directamente, que elimina la indirecta de la puerta de tarea. Ver Capítulo 10, "Manejo de Pulsar", en el Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 3A, para obtener información sobre la mecánica de un interruptor de tarea.

Cuando la ejecución de una instrucción CALL afecta a un interruptor de tarea, la bandera de tarea anidada (NT) se establece en el registro EFLAGS y el nuevo campo de enlace de tareas anterior de TSS se carga con el selector TSS de la antigua tarea. Se espera que el código suspenda esta tarea anidada ejecutando una instrucción IRET que, debido a que se establece la bandera NT, utiliza automáticamente el enlace de tarea anterior para volver a la tarea de llamada. (Ver "Task Linking" en el capítulo 10 de Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 3A, para información sobre tareas anidadas.) Las tareas de conmutación con la instrucción CALL difieren a este respecto de la instrucción JMP. JMP no establece la bandera NT y por lo tanto no espera que una instrucción IRET suspenda la tarea.

Mixing 16-Bit y 32-Bit Calls. Al hacer llamadas de lejos entre segmentos de código de 16 bits y 32 bits, utilice una puerta de llamada. Si la llamada es de un segmento de código de 32 bits a un segmento de código de 16 bits, la llamada debe hacerse de los primeros 64 KBytes del segmento de código de 32 bits. Esto se debe a que el operando-size atributo de la instrucción se establece a 16, por lo que sólo se puede guardar una dirección de retorno de 16 bits. Además, la llamada debe hacerse usando una puerta de llamada de 16 bits para que los valores de 16 bits puedan ser empujados en la pila. Ver capítulo 24, "Mixing 16-Bit and 32-Bit Code", en el Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 3B, para más información.

Far Calls in Compatibility Mode. Cuando el procesador está operando en modo de compatibilidad, la instrucción CALL se puede utilizar para realizar los siguientes tipos de llamadas:

* Lejos llamados al mismo nivel de privilegios, permaneciendo en modo de compatibilidad * Lejos llamados al mismo nivel de privilegios, transición al modo 64-bit * Lejos llamados a un nivel de privilegio diferente (llamada de nivel de privilegios), transición a modo de 64 bits

Tenga en cuenta que una instrucción CALL no se puede utilizar para causar un interruptor de tarea en modo de compatibilidad ya que los conmutadores de tarea no son compatibles en modo IA-32e.

En modo de compatibilidad, el procesador siempre utiliza la parte el selector de segmento de la dirección remota para acceder al descriptor correspondiente en el GDT o LDT. El tipo de descriptor (segmento de código, puerta de llamada) y los derechos de acceso determinan el tipo de operación de llamada a realizar.

Si el descriptor seleccionado es para un segmento de código, se realiza una llamada a un segmento de código al mismo nivel de privilegios. (Si el segmento de código seleccionado está a un nivel de privilegio diferente y el segmento de código no está conformando, se genera una excepción de protección general.) Una llamada al mismo nivel de privilegios en modo de compatibilidad es muy similar a la realizada en modo protegido. El objetivo operando especifica una dirección absoluta directa con un puntero (ptr16:16 o ptr16:32) o indirectamente con una ubicación de memoria (m16:16 o m16:32). El atributo el operando-size determina el tamaño del offset (16 o 32 bits) en la dirección remota. El nuevo código selector de segmento y su descriptor se cargan en el registro CS y el offset de la instrucción se carga en el registro EIP. La diferencia es que el modo 64-bit puede ser introducido. Esto especificado por el bit L en el nuevo descriptor del segmento de código.

Tenga en cuenta que una puerta de llamada de 64 bits (descrita en el párrafo siguiente) también se puede utilizar para realizar una llamada a un segmento de código al mismo nivel de privilegios. Sin embargo, el uso de este mecanismo requiere que el descriptor de segmento de código objetivo tenga el conjunto de bits L, causando una entrada al modo 64-bit.

Al ejecutar una llamada interprivilege-level far, el segmento de código para el procedimiento que se llama debe ser accedido a través de una puerta de llamada de 64 bits. El selector de segmento especificado por el objetivo operando identifica la puerta de llamada. El objetivo

operando puede especificar la puerta de llamada selector de segmento directamente con un puntero (ptr16:16 o ptr16:32) o indirectamente con una ubicación de memoria (m16:16 o m16:32). El procesador obtiene el selector de segmento para el nuevo segmento de código y el nuevo puntero de instruccion (offset) del descriptor de puerta de llamada de 16 bytes. (El offset del objetivo operando es ignorado cuando se utiliza una puerta de llamada).

En las llamadas inter-privilege-level, el procesador cambia a la pila para el nivel de privilegio del procedimiento llamado. El selector de segmento para el nuevo segmento de pila se establece en NULL. El nuevo puntero de pila se especifica en el TSS para la tarea en curso. La rama al nuevo segmento de código se produce después del interruptor de la pila. (Nota que cuando se utiliza una puerta de llamada para realizar una llamada a un segmento al mismo nivel de privilegios, un interruptor de pila implícita ocurre como resultado de entrar en modo de 64 bits. El selector SS no cambia, pero los accesos de segmento de pila utilizan una base de segmento de 0x0, se ignora el límite, y el tamaño de pila predeterminado es de 64 bits. El valor total de RSP se utiliza para el offset, del cual el quedan indefinidas superior de 32 bits) En la nueva pila, el procesador empuja el selector de segmento y puntero de pila para la pila del procedimiento de llamada y el selector de segmento y puntero de instruccion para el segmento de código del procedimiento de llamada. (La copia del parámetro no se admite en modo IA-32e.) Por último, el procesador se ramifica a la dirección del procedimiento que se llama dentro del nuevo segmento de código.

Cerca/(Far) Llama en modo de 64 bits. Cuando el procesador está operando en modo de 64 bits, la instrucción CALL se puede utilizar para realizar los siguientes tipos de llamadas:

* Lejos llamados al mismo nivel de privilegios, transición al modo de compatibilidad * Lejos llamados al mismo nivel de privilegios, permaneciendo en modo de 64 bits * Lejos llamados a un nivel de privilegio diferente (llamada de nivel de privilegios interprivilege), permaneciendo en modo de 64 bits

Tenga en cuenta que en este modo la instrucción CALL no se puede utilizar para causar un interruptor de tarea en modo de 64 bits ya que los conmutadores de tarea no son compatibles en modo IA-32e.

En modo de 64 bits, el procesador siempre utiliza la parte el selector de segmento de la dirección remota para acceder al descriptor correspondiente en el GDT o LDT. El tipo de descriptor (segmento de código, puerta de llamada) y los derechos de acceso determinan el tipo de operación de llamada a realizar.

Si el descriptor seleccionado es para un segmento de código, se realiza una llamada a un segmento de código al mismo nivel de privilegios. (Si el segmento de código seleccionado está a un nivel de privilegios diferente y el segmento de código no está conformando, se genera una excepción de protección general.) Una llamada al mismo nivel de privilegios en modo de 64 bits es muy similar a la realizada en modo de compatibilidad. El objetivo operando especifica una dirección absoluta indirectamente con una ubicación de memoria (m16:16, m16:32 o m16:64). La forma de CALL con una especificación directa de dirección absoluta no se define en modo de 64 bits. El atributo el operando-size determina el tamaño del offset (16, 32 o 64 bits) en la dirección remota. El nuevo código selector de segmento y su descriptor se cargan en el registro CS; el offset de la instrucción se carga en el registro EIP. El nuevo segmento de código puede especificar la entrada en modo compatible o de 64 bits, basado en el valor de bit L.

Una puerta de llamada de 64 bits (descrita en el párrafo siguiente) también puede utilizarse para realizar una llamada a un segmento de código al mismo nivel de privilegios. Sin embargo, el uso de este mecanismo requiere que el descriptor de segmento de código objetivo tenga el conjunto de bits L.

Al ejecutar una llamada interprivilege-level far, el segmento de código para el procedimiento que se llama debe ser accedido a través de una puerta de llamada de 64 bits. El selector de segmento especificado por el objetivo operando identifica la puerta de llamada. El objetivo operando sólo puede especificar la puerta de llamada selector de segmento indirectamente con una ubicación de memoria (m16:16, m16:32 o m16:64). El procesador obtiene el selector de segmento para el nuevo segmento de código y el nuevo puntero de instruccion (offset) del descriptor de puerta de llamada de 16 bytes. (El offset del objetivo operando es ignorado cuando se utiliza una puerta de llamada).

En las llamadas inter-privilege-level, el procesador cambia a la pila para el nivel de privilegio del procedimiento llamado. El selector de segmento para el nuevo segmento de pila se establece en NULL. El nuevo puntero de pila se especifica en el TSS para la tarea en curso. La rama al nuevo segmento de código se produce después del interruptor de la pila.

Tenga en cuenta que al utilizar una puerta de llamada para realizar una llamada a un segmento al mismo nivel de privilegios, un interruptor de pila implícita ocurre como resultado de entrar en modo 64-bit. El selector SS no cambia, pero los accesos de segmento de pila utilizan una base de segmento de 0x0, se ignora el límite, y el tamaño de pila predeterminado es de 64 bits. (El valor total de RSP se utiliza para el offset.) En la nueva pila, el procesador empuja el selector de segmento y puntero de pila para la pila del procedimiento de llamada y el selector de segmento y puntero de instruccion para el segmento de código del procedimiento de llamada. (La copia del parámetro no se admite en modo IA-32e.) Por último, el procesador se ramifica a la dirección del procedimiento que se llama dentro del nuevo segmento de código.

Consulte el Capítulo 6, "Procedimientos, Interrupciones y Excepciones", y el Capítulo 18, "Control-flow Enforcement Technology (CET)," en el Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1, para CET

details.

Cuando las transiciones FRED están habilitadas, una ejecución de CALL lejano que hace referencia a una puerta de llamada causa un general-protec-

excepción tion, al igual que una ejecución de lejos CALL que entraría en modo compatibilidad cuando CPL es 0.

Ordenación de instrucciones. Las instrucciones después de una llamada lejana pueden ser arrebatadas de memoria antes de instrucciones anteriores

ejecución completa, pero no ejecutarán (incluso especulativamente) hasta que todas las instrucciones antes de la llamada de lejos tengan

ejecución completada (las instrucciones posteriores pueden ejecutarse antes de que los datos almacenados por las instrucciones anteriores tengan

ser mundialmente visible).

Las instrucciones secuencialmente después de una instrucción casi indirecta CALL (es decir, las que no están en el objetivo) pueden ejecutarse

especulativamente. Si el software necesita prevenir esto (por ejemplo, para prevenir un canal lateral de ejecución especulativa),

entonces una instrucción LFENCE código de operación se puede colocar después del CALL indirecto cercano para bloquear la ejecución especulativa

tion.

## Operación

```text
IF near call
    THEN IF near relative call
          THEN
               IF OperandSize = 64
                      THEN
                            tempDEST := SignExtend(DEST); (* DEST is rel32 *)
                            tempRIP := RIP + tempDEST;
                            IF stack not large enough for a 8-byte return address
                                  THEN #SS(0); FI;
                            Push(RIP);
                            IF ShadowStackEnabled(CPL) AND DEST != 0
                                  ShadowStackPush8B(RIP);
                            FI;
                            RIP := tempRIP;
                FI;
               IF OperandSize = 32
                      THEN
                            tempEIP := EIP + DEST; (* DEST is rel32 *)
                            IF tempEIP is not within code segment limit THEN #GP(0); FI;
                            IF stack not large enough for a 4-byte return address
                                  THEN #SS(0); FI;
                            Push(EIP);
                            IF ShadowStackEnabled(CPL) AND DEST != 0
                                  ShadowStackPush4B(EIP);
                            FI;
                            EIP := tempEIP;
                FI;
                IF OperandSize = 16
                      THEN
                            tempEIP := (EIP + DEST) AND 0000FFFFH; (* DEST is rel16 *)
                            IF tempEIP is not within code segment limit THEN #GP(0); FI;
                            IF stack not large enough for a 2-byte return address
                                  THEN #SS(0); FI;
                            Push(IP);
                            IF ShadowStackEnabled(CPL) AND DEST != 0
                                  (* IP is zero extended and pushed as a 32 bit value on shadow stack *)
                                  ShadowStackPush4B(IP);
                            FI;


                             EIP := tempEIP;
                FI;
          ELSE (* Near absolute call *)
               IF OperandSize = 64

                       THEN
                             tempRIP := DEST; (* DEST is r/m64 *)
                             IF stack not large enough for a 8-byte return address
                                   THEN #SS(0); FI;
                             Push(RIP);
                             IF ShadowStackEnabled(CPL)
                                   ShadowStackPush8B(RIP);
                             FI;
                             RIP := tempRIP;

                FI;
               IF OperandSize = 32

                       THEN
                             tempEIP := DEST; (* DEST is r/m32 *)
                             IF tempEIP is not within code segment limit THEN #GP(0); FI;
                             IF stack not large enough for a 4-byte return address
                                   THEN #SS(0); FI;
                             Push(EIP);
                             IF ShadowStackEnabled(CPL)
                                   ShadowStackPush4B(EIP);
                             FI;
                             EIP := tempEIP;

                FI;
               IF OperandSize = 16

                       THEN
                             tempEIP := DEST AND 0000FFFFH; (* DEST is r/m16 *)
                             IF tempEIP is not within code segment limit THEN #GP(0); FI;
                             IF stack not large enough for a 2-byte return address
                                   THEN #SS(0); FI;
                             Push(IP);
                             IF ShadowStackEnabled(CPL)
                                   (* IP is zero extended and pushed as a 32 bit value on shadow stack *)
                                   ShadowStackPush4B(IP);
                             FI;
                             EIP := tempEIP;

                FI;
    FI;rel/abs
    IF (Call near indirect, absolute indirect)

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
FI; near

IF far call and (PE = 0 or (PE = 1 and VM = 1)) (* Real-address or virtual-8086 mode *)
    THEN
         IF OperandSize = 32
                THEN
                       IF stack not large enough for a 6-byte return address
                             THEN #SS(0); FI;
                       IF DEST[31:16] is not zero THEN #GP(0); FI;
                       Push(CS); (* Padded with 16 high-order bits *)
                       Push(EIP);
                       CS := DEST[47:32]; (* DEST is ptr16:32 or [m16:32] *)
                       EIP := DEST[31:0]; (* DEST is ptr16:32 or [m16:32] *)
               ELSE (* OperandSize = 16 *)
                       IF stack not large enough for a 4-byte return address
                             THEN #SS(0); FI;
                       Push(CS);
                       Push(IP);
                       CS := DEST[31:16]; (* DEST is ptr16:16 or [m16:16] *)
                       EIP := DEST[15:0]; (* DEST is ptr16:16 or [m16:16]; clear upper 16 bits *)
          FI;

FI;

IF far call and (PE = 1 and VM = 0) (* Protected mode or IA-32e Mode, not virtual-8086 mode*)
    THEN
          IF segment selector in target operand NULL
                THEN #GP(0); FI;
          IF segment selector index not within descriptor table limits
                THEN #GP(new code segment selector); FI;
          Read type and access rights of selected segment descriptor;
          IF IA32_EFER.LMA = 0
                THEN
                       IF segment type is not a conforming or nonconforming code segment, call gate, task gate, or TSS
                             THEN #GP(segment selector); FI;
                ELSE
                       IF segment type is not a conforming or nonconforming code segment or 64-bit call gate
                             THEN #GP(segment selector); FI;
          FI;
          Depending on type and access rights:
                GO TO CONFORMING-CODE-SEGMENT;
                GO TO NONCONFORMING-CODE-SEGMENT;
                GO TO CALL-GATE;
                GO TO TASK-GATE;
                GO TO TASK-STATE-SEGMENT;

FI;

CONFORMING-CODE-SEGMENT:
    IF L bit = 1 and D bit = 1 and IA32_EFER.LMA = 1
          THEN GP(new code segment selector); FI;
    IF DPL > CPL
          THEN #GP(new code segment selector); FI;
    IF CR4.FRED = 1 and CPL = 0 and L bit = 0


          THEN GP(new code segment selector); FI;
    IF segment not present

          THEN #NP(new code segment selector); FI;
    IF stack not large enough for return address

          THEN #SS(0); FI;
    tempEIP := DEST(Offset);
    IF target mode = Compatibility mode

          THEN tempEIP := tempEIP AND 00000000_FFFFFFFFH; FI;
    IF OperandSize = 16

          THEN
                tempEIP := tempEIP AND 0000FFFFH; FI; (* Clear upper 16 bits *)

    IF (IA32_EFER.LMA = 0 or target mode = Compatibility mode) and (tempEIP outside new code segment limit)
          THEN #GP(0); FI;

    IF tempEIP is non-canonical
          THEN #GP(0); FI;

    IF ShadowStackEnabled(CPL)
          IF OperandSize = 32
                THEN
                       tempPushLIP = CSBASE + EIP;
                ELSE
                       IF OperandSize = 16
                             THEN
                                   tempPushLIP = CSBASE + IP;
                             ELSE (* OperandSize = 64 *)
                                   tempPushLIP = RIP;
                       FI;
          FI;
          tempPushCS = CS;

    FI;
    IF OperandSize = 32

          THEN
                Push(CS); (* Padded with 16 high-order bits *)
                Push(EIP);
                CS := DEST(CodeSegmentSelector);
                (* Segment descriptor information also loaded *)
                CS(RPL) := CPL;
                EIP := tempEIP;

          ELSE
               IF OperandSize = 16
                       THEN
                             Push(CS);
                             Push(IP);
                             CS := DEST(CodeSegmentSelector);
                             (* Segment descriptor information also loaded *)
                             CS(RPL) := CPL;
                             EIP := tempEIP;
                    ELSE (* OperandSize = 64 *)
                             Push(CS); (* Padded with 48 high-order bits *)
                             Push(RIP);
                             CS := DEST(CodeSegmentSelector);
                             (* Segment descriptor information also loaded *)
                             CS(RPL) := CPL;
                             RIP := tempEIP;
                FI;


    FI;
    IF ShadowStackEnabled(CPL)

          IF (IA32_EFER.LMA and DEST(CodeSegmentSelector).L) = 0
                (* If target is legacy or compatibility mode then the SSP must be in low 4GB *)
                IF (SSP & 0xFFFFFFFF00000000 != 0)
                       THEN #GP(0); FI;

          FI;
          (* align to 8 byte boundary if not already aligned *)
          tempSSP = SSP;
          Shadow_stack_store 4 bytes of 0 to (SSP  4)
          SSP = SSP & 0xFFFFFFFFFFFFFFF8H
          ShadowStackPush8B(tempPushCS); (* Padded with 48 high-order bits of 0 *)
          ShadowStackPush8B(tempPushLIP); (* Padded with 32 high-order bits of 0 for 32 bit LIP*)
          ShadowStackPush8B(tempSSP);
    FI;
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
    IF (RPL > CPL) or (DPL  CPL)
          THEN #GP(new code segment selector); FI;
    IF CR4.FRED = 1 and CPL = 0 and L bit = 0
          THEN GP(new code segment selector); FI;
    IF segment not present
          THEN #NP(new code segment selector); FI;
    IF stack not large enough for return address
          THEN #SS(0); FI;
    tempEIP := DEST(Offset);
    IF target mode = Compatibility mode
          THEN tempEIP := tempEIP AND 00000000_FFFFFFFFH; FI;
    IF OperandSize = 16
          THEN tempEIP := tempEIP AND 0000FFFFH; FI; (* Clear upper 16 bits *)
    IF (IA32_EFER.LMA = 0 or target mode = Compatibility mode) and (tempEIP outside new code segment limit)
          THEN #GP(0); FI;
    IF tempEIP is non-canonical
          THEN #GP(0); FI;
    IF ShadowStackEnabled(CPL)
          IF IA32_EFER.LMA & CS.L
                tempPushLIP = RIP
          ELSE
                tempPushLIP = CSBASE + EIP;
          FI;
          tempPushCS = CS;


    FI;
    IF OperandSize = 32

          THEN
                Push(CS); (* Padded with 16 high-order bits *)
                Push(EIP);
                CS := DEST(CodeSegmentSelector);
                (* Segment descriptor information also loaded *)
                CS(RPL) := CPL;
                EIP := tempEIP;

          ELSE
                IF OperandSize = 16
                       THEN
                             Push(CS);
                             Push(IP);
                             CS := DEST(CodeSegmentSelector);
                             (* Segment descriptor information also loaded *)
                             CS(RPL) := CPL;
                             EIP := tempEIP;
                       ELSE (* OperandSize = 64 *)
                             Push(CS); (* Padded with 48 high-order bits *)
                             Push(RIP);
                             CS := DEST(CodeSegmentSelector);
                             (* Segment descriptor information also loaded *)
                             CS(RPL) := CPL;
                             RIP := tempEIP;
                FI;

    FI;
    IF ShadowStackEnabled(CPL)

          IF (IA32_EFER.LMA and DEST(CodeSegmentSelector).L) = 0
                (* If target is legacy or compatibility mode then the SSP must be in low 4GB *)
                IF (SSP & 0xFFFFFFFF00000000 != 0)
                       THEN #GP(0); FI;

          FI;
    (* align to 8 byte boundary if not already aligned *)
    tempSSP = SSP;
    Shadow_stack_store 4 bytes of 0 to (SSP  4)
    SSP = SSP & 0xFFFFFFFFFFFFFFF8H
    ShadowStackPush8B(tempPushCS); (* Padded with 48 high-order 0 bits *)
    ShadowStackPush8B(tempPushLIP); (* Padded 32 high-order bits of 0 for 32 bit LIP*)
    ShadowStackPush8B(tempSSP);
    FI;
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


    IF call gate (DPL < CPL) or (RPL > DPL) or (CR4.FRED = 1)
          THEN #GP(call-gate selector); FI;

    IF call gate not present
          THEN #NP(call-gate selector); FI;

    IF call-gate code-segment selector is NULL
          THEN #GP(0); FI;

    IF call-gate code-segment selector index is outside descriptor table limits
          THEN #GP(call-gate code-segment selector); FI;

    Read call-gate code-segment descriptor;
    IF call-gate code-segment descriptor does not indicate a code segment
    or call-gate code-segment descriptor DPL > CPL

          THEN #GP(call-gate code-segment selector); FI;
    IF IA32_EFER.LMA = 1 AND (call-gate code-segment descriptor is
    not a 64-bit code segment or call-gate code-segment descriptor has both L-bit and D-bit set)

          THEN #GP(call-gate code-segment selector); FI;
    IF call-gate code segment not present

          THEN #NP(call-gate code-segment selector); FI;
    IF call-gate code segment is non-conforming and DPL < CPL

          THEN go to MORE-PRIVILEGE;
          ELSE go to SAME-PRIVILEGE;
    FI;
END;

MORE-PRIVILEGE:
    IF current TSS is 32-bit
          THEN
                TSSstackAddress := (new code-segment DPL  8) + 4;
                IF (TSSstackAddress + 5) > current TSS limit
                       THEN #TS(current TSS selector); FI;
                NewSS := 2 bytes loaded from (TSS base + TSSstackAddress + 4);
                NewESP := 4 bytes loaded from (TSS base + TSSstackAddress);
          ELSE
                IF current TSS is 16-bit
                       THEN
                             TSSstackAddress := (new code-segment DPL  4) + 2
                             IF (TSSstackAddress + 3) > current TSS limit
                                   THEN #TS(current TSS selector); FI;
                             NewSS := 2 bytes loaded from (TSS base + TSSstackAddress + 2);
                             NewESP := 2 bytes loaded from (TSS base + TSSstackAddress);
                       ELSE (* current TSS is 64-bit *)
                             TSSstackAddress := (new code-segment DPL  8) + 4;
                             IF (TSSstackAddress + 7) > current TSS limit
                                   THEN #TS(current TSS selector); FI;
                             NewSS := new code-segment DPL; (* NULL selector with RPL = new CPL *)
                             NewRSP := 8 bytes loaded from (current TSS base + TSSstackAddress);
                FI;
    FI;
    IF IA32_EFER.LMA = 0 and NewSS is NULL
          THEN #TS(NewSS); FI;
    Read new stack-segment descriptor;
    IF IA32_EFER.LMA = 0 and (NewSS RPL  new code-segment DPL
    or new stack-segment DPL  new code-segment DPL or new stack segment is not a
    writable data segment)
          THEN #TS(NewSS); FI


IF IA32_EFER.LMA = 0 and new stack segment not present
      THEN #SS(NewSS); FI;

IF CallGateSize = 32
      THEN
            IF new stack does not have room for parameters plus 16 bytes
                  THEN #SS(NewSS); FI;
            IF CallGate(InstructionPointer) not within new code-segment limit
                  THEN #GP(0); FI;
            SS := newSS; (* Segment descriptor information also loaded *)
            ESP := newESP;
            CS:EIP := CallGate(CS:InstructionPointer);
            (* Segment descriptor information also loaded *)
            Push(oldSS:oldESP); (* From calling procedure *)
            temp := parameter count from call gate, masked to 5 bits;
            Push(parameters from calling procedure's stack, temp)
            Push(oldCS:oldEIP); (* Return address to calling procedure *)
      ELSE
            IF CallGateSize = 16
                  THEN
                        IF new stack does not have room for parameters plus 8 bytes
                              THEN #SS(NewSS); FI;
                        IF (CallGate(InstructionPointer) AND FFFFH) not in new code-segment limit
                              THEN #GP(0); FI;
                        SS := newSS; (* Segment descriptor information also loaded *)
                        ESP := newESP;
                        CS:IP := CallGate(CS:InstructionPointer);
                        (* Segment descriptor information also loaded *)
                        Push(oldSS:oldESP); (* From calling procedure *)
                        temp := parameter count from call gate, masked to 5 bits;
                        Push(parameters from calling procedure's stack, temp)
                        Push(oldCS:oldEIP); (* Return address to calling procedure *)
                  ELSE (* CallGateSize = 64 *)
                        IF pushing 32 bytes on the stack would use a non-canonical address
                              THEN #SS(NewSS); FI;
                        IF (CallGate(InstructionPointer) is non-canonical)
                              THEN #GP(0); FI;
                        SS := NewSS; (* NewSS is NULL)
                        RSP := NewESP;
                        CS:IP := CallGate(CS:InstructionPointer);
                        (* Segment descriptor information also loaded *)
                        Push(oldSS:oldESP); (* From calling procedure *)
                        Push(oldCS:oldEIP); (* Return address to calling procedure *)
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
CPL := CodeSegment(DPL)
CS(RPL) := CPL


IF ShadowStackEnabled(CPL)

      oldSSP := SSP

      SSP := IA32_PLi_SSP; (* where i is the CPL *)

      IF SSP & 0x07 != 0 (* if SSP not aligned to 8 bytes then #GP *)

           THEN #GP(0); FI;

      (* Token and CS:LIP:oldSSP pushed on shadow stack must be contained in a naturally aligned 32-byte region*)

      IF (SSP & ~0x1F) != ((SSP  24) & ~0x1F)

           #GP(0); FI;

      IF ((IA32_EFER.LMA and CS.L) = 0 AND SSP[63:32] != 0)

           THEN #GP(0); FI;

      expected_token_value = SSP        (* busy bit - bit position 0 - must be clear *)

      new_token_value = SSP | BUSY_BIT  (* Set the busy bit *)

      IF shadow_stack_lock_cmpxchg8b(SSP, new_token_value, expected_token_value) != expected_token_value

           THEN #GP(0); FI;

      IF oldSS.DPL != 3

           ShadowStackPush8B(oldCS); (* Padded with 48 high-order bits of 0 *)

           ShadowStackPush8B(oldCSBASE+oldRIP); (* Padded with 32 high-order bits of 0 for 32 bit LIP*)

           ShadowStackPush8B(oldSSP);

      FI;

FI;

IF EndbranchEnabled (CPL)

      IA32_S_CET.TRACKER = WAIT_FOR_ENDBRANCH

      IA32_S_CET.SUPPRESS = 0

FI;

END;

SAME-PRIVILEGE:
    IF CallGateSize = 32
          THEN
                IF stack does not have room for 8 bytes
                      THEN #SS(0); FI;
                IF CallGate(InstructionPointer) not within code segment limit
                      THEN #GP(0); FI;
                CS:EIP := CallGate(CS:EIP) (* Segment descriptor information also loaded *)
                Push(oldCS:oldEIP); (* Return address to calling procedure *)
          ELSE
               If CallGateSize = 16
                      THEN
                            IF stack does not have room for 4 bytes
                                  THEN #SS(0); FI;
                            IF CallGate(InstructionPointer) not within code segment limit
                                  THEN #GP(0); FI;
                            CS:IP := CallGate(CS:instruction pointer);
                            (* Segment descriptor information also loaded *)
                            Push(oldCS:oldIP); (* Return address to calling procedure *)
                      ELSE (* CallGateSize = 64)
                            IF pushing 16 bytes on the stack touches non-canonical addresses
                                  THEN #SS(0); FI;
                            IF RIP non-canonical
                                  THEN #GP(0); FI;
                            CS:IP := CallGate(CS:instruction pointer);
                            (* Segment descriptor information also loaded *)
                            Push(oldCS:oldIP); (* Return address to calling procedure *)
                FI;


    FI;
    CS(RPL) := CPL
    IF ShadowStackEnabled(CPL)

          (* Align to next 8 byte boundary *)
          tempSSP = SSP;
          Shadow_stack_store 4 bytes of 0 to (SSP  4)
          SSP = SSP & 0xFFFFFFFFFFFFFFF8H;
          (* push cs:lip:ssp on shadow stack *)
          ShadowStackPush8B(oldCS); (* Padded with 48 high-order bits of 0 *)
          ShadowStackPush8B(oldCSBASE + oldRIP); (* Padded with 32 high-order bits of 0 for 32 bit LIP*)
          ShadowStackPush8B(tempSSP);
    FI;
    IF EndbranchEnabled (CPL)
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
    IF task gate DPL < CPL or RPL
          THEN #GP(task gate selector); FI;
    IF task gate not present
          THEN #NP(task gate selector); FI;
    Read the TSS segment selector in the task-gate descriptor;
    IF TSS segment selector local/global bit is set to local
    or index not within GDT limits
          THEN #GP(TSS selector); FI;
    Access TSS descriptor in GDT;
    IF descriptor is not a TSS segment
          THEN #GP(TSS selector); FI;
    IF TSS descriptor specifies that the TSS is busy
          THEN #GP(TSS selector); FI;
    IF TSS not present
          THEN #NP(TSS selector); FI;
    SWITCH-TASKS (with nesting) to TSS;
    IF EIP not within code segment limit
          THEN #GP(0); FI;

END;

TASK-STATE-SEGMENT:
    IF TSS DPL < CPL or RPL
    or TSS descriptor indicates TSS not available
          THEN #GP(TSS selector); FI;
    IF TSS is not present
          THEN #NP(TSS selector); FI;
    SWITCH-TASKS (with nesting) to TSS;
    IF EIP not within code segment limit
          THEN #GP(0); FI;


END;
```

## Banderas afectadas

Todas las banderas se ven afectadas si se produce un interruptor de tarea; ninguna bandera se ve afectada si no se produce un interruptor de tarea.
