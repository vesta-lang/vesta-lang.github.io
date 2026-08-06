---
summary: Cargar dirección efectiva
---

## Descripción

Cubre la dirección efectiva del segundo operando (el operando de origen) y la almacena en el primer operando (operando de destino). El operando de origen es una dirección de memoria (parte de inicio) especificada con uno de los procesadores que se dirigen modos; el operando de destino es un registro de proposito general. Los atributos de tamaño de dirección y tamaño operando afectan la acción realizada por esta instrucción, como se muestra en la tabla siguiente. El atributo de tamaño el operando de la instrucción es determinado por el registro elegido; el atributo de tamaño de dirección se determina por el atributo del segmento de código.

**Modo de 64 bits LEA Operación con Dirección y Atributos tamaño de operando**

| Tamaño de operando | Tamaño de la dirección | Action Performed |
| --- | --- | --- |
| 16 | 16 dirección efectiva de 16 bits se calcula a | nd almacenado en el destino de registro solicitado de 16 bits. |
| 16 | Se calcula una dirección efectiva de 32 bits. | Los 16 bits inferiores de la dirección se almacenan en el |
| 32 | Se calcula la dirección efectiva de 16 bits. | La dirección de 16 bits es cero-extended y almacenado en el |

**Modo de 64 bits LEA Operación con Dirección y Atributos tamaño de operando**

| Tamaño de operando | Tamaño de la dirección | Action Performed |
| --- | --- | --- |
| 16 | Se calcula una dirección efectiva de 32 bits (32 bits) | usando el prefijo 67H). Los 16 bits inferiores de la dirección son |
|  | almacenado en el registro solicitado de 16 bits | destino (utilizando el prefijo 66H). |
| 16 | Se calcula una dirección eficaz de 64 bits ( | tamaño de la dirección predeterminada). Los 16 bits inferiores de la dirección |

## Operación

```text
IF OperandSize = 16 and AddressSize = 16

    THEN
          DEST := EffectiveAddress(SRC); (* 16-bit address *)

   ELSE IF OperandSize = 16 and AddressSize = 32

          THEN
                temp := EffectiveAddress(SRC); (* 32-bit address *)
                DEST := temp[0:15]; (* 16-bit address *)

          FI;

   ELSE IF OperandSize = 32 and AddressSize = 16

          THEN
                temp := EffectiveAddress(SRC); (* 16-bit address *)
                DEST := ZeroExtend(temp); (* 32-bit address *)

          FI;

   ELSE IF OperandSize = 32 and AddressSize = 32

          THEN
                DEST := EffectiveAddress(SRC); (* 32-bit address *)

          FI;

   ELSE IF OperandSize = 16 and AddressSize = 64

          THEN
                temp := EffectiveAddress(SRC); (* 64-bit address *)
                DEST := temp[0:15]; (* 16-bit address *)

          FI;

   ELSE IF OperandSize = 32 and AddressSize = 64

          THEN
                temp := EffectiveAddress(SRC); (* 64-bit address *)
                DEST := temp[0:31]; (* 16-bit address *)

          FI;

   ELSE IF OperandSize = 64 and AddressSize = 64

          THEN
                DEST := EffectiveAddress(SRC); (* 64-bit address *)

          FI;
FI;
```

## Banderas afectadas

None.
