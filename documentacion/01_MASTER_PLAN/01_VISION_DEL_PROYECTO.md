# CAPÍTULO 1 — VISIÓN DEL PROYECTO

## 1.1 Concepto Central (Pitch)

NITROVIA es un videojuego de conducción urbana con enfoque en personalización profunda, vida simulada de ciudad y progresión a largo plazo del jugador. El concepto central no se limita a "carreras callejeras": NITROVIA se define como una plataforma de experiencia urbana persistente, donde conducir es el vehículo narrativo y mecánico para explorar una ciudad viva, competir, socializar y progresar durante meses o años de vida útil del producto.

El pitch de una línea que debe guiar toda decisión de diseño posterior es el siguiente:

"NITROVIA es la ciudad donde tu coche, tu estilo y tu reputación construyen quién eres."

Este pitch implica tres compromisos que deben mantenerse coherentes en todos los capítulos posteriores del Master Plan:

Primero, el vehículo no es solo una herramienta de desplazamiento o competición, sino un objeto de identidad del jugador, comparable a lo que representa un personaje en un juego de rol. Segundo, la ciudad no es un escenario decorativo sino un sistema vivo con reglas propias (tráfico, clima, policía, eventos), que debe sentirse habitada incluso cuando el jugador no está compitiendo. Tercero, la progresión y la reputación del jugador deben ser visibles socialmente, no solo estadísticas privadas en un menú.

Un ejemplo de cómo este pitch debe traducirse en decisiones concretas: si en el Capítulo 6 (Vehículos) se propusiera un sistema de personalización puramente cosmético sin impacto en rendimiento ni en reputación social, esa propuesta contradiría el pitch central y debería ser rechazada o reformulada, porque rompe el compromiso de que el vehículo construye identidad, no solo apariencia.

## 1.2 Género y Referencias

NITROVIA se posiciona dentro del género de conducción urbana de mundo abierto (open-world urban racing/driving), con elementos híbridos de simulación social y juego como servicio (games-as-a-service).

No se trata de un simulador de conducción realista en el sentido técnico (no compite con títulos centrados en física de neumáticos hiperrealista o telemetría de competición profesional), sino de un título de "arcade con alma de simulación": la física debe sentirse creíble y con peso, pero la accesibilidad y la diversión inmediata tienen prioridad sobre el realismo absoluto.

Las referencias de género que deben servir como marco de comparación —no como plantilla a copiar— incluyen títulos de mundo abierto urbano con personalización vehicular profunda, títulos con enfoque social y de reputación de calle, y títulos de conducción con soporte prolongado post-lanzamiento mediante contenido estacional.

Es importante dejar establecido, como principio de identidad (desarrollado en profundidad en el Capítulo 2), que NITROVIA no debe convertirse en un clon de ninguna referencia. Las referencias sirven para entender expectativas de género que el jugador ya trae consigo (por ejemplo: espera personalización visual y mecánica, espera mundo abierto explorable, espera progresión de reputación), pero la ejecución, el tono y el mundo deben ser propios de NITROVIA.

Un ejemplo de aplicación correcta de una referencia de género: si un título de referencia usa "zonas de la ciudad controladas por facciones rivales" como mecánica de progresión territorial, NITROVIA puede adoptar el concepto de territorialidad (coherente con el Capítulo 4, Mundo del Juego, en su apartado de Distritos), pero debe definir su propia lógica de por qué existen esas facciones, cómo se disputan y qué significan dentro del lore de NITROVIA (desarrollado en el Capítulo 5, Narrativa).

## 1.3 Público Objetivo

El público objetivo de NITROVIA se define en tres capas concéntricas: núcleo, extendido y aspiracional.

El público núcleo son jugadores de entre 16 y 30 años, con experiencia previa en juegos de conducción arcade o mundo abierto, que valoran la personalización profunda de su avatar y vehículo, y que están familiarizados con estructuras de progresión de temporadas (seasons) propias de juegos como servicio. Este público busca sesiones de juego tanto cortas (10-20 minutos, una carrera o una vuelta de exploración) como largas (sesiones sociales de varias horas con amigos).

El público extendido incluye jugadores más casuales de entre 13 y 40 años que disfrutan de juegos de conducción sin ser su género principal, y que valoran especialmente la fantasía de personalización y estatus social dentro de un mundo virtual, incluso si su interés en la competición pura es menor.

El público aspiracional, a mediano plazo (año 2 o 3 del roadmap, ver Capítulo 23), incluye espectadores y creadores de contenido que consuman NITROVIA como contenido de video o streaming, atraídos por la expresividad visual del sistema de personalización y por momentos de alto impacto social (eventos dinámicos, carreras con apuestas de reputación, contenido estacional).

Es fundamental que el diseño de sistemas económicos (Capítulo 20) y de eventos dinámicos (Capítulo 4 y Capítulo 8) considere estas tres capas de forma diferenciada: un sistema que solo satisface al público núcleo hardcore corre el riesgo de resultar hostil o inaccesible para el público extendido, mientras que un sistema exclusivamente casual puede no retener al público núcleo a largo plazo. Este equilibrio debe revisarse explícitamente en cada hito de producción (Capítulo 18).

## 1.4 Propuesta de Valor Diferencial

La propuesta de valor diferencial de NITROVIA se sostiene sobre cuatro pilares que deben mantenerse presentes y verificables en cada sistema desarrollado en capítulos posteriores.

El primer pilar es la identidad expresiva profunda. A diferencia de títulos donde la personalización es principalmente cosmética y desconectada del juego, en NITROVIA la personalización de vehículo y personaje (Capítulos 6 y 7) debe tener consecuencias visibles en la vida urbana simulada (Capítulo 4): otros jugadores y NPCs deben poder "leer" la identidad de un jugador a través de su vehículo y su personaje, y esa lectura debe influir en interacciones sociales y de reputación.

El segundo pilar es la ciudad como organismo vivo. La ciudad de NITROVIA no debe comportarse como un decorado estático poblado de eventos de carrera; debe simular condiciones de vida urbana creíbles: tráfico con lógica propia, policía con comportamiento reactivo, clima que afecta la conducción y la atmósfera, y horarios que cambian la actividad de la ciudad (desarrollado en profundidad en el Capítulo 4). Ningún otro sistema del juego debe tratar a la ciudad como un simple fondo.

El tercer pilar es la progresión social visible, no solo numérica. La reputación del jugador (mencionada aquí de forma introductoria, y desarrollada en los capítulos de Diseño de Juego, Personajes y Backend) debe manifestarse de forma perceptible: en cómo reaccionan los NPCs, en cómo se posiciona el jugador dentro de facciones o distritos, y en el reconocimiento social dentro de la comunidad de jugadores.

El cuarto pilar es el soporte a largo plazo como producto comercial vivo, no como lanzamiento único. NITROVIA se concibe desde el diseño inicial como un producto con años de vida útil planificada (ver Capítulo 23, Roadmap, con horizontes de 1, 3 y 5 años), lo cual condiciona decisiones de arquitectura técnica (Capítulo 11), backend (Capítulo 14) y modelo de negocio (Capítulo 20) desde el primer día, evitando decisiones que optimicen solo el lanzamiento inicial a costa de la sostenibilidad futura.

Un ejemplo de cómo estos pilares deben usarse como filtro de decisión: si se propusiera un sistema de logros puramente privados, visibles solo en el perfil del propio jugador y sin ninguna manifestación en el mundo compartido, ese sistema debería reformularse, porque contradice el pilar de progresión social visible.

## 1.5 Plataformas Objetivo

NITROVIA se desarrolla con una estrategia de plataformas múltiples desde el diseño inicial, no como un port posterior. Las plataformas objetivo son PC (Windows, distribución principal vía Steam, ver Capítulo 21 y 22), Android e iOS (dispositivos móviles).

Esta decisión de multiplataforma desde el inicio tiene implicaciones directas sobre capítulos técnicos posteriores y debe entenderse como una restricción de diseño transversal, no como un detalle de implementación tardío. En particular, condiciona: la arquitectura técnica (Capítulo 11), que debe considerar diferencias de rendimiento entre PC y móvil desde el diseño de sistemas centrales; la optimización (Capítulo 12), que deberá tratar PC, Android e iPhone como perfiles de rendimiento distintos con requisitos propios de memoria, GPU, nivel de detalle (LOD) y streaming de assets; el diseño de interfaz (Capítulo 10), que debe considerar tanto control por teclado/mando como control táctil; y el diseño de UX (Capítulo 9), que debe considerar sesiones de juego más cortas y contextos de uso distintos en móvil frente a PC.

No se define en este capítulo la prioridad de lanzamiento entre plataformas (si PC lanza primero, o si el lanzamiento es simultáneo); esa decisión de producción corresponde al Capítulo 18 (Producción) y al Capítulo 23 (Roadmap), y debe tomarse considerando capacidad real del equipo, no como una aspiración de este documento de visión.

## 1.6 Alcance del Proyecto

El alcance de NITROVIA se define en tres horizontes: MVP (producto mínimo viable jugable), Versión 1.0 (lanzamiento comercial) y Roadmap Post-Lanzamiento (desarrollado en detalle en el Capítulo 23).

El MVP tiene como propósito validar el núcleo jugable del pitch central (sección 1.1) antes de invertir en la totalidad de sistemas descritos en este Master Plan. El MVP debe incluir, como mínimo conceptual (sin entrar en especificación técnica, que corresponde a capítulos posteriores): una porción reducida y representativa de la ciudad (no la ciudad completa), un conjunto reducido de vehículos que cubra al menos dos categorías distintas para validar diferenciación (Capítulo 6), un sistema básico de personalización de vehículo y personaje que demuestre el pilar de identidad expresiva (sección 1.4), y un ciclo de juego central (core loop) jugable de principio a fin: explorar, competir o interactuar, progresar, y volver a explorar con mejoras visibles.

La Versión 1.0 amplía el MVP hasta cubrir la totalidad de sistemas descritos como capítulos exclusivos en el índice del Master Plan: mundo completo con todos sus distritos, sistema completo de vehículos y personajes, inteligencia artificial en sus cinco variantes (competidora, tráfico, peatones, policía, eventos), backend completo con cuentas de usuario, y los sistemas de seguridad correspondientes. La Versión 1.0 es la que se somete a certificación de plataforma (Capítulo 19) y se publica comercialmente (Capítulo 22).

El Roadmap Post-Lanzamiento no forma parte del alcance de la Versión 1.0, sino que la extiende en el tiempo mediante contenido estacional, nuevos distritos, nuevos vehículos y evolución de la franquicia (Capítulo 2, sección 2.5), conforme a los horizontes de 1, 3 y 5 años definidos en el Capítulo 23.

Queda explícitamente fuera del alcance de este documento de visión la especificación de qué contenido concreto pertenece al MVP frente a la Versión 1.0 (por ejemplo, cuántos distritos exactos, cuántos vehículos exactos); esa definición cuantitativa corresponde al Capítulo 18 (Producción) una vez todos los capítulos de sistemas estén desarrollados y aprobados, ya que fijar números en este punto sin conocer el detalle de cada sistema sería una invención no autorizada por las reglas del estudio.

## 1.7 Restricciones y Supuestos

Esta sección documenta explícitamente las restricciones conocidas y los supuestos de trabajo bajo los cuales se redacta este Master Plan, de forma que cualquier cambio futuro en estas condiciones obligue a una revisión formal de este capítulo.

Restricción de equipo: este documento asume un estudio de alcance indie o pequeño-mediano ("un juego indie" según las reglas del estudio), pero desarrollado con procesos y estándares de calidad de estudio profesional AAA. Esto implica que el alcance definido en la sección 1.6 deberá ajustarse de forma realista a la capacidad real de producción cuando esta se conozca (Capítulo 18), y que ningún capítulo posterior debe asumir recursos ilimitados de arte, programación o audio.

Restricción de plataformas: como se establece en la sección 1.5, el desarrollo multiplataforma (PC, Android, iOS) es una decisión ya tomada y no debe cuestionarse en capítulos posteriores sin pasar por el protocolo de aprobación de cambios de arquitectura (Capítulo 25).

Restricción de gobernanza: conforme a las reglas del estudio NITROVIA y a la instrucción explícita del Director General, ninguna implementación de código podrá iniciarse hasta que la totalidad del Master Plan esté aprobada al 100%. Este capítulo, aunque desarrollado y entregado, no autoriza por sí solo el inicio de ninguna tarea de programación.

Supuesto de monetización no definido: este capítulo de Visión no asume ni prejuzga un modelo de negocio específico (premium, free-to-play o híbrido); esa decisión se reserva explícitamente al Capítulo 20 y no debe inferirse de nada expresado en este Capítulo 1.

Supuesto de identidad pendiente de profundización: este Capítulo 1 introduce los pilares de identidad de forma funcional a la visión del producto (sección 1.4), pero la filosofía de marca, el ADN de NITROVIA, los valores y los límites de la franquicia se desarrollan con su propia autoridad en el Capítulo 2 (Identidad de la Franquicia), y cualquier aparente redundancia entre ambos capítulos debe resolverse a favor del Capítulo 2 como fuente de verdad para cuestiones de marca.

Supuesto de no exclusividad de género: se asume que NITROVIA compite en un género con múltiples referencias consolidadas (sección 1.2), lo cual es una ventaja de validación de mercado pero también un riesgo de percepción de falta de originalidad; este riesgo debe gestionarse activamente en el Capítulo 2 y en el Capítulo 21 (Marketing), no ignorarse.

---

**Fin del Capítulo 1.**
