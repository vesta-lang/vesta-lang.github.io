---
summary: 保存上一个阴影 栈指针
---

## 说明

在下一个 8 字节对齐的边界上, 在上一个阴影堆栈上按下一个还原- 阴影- stack 符号 。 之前的SSP是从当前阴影堆栈顶部的先前ssp令牌获得的.

## 行动

```text
IF CPL = 3
    IF (CR4.CET & IA32_U_CET.SH_STK_EN) = 0
          THEN #UD; FI;

ELSE
    IF (CR4.CET & IA32_S_CET.SH_STK_EN) = 0
          THEN #UD; FI;

FI;

IF SSP not aligned to 8 bytes
    THEN #GP(0); FI;

(* Pop the "previous-ssp" token from current shadow stack *)
previous_ssp_token = ShadowStackPop8B(SSP)

(* If the CF flag indicates there was a alignment hole on current shadow stack then pop that alignment hole *)
(* Note that the alignment hole must be zero and can be present only when in legacy/compatibility mode *)
IF RFLAGS.CF == 1 AND (IA32_EFER.LMA AND CS.L)

    #GP(0)
FI;
IF RFLAGS.CF == 1

    must_be_zero = ShadowStackPop4B(SSP)
    IF must_be_zero != 0 THEN #GP(0)
FI;

(* Previous SSP token must have the bit 1 set *)
IF ((previous_ssp_token & 0x02) == 0)

    THEN #GP(0); (* bit 1 was 0 *)

IF ((IA32_EFER.LMA AND CS.L) = 0 AND previous_ssp_token [63:32] != 0)
THEN #GP(0); FI; (* If compatibility/legacy mode and SSP not in 4G *)

(* Save Prev SSP from previous_ssp_token to the old shadow stack at next 8 byte aligned address *)
old_SSP = previous_ssp_token & ~0x03
temp := (old_SSP | (IA32_EFER.LMA & CS.L));
Shadow_stack_store 4 bytes of 0 to (old_SSP - 4)
old_SSP := old_SSP & ~0x07;


Shadow_stack_store 8 bytes of temp to (old_SSP - 8)
```

## 受影响的旗帜

None.

C/C++ 编译器 Intrinsic Equivalent SAVEPREVSSP 无效 saveprevssp(void) ;
