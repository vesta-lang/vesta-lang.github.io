---
summary: Identificación CPU
---

## Descripción

La bandera de identificación (bit 21) en el registro EFLAGS indica soporte para la instrucción CPUID. Si un procedimiento de software puede establecer y aclarar esta bandera, el procesador que ejecuta el procedimiento es compatible con la instrucción CPUID. Esta instrucción opera lo mismo en modos no-64-bit y modo 64-bit.

CPUID devuelve la identificación de procesadores e información de características en los registros EAX, EBX, ECX y EDX.1 La salida de la instrucción depende del contenido del registro EAX sobre ejecución y, en algunos casos, ECX.

Capítulo 21, "Identificación del Procesador y Determinación de Característica", en el Volumen 1 del Intel(R) 64 e IA-32 Architectures Software Developer's Manual proporciona información CPUID hoja y muestra información devuelta, dependiendo del valor inicial cargado en los registros EAX y ECX.

CPUID se puede ejecutar a cualquier nivel de privilegio para serializar la ejecución de la instrucción. Serializar la ejecución de la instrucción garantiza que cualquier modificación a las banderas, registros y memoria de instrucciones anteriores se complete antes de que la siguiente instrucción sea traída y ejecutada. Aunque la instrucción CPUID proporciona serialización, no es el método preferido en los procesadores más nuevos que apoyan la instrucción SERIALIZE. Ver "Serializing Instructions" en el Capítulo 11 de Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 3A para más detalles.

La ejecución de CPUID causa una salida VM cuando se ejecuta en VMX operación no raíz. Ver Capítulo 27, "Estructuras de Control de Máquinas Virtuales", de Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 3C para más detalles.

## Compatibilidad de arquitectura IA-32

CPUID no es compatible con los primeros modelos del procesador Intel486 o en cualquier procesador IA-32 antes que el procesador Intel486.

## Operación

```text
IA32_BIOS_SIGN_ID MSR := Update with installed microcode revision number;
(* Note that for some leaf values in EAX, the subleaf value in ECX is ignored. *)
(* Note that for invalid CPUID leaves and subleaves, the output values returned in EAX, EBX, ECX, and EDX are "Reserved" *)
(* Refer to Volume 1, Chapter 21 for details surrounding CPUID_INFO() *)
(EAX, EBX, ECX, EDX) := CPUID_INFO(EAX, ECX)
```

## Banderas afectadas

None.

## CPUID hojas

CHAPTER 21

Al escribir software destinado a ejecutar en procesadores Intel, es necesario identificar el tipo de procesador presente en un sistema y las características del procesador que están disponibles para una aplicación. La instrucción CPUID, conocida como Identificación CPU, fue introducida con el procesador Intel(R) Pentium para consultar el espacio de nombres de información del procesador para su identidad y características compatibles. Lógicamente, el espacio de nombre CPUID comprende una serie de nodos indexados por hoja (utilizando el valor de entrada de EAX) y en algunos casos más indexados por subhoja (utilizando el valor de entrada de ECX). El valor de un nodo queried se devuelve en EAX, EBX, ECX y EDX. Tenga en cuenta que no todos las hojas tienen índice subhoja y el valor de entrada ECX será ignorado en esos casos. La descripción completa de CPUID se puede encontrar en el Capítulo 3 del Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 2A. Todas las referencias a "MAX LEAF" a lo largo de este capítulo se utilizan como una abreviatura de "CPUID.00H:EAX.MAX_LEAF".

### 21.1 IMPORTANT CONSIDERATIONS WHEN USINGTHE CPUID INSTRUCTION

Esta sección describe factores adicionales a considerar al utilizar la instrucción CPUID.

#### 21.1.1 Directrices para el uso de la instrucción CPUID

Utilice la instrucción CPUID para la identificación de procesadores en la familia de procesadores Pentium M, familia de procesadores Pentium 4, familia de procesadores Intel Xeon, familia P6, procesador Pentium, y más tarde procesadores Intel486. Esta instrucción devuelve a la familia, modelo y (para algunos procesadores) una cadena de marca para el procesador que ejecuta la instrucción. También indica las características que están presentes en el procesador y da información sobre los caches del procesador y TLB. La bandera de identificación (bit 21) en el registro EFLAGS indica soporte para la instrucción CPUID. Si un procedimiento de software puede establecer y aclarar esta bandera, el procesador que ejecuta el procedimiento es compatible con la instrucción CPUID. La instrucción CPUID causará la excepción de código de operación no válido (#UD) si se ejecuta en un procesador que no lo apoya. Para obtener información de identificación del procesador, el valor un operando de origen se coloca en el registro EAX para seleccionar el tipo de información que se devolverá. Cuando se ejecuta la instrucción CPUID, la información seleccionada se devuelve en los registros EAX, EBX, ECX y EDX. Las siguientes pautas son las más importantes y siempre deben seguirse al utilizar la instrucción CPUID para determinar las características disponibles:

* Siempre comienzan por las pruebas para el "GenuineIntel", mensaje en el EBX, EDX y ECX se registra cuando el CPUID

instrucción se ejecuta con EAX igual a 0. Si el procesador no es Intel genuino, las banderas de identificación de características pueden tener diferentes significados que se describen en la documentación de Intel.

* Prueba de características de identificación banderas individualmente y no hacer suposiciones sobre bits no definidos.

#### 21.1.2 Identificación de procesadores anteriores

La instrucción CPUID no está disponible en procesadores Intel anteriores a través de los procesadores Intel 486 anteriores. Para estos procesadores, se pueden explotar varias otras características arquitectónicas para identificar al procesador. Los ajustes de los bits 12 y 13 (IOPL), 14 (NT), y 15 (reservados) en el registro EFLAGS son diferentes para los procesadores de 32 bits de Intel que para los procesadores Intel 8086 e Intel 286. Al examinar la configuración de estos bits (con las instrucciones PUSHF/PUSHFD y POPF/POPFD), un programa de aplicación puede determinar si el procesador es un 8086, Intel 286, o uno de los procesadores Intel 32-bit:

* 8086 procesador -- Bits 12 a 15 del registro EFLAGS siempre se establecen. * Procesador Intel 286 -- Bits 12 a 15 son siempre claros en modo de direccion real.

* Procesadores de 32 bits -- En modo de direccion real, el bit 15 siempre es claro y los bits 12 a 14 tienen el último valor

cargado en ellos. En modo protegido, el bit 15 es siempre claro, el bit 14 tiene el último valor cargado en él, y los bits IOPL dependen del nivel de privilegio actual (CPL). El campo IOPL se puede cambiar sólo si el CPL es 0. Otros bits de registro EFLAGS que se pueden utilizar para diferenciar entre los procesadores de 32 bits:

* Bit 18 (AC) -- Aplicado sólo en los procesadores Pentium 4, Intel Xeon, P6 family, Pentium e Intel486.

La imposibilidad de establecer o aclarar este bit distingue a un procesador Intel386 de los procesadores IA-32 posteriores.

* Bit 21 (ID) -- Determina si el procesador es capaz de ejecutar la instrucción CPUID. La capacidad de establecer y aclarar

este bit indica que es un Pentium 4, Intel Xeon, P6 familia, Pentium, o procesador Intel486 de versión posterior. Para determinar si una extensión de procesador x87 FPU o Numeric (NPX) está presente en un sistema, las aplicaciones pueden escribir a los registros de estado y control x87 FPU utilizando la instrucción FNINIT y luego verificar que los valores correctos se leen usando la instrucción FNSTENV. Después de determinar que un x87 FPU o NPX está presente, su tipo puede ser determinado. En la mayoría de los casos, el tipo de procesador determinará el tipo de FPU o NPX; sin embargo, un procesador Intel386 es compatible con un coprocesador Intel 287 o Intel 387. El método que el coprocesador utiliza para representar (después de la ejecución de la instrucción FINIT, FNINIT o RESET) indica qué coprocesador está presente. El coprocesador de matemáticas Intel 287 utiliza la misma representación de bits para + y -; mientras que, el coprocesador de matemáticas Intel 387 utiliza diferentes representaciones para + y -.

#### 21.1.3 CPUID Rango básico y extendido

La gama básica CPUID comienza en CPUID.00H y termina en el máximo hoja enumerado en CPUID.00H:EAX.MAX_LEAF[31:0]. El conjunto legado de CPUID hojas se define como hojas 00H, 01H y 02H, que representan la arquitectura hasta y incluyendo Pentium II. Los procesadores proporcionaron compatibilidad heredada limitando el número expuesto de hojas a sólo estos hojas heredados estableciendo IA32 MISC ENABLE[22] (Limit CPUID Maxval). Esto ya no se apoya en los procesadores que reportan CPUID.07H.01H:EBX.CPUIDMAXVAL_LIM_RMV[3] como 1; para tales procesadores, IA32 MIS- C ENABLE[22] no se puede establecer a 1 para limitar el valor devuelto por CPUID.00H:EAX.MAX_LEAF. La amplia gama CPUID comienza en hoja 80000000H y termina en el máximo hoja enumerado en CPUID.80000000H:EAX.MAX_EXTENDED_LEAF[31:0]. Los procesadores más antiguos antes del Pentium 4 no apoyan la ampliaciónCPUIDrango y tratar bit 31 deCPUID's inputEAXvalor como cero. Si un valor introducido para CPUID.EAX es más alto que el valor máximo de entrada para la función básica o extendida para ese procesador, entonces los datos para la información básica más alta hoja es devuelto. El software no debe depender de los valores devueltos por el procesador fuera de los rangos anteriores. El rango CPUID.40000000H a CPUID.4FFFFFFFH no devuelve información de características para el procesador. Estos se asignan para la emulación por software.

#### 21.1.4 CPUID Domains

Los campos de cada nodo CPUID se clasifican en uno de varios dominios CPUID. Los campos pueden clasificarse por separado dentro de un nodo específico o en conjunto para todos los nodos en una hoja o subhoja. En una plataforma correctamente configurada, todos los procesadores lógicos dentro de un dominio CPUID devuelven un valor de salida consistente para campos pertenecientes a ese dominio. Como ejemplo, el valor inicial de identificación X2APIC devuelto en CPUID.1FH.00H:EDX[31:0] se clasifica como estar en el dominio del procesador lógico porque el valor es único para cada procesador lógico en la plataforma. Mientras que el tamaño de la línea CLFLUSH devuelto en CPUID.00H:EBX[15:8] se clasifica como Dominio de la Plataforma porque debe ser consistente para todo procesador lógico dentro de toda la plataforma.

* Plataforma Dominio--Una plataforma correctamente configurada proporcionaría valores consistentes para estos campos CPUID

cada procesador lógico en la plataforma.

* Dominio del paquete--Una plataforma correctamente configurada proporciona valores consistentes para estos campos CPUID para cada uno

procesador lógico dentro del mismo paquete procesador. Estos valores, sin embargo, pueden ser diferentes al comparar los valores de los procesadores lógicos en diferentes paquetes.

* Dominio del procesador lógico--Una plataforma configurada correctamente puede proporcionar diferentes valores para estos CPUID

campos para cada procesador lógico en la plataforma. Los valores contenidos dentro de estos pueden tener su propio alcance según un recurso compartido específico (es decir, caché, híbrido, etc.); en ese caso, cada procesador lógico puede tener que ser preguntado para obtener la visión completa de la plataforma de características dadas.

#### 21.1.5 CPUID Runtime Mutable Fields

Se dice que un campo CPUID es mutable si puede cambiar durante el tiempo de ejecución. Estos campos se ven afectados por operaciones de control-modo que pueden afectar el modo de procesador, bits de estado o registros privilegiados. En el cuadro 21-1 se muestran campos mutables que se espera cambiar dinámicamente como parte de la operación normal. En el cuadro 21-2 se muestran las esferas mutables que deben seguir siendo coherentes. Tenga en cuenta que todos los controles enumerados pueden no estar disponibles en todos los procesadores Intel.

**Campos Mutable CPUID de la tarde se espera cambiar durante la operación normal**

| Hoja | Subhoja | Registro | Nombre del campo | Descripción y Control de Mutabilidad |
| --- | --- | --- | --- | --- |
| 01H | Ignorado | ECX[27] | OSXSAVE | Si 1, el sistema operativo ha establecido CR4.OSXSAVE[bit 18] para habilitar las instrucciones XSETBV/XGETBV para acceder a XCR0 y para apoyar la gestión estatal ampliada del procesador utilizando XSAVE/XRSTOR. |
| 07H | 00H | ECX[4] | OSPKE | Si 1, OS ha establecido CR4.PKE para permitir la protección claves (y las instrucciones RDPKRU/WRPKRU). |
| 0DH | 00H | EBX[31:0] | XSAVE_BYTES_ ENABLED_FEATURE | El tamaño del área XSAVE/XRSTOR requerido para los bits estatales habilitados en XCR0. |
| 0DH | 01H | EBX[31:0] | XSAVE_BYTES_ ENABLED_FEATURE | El tamaño de la zona XSAVES/XRSTORS requerida para los bits estatales habilitados en XCR0 e IA32 XSS. |
| 19H | 00H | EBX[0] | AESKLE | Si 1, si las instrucciones AES Key Locker han sido activadas por el firmware del sistema y el sistema operativo ha establecido CR4.KL[bit 19] = 1. |
| 80000001H | Ignorado | EDX[20] | SYSCALL_SYSRET_64 | Los procesadores Intel soportan SYSCALL y SYSRET sólo en modo de 64 bits. Esta bandera de características siempre se enumera como 0 fuera del modo 64-bit. |

**Campos Mutable CPUID que deben seguir siendo consistentes**

| Hoja | Subhoja | Registro | Nombre del campo | Descripción y Control de Mutabilidad |
| --- | --- | --- | --- | --- |
| 00H | Ignorado | EAX[31:0] | MAX_LEAF | Apoyo al software legado limitando el número de CPUID de hojas reportando a un máximo de 2. Esto se establece utilizando IA32 MISC ENABLE[22] Limit CPUID Maxval. |
| 01H | Ignorado | ECX[3] | MONITOR | Esta bandera de características refleja el ajuste en IA32 MISC ENABLE[18] Enable Monitor FSM. |
| 01H | Ignorado | ECX[7] | EIST | Esta bandera de características refleja el ajuste en IA32 MISC ENABLE[16] Mejorada tecnología de SpeedStep Intel. |
| 01H | Ignorado | EDX[9] | APIC | Esta bandera de características refleja IA32 APIC BASE[11], APIC Global Enable. |
| 05H | Ignorado | ECX[0] | MONITOR_MWAIT_ EXTENSIONS | Este campo no está disponible cuando CPUID.01H:ECX.MONITOR[3] = 0. |

**Campos Mutable CPUID que deben seguir siendo consistentes (Contd.)**

| Hoja | Subhoja | Registro | Nombre del campo | Descripción y Control de Mutabilidad |
| --- | --- | --- | --- | --- |
| 00H | Ignorado | EAX[31:0] | MAX_LEAF | Apoyo al software legado limitando el número de CPUID de hojas reportando a un máximo de 2. Esto se establece utilizando IA32 MISC ENABLE[22] Limit CPUID Maxval. |
| 01H | Ignorado | ECX[3] | MONITOR | Esta bandera de características refleja el ajuste en IA32 MISC ENABLE[18] Enable Monitor FSM. |
| 01H | Ignorado | ECX[7] | EIST | Esta bandera de características refleja el ajuste en IA32 MISC ENABLE[16] Mejorada tecnología de SpeedStep Intel. |
| 01H | Ignorado | EDX[9] | APIC | Esta bandera de características refleja IA32 APIC BASE[11], APIC Global Enable. |
| 05H | Ignorado | ECX[0] | MONITOR_MWAIT_ EXTENSIONS | Este campo no está disponible cuando CPUID.01H:ECX.MONITOR[3] = 0. |

#### 21.1.6 CPUID Campos reservados

El software debe ignorar y no depender de los valores devueltos por campos reservados de un CPUID hoja o subhoja porque pueden tener significado en futuros procesadores. Una vez que se defina un campo previamente conservado, esta especificación será actualizada para reflejarlo.

#### 21.1.7 CPUID Instrucción para la Serialización

Aunque la instrucción CPUID proporciona serialización, no es el método preferido en los procesadores más nuevos que apoyan la instrucción SERIALIZE, que se enumera a través de CPUID.07H.00H:EDX[14]=1. Si la compatibilidad atrasada es necesaria con procesadores mayores, use hoja 00H [CPUID.00H] para la serialización porque tiene la latencia más baja cuando se ejecuta. Ver "Serializing Instructions" en el Capítulo 11 de Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 3A para más detalles.

#### 21.1.8 IA32 BIOS SIGN ID devuelve la firma de actualización de microcódigo

Para los procesadores que soportan la instalación de actualización de microcódigos, el IA32 BIOS SIGN ID MSR está cargado con la firma de actualización cuando CPUID ejecuta. La firma se devuelve en el DWORD superior. Para obtener más información, consulte el capítulo 11 en el Intel(R) 64 y el manual de software de arquitecturas IA-32, Volumen 3A.

### 21.2 METHODS FOR RETURNING BRANDING INFORMATION USING CPUID

Utilice las siguientes técnicas para acceder a la información de marca: 1. Método de cadena de marca procesador. 2. Índice de marca de procesador; este método utiliza una tabla de cadena de marca suministrada. Estos dos métodos se examinan en las secciones siguientes. Para los métodos que están disponibles en los procesadores tempranos, véase la Sección 21.1.2, "Identificación de procesadores anteriores", del Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1.

#### 21.2.1 El método de cuerda de marca procesador

La Figura 21-1 describe el algoritmo utilizado para la detección de la cadena de la marca. El software de identificación de marca procesador debe ejecutar este algoritmo en todos los procesadores Intel 64 e IA-32. Este método (introducido con procesadores Pentium 4) devuelve una cadena de identificación de la marca ASCII y la frecuencia de la Base Procesador del procesador a los registros EAX, EBX, ECX y EDX.

Input: EAX= 0x80000000

CPUID

```text
             IF (EAX & 0x80000000)                   False  Processor Brand
```

No se apoya en la cuerda

```text
                 CPUID   True
               Function  Extended
```

Supported

EAX Valor de retorno = Max. Extended CPUID

Índice de función

```text
             IF (EAX Return Value                    True   Processor Brand
                 0x80000004)                                String Supported
```

OM15194

Figura 21-1. Determinación del soporte para la cadena de marca procesador

#### 21.2.2 El método del índice de marca del procesador

El método de índice de marca (introducido con Pentium(R) III Xeon(R) procesadores) proporciona un punto de entrada en una tabla de identificación de marca que se mantiene en la memoria por software. En esta tabla, cada índice de marca se asocia con una cadena de identificación de marca ASCII que identifica la familia Intel oficial y el número de modelo de un procesador.

Cuando CPUID ejecuta con EAX fijado a 1, el procesador devuelve un índice de marca al byte bajo en EBX. El software puede utilizar este índice para localizar la cadena de identificación de la marca para el procesador en la tabla de identificación de la marca. La primera entrada (índice de marca 0) en esta tabla está reservada, permitiendo la compatibilidad atrasada con procesadores que no soportan la característica de identificación de marca. Empezando con la firma de procesadores ID familiar = 0FH, modelo = 03H, método de índice de marca ya no es compatible. Use el método de cadena de marca en su lugar.

La tabla 21-3 muestra índices de marca que tienen cadenas de identificación asociadas con ellos.

**Mapping of Brand Indices; and Intel 64 and IA-32 Processor Brand Strings**

| Índice de marca | Brand String |
| --- | --- |
| 00H Este procesador no admite la marca ident | Función de ificación |
| procesador 01H Intel(R) Celeron(R)1 |  |
| 02H Intel(R) Pentium(R) III processor1 |  |

**Mapping of Brand Indices; and Intel 64 and IA-32 Processor Brand Strings**

| Índice de marca | Brand String |
| --- | --- |
| 00H Este procesador no admite la marca ident | Función de ificación |
| procesador 01H Intel(R) Celeron(R)1 |  |
| 02H Intel(R) Pentium(R) III processor1 |  |

### 21.3 CPUID hojas

El resto de este capítulo proporciona información de enumeración CPUID para arquitecturas Intel(R) 64 e IA-32.

CPUID.00H - Entrada máxima para CPUID básico y el ID de proveedor

CPUID.00H devuelve el valor más alto que el CPUID reconoce para devolver información básica del procesador. El valor se devuelve en el registro EAX y es específico del procesador. * Este hoja siempre es válido. * Este hoja no contiene subhojas y proporciona la misma información independientemente del valor de ECX.

**hoja 00H Entrada máxima para CPUID básico e ID de proveedor**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[31:0] | MAX_LEAF | Valor máximo de entrada para información básica CPUID. | Plataforma |
| EBX[31:0] | VENDOR_ID_1 | "Genu" | Plataforma |
| ECX[31:0] | VENDOR_ID_2 | "ntel" | Plataforma |
| EDX[31:0] | VENDOR_ID_3 | "inel" | Plataforma |

CPUID.01H -- Versión y características

CPUID.01H regresa tipo, familia, modelo, paso a paso y información de características. * Este hoja es válido si MAX LEAF 01H. * Este hoja no contiene subhojas y proporciona la misma información independientemente del valor de ECX.

** Registros de salida de hoja 01H**

| Producto CPUID | Descripción |
| --- | --- |
| Registros |  |
| EAX[31:0] | Información de la versión: Tipo, Familia, Modelo y ID de paso (ver "CPUID.01H:EAX--Versión: Tipo, |
|  | ID de familia, modelo y de paso"). |
| EBX[31:0] | Información de las características (ver "CPUID.01H:EBX--Información de las características"). |
| ECX[31:0] | Información de las características (ver "CPUID.01H:ECX--Información de las características"). |
| EDX[31:0] | Información de las características (ver "CPUID.01H:EDX--Información de las características"). |

**hoja 01H Versión y características retornados en EAX**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[3:0] | STEPPING_ID | Identifica una revisión de la familia y modelo de procesador específico. La información de paso se especifica como base por paquete para los procesadores heredados. Los procesadores más recientes no permiten mezclar escalones. | Paquete |
| EAX[7:4] | MODEL_ID | Identifica un conjunto de procesadores dentro de una familia. Ciertos modelos de procesadores Pentium(R) 4 permitieron IDs de Modelo mixtos y tendrían esto identificado como un Dominio de Paquete. | Plataforma |
| EAX[11:8] | FAMILY_ID | Identifica un conjunto de procesadores que tienen una similitud arquitectónica general. | Plataforma |
| EAX[13:12] | PROCESSOR_TYPE | Identifica el tipo específico de procesador. | Plataforma |
| EAX[15:14] | Reservado | Reservado. |  |
| EAX[19:16] | EXTENDED_MODEL_ID | Cuando el ID de la familia es 06H o 0FH, este campo está prepagado al ID modelo para proporcionar una identificación de modelo de 8 bits. | Plataforma |
| EAX[27:20] | EXTENDED_FAMILY_ID | Cuando el ID de la familia es 0FH, este campo se añade al ID de la familia para proporcionar una identificación familiar de 8 bits. | Plataforma |
| EAX[31:28] | Reservado | Reservado. |  |

**Procesador Tipo Campo**

| Tipo | Codificación |
| --- | --- |
| Procesador OEM original | 00B |
| Procesador Intel OverDrive(R) | 01B |
| Procesador dual (no aplicable a procesadores Intel486) | 10B |
| Intel reservado | 11B |

**hoja 01H Versión y características retornados en EBX**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EBX[7:0] | BRAND_INDEX | Este número proporciona una entrada en una tabla de cadenas de marca que contiene cadenas de marca para procesadores IA- 32. Más información sobre este campo se proporciona en la sección 21.2.2, "El método del índice de marca de procesadores". | Plataforma |
| EBX[15:8] | CLFLUSH_LINE_SIZE | Valor * 8 = tamaño de la línea de caché en bytes. Este número indica el tamaño de la línea de caché desplegada por las instrucciones CLFLUSH y CLFLUSHOPT en incrementos de 8 bytes. Este campo fue introducido en el procesador Pentium 4. | Plataforma |
| EBX[23:16] | APIC_ID_SPACE | Número máximo de IDs identificables para procesadores lógicos en este paquete físico. La potencia más cercana de 2 enteros que no es menor que EBX[23:16] es el número de IDs iniciales APIC únicos reservados para abordar diferentes procesadores lógicos en un paquete físico. Este campo sólo es válido si CPUID.01H.EDX.HTT[28]= 1. Ver más detalles a continuación sobre el uso de este campo. | Plataforma |

EBX[31:24] INITIAL APIC ID Este número es el ID de 8 bits que se asigna a Logical

```text
                                                    the local APIC on the processor during power     Processor
```

arriba. Este campo fue introducido en el procesador Penium 4. El ID inicial de 8 bits APIC en EBX[31:24] es

replaced by the 32-bit x2APIC ID, available in Leaf 0BH and Leaf 1FH.

Los IDs Máximas Dirigibles para procesadores lógicos en este paquete no deben utilizarse en plataformas que apoyen CPUID hoja 0BH o CPUID hoja 1FH ya que puede ser saturado y incorrecto. Las plataformas modernas pueden tener muchos más procesadores de los que se pueden enumerar o tener dominios topológicos con reservas discontinuas APIC ID. Para enumerar correctamente la información de identificación APIC en plataformas modernas, utilice CPUID.0BH o CPUID.1FH.

CPUID.01H:ECX

El registro ECX de CPUID.01H devuelve la información que se muestra a continuación. Para todas las banderas de características, un 1 indica que la función es compatible. El software debe identificar a Intel como el proveedor para interpretar correctamente las banderas de características. El software debe confirmar que una función procesadora está presente usando banderas de características devueltas por CPUID antes de usar la función. El software no debe depender de ofertas futuras que retengan todas las características.

**hoja 01H Versión y características retornados en ECX**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| ECX[0] | SSE3 | Si 1, soporta Streaming SIMD Extensiones 3. | Plataforma |
| ECX[1] | PCLMULQDQ | Si 1, soporta la instrucción PCLMULQDQ. | Plataforma |
| ECX[2] | DTES64 | 64-bit DS Area. Si 1, es compatible con el área DS usando el diseño de 64 bits. | Plataforma |
| ECX[3] | MONITOR | Si 1, soporta el MONITOR/MWAIT y CPUID.05H. | Plataforma |
| ECX[4] | DS_CPL | Si 1, soporta las extensiones a la función Debug Store para permitir el almacenamiento de mensajes de rama calificado por CPL. | Plataforma |
| ECX[5] | VMX | Si 1, soporta las extensiones de la máquina virtual. | Plataforma |
| ECX[6] | SMX | Si 1, es compatible con extensiones de modo más seguro. Véase Capítulo 7, "Referencia de extensiones del modo de referencia". | Plataforma |
| ECX[7] | EIST | Si 1, es compatible con la tecnología Enhanced Intel SpeedStep(R). | Plataforma |
| ECX[8] | TM2 | Si 1, es compatible con el monitor térmico 2. | Plataforma |
| ECX[9] | SSSE3 | Si 1, es compatible con las extensiones de SIMD de streaming suplementario 3. | Plataforma |
| ECX[10] | L1_CONTEXT_ID | Si 1, el modo de caché de datos L1 se puede configurar en modo adaptativo o modo compartido. Vea la definición del IA32 MISC ENABLE MSR Bit 24 (L1 Data Cache Context Mode) para detalles. | Plataforma |
| ECX[11] | DEBUG_INTERFACE | Si 1, soporta IA32 DEBUG INTERFACE MSR para depuración de silicio. | Plataforma |
| ECX[12] | FMA | Si 1, admite extensiones FMA utilizando el estado YMM. | Plataforma |
| 21 a 10 vol. 1 |  |  |  |

ECX[13] CMPXCHG16B Si 1, soporta esta instrucción. Ver la sección "CMPXCHG8B/CMPXCHG16B--Comparar y ECX[14] XTPR UPDATE CONTROL Exchange Bytes" en este capítulo para una plataforma

```text
                               description.                                        Platform
```

ECX[15]   PERF_CAPABILITIES

```text
                               If 1, supports changing IA32_MISC_ENABLE[bit        Platform
```

ECX[16] Reservado 23]. ECX[17] PCID Platform

```text
                               If 1, supports the performance and debug            Platform
```

ECX[18] DCA indicación de características MSR Plataforma

```text
                               IA32_PERF_CAPABILITIES.                             Platform
```

ECX[19] SSE4 1 Platform ECX[20] SSE4 2 Reserved.                                           Plataforma ECX[21] X2APIC Plataforma ECX[22] MOVBE Si 1, admite identificadores de contexto de proceso y plataforma ECX[23] POPCNT configuración de software CR4.PCIDE a 1.Proceso- Plataforma ECX[24] TSC DEADLINE context identifiers. Logical ECX[25] AESNI Si 1, soporta la capacidad de capturar datos de un procesador ECX[26] XSAVE dispositivo de memoria mapeado. Ver CPUID.09H. Plataforma ECX[27] OSXSAVE Si 1, soporta SSE4.1.                              Plataforma Plataforma ECX[28] AVX Si 1, soporta SSE4.2.                              Plataforma ECX[29] F16C Si 1, soporta la función x2APIC. ECX[30] RDRAND ECX[31] No se usa Si 1, admite la instrucción MOVBE.

Si 1, soporta la instrucción POPCNT.

Si 1, el temporizador APIC local del procesador soporta una operación de disparo utilizando un valor límite TSC.

Si 1, soporta las extensiones de instrucción AESNI.

Si 1, es compatible con el procesador XSAVE/XRSTOR característica de estados extendidos, las instrucciones XSETBV/XGETBV y XCR0.

Si 1, el sistema operativo ha establecido CR4.OSXSAVE[bit 18] para habilitar las instrucciones XSETBV/XGETBV para acceder a XCR0 y para apoyar la gestión estatal ampliada del procesador utilizando XSAVE/XRSTOR.

Si 1, soporta las extensiones de instrucción AVX.

Si 1, soporta instrucciones de conversión coma flotante de 16 bits.

Si 1, soporta la instrucción RDRAND.

Los procesadores Intel siempre regresan 0. Asignado para uso por emulación de software.

CPUID.01H:EDX

El registro EDX de CPUID.01H devuelve la información que se muestra a continuación. Para todas las banderas de características, un 1 indica que la función es compatible. El software debe identificar a Intel como el proveedor para interpretar correctamente las banderas de características. El software debe confirmar que una función procesadora está presente usando banderas de características devueltas por CPUID antes de usar la función. El software no debe depender de ofertas futuras que retengan todas las características.

**hoja 01H Versión y características retornados en EDX**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EDX[0] | FPU | Coma flotante Unidad On-Chip. El procesador contiene un x87 FPU. | Plataforma |

EDX[1] VME Si 1, soporta las mejoras de la plataforma del modo 8086 virtual, incluyendo CR4.VME para EDX[2] DE controlando la característica; CR4.PVI para plataforma protegida

```text
                                                    mode virtual interrupts; software interrupt        Platform
```

EDX[3] Inducción PSE; expansión del TSS con la Plataforma

```text
                                                    software indirection bitmap; and EFLAGS.VIF        Platform
```

EDX[4] TSC y EFLAGS.VIP banderas.                              Plataforma Plataforma EDX[5] MSR Si 1, soporta puntos de ruptura I/O debugging

```text
                                                    extensions, including CR4.DE for controlling the   Platform
```

EDX[6] Función PAE, y trapping opcional de accesos a la Plataforma DR4 y DR5. EDX[7] MCE Platform P Si 1, soporta extensiones de tamaño de página para grandes EDX[8] CMPXCHG8B páginas de tamaño 4 MByte, incluyendo: CR4.PSE para EDX[9] APIC controlando la característica; la parte sucia definida en PDE (Page Directory Entries); opcional EDX reservada[10] Trapping de bit reservado en CR3; PDE; y PTE. EDX[11] SEP Si 1, apoya la instrucción Time Stamp Counter, RDTSC, incluyendo CR4.TSD para controlar privilegios.

Si 1, soporta los registros específicos modelo RDMSR y WRMSR Instrucciones. Algunos de los MSR dependen de la aplicación.

Si 1, soporta la extensión de dirección física que es para direcciones físicas superiores a 32 bits, incluyendo: formatos de entrada de página ampliados; un nivel adicional en las tablas de traducción de página; y páginas de 2 MByte en lugar de 4 páginas de Mbyte.

Si 1, es compatible con la excepción 18 para Machine Checks, incluyendo CR4.MCE para controlar la característica. Esta característica no define las implementaciones específicas del modelo de registro de errores de control automático, reportajes y cierres de procesadores. Los controladores de excepción de control de máquina pueden tener que depender de la versión del procesador para hacer el procesamiento específico modelo de la excepción, o prueba para la presencia de la función de verificación de máquina.

Si 1, soporta la instrucción CMPXCHG8B (64 bits), implícitamente bloqueada y atómica.

Si 1, el procesador contiene un Controlador Interrupt programable avanzado (APIC), respondiendo a comandos mapeados de memoria en el rango de dirección física FEE00000H a FEE00FFFH (por defecto - algunos procesadores permiten que el APIC sea reubicado).

Reserved.

Si 1 soporta las instrucciones SYSENTER y SYSEXIT y MSR asociados.

EDX[12] MTRR Si 1, soporta los Registros de Plataforma de Tipo de Memoria. (La característica MTRRcap MSR contiene

bits que describen qué tipos de memoria son soportados, cuántos MTRR variable son soportados, y si los MTRR fijos son

supported.)

EDX[13] PGE Si 1, apoya el bit global en paging-structure Platform

entradas que mapean una página, indicando las entradas de TLB que son comunes a diferentes procesos y no necesitan ser derribados. Los controles de bits CR4.PGE

esta característica.

EDX[14] MCA Si 1, soporta la plataforma de arquitectura de verificación de máquina

función. El MCG CAP MSR contiene bits de características que describen cuántos bancos de informes de errores MSR son compatibles.

EDX[15] CMOV Si 1, soporta las Instrucciones de movimiento condicional.   Plataforma

Si CPUID.01H:EDX.FPU[0] (x87 FPU presente) es 1 también, soporta las instrucciones FCOMI y FCMOV.

EDX[16] PAT Si 1, es compatible con la función Page Attribute Table.    Plataforma (Esta característica aumenta el tipo de memoria

Registros de rango (MTRRs), permitiendo que un sistema operativo especifique los atributos de memoria accedidos a través de una dirección lineal en un 4KB

granularity.)

EDX[17] PSE 36 Si 1, es compatible con la plataforma de extensión de la página 36-Bit

que permite páginas de 4 MByte que abordan la memoria física más allá de 4 GBytes con paging de 32 bits. Esta característica indica que los bits superiores de

la dirección física de una página de 4 MByte se codifican en bits 20:13 de la entrada del directorio de página. Tales direcciones físicas están limitadas por

MAXPHYADDR y puede ser de hasta 40 bits de tamaño.

EDX[18] PSN Si 1, soporta la Plataforma Serial de Procesador de 96 bits

Número de identificación y la función está habilitada. Disponible sólo en Pentium III, ver CPUID.03H.

EDX[19] CLFLUSH Si 1, soporta la instrucción CLFLUSH.             Plataforma EDX[20] Reservado EDX[21] DS Reservado.

```text
                   If 1, supports the Debug Store feature which        Platform
```

proporciona la capacidad de escribir información de depuración en un buffer residente de memoria. Esta característica es utilizada por la tienda de trazas de rama (BTS) y

instalaciones de muestreo basado en eventos (PEBS) (ver Capítulo 19, "Debug, Branch Profile, TSC, e Intel(R) Resource Director

Características de la tecnología (Intel(R) RDT)", en Intel(R) 64 e IA-32 Arquitecturas Software Developer's Manual, Volumen 3B).

EDX[22] ACPI Si 1, es compatible con las instalaciones del reloj controlado por el software de monitor térmico y plataforma. Estos son los MSR internos EDX[23] MMX que permiten controlar la temperatura del procesador Plataforma EDX[24] FXSR y el rendimiento del procesador a Plataforma se modulan en ciclos de derechos predefinidos bajo el control de software EDX[25] SSE.                                 Plataforma EDX[26] SSE2 Plataforma EDX[27] SELF SNOOP Si 1, soporta la tecnología Intel MMX.          Plataforma EDX[28] HTT Si 1, soporta el FXSAVE y FXRSTOR

```text
                                                    Instructions, which are fast save and restore of  Platform
```

EDX[29] TM el contexto de punto flotante, y la disponibilidad

```text
                                                    of CR4.OSFXSR for an operating system to          Platform
```

EDX[30] La reservada indica el apoyo del mismo. EDX[31] PBE Si 1, soporta SSE.

Si 1, soporta SSE2.

Si 1, es compatible con Self Snoop, que es la gestión de los tipos de memoria conflictivos al realizar un giro de su propia estructura de caché para las transacciones emitidas al autobús.

Si 1, el valor en CPUID.1.EBX[23:16] (el número máximo de IDs identificables para procesadores lógicos en este paquete) es válido para el paquete. Si 0, sólo hay un procesador lógico único en el paquete y el software debe asumir sólo un solo APIC ID está reservado.

Si 1, soporta la función Thermal Monitor en la que el procesador implementa el circuito de control térmico automático (TCC).

Reserved.

Si 1, es compatible con la función Pending Break Enable, que es el uso del pin FERR#/PBE# cuando el procesador está en el estado de stop-clock (STPCLK# se afirma) para indicar al procesador que una interrupción está pendiente y que el procesador debe volver a la operación normal a descriptor la interrupción.

CPUID.02H -- TLB/Cache/Prefetch Information

CPUID.02H devuelve la información TLB, cache y prefetch.Este hoja ha sido superado por CPUID.04H para la enumeración de caché y CPUID.18H para la enumeración TLB. Estos procesadores también reportarán nuevos valores descriptores de tipos 0FEh o 0FFh para referir enumeraciones a CPUID.04H y CPUID.18H. * Este hoja es válido si MAX LEAF 02H. * Este hoja no contiene subhojas y proporciona la misma información independientemente del valor de ECX.

**hoja 02H TLB/Cache/Prefetch Information**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[7:0] | Reservado | Reservado con un valor de 1 |  |
| EAX[15:8] | DESCRIPTOR_1 | Ver Tabla "Codificación de CPUID hoja 2 | Lógica |
|  |  | Descriptores" debajo de esta tabla. | Procesador |
| EAX[23:16] | DESCRIPTOR_2 | Ver Tabla "Codificación de CPUID hoja 2 | Lógica |
|  |  | Descriptores" debajo de esta tabla. | Procesador |
| EAX[31:24] | DESCRIPTOR_3 | Ver Tabla "Codificación de CPUID hoja 2 | Lógica |
|  |  | Descriptores" debajo de esta tabla. | Procesador |
| EBX[7:0] | DESCRIPTOR_4 | Ver Tabla "Codificación de CPUID hoja 2 | Lógica |
|  |  | Descriptores" debajo de esta tabla. | Procesador |
| EBX[15:8] | DESCRIPTOR_5 | Ver Tabla "Codificación de CPUID hoja 2 | Lógica |
|  |  | Descriptores" debajo de esta tabla. | Procesador |
| EBX[23:16] | DESCRIPTOR_6 | Ver Tabla "Codificación de CPUID hoja 2 | Lógica |
|  |  | Descriptores" debajo de esta tabla. | Procesador |
| EBX[31:24] | DESCRIPTOR_7 | Ver Tabla "Codificación de CPUID hoja 2 | Lógica |
|  |  | Descriptores" debajo de esta tabla. | Procesador |
| ECX[7:0] | DESCRIPTOR_8 | Ver Tabla "Codificación de CPUID hoja 2 | Lógica |
|  |  | Descriptores" debajo de esta tabla. | Procesador |
| ECX[15:8] | DESCRIPTOR_9 | Ver Tabla "Codificación de CPUID hoja 2 | Lógica |
|  |  | Descriptores" debajo de esta tabla. | Procesador |
| ECX[23:16] | DESCRIPTOR_10 | Ver Tabla "Codificación de CPUID hoja 2 | Lógica |
|  |  | Descriptores" debajo de esta tabla. | Procesador |
| ECX[31:24] | DESCRIPTOR_11 | Ver Tabla "Codificación de CPUID hoja 2 | Lógica |
|  |  | Descriptores" debajo de esta tabla. | Procesador |
| EDX[7:0] | DESCRIPTOR_12 | Ver Tabla "Codificación de CPUID hoja 2 | Lógica |
|  |  | Descriptores" debajo de esta tabla. | Procesador |
| EDX[15:8] | DESCRIPTOR_13 | Ver Tabla "Codificación de CPUID hoja 2 | Lógica |
|  |  | Descriptores" debajo de esta tabla. | Procesador |
| EDX[23:16] | DESCRIPTOR_14 | Ver Tabla "Codificación de CPUID hoja 2 | Lógica |
|  |  | Descriptores" debajo de esta tabla. | Procesador |
| EDX[31:24] | DESCRIPTOR_15 | Ver Tabla "Codificación de CPUID hoja 2 | Lógica |
|  |  | Descriptores" debajo de esta tabla. | Procesador |

abajo. Tenga en cuenta que el orden de los descriptores en los registros EAX, EBX, ECX y EDX no se define; es decir, los bytes específicos no se designan para contener descriptores para los tipos de caché, prefetch o TLB específicos. Los descriptores pueden aparecer en cualquier orden. Nota también un procesador puede reportar un descriptor general tipo FFH y FEH y no reportar ningún descriptor byte de "tipo de local" o "*TLB tipo" a través de CPUID.02H.

Descriptor Tipo Tabla 21-12. Incoding ofCPUID hoja2 Descriptors Value00HCaché general oTLBDescripción01H TLB 02H TLBDescriptor nulo, este byte no contiene información.03H TLBInstrucciónTLB: 4 páginas KByte, 4-way set associative, 32 entradas.04H TLBInstrucciónTLB: 4 páginas MByte, totalmente asociativas, 2 entradas.05H TLBDatosTLB: 4 páginas KByte, 4-way set associative, 64 entradas.06HDatos de cachéTLB: 4 MByte pages, 4-way set associative, 8 entries.08HDatos de cachéTLB1: 4 páginas MByte, 4-way set associative, 32 entradas.09HCache 1st-level instruction cache: 8 KBytes, 4-way set associative, 32 byte line size.0AHCache 1st-level instruction cache: 16 KBytes, 4-way set associative, 32 byte line size.0BH TLBCaché de instrucción de primer nivel: 32KBytes, 4-way set associative, 64 byte line size.0CHCache 1st-level data cache: 8 KBytes, 2-way set associative, 32 byte line size.0DHCache InstructionTLB: 4 páginas MByte, 4-way set associative, 4 entradas.0EHCache 1st-level data cache: 16 KBytes, 4-way set associative, 32 byte line size.1DHCache 1st-level data cache: 16 KBytes, 4-way set associative, 64 byte line size.21HCache 1st-level data cache: 24 KBytes, 6-way set associative, 64 byte line size.22HCache 2nd-level cache: 128 KBytes, 2-way set associative, 64 byte line size.23HCache 2nd-level cache: 256 KBytes, 8-way set associative, 64 byte line size.24HCache 3er nivel de caché: 512 KBytes, 4-way set associative, 64 byte line size, 2 líneas por sector.25HCache 3er nivel de caché: 1 MBytes, 8 vías de conjunto asociativo, 64 byte line size, 2 líneas por sector.29HCache 2nd-level cache: 1 MBytes, 16-way set associative, 64 byte line size.2CHCache 3er nivel de caché: 2 MBytes, 8-way set associative, 64 byte line size, 2 líneas por sector.30HCache 3o nivel: 4 MBytes, 8 vías asociativas, 64 byte line size, 2 líneas por sector.40HCache 1st-level data cache: 32 KBytes, 8-way set associative, 64 byte line size.41HCache 1st-level instruction cache: 32 KBytes, 8-way set associative, 64 byte line size.42HCache No 2nd-level cache o, si el procesador contiene un cache válido de 2nd-level, no 3rd-level cache.43HCache 2nd-level cache: 128 KBytes, 4-way set associative, 32 byte line size.44HCache 2nd-level cache: 256 KBytes, 4-way set associative, 32 byte line size.45HCache 2nd-level cache: 512 KBytes, 4-way set associative, 32 byte line size.46HCache 2nd-level cache: 1 MByte, 4-way set associative, 32 byte line size.47HCache 2nd-level cache: 2 MByte, 4-way set associative, 32 byte line size.48HCache 3er nivel de caché: 4 MByte, 4 vías de conjunto asociativo, 64 byte tamaño de línea.49HCache 3rd-level cache: 8 MByte, 8-way set associative, 64 byte line size. 2nd-level cache: 3MByte, 12-way set associative, 64 byte line size. 3rd-level cache: 4MB, 16-way set associative, 64-byte line size (Intel Xeon processor MP, Family0FH, Modelo06H) 2o nivel de caché: 4 MByte, 16-way set associative, 64 byte line size.

4AH Cache 3rd-level cache: 6MByte, 12-way set associative, 64 byte line size.

4BH Cache 3rd-level cache: 8MByte, 16-way set associative, 64 byte line size.

4CH Cache 3rd-level cache: 12MByte, 12-way set associative, 64 byte line size.

4DH Cache 3rd-level cache: 16MByte, 16-way set associative, 64 byte line size.

4EH Cache 2nd-level cache: 6MByte, 24way set associative, 64 byte line size.

4FH TLB Instrucción TLB: 4 páginas KByte, 32 entradas.

50H TLB Instrucción TLB: 4 páginas KByte y 2 MByte o 4 MByte, 64 entradas.

51H TLB Instrucción TLB: 4 páginas KByte y 2 MByte o 4 MByte, 128 entradas.

52H TLB Instrucción TLB: 4 páginas KByte y 2 MByte o 4 MByte, 256 entradas.

55H TLB Instrucción TLB: páginas 2-MByte o 4-MByte, totalmente asociativas, 7 entradas.

56H TLB Data TLB0: 4 páginas de MByte, 4-way set associative, 16 entradas.

57H TLB Data TLB0: 4 páginas KByte, 4 vías asociativas, 16 entradas.

59H TLB Data TLB0: 4 páginas KByte, totalmente asociativas, 16 entradas.

5AH TLB Data TLB0: 2 MByte o 4 páginas MByte, 4-way set associative, 32 entradas.

5BH TLB Data TLB: 4 páginas KByte y 4 MByte, 64 entradas.

5CH TLB Data TLB: 4 KByte y 4 páginas MByte,128 entradas.

5DH TLB Data TLB: 4 KByte y 4 páginas MByte,256 entradas.

60H Cache 1st-level data cache: 16 KByte, 8-way set associative, 64 byte line size.

61H TLB Instrucción TLB: 4 páginas KByte, totalmente asociativas, 48 entradas.

63H TLB Data TLB: 2 MByte o 4 páginas MByte, 4-way set associative, 32 entradas y un array separado con

1 GByte pages, 4-way set associative, 4 entries.

64H TLB Data TLB: 4 páginas KByte, 4 páginas de conjunto asociativo, 512 entradas.

66H Cache 1st-level data cache: 8 KByte, 4-way set associative, 64 byte line size.

67H Cache 1st-level data cache: 16 KByte, 4-way set associative, 64 byte line size.

68H Cache 1st-level data cache: 32 KByte, 4-way set associative, 64 byte line size.

6AH Cache uTLB: 4 KByte pages, 8-way set associative, 64 entries.

6BH Cache DTLB: 4 páginas KByte, 8-way set associative, 256 entradas.

6CH Cache DTLB: 2M/4M pages, 8-way set associative, 128 entries.

6DH Cache DTLB: 1 páginas de GByte, totalmente asociativas, 16 entradas.

70H Cache Trace cache: 12 K-?op, 8-way set associative.

71H Cache Trace cache: 16 K-?op, 8-way set associative.

72H Cache Trace cache: 32 K-?op, 8-way set associative.

76H TLB Instrucción TLB: 2M/4M páginas, totalmente asociativas, 8 entradas.

78H Cache 2nd-level cache: 1 MByte, 4-way set associative, 64byte line size.

79H Cache 2nd-level cache: 128 KByte, 8-way set associative, 64 byte line size, 2 lineas por sector.

7AH Cache 2nd-level cache: 256 KByte, 8-way set associative, 64 byte line size, 2 lineas por sector.

7BH Cache 2nd-level cache: 512 KByte, 8-way set associative, 64 byte line size, 2 lineas por sector.

7CH Cache 2nd-level cache: 1 MByte, 8-way set associative, 64 byte line size, 2 lineas por sector.

7DH Cache 2nd-level cache: 2 MByte, 8-way set associative, 64byte line size.

7FH Cache 2nd-level cache: 512 KByte, 2-way set associative, 64-byte line size.

80H Cache 2nd-level cache: 512 KByte, 8-way set associative, 64-byte line size.

82H Cache 2nd-level cache: 256 KByte, 8-way set associative, 32 byte line size.

83H Cache 2nd-level cache: 512 KByte, 8-way set associative, 32 byte line size.

84H Cache 2nd-level cache: 1 MByte, 8-way set associative, 32 byte line size.

85H Cache 2nd-level cache: 2 MByte, 8-way set associative, 32 byte line size.

86H Cache 2nd-level cache: 512 KByte, 4-way set associative, 64 byte line size.

87H Cache 2nd-level cache: 1 MByte, 8-way set associative, 64 byte line size.

A0H DTLB DTLB: 4k páginas, totalmente asociativas, 32 entradas.

B0H TLB Instrucción TLB: 4 páginas KByte, 4-way set associative, 128 entradas.

B1H TLB Instrucciones TLB: 2M páginas, 4-way, 8 entradas o 4M páginas, 4-way, 4 entradas.

B2H TLB Instrucción TLB: 4KByte pages, 4-way set associative, 64 entries.

B3H TLB Data TLB: 4 páginas KByte, 4-way set associative, 128 entradas.

B4H TLB Data TLB1: 4 páginas KByte, 4 vías asociativas, 256 entradas.

B5H TLB Instrucción TLB: 4KPáginas chinas, 8-way set associative, 64 entradas.

B6H TLB Instrucción TLB: 4KPáginas chinas, 8-way set associative, 128 entradas.

BAH TLB Data TLB1: 4 páginas KByte, 4 páginas asociativas, 64 entradas.

C0H TLB Data TLB: 4 páginas KByte y 4 MByte, 4 páginas asociativas, 8 entradas.

C1H STLB Shared 2nd-Level TLB: 4 páginas KByte/2 MByte, 8-way associative, 1024 entradas.

C2H DTLB DTLB: 2 MByte/4 MByte pages, 4-way associative, 16 entries.

C3H STLB Shared 2nd-Level TLB: 4 páginas KByte /2 MByte, 6-way associative, 1536 entradas. También 1GBbyte

pages, 4-way, 16 entries.

C4H DTLB DTLB: 2 MByte/ 4MByte pages, 4-way associative, 32 entries.

CAH STLB Shared 2nd-Level TLB: 4 páginas KByte, 4-way associative, 512 entradas.

D0H Cache 3rd-level cache: 512 KByte, 4-way set associative, 64 byte line size.

D1H Cache 3rd-level cache: 1 MByte, 4-way set associative, 64 byte line size.

D2H Cache 3rd-level cache: 2 MByte, 4-way set associative, 64 byte line size.

D6H Cache 3rd-level cache: 1 MByte, 8-way set associative, 64 byte line size.

D7H Cache 3rd-level cache: 2 MByte, 8-way set associative, 64 byte line size.

D8H Cache 3rd-level cache: 4 MByte, 8-way set associative, 64 byte line size.

DCH Cache 3rd-level cache: 1,5 MByte, 12-way set associative, 64 byte line size.

DDH Cache 3rd-level cache: 3 MByte, 12-way set associative, 64 byte line size.

DEH Cache 3rd-level cache: 6 MByte, 12-way set associative, 64 byte line size.

E2H Cache 3rd-level cache: 2 MByte, 16-way set associative, 64 byte line size.

E3H Cache 3rd-level cache: 4 MByte, 16-way set associative, 64 byte line size.

E4H Cache 3rd-level cache: 8 MByte, 16-way set associative, 64 byte line size.

EAH Cache 3rd-level cache: 12MByte, 24way set associative, 64 byte line size.

EBH Cache 3rd-level cache: 18MByte, 24way set associative, 64 byte line size.

ECH Cache 3rd-level cache: 24MByte, 24way set associative, 64 byte line size.

F0H Prefetch 64-Byte prefetching.

F1H Prefetch 128-Byte prefetching.

FEH General CPUID hoja 2 no reporta información descriptor TLB; use CPUID hoja 18H para consultar TLB

otros parámetros de traducción de direcciones.

FFH General CPUID hoja 2 no reporta información descriptor de caché, use CPUID hoja 4 para query cache

parameters.

Ejemplo 21-1. Ejemplo de interpretación de Cache y TLB

El primer miembro de la familia de procesadores Pentium 4 devuelve la siguiente información sobre caches y TLB cuando el CPUID ejecuta con un valor de entrada de 2: EAX 66 5B 50 01H EBX 0H ECX 0H EDX 00 7A 70 00H Lo que significa: * El byte menos significativo (byte 0) del registro EAX se establece en 01H. Este valor debe ser ignorado. * El bit más significativo de los cuatro registros (EAX, EBX, ECX y EDX) se establece a 0, indicando que cada registro contiene descriptores válidos de 1 byte. * Los números 1, 2, y 3 del registro EAX indican que el procesador tiene:

-- 50H - una instrucción de 64 entradas TLB, para la asignación de 4-KByte y 2-MByte o 4-MByte páginas. -- 5BH - a 64-entry datos TLB, para la asignación de 4-KByte y 4-MByte páginas. -- 66H - un caché de 8- * Los descriptores en los registros EBX y ECX son válidos, pero contienen descriptores NULL. * Bytes 0, 1, 2, and 3 of register EDX indicate that the processor has: -- 00H - NULL descriptor. -- 70H - Trace cache: 12 K-op, 8-way set associative. -- 7AH - a 256-KByte 2nd level cache, 8-way set associative, with a sectored, 64-byte cache line size. -- 00H - NULL descriptor.

CPUID.03H - Número de serie de procesadores

CPUID.03H devuelve el número de serie del procesador, si está disponible. El número de serie de procesadores (PSN) no es compatible con el procesador Pentium 4 o posterior. * Este hoja es válido si MAX LEAF 03H. * Este hoja no contiene subhojas y proporciona la misma información independientemente del valor de ECX.

Registro Nombre del campo Cuadro 21-13. Hoja 03H Procesador Número de serie Dominio EAX[31:0] Paquete reservado EBX[31:0] Descripción reservada Paquete ECX[31:0] PSN 31 0 Reservado. EDX[31:0] PSN 63 32 Reservado.

Bits 00-31 del número de serie de procesadores de 96 bits. (Disponible sólo en el procesador Pentium III; de lo contrario, el valor de este registro está reservado.)

Bits 32-63 del número de serie de procesadores de 96 bits. (Disponible sólo en el procesador Pentium III; de lo contrario, el valor de este registro está reservado.)

CPUID.04H -- Parámetros de caché determinístico

CPUID.04H devuelve los parámetros de caché determinísticos para cada nivel de caché. * Este hoja es válido si CPUID.04H.00H:EAX[4:0] <> 0 y MAX LEAF 04H. * Las subhojas se enumeran hasta que subhoja n regrese 0 en EAX[4:0]. * Si ECX contiene un índice subhoja inválido, EAX/EBX/ECX/EDX retorno 0. El índice subhoja n+1 es inválido si subhoja n devuelve EAX[4:0] como 0.

**hoja 04H Parámetros de Caché determinista**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[4:0] | CACHE_TYPE | 0 = Null, no más caches. | Lógica |
|  |  | 1 = Caché de datos. 2 = Caché de instrucciones. 3 = Caché unificada. 4-31 = Reservado. | Procesador |
| EAX[7:5] | CACHE_LEVEL | Nivel de caché (estrellas a 1). | Procesador lógico |
| EAX[8] | SELF_INITIALIZING_CACHE | Nivel auto inicializador de caché (no necesita | Lógica |
|  |  | inicialización del software). | Procesador |
| EAX[9] | FULLY_ASSOC | Caché totalmente asociativo. | Procesador lógico |
| EAX[13:10] | Reservado | Reservado. |  |
| EAX[25:14] | MAX_LP_ADDRESSABLE_IDS | Número máximo de IDs identificables para lógica | Lógica |
|  |  | procesadores compartiendo este caché. Añadir uno al valor de retorno para obtener el resultado. La potencia más cercana de 2 enteros que no es menor que (1 + EAX[25:14]) es el número de IDs iniciales APIC únicos reservados para abordar diferentes procesadores lógicos compartiendo este caché. | Procesador |
| EAX[31:26] | MAX_CORES_ADDRESSABLE_IDS_PKG | Número máximo de IDs direccionales para núcleos procesadores en el paquete físico. Añadir uno al valor de retorno para obtener el resultado. La potencia más cercana de 2 enteros que no es menor que (1 + EAX[31:26]) es el número de Core IDs únicos reservados para abordar diferentes núcleos procesadores en un paquete físico. Core ID es un subconjunto de bits de la identificación inicial APIC. El valor devuelto es constante para valores iniciales válidos en ECX. Valores válidos ECX comienzan desde 0. El número máximo de IDs direccionales para núcleos de procesadores en el campo del paquete físico puede contener un valor saturado y no identificará correctamente las reservas de identificación para núcleos en este paquete en procesadores donde existen CPUID.0BH y/o CPUID.1FH. Los procesadores que enumeran la información de topología en CPUID.0BH o CPUID.1FH necesitan utilizar esos hojas para obtener los detalles de topología correctos. | Plataforma |
| EBX[11:0] | LINE_SIZE | Tamaño de la línea de coherencia del sistema. Añadir uno al valor de retorno para obtener el resultado. | Plataforma |
| EBX[21:12] | PHYS_LINE_PARTITIONS | Particiones de línea física. | Lógica |
|  |  | Añadir uno al valor de retorno para obtener el resultado. | Procesador |
| EBX[31:22] | NUM_WAYS | Formas de asociación. | Lógica |
|  |  | Añadir uno al valor de retorno para obtener el resultado. | Procesador |

ECX[31:0] NUM SETS Número de sets.                                    Logical EDX[0] NOT LWR CACHE FLUSH Añadir uno al valor de retorno para obtener el resultado.     Procesador Logical EDX[1] INCLUSIVE CACHE 0 = WBINVD/INVD de hilos que comparten este procesador EDX[2] COMPLEX CACHE INDEXING cache actúa sobre caches de nivel inferior para hilos

```text
                                                    sharing this cache.                                Logical
                                                    1 = WBINVD/INVD is not guaranteed to act upon      Processor
                                                    lower level caches of non-originating threads      Logical
                                                    sharing this cache.                                Processor
```

EDX[31:3] Reservado 0 = La caché no incluye los niveles de caché más bajos. 1 = La caché incluye los niveles de caché más bajos.

0 = Caché de mapeado directo. 1 = Una función compleja se utiliza para indexar el caché, utilizando potencialmente todos los bits de la dirección.

Reserved.

Cuando CPUID ejecuta con EAX fijado a 04H y ECX contiene un valor índice, el procesador devuelve los datos codificados que describen un conjunto de parámetros de caché determinístico (para el nivel de caché asociado con la entrada en ECX). Valores de índice válidos comienzan desde 0. El software puede enumerar los parámetros de caché determinísticos para cada nivel de la jerarquía de caché comenzando con un valor índice de 0, hasta que los parámetros reporten el valor asociado con el campo tipo caché es 0. Este tamaño de la caché en Bytes = (Ways + 1) * (Particiones + 1) * (Line Size + 1) * (Sets + 1) = (EBX[31:22] + 1) * (EBX[21:12] + 1) * (EBX[11:0] + 1) * (ECX + 1) El CPUID.04H también reporta datos que pueden utilizarse para derivar la topología de los núcleos procesadores en un paquete físico sobre procesadores heredados. Esta información es constante para todos los valores de índice válidos. Software puede consultar los datos brutos reportados ejecutando CPUID con EAX=04H y ECX=0 y utilizarlo como parte del algoritmo de enumeración de topología en procesadores que no enumeran ya sea CPUID.0BH o CPUID.1FH como se describe en el capítulo 10, "Manejo de volumen de procesamiento múltiple", en el software Intel(R) 64 y I

CPUID.05H -- MONITOR y MWAIT Características

CPUID.05H devuelve la información de características MONITOR y MWAIT. * Este hoja es válido si MAX LEAF 05H. * Este hoja no contiene subhojas y proporciona la misma información independientemente del valor de ECX.

**hoja 05H MONITOR y MWAIT Características**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[15:0] | SMALLEST_MONITOR_LINE_SIZE | Menor tamaño de línea de monitor en bytes (default es la granularidad del monitor del procesador). | Plataforma |
| EAX[31:16] | Reservado | Reservado. |  |
| EBX[15:0] | LARGEST_MONITOR_LINE_SIZE | Mayor tamaño de línea de monitor en bytes (default es la granularidad del monitor del procesador). | Plataforma |
| EBX[31:16] | Reservado | Reservado. |  |
| ECX[0] | MONITOR_MWAIT_EXTENSIONS | Si 1, admite la enumeración de las extensiones MONITOR/MWAIT (más allá de los registros EAX y EBX). | Plataforma |
| ECX[1] | INTERRUPT_AS_BREAK_EVENT | Si 1, es compatible con el tratamiento interrumpe como evento para MWAIT, incluso cuando las interrupciones son deshabilitadas. | Plataforma |
| ECX[31:2] | Reservado | Reservado. |  |
| EDX[3:0] | C0_SUB_STATES | Número de sub-estados C0* compatibles con MWAIT. | Plataforma |
| EDX[7:4] | C1_SUB_STATES | Número de sub-estados C1* compatibles con MWAIT. | Plataforma |
| EDX[11:8] | C2_SUB_STATES | Número de sub-estados C2* compatibles con MWAIT. | Plataforma |
| EDX[15:12] | C3_SUB_STATES | Número de sub-estados C3* compatibles con MWAIT. | Plataforma |
| EDX[19:16] | C4_SUB_STATES | Número de sub-estados C4* compatibles con MWAIT. | Plataforma |
| EDX[23:20] | C5_SUB_STATES | Número de sub-estados C5* compatibles con MWAIT. | Plataforma |
| EDX[27:24] | C6_SUB_STATES | Número de sub-estados C6* compatibles con MWAIT. | Plataforma |
| EDX[31:28] | C7_SUB_STATES | Número de sub-estados C7* compatibles con MWAIT. | Plataforma |

CPUID.06H - Características de gestión térmica y de energía

CPUID.06H devuelve información sobre características térmicas y de gestión de energía. * Este hoja es válido si MAX LEAF 06H. * Este hoja no contiene subhojas y proporciona la misma información independientemente del valor de ECX.

**hoja 06H Características de gestión térmica y de energía**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[0] | DIGITAL_TEMP_SENSOR | Si 1, soporta el sensor de temperatura digital. | Plataforma |
| EAX[1] | TURBO_BOOST | Si 1, es compatible con Intel Turbo Boost Technology. (ver descripción de IA32 MISC ENABLE[38]). | Plataforma |
| EAX[2] | ALWAYS_RUNNING_APIC_TIMER | Si 1, admite APIC-Timer-always-running característica. | Plataforma |
| EAX[3] | Reservado | Reservado. |  |
| EAX[4] | POWER_LIMIT_NOTIFY | Si 1, admite controles de notificación de límite de potencia. | Plataforma |
| EAX[5] | EXT_CLOCK_MOD | Si 1, soporta la ampliación del ciclo de trabajo de modulación del reloj. | Plataforma |
| EAX[6] | PKG_THERM_MGMT | Si 1, soporta la gestión térmica del paquete. | Plataforma |
| EAX[7] | HWP | Si 1, soporta los registros base HWP (IA32 PM ENABLE[bit 0], IA32 HWP CAPABILITIES, IA32 HWP REQUEST, IA32 HWP STATUS). | Plataforma |
| EAX[8] | HWP_INTERRUPT | Si 1, soporta IA32 HWP INTERRUPT MSR. | Plataforma |
| EAX[9] | HWP_ACTIVITY_WINDOW | Si 1, soporta IA32 HWP REQUEST[bits 41:32]. | Plataforma |
| EAX[10] | HWP_EPP | Si 1, soporta IA32 HWP REQUEST[bits 31:24]. | Plataforma |
| EAX[11] | HWP_REQUEST_PKG | Si 1, soporta IA32 HWP REQUEST PKG MSR. | Plataforma |
| EAX[12] | Reservado | Reservado. |  |
| EAX[13] | HDC | Si 1, es compatible con los registros de base HDC IA32 PKG HDC CTL, IA32 PM CTL1, e IA32 THREAD STALL MSRs. | Plataforma |
| EAX[14] | TURBO_BOOST_MAX | Si 1, soporta Intel(R) Turbo Boost Max Technology 3.0. | Plataforma |
| EAX[15] | HWP_CAP | Si 1, soporta la capacidad de cambio de alto rendimiento. | Plataforma |
| EAX[16] | HWP_PECI_OVERRIDE | Si 1, soporta HWP PECI override. | Plataforma |
| EAX[17] | FLEXIBLE_HWP | Si 1, admite HWP flexible. | Plataforma |
| EAX[18] | HWP_REQUEST_FAST_ACCESS | Si 1, soporta el modo de acceso rápido para el IA32 HWP REQUEST MSR. | Plataforma |
| EAX[19] | HW_FEEDBACK | Si 1, soporta IA32 HW FEEDBACK PTR MSR, IA32 HW FEEDBACK CONFIG MSR, IA32 PACKAGE THERM STATUS MSR bit 26, and IA32 PACKAGE THERM INTERRUPT MSR bit 25. | Plataforma |
| EAX[20] | HWP_REQUEST_IGNORE_IDLE | Si 1, soporta Ignorar Procesador Logical Idle solicitud HWP. | Plataforma |
| EAX[21] | Reservado | Reservado. |  |
| EAX[22] | HWP_CTL | Si 1, soporta IA32 HWP CTL MSR. | Plataforma |
| 21-24 Vol. 1 |  | PROCESSOR IDENTIFICATION AND FEATURE DETERMINATION |  |

EAX[23] THREAD DIRECTOR Si 1, es compatible con Intel(R) Thread Director.             Plataforma

```text
                                     IA32_HW_FEEDBACK_CHAR and                          Platform
```

EAX[31:24] Reservado IA32 HW FEEDBACK THREAD CONFIG MSRs Platform EBX[3:0] DTS NUM INT THRESHOLDS son compatibles si se establece. Plataforma EBX[31:4] Reservado.                                          Plataforma ECX[0] HW FEEDBACK CAP Paquete Número de Umbral Interrupto en Digital ECX[2:1] Sensor térmico reservado.                                    Paquete ECX[3] ENERGY PERF BIAS Lógica

```text
                                     Reserved.                                          Processor
```

ECX[7:4]ECX[15:8] HW FEEDBACK NUM CLASSES Si 1, soporta IA32 MPERF e IA32 APERF que proporcionan una medida del procesador entregadoECX[31:16] Rendimiento reservado (desde el último reinicio de los contadores),EDX[7:0] HW FEEDBACK CAPS como porcentaje del rendimiento del procesador esperado cuando se ejecuta en elTSC EDX[11:8] HW FEEDBACK TABLE SIZE frecuencia.

EDX[15:12] Reservado. EDX[31:16] HW FEEDBACK TABLE INDEX Si 1, soporta la preferencia de sesgo energético y un nuevo MSR arquitectónico llamado IA32 ENERGY PERF BIAS (1B0H).

Reserved.

Número de clases de Director Intel(R) con el apoyo del procesador. La información para esas muchas clases está escrita en la Tabla de Directores Intel Thread por el hardware.

Reserved.

Bitmap of supported hardware feedback interface capabilities. 0 = If 1, supports performance capability reporting. 1 = If 1, supports energy efficiency capability reporting. 2-7 = Reserved. Los bits 0 y 1 estarán siempre juntos.

Enumere el tamaño de la estructura de interfaz de retroalimentación de hardware en número de 4 páginas KB. Añadir uno al valor de retorno para obtener el resultado.

Reserved.

Índice (a partir de 0) de la fila de este procesador lógico en la estructura de interfaz de retroalimentación del hardware. Tenga en cuenta que en algunas partes el índice puede ser el mismo para múltiples procesadores lógicos. En algunas partes los índices pueden no ser contiguos, es decir, puede haber filas sin usar en la estructura de interfaz de retroalimentación del hardware.

Los detalles sobre estas características se describen en el capítulo 16, "Power and Thermal Management", en el Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 3B.

CPUID.07H -- Banderas de alimentación ampliadas estructuradas

CPUID.07H devuelve información de enumeración de banderas estructuradas. Las subsecciones de la Sección proporcionan información hoja 07H. * Este hoja es válido si MAX LEAF 07H. * El valor máximo subhoja para ECX se especifica en CPUID.07H.00H.EAX[31:0] MAX SUBLEAF. * Si ECX contiene un índice subhoja inválido, EAX/EBX/ECX/EDX retorno 0. El índice subhoja n es inválido si n excede el valor que subhoja 0 retorna en EAX.

CPUID.07H.00H -- Banderas de alimentación ampliadas estructuradas Sub-Leaf principal

CPUID.07H.00H devuelve el valor de entrada máximo del hoja 07H subhoja más alto; y EBX, ECX y EDX contienen información de las banderas de características extendidas.

**hoja 07H subhoja (ECX=0) Registros de salida**

| EAX[31:0] | MAX_SUBLEAF | Reporta el valor máximo de entrada para las sublevas compatibles 07H. | hoja | Plataforma |
| --- | --- | --- | --- | --- |
| EBX[31:0] |  | Extended Feature Flags Information in EBX (ver "CPUID.07H.00H:EBX--Extended Feature Flags Information") |  |  |
| ECX[31:0] |  | Extended Feature Flags Information in ECX (ver "CPUID.07H.00H:ECX--Extended Feature Flags Information") |  |  |
| EDX[31:0] |  | Extended Feature Flags Information in EDX (ver "CPUID.07H.00H:EDX--Extended Feature Flags Information") |  |  |

**hoja 07H.00H Banderas Extendidas Estructuradas Regresadas en EAX**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[31:0] | MAX_SUBLEAF | Reporta el valor máximo de entrada para hoja 07H subhojas compatible. | Plataforma |

**hoja 07H.00H Banderas Extendidas Estructuradas Regresadas en EBX**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EBX[0] | FSGSBASE | Si 1, soporta RDFSBASE/RDGSBASE/WRFS- BASE/WRGSBASE. | Plataforma |
| EBX[1] | TSC_ADJUST | Si 1, el IA32 TSC ADJUST MSR es compatible. | Plataforma |
| EBX[2] | SGX | Si 1, es compatible con las extensiones de Intel(R) Software Guard Extensiones (Intel(R) SGX Extensiones). | Plataforma |
| EBX[3] | BMI1 | Si 1, soporta las instrucciones BMI1. | Plataforma |
| EBX[4] | HLE | Si 1, soporta el conjunto de instrucciones de Elisión de Hardware Lock. | Plataforma |
| EBX[5] | AVX2 | Si 1, soporta Intel(R) Advanced Vector Extensions 2 (Intel(R) AVX2). | Plataforma |
| 21-26 Vol. 1 |  |  |  |
|  | PROCESSOR IDENTIFICATION AND | FEATURE DETERMINATION |  |

EBX[6] FDP EXCPTN ONLY Si 1, el indicador de datos x87 FPU se actualiza solamente Plataforma sobre las excepciones x87. EBX[7] Plataforma SMEP Si 1, es compatible con la ejecución de Supervisor-Mode EBX[8] BMI2 Prevención.                                             Plataforma EBX[9] ENH REP MOVSB STOSB Plataforma EBX[10] INVPCID Si 1, soporta las instrucciones BMI2.                   Plataforma

EBX[11] RTM Si 1, soporta Enhanced REP MOVSB/STOSB.                Plataforma

EBX[12] RDT M Si 1, soporta la instrucción INVPCID para el software de la plataforma del sistema que gestiona los identificadores de EBX[13] FCS FDS DEPRECATION contexto de proceso.                                            Plataforma EBX[14] Plataforma MPX Si 1, es compatible con el conjunto de instrucciones Restricted Transactional EBX[15] RDT A Memory.                                 Plataforma

EBX[16] AVX512F Si 1, es compatible con Intel(R) Resource Director Platform EBX[17] AVX512DQ Technology (Intel(R) RDT) Monitoring capacity.          Plataforma EBX[18] RDSEED Plataforma EBX[19] ADX Si 1, deprecate los valores de FPU CS y FPU DS.              Plataforma EBX[20] Plataforma SMAP Si 1, soporta Protección de memoria Intel(R) EBX[21] Extensiones AVX512 IFMA.                                             Plataforma EBX[22] Reservado EBX[23] CLFLUSHOPT Si 1, es compatible con Intel(R) Resource Director Platform EBX[24] CLWB Technology (Intel(R) RDT) Capacidad de asignación.          Plataforma EBX[25] INTEL PROC TRACE Platform EBX[26] AVX512PF Si 1, soporta las instrucciones AVX512F.                Plataforma

EBX[27] AVX512ER Si 1, soporta las instrucciones AVX512DQ.               Plataforma

EBX[28] AVX512CD Si 1, soporta la instrucción RDSEED.                  Plataforma EBX[29] Plataforma SHA Si 1, soporta las instrucciones ADX. EBX[30] AVX512BW Platform EBX[31] AVX512VL Si 1, es compatible con Supervisor-Mode Access Platform Prevention y las instrucciones CLAC/STAC.

Si 1, soporta las instrucciones AVX512 IFMA.

Reserved.

Si 1, soporta la instrucción CLFLUSHOPT.

Si 1, soporta la instrucción CLWB.

Si 1, es compatible con Intel(R) Processor Trace.

Si 1, soporta las instrucciones AVX512PF. (Intel(R) Xeon PhiTM only.)

Si 1, soporta las instrucciones AVX512ER. (Intel(R) Xeon PhiTM only.)

Si 1, soporta las instrucciones AVX512CD.

Si 1, es compatible con Intel(R) Secure Hash Algorithm Extensiones (Intel(R) SHA Extensiones).

Si 1, soporta las instrucciones AVX512BW.

Si 1, soporta las instrucciones AVX512VL.

CPUID.07H.00H:ECX Extended Feature Flags Information

El registro ECX de CPUID.07H.00H devuelve la información que se muestra a continuación.

**hoja 07H.00H Banderas Extendidas Estructuradas Regresadas en ECX**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| PROCESSOR | IDENTIFICATION A | ND FEATURE  DETERMINATION |  |
| ECX[0] | PREFETCHWT1 | Si 1, soporta el PREFETCHWT1 (Intel(R) Xeon PhiTM solamente.) | instrucción.         Plataforma |
| ECX[1] | AVX512_VBMI | Si 1, soporta el AVX512 VBMI | instrucciones.        Plataforma |

ECX[0] PREFETCHWT1 Si 1, soporta la instrucción PREFETCHWT1.      Plataforma ECX[1] AVX512 VBMI (Intel(R) Xeon PhiTM only.) ECX[2] UMIP ECX[3] PKU Si 1, soporta las instrucciones AVX512 VBMI. Plataforma ECX[4] OSPKE Si 1, es compatible con la prevención de la instrucción de modo de usuario. Plataforma ECX[5] WAITPKG ECX[6] AVX512 VBMI2 Si 1, soporta la protección claves para la plataforma de usuario ECX[7] CET SS páginas.

```text
                                                    If 1, the OS has set CR4.PKE to enable           Logical
```

Protección del procesador claves y las instrucciones RDPKRU/WRPKRU.

```text
                                                    If 1, supports the TPAUSE, UMONITOR, and         Platform
```

Instrucciones UMWAIT.

Si 1, soporta las instrucciones AVX512 VBMI2. Plataforma

```text
                                                    If 1, supports CET shadow stack features.        Platform
```

Los procesadores que fijan este bit definen bits 1:0 de las MSR IA32 U CET y IA32 S CET.

Aporta apoyo a los siguientes MSR: IA32 INTERRUPT SPP TABLE ADDR, IA32 PL3 SSP, IA32 PL2 SSP, IA32 PL1 SSP,

and IA32_PL0_SSP.

ECX[8] GFNI Si 1, soporta el conjunto de instrucciones GFNI.         Plataforma ECX[9] VAES Si 1 e Intel AVX soportan, soporta el conjunto de instrucciones VEX- Platform ECX[10] VPCLMULQDQ codificado AES.

ECX[11] AVX512 VNNI Si 1 e Intel AVX soportan, soporta la instrucción Plataforma ECX[12] AVX512 BITALG VPCLMULQDQ. ECX[13] TME EN Si 1, soporta las instrucciones AVX512 VNNI. Plataforma

Si 1, soporta las instrucciones AVX512 BITALG. Plataforma

```text
                                                    If 1, the following MSRs are supported:          Platform
```

IA32_TME_CAPABILITY, IA32_TME_ACTIVATE, IA32_TME_EXCLUDE_MASK, and IA32_TME_EXCLUDE_BASE.

ECX[14] AVX512 VPOPCNTDQ Si 1, soporta las instrucciones de la plataforma AVX512 VPOPCNTDQ.

ECX[15] Reservado. ECX[16] LA57 Si 1, soporta direcciones lineales de 57 bits y paging de cinco plataformas.

ECX[21:17] MPX MAWAU El valor de MAWAU utilizado por las instrucciones BNDLDX y Plataforma BNDSTX en modo de 64 bits.

ECX[22] RDPID Si 1, RDPID y el IA32 TSC AUX MSR son Plataforma disponible.

ECX[23] KEY LOCKER Si 1, soporta Key Locker.                       Platform ECX[24] BUS LOCK DETECT ECX[25] CLDEMOTE Si 1, indica el soporte para la detección de bloqueos de autobús OS. Plataforma ECX[26] Reservado ECX[27] MOVDIRI Si 1, es compatible con el demote de línea de caché.                Plataforma ECX[28] MOVDIR64B ECX[29] ENQCMD Reservado.

```text
                                                    If 1, supports the MOVDIRI instruction.          Platform
```

```text
                                                    If 1, supports the MOVDIR64B instruction.        Platform
```

```text
                                                    If 1, supports Enqueue Stores.                   Platform
```

ECX[30] SGX LC Si 1, admite la configuración de lanzamiento SGX.               Plataforma ECX[31] Plataforma PKS Si 1, soporta protección claves para páginas de control.

CPUID.07H.00H:EDX Extended Feature Flags Information

El registro EDX de CPUID.07H.00H devuelve la información que se muestra a continuación.

**hoja 07H.00H Banderas Extendidas Estructuradas Regresadas en EDX**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EDX[0] | Reservado | Reservado. |  |
| EDX[1] | SGX_KEYS | Si 1, es compatible con los servicios de certificación para Intel(R) SGX. | Plataforma |
| EDX[2] | AVX512_4VNNIW | Si 1, soporta las instrucciones AVX512 4VNNIW. (Intel(R) Xeon PhiTM only.) | Plataforma |
| EDX[3] | AVX512_4FMAPS | Si 1, soporta las instrucciones AVX512 4FMAPS. (Intel(R) Xeon PhiTM only.) | Plataforma |
| EDX[4] | FAST_SHORT_REP_MOVSB | Si 1, soporta Fast Short REP MOVSB. | Plataforma |
| EDX[5] | UINTR | Si 1, permite que el usuario interrumpa. | Plataforma |
| EDX[7:6] | Reservado | Reservado. |  |
| EDX[8] | AVX512_VP2INTERSECT | Si 1, soporta la instrucción AVX512 VP2INTERSECT. | Plataforma |
| EDX[9] | MCU_OPT_CTRL | Si 1, soporta tanto el IA32 MCU OPT CTRL MSR como su bit 0 (RNGDS MITG DIS). | Plataforma |
| EDX[10] | MD_CLEAR | Si 1, es compatible con MD CLEAR. | Plataforma |
| EDX[11] | RTM_ALWAYS_ABORT | Si 1, cualquier ejecución de XBEGIN inmediatamente aborta y transiciones a la dirección descomposición especificada. | Plataforma |
| EDX[12] | Reservado | Reservado. |  |
| EDX[13] | RTM_FORCE_ABORT | Si 1, soporta RTM FORCE ABORT y el IA32 TSX FORCE ABORT MSR. Estos permiten que el software establezca IA32 TSX FORCE ABORT[0] (RTM FORCE ABORT). | Plataforma |
| EDX[14] | SERIALIZE | Si 1, soporta la instrucción SERIALIZE. | Plataforma |
| EDX[15] | HYBRID | Si 1, el procesador se identifica como una parte híbrida. Si CPUID.00H.MAXLEAF 1AH y CPUID.1AH:EAX <> 0, entonces el modelo nativo ID Enumeration hoja 1AH existe. | Plataforma |
| EDX[16] | TSXLDTRK | Si 1, es compatible con Intel TSX suspender/resumir el seguimiento de la dirección de carga. | Plataforma |
| EDX[17] | Reservado | Reservado. |  |
| EDX[18] | PCONFIG | Si 1, soporta la instrucción PCONFIG. | Plataforma |
| EDX[19] | ARCH_LBRS | Si 1, soporta LBRs arquitectónicos. | Plataforma |
| EDX[20] | CET_IBT | Si 1, soporta las funciones de seguimiento de ramas indirectas CET. Los procesadores que fijan este bit definen bits 5:2 y bits 63:10 de las MSR IA32 U CET y IA32 S CET. | Plataforma |
| PROCESSOR | IDENTIFICATION AND FEATURE DETERMINATION |  |  |
| EDX[21] | Reservado | Reservado. |  |
| EDX[22] | AMX_BF16 | Si 1, soporta operaciones computacionales de azulejos en números bfloat16. | Plataforma |
| EDX[23] | AVX512_FP16 | Si 1, soporta el tipo de datos FP16 con instrucciones AVX512. | Plataforma |
| EDX[24] | AMX_TILE | Si 1, soporta arquitectura de azulejos. | Plataforma |
| EDX[25] | AMX_INT8 | Si 1, soporta operaciones computacionales de azulejos en enteros de 8 bits. | Plataforma |
| EDX[26] | IBRS_IBPB | Si 1, soporta la especulación restringida de rama indirecta (IBRS) y la barrera predictora de rama indirecta (IBPB). Los procesadores que fijan este bit apoyan el IA32 SPEC CTRL MSR y el IA32 PRED CMD MSR. Permiten que el software establezca IA32 SPEC CTRL[0] (IBRS) e IA32 PRED CMD[0] (IBPB). | Plataforma |
| EDX[27] | SPEC_CTRL_ST_PREDICTORS | Si 1, soporta los predictores de rama indirecta de hilo único (STIBP). Los procesadores que establecen este bit apoyan el IA32 SPEC CTRL MSR. Permiten que el software establezca IA32 SPEC CTRL[1] (STIBP). | Plataforma |
| EDX[28] | L1D_FLUSH_INTERFACE | Si 1, soporta L1D FLUSH. Los procesadores que establecen este bit apoyan el IA32 FLUSH CMD MSR. Permiten que el software establezca IA32 FLUSH CMD[0] (L1D - FLUSH). | Plataforma |
| EDX[29] | ARCH_CAPABILITIES | Si 1, es compatible con IA32 ARCH CAPABILITIES MSR. | Plataforma |
| EDX[30] | CORE_CAPABILITIES | Si 1, es compatible con IA32 CORE CAPABILITIES MSR. IA32 CORE CAPABILITIES es un MSR arquitectónico que enumera características específicas del modelo. Un poco que se establece en este MSR indica que una característica específica modelo es compatible; el software todavía debe consultar a la familia CPUID/modelo/sueldo para determinar el comportamiento de la característica enumerada como características enumeradas en IA32 CORE CAPABILITIES puede tener un comportamiento diferente en diferentes modelos de procesador. Algunas de estas características pueden tener comportamientos consistentes en modelos de procesadores (y para los cuales no es necesaria la consulta de la familia CPUID/model/stepping); tales características se identifican explícitamente cuando se documentan en este manual. | Plataforma |
| EDX[31] | SPEC_CTRL_SSBD | Si 1, es compatible con el dispositivo de derivación de la tienda especulativa (SSBD). Los procesadores que establecen este bit apoyan el IA32 SPEC CTRL MSR. Permiten que el software establezca IA32 SPEC CTRL[2] (SSBD). | Plataforma |

EDX[21] Reservado.                                           Plataforma EDX[22] AMX BF16 Platform

```text
                                                    If 1, supports tile computational operations on     Platform
```

EDX[23] AVX512 FP16 bfloat16 números.                                   Plataforma EDX[24] AMX TILE Si 1, soporta el tipo de datos FP16 con instrucciones AVX512 EDX[25] AMX INT8.                                       Plataforma Plataforma EDX[26] IBRS IBPB Si 1, admite arquitectura de azulejos.                   Plataforma EDX[27] SPEC CTRL ST PREDICTORS Si 1, admite operaciones computacionales de azulejos en

```text
                                                    8-bit integers.                                     Platform
```

EDX[28] L1D FLUSH INTERFACE Si 1, soporta la rama indirecta restringida EDX[29] ARCH CAPABILITIES speculation (IBRS) y la rama indirecta EDX[30] CORE CAPABILITIES predictor barrier (IBPB). Los procesadores que fijan este bit apoyan el IA32 SPEC CTRL MSR y el EDX[31] SPEC CTRL SSBD IA32 PRED CMD MSR. Permiten que el software establezca IA32 SPEC CTRL[0] (IBRS) e IA32 PRED CMD[0] (IBPB).

Si 1, soporta los predictores de rama indirecta de hilo único (STIBP). Los procesadores que establecen este bit apoyan el IA32 SPEC CTRL MSR. Permiten que el software establezca IA32 SPEC CTRL[1] (STIBP).

Si 1, soporta L1D FLUSH. Los procesadores que establecen este bit apoyan el IA32 FLUSH CMD MSR. Permiten que el software establezca IA32 FLUSH CMD[0] (L1D - FLUSH).

Si 1, es compatible con IA32 ARCH CAPABILITIES MSR.

Si 1, es compatible con IA32 CORE CAPABILITIES MSR. IA32 CORE CAPABILITIES es un MSR arquitectónico que enumera características específicas del modelo. Un poco que se establece en este MSR indica que una característica específica modelo es compatible; el software todavía debe consultar a la familia CPUID/modelo/sueldo para determinar el comportamiento de la característica enumerada como características enumeradas en IA32 CORE CAPABILITIES puede tener un comportamiento diferente en diferentes modelos de procesador. Algunas de estas características pueden tener comportamientos consistentes en modelos de procesadores (y para los cuales no es necesaria la consulta de la familia CPUID/model/stepping); tales características se identifican explícitamente cuando se documentan en este manual.

Si 1, es compatible con el dispositivo de derivación de la tienda especulativa (SSBD). Los procesadores que establecen este bit apoyan el IA32 SPEC CTRL MSR. Permiten que el software establezca IA32 SPEC CTRL[2] (SSBD).

CPUID.07H.01H - Característica ampliada estructurada subhoja 1

CPUID.07H.01H:EAX Extended Feature Information

El registro EAX de CPUID.07H.01H devuelve la información que se muestra a continuación.

**hoja 07H.01H Banderas Extendidas Estructuradas Regresadas en EAX**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[0] | SHA512 | Si 1, soporta las instrucciones SHA512. | Plataforma |
| EAX[1] | SM3 | Si 1, soporta las instrucciones SM3. | Plataforma |
| EAX[2] | SM4 | Si 1, soporta las instrucciones SM4. | Plataforma |
| EAX[3] | Reservado | Reservado. |  |
| EAX[4] | AVX_VNNI | Si 1, apoya el VEX-versiones codificadas de las Instrucciones de la Red Neural Vector. | Plataforma |
| EAX[5] | AVX512_BF16 | Si 1, es compatible con las Instrucciones de la Red Neural Vector que soportan las entradas de BFLOAT16 y las instrucciones de conversión de IEEE de precisión única. | Plataforma |
| EAX[6] | LASS | Si 1, es compatible con la separación del espacio de dirección lineal. | Plataforma |
| EAX[7] | CMPCCXADD | Si 1, apoya la instrucción CMPccXADD. | Plataforma |
| EAX[8] | ARCH_PERFMON_EXT | Si 1, soporta ArchPerfmonExt. Cuando se establece, indica que el monitoreo de rendimiento arquitectónico Extendido hoja (EAX=23H) es válido. | Plataforma |
| EAX[9] | Reservado | Reservado. |  |
| EAX[10] | FAST_REP_MOVSB | Si 1, es compatible con REP MOVSB de longitud cero. | Plataforma |
| EAX[11] | FAST_REP_STOSB | Si 1, soporta rápido corto REP STOSB. | Plataforma |
| EAX[12] | FAST_REP_CMPSB_SCASB | Si 1, es compatible con REP CMPSB rápido, REP SCASB. | Plataforma |
| EAX[16:13] | Reservado | Reservado. |  |
| EAX[17] | FRED | Si 1, soporta la entrega flexible de retorno y evento y el estado arquitectónico (MSRs) definido por FRED. Cualquier procesador Intel que enumera soporte para las transiciones FRED también enumerará el soporte para LKGS. | Plataforma |
| EAX[18] | LKGS | Si 1, soporta la instrucción LKGS (cargar en la instrucción IA32 KERNEL GS BASE). | Plataforma |
| EAX[19] | WRMSRNS | Si 1, soporta la instrucción WRMSRNS. | Plataforma |
| EAX[20] | Reservado | Reservado. |  |
| EAX[21] | AMX_FP16 | Si 1, soporta operaciones computacionales de azulejos en números FP16. | Plataforma |
| EAX[22] | HRESET | Si 1, soporta el reinicio de la historia a través de la instrucción HRESET y el IA32 HRESET ENABLE MSR. Cuando se establece, indica que el Processor History Reset hoja (EAX = 20H) es válido. | Plataforma |
| EAX[23] | AVX_IFMA | Si 1, soporta las instrucciones AVX-IFMA. | Plataforma |
| EAX[25:24] | Reservado | Reservado. |  |
| EAX[26] | LAM | Si 1, es compatible con la dirección lineal Masking. | Plataforma |
| EAX[27] | MSRLIST | Si 1, soporta las instrucciones RDMSRLIST y WRMSRLIST y el IA32 BARRIER MSR. | Plataforma |
| EAX[29:28] | Reservado | Reservado. |  |
| EAX[30] | INVD_DISABLE_POST_BIOS_DONE | Si 1, apoya la prevención de la ejecución de INVD después de BIOS Done. | Plataforma |

EAX[31] Reservado.

CPUID.07H.01H:EBX Extended Feature Information

El registro EBX de CPUID.07H.01H devuelve la información que se muestra a continuación.

**hoja 07H.01H Banderas Extendidas Estructuradas Regresadas en EBX**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EBX[0] | PPIN | Si 1, soporta los MSR IA32 PPIN y IA32 PPIN CTL. | Plataforma |
| EBX[1] | PBNDKB | Si 1, apoya la instrucción PBNDKB y enumera la existencia de la IA32 TSE CAPABILIDAD MSR. | Plataforma |
| EBX[2] | Reservado | Reservado. |  |
| EBX[3] | CPUIDMAXVAL_LIM_RMV | Si 1, IA32 MISC ENABLE[bit 22] no se puede establecer a 1 para limitar el valor devuelto por CPUID.00H:EAX[7:0]. | Plataforma |
| EBX[31:4] | Reservado | Reservado. |  |

**hoja 07H.01H Banderas Extendidas Estructuradas Regresadas en ECX**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| ECX[0] | RDT_M_ASYM | Si 1, al menos un procesador lógico en esta plataforma soporta la capacidad de monitoreo de Intel(R) asimétrico RDT. |  |
| ECX[1] | RDT_A_ASYM | Si 1, por lo menos un procesador lógico en esta plataforma es compatible con la capacidad de Asignación Asimétrica Intel(R) RDT. |  |
| ECX[31:2] | Reservado | Reservado. |  |

**hoja 07H.01H Banderas Extendidas Estructuradas Regresadas en EDX**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EDX[3:0] | Reservado | Reservado. |  |
| EDX[4] | AVX_VNNI_INT8 | Si 1, soporta las instrucciones AVX-VNNI-INT8. | Plataforma |
| EDX[5] | AVX_NE_CONVERT | Si 1, soporta las instrucciones AVX-NE-CONVERT. | Plataforma |
| EDX[7:6] | Reservado | Reservado. |  |
| EDX[8] | AMX_COMPLEX | Si 1, soporta las instrucciones AMX COMPLEX. |  |
| EDX[9] | Reservado | Reservado. |  |
| EDX[10] | AVX_VNNI_INT16 | Si 1, soporta las instrucciones AVX-VNNI-INT16. | Plataforma |
| 21-32 Vol. 1 |  |  |  |
|  | PROCESSOR | IDENTIFICATION AND FEATURE DETERMINATION |  |

EDX[13:11] Reservado.                                                        Plataforma EDX[14] PREFETCHI Plataforma EDX[16:15] Reservado Si 1, soporta las instrucciones PREFETCHIT0/1.                   Plataforma EDX[17] UIRET UIF

```text
                                   Reserved.                                                        Platform
```

EDX[18]       CET_SSS                                                                               Platform

```text
                                   If 1, UIRET sets UIF to the value of bit 1 of the                Platform
```

EDX[19] AVX10 RFLAGS imagen cargada de la pila.                              Plataforma

EDX[21:20] Reservado Si 1, indica que un sistema operativo puedeEDX[22] SEC-TEE-ATTESTATIONhabilitar las pilas de sombras de supervisor mientrasEDX[23] MWAITasegura que una pila de sombra supervisor no puede estar prematuramente ocupado debido a fallas de páginaEDX[24] SLSM(ver la sección 17.2.3 del Intel(R) 64 y el Manual del Desarrollador de Software de Arquitectura IA-32,EDX[31:25] Volumen reservado 1). Al emular la instrucción CPUID, un monitor de máquina virtual (VMM) debe devolver este bit como 1 solo si asegura que las salidas de VM no pueden hacer que una pila de sombra de supervisor de invitados parezca estar prematuramente ocupada. Tal VMM podría establecer la "pila de sombras prematuramente ocupada" control de salida VM y utilizar la información adicional que proporciona.

Si 1, soporta las instrucciones Intel(R) AVX10 e indica la presencia de CPUID.24H, que enumera el número de versión.

Reserved.

N/A

If 1, MWAIT is supported (even if CPUID.01H:ECX.MONITOR[3] is enumerated as 0).

Static LSM es compatible en esta plataforma. Si se establece, IA32 INTEGRITY STATUS (0x2DC) está disponible para uso de software.

Reserved.

CPUID.07H.02H -- Estructura de la alimentación extendida subhoja 2

CPUID.07H.02H devuelve la información estructurada de características extendidas contenida en las sub-secciones de esta sección.

Cuadro de salida CPUID 21-26. Hoja 07H subhoja (ECX=2) Registros Registros Descripción

EAX[31:0] Reservado EBX[31:0] Reservado ECX[31:0] Información sobre las características extendidas (ver "CPUID.07H.02H:EDX--Información sobre las características previstas")

EDX[31:0]

CPUID.07H.02H:EDX Extended Feature Information

El registro EDX de CPUID.07H.02H devuelve la información que se muestra a continuación.

**CPUID.07H.02H Extended Feature Information Provided in EDX1**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EDX[0] | PSFD | Si 1, soporta el bit 7 del IA32 SPEC CTRL MSR. Un poco 7 de este MSR deshabilita Fast Store Forwarding Predictor sin desactivar Speculative Store Bypass. | Plataforma |
| EDX[1] | IPRED_CTRL | Si 1, soporta bits 3 y 4 del IA32 SPEC CTRL MSR. El bit 3 de este MSR permite el control IPRED DIS para CPL3. El bit 4 de este MSR permite el control IPRED DIS para CPL0/1/2. | Plataforma |
| EDX[2] | RRSBA_CTRL | Si 1, soporta los bits 5 y 6 del IA32 SPEC CTRL MSR. Un poco 5 de este MSR deshabilita el comportamiento RRSBA para CPL3. Bit 6 de este MSR deshabilita el comportamiento RRSBA para CPL0/1/2. | Plataforma |
| EDX[3] | DDPD_U | Si 1, soporta el bit 8 del IA32 SPEC CTRL MSR. Un poco 8 de este MSR desactiva Data Dependent Prefetcher. | Plataforma |
| EDX[4] | BHI_CTRL | Si 1, soporta el bit 10 del IA32 SPEC CTRL MSR. Un poco 10 de este MSR permite el comportamiento de BHI DIS S. | Plataforma |
| EDX[5] | MCDT_NO | Si 1, el procesador no muestra el comportamiento de MXCSR Configuration Dependent Timing (MCDT) y no necesita ser mitigado para evitar el comportamiento dependiente de datos para ciertas instrucciones. | Plataforma |
| EDX[6] | UC_LOCK_DISABLE | Si 1, es compatible con la función deshabilitación UC-lock y causa #AC. | Plataforma |
| EDX[7] | MONITOR_MITG_NO | Si 1, las instrucciones MONITOR/UMONITOR no se ven afectadas por problemas de rendimiento o potencia debido a las instrucciones MONITOR/UMONITOR superiores a la capacidad de una tabla de seguimiento interna de monitores. Si 0, entonces el producto puede ser afectado por este problema. | Plataforma |
| EDX[31:8] | Reservado | Reservado. |  |

CPUID.08H -- Reserved

Este hoja está reservado.

Registro Nombre del campo Cuadro 21-28. Hoja 08H Reservado Dominio EAX[31:0] Reservado EBX[31:0] Reservado Descripción ECX[31:0] Reservado. EDX[31:0] Reservado. Reservado. Reservado.

CPUID.09H - Información de acceso directo al caché

CPUID.09H devuelve información sobre las capacidades Direct Cache Access. * Este hoja es válido si CPUID.01H:ECX.DCA[18] = 1 y MAX LEAF 09H. * Este hoja no contiene subhojas y proporciona la misma información independientemente del valor de ECX.

**hoja 09H Direct Cache Access Information**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[31:0] | PLATFORM_DCA_CAP | Valor de los bits [31:0] de IA32 PLATFORM DCA CAP MSR (dirección 1F8H). | Plataforma |
| EBX[31:0] | Reservado | Reservado. |  |
| ECX[31:0] | Reservado | Reservado. |  |
| EDX[31:0] | Reservado | Reservado. |  |

CPUID.0AH - Supervisión de la actuación arquitectónica

CPUID.0AH devuelve información sobre el apoyo a las capacidades de monitoreo del rendimiento arquitectónico. * Este hoja es válido si CPUID.0AH:EAX[7:0] (Version ID) > 0 y MAX LEAF 0AH. * Este hoja no contiene subhojas y proporciona la misma información independientemente del valor de ECX.

**hoja 0AH Architectural Performance Monitoring**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[7:0] | VERSION | Version ID de monitoreo de rendimiento arquitectónico. | Plataforma |
| EAX[15:8] | NUM_GP_CTRS | Número de contadores de vigilancia del desempeño para fines generales por procesador lógico. | Plataforma |
| EAX[23:16] | GP_CTR_WIDTH | Ancho de bit de uso general, contador de monitoreo de rendimiento. | Plataforma |
| EAX[31:24] | EVENT_ENUM_LENGTH | Longitud del vector de bit EBX para enumerar eventos de monitoreo de rendimiento arquitectónico. Evento arquitectónico x es compatible siEBX[x]=0 && EAX[31:24]>x. | Plataforma |
| EBX[0] | CORE_CYC_NA | Ciclo básico no disponible si 1 o si EAX[31:24]<1. | Plataforma |
| EBX[1] | INTR_RET_NA | Instrucción evento retirado no disponible si 1 o si EAX[31:24]<2. | Plataforma |
| EBX[2] | REF_CYC_NA | Evento de ciclos de referencia no disponible si 1 o si EAX[31:24]<3. | Plataforma |
| EBX[3] | LLC_CYC_NA | Evento de referencia de caché de último nivel no disponible si 1 o si EAX[31:24]<4. | Plataforma |
| EBX[4] | LLC_MISSES_NA | El evento de caché de último nivel no está disponible si 1 o si EAX[31:24]<5. | Plataforma |
| EBX[5] | BR_INSTR_RET_NA | Instrucción de rama evento retirado no disponible si 1 o si EAX[31:24]<6. | Plataforma |
| EBX[6] | BR_MISPRED_RET_NA | Sucursal errorpredecir evento retirado no disponible si 1 o si EAX[31:24]<7. | Plataforma |
| EBX[7] | SLOTS_NA | Evento de ranuras de arriba abajo no disponible si 1 o si EAX[31:24]<8. | Plataforma |
| EBX[8] | BACKEND_NA | Topdown backend bound no disponible si 1 o si EAX[31:24] < 9. | Plataforma |
| EBX[9] | BADSPEC_NA | La mala especulación no está disponible si 1 o si EAX[31:24] < 10. | Plataforma |
| EBX[10] | FRONTEND_NA | Inicio de arriba abajo no está disponible si 1 o si EAX[31:24] < 11. | Plataforma |
| EBX[11] | RETIRING_NA | Topdown no disponible si 1 o si EAX[31:24] < 12. | Plataforma |
| EBX[12] | LBR_INSERTS_NA | LBR no está disponible si 1 o si EAX[31:24] < 13. | Plataforma |
| EBX[31:13] | Reservado | Reservado. |  |

ECX[31:0] FIXED CTR MASK Soporte de contadores fijos mascara de bit. Plataforma fija

```text
                                                    function performance counter 'i' is supported if          Platform
```

EDX[4:0] NUM FIXED CTR bit 'i' es 1 (el primer índice de contador comienza en cero). Es Plataforma

```text
                                                    recommended to use the following logic to                 Platform
```

EDX[12:5] FIXED CTR WIDTH determinar si se admite un contador fijo:

```text
                                                    FxCtr[i]_is_supported := ECX[i] || (EDX[4:0] > i);        Platform
```

EDX[14:13] Reservado EDX[15] CUALQUIERDA DEPRECACIÓN Número de contadores de funcionamiento fijo contiguos a partir de 0 (si EDX[19:16] SLOTS PER CYC Version ID > 1).

EDX[31:20] Ancho de funcionamiento fijo (si la versión ID > 1).

Reserved.

Empezando con la versión 5 de Monitoreo de Rendimiento Arquitectónico, este campo indica que un procesador admite la deprecación de modo AnyThread. Si este campo está establecido, el software puede optar por ignorar las directrices en "Cualquier Conteo de textos y Evolución de software" del Capítulo 21, " Supervisión de la ejecución", en el Intel(R) 64 e IA-32 Manual de desarrolladores de software, Volumen 3B

Si este campo no es cero, representa el número de ranuras Top-down Microarchitecture Analysis (TMA) por ciclo. Este número se puede multiplicar por el número de ciclos (de CPU_CLK_UNHALTED.THREAD / CPU_CLK_UNHALTED.CORE o IA32 FIXED CTR1) para determinar el número total de ranuras. Si este campo es cero, IA32 FIXED CTR3 debe utilizarse para determinar el número total de ranuras.

Reserved.

Para cada versión de la capacidad de monitoreo de rendimiento arquitectónico, el software debe enumerar este hoja para descubrir las instalaciones de programación y los eventos de rendimiento arquitectónico disponibles en el procesador. Los detalles se describen en el capítulo 21, "Control de la Implementación", en el Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 3C.

CPUID.0BH -- Topología ampliada

CPUID.0BH devuelve información sobre Topología Extendida. CPUID.1FH es un superset preferido a hoja 0BH. Intel recomienda primero comprobar la existencia de hoja 1FH antes de usar hoja 0BH. * Este hoja es válido si CPUID.0BH.00H:EBX[15:0] <> 0 y MAX LEAF 0BH.

* Cuando la hoja es inválido, CPUID.0BH.00H:ECX.DOMAIN_TYPE[15:8] reportará el Domain Type ID como Inválido (0). * Las subhojas se enumeran hasta que subhoja n regrese 0 en EBX[15:0]. * Si ECX contiene un índice subhoja inválido, EAX/EBX retorno 0. El índice subhoja n+1 es inválido si subhoja n devuelve EBX[15:0] como 0.

CPUID.0BH -- ECX >= 0

**hoja 0BH Extended Topology**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[4:0] | SHIFT_COUNT | El número de bits que el ID x2APIC debe ser transferido al derecho de abordar las instancias del siguiente dominio superior. Cuando el procesador lógico no es compatible con el procesador, el valor de este campo en el dominio Logical Processor subhoja puede ser devuelto como 0 (sin bits asignados en el ID x2APIC) o 1 (un bit asignado en el ID x2APIC); el software debe planificar en consecuencia. | Plataforma |
| EAX[31:5] | Reservado | Reservado. |  |
| EBX[15:0] | NEXT_LEVEL_NUM_LP | El número de procesadores lógicos a través de todos | Lógica |
|  |  | instancias de este dominio dentro del siguiente dominio de mayor alcance. (Por ejemplo, en un enchufe de procesador/paquete que comprende los núcleos "M" de procesadores lógicos "N" cada uno, el valor "core" del dominio sub- hoja de este campo sería M*N.) Este número refleja la configuración como enviado por Intel. Este campo también puede contener valores asimétricos en diferentes procesadores lógicos, como ejemplo de una mezcla de núcleos que soportan más de un procesador lógico con núcleos que soportan sólo un procesador lógico. Nota, el software no debe utilizar este campo para enumerar la topología del procesador. El software no debe utilizar el valor de EBX[15:0] para enumerar la topología procesadora del sistema. El valor solo está destinado a fines de visualización y diagnóstico. El número real de procesadores lógicos disponibles para BIOS/OS/Applications puede ser diferente del valor de EBX[15:0], dependiendo de las configuraciones de hardware de software y plataforma. | Procesador |
| EBX[31:16] | Reservado | Reservado. |  |
| ECX[7:0] | LEVEL_NUM | El índice de entrada ECX subhoja. | Plataforma |

ECX[15:8] DOMAIN TYPE Este campo proporciona un valor de identificación que la Plataforma indica el dominio mostrado en la tabla. ECX[31:16] Reservado Aunque se ordenan los dominios, sus valores de identificación Logical EDX[31:0] X2APIC ID no son y el procesador de software no debe depender de él. Tenga en cuenta que los valores de enumeración de 0 y 3-255 están reservados.

Reserved.

El ID X2APIC de este procesador lógico.

Las subhojas de CPUID.0BH describen una jerarquía ordenada de procesadores lógicos a partir del dominio más pequeño-scopio de un procesador lógico (subhoja índice 0) al dominio Core ( Índice subhoja 1) al dominio más grande-scopio (el último índice subhoja válido) que está implícitamente subordinado al dominio más alto-estado del proceso. Los detalles de cada dominio válido se enumeran por una subhoja correspondiente. Los detalles para un dominio incluyen su tipo y cómo todas las instancias de ese dominio determinan el número de procesadores lógicos y la partición x2 APIC ID en el siguiente dominio superior-scopio. El orden de dominios dentro de la jerarquía se fija arquitectónicamente como se muestra a continuación. Para un procesador dado, no todos los dominios pueden ser relevantes o enumerados; sin embargo, el procesador lógico y los dominios básicos siempre se enumeran. Para dos subhojas N válidos y N+1, subhoja N+1 representa el siguiente dominio inmediato de alto impacto con respecto al dominio de subhoja N para el procesador dado. Si el índice subhoja "N" devuelve un tipo de dominio inválido en ECX[15:08] (00H), entonces todos las subhojas con un índice superior a "N" también devuelven un tipo de dominio inválido. Una subhoja devolver un dominio inválido siempre devuelve 0 en EAX y EBX.

**Hierarchy of Valid Domain Enumerations in CPUID.0BH:ECX[15:8]**

| Jerarquía | Dominio | Valor de identificación del tipo de dominio |
| --- | --- | --- |
| Inválidos | Inválidos | 0 |
| Lo más bajo | Procesador lógico | 1 |
| ... | Core | 2 |
| Más alto | Paquete/Socket | (Implicado) |
| Reservado | Reservado | 3-255 |
| 21-40 Vol. 1 |  |  |
|  | PROCESSOR IDENTIFICATION AND FEATURE | DETERMINATION |
| CPUID.0CH - Reservado |  |  |

CPUID.0CH -- Reserved

Registro Nombre del campo Cuadro 21-33. Hoja 0CH Reservado Dominio EAX[31:0] Reservado EBX[31:0] Reservado Descripción ECX[31:0] Reservado. EDX[31:0] Reservado. Reservado. Reservado.

CPUID.0DH - Procesador Estado extendido

CPUID.0DH devuelve una representación de bit-vector de todas las extensiones del estado procesador que están soportadas en los requisitos de tamaño de procesador y almacenamiento de la zona XSAVE/XRSTOR. * Este hoja es válido si CPUID.01H:ECX.XSAVE[26] = 1 y MAX LEAF 0DH. * Sub-leafs 0 y 1 son siempre válidos; consulte a ellos para determinar qué otros sub-leafs están presentes como se describe en "CPUID.0DH.n, n>01H--State subhojas".

CPUID.0DH.00H -- Processor Extended State Main subhoja

CPUID.0DH.00H devuelve la información del estado del procesador.

**hoja 0DH.00H Processor Extended State**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[0] | X87 | estado x87. | Plataforma |
| EAX[1] | SSE | Estado SSE. | Plataforma |
| EAX[2] | AVX | Estado AVX. | Plataforma |
| EAX[3] | MPX_BNDREGS | Estado MPX. | Plataforma |
| EAX[4] | MPX_BNDCSR | Estado MPX. | Plataforma |
| EAX[5] | AVX512_OPMASK | AVX-512 estado de Opmask. | Plataforma |
| EAX[6] | AVX512_ZMM_HI256 | AVX-512 ZMM superior 256 data state. | Plataforma |
| EAX[7] | AVX512_HI16_ZMM | AVX-512 superior 16 ZMM registra estado. | Plataforma |
| EAX[8] | N/A | Siempre regresa 0 (Allocated for IA32 XSS). | Plataforma |
| EAX[9] | PKRU | Estado PKRU. | Plataforma |
| EAX[16:10] | N/A | Siempre regresa 0 (Allocated for IA32 XSS). | Plataforma |
| EAX[17] | AMX_TILECFG | Estado TILECFG. | Plataforma |
| EAX[18] | AMX_TILEDATA | Estado TILEDATA. | Plataforma |
| EAX[31:19] | Reservado | Reservado. |  |
| EBX[31:0] | XSAVE_BYTES_ENABLED_FEATURES | Tamaño máximo (bytes, desde el comienzo del | Lógica |
|  |  | XSAVE/XRSTOR área de ahorro) requerida por características habilitadas en XCR0. Puede ser diferente a ECX si algunas características al final del área de ahorro XSAVE no están habilitadas. | Procesador |
| ECX[31:0] | XSAVE_BYTES_SUPPORTED_FEATURES | Tamaño máximo (bytes, desde el comienzo de la zona de ahorro XSAVE/XRSTOR) de la zona de XSAVE/XRSTOR requerida por todas las características soportadas en los procesadores, es decir, todos los campos de bit válidos en XCR0. | Plataforma |
| EDX[31:0] | VALID_XCR0_UPPER_32 | Reporta los bits soportados de los 32 bits superiores de XCR0. XCR0[n+32] se puede establecer a 1 sólo si EDX[n] es 1. | Plataforma |

CPUID.0DH.01H -- Feature and Supervisor State subhoja

CPUID.0DH.01H devuelve la función y la información del estado de control.

**hoja 0DH.01H Processor Extended State**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[0] | XSAVEOPT | Si 1, soporta XSAVEOPT. | Plataforma |
| EAX[1] | XSAVEC | Si 1, soporta XSAVEC y la forma compactada de XRSTOR. | Plataforma |
| EAX[2] | XGETBV1 | Si 1, soporta XGETBV con ECX = 1. | Plataforma |
| EAX[3] | XSAVES | Si 1, soporta XSAVES/XRSTORS e IA32 XSS. | Plataforma |
| EAX[4] | XFD | Si 1, es compatible con la función extendida (XFD). | Plataforma |
| EAX[31:5] | Reservado | Reservado. |  |
| EBX[31:0] | XSAVES_BYTES_ENABLED_FEATURES | El tamaño en bytes del área XSAVE que contiene | Lógica |
|  |  | todos los estados habilitados por XCR0 \ eterna IA32 XSS. Si EAX[3] se enumera como 0 y EAX[1] se enumera como 1, EBX enumera el tamaño de la zona XSAVE que contiene todos los estados habilitados por XCR0. Si EAX[1] y EAX[3] se enumeran como 0, EBX enumera cero. | Procesador |
| ECX[7:0] | N/A | Siempre regresa 0 (Allocated for XCR0). | Plataforma |
| ECX[8] | PT | Estado PT. | Plataforma |
| ECX[9] | Reservado | Siempre regresa 0 (Allocated for XCR0). |  |
| ECX[10] | PASID | Estado PASID. | Plataforma |
| ECX[11] | CET_U | CET estado de usuario. | Plataforma |
| ECX[12] | CET_S | Estado supervisor de CET. | Plataforma |
| ECX[13] | HDC | Estado HDC. | Plataforma |
| ECX[14] | UINTR | Estado UINTR. | Plataforma |
| ECX[15] | LBR | Estado LBR (sólo para la característica arquitectónica LBR). | Plataforma |
| ECX[16] | HWP | Estado HWP. | Plataforma |
| ECX[18:17] | N/A | Siempre regresa 0 (Allocated for XCR0). | Plataforma |
| ECX[31:19] | Reservado | Reservado. |  |
| EDX[31:0] | Reservado | Reservado |  |

//* Para cada característica soportada indicada por subhoja 0 y 1, lea el tamaño y offset subhoja */ Para j= 2 a 62

SiCPUID.0DH.00H:<EDX:EAX>[j] ==1 o // Uso valor de 64 bitsEDX:EAX CPUID.0DH.01H:<EDX:ECX>[j] ==1) // Use valor de 64 bitsEDX:ECXRead(CPUID.0DH.j) // Examinar el tamaño y la compensación.

END IF END FOR

**hoja 0DH.subhojas Processor Extended State**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[31:0] | COMP_SIZE | El tamaño en bytes (desde el offset especificado en EBX) del área de ahorro para una característica de estado extendido asociado con un índice subhoja válido n. | Plataforma |
| EBX[31:0] | COMP_OFFSET | The offset in bytes of this extended state component's save area from the beginning of the XSAVE/XRSTOR area. Este campo informa 0 si el índice la subhoja, n, no mapa a un bit válido en el registro XCR0. Si ECX contiene un índice subhoja inválido, EAX/EBX/ECX/EDX retorno 0. Subhoja n (0 n 31) es inválido si subhoja 0 devuelve 0 en EAX[n] y subhoja 1 devuelve 0 en ECX[n]. Subhoja n (32 n 63) es inválido si subhoja 0 devuelve 0 en EDX[n-32] y subhoja 1 devuelve 0 en EDX[n- 32] | Plataforma |
| ECX[0] | COMP_SUP | Este bit se establece si el bit n (correspondiendo al índice la subhoja) es compatible con el IA32 XSS MSR; es claro si el bit n es compatible con XCR0. | Plataforma |
| ECX[1] | COMP_64B_ALIGNED | Este bit se establece si, cuando se utiliza el formato compactado de un área XSAVE, este componente estatal ampliado ubicado en el siguiente límite de 64 bytes después del componente estatal anterior (otros, se encuentra inmediatamente después del componente estatal anterior) | Plataforma |
| ECX[2] | COMP_XFD | Este bit está establecido para indicar soporte para el fallo XFD. | Plataforma |
| ECX[31:3] | Reservado | Reservado. |  |
| EDX[31:0] | Reservado | Reservado. |  |
| 21-44 Vol. 1 |  |  |  |

CPUID.0EH -- Reserved

Este hoja está reservado.

Registro Nombre del campo Cuadro 21-37. Hoja 0EH Reservado Dominio EAX[31:0] Reservado EBX[31:0] Reservado Descripción ECX[31:0] Reservado. EDX[31:0] Reservado. Reservado. Reservado.

CPUID.0FH -- Intel(R) Resource Director Technology (Intel(R) RDT) Monitoring

CPUID.0FH devuelve información para las capacidades de monitoreo de tecnología de Director de Recursos Intel. Como se describe a continuación, el software utiliza el vector bit devuelto en EDX por subhoja 00H para determinar los tipos de recursos disponibles (ResID) que pueden ser monitoreados. Esta información es necesaria para programar los MSR IA32 PQR ASSOC e IA32 QM EVTSEL de tal manera que los datos de calidad de servicio pueden leerse después del IA32 QM CTR MSR. * Este hoja es válido si CPUID.07H.00H:EBX.RDT_M[12] = 1 y MAX LEAF 0FH. * Si la hoja es válido, subhoja 00H siempre es válido. Subhoja n (n 1) sólo es válido cuando (CPUID.0FH.00H:EDX[n] == 1).

CPUID.0FH.00H -- Intel(R) RDT Monitoring Main subhoja

CPUID.0FH.00H devuelve información sobre Intel RDT Monitoring.

**hoja 0FH.00H Intel(R) Resource Director Technology (Intel(R) RDT) Monitoring**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[31:0] | Reservado | Reservado. |  |
| EBX[31:0] | MAX_RMID | Rango máximo (con base cero) de RMID dentro de este procesador físico de todo tipo. | Plataforma |
| ECX[31:0] | Reservado | Reservado. |  |
| EDX[0] | Reservado | Reservado. |  |
| EDX[1] | L3_MON | Si 1, es compatible con L3 Cache Intel RDT Monitoring. Índice subhoja 0 reporta el tipo de recurso válido empezando por la posición del bit 1 de EDX. | Plataforma |
| EDX[31:2] | Reservado | Reservado. |  |

**hoja 0FH.01H Intel(R) Resource Director Technology (Intel(R) RDT) Monitoring**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[7:0] | CTR_WIDTH | La anchura del contador se codifica como compensación de 24b. Un valor de cero en este campo indica que se admiten contadores de 24 bits. Un valor de 8 en este campo indica que se admiten contadores de 32 bits. | Plataforma |
| EAX[8] | RDT_M_OVF | Si 1, soporta un poco de desbordamiento en el IA32 QM CTR MSR (bit 61). | Plataforma |
| EAX[9] | IO_RDT_CMT | Si 1, indica la presencia de agente no CPU que apoya Intel RDT CMT. | Plataforma |
| EAX[10] | IO_RDT_MBM | Si 1, indica la presencia de agente no CPU que apoye el apoyo Intel RDT MBM. | Plataforma |
| 21-46 Vol. 1 |  |  |  |
|  | PROCESSOR IDENTIFICATION AND FEATURE | DETERMINATION |  |

EAX[31:11] Reservado.                                      Plataforma EBX[31:0] CONV FACTOR

```text
                          Factor used to convert from reported           Platform
```

ECX[31:0] MAX RMID L3 Valor IA32 QM CTR a la plataforma de ocupación derivada

```text
                          metric (bytes) and Memory Bandwidth            Platform
```

EDX[0] CMT L3 OCCUP Monitoreo (MBM) métricas.                      Plataforma EDX[1] MBM L3 TOTAL EDX[2] MBM L3 LOCAL Rango máximo (con base cero) de RMID de este EDX[31:3] Tipo de recurso reservado.

Si 1, es compatible con el monitoreo de ocupación L3.

Si 1, soporta el monitoreo total de ancho de banda L3.

Si 1, soporta el monitoreo de ancho de banda local L3.

Reserved.

CPUID.10H -- Intel(R) Resource Director Technology (Intel(R) RDT)

CPUID.10H devuelve información para Intel Resource Director Technology Allocation. Este hoja es válido cuando CPUID.07H.00H:EBX.RDT_A[15] = 1. Como se describe a continuación, el software utiliza el vector bit devuelto en EBX por subleaf 00H para determinar los tipos de recursos disponibles de QoS Enforcement (asignación) que son compatibles en el procesador. Esta información es necesaria para configurar cada clase de servicios usando máscaras de bit de la capacidad en los registros de QoS Mask, IA32 resourceType Mask n. * Este hoja es válido si CPUID.07H.00H:EBX.RDT_A[15] = 1 y MAX LEAF 10H. * Si la hoja es válido, subhoja 00H siempre es válido. Subhoja n (n 1) sólo es válido cuando (CPUID.10H.00H:EBX[n] == 1).

CPUID.10H.00H -- Intel(R) RDT Allocation Main subhoja

CPUID.10H.00H devuelve información sobre Intel RDT Asignación.

**hoja 10H.00H Intel(R) Resource Director Technology (Intel(R) RDT) Allocation**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[31:0] | Reservado | Reservado. |  |
| EBX[0] | Reservado | Reservado. |  |
| EBX[1] | CAT_L3 | Si 1, es compatible con L3 Cache Allocation Technology. Índice subhoja 0 reporta la identificación válida de recursos (ResID) comenzando en la posición bit 1 de EBX. | Plataforma |
| EBX[2] | CAT_L2 | Si 1, es compatible con L2 Cache Allocation Technology. | Plataforma |
| EBX[3] | MBA | Si 1, es compatible con Memory Bandwidth Allocation. | Plataforma |
| EBX[4] | Reservado | Reservado. |  |
| EBX[5] | CBA | Si 1, es compatible con Cache Bandwidth Allocation. | Plataforma |
| EBX[6] | RESOURCE_PRIORITY | Si 1, apoya la Prioridad de Recursos. | Plataforma |
| EBX[31:7] | Reservado | Reservado. |  |
| ECX[31:0] | Reservado | Reservado. |  |
| EDX[31:0] | Reservado | Reservado. |  |

**hoja 10H.01H Intel(R) Resource Director Technology (Intel(R) RDT) Allocation**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[4:0] | CAT_L3_BITMASK_LENGTH | Longitud de la máscara de bit de capacidad para el ResID correspondiente. Añadir uno al valor de retorno para obtener el resultado. | Plataforma |
| EAX[31:5] | Reservado | Reservado. |  |
| EBX[31:0] | CAT_L3_CONTENTION | Mapa de aislamiento/contención de las unidades de asignación. | Plataforma |
| 21-48 Vol. 1 |  |  |  |

ECX[0] Reservado.                                       Platform ECX[1] CAT L3 NONCPU Platform ECX[2] CAT L3 CDP Si 1, soporta L3 CAT para agentes no CPU.       Plataforma

ECX[3] CAT L3 NONCONTIG Si 1, soporta L3 Code y Data Prioritization Platform Technology. ECX[31:4] Reservado EDX[15:0] CAT L3 MAX CLOS Si 1, soporta bitmasks de capacidad no contigua. Los bits que se fijan en los diferentes EDX[31:16] Los registros IA32 L3 MASK n reservados no tienen que ser contiguos.

Reserved.

Número de clase de servicio más alta (COS) apoyado para este ResID.

Reserved.

CPUID.10H.02H -- L2 Cache Allocation Technology

CPUID.10H.ResID=2 devuelve información sobre L2 Cache Allocation Technology.

**hoja 10H.02H Intel(R) Resource Director Technology (Intel(R) RDT) Allocation**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[4:0] | CAT_L2_BITMASK_LENGTH | Longitud de la máscara de bit de capacidad para el ResID correspondiente. Añadir uno al valor de retorno para obtener el resultado. | Plataforma |
| EAX[31:5] | Reservado | Reservado. |  |
| EBX[31:0] | CAT_L2_CONTENTION | Mapa de aislamiento/contención de las unidades de asignación. | Plataforma |
| ECX[1:0] | Reservado | Reservado. |  |
| ECX[2] | CAT_L2_CDP | Si 1, apoya el código L2 y la tecnología de priorización de datos. | Plataforma |
| ECX[3] | CAT_L2_NONCONTIG | Si 1, soporta bitmasks de capacidad no contigua. Los bits que se establecen en los diferentes registros IA32 L2 MASK n no tienen que ser contiguos. | Plataforma |
| ECX[31:4] | Reservado | Reservado. |  |
| EDX[15:0] | CAT_L2_MAX_CLOS | Número de clase de servicio más alta (COS) apoyado para este ResID. | Plataforma |
| EDX[31:16] | Reservado | Reservado. |  |

**hoja 10H.03H Intel(R) Resource Director Technology (Intel(R) RDT) Allocation**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[11:0] | MBA_MAX | Reporta el valor máximo de trituración MBA compatible con el ResID correspondiente. Añadir uno al valor de retorno para obtener el resultado. | Plataforma |
| EAX[31:12] | Reservado | Reservado. |  |

EBX[31:0] Reservado.                                           Plataforma ECX[0] PER THREAD MBA Se admiten controles MBA per-thread.              Plataforma ECX[1] Reservado.                                           Plataforma ECX[2] MBA LINEAR Si 1, la respuesta de los valores de retraso es lineal. ECX[31:3] Reservado. EDX[15:0] MBA MAX CLOS Highest Class of Service (COS) es compatible con este ResID. EDX[31:16] Reservado.

CPUID.10H.05H -- Cache Bandwidth Allocation

**hoja 10H.05H Intel(R) Resource Director Technology (Intel(R) RDT) Allocation**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[7:0] | CBA_MAX_LEVELS | Reporta el nivel máximo de oscilación del núcleo apoyado para el ResID correspondiente. Agregue uno al valor de retorno para obtener el número de niveles de oscilación compatibles. | Plataforma |
| EAX[11:8] | BW_SCOPE | Si 1, indica el alcance lógico del procesador del IA32 QoS Core BW Thrtl n MSRs. Se reservan otros valores. | Plataforma |
| EAX[31:12] | Reservado | Reservado. |  |
| EBX[31:0] | Reservado | Reservado. |  |
| ECX[2:0] | Reservado | Reservado. |  |
| ECX[3] | CBA_LINEAR | Si 1, la respuesta del control de ancho de banda es aproximadamente lineal. Si 0, la respuesta del control de ancho de banda no es lineal. | Plataforma |
| ECX[31:4] | Reservado | Reservado. |  |
| EDX[15:0] | CBA_MAX_CLOS | Número de clase de servicio más alta (COS) apoyado para este ResID. | Plataforma |
| EDX[31:16] | Reservado | Reservado. |  |
| CPUID.10H.06H - | - Control de prioridades de recursos |  |  |

**hoja 10H.06H Intel(R) Resource Director Technology (Intel(R) RDT) Allocation**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[0] | THREAD_ENABLE | Si 1, es compatible con la habilitación de RP a través de la IA32 RESOURCE PRIORITY MSR. | Plataforma |
| EAX[1] | PACKAGE_ENABLE | Si 1, es compatible con el paquete de procesador físico que permite RP a través de IA32 RESOURCE PRIORITY PKG MSR. | Plataforma |
| EAX[31:2] | Reservado | Reservado. |  |
| EBX[31:0] | Reservado | Reservado. |  |
| ECX[31:0] | Reservado | Reservado. |  |
| EDX[31:0] | Reservado | Reservado. |  |
| 21-50 Vol. 1 |  |  |  |

CPUID.11H -- Reserved

Este hoja está reservado.

Registro Nombre del campo Cuadro 21-46. Hoja 11H Reservado Dominio EAX[31:0] Reservado EBX[31:0] Reservado Descripción ECX[31:0] Reservado. EDX[31:0] Reservado. Reservado. Reservado.

CPUID.12H -- Intel(R) Extensiones de la Guardia de Software (Intel(R) SGX) Capability

CPUID.12H devuelve información sobre las capacidades Intel(R) SGX. Más detalles se pueden encontrar en el Capítulo 35, "Introducción a extensiones de la Guardia de Software Intel(R)" y el Capítulo 36, "Control de acceso enclave y estructuras de datos", del Manual de Software de Arquitecturas Intel(R) 64 e IA-32, Volumen 3D. * Este hoja es válido cuando CPUID.07H.00H:EBX.SGX[2] = 1 y MAX LEAF 12H. * Si la hoja es válido, subhoja 00H y 01H siempre son válidos. Subhoja n (n 2) sólo es válido cuando CPUID.12H.n:EAX[3:0] != 0.

CPUID.12H.00H -- Intel(R) SGX Main subhoja

CPUID.12H.00H devuelve información sobre las capacidades Intel(R) SGX. Sólo es válido cuando CPUID.07H.00H:EBX.SGX = 1.

**hoja 12H.00H Intel(R) Extensiones de la Guardia de Software (Intel(R) SGX) Capability**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[0] | SGX1 | Si 1, es compatible con la colección de funciones SGX1 hoja. | Plataforma |
| EAX[1] | SGX2 | Si 1, es compatible con la colección de funciones SGX2 hoja. | Plataforma |
| EAX[6:2] | Reservado | Reservado. |  |
| EAX[7] | EVERIFYREPORT2 | Si 1, soporta la instrucción ENCLU hoja EVERIFYREPORT2. | Plataforma |
| EAX[9:8] | Reservado | Reservado. |  |
| EAX[10] | EUPDATESVN | Si 1, soporta la instrucción ENCLS hoja EUPDATESVN. | Plataforma |
| EAX[11] | EDECCSSA | Si 1, soporta la instrucción ENCLU hoja EDECCSSA. | Plataforma |
| EAX[31:12] | Reservado | Reservado. |  |
| EBX[31:0] | MISCSELECT | Bit vector de las características SGX ampliadas soportadas. La definición de MISCSELECT se puede encontrar en la Sección 36.7.2, "SECS.MISCSELECT Field", del Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volume 3D. | Plataforma |
| ECX[31:0] | Reservado | Reservado. |  |
| EDX[7:0] | MAX_ENCLAVE_SIZE_NOT_64 | El tamaño máximo de enclave soportado en modo no 64-bit es 2^(EDX[7:0]). | Plataforma |
| EDX[15:8] | MAX_ENCLAVE_SIZE_64 | El tamaño máximo de enclave soportado en modo de 64 bits es 2^(EDX[15:8]). | Plataforma |
| EDX[31:16] | Reservado | Reservado. |  |
| CPUID.12H.01H - | - Atributos Intel(R) SGX |  |  |

**hoja 12H.01H Intel(R) Extensiones de la Guardia de Software (Intel(R) SGX) Capability**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| 21-52 Vol. 1 |  |  |  |
|  |  | PROCESSOR IDENTIFICATION AND FEATURE | DETERMINATION |

EAX[31:0] ECREATE SECS ATTRIBUTES 31 0 Reporta los bits válidos de la Plataforma

```text
                                            SECS.ATTRIBUTES[31:0] that software can set     Platform
```

EBX[31:0] ECREATE SECS ATTRIBUTES 63 32 con ECREATE.                                   Platform Platform ECX[31:0] ECREATE SECS ATTRIBUTES 95 64 Informa los bits válidos de SECS.ATTRIBUTES[63:32] que el software puede establecer EDX[31:0] ECREATE SECS ATTRIBUTES 127 96 con ECREATE.

Reporta los bits válidos de SECS.ATTRIBUTES[95:64] que el software puede establecer con ECREATE.

Reporta los bits válidos de SECS.ATTRIBUTES[127:96] que el software puede establecer con ECREATE.

La definición de los atributos se puede encontrar en la Sección 36.7.1, "ATTRIBUTES", de Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volume 3D

CPUID.12H -- n2 - Intel(R) SGX Enclave Page Cache

CPUID.12H con ECX2 devuelve información sobre Intel(R) SGX Enclave Page Cache y es compatible con CPUID.07H.00H:EBX.SGX = 1. Para subhojas donde ECX2, la definición de EAX[31:4], EBX, ECX y EDX depende del tipo la subhoja que aparece a continuación.

Subhoja Tipo de codificación EAX[3:0] = 0000b (Inválido)

Este subhoja es inválido. EDX:ECX:EBX:EAX volver 0.

CPUID.12H -- subhoja Encoding Type EAX[3:0] = 0001b

Este subhoja enumera una sección EPC con EDX:ECX, EBX:EAX definido como sigue.

**hoja 12H.subhoja ENCODING TYPE EAX[3:0] = 0001B Intel(R) Extensiones de la Guardia de Software (Intel(R) SGX)**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[3:0] | SUB_LEAF_TYPE | El valor es de 0001b. | Plataforma |
| EAX[11:4] | Reservado | Reservado. |  |
| EAX[31:12] | EPC_SECTION_ADDR_31_12 | Bits 31:12 de la dirección física de la base de la sección EPC. | Plataforma |
| EBX[19:0] | EPC_SECTION_ADDR_51_32 | Bits 51:32 de la dirección física de la base de la sección EPC. | Plataforma |
| EBX[31:20] | Reservado | Reservado. |  |

ECX[3:0] EPC SECTION PROPERTY EPC Section Property Encoding Definitions, como sigue la Plataforma:

```text
                                                    0000b  All bits in EDX:ECX are enumerated as
```

0.

```text
                                                    0001b  This section has confidentiality,
```

integridad y protección de repetición.

```text
                                                    0010b  This section has confidentiality
```

protección sólo.

0011b - Esta sección tiene protección de confidencialidad e integridad. Todas las demás codificaciones están reservadas.

ECX[11:4] Reservado. ECX[31:12] EPC SECTION SIZE 31 12 Bits 31:12 del tamaño de la sección correspondiente de la plataforma EPC dentro de la memoria reservada del procesador.

EDX[19:0] EPC SECTION SIZE 51 32 Bits 51:32 del tamaño de la sección correspondiente de la plataforma EPC dentro de la memoria reservada del procesador.

EDX[31:20] Reservado.

CPUID.13H -- Reserved

Este hoja está reservado.

Registro Nombre del campo Cuadro 21-50. Hoja 13H Reservado Dominio EAX[31:0] Reservado EBX[31:0] Reservado Descripción ECX[31:0] Reservado. EDX[31:0] Reservado. Reservado. Reservado.

CPUID.14H -- Intel(R) Processor Trace (Intel(R) PT)

CPUID.14H devuelve información sobre Intel(R) Processor Trace (PT). CPUID.14H.00H devuelve información sobre extensiones de Intel Processor Trace. CPUID.14H.n (n > 0 y menos que el número de bits no cero en CPUID.14H.00H:EAX) devuelve información sobre la generación de paquetes en Intel Processor Trace. Para más detalles sobre Intel PT, consulte el capítulo 34, "Intel(R) Processor Trace", en el Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volume 3D. * Este hoja es válido cuando CPUID.07H.00H:EBX.INTEL_PROC_TRACE[25] = 1 y MAX LEAF 14H. * El valor máximo subhoja para ECX se especifica en CPUID.14H.00H.EAX[31:0] MAX SUBLEAF. * Si ECX contiene un índice subhoja inválido, EAX/EBX/ECX/EDX retorno 0. El índice subhoja n es inválido si n excede el valor que subhoja 0 retorna en EAX.

CPUID.14H.00H -- Intel(R) PT Main subhoja

CPUID.14H.00H devuelve información sobre extensiones de Intel Processor Trace.

**hoja 14H.00H Intel(R) Processor Trace (Intel(R) PT)**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[31:0] | MAX_SUBLEAF | Reporta el máximo subhoja apoyado en hoja 14H. | Plataforma |
| EBX[0] | CR3_FILTER | Si 1, soporta que IA32_RTIT_CTL.CR3Filter se puede configurar a 1, y que se puede acceder a IA32 RTIT CR3 MATCH MSR. | Plataforma |
| EBX[1] | CYC_ACC | Si 1, es compatible con Configurable PSB y Ciclo- Modo exacto. | Plataforma |
| EBX[2] | IP_FILTER | Si 1, admite filtrado IP, filtrado TraceStop y preservación de MSR Intel PT a través del reseteo cálido. | Plataforma |
| EBX[3] | MTC | Si 1, soporta el paquete de sincronización MTC y la supresión de paquetes basados en COFI. | Plataforma |
| EBX[4] | PTWRITE | Si 1, soporta PTWRITE. Los escritos pueden establecer IA32 RTIT CTL[12] (PTWEn) e IA32 RTIT CTL[5] (FUPonPTW), y PTWRITE puede generar paquetes. | Plataforma |
| EBX[5] | PWR_EVT_TRACE | Si 1, apoya Power Event Trace. Los escritos pueden configurar IA32 RTIT CTL[4] (PwrEvtEn), permitiendo la generación de paquetes Power Event Trace. | Plataforma |
| EBX[6] | PMI_PRESERVE | Si 1, soporta la preservación PSB y PMI. Los escritos pueden establecer IA32 RTIT CTL[56] (InjectPsbPmiOnEn- able), permitiendo al procesador establecer IA32 RTIT STATUS[7] (PendTopaPMI) y/o IA32 RTIT STATUS[6] (PendPSB) con el fin de preservar los PMIs y/o PSBs perdidos de otra manera debido a la inhabilitación Intel PT. Los escritos también pueden establecer PendToPAPMI y PendPSB. | Plataforma |
| EBX[7] | EVENT_TRACE | Si 1, los soportes que escribe pueden establecer IA32 RTIT CTL[31] (EventEn), permitiendo la generación de paquetes de Event Trace. | Plataforma |
| EBX[8] | TNT_DIS | Si 1, los soportes que escribe pueden establecer IA32 RTIT CTL[55] (DisTNT), desactivando la generación de paquetes TNT. | Plataforma |
| 21-56 Vol. 1 |  |  |  |

EBX[9] PTTT Si 1, Procesador Tracing Trigger Tracing (PTTT) es Plataforma

```text
                                       supported.                                         Platform
```

EBX[31:10] Reservado ECX[0] TOPAOUT reservado.                                          Plataforma

ECX[1] MENTRY Si 1, soporta que el rastreo puede ser habilitado con Plataforma

```text
                                       IA32_RTIT_CTL.ToPA = 1, hence utilizing the        Platform
```

ECX[2] SNGL RNG OUT ToPA output scheme;                                Logical ECX[3] TRACE TRANSPORT SUBSYSTEM IA32 RTIT OUTPUT BASE y procesador IA32 RTIT OUPUT MASK PTRS Los MSR pueden ser ECX[30:4] Se accede a la reserva. ECX[31] LIP Si 1, soporta que las tablas de ToPA pueden contener cualquier EDX[31:0] Número reservado de entradas de salida, hasta el máximo permitido por el campo MaskOrTableOffset de IA32 RTIT OUTPUT MASK PTRS.

Si 1, es compatible con el esquema de salida de una sola banda.

Si 1, soporta la salida al subsistema Trace Transport.

Reserved.

Si 1, los paquetes generados que contienen cargas IP contienen LIP. Si 0, los paquetes generados que contienen cargas IP contienen IP efectivas. Los segmentos de trace usando un modelo de memoria plana generarán la misma información independientemente de cómo un procesador lógico reporta este valor desde LIP=EIP.

Reserved.

CPUID.14H.01H - Información de las características subhoja

CPUID.14H.01H devuelve información sobre la generación de paquetes en Intel Processor Trace.

**hoja 14H.01H Intel(R) Processor Trace (Intel(R) PT)**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[2:0] | RANGECNT | Número de rangos de direcciones configurables para el filtrado. | Plataforma |
| EAX[7:3] | Reservado | Reservado. |  |
| EAX[10:8] | TRIGGER_CFG_CNT | Número de MSR IA32 RTIT TRIGGERx CFG. El número de disparadores soportados es 4x este valor. | Plataforma |
| EAX[15:11] | Reservado | Reservado. |  |
| EAX[31:16] | MTC_RATE | Bitmap of supported MTC period encodings. | Plataforma |
| EBX[15:0] | CYC_THRESHOLDS | Bitmap of supported Cycle Threshold value encodings. | Plataforma |
| EBX[31:16] | PSB_RATE | Bitmap de codificación de frecuencia configurable PSB. | Plataforma |
| ECX[0] | ICNT | Si 1, la acción de activación EN ICNT es compatible. | Plataforma |
| ECX[1] | TRIGGER_PAUSE | Si 1, las acciones de gatillo TRACE PAUSE y TRACE RESUME son compatibles. | Plataforma |
| ECX[14:2] | Reservado | Reservado. |  |

ECX[15] TRIGGER DR MATCH Si se admite un partido de DR de entrada de disparador.  Plataforma ECX[31:16] Reservado. EDX[31:0] Reservado.

CPUID.15H -- Time Stamp Counter y Nominal Core Crystal Clock

CPUID.15H devuelve información sobre el contador Time Stamp y el reloj Nominal Core Crystal. * Este hoja es válido si MAX LEAF 15H. * Este hoja no contiene subhojas y proporciona la misma información independientemente del valor de ECX.

**hoja 15H Time Stamp Counter and Nominal Core Crystal Clock**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[31:0] | DENOMINATOR | Un entero sin firmar que es el denominador del reloj de cristal TSC/"core" ratio. | Plataforma |
| EBX[31:0] | NUMERATOR | Un entero no firmado que es el numerador de la relación de cristal TSC/"core". Si 0, la relación TSC/"core cristal" no se enumera. | Plataforma |
| ECX[31:0] | NOMINAL_ART_FREQUENCY | Un entero sin firma que es la frecuencia nominal del reloj de cristal de núcleo en Hz. Si 0, la frecuencia nominal del reloj de cristal no se enumera. Nota, el reloj de cristal del núcleo puede diferir del reloj de referencia, reloj de autobús o frecuencias del reloj central. | Plataforma |
| EDX[31:0] | Reservado | Reservado. |  |

CPUID.16H - Información sobre frecuencias de procesador

CPUID.16H devuelve información sobre la frecuencia del procesador. Los datos se devuelven de esta interfaz de acuerdo con la especificación del procesador y no reflejan valores reales. El uso adecuado de estos datos incluye la visualización de la información del procesador de manera similar a la cadena de la marca del procesador y para determinar el rango adecuado a utilizar al mostrar información del procesador, por ejemplo gráficos de historia de frecuencia. La información devuelta no debe utilizarse para ningún otro propósito, ya que la información devuelta no se correlaciona con precisión con la información / contadores devueltos por otras interfaces de procesador. Si bien un procesador puede apoyar la información de frecuencia del procesador hoja, los campos que devuelven un valor de cero no son compatibles. * Este hoja es válido si MAX LEAF 16H. * Este hoja no contiene subhojas y proporciona la misma información independientemente del valor de ECX.

**hoja 16H Processor Frequency Information**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[15:0] | PROCESSOR_BASE_FREQUENCY | Frecuencia de base del procesador (en MHz). | Procesador lógico |
| EAX[31:16] | Reservado | Reservado. |  |
| EBX[15:0] | MAXIMUM_FREQUENCY | Frecuencia máxima (en MHz). | Procesador lógico |
| EBX[31:16] | Reservado | Reservado. |  |
| ECX[15:0] | BUS_FREQUENCY | Bus (Referencia) Frecuencia (en MHz). | Procesador lógico |
| ECX[31:16] | Reservado | Reservado. |  |
| EDX[31:0] | Reservado | Reservado. |  |
| 21-60 Vol. 1 |  |  |  |

CPUID.17H -- System-on-Chip Vendor Attribute

CPUID.17H devuelve información de atributo System-on-Chip. * Este hoja es válido si CPUID.17H.00H:EAX[31:0] (MaxSOCID Index) 3 y MAX LEAF 17H. * El valor máximo subhoja para ECX se especifica en CPUID.17H.00H.EAX[31:0] MaxSOCID Index. * Si ECX contiene un índice subhoja inválido, EAX/EBX/ECX/EDX retorno 0. El índice subhoja n es inválido si n excede el valor que subhoja 0 retorna en EAX.

CPUID.17H.00H -- Main subhoja

CPUID.17H.00H devuelve información de atributo System-on-Chip.

**hoja 17H.00H System-on-Chip Vendor Attribute**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[31:0] | MAX_SOCID_INDEX | Reporta el valor máximo de entrada de subhoja compatible en hoja 17H. | Plataforma |
| EBX[15:0] | SOC_VENDOR_ID | SOC ID de vendedor. | Plataforma |
| EBX[16] | IS_VENDOR_SCHEME | Si 1, el campo de identificación de proveedores SOC se asigna a través de un esquema de enumeración estándar de la industria. De lo contrario, el campo de identificación de proveedores SOC es asignado por Intel. | Plataforma |
| EBX[31:17] | Reservado | Reservado. |  |
| ECX[31:0] | PROJECT_ID | Un número único que un proveedor SOC asigna a sus proyectos SOC. | Plataforma |
| EDX[31:0] | STEPPING_ID | Un número único dentro de un proyecto SOC que un proveedor SOC asigna. | Paquete |

**hoja 17H.01H System-on-Chip Vendor Attribute**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[31:0] | VENDOR_BRAND_STRING_BYTES_0_to_3 | SOC Vendor Brand String. UTF-8 cadena codificada. | Plataforma |
| EBX[31:0] | VENDOR_BRAND_STRING_BYTES_4_to_7 | SOC Vendor Brand String. UTF-8 cadena codificada. | Plataforma |
| ECX[31:0] | VENDOR_BRAND_STRING_BYTES_8_to_11 | SOC Vendor Brand String. UTF-8 cadena codificada. | Plataforma |
| EDX[31:0] | VENDOR_BRAND_STRING_BYTES_12_to_15 | SOC Vendor Brand String. UTF-8 cadena codificada. | Plataforma |

**hoja 17H.02H System-on-Chip Vendor Attribute**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[31:0] | VENDOR_BRAND_STRING_BYTES_16_to_19 | SOC Vendor Brand String. UTF-8 cadena codificada. | Plataforma |
| EBX[31:0] | VENDOR_BRAND_STRING_BYTES_20_to_23 | SOC Vendor Brand String. UTF-8 cadena codificada. | Plataforma |

ECX[31:0] VENDOR BRAND STRING BYTES 24 to 27 SOC Vendor Brand String. UTF-8 cadena codificada. Platform EDX[31:0] VENDOR BRAND STRING BYTES 28 to 31 SOC Vendor Brand String. UTF-8 cadena codificada. Plataforma

CPUID.17H.03H -- Vendor Brand String subhoja (Bytes 32 a 47)

**hoja 17H.03H System-on-Chip Vendor Attribute**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[31:0] | VENDOR_BRAND_STRING_BYTES_32_to_35 | SOC Vendor Brand String. UTF-8 cadena codificada. | Plataforma |
| EBX[31:0] | VENDOR_BRAND_STRING_BYTES_36_to_39 | SOC Vendor Brand String. UTF-8 cadena codificada. | Plataforma |
| ECX[31:0] | VENDOR_BRAND_STRING_BYTES_40_to_43 | SOC Vendor Brand String. UTF-8 cadena codificada. | Plataforma |
| EDX[31:0] | VENDOR_BRAND_STRING_BYTES_44_to_47 | SOC Vendor Brand String. UTF-8 cadena codificada. | Plataforma |

**hoja 17H.M>MAXSOCID INDEX--RESERVED subhojas System-on-Chip Vendor Attribute**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[31:0] | Reservado | Reservado |  |
| EBX[31:0] | Reservado | Reservado |  |
| ECX[31:0] | Reservado | Reservado |  |
| EDX[31:0] | Reservado | Reservado |  |
| 21-62 Vol. 1 |  |  |  |

CPUID.18H -- Parámetros de traducción de direcciones deterministas

CPUID.18H devuelve información sobre los Parámetros de Traducción de Dirección Determinística. Cada subhoja enumera una estructura de traducción de dirección diferente. * Este hoja es válido si CPUID.18H.00H:EAX[31:0] <> 0 y MAX LEAF 18H. * El valor máximo subhoja para ECX se especifica en CPUID.18H.00H.EAX[31:0] MAX SUBLEAF. * Si ECX contiene un índice subhoja inválido, EAX/EBX/ECX/EDX retorno 0. El índice subhoja n es inválido si n excede el valor que subhoja 0 retorna en EAX. El índice una subhoja también es inválido si EDX[4:0] devuelve 0. * Válido subhojas no necesita ser contiguo o en cualquier orden particular. Una subhoja válido puede estar en un valor ECX de entrada más alto que una subhoja inválido o que una subhoja válido de una estructura superior o de menor nivel.

CPUID.18H.00H -- Main subhoja

Direcciones determinísticas Traducción Parámetros Principal hoja

**hoja 18H.00H Deterministic Address Translation Parameters**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[31:0] | MAX_SUBLEAF | Informes sobre el valor máximo de entrada del soporte | Lógica |
|  |  | subhoja en hoja 18H. | Procesador |
| EBX[31:0] | Reservado | Reservado. |  |
| ECX[31:0] | Reservado | Reservado. |  |
| EDX[4:0] | TYPE | Volverá siempre 0. | Procesador lógico |
| EDX[31:5] | Reservado | Reservado. |  |

**hoja 18H.ECX >=

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[31:0] | Reservado | Reservado. |  |
| EBX[0] | 4KB_ENTRIES | Si 1, admite entradas de tamaño de página 4K en este | Lógica |
|  |  | estructura. | Procesador |
| EBX[1] | 2MB_ENTRIES | Si 1, admite entradas de tamaño de página 2MB en este | Lógica |
|  |  | estructura. | Procesador |
| EBX[2] | 4MB_ENTRIES | Si 1, admite entradas de tamaño de página 4MB en este | Lógica |
|  |  | estructura. | Procesador |
| EBX[3] | 1GB_ENTRIES | Si 1, admite entradas de 1 GB de tamaño de página en este | Lógica |
|  |  | estructura. | Procesador |
| EBX[7:4] | Reservado | Reservado. |  |
| EBX[10:8] | PARTITIONING | Partitioning (0:Soft partición entre el | Lógica |
|  |  | procesadores lógicos que comparten esta estructura). | Procesador |
| EBX[15:11] | Reservado | Reservado. |  |
| EBX[31:16] | NUM_WAYS | W = formas de asociación. | Procesador lógico |
| ECX[31:0] | NUM_SETS | S = número de sets. | Procesador lógico |

EDX[4:0] TYPE 00000b: Null (indica este subhoja no es lógico

```text
                                                    valid).                                           Processor
```

EDX[7:5] LEVEL NUM 00001b: Datos TLB.

```text
                                                    00010b: Instruction TLB.                          Logical
```

EDX[8] FULLY ASSOC 00011b: Procesador TLB.1 unificado

```text
                                                    00100b: Load Only TLB. Hit on loads; fills on     Logical
```

EDX[13:9] Reservado tanto cargas como tiendas.                            Procesador EDX[25:14] MAX LP ADDRESSABLE IDS 00101b: Almacene sólo TLB. Hit on stores; fill on Logical

```text
                                                    stores.                                           Processor
```

Todas las demás codificaciones están reservadas. EDX[31:26] Reservados Algunos TLB unificados permitirán una única entrada TLB para satisfacer los datos de lectura/escritura e instrucción. Otros requerirán entradas separadas (por ejemplo, una cargada en la lectura/escritura de datos y otra cargada en una embrague de instrucciones). Vea el Intel(R) 64 y el Manual de Optimización de Arquitecturas IA-32 para detalles de un producto en particular.

Nivel de caché de traducción (a partir de 1).

Estructura totalmente asociativa.

Reserved.

Número máximo de IDs identificables para procesadores lógicos que comparten este caché de traducción. Añadir uno al valor de retorno para obtener el resultado.

Reserved.

CPUID.19H -- Key Locker

CPUID.19H devuelve información Key Locker. * Este hoja es válido si CPUID.07H.00H:ECX.KEY_LOCKER[23] = 1 y MAX LEAF 19H. * Este hoja no contiene subhojas y proporciona la misma información independientemente del valor de ECX.

**Leaf 19H Key Locker**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[0] | CPL0_RESTRICT | Si 1, es compatible con la restricción Key Locker de CPL0-only.1 | Plataforma |
| EAX[1] | NO_ENCRYPT_RESTRICT | Si 1, soporta la restricción Key Locker de no cifrado.1 | Plataforma |
| EAX[2] | NO_DECRYPT_RESTRICT | Si 1, es compatible con la restricción Key Locker de no descifrar.1 | Plataforma |
| EAX[31:3] | Reservado | Reservado. |  |
| EBX[0] | AESKLE | Si 1, las instrucciones AES Key Locker son completamente | Lógica |
|  |  | habilitado. CPUID.19H:EBX.AESKLE[0] se enumera como 1 si las instrucciones AES Key Locker han sido activadas por el firmware del sistema y CR4.KL[bit 19] = 1. El software puede comprobar este poco después de establecer CR4.KL para determinar si las instrucciones AES Key Locker han sido habilitadas. Tenga en cuenta que algunos procesadores pueden permitir habilitar esas instrucciones sin activación por el firmware del sistema. Algunos procesadores pueden no apoyar el uso de instrucciones AES Key Locker en el sistema-gestión-modo (SMM). Esos procesadores enumeran CPUID.19H:EBX.AESKLE[0] como 0 en SMM independientemente de la configuración de CR4.KL. | Procesador |
| EBX[1] | Reservado | Reservado. |  |
| EBX[2] | AES_WIDE | Si 1, soporta las instrucciones AES de ancho Key Locker.1 | Plataforma |
| EBX[3] | Reservado | Reservado. |  |
| EBX[4] | IWKEYBACKUP | Si 1, soporta los MSR Key Locker (IA32 COPY LOCAL TO PLATFORM, IA23 COPY PLATFORM TO LOCAL, IA32 COPY STATUS, IA32 IWKEYBACKUP STATUS) y respalda la clave de envoltura.1 | Plataforma |
| EBX[31:5] | Reservado | Reservado. |  |
| ECX[0] | NOBACKUP | Si 1, soporta el parámetro NoBackup a LOADIWKEY.1 | Plataforma |
| ECX[1] | RAND_IWKEY | Si 1, es compatible con la codificación KeySource de 1 (randomización del clave de envoltura interno).1 | Plataforma |
| ECX[31:2] | Reservado | Reservado. |  |
| EDX[31:0] | Reservado | Reservado. |  |

CPUID.1AH - Modelo nativo ID Enumeración

CPUID.1AH devuelve la información de identificación de modelo nativo. Este hoja existe en todos los procesadores lógicos en un paquete híbrido, también puede estar presente en otras configuraciones de procesadores. * Este hoja es válido si CPUID.1AH.00H:EAX[31:0] <> 0 y MAX LEAF 1AH. * El único subhoja válido es 0 y ECX debe establecerse a 0.

**hoja 1AH Native Model ID Enumeration**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[23:0] | CORE_NATIVE_MODEL_ID | El tipo de núcleo y el modelo nativo ID se pueden utilizar | Lógica |
|  |  | para identificar la microarquitectura del núcleo. Este ID de modelo nativo no es único entre los tipos de núcleo, y no está relacionado con el ID de modelo reportado en CPUID.01H, y no identifica el SOC. | Procesador |
| EAX[31:24] | CORE_TYPE | 10H: Reservado | Lógica |
|  |  | 20H: Intel(R) Atom(R) 30H: Reservado 40H: Intel(R) Core El tipo de núcleo sólo puede ser utilizado como una identificación de la microarquitectura para este procesador lógico y su valor numérico no tiene importancia, ni grande ni pequeño. Este campo no implica ni expresa ningún otro atributo a este procesador lógico y software no debe asumir ninguna. | Procesador |
| EBX[31:0] | Reservado | Reservado. |  |
| ECX[31:0] | Reservado | Reservado. |  |
| EDX[31:0] | Reservado | Reservado. |  |
| 21-66 Vol. 1 |  | PROCESSOR IDENTIFICATION AND FEATURE DETERMINATION |  |

CPUID.1BH -- PCONFIG Information

CPUID.1BH -- Formato de Registros de Salida para todos subhojas

CPUID.1BH devuelve información para las capacidades de PCONFIG. Esta información se enumera en subhojas seleccionado por el valor de ECX (comenzando con 0). * Este hoja es válido si CPUID.07H.00H:EDX.PCONFIG[18] = 1 y MAX LEAF 1BH. * Subhojas se enumeran hasta subhoja n, donde EAX[11:0] devuelve 0.

Registro Nombre del campo Cuadro 21-64. Hoja 1BH PCONFIG Información Domain EAX[11:0] SUB LEAF TYPE Plataforma EAX[31:12] Reservado Descripción EBX[31:0] Reservado 0 (Inválido) ECX[31:0] Reservado. EDX[31:0] Reservado. Reservado. Reservado.

Cada subhoja de CPUID.1BH enumera su tipo subhoja en EAX. Si el tipo una subhoja es 0, la subhoja es inválido y cero es devuelto en EBX, ECX y EDX. En este caso, todos los siguientes subhojas (seleccionados por mayores valores de entrada de ECX) también son inválidos. El único tipo subhoja válido actualmente definido es 1, indicando que la subhoja enumera identificadores de destino para la instrucción PCONFIG. Cualquier valor no cero devuelto en EBX, ECX, o EDX indica un identificador objetivo válido de la instrucción PCONFIG (cualquier valor de cero debe ser ignorado). El único identificador objetivo actualmente definido es 1, indicando TME-MK. Vea la instrucción "PCONFIG--Platform Configuration" en el capítulo 4 de Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 2B, para más información.

CPUID.1BH.OUTPUT REGISTERS FOR SUB-LEAVE TYPE TARGET IDENTIFIER (1) -- Registros de salida para el tipo de subclase Identificador de destino (1)

**hoja 1BH.OUTPUT REGISTERS FOR SUB-LEAVE TYPE TARGET IDENTIFIER (1) PCONFIG Información**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[11:0] | SUB_LEAF_TYPE | 1 (Edente identificador) | Plataforma |
| EAX[31:12] | Reservado | Reservado. |  |
| EBX[31:0] | TARGET_IDENTIFIER_1 | Objetivo identificador | Plataforma |
| ECX[31:0] | TARGET_IDENTIFIER_2 | Objetivo identificador | Plataforma |
| EDX[31:0] | TARGET_IDENTIFIER_3 | Objetivo identificador | Plataforma |

CPUID.1CH -- Last Branch Records (LBR) Information

CPUID.1CH devuelve información sobre los últimos registros de rama (LBR). Para obtener más información sobre LBR, consulte el Capítulo 20, "Últimas Documentos de Subdivisión", en el Manual de Desarrolladores de Software de Arquitectura Intel(R) 64 e IA-32, Volumen 3B. * Este hoja es válido si CPUID.07H.00H:EDX.ARCH_LBRS[19] = 1 y MAX LEAF 1CH. * Este hoja no contiene subhojas y proporciona la misma información independientemente del valor de ECX.

**hoja 1CH Last Branch Records (LBR) Information**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[7:0] | LBR_DEPTH_VALUES | Para cada bit n fijado en este campo, se admite el valor IA32_LBR_DEPTH.DEPTH 8*(n+1). | Plataforma |
| EAX[29:8] | Reservado | Reservado. |  |
| EAX[30] | DEEP_C_STATE_RESET | Si 1, admite que los LBR pueden ser despejados en un MWAIT que solicita un estado C numéricamente mayor que C1. | Plataforma |
| EAX[31] | IP_VALUES_CONTAIN_LIP | Si 1, los valores IP LBR contienen LIP. Si 0, valores IP | Lógica |
|  |  | contener IP efectiva. Los segmentos de trace usando un modelo de memoria plana generarán la misma información independientemente de cómo un procesador lógico reporta este valor desde LIP = EIP | Procesador |
| EBX[0] | CPL_FILTERING | Si 1, soporta el ajuste IA32 LBR CTL[2:1] a un valor no cero. | Plataforma |
| EBX[1] | BRANCH_FILTERING | Si 1, soporta el ajuste IA32 LBR CTL[22:16] a un valor no cero. | Plataforma |
| EBX[2] | CALL_STACK_MODE | Si 1, soporta el ajuste IA32 LBR CTL[3] a 1. | Plataforma |
| EBX[31:3] | Reservado | Reservado. |  |
| ECX[0] | MISPREDICT_BIT | Si 1, IA32 LBR x INFO[63] tiene indicación de la falsificación (MISPRED). | Plataforma |
| ECX[1] | TIMED_LBRS | Si 1, IA32 LBR x INFO[15:0] mantiene ciclos de CPU desde la última entrada de LBR (CYC CNT), y IA32 LBR x INFO[60] indica si el valor mantenido allí es válido (CYC CNT VALID). | Plataforma |
| ECX[2] | BRANCH_TYPE_FIELD_SUPPORTED | Si 1, IA32 LBR INFO x[59:56] indica el tipo de rama de la operación registrada (BR TYPE). | Plataforma |
| ECX[15:3] | Reservado | Reservado. |  |
| ECX[19:16] | EVENT_LOGGING_BITMAP | El bitmap de registro de eventos, en el que cada bit set corresponde a un contador de monitoreo de rendimiento programable que admite la tala de eventos LBR. | Plataforma |
| ECX[31:20] | Reservado | Reservado. |  |
| EDX[31:0] | Reservado | Reservado. |  |
| 21-68 Vol. 1 |  | PROCESSOR IDENTIFICATION AND FEATURE DETERMINATION |  |

CPUID.1DH - Información del azulejo

CPUID.1DH devuelve información sobre arquitectura de azulejos y paleta de azulejos 1 (ver Capítulo 19, "Programación con extensiones avanzadas de matriz Intel(R)", en el manual de desarrollo de software de Arquitecturas Intel(R) 64 e IA-32, Volumen 1). * Este hoja es válido si CPUID.07H.00H:EDX.AMX_TILE[24] = 1 y MAX LEAF 1DH. * El valor máximo subhoja para ECX se especifica en CPUID.1DH.00H.EAX[31:0] max palette. * Si ECX contiene un índice subhoja inválido, EAX/EBX/ECX/EDX retorno 0. El índice subhoja n es inválido si n excede el valor que subhoja 0 retorna en EAX.

CPUID.1DH.00H - Información del azulejo principal subhoja

CPUID.1DH.00H devuelve la información de arquitectura de azulejos.

Registro Nombre del campo Cuadro 21-67. Hoja 1DH.00H Tile Information Domain EAX[31:0] MAX PALETTE Platform EBX[31:0] Reservado Descripción ECX[31:0] Reservado Paleta numerada más alta subhoja. Valor = 1. EDX[31:0] Reservado. Reservado. Reservado.

CPUID.1DH.01H -- Tile Palette 1

CPUID.1DH.01H devuelve información de paleta de azulejos.

**hoja 1DH.01H Tile Information**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[15:0] | TOTAL_TILE_BYTES | Palette 1 total tile bytes. Valor = 8192. | Plataforma |
| EAX[31:16] | BYTES_PER_TILE | Palette 1 bytes per tile. Valor = 1024. | Plataforma |
| EBX[15:0] | BYTES_PER_ROW | Palette 1 bytes per row. Valor = 64. | Plataforma |
| EBX[31:16] | MAX_NAMES | Paleta 1 max names (número de registros de fichas). Valor = 8. | Plataforma |
| ECX[15:0] | MAX_ROWS | Palette 1 max rows. Valor = 16. | Plataforma |
| ECX[31:16] | Reservado | Reservado. |  |
| EDX[31:0] | Reservado | Reservado. |  |

CPUID.1EH -- TMUL Information

CPUID.1EH devuelve información sobre las capacidades de TMUL (ver Capítulo 19, "Programación con Intel(R) Extensiones avanzadas de matriz", en el Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1). * Este hoja es válido si CPUID.07H.00H:EDX.AMX_TILE[24] = 1 y MAX LEAF 1EH. * El único subhoja válido es 0 y ECX debe establecerse a 0.

CPUID.1EH.00H - TMUL Información principal hoja

TMUL Main hoja Información

Registro Nombre del campo Cuadro 21-69. Hoja 1EH.00H TMUL Información Dominio EAX[31:0] Reservado EBX[7:0] TMUL MAXK Descripción Plataforma EBX[23:8] TMUL MAXN Reservado.                                 Plataforma EBX[31:24] Reservado tmul maxk (rows or columns). Valor = 16. ECX[31:0] Reservado tmul maxn (column bytes). Valor = 64. EDX[31:0] Reservado. Reservado. Reservado.

CPUID.1FH -- V2 Ampliado Topología

CPUID.1FH devuelve información sobre V2 Extended Topology. CPUID.1FH es un superset preferido a hoja 0BH. Intel recomienda utilizar hoja 1FH cuando esté disponible en lugar de hoja 0BH y asegurar que cualquier algoritmo hoja 0BH se actualice para apoyar hoja 1FH. * Este hoja es válido si CPUID.1FH.00H:EBX[15:0] <> 0 y MAX LEAF 1FH.

* Cuando la hoja es inválido, CPUID.1FH.00H:ECX.DOMAIN_TYPE[15:8] reportará el Domain Type ID como Inválido (0). * Las subhojas se enumeran hasta que subhoja n regrese 0 en EBX[15:0]. * Si ECX contiene un índice subhoja inválido, EAX/EBX retorno 0. El índice subhoja n+1 es inválido si subhoja n devuelve EBX[15:0] como 0.

CPUID.1FH -- ECX >= 0

**hoja 1FH V2 Extended Topology**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[4:0] | SHIFT_COUNT | El número de bits que el ID x2APIC debe ser transferido al derecho de abordar las instancias del siguiente dominio superior. Cuando el procesador lógico no es compatible con el procesador, el valor de este campo en el dominio Logical Processor subhoja puede ser devuelto como 0 (sin bits asignados en el ID x2APIC) o 1 (un bit asignado en el ID x2APIC); el software debe planificar en consecuencia. | Plataforma |
| EAX[31:5] | Reservado | Reservado. |  |
| EBX[15:0] | NEXT_LEVEL_NUM_LP | El número de procesadores lógicos a través de todos | Lógica |
|  |  | instancias de este dominio dentro del siguiente dominio de mayor alcance relativo a este procesador lógico actual. (Por ejemplo, en un enchufe de procesador/paquete que comprende "M" muere de núcleos "N" cada uno, donde cada núcleo tiene procesadores lógicos "L", el valor de dominio "die" subhoja de este campo sería M*N*L. En una topología asimétrica esta sería la suma del valor a través de las instancias de nivel de dominio inferior para crear cada instancia de nivel superior.) Este número refleja la configuración como enviada por Intel. Tenga en cuenta que el número de procesadores lógicos puede ser asimétrico en cuyo caso "L" puede ser diferente en diferentes procesadores lógicos, como un ejemplo un núcleo con 2 procesadores lógicos en la misma plataforma que un núcleo con 1 procesador lógico. Nota, el software no debe utilizar este campo para enumerar la topología del procesador. El software no debe utilizar el valor de EBX[15:0] para enumerar la topología procesadora del sistema. El valor solo está destinado a fines de visualización y diagnóstico. El número real de procesadores lógicos disponibles para BIOS/OS/Applications puede ser diferente del valor de EBX[15:0], dependiendo de las configuraciones de hardware de software y plataforma. | Procesador |
| EBX[31:16] | Reservado | Reservado. |  |

ECX[7:0] LEVEL NUM La entrada ECX subhoja index.                      Plataforma ECX[15:8] DOMAIN TYPE Plataforma Este campo proporciona un valor de identificación que ECX[31:16] Reservado indica el dominio como se muestra en la tabla.        Logical EDX[31:0] X2APIC ID Aunque se ordenan los dominios, sus valores de identificación de procesadores asignados no son y el software no debe depender de él. (Por ejemplo, si se especifica un nuevo dominio entre núcleo y módulo, tendrá un valor de identificación superior a 5.) Véase el cuadro siguiente para la lista actual de enumeraciones válidas. Tenga en cuenta que los valores de enumeración de 0 y 7-255 están reservados.

Reserved.

El ID x2APIC del procesador lógico actual siempre es válido y no varía con el índice de subleaf en ECX.

Las subhojas de CPUID.1FH describen una jerarquía ordenada de procesadores lógicos a partir del dominio más pequeño de alcance de un procesador lógico (subhoja índice 0) al dominio Core ( Índice subhoja 1) al dominio más grande de alcance (el último índice subhoja válido) que está implícitamente subordinado al dominio más alto-scopio no enumerado del paquete procesador. Los detalles de cada dominio válido se enumeran por una subhoja correspondiente. Los detalles para un dominio incluyen su tipo y cómo todas las instancias de ese dominio determinan el número de procesadores lógicos y la partición x2 APIC ID en el siguiente dominio superior-scopio. El orden de dominios dentro de la jerarquía se fija arquitectónicamente como se muestra a continuación. Para un procesador dado, no todos los dominios pueden ser relevantes o enumerados; sin embargo, el procesador lógico y los dominios básicos siempre se enumeran. Como ejemplo, un procesador puede reportar una jerarquía ordenada que consiste sólo en "Procesador Logical", "Core", y "Die." Para dos subhojas N válidos y N+1, subhoja N+1 representa el siguiente dominio inmediato de mayor impacto con respecto al dominio de subhoja N para el procesador dado. Si el índice subhoja "N" devuelve un tipo de dominio inválido en ECX[15:08] (00H), entonces todos las subhojas con un índice superior a "N" también devuelven un tipo de dominio inválido. Una subhoja devolver un dominio inválido siempre devuelve 0 en EAX y EBX.

**Hierarchy of Valid Domain Enumerations in CPUID.1FH:ECX[15:8]**

| Jerarquía | Dominio | Valor de identificación del tipo de dominio |
| --- | --- | --- |
| Inválidos | Inválidos | 0 |
| Lo más bajo | Procesador lógico | 1 |
| ... | Core | 2 |
| ... | Módulo | 3 |
| ... | Tile | 4 |
| ... | Morir | 5 |
| ... | DieGrp | 6 |
| Más alto | Paquete/Socket | (Implicado) |
| Reservado | Reservado | 7-255 |
| 21-72 Vol. 1 |  |  |

CPUID.20H - Historia del Procesador Reiniciar Información

CPUID.20H devuelve información sobre la historia del procesador reset cuando CPUID.07H.01H:EAX.HRESET[22] = 1. * Este hoja es válido si CPUID.07H.01H:EAX.HRESET[22] = 1 y MAX LEAF 20H. * El valor máximo subhoja para ECX se especifica en CPUID.20H.00H.EAX[31:0] MAX SUBLEAF. * Si ECX contiene un índice subhoja inválido, EAX/EBX/ECX/EDX retorno 0. El índice subhoja n es inválido si n excede el valor que subhoja 0 retorna en EAX.

CPUID.20H.00H - Historia del Procesador Restablecer subhoja

**hoja 20H.00H Procesador Historia Reiniciar información**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[31:0] | MAX_SUBLEAF | Reporta el número máximo de subhojas que son compatibles en hoja 20H. | Plataforma |
| EBX[0] | THREAD_DIRECTOR_HRESET | Indica soporte para el parámetro HRESET EAX[0] y IA32 HRESET ENABLE[0] establecido por el sistema operativo para habilitar el restablecimiento de Intel(R) Thread Director history. | Plataforma |
| EBX[31:1] | Reservado | Reservado. |  |
| ECX[31:0] | Reservado | Reservado. |  |
| EDX[31:0] | Reservado | Reservado. |  |

CPUID.21H -- Unimplemented

No devuelve información de características para el procesador. Allocated for use by TDX modules; ver Intel(R) Trust Domain Extensiones (Intel(R) TDX) Módulo Base Architecture Especificación. El software que emula CPUID no debe cambiar la información devuelta para este hoja.

CPUID.22H -- Reserved

Este hoja está reservado.

Registro Nombre del campo Cuadro 21-73. Hoja 22H Reservado Dominio EAX[31:0] Reservado EBX[31:0] Reservado Descripción ECX[31:0] Reservado. EDX[31:0] Reservado. Reservado. Reservado.

CPUID.23H - Supervisión del desempeño arquitectónico Ampliado

CPUID.23H devuelve información ampliada de monitoreo de rendimiento arquitectónico. * Este hoja es válido si CPUID.07H.01H:EAX.ARCH_PERFMON_EXT[8] = 1 y MAX LEAF 23H. * Las subhojas de este hoja se enumeran por un bitmask especificado en CPUID.23H.00H.EAX[31:0] SUBLEAF MASK. Los números de bits de bits en el bitmask representan los índices subhoja válidos. * Si ECX contiene un índice subhoja inválido, EAX/EBX/ECX/EDX retorno 0. El índice subhoja es inválido si el índice como un número de bits es claro en la máscara subhoja disponible o es mayor que 31.

CPUID.23H.00H -- Main subhoja

**hoja 23H.00H Monitoreo de Desempeño Arquitectónico Ampliado**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[31:0] | SUBLEAF_MASK | Si se establece bit n, subhoja n es compatible. (Para) | Lógica |
|  |  | subhojas sin soporte, 0 se devuelve en los registros EAX, EBX, ECX y EDX.) | Procesador |
| EBX[0] | UNITMASK2 | Si 1, apoya el campo UnitMask2 en el | Lógica |
|  |  | IA32 PERFEVTSELx MSRs. | Procesador |
| EBX[1] | EQ | Si 1, apoya la bandera igual en la | Lógica |
|  |  | IA32_PERFEVTSELx MSRS. | Procesador |
| EBX[31:2] | Reservado | Reservado. |  |
| ECX[7:0] | SLOTS_PER_CYC | Si este campo no es cero, representa el | Lógica |
|  |  | Número de ranuras Top-down Microarchitecture Analysis (TMA) por ciclo. Este número se puede multiplicar por el número de ciclos (de CPU_CLK_UNHALTED.THREAD / CPU_CLK_UNHALTED.CORE o IA32 FIXED CTR1) para determinar el número total de ranuras. Si este campo es cero, IA32 FIXED CTR3 debe utilizarse para determinar el número total de ranuras. | Procesador |
| ECX[31:8] | Reservado | Reservado. |  |
| EDX[31:0] | Reservado | Reservado. |  |
| CPUID.23H.01H - | - Información de contrapeso subhoja |  |  |

**hoja 23H.01H Monitoreo de Desempeño Arquitectónico Ampliado**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[31:0] | GP_COUNTERS | Para cada bit n fijado en este campo, el procesador | Lógica |
|  |  | es compatible con el mostrador de vigilancia del desempeño para fines generales n. | Procesador |
| EBX[31:0] | FIXED_COUNTERS | Para cada bit m fijado en este campo, el procesador | Lógica |
|  |  | soporta contador de control de rendimiento de funcionamiento fijo m. El rango válido de contadores de funcionamiento fijo es de 0 a 15. | Procesador |
| ECX[31:0] | Reservado | Reservado. |  |
| EDX[31:0] | Reservado | Reservado. |  |
| 21-76 Vol. 1 |  |  |  |

CPUID.23H.02H -- Bitmap of Auto Counter Reload subhoja

**hoja 23H.02H Monitoreo de Desempeño Arquitectónico Ampliado**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[31:0] | ACR_GP_RELOAD | Mostradores generales que se pueden recargar. Para cada uno | Lógica |
|  |  | bit n fijado en este campo, el procesador admite ACR para el contador de monitoreo de rendimiento de uso general n. | Procesador |
| EBX[31:0] | ACR_FIXED_RELOAD | Los contadores fijos que se pueden recargar. Para cada uno | Lógica |
|  |  | bit m instalado en este campo, el procesador admite ACR para contador de control de rendimiento de funcionamiento fijo m. | Procesador |
| ECX[31:0] | ACR_GP_TRIGGER | Los mostradores generales que pueden causar recargas. Para | Lógica |
|  |  | cada bit y fijado en este campo, el procesador permite el control de rendimiento de uso general contra y para volver a cargar todos los mostradores de monitoreo de rendimiento de uso general existentes capaces de ser recargados. | Procesador |
| EDX[31:0] | ACR_FIXED_TRIGGER | Contadores fijos que pueden causar recargas. Para cada uno | Lógica |
|  |  | bit x set in this field, the processor allows fixed- function performance monitoring counter x to reload all existing fixed-function performance monitoring counters capable of being reloaded. | Procesador |

**hoja 23H.03H Monitoreo de Desempeño Arquitectónico Ampliado**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[0] | CORE_CYC | Si 1, soporta el índice arquitectónico 0. | Procesador lógico |
| EAX[1] | INSTR_RET | Si 1, soporta el índice arquitectónico 1. | Procesador lógico |
| EAX[2] | REF_CYC | Si 1, soporta el índice arquitectónico 2. | Procesador lógico |
| EAX[3] | LLC_REF | Si 1, soporta el índice arquitectónico 3. | Procesador lógico |
| EAX[4] | LLC_MISSES | Si 1, soporta el índice arquitectónico 4. | Procesador lógico |
| EAX[5] | BR_INSTR_RET | Si 1, soporta el índice arquitectónico 5 | Procesador lógico |
| EAX[6] | BR_MISPRED_RET | Si 1, soporta el índice arquitectónico 6 | Procesador lógico |
| EAX[7] | SLOTS | Si 1, soporta el índice arquitectónico 7 | Procesador lógico |
| EAX[8] | BACKEND | Si 1, soporta el índice arquitectónico 8 | Procesador lógico |
| EAX[9] | BADSPEC | Si 1, soporta el índice arquitectónico 9 | Procesador lógico |

EAX[10] FRONTEND Si 1, soporta el índice arquitectónico 10 Procesador lógico EAX[11] RETIRING Si 1, soporta el índice arquitectónico 11 Logical EAX[12] LBR INSERTS Si 1, soporta el índice arquitectónico 12 Procesador

```text
                                                    Reserved.                                        Logical
                                                    Reserved.                                        Processor
```

Reservado. EAX[31:13] Reservado. EBX[31:0] Reservado ECX[31:0] Reservado EDX[31:0]

CPUID.23H.04H - Capacidades PEBS

**hoja 23H.04H Monitoreo de Desempeño Arquitectónico Ampliado**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[31:0] | Reservado | Reservado. |  |
| EBX[2:0] | Reservado | Reservado. |  |
| EBX[3] | ALLOW_IN_RECORD | Si 1, indica que el bit ALLOW IN RECORD es | Lógica |
|  |  | disponible en el IA32 PMC GPn CFG C e IA32 PMC FXm CFG C MSRs. | Procesador |
| EBX[4] | CNTR_GP | Si 1, indica que el subgrupo de contraparte | Lógica |
|  |  | Los contadores para fines generales están disponibles. | Procesador |
| EBX[5] | CNTR_FIXED | Si 1, indica que el subgrupo de contraparte | Lógica |
|  |  | Los contadores de funcionamiento fijo están disponibles. | Procesador |
| EBX[6] | CNTR_METRICS | Si 1, indica que el subgrupo de contraparte | Lógica |
|  |  | métricas de rendimiento está disponible. | Procesador |
| EBX[7] | Reservado | Reservado. |  |
| EBX[9:8] | LBR | El grupo LBR y ambos bits [41:40] están disponibles. | Procesador lógico |
| EBX[15:10] | Reservado | Reservado. |  |
| EBX[23:16] | XER | XER grupo bits [50:49] y bits [55:53] son | Lógica |
|  |  | disponible. Véase Sección 11.4.4, "XSAVEEnabled Registers Group", para campos XER. | Procesador |
| EBX[28:24] | Reservado | Reservado. |  |
| EBX[29] | GPR | Si 1, el grupo GPR está disponible. | Procesador lógico |
| EBX[30] | AUX | Si 1, el grupo AUX está disponible. | Procesador lógico |
| EBX[31] | Reservado | Reservado. |  |
| ECX[31:0] | Reservado | Reservado. |  |
| EDX[31:0] | Reservado | Reservado. |  |
| 21-78 Vol. 1 |  |  |  |

CPUID.23H.05H -- Arch PEBS GP y contadores fijos apoyados

**hoja 23H.05H Monitoreo de Desempeño Arquitectónico Ampliado**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[31:0] | GP_PEBS | Bit vector de contadores para fines generales | Lógica |
|  |  | que el mecanismo Architectural PEBS está disponible (bit n == GP counter #n). Si EAX[n] == 1, entonces el IA32 PMC GPn CFG C MSR está disponible, y PEBS es compatible con ese contador; el campo PEBS EN[63] se puede establecer; y el campo RELOAD[31:0] se puede establecer. Tenga en cuenta que CPUID.23H.04H:EBX gobierna que los bits de grupo adaptativo se pueden establecer. | Procesador |
| EBX[31:0] | GP_PDIST | Contratistas para fines generales para los que PEBS | Lógica |
|  |  | soporta PDIST. | Procesador |
| ECX[31:0] | FIXED_PEBS | Bit vector de contadores de funcionamiento fijo para los cuales | Lógica |
|  |  | el mecanismo Architectural PEBS está disponible. Si ECX[x] == 1, entonces el IA32 PMC FXm CFG C MSR está disponible, y PEBS es compatible; el campo PEBS EN[63] se puede establecer; y el campo RELOAD[31:0] se puede establecer. Tenga en cuenta que CPUID.23H.04H:EBX gobierna que los bits de grupo adaptativo se pueden establecer. | Procesador |
| EDX[31:0] | FIXED_PDIST | Contadores de funcionamiento fijo para los cuales PEBS | Lógica |
|  |  | soporta PDIST. | Procesador |

CPUID.24H - Converged Vector ISA

Cuando CPUID.24H, el procesador devuelve información Intel AVX10 vector convergente ISA. Este hoja es compatible cuando CPUID.07H.01H:EDX.AVX10[19] = 1. * Este hoja es válido si CPUID.07H.01H:EDX.AVX10[19] = 1 y MAX LEAF 24H. * El valor máximo subhoja para ECX se especifica en CPUID.24H.00H.EAX[31:0] MAX SUBLEAF. * Si ECX contiene un índice subhoja inválido, EAX/EBX/ECX/EDX retorno 0. El índice subhoja n es inválido si n excede el valor que subhoja 0 retorna en EAX.

CPUID.24H.00H -- Converged Vector ISA Main subhoja

**hoja 24H.00H Converged Vector ISA**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[31:0] | MAX_SUBLEAF | Reporta el número máximo de subhojas que son compatibles en hoja 24H. | Plataforma |
| EBX[7:0] | VECTOR_ISA_VERSION | Reporta la versión Intel(R) AVX10 Converged Vector ISA. | Plataforma |
| EBX[15:8] | Reservado | Reservado. |  |
| EBX[18:16] | Reservado a 111 | Siempre 111b. Las versiones anteriores de esta especificación documentaron estos bits como soporte de enumeración para diferentes longitudes vectoriales. Los procesadores que enumeran Intel(R) AVX10 soportan todas las longitudes del vector. | Plataforma |
| EBX[31:19] | Reservado | Reservado. |  |
| ECX[31:0] | Reservado | Reservado. |  |
| EDX[31:0] | Reservado | Reservado. |  |
| 21-80 Vol. 1 |  |  |  |

CPUID.27H -- Intel(R) Resource Director Technology (Intel(R) RDT) Asymmetric Monitoring

CPUID.27H devuelve información para las capacidades de monitoreo de tecnología de Director de Recursos Intel con topología asimétrica. Como se describe a continuación, el software utiliza el vector bit devuelto en EDX por subhoja 00H para determinar los tipos de recursos disponibles (ResID) que pueden ser monitoreados. Esta información es necesaria para programar los MSR IA32 PQR ASSOC e IA32 QM EVTSEL de tal manera que los datos de calidad de servicio pueden leerse después del IA32 QM CTR MSR. * Este hoja es válido si CPUID.07H.01H:ECX.RDT_M_ASYM[0] = 1 y MAX LEAF 27H. * Si la hoja es válido, subhoja 00H siempre es válido. Subhoja n (n 1) sólo es válido cuando (CPUID.27H.00H:EDX[n] == 1). * Este hoja debe ser leído en cada procesador lógico para determinar el soporte en cada procesador.

CPUID.27H.00H -- Intel(R) RDT Asimetric Monitoring Main subhoja

CPUID.27H.00H devuelve información sobre Intel RDT Monitoring Asymmetric.

**hoja 27H.00H Intel(R) Resource Director Technology (Intel(R) RDT) Asymmetric Monitoring**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[31:0] | Reservado | Reservado. |  |
| EBX[31:0] | MAX_RMID | Rango máximo (con base cero) de RMID dentro | Lógica |
|  |  | este procesador físico de todo tipo. | Procesador |
| ECX[31:0] | Reservado | Reservado. |  |
| EDX[0] | Reservado | Reservado. |  |
| EDX[1] | L3_MON | Si 1, es compatible con L3 Cache Intel RDT Monitoring. | Lógica |
|  |  | Índice subhoja 0 reporta el tipo de recurso válido empezando por la posición del bit 1 de EDX. | Procesador |
| EDX[31:2] | Reservado | Reservado. |  |

**hoja 27H.01H Intel(R) Resource Director Technology (Intel(R) RDT) Asymmetric Monitoring**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[7:0] | CTR_WIDTH | La anchura del contador se codifica como compensación | Lógica |
|  |  | 24b. Un valor de cero en este campo indica que se admiten contadores de 24 bits. Un valor de 8 en este campo indica que se admiten contadores de 32 bits. | Procesador |
| EAX[8] | RDT_M_OVF | Si 1, soporta un poco de desbordamiento en el | Lógica |
|  |  | IA32 QM CTR MSR (bit 61). | Procesador |

EAX[9] IO RDT CMT Si 1, indica la presencia del agente no CPU Lógica

```text
                                                    supporting Intel RDT CMT.                      Processor
```

EAX[10] IO RDT MBM Si 1, indica la presencia del agente Logical no CPU

```text
                                                    supporting Intel RDT MBM support.              Processor
```

EAX[31:11] Reservado. EBX[31:0] Factor CONV FACTOR utilizado para convertir de reportado Logical

```text
                                                    IA32_QM_CTR value to derived occupancy         Processor
```

ECX[31:0] MAX RMID L3 metric (bytes) and Memory Bandwidth EDX[0] CMT L3 OCCUP Monitoreo (MBM).                      Lógica EDX[1] MBM L3 TOTAL Rango máximo (con base cero) de RMID de este procesador EDX[2] MBM L3 LOCAL tipo de recurso.                                 Logical EDX[31:3] Reservado Si 1, soporta el monitoreo de ocupación L3.        Procesador Logical

```text
                                                    If 1, supports L3 total bandwidth monitoring.  Processor
```

Logical

```text
                                                    If 1, supports L3 local bandwidth monitoring.  Processor
```

Reserved.

CPUID.28H -- Intel(R) Resource Director Technology (Intel(R) RDT) Asymmetric Allocation

CPUID.28H devuelve información para Intel Resource Director Technology Allocation con topología asimétrica. Este hoja es válido cuando CPUID.07H.01H:ECX.RDT_A_SYM[1] = 1. Como se describe a continuación, el software utiliza el vector bit devuelto en EBX por subleaf 00H para determinar los tipos de recursos disponibles de QoS Enforcement (asignación) que son compatibles en el procesador. Esta información es necesaria para configurar cada clase de servicios usando máscaras de bit de la capacidad en los registros de QoS Mask, IA32 resourceType Mask n. * Este hoja es válido si CPUID.07H.01H:ECX.RDT_A_SYM[1] = 1 y MAX LEAF 28H. * Si la hoja es válido, subhoja 00H siempre es válido. Subhoja n (n 1) sólo es válido cuando (CPUID.28H.00H:EBX[n] == 1).

CPUID.28H.00H -- Intel(R) RDT Asymmetric Allocation Main subhoja

CPUID.28H.00H devuelve información sobre Intel RDT Allocation Asymmetric.

**hoja 28H.00H Intel(R) Resource Director Technology (Intel(R) RDT) Asymmetric Allocation**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[31:0] | Reservado | Reservado. |  |
| EBX[0] | Reservado | Reservado. |  |
| EBX[1] | CAT_L3 | Supports L3 Cache Allocation Technology if 1. | Procesador lógico |
| EBX[2] | CAT_L2 | Supports L2 Cache Allocation Technology if 1. | Procesador lógico |
| EBX[3] | MBA | Admite la asignación de ancho de banda de memoria si 1. | Procesador lógico |
| EBX[4] | Reservado | Reservado. |  |
| EBX[5] | CBA | Si 1, es compatible con Cache Bandwidth Allocation. | Procesador lógico |
| EBX[6] | RESOURCE_PRIORITY | Si 1, apoya la Prioridad de Recursos. | Plataforma |
| EBX[31:7] | Reservado | Reservado. |  |
| ECX[31:0] | Reservado | Reservado. |  |
| EDX[31:0] | Reservado | Reservado. |  |

**hoja 28H.01H Intel(R) Resource Director Technology (Intel(R) RDT) Asymmetric Allocation**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[4:0] | CAT_L3_BITMASK_LENGTH | Longitud de la máscara de bit de la capacidad para la | Lógica |
|  |  | ResID correspondiente. Añadir uno al valor de retorno para obtener el resultado. | Procesador |
| EAX[31:5] | Reservado | Reservado. |  |

EBX[31:0] CAT L3 CONTENTION Bit-granular map of isolation/contention of Logical ECX[0] Reserved allocation units.                               Procesador ECX[1] CAT L3 NONCPU ECX[2] CAT L3 CDP Si 1, soporta L3 CAT para agentes no CPU.       Procesador lógico ECX[3] CAT L3 NONCONTIG

```text
                                                    N/A                                             Logical
```

ECX[31:4] Procesador Reservado EDX[15:0] CAT L3 MAX CLOS Si 1, admite código L3 y priorización de datos Lógica

```text
                                                    Technology.                                     Processor
```

```text
                                                    If 1, supports non-contiguous capacity          Logical
                                                    bitmasks. The bits that are set in the various  Processor
```

Los registros IA32 L3 MASK n no tienen que ser EDX[31:16] Reservados contiguos.

Reserved.

Número de clase de servicio más alta (COS) apoyado para este ResID.

Reserved.

CPUID.28H.02H - Tecnología de Asignación de Caché L2 asimétrica

CPUID.28H.ResID=2 devuelve información sobre Asignación de Caché de L2 asimétrica.

**hoja 28H.02H Intel(R) Resource Director Technology (Intel(R) RDT) Asymmetric Allocation**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[4:0] | CAT_L2_BITMASK_LENGTH | Longitud de la máscara de bit de la capacidad para la | Lógica |
|  |  | ResID correspondiente. Añadir uno al valor de retorno para obtener el resultado. | Procesador |
| EAX[31:5] | Reservado | Reservado. |  |
| EBX[31:0] | CAT_L2_CONTENTION | Bit-granular map of isolation/contention of | Lógica |
|  |  | Unidades de asignación. | Procesador |
| ECX[1:0] | Reservado | Reservado. |  |
| ECX[2] | CAT_L2_CDP | Si 1, apoya el código L2 y la priorización de datos | Lógica |
|  |  | Tecnología. | Procesador |
| ECX[3] | CAT_L2_NONCONTIG | Si 1, apoya la capacidad no contigua | Lógica |
|  |  | Bocinas. Los bits que se establecen en los diferentes registros IA32 L2 MASK n no tienen que ser contiguos. | Procesador |
| ECX[31:4] | Reservado | Reservado. |  |
| EDX[15:0] | CAT_L2_MAX_CLOS | Número de clase de servicio más alta (COS) | Lógica |
|  |  | apoyado para este ResID. | Procesador |
| EDX[31:16] | Reservado | Reservado. |  |

**hoja 28H.03H Intel(R) Resource Director Technology (Intel(R) RDT) Asymmetric Allocation**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| 21-84 Vol. 1 |  |  |  |

EAX[11:0] MBA MAX Reporta el valor máximo MBA de oscilación Logical

```text
                                            supported for the corresponding ResID. Add          Processor
```

EAX[31:12] Reservado uno al valor de retorno para obtener el resultado. EBX[31:0] Reservado.                                           Logical ECX[0] PER THREAD MBA Reservado.                                           Los controles del procesador por-thread MBA son compatibles. ECX[1] Reservado Logical ECX[2] MBA LINEAR Reservado.                                           Procesador Si 1, la respuesta de los valores de retraso es lineal. ECX[31:3] Reservado Logical EDX[15:0] MBA MAX CLOS Reservado.                                           Procesador de alta clase de servicio (COS) número EDX[31:16] reservado apoyado para este ResID. Reservado.

CPUID.28H.05H - Asymmetric Cache Bandwidth Allocation

**hoja 28H.05H Intel(R) Resource Director Technology (Intel(R) RDT) Asymmetric Allocation**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[7:0] | CBA_MAX_LEVELS | Reporta el nivel máximo de oscilación del núcleo | Lógica |
|  |  | compatible con el ResID correspondiente. Agregue uno al valor de retorno para obtener el número de niveles de oscilación compatibles. | Procesador |
| EAX[11:8] | BW_SCOPE | Si 1, indica el alcance lógico del procesador | Lógica |
|  |  | IA32 QoS Core BW Thrtl n MSRs. Se reservan otros valores. | Procesador |
| EAX[31:12] | Reservado | Reservado. |  |
| EBX[31:0] | Reservado | Reservado. |  |
| ECX[2:0] | Reservado | Reservado. |  |
| ECX[3] | CBA_LINEAR | Si 1, la respuesta del control de ancho de banda es | Lógica |
|  |  | aproximadamente lineal. Si 0, la respuesta del control de ancho de banda no es lineal. | Procesador |
| ECX[31:4] | Reservado | Reservado. |  |
| EDX[15:0] | CBA_MAX_CLOS | Número de clase de servicio más alta (COS) | Lógica |
|  |  | apoyado para este ResID. | Procesador |
| EDX[31:16] | Reservado | Reservado. |  |
| CPUID.28H.06H - | - Control de prioridades de recursos |  |  |

**hoja 28H.06H Intel(R) Resource Director Technology (Intel(R) RDT) Asymmetric Allocation**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[0] | THREAD_ENABLE | Si 1, es compatible con la habilitación de RP a través de la IA32 RESOURCE PRIORITY MSR. | Plataforma |

EAX[1] PACKAGE ENABLE Si 1, soporta el paquete de procesadores físicos Plataforma de habilitación de RP a través de la IA32 RESOURCE EAX[31:2] PRIORIDAD reservada PKG MSR. EBX[31:0] Reservado ECX[31:0] Reservado. EDX[31:0] Reservado.

Reserved.

Reserved.

CPUID.80000000H -- Valor máximo de entrada para función extendida CPUID

CPUID.80000000H devuelve el valor más alto que el procesador reconoce para la información del procesador de retorno. El valor se devuelve en el registro EAX y es específico del procesador. * Este hoja es compatible con el Pentium 4. * Los procesadores antes de Pentium 4 tratan bit 31 como 0, y este hoja devuelve los valores de CPUID.00H. * Este hoja no contiene subhojas y proporciona la misma información independientemente del valor de ECX.

**hoja 80000000H Valor máximo de entrada para función extendida CPUID Información**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[31:0] | MAX_EXTENDED_LEAF | Valor máximo de entrada para la función extendida CPUID Información. | Plataforma |
| EBX[31:0] | Reservado | Reservado. |  |
| ECX[31:0] | Reservado | Reservado. |  |
| EDX[31:0] | Reservado | Reservado. |  |

CPUID.80000001H -- Firma de Procesador Extendido y mordeduras

CPUID.80000001H devuelve información sobre la firma del procesador ampliado y características bits. * Este hoja es válido si MAX EXTENDED LEAF 80000001H. * Este hoja no contiene subhojas y proporciona la misma información independientemente del valor de ECX.

**hoja 80000001H Extended Processor Signature and Feature Bits**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[31:0] | Reservado | Reservado. |  |
| EBX[31:0] | Reservado | Reservado. |  |
| ECX[0] | LAHF_SAHF_64 | Si 1, soporta las instrucciones LAHF/SAHF en modo de 64 bits. LAHF y SAHF están siempre disponibles en otros modos, independientemente de la enumeración de esta bandera de características. | Plataforma |
| ECX[4:1] | Reservado | Reservado. |  |
| ECX[5] | LZCNT | Si 1, soporta la instrucción LZCNT. | Plataforma |
| ECX[7:6] | Reservado | Reservado. |  |
| ECX[8] | PREFETCHW | Si 1, soporta la instrucción PREFETCHW. | Plataforma |
| ECX[31:9] | Reservado | Reservado. |  |
| EDX[10:0] | Reservado | Reservado. |  |
| EDX[11] | SYSCALL_SYSRET_64 | Si 1, soporta SYSCALL/SYSRET. Los procesadores Intel soportan SYSCALL y SYSRET sólo en modo de 64 bits. Esta bandera de características siempre se enumera como 0 fuera del modo 64-bit. | Plataforma |
| EDX[19:12] | Reservado | Reservado. |  |
| EDX[20] | EXECUTE_DIS | Si 1, es compatible con Ejecutar un poco de discapacidad. | Plataforma |
| EDX[25:21] | Reservado | Reservado. |  |
| EDX[26] | PAGE_1GB | Si 1, admite páginas de 1-GByte. | Plataforma |
| EDX[27] | RDTSCP | Si 1, soporta RDTSCP e IA32 TSC AUX. | Plataforma |
| EDX[28] | Reservado | Reservado. |  |
| EDX[29] | INTEL64 | Si 1, soporta Intel(R) 64 Architecture. | Plataforma |
| EDX[31:30] | Reservado | Reservado. |  |
| 21-88 Vol. 1 |  | PROCESSOR IDENTIFICATION AND FEATURE DETERMINATION |  |

CPUID.80000002H -- Procesador de la marca String (Bytes 0 a 15)

CPUID.80000002H devuelve información sobre el procesador Marca String. Para más detalles sobre Procesador Brand String, vea la Sección 21.2, "Metodos para el retorno de la información de marca utilizando CPUID". * Este hoja es válido si MAX EXTENDED LEAF 80000002H. * Este hoja no contiene subhojas y proporciona la misma información independientemente del valor de ECX.

**hoja 80000002H Processor Brand String (Bytes 0 a 15)**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[31:0] | BRAND_NAME_0 | Cadena de marca de procesador. | Plataforma |
| EBX[31:0] | BRAND_NAME_1 | La cadena de la marca del procesador continuó. | Plataforma |
| ECX[31:0] | BRAND_NAME_2 | La cadena de la marca del procesador continuó. | Plataforma |
| EDX[31:0] | BRAND_NAME_3 | La cadena de la marca del procesador continuó. | Plataforma |

CPUID.80000003H -- cadena de la marca de procesador (Bytes 16 a 31)

CPUID.80000003H devuelve información sobre el procesador Marca String. Para más detalles sobre Procesador Brand String, vea la Sección 21.2, "Metodos para el retorno de la información de marca utilizando CPUID". * Este hoja es válido si MAX EXTENDED LEAF 80000003H. * Este hoja no contiene subhojas y proporciona la misma información independientemente del valor de ECX.

**hoja 80000003H Procesador cadena de marca (Bytes 16 a 31)**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[31:0] | BRAND_NAME_4 | La cadena de la marca del procesador continuó. | Plataforma |
| EBX[31:0] | BRAND_NAME_5 | La cadena de la marca del procesador continuó. | Plataforma |
| ECX[31:0] | BRAND_NAME_6 | La cadena de la marca del procesador continuó. | Plataforma |
| EDX[31:0] | BRAND_NAME_7 | La cadena de la marca del procesador continuó. | Plataforma |
| 21-90 Vol. 1 |  |  |  |

CPUID.80000004H -- cadena de la marca procesador (Bytes 32 a 47)

CPUID.80000004H devuelve información sobre el procesador Marca String. Para más detalles sobre Procesador Brand String, vea la Sección 21.2, "Metodos para el retorno de la información de marca utilizando CPUID". * Este hoja es válido si MAX EXTENDED LEAF 80000004H. * Este hoja no contiene subhojas y proporciona la misma información independientemente del valor de ECX.

**hoja 80000004H Processor brand string (Bytes 32 a 47)**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[31:0] | BRAND_NAME_8 | La cadena de la marca del procesador continuó. | Plataforma |
| EBX[31:0] | BRAND_NAME_9 | La cadena de la marca del procesador continuó. | Plataforma |
| ECX[31:0] | BRAND_NAME_10 | La cadena de la marca del procesador continuó. | Plataforma |
| EDX[31:0] | BRAND_NAME_11 | La cadena de la marca del procesador continuó. | Plataforma |

CPUID.80000005H -- Reserved

Este hoja está reservado y devuelve todos los ceros.

Registro Nombre del campo Cuadro 21-94. Hoja 80000005H Reservado Dominio EAX[31:0] Reservado EBX[31:0] Reservado Descripción ECX[31:0] Reservado. EDX[31:0] Reservado. Reservado. Reservado.

CPUID.80000006H - Función extendida CPUID Información

CPUID.80000006H devuelve la función extendida CPUID información. El método preferido para enumerar la descripción de la información de caché>is para utilizar CPUID.04H--Deterministic Cache Parameters. * Este hoja es válido si MAX EXTENDED LEAF 80000006H. * Este hoja no contiene subhojas y proporciona la misma información independientemente del valor de ECX

**hoja 80000006H Función ampliada CPUID Información**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[31:0] | Reservado | Reservado. |  |
| EBX[31:0] | Reservado | Reservado. |  |
| ECX[7:0] | L2_LINE_SIZE | Tamaño de la línea de caché en bytes. | Procesador lógico |
| ECX[11:8] | Reservado | Reservado. |  |
| ECX[15:12] | L2_ASSOC | Campo de asociación L2. El campo de la asociación L2 | Lógica |
|  |  | Las codificaciones se enumeran en el cuadro que figura a continuación. | Procesador |
| ECX[31:16] | L2_SIZE | Tamaño de caché en unidades 1K. | Procesador lógico |
| EDX[7:0] | Reservado | Reservado. |  |
| EDX[31:8] | Reservado | Reservado. |  |

**L2 Associativity Field Encodings**

| Valor de codificación | Descripción | Valor de codificación | Descripción |
| --- | --- | --- | --- |
| 00H | Discapacitados | 08H | 16 Caminos |
| 01H | 1 Way (direct mapped) | 09H | Reservado |
| 02H | 2 Caminos | 0AH | 32 maneras |
| 03H | Reservado | 0BH | 48 maneras |
| 04H | 4 Caminos | 0CH | 64 Formas |
| 05H | Reservado | 0DH | 96 Formas |
| 06H | 8 maneras | 0EH | 128 Formas |
| 07H | Véase CPUID hoja 4 subhoja 21 | 0FH | Fully Associative |

CPUID.80000007H - Función extendida CPUID Información 1

CPUID.80000007H devuelve la función extendida CPUID información. * Este hoja es válido si MAX EXTENDED LEAF 80000007H. * Este hoja no contiene subhojas y proporciona la misma información independientemente del valor de ECX.

**hoja 80000007H Función ampliada CPUID Información 1**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[31:0] | Reservado | Reservado. |  |
| EBX[31:0] | Reservado | Reservado. |  |
| ECX[31:0] | Reservado | Reservado. |  |
| EDX[7:0] | Reservado | Reservado. |  |
| EDX[8] | TSC_INVARIANT | Si 1, soporta el invariante TSC. | Plataforma |
| EDX[31:9] | Reservado | Reservado. |  |
| 21-94 Vol. 1 |  |  |  |

CPUID.80000008H - Función extendida CPUID Información 2

CPUID.80000008H devuelve la función extendida CPUID información. * Este hoja es válido si MAX EXTENDED LEAF 80000008H. * Este hoja no contiene subhojas y proporciona la misma información independientemente del valor de ECX.

**hoja 80000008H Función ampliada CPUID Información 2**

| Registro | Nombre del campo | Descripción | Dominio |
| --- | --- | --- | --- |
| EAX[7:0] | PHYS_ADDR_SIZE | Número de pedacitos de dirección física. Si TME-MK está habilitado, el número de bits que se pueden utilizar para abordar la memoria puede ser reducido por IA32 TME ACTIVATE[35:32]. | Plataforma |
| EAX[15:8] | LIN_ADDR_SIZE | Número de pedacitos de dirección lineal. | Plataforma |
| EAX[23:16] | GUEST_PHYS_ADDR_SIZE | Número de bits de dirección física de invitados (para el software que opera en una máquina virtual). Si este campo es cero, PHYS ADDR SIZE debe ser utilizado. Los procesadores Intel vuelven cero para este campo. El software que emula CPUID puede devolver un valor diferente. | Plataforma |
| EAX[31:24] | Reservado | Reservado. |  |
| EBX[8:0] | Reservado | Reservado. |  |
| EBX[9] | WBNOINVD | Si 1, soporta la instrucción WBNOINVD. | Plataforma |
| EBX[31:10] | Reservado | Reservado. |  |
| ECX[31:0] | Reservado | Reservado. |  |
| EDX[31:0] | Reservado | Reservado. |  |
