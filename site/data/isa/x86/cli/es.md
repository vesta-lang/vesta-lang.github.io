---
summary: Bandera Interrupt clara
---

## Descripción

En la mayoría de los casos, CLI despeja la bandera IF en el registro EFLAGS y ninguna otra bandera se ve afectada. Limpiar la bandera IF hace que el procesador ignore interrupciones externas enmascarables. La bandera IF y la instrucción CLI y STI no tienen ningún efecto en la generación de excepciones y NMI interrumpe.

La operación es diferente en dos modos definidos como sigue:

* Modo PVI (interrupciones virtuales de movimiento protegido): CR0.PE = 1, EFLAGS.VM = 0, CPL = 3, y CR4.PVI = 1; * Modo VME (extensiones modo virtual-8086): CR0.PE = 1, EFLAGS.VM = 1, y CR4.VME = 1.

Si IOPL < 3 y el modo VME o el modo PVI está activo, CLI despeja la bandera VIF en el registro EFLAGS, dejando IF sin afectar.

En el cuadro 3-7 se indica la acción de la instrucción CLI dependiendo del modo de funcionamiento del procesador, IOPL y CPL.

```text
                   Mode                 Table 3-7. Decision Table for CLI Results  CLI Result
              Real-address                                    IOPL                    IF = 0
          Protected, not PVI2                                  X1                     IF = 0
```

CPL

```text
             Protected, PVI3                                 < CPL                 #GP fault
                                                                3                     IF = 0
        Virtual-8086, not VME3                                02                    VIF = 0
                                                                3                     IF = 0
          Virtual-8086, VME3                                  02
                                                                3                  #GP fault
                                                              02                     IF = 0
```

VIF = 0

NOTES: 1. X = Este ajuste no tiene efecto en la operación de instrucción. 2. Para esta tabla, "modo protegido" se aplica siempre que CR0.PE = 1 y EFLAGS.VM = 0; incluye el modo de compatibilidad y el modo 64-bit. 3. Modo PVI y modo virtual-8086 cada uno implica CPL = 3.

## Operación

```text
IF CR0.PE = 0
    THEN IF := 0; (* Reset Interrupt Flag *)
    ELSE
          IF IOPL  CPL (* CPL = 3 if EFLAGS.VM = 1 *)
                THEN IF := 0; (* Reset Interrupt Flag *)
                ELSE
                      IF VME mode OR PVI mode
                            THEN VIF := 0; (* Reset Virtual Interrupt Flag *)
                            ELSE #GP(0);
                      FI;
          FI;

FI;
```

## Banderas afectadas

O la bandera IF o la bandera VIF se pone a cero a 0. Otras banderas no son afectadas.
