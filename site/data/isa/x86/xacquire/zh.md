---
summary: 硬件锁 Elision 前缀提示
---

## 说明

XACQUIRE前缀是在指令指定的内存地址上开始锁定擦除的提示,XRELEASE前缀是在指令指定的内存地址上结束锁定擦除的提示.

该XACQUIRE前缀提示只能使用下列指示(这些指示也称为XACQUIRE- 使用时启用XACQUIRE前缀 :

* 带有明确 LOCK 前缀( F0H) 的指令, 准备在目的地使用指令的形式

操作数是一个内存操作数: ADD,ADC,AND,BTC,BTR,BTS,CMPXCHG,CMPXCHG8B,DEC,INC,NEG,NOT,OR,SBB,SUB,XOR,XADD,XCHG.

* XCHG 指令有或无 LOCK 前缀.

该XRELEASE前缀提示只能使用以下指令(也称为XRELEASE- 使用时启用XRELEASE前缀 :

* 带有明确 LOCK 前缀( F0H) 的指令, 准备在目的地使用指令的形式

操作数是一个内存操作数: ADD,ADC,AND,BTC,BTR,BTS,CMPXCHG,CMPXCHG8B,DEC,INC,NEG,NOT,OR,SBB,SUB,XOR,XADD,XCHG.

* XCHG 指令有或无 LOCK 前缀. * "MOV mem, reg"(操作码 88H/89H)和"MOV mem, imm"(操作码 C6H/C7H)指令. 在这些

中,XRELEASE在未出现LOCK前缀的情况下被识别.

锁变量必须满足英特尔(R)64和IA-32架构软件开发者手册第1卷第16.3.3节中描述的准则,以便消除成功,否则HLE流产可以发出信号.

如果一个符合XACQUIRE/XRELEASE要求的编码字节序列包含两个前缀,那么HLE语义由最接近指令操作码的前缀字节决定. 例如,由于F2H(XACQUIRE)最接近指令操作码 C6,因此F3F2C6不会作为XRELEASE启用指令处理. 同样,F2F3F0前缀指令也会作为XRELEASE启用指令处理,因为F3H(XRELEASE)最接近指令操作码.

Intel 64 and IA-32 Compatibility

XACQUIRE/XRELEASE前缀提示的效果在非64位模式和64位模式中相同.

对于不支持 XACQUIRE 提示的指令, F2H 前缀的存在行为与以前的硬件相同,根据

* 用于字符串指令的 REPNE/REPNZ语义, * 担任 SIMD 遗留的 SIMD 指令的前缀,运行于 XMM 登记册 * 如果预置 VEX 前缀, 请使用 #UD 。 * 非字符串指令或其他情况未定义 。

对于不支持 XRELEASE 提示的指令, F3H 前缀的存在行为与先前硬件相同,根据

* 用于字符串指令的 REP/REPE/REPZ语义,, * 担任 SIMD 遗留的 SIMD 指令的前缀,运行于 XMM 登记册 * 如果预置 VEX 前缀, 请使用 #UD 。 * 非字符串指令或其他情况未定义 。

## 行动

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

## SIMD 浮点 例外

None.

## 其他例外

```text
#GP(0)            If the use of prefix causes instruction length to exceed 15 bytes.
```
