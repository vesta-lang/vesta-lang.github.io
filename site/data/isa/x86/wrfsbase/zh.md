---
summary: 写FS/GS分部基地
---

## 说明

用 ModR/M:r/m字段表示的通用寄存器装入FS或GS段基址.

源操作数可以是32位或64位的通用寄存器. REX.W前缀表示操作数大小为64位. 如果不使用REX.W前缀,则操作数大小为32位;忽略了源寄存器的上32位,清除了基址的上32位(用于FS或GS). 此指令仅以64位模式支持.

## 行动

```text
FS/GS segment base address := SRC;
```

## 受影响的旗帜

None.

C/C++ 编译器等效

WRFSBASE 无效  writefsbase u32(未签名 int ) ; WRFSBASE writefsbase u64(未署名 int64) ; 2. WRGSBASE 无效   writegsbase u32(未签名 int ) ; WRGSBASE  writegsbase u64(未署名 int64) ; 2.
