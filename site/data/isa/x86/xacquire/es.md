---
summary: Hardware cerradura Elision Prefix Hints
---

## Descripción

El prefijo XACQUIRE es una pista para iniciar la elisión de bloqueo en la dirección de memoria especificada por la instrucción y el prefijo XRELEASE es una pista para terminar la elisión de bloqueo en la dirección de memoria especificada por la instrucción.

El prefijo XACQUIRE sólo se puede utilizar con las siguientes instrucciones (estos instrucciones también se denominan XACQUIRE-enabled cuando se utiliza con el prefijo XACQUIRE):

* Instrucciones con un prefijo LOCK explícito (F0H) prepended a formas de la instrucción donde el destino

operando es un operando de memoria: ADD, ADC, AND, BTC, BTR, BTS, CMPXCHG, CMPXCHG8B, DEC, INC, NEG, NOT, O,SBB, SUB, XOR, XADD, yXCHG.

* La instrucción XCHG ya sea con o sin la presencia del prefijo LOCK.

El prefijo XRELEASE sólo se puede utilizar con las siguientes instrucciones (también conocidas como XRELEASE-enabled cuando se utiliza con el prefijo XRELEASE):

* Instrucciones con un prefijo LOCK explícito (F0H) prepended a formas de la instrucción donde el destino

operando es un operando de memoria: ADD, ADC, AND, BTC, BTR, BTS, CMPXCHG, CMPXCHG8B, DEC, INC, NEG, NOT, O,SBB, SUB, XOR, XADD, yXCHG.

* La instrucción XCHG ya sea con o sin la presencia del prefijo LOCK. * Las instrucciones "MOV mem, reg" (código de operación 88H/89H) y "MOV mem, imm" (código de operación C6H/C7H). En estos

casos, el XRELEASE es reconocido sin la presencia del prefijo LOCK.

Las variables de bloqueo deben satisfacer las pautas descritas en Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1, Sección 16.3.3, para que la elisión sea exitosa, de lo contrario se puede indicar un aborto HLE.

Si una secuencia de byte codificada que cumple con los requisitos XACQUIRE/XRELEASE incluye ambos prefijos, el semántico HLE es determinado por el byte prefijo que se coloca más cerca de la instrucción código de operación. Por ejemplo, un F3F2C6 no será tratado como una instrucción XRELEASE-enabled ya que el F2H (XACQUIRE) es más cercano a la instrucción código de operación C6. Análogamente, una instrucción prefijada F2F3F0 se tratará como una instrucción XRELEASE habilitada ya que F3H (XRELEASE) es más cercana a la instrucción código de operación.

Intel 64 and IA-32 Compatibility

El efecto del prefijo XACQUIRE/XRELEASE es el mismo en los modos no-64-bit y en el modo 64-bit.

Para instrucciones que no soportan el indicio XACQUIRE, la presencia del prefijo F2H se comporta de la misma manera que el hardware anterior, según

* Semántica REPNE/REPNZ para instrucciones de cadena, * Servir como prefijo SIMD para las instrucciones heredadas SIMD que operan en el registro XMM * Causa #UD si prepende el prefijo VEX. * Indefinido para instrucciones no pendientes u otras situaciones.

Para instrucciones que no soportan el indicio XRELEASE, la presencia del prefijo F3H se comporta de la misma manera que en hardware anterior, según

* Semántica REP/REPE/REPZ para instrucciones de cadena, * Servir como prefijo SIMD para las instrucciones heredadas SIMD que operan en el registro XMM * Causa #UD si prepende el prefijo VEX. * Indefinido para instrucciones no pendientes u otras situaciones.

## Operación

```text
XACQUIRE
IF XACQUIRE-enabled instruction

    THEN
          IF (HLE_NEST_COUNT < MAX_HLE_NEST_COUNT) THEN
                HLE_NEST_COUNT++
                IF (HLE_NEST_COUNT = 1) THEN
                      HLE_ACTIVE := 1
                      IF 64-bit mode
                            THEN
                                  restartRIP := instruction pointer of the XACQUIRE-enabled instruction
                            ELSE
                                  restartEIP := instruction pointer of the XACQUIRE-enabled instruction
                      FI;
                      Enter HLE Execution (* record register state, start tracking memory state *)
                FI; (* HLE_NEST_COUNT = 1*)
                IF ElisionBufferAvailable
                      THEN
                            Allocate elision buffer
                            Record address and data for forwarding and commit checking
                            Perform elision
                      ELSE
                            Perform lock acquire operation transactionally but without elision
                FI;
          ELSE (* HLE_NEST_COUNT = MAX_HLE_NEST_COUNT*)
                      GOTO HLE_ABORT_PROCESSING
          FI;

    ELSE
          Treat instruction as non-XACQUIRE F2H prefixed legacy instruction

FI;


XRELEASE
IF XRELEASE-enabled instruction

    THEN
          IF (HLE_NEST_COUNT > 0)
                THEN
                       HLE_NEST_COUNT--
                       IF lock address matches in elision buffer THEN
                             IF lock satisfies address and value requirements THEN
                                   Deallocate elision buffer
                             ELSE
                                   GOTO HLE_ABORT_PROCESSING
                             FI;
                       FI;
                       IF (HLE_NEST_COUNT = 0)
                             THEN
                                   IF NoAllocatedElisionBuffer
                                         THEN
                                               Try to commit transactional execution
                                               IF fail to commit transactional execution
                                                     THEN
                                                           GOTO HLE_ABORT_PROCESSING;
                                                     ELSE (* commit success *)
                                                           HLE_ACTIVE := 0
                                               FI;
                                         ELSE
                                               GOTO HLE_ABORT_PROCESSING
                                   FI;
                       FI;
          FI; (* HLE_NEST_COUNT > 0 *)

    ELSE
          Treat instruction as non-XRELEASE F3H prefixed legacy instruction

FI;

(* For any HLE abort condition encountered during HLE execution *)
HLE_ABORT_PROCESSING:

    HLE_ACTIVE := 0
    HLE_NEST_COUNT := 0
    Restore architectural register state
    Discard memory updates performed in transaction
    Free any allocated lock elision buffers
    IF 64-bit mode

          THEN
                RIP := restartRIP

          ELSE
                EIP := restartEIP

    FI;
    Execute and retire instruction at RIP (or EIP) and ignore any HLE hint
END
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

```text
#GP(0)            If the use of prefix causes instruction length to exceed 15 bytes.
```
