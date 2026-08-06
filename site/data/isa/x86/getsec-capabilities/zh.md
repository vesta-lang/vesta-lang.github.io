---
summary: 报告 SMX 能力
---

## 说明

GETSEC[CAPABILITIES]函数返回支持的GETSEC 叶函数的位向量. GETSEC的CAPABILITIES 叶在条目时被选中,EAX设置为0. EBX被用作返回EAX中位向量字段的筛选器. GETSEC[CAPABILITIES]可以在所有特权级别执行,但必须设置CR4.SMXE比特或返回一个未定义的操作码例外(#UD).

EBX = 0 在 GETSEC [CAPABILITIES] 执行时, EAX 返回一个位向量代表状态,它存在于一个 Intel(R) TXT 能力芯片和第一个30个可用的 GETSEC 叶 函数上. 返回位向量的格式见表7-3。

如果比特 0 被设定为 1,那么处理器就已经对一个 Intel(R) TXT 容量的芯片进行了采样. 如果设置在1-30范围内的位元,那么相应的GETSEC 叶函数就可以了. 如果给定比特索引的比特值为 0,那么与该索引相对应的GETSEC 叶函数则不支持,并尝试执行结果为 a

```text
#UD.
```

EAX的比特31表示是否进一步支持叶指数. 如果扩展叶位31被设定,则通过重复GETSEC[CAPABILITIES],EBX递增一个来访问额外的叶函数. 当EAX最显著的位点没有设置时,则不支持额外的GETSEC 叶函数;将EBX索引到更高的值导致EAX返回零.

** GETSEC 能力结果编码(EBX = 0)**

| 外地 | 位位置 | 说明 |
| --- | --- | --- |
| 显示芯片集 | 0 | 英特尔(R) TXT-capable 芯片存在. |
| 未定义 | 1 | 准备金 |
| ENTERACCS | 2 | GETSEC[ENTERACCS]可供使用. |
| EXITAC | 3 | GETSEC[EXITAC]可供使用. |
| SENTER | 4 | GETSEC[SENTER]可供使用. |
| SEXIT | 5 | GETSEC[SEXIT]可供使用. |
| PARAMETERS | 6 | GETSEC[PARAMETERS]可供使用. |
| SMCTRL | 7 | GETSEC[SMCTRL]可供使用. |
| WAKEUP | 8 | GETSEC[WAKEUP]可供使用. |
| 未定义 | 30:9 | 准备金 |
| 扩展叶片 | 31 | 用于提供GETSEC能力的扩展信息报告。 |
| GETSEC [CAPABILITIES] - 报告 | SMX 能力 | SAFER  MODE  EXTENSIONS  REFERENCE |

## 行动

```text
IF (CR4.SMXE=0)
    THEN #UD;

ELSIF (in VMX non-root operation)
    THEN VM Exit (reason="GETSEC instruction");

IF (EBX=0) THEN
          BitVector := 0;
          IF (TXT chipset present)
                BitVector[Chipset present] := 1;
          IF (ENTERACCS Available)
                THEN BitVector[ENTERACCS] := 1;
          IF (EXITAC Available)
                THEN BitVector[EXITAC] := 1;
          IF (SENTER Available)
                THEN BitVector[SENTER] := 1;
          IF (SEXIT Available)
                THEN BitVector[SEXIT] := 1;
          IF (PARAMETERS Available)
                THEN BitVector[PARAMETERS] := 1;
          IF (SMCTRL Available)
                THEN BitVector[SMCTRL] := 1;
          IF (WAKEUP Available)
                THEN BitVector[WAKEUP] := 1;
          EAX := BitVector;

ELSE
    EAX := 0;

END;;
```

## 受影响的旗帜

None.

Use of Prefixes

LOCK 原因 #UD. 中国植物物种信息数据库.

REP* 原因 #UD(包括REPNE/REPNZ和REP/REPE/REPZ).

操作数大小 原因 #UD. 中国植物物种信息数据库.

NP 66/F2/F3 前缀不允许使用.

线段覆盖已忽略 。

地址大小已忽略 。

REX              Ignored.
