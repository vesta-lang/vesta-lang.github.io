---
summary: 发送用户间处理器中断
---

## 说明

SENDUIPI指令发送用户间处理器中断(IPI),以其注册号操作数表示. (操作数总是有64位;操作数-大小的覆盖,如前缀66被忽略).

SENDUIPI使用一个名为用户中断目标表(UITT)的数据结构. 本表位于线性地址UITTADDR(位于IA32 UINTR TT MSR);包含UITTSZ+116字节条目,其中UITTSZ=IA32 UINT MISC[31:0]. SENDUIPI使用由指令的寄存器操作数索引的UITT条目(UITTE). 每个 UITTE 格式如下:

* 位数 0 : V,一个有效的点。 * 位数 7:1 保留,必须为 0 。 * 位数 15: 8: UV,用户中断矢量(在063范围内),所以位数15:14必须是0. * 位数63:16保留. * 位数 127: 64: UPIDADDR,一个用户张贴-中断描述符(UPID)的线性地址. (UPIDADDR为64-).

字节对齐,所以每个UITTE的位数69:64必须是0.

每个UPID都有以下格式(未引用的字段和比特保留):

* 位值 0(ON) 表示未通知 。 如果设置了此位元, 则有一个或一个

更多用户在 PIR 中中断.

* Bit 1 (SN) 表示通知应当被压制. 如果设置了此位, 代理( 包括 SENDUIPI)

在此描述符中发送用户中断时,不应发送通知。

* 位数23:16(NV)包含通知矢量. 这被发送用户中断通知的代理使用

(包括SENDUIPI).

* 位点63:32(NDST)包含通知目的地. 这是目标物理 APIC ID(在 xAPIC 模式中,

位元47:40是8位APIC ID;在x2APIC模式中,整个字段构成32位APIC ID.

* 比特127:64(PIF)包含张贴中断请求. 每个用户中断向量都有一个位 。 有一个

如果对应位数为 1,则用户中断请求向量 。

虽然SENDUIPI可以在任何特权级别执行,但所有指令的内存访问(一个UITTE和一个UPID)都是以监督特权执行的.

SENDUIPI发送用户中断,在UPIDADDR引用的UPID中发布用户中断矢量V,然后作为普通的IPI发送该UPID中指定中断的任何通知.

## 行动

```text
    IF reg > UITTSZ;
          THEN #GP(0);

    FI;
    read tempUITTE from 16 bytes at UITTADDR+ (reg << 4);
    IF tempUITTE.V = 0 or tempUITTE sets any reserved bit

          THEN #GP(0);
    FI;


read tempUPID from 16 bytes at tempUITTE.UPIDADDR;// under lock
IF tempUPID sets any reserved bits or bits that must be zero

      THEN #GP(0); // release lock
FI;
tempUPID.PIR[tempUITTE.UV] := 1;
IF tempUPID.SN = tempUPID.ON = 0

      THEN
            tempUPID.ON := 1;
            sendNotify := 1;

      ELSE sendNotify := 0;
FI;
write tempUPID to 16 bytes at tempUITTE.UPIDADDR;// release lock
IF sendNotify = 1

      THEN
            IF local APIC is in x2APIC mode
                  THEN send ordinary IPI with vector tempUPID.NV
                        to 32-bit physical APIC ID tempUPID.NDST;
                  ELSE send ordinary IPI with vector tempUPID.NV
                        to 8-bit physical APIC ID tempUPID.NDST[15:8];
            FI;

FI;
```

## 受影响的旗帜

None.
