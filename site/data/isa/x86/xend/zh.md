---
summary: 交易结束
---

## 说明

该指令标志着RTM代码区域的结束. 如果这与最外范围相对应(即包括这个XEND指令,XBEGIN指令的编号与XEND指令的编号相同),逻辑处理器将尝试在原子上将逻辑处理器状态承诺. 如果承诺失败,逻辑处理器将回滚RTM执行过程中完成的所有建筑寄存器和内存更新. 逻辑处理器将在从最外侧的 XBEGIN 指令计算出的倒置地址恢复执行 。 EAX寄存器更新以反映RTM中止信息.

在交易区域外执行XEND会造成一般保护例外(#GP). XEND在暂停读地址跟踪区域执行时会导致交易中止.

## 行动

```text
XEND
IF (RTM_ACTIVE = 0) THEN

    SIGNAL #GP
ELSE

    IF SUSLDTRK_ACTIVE = 1
          THEN GOTO RTM_ABORT_PROCESSING;

    FI;
    RTM_NEST_COUNT--
    IF (RTM_NEST_COUNT = 0) THEN

          Try to commit transaction
          IF fail to commit transactional execution

                THEN
                      GOTO RTM_ABORT_PROCESSING;

                ELSE (* commit success *)
                      RTM_ACTIVE := 0

          FI;
    FI;
FI;

(* For any RTM abort condition encountered during RTM execution *)
RTM_ABORT_PROCESSING:

    Restore architectural register state
    Discard memory updates performed in transaction
    Update EAX with status
    RTM_NEST_COUNT := 0
    RTM_ACTIVE := 0
    SUSLDTRK_ACTIVE := 0
    IF 64-bit Mode

          THEN


               RIP := fallbackRIP
         ELSE

               EIP := fallbackEIP

    FI;
END
```

## 受影响的旗帜

None.

## Intel C/C++ 内在编译器

```c
XEND void _xend( void );
```

## SIMD 浮点 例外

None.

## 其他例外

```text
#UDCPUID.07H.00H:EBX.RTM[11] = 0.
```

如果使用 LOCK 前缀 。

```text
#GP(0)                   If RTM_ACTIVE = 0.
```
