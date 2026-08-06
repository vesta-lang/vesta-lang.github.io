---
summary: Pop Stack Into EFLAGS Register
---

## Descripción

Abre una palabra doble (POPFD) desde la parte superior de la pila (si el atributo de tamaño operativo actual es 32) y almacena el valor en el registro EFLAGS, o abre una palabra desde la parte superior de la pila (si el atributo de tamaño operativo es 16) y la almacena en los 16 bits inferiores del registro EFLAGS (es decir, el registro FLAGS). Estas instrucciones revierten el funcionamiento de las instrucciones PUSHF/PUSHFD/PUSHFQ.

Los POPF ( banderas pop) y POPFD ( banderas pop dobles) mnemonics hacen referencia al mismo código de operación. La instrucción POPF es para uso cuando el operando-size atributo es 16; la instrucción POPFD es para uso cuando el operando-size atributo es 32. Algunos montadores pueden forzar el tamaño de operando a 16 para POPF y a 32 para POPFD. Otros pueden tratar a los mnemonics como sinónimos (POPF/POPFD) y utilizar el ajuste del atributo el operando-size para determinar el tamaño de los valores a aparecer de la pila.

El efecto de POPF/POPFD en los cambios de registro EFLAGS, dependiendo del modo de operación. Vea el cuadro 4-20 y la clave abajo para más detalles.

Al operar en modo protegido, compatible o 64 bits a nivel de privilegios 0 (o en modo de direccion real, el equivalente al nivel de privilegios 0), todas las banderas no conservadas en el registro EFLAGS excepto RF1, VIP, VIF y VM pueden ser modificadas. VIP, VIF, y VM siguen sin ser afectados.

Al operar en modo protegido, compatible o de 64 bits con un nivel de privilegio superior a 0, pero inferior o igual a IOPL, todas las banderas pueden ser modificadas excepto el campo IOPL y RF, IF, VIP, VIF, y VM; estas permanecen inafectadas. Las banderas AC y ID sólo pueden ser modificadas si el operando-size atributo es 32. La bandera interrumpida (IF) se altera sólo cuando se ejecuta a un nivel al menos tan privilegiado como el IOPL. Si una instrucción POPF/POPFD es ejecutada con un privilegio insuficiente, una excepción no ocurre, pero las partes privilegiadas no cambian.

Al operar en modo virtual-8086 (EFLAGS.VM = 1) sin extensiones el modo virtual-8086 (CR4.VME = 0), las instrucciones POPF/POPFD pueden utilizarse sólo si IOPL = 3; de lo contrario, una excepción de protección general (#GP) ocurre. Si las extensiones el modo virtual-8086 están habilitadas (CR4.VME = 1), POPF (pero no POPFD) se puede ejecutar en modo virtual-8086 con IOPL < 3.

(La función virtual-interrupt de movimiento protegido -- habilitada mediante el establecimiento CR4.PVI -- afecta las instrucciones CLI y STI de la misma manera que las extensiones el modo virtual-8086. POPF, sin embargo, no está afectado por CR4.PVI.)

En modo de 64 bits, el mnemónico asignado es POPFQ (nota que el operando de 32 bits no es encodable). POPFQ pops 64 bits de la pila. Los bits reservados de RFLAGS (incluyendo los 32 bits superiores de RFLAGS) no se ven afectados.

Vea el capítulo 3 del Intel(R) 64 y el Manual del desarrollador de software de arquitecturas IA-32, Volumen 1, para obtener más información sobre los registros EFLAGS.

1. RF es siempre cero después de la ejecución de POPF. Esto se debe a que POPF, como todas las instrucciones, aclara RF mientras comienza a ejecutar.

**Efecto de POPF/POPFD en el Registro EFLAGS**

| Modo | Tamaño de operando | CPL | IOPL | 21 | 20 | 19 | 18 | 17 | 16 | 14 | 13:12 | 11 | 10 | 9 | 8 | 7 | 6 | 4 | 2 | 0 | Notas |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  | ID | VIP | VIF | AC | VM | RF | NT | IOPL | OF | DF | IF | TF | SF | ZF | AF | PF | CF |  |
| Real-Address | 16 | 0 | 0-3 | N | N | N | N | N | 0 | S | S | S | S | S | S | S | S | S | S | S |  |
| Modo | 32 | 0 | 0-3 | S | N | N | S | N | 0 | S | S | S | S | S | S | S | S | S | S | S |  |
| (CR0.PE = 0) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Protegido, | 16 | 0 | 0-3 | N | N | N | N | N | 0 | S | S | S | S | S | S | S | S | S | S | S |  |
| Compatibilidad, | 16 | 1-3 | <CPL | N | N | N | N | N | 0 | S | N | S | S | N | S | S | S | S | S | S |  |
| y 64-Bit | 16 | 1-3 | CPL | N | N | N | N | N | 0 | S | N | S | S | S | S | S | S | S | S | S |  |
| Modos | 32, 64 | 0 | 0-3 | S | N | N | S | N | 0 | S | S | S | S | S | S | S | S | S | S | S |  |
| (CR0.PE = 1 | 32, 64 | 1-3 | <CPL | S | N | N | S | N | 0 | S | N | S | S | N | S | S | S | S | S | S |  |
| EFLAGS.VM = 0) | 32, 64 | 1-3 | CPL | S | N | N | S | N | 0 | S | N | S | S | S | S | S | S | S | S | S |  |
|  | 16 | 3 | 0-2 | X | X | X | X | X | X | X | X | X | X | X | X | X | X | X | X | X | 1 |
| Virtual-8086 | 16 | 3 | 3 | N | N | N | N | N | 0 | S | N | S | S | S | S | S | S | S | S | S |  |
| (CR0.PE = 1 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| EFLAGS.VM = 1 | 32 | 3 | 0-2 | X | X | X | X | X | X | X | X | X | X | X | X | X | X | X | X | X | 1 |
| CR4.VME = 0) | 32 | 3 | 3 | S | N | N | S | N | 0 | S | N | S | S | S | S | S | S | S | S | S |  |
|  | 16 | 3 | 0-2 | N/ | N/ | SV/ | N/ | N/ | 0/ | S/ | N/X | S/ | S/ | N/ | S/ | S/ | S/ | S/ | S/ | S/ | 2,3 |
| VME |  |  |  | X | X | X | X | X | X | X |  | X | X | X | X | X | X | X | X | X |  |
| (CR0.PE = 1 | 16 | 3 | 3 | N | N | N | N | N | 0 | S | N | S | S | S | S | S | S | S | S | S |  |
| EFLAGS.VM = 1 | 32 | 3 | 0-2 | X | X | X | X | X | X | X | X | X | X | X | X | X | X | X | X | X | 1 |
| CR4.VME = 1) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | 32 | 3 | 3 | S | N | N | S | N | 0 | S | N | S | S | S | S | S | S | S | S | S |  |

## Operación

```text
IF EFLAGS.VM = 0 (* Not in Virtual-8086 Mode *)
    THEN IF CPL = 0 OR CR0.PE = 0
          THEN
                IF OperandSize = 32;
                      THEN
                            EFLAGS := Pop(); (* 32-bit pop *)
                            (* All non-reserved flags except RF, VIP, VIF, and VM can be modified;
                            VIP, VIF, VM, and all reserved bits are unaffected. RF is cleared. *)
                      ELSE IF (Operandsize = 64)
                            RFLAGS = Pop(); (* 64-bit pop *)
                            (* All non-reserved flags except RF, VIP, VIF, and VM can be modified;
                            VIP, VIF, VM, and all reserved bits are unaffected. RF is cleared. *)


                  ELSE (* OperandSize = 16 *)
                        EFLAGS[15:0] := Pop(); (* 16-bit pop *)
                        (* All non-reserved flags can be modified. *)

            FI;
      ELSE (* CPL > 0 *)

            IF OperandSize = 32
                  THEN
                        IF CPL > IOPL
                              THEN
                                    EFLAGS := Pop(); (* 32-bit pop *)
                                    (* All non-reserved bits except IF, IOPL, VIP, VIF, VM, and RF can be modified;
                                    IF, IOPL, VIP, VIF, VM, and all reserved bits are unaffected; RF is cleared. *)
                              ELSE
                                    EFLAGS := Pop(); (* 32-bit pop *)
                                    (* All non-reserved bits except IOPL, VIP, VIF, VM, and RF can be modified;
                                    IOPL, VIP, VIF, VM, and all reserved bits are unaffected; RF is cleared. *)
                        FI;
                  ELSE IF (Operandsize = 64)
                        IF CPL > IOPL
                              THEN
                                    RFLAGS := Pop(); (* 64-bit pop *)
                                    (* All non-reserved bits except IF, IOPL, VIP, VIF, VM, and RF can be modified;
                                    IF, IOPL, VIP, VIF, VM, and all reserved bits are unaffected; RF is cleared. *)
                              ELSE
                                    RFLAGS := Pop(); (* 64-bit pop *)
                                    (* All non-reserved bits except IOPL, VIP, VIF, VM, and RF can be modified;
                                    IOPL, VIP, VIF, VM, and all reserved bits are unaffected; RF is cleared. *)
                        FI;
                  ELSE (* OperandSize = 16 *)
                        EFLAGS[15:0] := Pop(); (* 16-bit pop *)
                        (* All non-reserved bits except IOPL can be modified; IOPL and all
                        reserved bits are unaffected. *)

            FI;
      FI;
ELSE (* In virtual-8086 mode *)
      IF IOPL = 3

            THEN
                IF OperandSize = 32
                        THEN
                              EFLAGS := Pop();
                              (* All non-reserved bits except IOPL, VIP, VIF, VM, and RF can be modified;
                              VIP, VIF, VM, IOPL, and all reserved bits are unaffected. RF is cleared. *)
                        ELSE
                              EFLAGS[15:0] := Pop(); FI;
                              (* All non-reserved bits except IOPL can be modified; IOPL and all reserved bits are unaffected. *)
                  FI;

            ELSE (* IOPL < 3 *)
                  IF (Operandsize = 32) OR (CR4.VME = 0)
                        THEN #GP(0); (* Trap to virtual-8086 monitor. *)
                        ELSE (* Operandsize = 16 and CR4.VME = 1 *)
                              tempFLAGS := Pop();
                              IF (EFLAGS.VIP = 1 AND tempFLAGS[9] = 1) OR tempFLAGS[8] = 1
                                    THEN #GP(0);
                                    ELSE


                                              EFLAGS.VIF := tempFLAGS[9];
                                              EFLAGS[15:0] := tempFLAGS;
                                              (* All non-reserved bits except IOPL and IF can be modified;
                                              IOPL, IF, and all reserved bits are unaffected. *)
                                  FI;
                      FI;
          FI;
FI;
```

## Banderas afectadas

Todas las banderas pueden verse afectadas; consulte la sección de Operación para más detalles.
