---
summary: Reunir Single Packed, Doble Empaquetado con índices de Qword firmados
---

## Descripción

Se recoge un conjunto de 8 puntos de memoria de precisión/doble de precisión apuntados por dirección base BASE ADDR e índice V INDEX con escala SCALE. El resultado está escrito en vector un registro. Los elementos se especifican a través del VSIB (es decir, el registro índice es un registro vectorial, conteniendo índices empaquetados). Los elementos sólo serán cargados si su bit de máscara correspondiente es uno. Si no se establece el bit de máscara de un elemento, el elemento correspondiente del registro de destino se deja sin cambios. El registro completo de máscaras se establecerá a cero por esta instrucción a menos que desencadena una excepción.

Esta instrucción puede suspenderse por una excepción si por lo menos un elemento ya está recogido (es decir, si la excepción es activada por un elemento que no sea el más adecuado con su conjunto de bits de máscara). Cuando esto sucede, el registro de destino y el registro de máscaras (k1) se actualizan parcialmente; los elementos que se han reunido se colocan en el registro de destino y tienen sus bits de máscara fijados a cero. Si alguna trampa o interrupción está pendiente de elementos ya recogidos, serán entregados en lugar de la excepción; en este caso, EFLAG.RF se establece a uno por lo que un punto de instrucción no es re-triggered cuando la instrucción es continuada.

Si el tamaño del elemento de datos es inferior al tamaño del elemento índice, la parte superior del registro de destino y el registro de máscaras no corresponden a ningún elemento que se esté reuniendo. Esta instrucción establece esas partes superiores a cero. Puede actualizar estos elementos no utilizados a uno o ambos registros, incluso si la instrucción desencadena una excepción, e incluso si la instrucción desencadena la excepción antes de reunir elementos.

Note that:

* Los valores pueden leerse de memoria en cualquier orden. Ordenación de memoria con otras instrucciones sigue el Intel-

64 modelo de gestión de memoria.

* Las fallas se entregan de una manera correcta a la izquierda. Es decir, si una falla es activada por un elemento y entregada, todo

Los elementos más cercanos a la LSB del destino zmm serán completados (y no predeterminados). Los elementos individuales más cercanos al MSB pueden o no ser completados. Si un elemento dado desencadena múltiples fallas, se entregan en el orden convencional.

* Los elementos pueden ser recogidos en cualquier orden, pero las faltas deben ser entregadas en orden derecho a izquierda; así, elementos a

la izquierda de un defecto uno puede ser recogido antes de la culpa es entregado. Una aplicación dada de esta instrucción es repetible - dados los mismos valores de entrada y estado arquitectónico, se reunirá el mismo conjunto de elementos a la izquierda del fallo.

* Esta instrucción no realiza cheques de AC, y así nunca entregará una falla de AC. * No válido con direcciones efectivas de 16 bits. Entregará una falla #UD.

Tenga en cuenta que la presencia de VSIB byte se aplica en esta instrucción. Por lo tanto, la instrucción fallará #UD si ModRM.rm es diferente a 100b.

Esta instrucción tiene reglas especiales disp8*N y alineación. N se considera el tamaño de un único elemento vectorial.

El índice escalado puede requerir más bits que los bits de dirección utilizados por el procesador (por ejemplo, en modo 32 bits, si la escala es mayor que uno). En este caso, los bits mas significativo más allá del número de bits de dirección son ignorados.

La instrucción fallará #UD si el vector de destino zmm1 es el mismo que el vector de índice VINDEX. La instrucción fallará #UD si se especifica el registro de máscara k0.

## Operación

```text
BASE_ADDR stands for the memory operand base address (a GPR); may not exist
VINDEX stands for the memory operand vector of indices (a ZMM register)
SCALE stands for the memory operand scalar (1, 2, 4 or 8)
DISP is the optional 1 or 4 byte displacement

VGATHERQPS (EVEX encoded version)
(KL, VL) = (2, 128), (4, 256), (8, 512)
FOR j := 0 TO KL-1

    i := j * 32
    k := j * 64
    IF k1[j] OR *no writemask*

          THEN DEST[i+31:i] :=
                MEM[BASE_ADDR + (VINDEX[k+63:k]) * SCALE + DISP]
                k1[j] := 0

          ELSE *DEST[i+31:i] := remains unchanged*
    FI;
ENDFOR
k1[MAX_KL-1:KL] := 0
DEST[MAXVL-1:VL/2] := 0

VGATHERQPD (EVEX encoded version)

(KL, VL) = (2, 128), (4, 256), (8, 512)
FOR j := 0 TO KL-1

    i := j * 64
    IF k1[j] OR *no writemask*

          THEN DEST[i+63:i] := MEM[BASE_ADDR + (VINDEX[i+63:i]) * SCALE + DISP]
                k1[j] := 0

          ELSE *DEST[i+63:i] := remains unchanged*
    FI;
ENDFOR
k1[MAX_KL-1:KL] := 0
DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ compilador intrínseco

```c
VGATHERQPD __m512d _mm512_i64gather_pd( __m512i vdx, void * base, int scale);
VGATHERQPD __m512d _mm512_mask_i64gather_pd(__m512d s, __mmask8 k, __m512i vdx, void * base, int scale);
VGATHERQPD __m256d _mm256_mask_i64gather_pd(__m256d s, __mmask8 k, __m256i vdx, void * base, int scale);
VGATHERQPD __m128d _mm_mask_i64gather_pd(__m128d s, __mmask8 k, __m128i vdx, void * base, int scale);
VGATHERQPS __m256 _mm512_i64gather_ps( __m512i vdx, void * base, int scale);
VGATHERQPS __m256 _mm512_mask_i64gather_ps(__m256 s, __mmask16 k, __m512i vdx, void * base, int scale);
VGATHERQPS __m128 _mm256_mask_i64gather_ps(__m128 s, __mmask8 k, __m256i vdx, void * base, int scale);
VGATHERQPS __m128 _mm_mask_i64gather_ps(__m128 s, __mmask8 k, __m128i vdx, void * base, int scale);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-63, "Tipo E12 Clase Condiciones de Excepción".
