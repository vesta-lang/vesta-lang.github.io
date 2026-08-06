---
summary: Shuffle Palabras empaquetadas
---

## Descripción

Copia las palabras deel operando de origen(segundooperando) y los inserta enel operando de destino(primero)operando) en las ubicaciones de palabras seleccionadas con el pedidooperando(terceroperando). Esta operación es similar a la operación utilizada por la instrucción PSHUFD, que se ilustra en la Figura 4-16. Para la instrucción PSHUFW, cada campo de 2 bits en el orden operando selecciona el contenido de una palabra localización en el operando de destino. Las codificaciones del orden operando campos seleccionan palabras del operando de origen para ser copiadas al operando de destino.

El operando de origen puede ser un registro de tecnología MMX o una ubicación de memoria de 64 bits. El operando de destino es un registro de tecnología MMX. La orden operando es una inmediata de 8 bits. Tenga en cuenta que esta instrucción permite que una palabra en el operando de origen sea copiada a más de una palabra localización en el operando de destino.

En modo de 64 bits, el uso de un prefijo REX en forma de REX.R permite esta instrucción para acceder a registros adicionales (XMM8-XMM15).

## Operación

```text
DEST[15:0] := (SRC >> (ORDER[1:0] * 16))[15:0];
DEST[31:16] := (SRC >> (ORDER[3:2] * 16))[15:0];
DEST[47:32] := (SRC >> (ORDER[5:4] * 16))[15:0];
DEST[63:48] := (SRC >> (ORDER[7:6] * 16))[15:0];
```

## Intel C/C++ compilador intrínseco

```c
PSHUFW __m64 _mm_shuffle_pi16(__m64 a, int n);
```

## Banderas afectadas

None.

## Excepciones numéricas

None.

## Otras excepciones

Véase la sección 25.25.3, "Excepción de condiciones de Legacy SIMD Instrucciones de funcionamiento en los registros MMX" en el manual de desarrollo de software de arquitecturas Intel(R) 64 e IA-32, Volumen 3B.
