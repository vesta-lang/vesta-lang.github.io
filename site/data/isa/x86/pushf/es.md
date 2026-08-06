---
summary: Empuje EFLAGS Registro en el establo
---

## Descripción

Decrementa el puntero de la pila por 4 (si el atributo de operand-size actual es 32) y empuja todo el contenido del registro EFLAGS en la pila, o decree el puntero de la pila por 2 (si el atributo de tamaño operativo es 16) y empuja los 16 bits inferiores del registro EFLAGS (es decir, el registro FLAGS) en la pila. Estas instrucciones revierten el funcionamiento de las instrucciones POPF/POPFD.

Al copiar todo el registro EFLAGS a la pila, las banderas VM y RF (bits 16 y 17) no se copian; en cambio, los valores para estas banderas se limpian en la imagen EFLAGS almacenada en la pila. Ver el capítulo 3 del Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1, para obtener más información sobre el registro EFLAGS.

Los PUSHF (filh flags) y PUSHFD (push flags double) mnemonics hacen referencia al mismo código de operación. La instrucción PUSHF es para uso cuando el operando-size atributo es 16 y la instrucción PUSHFD para cuando el operando-size atributo es 32. Algunos montadores pueden forzar el tamaño de operando a 16 cuando se utiliza PUSHF y a 32 cuando se utiliza PUSHFD. Otros pueden tratar estos mnemonics como sinónimos (PUSHF/PUSHFD) y utilizar el ajuste actual del atributo el operando-size para determinar el tamaño de los valores a ser empujados de la pila, independientemente de la mnemónica utilizada.

En modo de 64 bits, la operación predeterminada de la instrucción es decrementar el puntero de pila (RSP) por 8 y empuja RFLAGS en la pila. La operación de 16 bits se soporta utilizando el tamaño de operando override prefix 66H. 32-bit tamaño de operando no se puede codificar en este modo. Al copiar RFLAGS a la pila, las banderas VM y RF (bits 16 y 17) no se copian; en cambio, los valores para estas banderas se limpian en la imagen RFLAGS almacenada en la pila.

Al operar en modo virtual-8086 (EFLAGS.VM = 1) sin extensiones el modo virtual-8086 (CR4.VME = 0), las instrucciones PUSHF/PUSHFD pueden utilizarse sólo si IOPL = 3; de lo contrario, una excepción de protección general (#GP) ocurre. Si las extensiones el modo virtual-8086 están habilitadas (CR4.VME = 1), PUSHF (pero no PUSHFD) se puede ejecutar en modo virtual-8086 con IOPL < 3.

(La función virtual-interrupt de movimiento protegido -- habilitada mediante el establecimiento CR4.PVI -- afecta las instrucciones CLI y STI de la misma manera que las extensiones el modo virtual-8086. PUSHF, sin embargo, no está afectado por CR4.PVI.)

En el modo de direccion real, si el registro ESP o SP es 1 cuando la instrucción PUSHF/PUSHFD ejecuta: una excepción #SS se genera pero no se entrega (el error de pila reportado previene la entrega de #SS). A continuación, el procesador genera una excepción #DF y entra en un estado de apagado como se describe en la discusión #DF en el Capítulo 7 del Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 3A.

## Operación

```text
IF (PE = 0) or (PE = 1 and ((VM = 0) or (VM = 1 and IOPL = 3)))
(* Real-Address Mode, Protected mode, or Virtual-8086 mode with IOPL equal to 3 *)

    THEN
          IF OperandSize = 32
                THEN
                      push (EFLAGS AND 00FCFFFFH);
                      (* VM and RF bits are cleared in image stored on the stack *)
                ELSE
                      push (EFLAGS); (* Lower 16 bits only *)


          FI;

    ELSE IF 64-bit MODE (* In 64-bit Mode *)
          IF OperandSize = 64
                THEN
                      push (RFLAGS AND 00000000_00FCFFFFH);
                      (* VM and RF bits are cleared in image stored on the stack; *)
                ELSE
                      push (EFLAGS); (* Lower 16 bits only *)
          FI;

    ELSE (* In Virtual-8086 Mode with IOPL less than 3 *)
          IF (CR4.VME = 0) OR (OperandSize = 32)
                THEN #GP(0); (* Trap to virtual-8086 monitor *)
                ELSE
                      tempFLAGS = EFLAGS[15:0];
                      tempFLAGS[9] = tempFLAGS[19]; (* VIF replaces IF *)
                      tempFlags[13:12] = 3; (* IOPL is set to 3 in image stored on the stack *)
                      push (tempFLAGS);
          FI;

FI;
```

## Banderas afectadas

None.
