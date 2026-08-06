---
summary: 读取FS/GS分部基地
---

## 说明

用 FS 或 GS 段基址装入 ModR/M:r/m 字段表示的 通用寄存器 。

目标操作数可以是32位或64位的通用寄存器. REX.W前缀表示操作数大小为64位. 如果未使用REX.W前缀,则操作数大小为32位;源基地址(用于FS或GS)的上32位被忽略,目的地寄存器的上32位被清除. 此指令仅以64位模式支持.

## 行动

```text
DEST := FS/GS segment base address;
```

## 受影响的旗帜

None.

C/C++ 编译器等效

RDFSBASE 未签名 int  readfsbase u32(void ) ; RDFSBASE 未签名 int64 readfsbase u64(void ) ; RDGSBASE 未签名 int  readgsbase u32(void ) ; RDGSBASE 未签名 int64 readgsbase u64(void ) ;
