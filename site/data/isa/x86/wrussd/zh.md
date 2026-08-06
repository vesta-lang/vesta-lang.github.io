---
summary: 写入用户阴影堆栈
---

## 说明

在寄存器来源中将字节写入用户阴影堆栈 pag 。

## 行动

```text
IF CR4.CET = 0
    THEN #UD; FI;

IF CPL > 0
    THEN #GP(0); FI;

DEST_LA = Linear_Address(mem operand)
IF (operand size is 64 bit)

    THEN
          (* Destination not 8B aligned *)
          IF DEST_LA[2:0]
                THEN GP(0); FI;
          Shadow_stack_store 8 bytes of SRC to DEST_LA as user-mode access;

    ELSE
          (* Destination not 4B aligned *)
          IF DEST_LA[1:0]
                THEN GP(0); FI;
          Shadow_stack_store 4 bytes of SRC[31:0] to DEST_LA as user-mode access;

FI;
```

## 受影响的旗帜

None.

C/C++ 编译器等效

WRUSSD 无效  wrussd(  int32,无效 *); WRUSSQ 无效  wrussq(  int64,无效 *);
