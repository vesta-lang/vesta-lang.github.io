---
summary: Save x87 FPU, MMX Technology, and SSE State
---

## Descripción

Ahorra el estado actual de la tecnología x87 FPU, MMX, XMM y MXCSR se registra a una ubicación de memoria de 512 bytes especificado en el operando de destino. El diseño de contenido de la región de 512 byte depende de si el procesador está operando en modos de operación no-64-bit o submodo de 64-bits del modo IA-32e.

Los bytes 464:511 están disponibles para el uso del software. El procesador no escribe a bytes 464:511 de un área FXSAVE.

La operación de FXSAVE en modos no-64-bit se describe primero.

Operación del modo no 64-Bit

La tabla 3-45 muestra el diseño de la información del estado en memoria cuando el procesador está operando en modos heredados.

**No-64-Bit-Mode Layout de FXSAVE y FXRSTOR Memory Region**

| 15 | 14 | 13 | 12 | 11 | 10 | 9 | 8 | 7 | 6 | 5 | 4 | 3 | 2 | 1 | 0 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Rsvd |  | FCS |  |  | FIP[31:0] |  |  | FOP | Rsvd | FTW |  | FSW |  |  | FCW           0 |

**No-64-Bit-Mode Diseño de FXSAVE y FXRSTOR Región de la Memoria (Contd.)**

| 15 | 14 | 13 | 12 | 11 | 10 | 9 | 8 | 7 | 6 | 5 | 4 | 3 | 2 | 1 | 0 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Rsvd |  | FCS |  |  | FIP[31:0] |  |  | FOP | Rsvd | FTW |  | FSW |  |  | FCW           0 |

**Recrear el formato FSAVE**

| Exponent | Exponent | Fracción | J y M | FTW | válido | bit |
| --- | --- | --- | --- | --- | --- | --- |
| todo 1 | todo 0 | todo 0 | bits |  |  | x87 FTW |
| 0 | 0 | 0 | 0x |  | 1 | Especial 10 |
| 0 | 0 | 0 | 1x |  | 1 | Válida 00 |
| 0 | 0 | 1 | 00 |  | 1 | Especial 10 |
| 0 | 0 | 1 | 10 |  | 1 | Válida 00 |
| 0 | 1 | 0 | 0x |  | 1 | Especial 10 |
| 0 | 1 | 0 | 1x |  | 1 | Especial 10 |
| 0 | 1 | 1 | 00 |  | 1 | Cero 01 |
| 0 | 1 | 1 | 10 |  | 1 | Especial 10 |
| 1 | 0 | 0 | 1x |  | 1 | Especial 10 |
| 1 | 0 | 0 | 1x |  | 1 | Especial 10 |
| 1 | 0 | 1 | 00 |  | 1 | Especial 10 |
| 1 | 0 | 1 | 10 |  | 1 | Especial 10 |

**Disposición del Modo de 64-Bit FXSAVE64 Mapa (Requiere REX.W = 1)**

| 15 | 14 | 13 | 12 | 11 | 10 | 9 | 8 | 7 | 6 | 5 | 4 | 3 | 2 | 1 | 0 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  |  |  | FIP |  |  |  |  | FOP |  | Reservado FT | W | FSW |  | FCW | 0 |

**Elaboración del Modo de 64-Bit FXSAVE Mapa (REX.W = 0)**

| 15 | 14 | 13 | 12 | 11 | 10 | 9 | 8 | 7 | 6 | 5 | 4 | 3 | 2 | 1 | 0 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Rese | rved | FCS |  |  | FIP[31: | 0] |  | FOP |  | Reservado | FTW | FSW |  | FCW | 0 |
|  | MXCSR_ | MASK |  |  | MXCSR |  |  | Reservado |  | FDS |  |  | FDP[31:0] |  | 16 |

## Operación

```text
IF 64-Bit Mode
    THEN
          IF REX.W = 1
                THEN
                      DEST := Save64BitPromotedFxsave(x87 FPU, MMX, XMM15-XMM0,
                      MXCSR);
                ELSE
                      DEST := Save64BitDefaultFxsave(x87 FPU, MMX, XMM15-XMM0, MXCSR);
          FI;
    ELSE
          DEST := SaveLegacyFxsave(x87 FPU, MMX, XMM7-XMM0, MXCSR);

FI;
```
