---
summary: Tienda Integer Con Truncation
---

## Descripción

FISTTP convierte el valor en ST en un entero firmado utilizando truncation (chop) como modo de redondeo, transfiere el resultado al destino y pop ST. FISTTP acepta destinos de palabra, entero corto y entero largo.

La siguiente tabla muestra los resultados obtenidos al almacenar varias clases de números en formato entero.

** Resultados FISTTP**

| - | or | Relación calidad/precio demasiado grande para DEST Formato | * |
| --- | --- | --- | --- |
| F | -1 |  | -I |
| -1<F< | +1 |  | 0 |
| FS+ 1 |  |  | +I |

## Operación

```text
DEST := ST;
pop ST;
```

## Banderas afectadas

C1 is cleared; C0, C2, C3 undefined.

## Excepciones numéricas

Inválido, Stack Invalid (bajo corriente de establo), Precisión.
