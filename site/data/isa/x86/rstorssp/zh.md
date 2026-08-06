---
summary: 恢复已保存的阴影 栈指针
---

## 说明

从 m64 指向的阴影-stack-restore 符号中恢复 SSP. 如果 SSP 恢复成功,则指令会用前缀符号取代阴影存储符号. 指令设置了CF旗,以表示所处理的阴影-stack-restore符号中记录的SSP地址是否为4字节对齐,即当恢复-sshadow-stack符号被推到这个阴影堆栈时是否创建了对齐孔.

RSTORSSP之后,如果需要保存在上一个阴影堆栈上的还原-阴影-stack符号,则使用SAVEPREVSSP指令.

如果不需要在前一个阴影堆栈上按下还原-阴影-stack令牌,则前一个ssp令牌可以使用INCSSPQ指令弹出. 如果设定了CF旗以表示一个对齐孔的存在,则需要额外的INCSSPD指令来推进SSP通过对齐孔.

## 行动

```text
IF CPL = 3
    IF (CR4.CET & IA32_U_CET.SH_STK_EN) = 0
          THEN #UD; FI;

ELSE
    IF (CR4.CET & IA32_S_CET.SH_STK_EN) = 0
          THEN #UD; FI;

FI;

SSP_LA = Linear_Address(mem operand)
IF SSP_LA not aligned to 8 bytes

    THEN #GP(0); FI;

previous_ssp_token = SSP | (IA32_EFER.LMA AND CS.L) | 0x02
Start Atomic Execution
restore_ssp_token = Locked shadow_stack_load 8 bytes from SSP_LA
fault = 0

IF ((restore_ssp_token & 0x03) != (IA32_EFER.LMA & CS.L))
    THEN fault = 1; FI; (* If L flag in token does not match IA32_EFER.LMA & CS.L or bit 1 is not 0 *)

IF ((IA32_EFER.LMA AND CS.L) = 0 AND restore_ssp_token[63:32] != 0)
    THEN fault = 1; FI; (* If compatibility/legacy mode and SSP to be restored not below 4G *)

TMP = restore_ssp_token & ~0x01
TMP = (TMP - 8)
TMP = TMP & ~0x07
IF TMP != SSP_LA


THEN fault = 1; FI; (* If address in token does not match the requested top of stack *)

TMP = (fault == 0) ? previous_ssp_token : restore_ssp_token
shadow_stack_store 8 bytes of TMP to SSP_LA and release lock
End Atomic Execution

IF fault == 1
  THEN #CP(RSTORSSP); FI;

SSP = SSP_LA

// Set the CF if the SSP in the restore token was 4 byte aligned, i.e., there is an alignment hole
RFLAGS.CF = (restore_ssp_token & 0x04) ? 1 : 0;
RFLAGS.ZF,PF,AF,OF,SF := 0;
```

## 受影响的旗帜

CF被设定为表示恢复符中的阴影栈指针是否为4字节对齐,否则清除. ZF、PF、AF、OF和SF被清除。

C/C++ 编译器内置等效 RSTORSSP 空格  rstorssp(void *);
