---
summary: 交易中止
---

## 说明

XABORT迫使RTM流产. 在 RTM 中止后,逻辑处理器会在通过最外侧的 XBEGIN 指令计算出的倒置地址恢复执行. EAX寄存器被更新,以反映导致流产的XABORT指示,imm8参数将以EAX的比特31:24提供.

## 行动

```text
XABORT
IF RTM_ACTIVE = 0

    THEN
          Treat as NOP;

    ELSE
          GOTO RTM_ABORT_PROCESSING;

FI;

(* For any RTM abort condition encountered during RTM execution *)
RTM_ABORT_PROCESSING:

    Restore architectural register state;
    Discard memory updates performed in transaction;
    Update EAX with status and XABORT argument;
    RTM_NEST_COUNT:= 0;
    RTM_ACTIVE:= 0;
    SUSLDTRK_ACTIVE := 0;
    IF 64-bit Mode

          THEN
                RIP:= fallbackRIP;

          ELSE
                EIP := fallbackEIP;

    FI;
END
```

## 受影响的旗帜

None.

## Intel C/C++ 内在编译器

```c
XABORT void _xabort( unsigned int);
```

## SIMD 浮点 例外

None.

## 其他例外

```text
#UDCPUID.07H.00H:EBX.RTM[11] = 0.
```

如果使用 LOCK 前缀 。
