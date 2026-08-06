---
summary: Restaurar Sombra Salvada puntero de pila
---

## Descripción

Restores SSP de la token de la tienda de sombras apuntada por m64. Si la restauración SSP fue exitosa entonces la instrucción reemplaza el token de la tienda de sombras con un token de punta previa. La instrucción establece la bandera de CF para indicar si la dirección SSP grabada en el token de la tienda de sombras que fue procesada fue alineada de 4 byte, es decir, si se creó un agujero de alineación cuando se empujó el token de la plataforma de restauración.

Después de RSTORSSP, si se necesita guardar un token restaurador-shadow-stack en la anterior pila de sombras, utilice la instrucción SAVEPREVSSP.

Si empujar un token de la sombra de restauración en la pila de sombras previa no es necesario, el token de la salida anterior se puede colocar utilizando la instrucción INCSSPQ. Si la bandera CF se estableció para indicar la presencia de un agujero de alineación, se necesita una instrucción adicional INCSSPD para avanzar en el SSP pasado el agujero de alineación.

## Operación

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

## Banderas afectadas

CF se establece para indicar si la sombra puntero de pila en el token de restauración fue 4 byte alineado, de lo contrario se pone a cero. ZF, PF, AF, OF y SF están despejados.

C/C++ Compiler Intrinsic Equivalent RSTORSSP void  rstorssp(void *);
