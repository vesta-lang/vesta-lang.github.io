---
summary: 将数据写入处理器追踪包
---

## 说明

本指令在 源操作数 中读取数据,并将其发送给 Intel 处理器 Trace 硬件,如果 Trigger En, Contexe En, FilterEn, 和 PTWen 全部设定为 1, 则将其编码为 PTW 包. 关于这些值的更多详情,见Intel(R)64和IA-32 Architecture Software开发者手册,第3卷C,第36.2.2节,"软件追踪仪器与PTWRITE". 如果在64位模式下使用REX.W,则数据大小为64位,否则从源操作数复制32位数据.

说明: 如果使用前缀66H,则指令会#UD.

## 行动

```text
IF (IA32_RTIT_STATUS.TriggerEn & IA32_RTIT_STATUS.ContextEn & IA32_RTIT_STATUS.FilterEn & IA32_RTIT_CTL.PTWEn) = 1
    PTW.PayloadBytes := Encoded payload size;
    PTW.IP := IA32_RTIT_CTL.FUPonPTW
    IF IA32_RTIT_CTL.FUPonPTW = 1
          Insert FUP packet with IP of PTWRITE;
    FI;

FI;
```

## 受影响的旗帜

None.
