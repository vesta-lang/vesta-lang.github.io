---
summary: 无效进程- 文本标识符
---

## 说明

在翻译的外观边缓冲器(TLBs)和基于进程文本标识符(PCID)的 page-结构缓存中将映射无效. (参见第5.10节,"Caching transformation Intel 64和IA-32 Architecture Software's Handory,Volume 3A.) 无效化是基于寄存器操作中指定的INVPCID类型和内存操作中指定的INVPCID描述符.

在64位模式外,寄存器操作数总是32位,无论CS.D的值如何. 在64位模式下,寄存器操作数有64位.

目前定义的INVPCID类型有四种:

* 个人地址无效 : 如果 INVPCID 类型为 0,则逻辑处理器将线性地址的映射-除全局翻译-和 INVPCID 描述符中指定的 PCID 无效。 1 在某些情况下,该指令也可能使其他线性地址(或其他PCID)的全局翻译或映射无效。

* 单文本无效 : 如果 INVPCID 类型是 1, 逻辑处理器将所有映射无效 - 例外

与 INVPCID 描述符中指定的 PCID 关联的全局翻译。 在某些情况下,该指示也可能使其他PCID的全球翻译或绘图无效。

* 全文本无效, 包括全局翻译 : 如果 INVPCID 类型为 2, 逻辑处理器无效

所有绘图 - 包括全局翻译 - 与任何 PCID 相关。

* 全文本无效 : 如果 INVPCID 类型为 3, 逻辑处理器将所有映射无效 - 环球除外

与任何 PCID 相关的翻译。 在某些情况下,该指示也可能使全球翻译无效。

INVPCID描述符包含128位元,包含一个PCID和一个线性地址,如图3-20所示. 对于INVPCID类型0,处理器甚至使用64位模式外的全64位线性地址;线性地址不用于其他INVPCID类型.

```text
                    127                                        64 63               12 11 0
```

```text
                                  Linear Address                      Reserved (must be zero) PCID
```

图3-20. INVPCID 描述符

1. 联合国 如果page结构使用大于4 KBytes的页面映射线性地址,且该页面有多个TLB条目(见第5.10.2.3节,"TLB使用的细节",Intel(R)64和IA-32架构软件开发者手册第3A卷),则指令将所有条目无效.

如果 CR4.PCIDE = 0,则逻辑处理器不会缓存除 000H 以外的任何 PCID 信息. 在这种情况下,

处决INVPCID类型 0 和 1 只有在PCID定义INVPCID描述符是000H;

使用 INVPCID 类型 2 和 3 无效映射 PCID 000H 执行. 注意CR4.PCIDE必须是IA-32e模式外的0(见第5.10.1节,Intel(R)64和IA-32 Archi-)的"Process-Context Identifiers (PCIDs)".

构造软件开发者手册,第3A卷。

## 行动

```text
INVPCID_TYPE := value of register operand;      // must be in the range of 03

INVPCID_DESC := value of memory operand;

CASE INVPCID_TYPE OF

0:             // individual-address invalidation

       PCID := INVPCID_DESC[11:0];

       L_ADDR := INVPCID_DESC[127:64];

       Invalidate mappings for L_ADDR associated with PCID except global translations;

       BREAK;

1:             // single PCID invalidation

       PCID := INVPCID_DESC[11:0];

       Invalidate all mappings associated with PCID except global translations;

       BREAK;

2:             // all PCID invalidation including global translations

       Invalidate all mappings for all PCIDs, including global translations;

       BREAK;

3:             // all PCID invalidation retaining global translations

       Invalidate all mappings for all PCIDs except global translations;

       BREAK;

ESAC;
```

## Intel C/C++ 内在编译器

```c
INVPCID void _invpcid(unsigned __int32 type, void * descriptor);
```

## SIMD 浮点 例外

None.
