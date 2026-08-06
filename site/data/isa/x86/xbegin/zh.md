---
summary: 交易开始
---

## 说明

XBEGIN指令指定了RTM代码区域的起始. 如果逻辑处理器还没有在交易执行中,那么XBEGIN指令会使逻辑处理器向交易执行过渡. 将逻辑处理器转换为交易执行的XBEGIN指令被称为最外层的XBEGIN指令. 该指令还指定了一个相对偏移来计算交易中止后倒置代码路径的地址. (使用16位的操作数大小不会使这个地址切换到16位,与接近跳跃到相对偏移不同.

在 RTM 中止时,逻辑处理器会丢弃 RTM 执行过程中完成的所有建筑寄存器和内存更新,并将建筑状态恢复到与最外侧的 XBEGIN 指令相对应的状态. 中止后的后退地址由最外侧的 XBEGIN 指令计算 。

XBEGIN在暂停读地址跟踪区域执行时会导致交易中止.

## 行动

```text
XBEGIN
IF RTM_NEST_COUNT < MAX_RTM_NEST_COUNT AND SUSLDTRK_ACTIVE = 0

    THEN
          RTM_NEST_COUNT++
          IF RTM_NEST_COUNT = 1 THEN
                IF 64-bit Mode
                      THEN
                            IF OperandSize = 16
                                  THEN fallbackRIP := RIP + SignExtend64(rel16);
                                  ELSE fallbackRIP := RIP + SignExtend64(rel32);
                            FI;
                            IF fallbackRIP is not canonical
                                  THEN #GP(0);
                            FI;
                      ELSE
                            IF OperandSize = 16
                                  THEN fallbackEIP := EIP + SignExtend32(rel16);
                                  ELSE fallbackEIP := EIP + rel32;
                            FI;
                            IF fallbackEIP outside code segment limit
                                  THEN #GP(0);
                            FI;
                FI;


                RTM_ACTIVE := 1
                Enter RTM Execution (* record register state, start tracking memory state*)
          FI; (* RTM_NEST_COUNT = 1 *)
    ELSE (* RTM_NEST_COUNT = MAX_RTM_NEST_COUNT OR SUSLDTRK_ACTIVE = 1 *)
          GOTO RTM_ABORT_PROCESSING
FI;

(* For any RTM abort condition encountered during RTM execution *)
RTM_ABORT_PROCESSING:

    Restore architectural register state
    Discard memory updates performed in transaction
    Update EAX with status
    RTM_NEST_COUNT := 0
    RTM_ACTIVE := 0
    SUSLDTRK_ACTIVE := 0
    IF 64-bit mode

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
XBEGIN unsigned int _xbegin( void );
```

## SIMD 浮点 例外

None.
