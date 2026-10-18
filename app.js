/* =========================================================
   CULTURA GENERAL PRO — app.js
   Full game logic: questions, audio, timer, score, leaderboard
   ========================================================= */

'use strict';

// ============================================================
// 1. QUESTION BANK (30+ verified questions in Spanish)
// ============================================================
const QUESTION_BANK = [
  // ---- GEOGRAFÍA ----
  {
    category: 'geo',
    categoryLabel: 'Geografía',
    question: '¿Cuál es la capital de Australia?',
    keywords: ['capital', 'Australia'],
    options: ['Sídney', 'Melbourne', 'Canberra', 'Brisbane'],
    correct: 2,
    funfact: 'Canberra fue elegida como capital en 1908 como solución de compromiso entre las rivales Sídney y Melbourne. Su nombre puede provenir de una palabra aborigen que significa "lugar de encuentro".',
  },
  {
    category: 'geo',
    categoryLabel: 'Geografía',
    question: '¿Qué país tiene más fronteras terrestres con otros países?',
    keywords: ['fronteras terrestres'],
    options: ['Rusia', 'China', 'Brasil', 'Alemania'],
    correct: 1,
    funfact: 'China comparte fronteras con 14 países diferentes: Rusia, Mongolia, Kazajistán, Kirguistán, Tayikistán, Afganistán, Pakistán, India, Nepal, Bután, Myanmar, Laos, Vietnam y Corea del Norte.',
  },
  {
    category: 'geo',
    categoryLabel: 'Geografía',
    question: '¿Cuál es el río más largo del mundo?',
    keywords: ['río', 'más largo'],
    options: ['Amazonas', 'Congo', 'Nilo', 'Misisipi'],
    correct: 2,
    funfact: 'El Nilo mide aproximadamente 6.650 km de longitud. Aunque el debate entre el Nilo y el Amazonas continúa, el Nilo es convencionalmente el más largo, mientras que el Amazonas tiene el mayor caudal de agua del mundo.',
  },
  {
    category: 'geo',
    categoryLabel: 'Geografía',
    question: '¿En qué continente se encuentra el desierto más grande del mundo?',
    keywords: ['desierto', 'más grande'],
    options: ['África', 'Asia', 'Australia', 'La Antártida'],
    correct: 3,
    funfact: '¡Sorpresa! La Antártida es técnicamente el desierto más grande del mundo con 14.2 millones de km². Un desierto se define por sus bajas precipitaciones, no por su calor. El Sahara es el desierto caliente más grande.',
  },
  {
    category: 'geo',
    categoryLabel: 'Geografía',
    question: '¿Cuál es el país más pequeño del mundo por superficie?',
    keywords: ['país', 'más pequeño'],
    options: ['Mónaco', 'San Marino', 'Liechtenstein', 'Ciudad del Vaticano'],
    correct: 3,
    funfact: 'Ciudad del Vaticano tiene apenas 0.44 km² y una población de aproximadamente 800 personas. Es el único estado del mundo enteramente rodeado por otra ciudad (Roma).',
  },
  {
    category: 'geo',
    categoryLabel: 'Geografía',
    question: '¿Qué océano es el más profundo del mundo?',
    keywords: ['océano', 'más profundo'],
    options: ['Atlántico', 'Índico', 'Ártico', 'Pacífico'],
    correct: 3,
    funfact: 'El Océano Pacífico alberga la Fosa de las Marianas, el punto más profundo conocido del océano a unos 11.034 metros de profundidad, llamado la "Sima Challenger".',
  },
  {
    category: 'geo',
    categoryLabel: 'Geografía',
    question: '¿Qué país latinoamericano tiene la mayor superficie territorial?',
    keywords: ['latinoamericano', 'mayor superficie'],
    options: ['Argentina', 'México', 'Brasil', 'Colombia'],
    correct: 2,
    funfact: 'Brasil ocupa casi la mitad de América del Sur con 8.5 millones de km². Es el quinto país más grande del mundo y alberga la mayor selva tropical del planeta, la Amazonia.',
  },

  // ---- HISTORIA ----
  {
    category: 'hist',
    categoryLabel: 'Historia',
    question: '¿En qué año cayó el Muro de Berlín?',
    keywords: ['Muro de Berlín'],
    options: ['1987', '1989', '1991', '1993'],
    correct: 1,
    funfact: 'El 9 de noviembre de 1989, miles de berlineses comenzaron a demoler el Muro. Este evento simbolizó el fin de la Guerra Fría y llevó a la reunificación alemana el 3 de octubre de 1990.',
  },
  {
    category: 'hist',
    categoryLabel: 'Historia',
    question: '¿Qué civilización construyó Machu Picchu?',
    keywords: ['Machu Picchu'],
    options: ['Azteca', 'Maya', 'Inca', 'Olmeca'],
    correct: 2,
    funfact: 'Machu Picchu fue construida por los incas alrededor del año 1450, durante el reinado del inca Pachacútec. Fue abandonada aproximadamente 100 años después, durante la conquista española, y permaneció desconocida para el mundo occidental hasta 1911.',
  },
  {
    category: 'hist',
    categoryLabel: 'Historia',
    question: '¿Cuál fue la primera nación en conceder el voto a las mujeres?',
    keywords: ['voto', 'mujeres'],
    options: ['Estados Unidos', 'Reino Unido', 'Nueva Zelanda', 'Francia'],
    correct: 2,
    funfact: 'Nueva Zelanda fue el primer país del mundo en otorgar el sufragio femenino en 1893, gracias en gran parte a la campaña de Kate Sheppard. Las mujeres de Estados Unidos no obtuvieron este derecho hasta 1920.',
  },
  {
    category: 'hist',
    categoryLabel: 'Historia',
    question: '¿Quién fue el primer ser humano en viajar al espacio?',
    keywords: ['primer', 'espacio'],
    options: ['Neil Armstrong', 'Valentina Tereshkova', 'Yuri Gagarin', 'Buzz Aldrin'],
    correct: 2,
    funfact: 'Yuri Gagarin viajó al espacio el 12 de abril de 1961 a bordo del Vostok 1, completando una órbita alrededor de la Tierra en 108 minutos. Su frase al despegar fue: "¡Poyekhali!" (¡Vámonos!).',
  },
  {
    category: 'hist',
    categoryLabel: 'Historia',
    question: '¿En qué año se firmó la Declaración de Independencia de Estados Unidos?',
    keywords: ['Declaración de Independencia', 'Estados Unidos'],
    options: ['1774', '1776', '1778', '1783'],
    correct: 1,
    funfact: 'La Declaración de Independencia fue adoptada por el Congreso Continental el 4 de julio de 1776. Ese día, ahora llamado el Día de la Independencia, es feriado nacional en Estados Unidos.',
  },
  {
    category: 'hist',
    categoryLabel: 'Historia',
    question: '¿Qué imperio fue el más grande de la historia en extensión territorial?',
    keywords: ['imperio', 'más grande'],
    options: ['Imperio Romano', 'Imperio Mongol', 'Imperio Británico', 'Imperio Español'],
    correct: 2,
    funfact: 'El Imperio Británico fue el más extenso de la historia, llegando a cubrir 35.5 millones de km² a principios del siglo XX, lo que representaba el 25% de la superficie terrestre del planeta.',
  },
  {
    category: 'hist',
    categoryLabel: 'Historia',
    question: '¿Cuántos años duró la Guerra de los Cien Años entre Francia e Inglaterra?',
    keywords: ['Guerra', 'Cien Años'],
    options: ['100 años', '116 años', '99 años', '85 años'],
    correct: 1,
    funfact: 'La Guerra de los Cien Años duró en realidad 116 años (1337-1453). Es famosa porque en ella participó Juana de Arco, la joven campesina francesa que lideró al ejército galo hasta que fue capturada y quemada en la hoguera en 1431.',
  },

  // ---- CIENCIA ----
  {
    category: 'sci',
    categoryLabel: 'Ciencia',
    question: '¿Cuántos huesos tiene el cuerpo humano adulto?',
    keywords: ['huesos', 'cuerpo humano'],
    options: ['180', '206', '220', '248'],
    correct: 1,
    funfact: 'El cuerpo humano adulto tiene 206 huesos. Los bebés nacen con alrededor de 270-300 huesos, pero muchos se fusionan durante el crecimiento. El hueso más pequeño es el estribo, en el oído medio.',
  },
  {
    category: 'sci',
    categoryLabel: 'Ciencia',
    question: '¿Qué planeta es el más caliente del sistema solar?',
    keywords: ['planeta', 'más caliente'],
    options: ['Mercurio', 'Marte', 'Júpiter', 'Venus'],
    correct: 3,
    funfact: '¡Sorpresa! Venus es el planeta más caliente (462°C de promedio), no Mercurio, a pesar de que Mercurio está más cerca del Sol. El dióxido de carbono de la atmósfera de Venus crea un efecto invernadero extremo.',
  },
  {
    category: 'sci',
    categoryLabel: 'Ciencia',
    question: '¿Cuál es el elemento químico más abundante en el universo?',
    keywords: ['elemento químico', 'universo'],
    options: ['Helio', 'Carbono', 'Hidrógeno', 'Oxígeno'],
    correct: 2,
    funfact: 'El hidrógeno constituye aproximadamente el 75% de toda la materia normal en el universo. Las estrellas, como nuestro Sol, generan energía mediante la fusión nuclear de átomos de hidrógeno para formar helio.',
  },
  {
    category: 'sci',
    categoryLabel: 'Ciencia',
    question: '¿A qué velocidad viaja la luz en el vacío?',
    keywords: ['velocidad', 'luz'],
    options: ['200,000 km/s', '299,792 km/s', '350,000 km/s', '150,000 km/s'],
    correct: 1,
    funfact: 'La velocidad de la luz en el vacío es exactamente 299,792,458 metros por segundo. A esta velocidad, la luz tarda aproximadamente 8 minutos en llegar del Sol a la Tierra, y más de 4 años en llegar desde la estrella más cercana, Próxima Centauri.',
  },
  {
    category: 'sci',
    categoryLabel: 'Ciencia',
    question: '¿Cuántos cromosomas tiene una célula humana normal?',
    keywords: ['cromosomas', 'célula humana'],
    options: ['23', '44', '46', '48'],
    correct: 2,
    funfact: 'Las células humanas contienen 46 cromosomas organizados en 23 pares. El par 23 determina el sexo biológico: las personas con XX generalmente son femeninas y las XY masculinas. Los óvulos y espermatozoides tienen solo 23 cromosomas.',
  },
  {
    category: 'sci',
    categoryLabel: 'Ciencia',
    question: '¿Cuál es el animal más venenoso del mundo?',
    keywords: ['animal', 'más venenoso'],
    options: ['Cobra real', 'Medusa caja', 'Pulpo de anillos azules', 'Víbora de Gabón'],
    correct: 1,
    funfact: 'La medusa caja (Chironex fleckeri) es considerada el animal más venenoso del mundo. Su veneno puede matar a un humano en menos de 5 minutos y es 100 veces más potente que el de la cobra. Vive principalmente en aguas de Australia e Indonesia.',
  },
  {
    category: 'sci',
    categoryLabel: 'Ciencia',
    question: '¿Qué científica ganó el Premio Nobel tanto en Física como en Química?',
    keywords: ['Nobel', 'Física', 'Química'],
    options: ['Lise Meitner', 'Rosalind Franklin', 'Maria Curie', 'Ada Lovelace'],
    correct: 2,
    funfact: 'Marie Curie (1867-1934) fue la primera persona en ganar dos Premios Nobel en ciencias distintas: Física en 1903 (por el descubrimiento de la radioactividad) y Química en 1911 (por el aislamiento del radio y el polonio).',
  },

  // ---- ARTE ----
  {
    category: 'art',
    categoryLabel: 'Arte y Literatura',
    question: '¿Quién pintó "La noche estrellada"?',
    keywords: ['La noche estrellada'],
    options: ['Pablo Picasso', 'Claude Monet', 'Vincent van Gogh', 'Salvador Dalí'],
    correct: 2,
    funfact: '"La noche estrellada" fue pintada por Van Gogh en junio de 1889 mientras estaba internado en el asilo de Saint-Paul-de-Mausole en Saint-Rémy-de-Provence, Francia. Hoy se encuentra en el Museo de Arte Moderno (MoMA) de Nueva York.',
  },
  {
    category: 'art',
    categoryLabel: 'Arte y Literatura',
    question: '¿En qué país nació el escritor Gabriel García Márquez?',
    keywords: ['Gabriel García Márquez'],
    options: ['México', 'Argentina', 'Colombia', 'Venezuela'],
    correct: 2,
    funfact: 'Gabriel García Márquez nació en Aracataca, Colombia en 1927. Su obra más famosa, "Cien años de soledad" (1967), ha vendido más de 50 millones de ejemplares y está traducida a 46 idiomas. Ganó el Nobel de Literatura en 1982.',
  },
  {
    category: 'art',
    categoryLabel: 'Arte y Literatura',
    question: '¿En qué ciudad se encuentra el museo El Prado?',
    keywords: ['El Prado'],
    options: ['Barcelona', 'Madrid', 'Sevilla', 'Valencia'],
    correct: 1,
    funfact: 'El Museo Nacional del Prado, inaugurado en 1819 en Madrid, es uno de los museos de arte más importantes del mundo. Alberga obras de Velázquez, Goya, Rubens, El Greco y muchos otros maestros de la pintura.',
  },
  {
    category: 'art',
    categoryLabel: 'Arte y Literatura',
    question: '¿Quién escribió "Don Quijote de la Mancha"?',
    keywords: ['Don Quijote de la Mancha'],
    options: ['Lope de Vega', 'Francisco de Quevedo', 'Miguel de Cervantes', 'Tirso de Molina'],
    correct: 2,
    funfact: '"Don Quijote de la Mancha" (1605-1615) es considerada la primera novela moderna y la obra literaria más importante en lengua española. Se estima que ha vendido más de 500 millones de copias, siendo el libro más vendido después de la Biblia.',
  },

  // ---- CULTURA POP ----
  {
    category: 'pop',
    categoryLabel: 'Cultura Pop',
    question: '¿En qué año fue lanzado el primer iPhone por Apple?',
    keywords: ['iPhone', 'Apple'],
    options: ['2005', '2006', '2007', '2008'],
    correct: 2,
    funfact: 'Steve Jobs presentó el primer iPhone el 9 de enero de 2007 en la Macworld Conference & Expo en San Francisco. Lo describió como "un iPod con pantalla táctil, un teléfono revolucionario y un comunicador de internet" todo en uno.',
  },
  {
    category: 'pop',
    categoryLabel: 'Cultura Pop',
    question: '¿Qué película de animación ganó el primer Óscar a Mejor Película de Animación en 2002?',
    keywords: ['Óscar', 'Animación', '2002'],
    options: ['Monsters, Inc.', 'Ice Age', 'Shrek', 'Lilo & Stitch'],
    correct: 2,
    funfact: '"Shrek" (2001) ganó el primer Premio Óscar a Mejor Película de Animación en la ceremonia de 2002. La categoría fue creada ese mismo año. El Óscar fue a DreamWorks Animation, siendo la primera vez que DreamWorks derrotó a Pixar.',
  },
  {
    category: 'pop',
    categoryLabel: 'Cultura Pop',
    question: '¿Cuántas temporadas tiene la serie de televisión "Breaking Bad"?',
    keywords: ['Breaking Bad', 'temporadas'],
    options: ['4', '5', '6', '7'],
    correct: 1,
    funfact: '"Breaking Bad" (2008-2013) tiene 5 temporadas y 62 episodios. La serie fue creada por Vince Gilligan para AMC. En 2014, el Libro Guinness de Récords Mundiales la reconoció como la serie de televisión mejor valorada de todos los tiempos.',
  },
  {
    category: 'pop',
    categoryLabel: 'Cultura Pop',
    question: '¿Cómo se llama la saga de videojuegos donde el personaje principal es Link?',
    keywords: ['videojuegos', 'Link'],
    options: ['Skyrim', 'The Legend of Zelda', 'Dark Souls', 'Dragon Quest'],
    correct: 1,
    funfact: 'A pesar de que el personaje más conocido de la saga se llama Link, muchos jugadores confunden el nombre de la saga pensando que se llama "Link". The Legend of Zelda fue creada por Shigeru Miyamoto para Nintendo en 1986.',
  },
  {
    category: 'pop',
    categoryLabel: 'Cultura Pop',
    question: '¿Qué artista tiene más seguidores en Instagram (a 2024)?',
    keywords: ['seguidores', 'Instagram'],
    options: ['Cristiano Ronaldo', 'Kylie Jenner', 'Lionel Messi', 'Selena Gómez'],
    correct: 0,
    funfact: 'Cristiano Ronaldo supera los 600 millones de seguidores en Instagram, siendo la cuenta con más seguidores de toda la plataforma, incluso por encima de la cuenta oficial de Instagram. ¡Es el ser humano más seguido en redes sociales!',
  },
  {
    category: 'pop',
    categoryLabel: 'Cultura Pop',
    question: '¿En qué año se estrenó la película "El Rey León" original de Disney?',
    keywords: ['El Rey León', 'Disney'],
    options: ['1992', '1993', '1994', '1995'],
    correct: 2,
    funfact: '"El Rey León" se estrenó el 15 de junio de 1994. La película recaudó más de 968 millones de dólares en su estreno original, convirtiéndose en la película animada más taquillera de la historia hasta ese momento. La canción "El Círculo de la Vida" se ha convertido en un himno global.',
  },
  {
    category: 'pop',
    categoryLabel: 'Cultura Pop',
    question: '¿Cuántas piedras del infinito aparecen en el universo Marvel?',
    keywords: ['piedras del infinito', 'Marvel'],
    options: ['4', '5', '6', '7'],
    correct: 2,
    funfact: 'Las 6 Piedras del Infinito en el UCM son: la Gema del Espacio (azul), la Gema de la Realidad (roja), la Gema del Poder (violeta), la Gema del Alma (naranja), la Gema del Tiempo (verde) y la Gema de la Mente (amarilla). Juntas otorgan poder ilimitado.',
  },

  // ---- GEOGRAFÍA (extra) ----
  {
    category: 'geo', categoryLabel: 'Geografía',
    question: '¿Cuál es la montaña más alta del mundo?',
    keywords: ['montaña', 'más alta'],
    options: ['K2', 'Mont Blanc', 'Kilimanjaro', 'Everest'],
    correct: 3,
    funfact: 'El Monte Everest mide 8.848 metros y está en la frontera Nepal-Tíbet. Curiosamente, si medimos desde el centro de la Tierra, el volcán Chimborazo en Ecuador sería el punto más "alto" por el abultamiento ecuatorial.',
  },
  {
    category: 'geo', categoryLabel: 'Geografía',
    question: '¿Cuál es el lago más grande del mundo?',
    keywords: ['lago', 'más grande'],
    options: ['Lago Superior', 'Mar Caspio', 'Lago Victoria', 'Lago Baikal'],
    correct: 1,
    funfact: 'El Mar Caspio es técnicamente un lago salado y es el más grande del mundo con 371.000 km². El Lago Baikal es el más profundo y contiene el 20% del agua dulce superficial del planeta.',
  },
  {
    category: 'geo', categoryLabel: 'Geografía',
    question: '¿Cuál es el país con más habitantes del mundo en 2024?',
    keywords: ['más habitantes'],
    options: ['India', 'China', 'Estados Unidos', 'Indonesia'],
    correct: 0,
    funfact: 'India superó a China como el país más poblado del mundo en 2023, con más de 1.400 millones de habitantes. Se estima que para 2050 India tendrá cerca de 1.670 millones de personas.',
  },
  {
    category: 'geo', categoryLabel: 'Geografía',
    question: '¿Cuál es la capital de Canadá?',
    keywords: ['capital', 'Canadá'],
    options: ['Toronto', 'Vancouver', 'Montreal', 'Ottawa'],
    correct: 3,
    funfact: 'Ottawa fue elegida capital de Canadá en 1857 por la reina Victoria como solución de compromiso entre las rivales Toronto y Montreal.',
  },
  {
    category: 'geo', categoryLabel: 'Geografía',
    question: '¿Cuántos países hay en el continente africano?',
    keywords: ['países', 'continente africano'],
    options: ['44', '48', '54', '61'],
    correct: 2,
    funfact: 'África tiene 54 países reconocidos, siendo el continente con más naciones del mundo. El más reciente en independizarse fue Sudán del Sur en 2011.',
  },
  {
    category: 'geo', categoryLabel: 'Geografía',
    question: '¿Cuál es el punto más bajo de la Tierra en tierra firme?',
    keywords: ['punto más bajo'],
    options: ['Valle de la Muerte', 'Mar Muerto', 'Lago Assal', 'Cuenca del Turpan'],
    correct: 1,
    funfact: 'El Mar Muerto, en la frontera entre Israel y Jordania, está a unos 430 metros bajo el nivel del mar. Es tan salado que el cuerpo humano flota sin esfuerzo alguno.',
  },
  {
    category: 'geo', categoryLabel: 'Geografía',
    question: '¿Cuántos países componen la Unión Europea desde el Brexit?',
    keywords: ['Unión Europea', 'países'],
    options: ['25', '27', '28', '30'],
    correct: 1,
    funfact: 'La Unión Europea tiene 27 países miembros desde que el Reino Unido salió oficialmente el 31 de enero de 2020 (Brexit). La UE fue establecida formalmente por el Tratado de Maastricht en 1993.',
  },
  {
    category: 'geo', categoryLabel: 'Geografía',
    question: '¿Cuál es el volcán activo más alto del mundo?',
    keywords: ['volcán activo', 'más alto'],
    options: ['Kilimanjaro', 'Etna', 'Ojos del Salado', 'Popocatépetl'],
    correct: 2,
    funfact: 'El Ojos del Salado, en la frontera entre Chile y Argentina, es el volcán activo más alto del mundo con 6.893 metros. Su última erupción fue hace aproximadamente 1.000 años.',
  },
  {
    category: 'geo', categoryLabel: 'Geografía',
    question: '¿Cuál es el continente más pequeño del mundo?',
    keywords: ['continente', 'más pequeño'],
    options: ['Europa', 'Oceanía', 'Australia', 'Antártida'],
    correct: 2,
    funfact: 'Australia es el continente más pequeño con 7.7 millones de km². También es el más plano, el más seco (excluida la Antártida) y el más antiguo. El 80% de sus animales son únicos en el mundo.',
  },
  {
    category: 'geo', categoryLabel: 'Geografía',
    question: '¿En qué país se encuentra la capital más alta del mundo?',
    keywords: ['capital más alta'],
    options: ['Bolivia', 'Perú', 'Ecuador', 'Colombia'],
    correct: 0,
    funfact: 'La Paz (Bolivia) es la sede de gobierno más alta del mundo a 3.625 metros. La capital constitucional es Sucre. Los visitantes a menudo sufren el "soroche" o mal de altura.',
  },

  // ---- HISTORIA (extra) ----
  {
    category: 'hist', categoryLabel: 'Historia',
    question: '¿En qué año llegaron los españoles a América por primera vez?',
    keywords: ['españoles', 'América'],
    options: ['1490', '1492', '1498', '1504'],
    correct: 1,
    funfact: 'Cristóbal Colón llegó a América el 12 de octubre de 1492. Murió creyendo haber llegado a Asia. Américo Vespucio fue quien reconoció que era un continente nuevo, y por eso lleva su nombre.',
  },
  {
    category: 'hist', categoryLabel: 'Historia',
    question: '¿Qué faraón mandó construir la Gran Pirámide de Giza?',
    keywords: ['Gran Pirámide de Giza'],
    options: ['Ramsés II', 'Tutankamón', 'Keops', 'Cleopatra'],
    correct: 2,
    funfact: 'La Gran Pirámide de Giza fue construida por orden del faraón Keops alrededor del año 2560 a.C. Tardó unos 20 años y requirió el trabajo de unos 100.000 obreros.',
  },
  {
    category: 'hist', categoryLabel: 'Historia',
    question: '¿Cuándo comenzó la Primera Guerra Mundial?',
    keywords: ['Primera Guerra Mundial'],
    options: ['1912', '1914', '1916', '1918'],
    correct: 1,
    funfact: 'La Primera Guerra Mundial comenzó el 28 de julio de 1914 tras el asesinato del Archiduque Francisco Fernando en Sarajevo. Terminó el 11 de noviembre de 1918 con más de 20 millones de muertos.',
  },
  {
    category: 'hist', categoryLabel: 'Historia',
    question: '¿Quién fue el primer presidente de Estados Unidos?',
    keywords: ['primer presidente', 'Estados Unidos'],
    options: ['Thomas Jefferson', 'Benjamin Franklin', 'George Washington', 'John Adams'],
    correct: 2,
    funfact: 'George Washington fue el primer presidente de EE.UU. desde 1789 hasta 1797. Es el único presidente que recibió el 100% de los votos del Colegio Electoral.',
  },
  {
    category: 'hist', categoryLabel: 'Historia',
    question: '¿En qué año terminó la Segunda Guerra Mundial?',
    keywords: ['Segunda Guerra Mundial'],
    options: ['1943', '1944', '1945', '1946'],
    correct: 2,
    funfact: 'La Segunda Guerra Mundial terminó el 2 de septiembre de 1945 con la rendición de Japón. Fue el conflicto más destructivo de la historia con más de 70 millones de muertos.',
  },
  {
    category: 'hist', categoryLabel: 'Historia',
    question: '¿Quién fue Simón Bolívar?',
    keywords: ['Simón Bolívar'],
    options: ['Un rey español', 'El Libertador de América del Sur', 'Un conquistador portugués', 'El primer presidente de México'],
    correct: 1,
    funfact: 'Simón Bolívar (1783-1830) lideró la independencia de Venezuela, Colombia, Ecuador, Perú, Bolivia y Panamá del Imperio Español. Bolivia fue nombrada en su honor.',
  },
  {
    category: 'hist', categoryLabel: 'Historia',
    question: '¿En qué año se produjo la Revolución Francesa?',
    keywords: ['Revolución Francesa'],
    options: ['1776', '1789', '1799', '1804'],
    correct: 1,
    funfact: 'La Revolución Francesa comenzó en 1789 con la toma de la Bastilla el 14 de julio. Introdujo los ideales de Libertad, Igualdad y Fraternidad que transformaron la política mundial.',
  },
  {
    category: 'hist', categoryLabel: 'Historia',
    question: '¿Cuál fue el primer país de América Latina en independizarse?',
    keywords: ['primer país', 'América Latina', 'independizarse'],
    options: ['México', 'Argentina', 'Venezuela', 'Haití'],
    correct: 3,
    funfact: 'Haití declaró su independencia el 1 de enero de 1804, siendo el primer país de América Latina y el primer estado negro libre del mundo. Fue la única revolución de esclavos exitosa de la historia.',
  },
  {
    category: 'hist', categoryLabel: 'Historia',
    question: '¿Quién fue el primer hombre en pisar la Luna?',
    keywords: ['primer hombre', 'Luna'],
    options: ['Buzz Aldrin', 'Yuri Gagarin', 'Neil Armstrong', 'John Glenn'],
    correct: 2,
    funfact: 'Neil Armstrong pisó la Luna el 20 de julio de 1969 durante la misión Apolo 11. Sus palabras: "Un pequeño paso para el hombre, un gran salto para la humanidad." En total 12 personas han caminado sobre la Luna.',
  },
  {
    category: 'hist', categoryLabel: 'Historia',
    question: '¿En qué año se firmó la Carta Magna en Inglaterra?',
    keywords: ['Carta Magna'],
    options: ['1115', '1215', '1315', '1415'],
    correct: 1,
    funfact: 'La Carta Magna fue firmada en 1215 por el rey Juan I de Inglaterra, obligado por los barones rebeldes. Es uno de los primeros documentos que limitó el poder del monarca y es antecedente de las constituciones modernas.',
  },
  {
    category: 'hist', categoryLabel: 'Historia',
    question: '¿Qué civilización construyó el Coliseo de Roma?',
    keywords: ['Coliseo', 'Roma'],
    options: ['Los griegos', 'Los romanos', 'Los etruscos', 'Los cartagineses'],
    correct: 1,
    funfact: 'El Coliseo de Roma fue construido entre los años 70 y 80 d.C. bajo los emperadores Vespasiano y Tito. Podía albergar entre 50.000 y 80.000 espectadores y se usó para gladiadores y espectáculos públicos durante más de 400 años.',
  },
  {
    category: 'hist', categoryLabel: 'Historia',
    question: '¿Quién fue Cleopatra?',
    keywords: ['Cleopatra'],
    options: ['Una diosa egipcia', 'La última faraona del Antiguo Egipto', 'Una reina griega de Macedonia', 'Una emperatriz romana'],
    correct: 1,
    funfact: 'Cleopatra VII (69-30 a.C.) fue la última faraona del Antiguo Egipto. Era de origen macedonio-griego y fue famosa por sus relaciones con Julio César y Marco Antonio. Hablaba 9 idiomas y fue la primera de su dinastía en aprender egipcio.',
  },

  // ---- CIENCIA (extra) ----
  {
    category: 'sci', categoryLabel: 'Ciencia',
    question: '¿Cuántas capas tiene la atmósfera terrestre?',
    keywords: ['capas', 'atmósfera'],
    options: ['3', '4', '5', '6'],
    correct: 2,
    funfact: 'La atmósfera tiene 5 capas: troposfera, estratosfera (con la capa de ozono), mesosfera, termosfera (donde orbitan los satélites) y exosfera. La aurora boreal ocurre en la termosfera.',
  },
  {
    category: 'sci', categoryLabel: 'Ciencia',
    question: '¿Cuál es el planeta más grande del sistema solar?',
    keywords: ['planeta', 'más grande'],
    options: ['Saturno', 'Neptuno', 'Urano', 'Júpiter'],
    correct: 3,
    funfact: 'Júpiter es tan grande que cabría 1.300 Tierras en su interior. La Gran Mancha Roja es una tormenta que lleva activa más de 350 años. Tiene 95 lunas conocidas.',
  },
  {
    category: 'sci', categoryLabel: 'Ciencia',
    question: '¿Qué es el ADN?',
    keywords: ['ADN'],
    options: ['Un tipo de proteína', 'Ácido desoxirribonucleico', 'Un aminoácido esencial', 'Una enzima digestiva'],
    correct: 1,
    funfact: 'El ADN (Ácido DesoxirriboNucleico) contiene las instrucciones genéticas de todos los seres vivos. Si se estirara todo el ADN de una sola célula humana, mediría unos 2 metros de longitud.',
  },
  {
    category: 'sci', categoryLabel: 'Ciencia',
    question: '¿Cuál es el metal más liviano del mundo?',
    keywords: ['metal', 'más liviano'],
    options: ['Aluminio', 'Titanio', 'Litio', 'Berilio'],
    correct: 2,
    funfact: 'El litio tiene una densidad de solo 0.534 g/cm³, tan liviano que flota en el agua. Es vital en las baterías que alimentan nuestros teléfonos y vehículos eléctricos.',
  },
  {
    category: 'sci', categoryLabel: 'Ciencia',
    question: '¿Cuántos planetas tiene nuestro sistema solar?',
    keywords: ['planetas', 'sistema solar'],
    options: ['7', '8', '9', '10'],
    correct: 1,
    funfact: 'Desde 2006, cuando la UAI reclasificó a Plutón como planeta enano, el sistema solar tiene oficialmente 8 planetas. Plutón comparte su órbita con otros objetos del Cinturón de Kuiper.',
  },
  {
    category: 'sci', categoryLabel: 'Ciencia',
    question: '¿Qué científico formuló la Teoría de la Relatividad?',
    keywords: ['Teoría de la Relatividad'],
    options: ['Isaac Newton', 'Nikola Tesla', 'Albert Einstein', 'Stephen Hawking'],
    correct: 2,
    funfact: 'Einstein publicó la Relatividad Especial en 1905 y la General en 1915. Su ecuación E=mc² describe la equivalencia entre energía y masa. Curiosamente ganó el Nobel en 1921 por el efecto fotoeléctrico, no por la relatividad.',
  },
  {
    category: 'sci', categoryLabel: 'Ciencia',
    question: '¿Cuál es el órgano más grande del cuerpo humano?',
    keywords: ['órgano', 'más grande'],
    options: ['Hígado', 'Pulmones', 'Piel', 'Intestino delgado'],
    correct: 2,
    funfact: 'La piel es el órgano más grande del cuerpo humano con una superficie de 1.5 a 2 m² y un peso de unos 5 kg. Se renueva completamente cada 27 días.',
  },
  {
    category: 'sci', categoryLabel: 'Ciencia',
    question: '¿Qué gas es el principal componente del aire que respiramos?',
    keywords: ['gas', 'aire'],
    options: ['Oxígeno', 'Dióxido de carbono', 'Nitrógeno', 'Argón'],
    correct: 2,
    funfact: 'El aire está compuesto por un 78% de nitrógeno, 21% de oxígeno y 1% de otros gases. A pesar de ser tan abundante, el nitrógeno puro es tóxico para los seres humanos.',
  },
  {
    category: 'sci', categoryLabel: 'Ciencia',
    question: '¿Cuánto tarda la Tierra en dar una vuelta alrededor del Sol?',
    keywords: ['Tierra', 'vuelta', 'Sol'],
    options: ['30 días', '180 días', '365.25 días', '400 días'],
    correct: 2,
    funfact: 'La Tierra tarda 365.25 días en completar una órbita solar. Ese 0.25 extra genera el año bisiesto cada 4 años. La velocidad orbital de la Tierra es de unos 107.000 km/h.',
  },
  {
    category: 'sci', categoryLabel: 'Ciencia',
    question: '¿Cuántos dientes tiene un adulto humano completo?',
    keywords: ['dientes', 'adulto'],
    options: ['28', '30', '32', '34'],
    correct: 2,
    funfact: 'Los adultos tienen 32 dientes permanentes incluyendo 4 muelas del juicio. Los dientes son la parte más dura del cuerpo humano, incluso más que los huesos.',
  },
  {
    category: 'sci', categoryLabel: 'Ciencia',
    question: '¿Cuántas veces late el corazón humano por minuto en reposo?',
    keywords: ['corazón', 'late'],
    options: ['40-50', '60-100', '100-120', '120-160'],
    correct: 1,
    funfact: 'El corazón late entre 60 y 100 veces por minuto en reposo, más de 100.000 latidos al día. Los atletas de élite pueden tener frecuencias de 40 lpm. A lo largo de una vida da aproximadamente 3.000 millones de latidos.',
  },
  {
    category: 'sci', categoryLabel: 'Ciencia',
    question: '¿Qué invento se atribuye a Alexander Graham Bell en 1876?',
    keywords: ['Alexander Graham Bell'],
    options: ['El telégrafo', 'El teléfono', 'La radio', 'La bombilla eléctrica'],
    correct: 1,
    funfact: 'Bell patentó el teléfono el 7 de marzo de 1876. Sus primeras palabras fueron: "Sr. Watson, venga aquí, quiero verlo." Sin embargo, Antonio Meucci y Elisha Gray también desarrollaron dispositivos similares.',
  },
  {
    category: 'sci', categoryLabel: 'Ciencia',
    question: '¿Qué parte del cerebro controla el equilibrio y la coordinación?',
    keywords: ['cerebro', 'equilibrio', 'coordinación'],
    options: ['Cerebro', 'Hipotálamo', 'Cerebelo', 'Bulbo raquídeo'],
    correct: 2,
    funfact: 'El cerebelo controla el equilibrio y la coordinación. Aunque representa solo el 10% del peso del cerebro, contiene más del 50% de sus neuronas. Su nombre en latín significa "cerebro pequeño".',
  },

  // ---- ARTE Y LITERATURA (extra) ----
  {
    category: 'art', categoryLabel: 'Arte y Literatura',
    question: '¿Quién esculpió el David de Florencia?',
    keywords: ['David', 'Florencia'],
    options: ['Leonardo da Vinci', 'Rafael Sanzio', 'Miguel Ángel', 'Donatello'],
    correct: 2,
    funfact: 'Miguel Ángel esculpió el David entre 1501 y 1504 con un bloque de mármol de Carrara. Mide 5,17 metros y hoy está en la Galleria dell\'Accademia de Florencia.',
  },
  {
    category: 'art', categoryLabel: 'Arte y Literatura',
    question: '¿Quién pintó la Mona Lisa?',
    keywords: ['Mona Lisa'],
    options: ['Rafael Sanzio', 'Leonardo da Vinci', 'Sandro Botticelli', 'Caravaggio'],
    correct: 1,
    funfact: 'Leonardo da Vinci pintó la Mona Lisa entre 1503 y 1519. Es la obra de arte más visitada del mundo en el Louvre de París, con más de 9 millones de visitantes al año.',
  },
  {
    category: 'art', categoryLabel: 'Arte y Literatura',
    question: '¿De qué país es originario el tango?',
    keywords: ['tango'],
    options: ['España', 'Cuba', 'Uruguay', 'Argentina'],
    correct: 3,
    funfact: 'El tango nació en los barrios populares de Buenos Aires a finales del siglo XIX. En 2009 fue declarado Patrimonio Cultural Inmaterial de la Humanidad por la UNESCO.',
  },
  {
    category: 'art', categoryLabel: 'Arte y Literatura',
    question: '¿En qué país nació el pintor Pablo Picasso?',
    keywords: ['Pablo Picasso'],
    options: ['Francia', 'Italia', 'España', 'México'],
    correct: 2,
    funfact: 'Pablo Picasso nació en Málaga, España, en 1881. Fue co-fundador del cubismo. Su Guernica (1937) es un grito contra los horrores de la guerra civil española.',
  },
  {
    category: 'art', categoryLabel: 'Arte y Literatura',
    question: '¿Quién compuso la Quinta Sinfonía?',
    keywords: ['Quinta Sinfonía'],
    options: ['Mozart', 'Bach', 'Beethoven', 'Chopin'],
    correct: 2,
    funfact: 'Beethoven compuso su Quinta Sinfonía entre 1804 y 1808. Sus primeras cuatro notas son de las más reconocibles de la música clásica. La compuso cuando ya estaba completamente sordo.',
  },
  {
    category: 'art', categoryLabel: 'Arte y Literatura',
    question: '¿Quién escribió "Harry Potter"?',
    keywords: ['Harry Potter'],
    options: ['Stephenie Meyer', 'J.R.R. Tolkien', 'J.K. Rowling', 'C.S. Lewis'],
    correct: 2,
    funfact: 'J.K. Rowling escribió el primer Harry Potter siendo madre soltera desempleada. El manuscrito fue rechazado 12 veces antes de publicarse en 1997. La saga ha vendido más de 500 millones de copias.',
  },
  {
    category: 'art', categoryLabel: 'Arte y Literatura',
    question: '¿Qué arquitecto diseñó el Museo Guggenheim de Bilbao?',
    keywords: ['Guggenheim', 'Bilbao'],
    options: ['Zaha Hadid', 'Frank Gehry', 'Renzo Piano', 'Norman Foster'],
    correct: 1,
    funfact: 'Frank Gehry diseñó el Guggenheim de Bilbao, inaugurado en 1997. El edificio está recubierto de titanio. Su apertura transformó económicamente toda la región vasca (el "Efecto Guggenheim").',
  },
  {
    category: 'art', categoryLabel: 'Arte y Literatura',
    question: '¿Qué movimiento artístico fundaron Picasso y Braque?',
    keywords: ['movimiento artístico', 'Picasso', 'Braque'],
    options: ['Surrealismo', 'Impresionismo', 'Cubismo', 'Expresionismo'],
    correct: 2,
    funfact: 'El cubismo fue desarrollado por Picasso y Georges Braque alrededor de 1907. Se caracteriza por representar objetos desde múltiples puntos de vista simultáneamente. "Las señoritas de Avignon" de Picasso es considerada su primera obra proto-cubista.',
  },
  {
    category: 'art', categoryLabel: 'Arte y Literatura',
    question: '¿Cuál es el libro más vendido de la historia después de la Biblia?',
    keywords: ['libro', 'más vendido'],
    options: ['El Quijote', 'El Señor de los Anillos', 'Harry Potter', 'El Principito'],
    correct: 0,
    funfact: 'Don Quijote de la Mancha de Cervantes es considerado el libro más vendido después de la Biblia, con más de 500 millones de copias. Fue publicado entre 1605 y 1615 y es considerado la primera novela moderna.',
  },
  {
    category: 'art', categoryLabel: 'Arte y Literatura',
    question: '¿En qué año escribió Shakespeare "Romeo y Julieta"?',
    keywords: ['Romeo y Julieta', 'Shakespeare'],
    options: ['Alrededor de 1594', 'Alrededor de 1610', 'Alrededor de 1580', 'Alrededor de 1620'],
    correct: 0,
    funfact: 'William Shakespeare escribió "Romeo y Julieta" alrededor de 1594-1596. Shakespeare también escribió Hamlet, Macbeth y El sueño de una noche de verano. Murió en 1616 y su obra sigue siendo la más representada del mundo.',
  },

  // ---- CULTURA POP (extra) ----
  {
    category: 'pop', categoryLabel: 'Cultura Pop',
    question: '¿Cuál es el videojuego más vendido de la historia?',
    keywords: ['videojuego', 'más vendido'],
    options: ['Tetris', 'Minecraft', 'GTA V', 'Super Mario Bros.'],
    correct: 1,
    funfact: 'Minecraft ha vendido más de 238 millones de copias. Fue creado por Markus "Notch" Persson en 2009 y Microsoft lo compró en 2014 por 2.500 millones de dólares.',
  },
  {
    category: 'pop', categoryLabel: 'Cultura Pop',
    question: '¿Qué banda lanzó el álbum "Thriller" en 1982?',
    keywords: ['Thriller', '1982'],
    options: ['The Beatles', 'Queen', 'Michael Jackson', 'Prince'],
    correct: 2,
    funfact: '"Thriller" de Michael Jackson es el álbum más vendido de la historia con más de 70 millones de copias. El videoclip "Thriller" revolucionó el formato de videoclip musical.',
  },
  {
    category: 'pop', categoryLabel: 'Cultura Pop',
    question: '¿En qué año se lanzó la primera temporada de "Stranger Things"?',
    keywords: ['Stranger Things'],
    options: ['2015', '2016', '2017', '2018'],
    correct: 1,
    funfact: '"Stranger Things" se estrenó en Netflix el 15 de julio de 2016. La serie impulsó enormemente la popularidad de la canción "Running Up That Hill" de Kate Bush (1985).',
  },
  {
    category: 'pop', categoryLabel: 'Cultura Pop',
    question: '¿Qué película recaudó más dinero en la historia del cine?',
    keywords: ['película', 'más dinero'],
    options: ['Avengers: Endgame', 'Avatar (2009)', 'Titanic', 'Star Wars VII'],
    correct: 1,
    funfact: '"Avatar" (2009) es la película que más ha recaudado con más de 2.923 millones de dólares. En segundo lugar está "Avengers: Endgame" con 2.798 millones.',
  },
  {
    category: 'pop', categoryLabel: 'Cultura Pop',
    question: '¿Cuántos Óscar ganó la película "Titanic" (1997)?',
    keywords: ['Óscar', 'Titanic'],
    options: ['8', '9', '11', '14'],
    correct: 2,
    funfact: '"Titanic" ganó 11 Premios de la Academia en 1998, igualando el récord de "Ben-Hur" y "El señor de los anillos: El retorno del rey". Fue la primera película en superar los 1.000 millones en taquilla.',
  },
  {
    category: 'pop', categoryLabel: 'Cultura Pop',
    question: '¿Quién interpreta a Iron Man en el Universo Cinematográfico de Marvel?',
    keywords: ['Iron Man', 'Marvel'],
    options: ['Chris Evans', 'Chris Hemsworth', 'Robert Downey Jr.', 'Mark Ruffalo'],
    correct: 2,
    funfact: 'Robert Downey Jr. interpretó a Tony Stark/Iron Man desde 2008 hasta 2019. Su frase "I am Iron Man" en Endgame se convirtió en una de las más icónicas de la historia del cine.',
  },
  {
    category: 'pop', categoryLabel: 'Cultura Pop',
    question: '¿Cuántos episodios tiene "Game of Thrones"?',
    keywords: ['Game of Thrones', 'episodios'],
    options: ['63', '67', '73', '80'],
    correct: 2,
    funfact: '"Game of Thrones" tiene 8 temporadas y 73 episodios (2011-2019). Ganó 59 Emmys, más que cualquier otro drama en la historia. Está basada en la saga de George R.R. Martin.',
  },
  {
    category: 'pop', categoryLabel: 'Cultura Pop',
    question: '¿Qué grupo musical es conocido como "Los Fab Four"?',
    keywords: ['Fab Four'],
    options: ['The Rolling Stones', 'The Beatles', 'Queen', 'Led Zeppelin'],
    correct: 1,
    funfact: 'The Beatles fueron apodados "The Fab Four" (Los Cuatro Fabulosos): John Lennon, Paul McCartney, George Harrison y Ringo Starr. Se disolvieron en 1970 pero siguen siendo la banda con más ventas en la historia de la música.',
  },
  {
    category: 'pop', categoryLabel: 'Cultura Pop',
    question: '¿En qué plataforma se estrenó "The Mandalorian"?',
    keywords: ['The Mandalorian'],
    options: ['Netflix', 'HBO Max', 'Amazon Prime', 'Disney+'],
    correct: 3,
    funfact: '"The Mandalorian" fue el estreno de Disney+ en noviembre de 2019 e introdujo a Grogu ("Baby Yoda"), que se convirtió en un fenómeno viral global antes del primer capítulo.',
  },
  {
    category: 'pop', categoryLabel: 'Cultura Pop',
    question: '¿Cómo se llama el personaje principal de la saga "Halo"?',
    keywords: ['Halo', 'videojuegos'],
    options: ['Master Chief', 'Commander Shepard', 'Doomguy', 'Marcus Fenix'],
    correct: 0,
    funfact: 'Master Chief (John-117) es el protagonista de Halo. La saga fue desarrollada por Bungie y lanzada en 2001 como exclusivo de Xbox. Halo definió los shooters en consola durante una generación.',
  },

  // ---- DEPORTES ----
  {
    category: 'dep', categoryLabel: 'Deportes',
    question: '¿Cuántos Balones de Oro ha ganado Lionel Messi?',
    keywords: ['Balones de Oro', 'Messi'],
    options: ['6', '7', '8', '9'],
    correct: 2,
    funfact: 'Lionel Messi ganó su octavo Balón de Oro en 2023 tras el Mundial de Qatar 2022. Superó a Cristiano Ronaldo, quien tiene 5. Messi ganó su primero en 2009 con el FC Barcelona.',
  },
  {
    category: 'dep', categoryLabel: 'Deportes',
    question: '¿Qué país ha ganado más Copas del Mundo de fútbol?',
    keywords: ['Copas del Mundo', 'fútbol'],
    options: ['Alemania', 'Italia', 'Argentina', 'Brasil'],
    correct: 3,
    funfact: 'Brasil ha ganado 5 Copas del Mundo (1958, 1962, 1970, 1994, 2002) y es el único país que ha participado en todos los mundiales de la historia.',
  },
  {
    category: 'dep', categoryLabel: 'Deportes',
    question: '¿En qué país se celebraron los primeros Juegos Olímpicos modernos?',
    keywords: ['primeros Juegos Olímpicos modernos'],
    options: ['Francia', 'Inglaterra', 'Grecia', 'Italia'],
    correct: 2,
    funfact: 'Los primeros Juegos Olímpicos modernos se celebraron en Atenas en 1896. Organizados por Pierre de Coubertin, participaron 241 atletas de 14 países en 9 deportes.',
  },
  {
    category: 'dep', categoryLabel: 'Deportes',
    question: '¿Quién tiene el récord de más títulos de Grand Slam en tenis masculino?',
    keywords: ['Grand Slam', 'tenis'],
    options: ['Rafael Nadal', 'Roger Federer', 'Novak Djokovic', 'Pete Sampras'],
    correct: 2,
    funfact: 'Novak Djokovic lidera con 24 títulos de Grand Slam. Le siguen Nadal con 22 y Federer con 20. Djokovic ganó su 24º en el US Open 2023.',
  },
  {
    category: 'dep', categoryLabel: 'Deportes',
    question: '¿Cuántos anillos tiene el símbolo olímpico?',
    keywords: ['anillos', 'símbolo olímpico'],
    options: ['4', '5', '6', '7'],
    correct: 1,
    funfact: 'Los cinco anillos representan los cinco continentes: América, Europa, Asia, África y Oceanía. Los colores (azul, amarillo, negro, verde y rojo) más el fondo blanco incluyen al menos un color de cada bandera nacional.',
  },
  {
    category: 'dep', categoryLabel: 'Deportes',
    question: '¿Qué nadador ganó 8 medallas de oro en Pekín 2008?',
    keywords: ['8 medallas de oro', 'Pekín 2008'],
    options: ['Ian Thorpe', 'Ryan Lochte', 'Michael Phelps', 'Mark Spitz'],
    correct: 2,
    funfact: 'Michael Phelps ganó 8 oros en Pekín 2008, superando el récord de Spitz (7 en 1972). En total ganó 23 oros olímpicos, siendo el atleta más laureado de la historia olímpica.',
  },
  {
    category: 'dep', categoryLabel: 'Deportes',
    question: '¿Qué deporte se practica en Wimbledon?',
    keywords: ['Wimbledon'],
    options: ['Golf', 'Críquet', 'Tenis', 'Polo'],
    correct: 2,
    funfact: 'Wimbledon es el torneo de tenis más antiguo del mundo desde 1877. Es el único Grand Slam en hierba y los jugadores deben vestir principalmente de blanco.',
  },
  {
    category: 'dep', categoryLabel: 'Deportes',
    question: '¿En qué año ganó Argentina su primer Mundial de fútbol?',
    keywords: ['Argentina', 'primer Mundial'],
    options: ['1978', '1982', '1986', '1990'],
    correct: 0,
    funfact: 'Argentina ganó su primer Mundial en 1978 en casa. Su segundo fue en México 1986 con Maradona. El tercero en Qatar 2022 con Messi en la final más emocionante de la historia.',
  },
  {
    category: 'dep', categoryLabel: 'Deportes',
    question: '¿Cuál es el club de fútbol con más Champions League ganadas?',
    keywords: ['Champions League'],
    options: ['FC Barcelona', 'Bayern Múnich', 'Real Madrid', 'AC Milan'],
    correct: 2,
    funfact: 'El Real Madrid es el club con más Champions League/Copa de Europa con 15 títulos. Su récord más reciente fue en 2024 contra el Borussia Dortmund.',
  },
  {
    category: 'dep', categoryLabel: 'Deportes',
    question: '¿Quién es el máximo goleador histórico de los Mundiales de fútbol?',
    keywords: ['máximo goleador', 'Mundiales'],
    options: ['Pelé', 'Ronaldo Nazario', 'Miroslav Klose', 'Gerd Müller'],
    correct: 2,
    funfact: 'Miroslav Klose anotó 16 goles en Copas del Mundo (2002-2014), superando a Ronaldo Nazario con 15. También ganó el Mundial con Alemania en Brasil 2014.',
  },
  {
    category: 'dep', categoryLabel: 'Deportes',
    question: '¿Qué equipo de la NBA tiene más campeonatos en la historia?',
    keywords: ['NBA', 'campeonatos'],
    options: ['Los Angeles Lakers', 'Chicago Bulls', 'Boston Celtics', 'Golden State Warriors'],
    correct: 2,
    funfact: 'Los Boston Celtics tienen 18 títulos de la NBA (hasta 2024), siendo los más exitosos. Los Lakers tienen 17. Michael Jordan ganó 6 anillos con los Chicago Bulls.',
  },
  {
    category: 'dep', categoryLabel: 'Deportes',
    question: '¿Cuántos jugadores hay en un equipo de baloncesto en la cancha?',
    keywords: ['jugadores', 'baloncesto'],
    options: ['4', '5', '6', '7'],
    correct: 1,
    funfact: 'Cada equipo tiene 5 jugadores en la cancha: base, escolta, alero, ala-pívot y pívot. El baloncesto fue inventado por el Dr. James Naismith en 1891 en Springfield, Massachusetts.',
  },
  {
    category: 'dep', categoryLabel: 'Deportes',
    question: '¿Qué boxeador fue conocido como "El más grande"?',
    keywords: ['boxeador', 'El más grande'],
    options: ['Joe Frazier', 'Mike Tyson', 'Muhammad Ali', 'George Foreman'],
    correct: 2,
    funfact: 'Muhammad Ali es ampliamente considerado el mejor boxeador de todos los tiempos. Fue campeón mundial en peso pesado tres veces y también es recordado por su activismo contra la Guerra de Vietnam.',
  },
  {
    category: 'dep', categoryLabel: 'Deportes',
    question: '¿Qué país ganó la Copa del Mundo de fútbol 2018 en Rusia?',
    keywords: ['Copa del Mundo', '2018'],
    options: ['Croacia', 'Bélgica', 'Francia', 'Inglaterra'],
    correct: 2,
    funfact: 'Francia ganó el Mundial de Rusia 2018 derrotando a Croacia 4-2. Fue su segundo título mundial. Mbappé, con 19 años, marcó en la final siendo el segundo menor en lograrlo tras Pelé.',
  },
  {
    category: 'dep', categoryLabel: 'Deportes',
    question: '¿Cuánto dura un partido de fútbol reglamentario?',
    keywords: ['partido fútbol', 'duración'],
    options: ['80 minutos', '90 minutos', '100 minutos', '120 minutos'],
    correct: 1,
    funfact: 'Un partido de fútbol tiene dos tiempos de 45 minutos. En eliminatorias si hay empate se juegan dos prórrogas de 15 minutos y eventualmente penales.',
  },
  {
    category: 'dep', categoryLabel: 'Deportes',
    question: '¿Quién es el máximo anotador de la historia de la NBA?',
    keywords: ['máximo anotador', 'NBA'],
    options: ['Kareem Abdul-Jabbar', 'Michael Jordan', 'LeBron James', 'Kobe Bryant'],
    correct: 2,
    funfact: 'LeBron James superó a Kareem Abdul-Jabbar como máximo anotador de la NBA en febrero de 2023. Kareem tuvo ese récord 39 años.',
  },
  {
    category: 'dep', categoryLabel: 'Deportes',
    question: '¿Quién ganó el Mundial de Qatar 2022?',
    keywords: ['Copa del Mundo', 'Qatar 2022'],
    options: ['Francia', 'Brasil', 'Croacia', 'Argentina'],
    correct: 3,
    funfact: 'Argentina ganó Qatar 2022 derrotando a Francia en penales (4-2 tras 3-3 en 120 minutos). Fue el tercer título argentino y el primero para Messi, completando su legado.',
  },
  {
    category: 'dep', categoryLabel: 'Deportes',
    question: '¿Qué piloto de Fórmula 1 tiene más campeonatos mundiales?',
    keywords: ['Fórmula 1', 'campeonatos'],
    options: ['Michael Schumacher', 'Ayrton Senna', 'Lewis Hamilton', 'Sebastian Vettel'],
    correct: 2,
    funfact: 'Lewis Hamilton y Michael Schumacher comparten el récord de 7 campeonatos de F1. Hamilton también tiene el récord de más victorias (103) y más poles position en la historia.',
  },
  {
    category: 'dep', categoryLabel: 'Deportes',
    question: '¿Cada cuántos años se celebran los Juegos Olímpicos de verano?',
    keywords: ['Juegos Olímpicos', 'años'],
    options: ['2 años', '3 años', '4 años', '5 años'],
    correct: 2,
    funfact: 'Los Juegos Olímpicos de verano se celebran cada 4 años. Los de Invierno también, pero alternados con los de verano, resultando en unos Juegos cada 2 años.',
  },
  {
    category: 'dep', categoryLabel: 'Deportes',
    question: '¿Cuál es el torneo de ciclismo más famoso del mundo?',
    keywords: ['ciclismo', 'torneo'],
    options: ['Vuelta a España', 'Giro de Italia', 'Tour de France', 'Paris-Roubaix'],
    correct: 2,
    funfact: 'El Tour de France, creado en 1903, es la carrera ciclista más prestigiosa. Dura unas 3 semanas y cubre unos 3.500 km. El líder lleva el mítico maillot amarillo.',
  },
  {
    category: 'dep', categoryLabel: 'Deportes',
    question: '¿Qué deporte practican los "All Blacks"?',
    keywords: ['All Blacks'],
    options: ['Fútbol', 'Rugby', 'Cricket', 'Hockey'],
    correct: 1,
    funfact: 'Los All Blacks de Nueva Zelanda son la selección de rugby más exitosa de la historia. Son famosos por el "Haka", danza guerrera maorí que realizan antes de cada partido.',
  },
  {
    category: 'dep', categoryLabel: 'Deportes',
    question: '¿Qué equipo ganó la primera Copa del Mundo de Fútbol en 1930?',
    keywords: ['primera Copa del Mundo', '1930'],
    options: ['Argentina', 'Brasil', 'Uruguay', 'Italia'],
    correct: 2,
    funfact: 'Uruguay ganó el primer Mundial en 1930 en su propio país, derrotando a Argentina 4-2 en la final. Fue elegido sede al estar celebrando su centenario de independencia.',
  },
  {
    category: 'dep', categoryLabel: 'Deportes',
    question: '¿Cuántos jugadores forman un equipo de rugby (union)?',
    keywords: ['jugadores', 'rugby'],
    options: ['11', '13', '15', '17'],
    correct: 2,
    funfact: 'El rugby union se juega con 15 jugadores por equipo. El rugby fue inventado en 1823 en la escuela de Rugby (Inglaterra), cuando un estudiante tomó el balón con las manos en un partido de fútbol.',
  },
  {
    category: 'dep', categoryLabel: 'Deportes',
    question: '¿Cuántas veces ha ganado España la Eurocopa de fútbol?',
    keywords: ['España', 'Eurocopa'],
    options: ['2', '3', '4', '5'],
    correct: 2,
    funfact: 'España ha ganado 4 Eurocopas: 1964, 2008, 2012 y 2024. Entre 2008 y 2012 logró la hazaña histórica de ganar Eurocopa-Mundial-Eurocopa consecutivamente.',
  },
  {
    category: 'dep', categoryLabel: 'Deportes',
    question: '¿Qué significa "ace" en el tenis?',
    keywords: ['ace', 'tenis'],
    options: ['Una pelota en la red', 'Un saque que el rival no toca', 'Ganar un juego en blanco', 'Un golpe ganador desde el fondo'],
    correct: 1,
    funfact: 'Un "ace" es un saque que el rival no puede tocar y cae dentro del área de servicio. El récord de aces en un partido lo tiene John Isner con 113 en el famoso partido de Wimbledon 2010 contra Mahut.',
  },
  {
    category: 'dep', categoryLabel: 'Deportes',
    question: '¿Cuál es la distancia de un maratón?',
    keywords: ['distancia', 'maratón'],
    options: ['40 km', '40.195 km', '42.195 km', '45 km'],
    correct: 2,
    funfact: 'Un maratón mide exactamente 42.195 km. Esta distancia fue estandarizada en los JJ.OO. de Londres 1908. El récord mundial lo tiene Kelvin Kiptum con 2:00:35, establecido en Chicago 2023.',
  },
  {
    category: 'dep', categoryLabel: 'Deportes',
    question: '¿En qué deporte se usa el término "touchdown"?',
    keywords: ['touchdown'],
    options: ['Rugby', 'Fútbol americano', 'Béisbol', 'Hockey'],
    correct: 1,
    funfact: 'En fútbol americano, un touchdown vale 6 puntos y se logra llevando el balón a la zona de anotación rival. Después se puede intentar un "extra point" (1 punto) pateando o una conversión de 2 puntos.',
  },
  {
    category: 'dep', categoryLabel: 'Deportes',
    question: '¿Quién tiene el récord de los 100 metros lisos con 9.58 segundos?',
    keywords: ['récord mundial', '100 metros'],
    options: ['Asafa Powell', 'Justin Gatlin', 'Usain Bolt', 'Tyson Gay'],
    correct: 2,
    funfact: 'Usain Bolt estableció el récord mundial de 100m con 9.58 segundos en Berlín 2009. También tiene el récord de 200m con 19.19s. Ganó 9 medallas de oro olímpicas y 11 mundiales.',
  },
  {
    category: 'dep', categoryLabel: 'Deportes',
    question: '¿Qué deporte practica Serena Williams?',
    keywords: ['Serena Williams'],
    options: ['Golf', 'Natación', 'Tenis', 'Atletismo'],
    correct: 2,
    funfact: 'Serena Williams ganó 23 títulos de Grand Slam en individual, más que cualquier otro jugador en la Era Abierta. Se retiró en 2022 para dedicarse a su familia y sus negocios.',
  },
  {
    category: 'dep', categoryLabel: 'Deportes',
    question: '¿Cuántos jugadores participan en voleibol por equipo en la cancha?',
    keywords: ['voleibol', 'jugadores'],
    options: ['5', '6', '7', '8'],
    correct: 1,
    funfact: 'En voleibol juegan 6 por equipo. El "líbero" es el especialista defensivo, usa un uniforme de color diferente y tiene reglas especiales como no poder atacar ni bloquear.',
  },
  {
    category: 'dep', categoryLabel: 'Deportes',
    question: '¿Cuál es el club de fútbol más valorado económicamente en el mundo?',
    keywords: ['club', 'más valorado'],
    options: ['FC Barcelona', 'Real Madrid', 'Manchester United', 'Manchester City'],
    correct: 1,
    funfact: 'El Real Madrid regularmente ocupa el primer puesto en los rankings de valoración económica de Forbes, con un valor superior a los 6.000 millones de dólares. El Manchester United fue durante años el club más rico del mundo.',
  },
  {
    category: 'dep', categoryLabel: 'Deportes',
    question: '¿En qué año nació Cristiano Ronaldo?',
    keywords: ['Cristiano Ronaldo', 'nació'],
    options: ['1983', '1984', '1985', '1986'],
    correct: 2,
    funfact: 'Cristiano Ronaldo nació el 5 de febrero de 1985 en Funchal, Madeira, Portugal. Empezó en el Sporting de Lisboa antes de ser fichado por el Manchester United a los 18 años.',
  },
  {
    category: 'dep', categoryLabel: 'Deportes',
    question: '¿Quién ganó el Balón de Oro en 2022?',
    keywords: ['Balón de Oro', '2022'],
    options: ['Kylian Mbappé', 'Vinicius Jr.', 'Karim Benzema', 'Erling Haaland'],
    correct: 2,
    funfact: 'Benzema ganó el Balón de Oro 2022 tras una temporada extraordinaria en el Real Madrid, siendo clave para ganar Champions y Liga. Fue el primer francés en ganarlo desde Zidane en 1998.',
  },
  {
    category: 'dep', categoryLabel: 'Deportes',
    question: '¿Qué significa "hat-trick" en el fútbol?',
    keywords: ['hat-trick', 'fútbol'],
    options: ['Tres asistencias en un partido', 'Tres goles en el mismo partido', 'Tres tarjetas amarillas', 'Tres penales fallados'],
    correct: 1,
    funfact: 'Un "hat-trick" son 3 goles de un mismo jugador en un partido. El término viene del críquet. Messi y Ronaldo acumulan decenas de hat-tricks a lo largo de sus carreras.',
  },
  {
    category: 'dep', categoryLabel: 'Deportes',
    question: '¿Cuántas veces jugó Pelé la Copa del Mundo?',
    keywords: ['Pelé', 'Copa del Mundo'],
    options: ['2', '3', '4', '5'],
    correct: 2,
    funfact: 'Pelé jugó 4 Copas del Mundo (1958, 1962, 1966 y 1970) y ganó 3 de ellas. Se convirtió en el único jugador en ganar 3 Mundiales. Marcó su primer gol mundialista a los 17 años en la final de 1958.',
  },
  {
    category: 'dep', categoryLabel: 'Deportes',
    question: '¿Cuál es el récord de goles en una sola edición del Mundial?',
    keywords: ['récord goles', 'Mundial'],
    options: ['Just Fontaine con 13 (1958)', 'Gerd Müller con 10 (1970)', 'Ronaldo con 8 (2002)', 'Klose con 8 (2006)'],
    correct: 0,
    funfact: 'Just Fontaine anotó 13 goles para Francia en el Mundial de Suecia 1958, siendo el récord de goles en un solo torneo que nadie ha podido superar en más de 65 años. Francia quedó tercera en ese torneo.',
  },
];

// ============================================================
// 2. CONFIGURATION & STATE
// ============================================================
const AVATARS = ['🧑', '👩', '🦸', '🧙', '🤖', '👾', '🦊', '🐉', '🎮', '🚀', '🧠', '🏆'];

const CATEGORIES = [
  { id: 'all',  label: 'Todas',       icon: 'fa-globe' },
  { id: 'geo',  label: 'Geografía',   icon: 'fa-map-location-dot' },
  { id: 'hist', label: 'Historia',    icon: 'fa-landmark' },
  { id: 'sci',  label: 'Ciencia',     icon: 'fa-flask' },
  { id: 'art',  label: 'Arte',        icon: 'fa-palette' },
  { id: 'pop',  label: 'Cultura Pop', icon: 'fa-star' },
  { id: 'dep',  label: 'Deportes',    icon: 'fa-futbol' },
];

const DIFFICULTIES = [
  { id: 'normal',    label: 'Normal',    seconds: 15, basePoints: 100, icon: 'fa-leaf' },
  { id: 'pro',       label: 'Pro',       seconds: 10, basePoints: 200, icon: 'fa-bolt' },
  { id: 'relampago', label: 'Relámpago', seconds: 5,  basePoints: 350, icon: 'fa-fire' },
];

const RANKS = [
  { min: 0,    title: '🔰 Novato Curioso' },
  { min: 300,  title: '📚 Aprendiz Ágil' },
  { min: 600,  title: '🧠 Mente Despierta' },
  { min: 1000, title: '⭐ Sabio Ilustrado' },
  { min: 1500, title: '🌟 Mente Brillante' },
  { min: 2000, title: '💎 Gran Maestro' },
  { min: 2500, title: '🏆 Leyenda de la Cultura General' },
];

const CATEGORY_CSS = {
  all:  'cat-all',
  geo:  'cat-geo',
  hist: 'cat-hist',
  sci:  'cat-sci',
  art:  'cat-art',
  pop:  'cat-pop',
  dep:  'cat-dep',
};

let gameState = {};
let timerInterval = null;
let funfactTimeout = null;
let nextQuestionTimeout = null;
let audioCtx = null;
let isMuted = false;
let particleInterval = null;

// ============================================================
// 3. DOM REFERENCES
// ============================================================
const $ = (id) => document.getElementById(id);

const DOM = {
  screenStart:    $('screen-start'),
  screenGame:     $('screen-game'),
  screenResults:  $('screen-results'),

  // Start screen
  playerName:       $('player-name'),
  avatarGrid:       $('avatar-grid'),
  categoryGrid:     $('category-grid'),
  difficultyGrid:   $('difficulty-grid'),
  btnPlay:          $('btn-play'),
  leaderboardStart: $('leaderboard-start'),

  // Game screen
  questionLabel:         $('question-label'),
  progressBar:           $('progress-bar'),
  playerAvatarDisplay:   $('player-avatar-display'),
  playerNameDisplay:     $('player-name-display'),
  scoreBadge:            $('score-badge'),
  scoreDisplay:          $('score-display'),
  streakDisplay:         $('streak-display'),
  streakCount:           $('streak-count'),
  statCorrect:           $('stat-correct'),
  statWrong:             $('stat-wrong'),
  statStreak:            $('stat-streak'),
  questionCategoryBadge: $('question-category-badge'),
  difficultyBadge:       $('difficulty-badge'),
  questionText:          $('question-text'),
  optionsGrid:           $('options-grid'),
  funfactCard:           $('funfact-card'),
  funfactText:           $('funfact-text'),
  funfactCountdown:      $('funfact-countdown'),
  btnNext:               $('btn-next'),
  timerRing:             $('timer-ring'),
  timerNumber:           $('timer-number'),
  speedStars:            $('speed-stars'),
  btnFifty:              $('btn-fifty'),
  btnTime:               $('btn-time'),
  btnMute:               $('btn-mute'),
  muteIcon:              $('mute-icon'),

  // Results screen
  rankTitle:          $('rank-title'),
  resScore:           $('res-score'),
  resAccuracy:        $('res-accuracy'),
  resStreak:          $('res-streak'),
  resTime:            $('res-time'),
  leaderboardResults: $('leaderboard-results'),
  btnShare:           $('btn-share'),
  btnReplay:          $('btn-replay'),

  // Shared
  scorePopup: $('score-popup'),

  // Exit modal
  exitModal:         $('exit-modal'),
  exitScorePreview:  $('exit-score-preview'),
  btnExitGame:       $('btn-exit-game'),
  btnExitCancel:     $('btn-exit-cancel'),
  btnExitConfirm:    $('btn-exit-confirm'),
  exitModalOverlay:  $('exit-modal-overlay'),
};

// ============================================================
// 4. AUDIO ENGINE (Web Audio API — no external files)
// ============================================================
function ensureAudioCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  // Resume if suspended (browser autoplay policy)
  if (audioCtx.state === 'suspended') audioCtx.resume();
}

function playTone({ frequency = 440, type = 'sine', duration = 0.2, gain = 0.3, delay = 0 } = {}) {
  if (isMuted) return;
  ensureAudioCtx();
  const now = audioCtx.currentTime + delay;
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, now);
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(gain, now + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
  osc.start(now);
  osc.stop(now + duration + 0.01);
}

function playTick() {
  playTone({ frequency: 800, type: 'square', duration: 0.04, gain: 0.08 });
}

function playCorrect() {
  // Ascending happy chord
  playTone({ frequency: 523.25, type: 'sine', duration: 0.15, gain: 0.25, delay: 0.00 });
  playTone({ frequency: 659.25, type: 'sine', duration: 0.15, gain: 0.25, delay: 0.10 });
  playTone({ frequency: 783.99, type: 'sine', duration: 0.25, gain: 0.30, delay: 0.20 });
  playTone({ frequency: 1046.5, type: 'sine', duration: 0.30, gain: 0.25, delay: 0.30 });
}

function playWrong() {
  // Descending failure sound
  playTone({ frequency: 330, type: 'sawtooth', duration: 0.15, gain: 0.2, delay: 0.00 });
  playTone({ frequency: 220, type: 'sawtooth', duration: 0.20, gain: 0.2, delay: 0.15 });
  playTone({ frequency: 146.83, type: 'sawtooth', duration: 0.30, gain: 0.15, delay: 0.30 });
}

function playFanfare() {
  // Victory fanfare sequence
  const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5, 1568.0];
  notes.forEach((freq, i) => {
    playTone({ frequency: freq, type: 'sine', duration: 0.2, gain: 0.3, delay: i * 0.12 });
  });
  // Harmony layer
  [659.25, 783.99, 987.77, 1318.5].forEach((freq, i) => {
    playTone({ frequency: freq, type: 'triangle', duration: 0.25, gain: 0.15, delay: 0.72 + i * 0.1 });
  });
}

function playTimeout() {
  playTone({ frequency: 200, type: 'sawtooth', duration: 0.4, gain: 0.25 });
  playTone({ frequency: 150, type: 'sawtooth', duration: 0.5, gain: 0.2, delay: 0.35 });
}

function toggleMute() {
  isMuted = !isMuted;
  DOM.muteIcon.className = isMuted
    ? 'fa-solid fa-volume-xmark'
    : 'fa-solid fa-volume-high';
  DOM.btnMute.style.color = isMuted ? 'var(--neon-red)' : '';
}

// ============================================================
// 5. PARTICLE SYSTEM
// ============================================================
const canvas = $('particles-canvas');
const ctx2d = canvas ? canvas.getContext('2d') : null;
let particles = [];

function resizeCanvas() {
  if (!canvas) return;
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createParticle() {
  return {
    x: Math.random() * canvas.width,
    y: canvas.height + 10,
    size: Math.random() * 2 + 0.5,
    speedY: -(Math.random() * 0.6 + 0.2),
    speedX: (Math.random() - 0.5) * 0.3,
    opacity: Math.random() * 0.4 + 0.1,
    color: Math.random() > 0.6
      ? 'rgba(0,245,255,'
      : Math.random() > 0.5
        ? 'rgba(0,150,255,'
        : 'rgba(255,215,0,',
  };
}

function animateParticles() {
  if (!canvas || !ctx2d) return;
  ctx2d.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p, i) => {
    p.y += p.speedY;
    p.x += p.speedX;
    if (p.y < -10) { particles[i] = createParticle(); return; }

    ctx2d.beginPath();
    ctx2d.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx2d.fillStyle = p.color + p.opacity + ')';
    ctx2d.fill();
  });

  requestAnimationFrame(animateParticles);
}

function initParticles() {
  resizeCanvas();
  particles = Array.from({ length: 80 }, createParticle);
  animateParticles();
}

window.addEventListener('resize', resizeCanvas);

// ============================================================
// 6. LEADERBOARD (Firebase Realtime Database + LocalStorage Fallback)
// ============================================================
const firebaseConfig = {
  apiKey: "AIzaSyByLu75xLmTH9gM0NEUglTYcRwzi1Q19so",
  authDomain: "cultura-general-pro.firebaseapp.com",
  databaseURL: "https://cultura-general-pro-default-rtdb.firebaseio.com",
  projectId: "cultura-general-pro",
  storageBucket: "cultura-general-pro.firebasestorage.app",
  messagingSenderId: "670535256430",
  appId: "1:670535256430:web:ffd43ad4079e3039bf197f"
};

let db = null;
let globalLeaderboard = [];
const LS_KEY = 'cgpro_leaderboard';

// Initialize Firebase
try {
  if (typeof firebase !== 'undefined') {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    db = firebase.database();
    console.log("Firebase Realtime Database conectada con éxito.");
  }
} catch (err) {
  console.warn("No se pudo iniciar Firebase, usando LocalStorage:", err);
}

function loadLocalLeaderboard() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY)) || [];
  } catch { return []; }
}

function sanitizeKey(str) {
  return (str || 'jugador').toLowerCase().trim().replace(/[.#$\[\]\/]/g, '_');
}

// Guarda o suma puntos en Firebase en la nube
function saveToLeaderboard(entry) {
  // 1. Guardar localmente
  let localLb = loadLocalLeaderboard();
  localLb.push(entry);
  localLb.sort((a, b) => b.score - a.score);
  localLb = localLb.slice(0, 10);
  localStorage.setItem(LS_KEY, JSON.stringify(localLb));

  // 2. Guardar en Firebase (Nube pública compartida)
  if (db) {
    const playerKey = sanitizeKey(entry.name);
    const playerRef = db.ref('players/' + playerKey);

    playerRef.transaction((current) => {
      if (!current) {
        return {
          name: entry.name,
          avatar: entry.avatar || '🧑',
          totalScore: entry.score,
          bestScore: entry.score,
          gamesPlayed: 1,
          accuracy: entry.accuracy || 0,
          streak: entry.streak || 0,
          diff: entry.diff || 'Normal',
          lastDate: entry.date || new Date().toLocaleDateString('es-ES')
        };
      } else {
        // Se acumulan los puntos ganados para el jugador
        current.totalScore = (current.totalScore || 0) + entry.score;
        if (entry.score > (current.bestScore || 0)) {
          current.bestScore = entry.score;
        }
        current.gamesPlayed = (current.gamesPlayed || 0) + 1;
        current.avatar = entry.avatar || current.avatar;
        current.accuracy = Math.round(((current.accuracy || entry.accuracy) + entry.accuracy) / 2);
        if ((entry.streak || 0) > (current.streak || 0)) {
          current.streak = entry.streak;
        }
        current.lastDate = entry.date || new Date().toLocaleDateString('es-ES');
        return current;
      }
    }, (error, committed) => {
      if (error) {
        console.error("Error al guardar en Firebase:", error);
      } else if (committed) {
        console.log("Puntaje guardado y sumado en Firebase.");
      }
    });
  }
  return localLb;
}

// Escuchar cambios en vivo en Firebase para actualizar la tabla de todos los celulares
function initRealtimeLeaderboard() {
  if (!db) {
    globalLeaderboard = loadLocalLeaderboard();
    updateAllLeaderboardViews();
    return;
  }

  db.ref('players').on('value', (snapshot) => {
    const data = snapshot.val();
    if (!data) {
      globalLeaderboard = [];
    } else {
      globalLeaderboard = Object.values(data).map(p => ({
        name: p.name || 'Anónimo',
        avatar: p.avatar || '🧑',
        score: p.totalScore || p.bestScore || 0,
        accuracy: p.accuracy || 0,
        streak: p.streak || 0,
        diff: p.diff || 'Pro',
        date: p.lastDate || '',
        gamesPlayed: p.gamesPlayed || 1
      }));
      // Ordenar de mayor a menor puntaje
      globalLeaderboard.sort((a, b) => b.score - a.score);
      globalLeaderboard = globalLeaderboard.slice(0, 10);
    }
    updateAllLeaderboardViews();
  }, (err) => {
    console.warn("Error leyendo de Firebase, usando fallback local:", err);
    globalLeaderboard = loadLocalLeaderboard();
    updateAllLeaderboardViews();
  });
}

function updateAllLeaderboardViews() {
  if (DOM.leaderboardStart) {
    renderLeaderboard(DOM.leaderboardStart);
  }
  if (DOM.leaderboardResults && !DOM.screenResults.classList.contains('hidden')) {
    renderLeaderboard(DOM.leaderboardResults, gameState.score, gameState.player);
  }
}

function renderLeaderboard(container, currentScore = null, currentName = null) {
  const lb = (globalLeaderboard && globalLeaderboard.length) ? globalLeaderboard : loadLocalLeaderboard();
  
  if (!lb.length) {
    container.innerHTML = `<p class="text-center text-slate-500 text-xs font-poppins py-4">Aún no hay puntuaciones en la nube. ¡Sé el primero en jugar!</p>`;
    return;
  }

  const medals = ['🥇', '🥈', '🥉'];
  container.innerHTML = lb.map((entry, i) => {
    const isNew = currentName !== null && 
                  entry.name.toLowerCase().trim() === currentName.toLowerCase().trim();

    const scoreColor = i === 0
      ? 'neon-text-gold'
      : i === 1
        ? 'text-slate-300'
        : i === 2
          ? 'text-amber-500'
          : 'text-slate-400';

    const rankDisplay = i < 3
      ? `<span class="text-lg">${medals[i]}</span>`
      : `<span class="lb-rank text-slate-500">#${i + 1}</span>`;

    const gamesBadge = entry.gamesPlayed && entry.gamesPlayed > 1
      ? `<span class="text-xs px-1.5 py-0.5 rounded text-slate-400 bg-slate-800/80 font-mono">${entry.gamesPlayed} partidas</span>`
      : '';

    const newBadge = isNew
      ? `<span class="text-xs px-2 py-0.5 rounded-full font-black" style="background:rgba(255,215,0,0.15);border:1px solid rgba(255,215,0,0.5);color:var(--neon-gold);">✨ TÚ</span>`
      : '';

    return `
      <div class="lb-row ${isNew ? 'highlight' : ''}" style="${isNew ? 'animation: correctPulse 0.6s ease-out;' : ''}">
        <div class="flex items-center gap-2 min-w-[36px]">${rankDisplay}</div>
        <span class="text-lg">${entry.avatar || '🧑'}</span>
        <div class="flex-1 min-w-0">
          <p class="lb-name truncate ${isNew ? 'text-white font-bold' : ''}">${escapeHtml(entry.name)}</p>
          <div class="flex items-center gap-2 mt-0.5">${gamesBadge}</div>
        </div>
        <div class="text-right shrink-0">
          <p class="lb-score ${scoreColor}">${(entry.score || 0).toLocaleString()} PTS</p>
          <p class="text-xs text-slate-500">${entry.accuracy}%</p>
        </div>
        ${newBadge}
      </div>`;
  }).join('');
}

// ============================================================
// 7. START SCREEN INITIALIZATION
// ============================================================
function initStartScreen() {
  // Build avatar grid
  DOM.avatarGrid.innerHTML = AVATARS.map((av, i) =>
    `<button class="avatar-option ${i === 0 ? 'selected' : ''}" data-index="${i}" data-avatar="${av}" title="Avatar ${i + 1}">${av}</button>`
  ).join('');

  DOM.avatarGrid.querySelectorAll('.avatar-option').forEach(btn => {
    btn.addEventListener('click', () => {
      DOM.avatarGrid.querySelectorAll('.avatar-option').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });

  // Build category chips
  DOM.categoryGrid.innerHTML = CATEGORIES.map((cat, i) =>
    `<button class="category-chip ${i === 0 ? 'selected' : ''}" data-cat="${cat.id}">
       <i class="fa-solid ${cat.icon} mr-1"></i>${cat.label}
     </button>`
  ).join('');

  DOM.categoryGrid.querySelectorAll('.category-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      DOM.categoryGrid.querySelectorAll('.category-chip').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });

  // Build difficulty chips
  DOM.difficultyGrid.innerHTML = DIFFICULTIES.map((d, i) =>
    `<button class="difficulty-chip ${i === 1 ? 'selected-pro' : ''}" data-diff="${d.id}">
       <i class="fa-solid ${d.icon} mr-1"></i>${d.label}<br/>
       <small class="opacity-70">${d.seconds}s / pregunta</small>
     </button>`
  ).join('');

  DOM.difficultyGrid.querySelectorAll('.difficulty-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      DOM.difficultyGrid.querySelectorAll('.difficulty-chip').forEach(b => {
        b.classList.remove('selected-normal', 'selected-pro', 'selected-relampago');
      });
      const classMap = { normal: 'selected-normal', pro: 'selected-pro', relampago: 'selected-relampago' };
      btn.classList.add(classMap[btn.dataset.diff]);
    });
  });

  // Render leaderboard
  renderLeaderboard(DOM.leaderboardStart);

  // Play button
  DOM.btnPlay.addEventListener('click', startGame);
}

// ============================================================
// 8. GAME INITIALIZATION
// ============================================================
function getSelectedConfig() {
  const selectedAvatar = DOM.avatarGrid.querySelector('.avatar-option.selected');
  const selectedCat    = DOM.categoryGrid.querySelector('.category-chip.selected');
  const selectedDiff   = DOM.difficultyGrid.querySelector('.difficulty-chip');
  let activeDiff       = DOM.difficultyGrid.querySelector('.difficulty-chip.selected-normal') ||
                         DOM.difficultyGrid.querySelector('.difficulty-chip.selected-pro') ||
                         DOM.difficultyGrid.querySelector('.difficulty-chip.selected-relampago') ||
                         selectedDiff;

  const name     = DOM.playerName.value.trim() || 'Jugador';
  const avatar   = selectedAvatar ? selectedAvatar.dataset.avatar : '🧑';
  const category = selectedCat ? selectedCat.dataset.cat : 'all';
  const diffId   = activeDiff ? activeDiff.dataset.diff : 'pro';
  const diff     = DIFFICULTIES.find(d => d.id === diffId) || DIFFICULTIES[1];

  return { name, avatar, category, diff };
}

function getQuestions(category, count = 10) {
  let pool = category === 'all'
    ? [...QUESTION_BANK]
    : QUESTION_BANK.filter(q => q.category === category);

  // If not enough questions in category, pad with other categories
  if (pool.length < count) {
    const extras = QUESTION_BANK.filter(q => q.category !== category);
    pool = pool.concat(extras);
  }

  // Shuffle and pick
  return pool
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
}

function startGame() {
  ensureAudioCtx(); // Unlock audio on user gesture

  const config = getSelectedConfig();
  const questions = getQuestions(config.category);

  gameState = {
    player:         config.name,
    avatar:         config.avatar,
    category:       config.category,
    diff:           config.diff,
    questions:      questions,
    currentIndex:   0,
    score:          0,
    correct:        0,
    wrong:          0,
    streak:         0,
    maxStreak:      0,
    timePerQ:       [],
    lifelinesFifty: 1,
    lifelinesTime:  1,
    answered:       false,
    timeLeft:       config.diff.seconds,
  };

  // Update profile UI
  DOM.playerAvatarDisplay.textContent = config.avatar;
  DOM.playerNameDisplay.textContent   = config.name;
  DOM.difficultyBadge.textContent     = config.diff.label;

  // Reset lifeline buttons
  DOM.btnFifty.disabled = false;
  DOM.btnFifty.classList.remove('opacity-30');
  DOM.btnTime.disabled  = false;
  DOM.btnTime.classList.remove('opacity-30');

  showScreen('game');
  loadQuestion();
}

// ============================================================
// 9. QUESTION LOADER
// ============================================================
function loadQuestion() {
  clearIntervals();
  DOM.funfactCard.classList.add('hidden');

  const q = gameState.questions[gameState.currentIndex];
  const total = gameState.questions.length;
  const idx   = gameState.currentIndex;

  // Header
  DOM.questionLabel.textContent = `Pregunta ${idx + 1} de ${total}`;
  DOM.progressBar.style.width   = `${(idx / total) * 100}%`;

  // Category badge
  DOM.questionCategoryBadge.textContent = q.categoryLabel;
  DOM.questionCategoryBadge.className   = `category-badge text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${CATEGORY_CSS[q.category] || 'cat-all'}`;

  // Question text with keyword highlights
  DOM.questionText.innerHTML = highlightKeywords(q.question, q.keywords);

  // Options
  const optBtns = DOM.optionsGrid.querySelectorAll('.option-btn');
  const letters = ['A', 'B', 'C', 'D'];
  optBtns.forEach((btn, i) => {
    btn.disabled = false;
    btn.className = 'option-btn';
    btn.querySelector('.option-letter').textContent = letters[i];
    btn.querySelector('.option-text').textContent   = q.options[i];
    btn.dataset.index = i;
  });

  // Reset timer
  gameState.answered = false;
  gameState.timeLeft = gameState.diff.seconds;
  updateTimerUI(gameState.timeLeft, gameState.diff.seconds);
  updateSpeedStars(gameState.timeLeft, gameState.diff.seconds);

  // Start timer
  startTimer();
}

function highlightKeywords(text, keywords) {
  if (!keywords || !keywords.length) return escapeHtml(text);
  let result = escapeHtml(text);
  keywords.forEach(kw => {
    const regex = new RegExp(`(${escapeRegex(kw)})`, 'gi');
    result = result.replace(regex, '<span class="kw-highlight">$1</span>');
  });
  return result;
}

// ============================================================
// 10. TIMER
// ============================================================
function startTimer() {
  const total = gameState.diff.seconds;
  let elapsed = 0;

  timerInterval = setInterval(() => {
    if (gameState.answered) return;
    gameState.timeLeft--;
    elapsed++;

    updateTimerUI(gameState.timeLeft, total);
    updateSpeedStars(gameState.timeLeft, total);

    if (gameState.timeLeft > 0) {
      // Only tick for the last 5 seconds or relampago mode
      if (gameState.timeLeft <= 5 || gameState.diff.id === 'relampago') {
        playTick();
      }
    } else {
      // Time's up
      clearIntervals();
      onTimeout();
    }
  }, 1000);
}

function updateTimerUI(timeLeft, total) {
  DOM.timerNumber.textContent = String(timeLeft).padStart(2, '0');

  const fraction = timeLeft / total;
  const circumference = 2 * Math.PI * 52; // r=52
  DOM.timerRing.style.strokeDashoffset = circumference * (1 - fraction);

  // Color transitions
  DOM.timerRing.classList.remove('timer-ok', 'timer-warn', 'timer-danger');
  if (timeLeft <= 3) {
    DOM.timerRing.classList.add('timer-danger');
    DOM.timerNumber.className = 'text-4xl font-black leading-none neon-text-red';
  } else if (timeLeft <= Math.ceil(total * 0.4)) {
    DOM.timerRing.classList.add('timer-warn');
    DOM.timerNumber.className = 'text-4xl font-black leading-none neon-text-gold';
  } else {
    DOM.timerRing.classList.add('timer-ok');
    DOM.timerNumber.className = 'text-4xl font-black leading-none neon-text-gold';
  }
}

function updateSpeedStars(timeLeft, total) {
  const stars = DOM.speedStars.querySelectorAll('.fa-star');
  const fraction = timeLeft / total;
  const lit = fraction > 0.65 ? 3 : fraction > 0.33 ? 2 : 1;
  stars.forEach((s, i) => {
    s.style.color = i < lit ? 'var(--neon-gold)' : 'rgba(100,100,100,0.3)';
  });
}

function clearIntervals() {
  if (timerInterval)    { clearInterval(timerInterval); timerInterval = null; }
  if (funfactTimeout)   { clearTimeout(funfactTimeout);  funfactTimeout = null; }
  if (nextQuestionTimeout) { clearTimeout(nextQuestionTimeout); nextQuestionTimeout = null; }
}

// ============================================================
// 11. ANSWER HANDLING
// ============================================================
DOM.optionsGrid.addEventListener('click', (e) => {
  const btn = e.target.closest('.option-btn');
  if (!btn || gameState.answered || btn.disabled) return;
  handleAnswer(parseInt(btn.dataset.index, 10));
});

function handleAnswer(selectedIndex) {
  if (gameState.answered) return;
  gameState.answered = true;
  clearIntervals();

  const q = gameState.questions[gameState.currentIndex];
  const timeUsed = gameState.diff.seconds - gameState.timeLeft;
  const isCorrect = selectedIndex === q.correct;

  // Record time
  gameState.timePerQ.push(timeUsed);

  // Mark options
  const optBtns = DOM.optionsGrid.querySelectorAll('.option-btn');
  optBtns.forEach(btn => { btn.disabled = true; });

  if (isCorrect) {
    optBtns[selectedIndex].classList.add('correct');
    handleCorrect(timeUsed);
  } else {
    optBtns[selectedIndex].classList.add('incorrect');
    optBtns[q.correct].classList.add('correct');
    handleWrong();
  }

  // Show fun fact
  showFunfact(q.funfact);
}

function handleCorrect(timeUsed) {
  playCorrect();
  gameState.correct++;
  gameState.streak++;

  if (gameState.streak > gameState.maxStreak) {
    gameState.maxStreak = gameState.streak;
  }

  // Calculate points
  const base     = gameState.diff.basePoints;
  const speedPct = Math.max(0, 1 - (timeUsed / gameState.diff.seconds));
  const speedBonus = Math.round(base * 0.5 * speedPct);
  let multiplier = 1;

  if (gameState.streak >= 3) {
    multiplier = Math.min(3, 1 + Math.floor(gameState.streak / 3) * 0.5);
  }

  const points = Math.round((base + speedBonus) * multiplier);
  gameState.score += points;

  // Update streak UI
  updateStreakUI();

  // Update score with animation
  animateScore(points);
  updateScoreDisplay();

  // Mini confetti
  fireSmallConfetti();

  // Update stats
  DOM.statCorrect.textContent = gameState.correct;
}

function handleWrong() {
  playWrong();
  gameState.wrong++;
  gameState.streak = 0;
  updateStreakUI();
  DOM.statWrong.textContent = gameState.wrong;

  // Shake screen briefly
  DOM.screenGame.style.animation = 'none';
  requestAnimationFrame(() => {
    DOM.screenGame.style.animation = '';
  });
}

function onTimeout() {
  if (gameState.answered) return;
  gameState.answered = true;
  playTimeout();

  const q = gameState.questions[gameState.currentIndex];
  const optBtns = DOM.optionsGrid.querySelectorAll('.option-btn');
  optBtns.forEach(btn => { btn.disabled = true; });
  optBtns[q.correct].classList.add('correct');

  gameState.wrong++;
  gameState.streak = 0;
  updateStreakUI();
  DOM.statWrong.textContent = gameState.wrong;

  showFunfact(q.funfact);
}

// ============================================================
// 12. SCORE & STREAK UI
// ============================================================
function updateScoreDisplay() {
  DOM.scoreDisplay.textContent = `${gameState.score.toLocaleString()} PTS`;
  DOM.scoreBadge.classList.remove('score-bump');
  requestAnimationFrame(() => DOM.scoreBadge.classList.add('score-bump'));
}

function updateStreakUI() {
  DOM.statStreak.textContent = gameState.maxStreak;

  if (gameState.streak >= 3) {
    const multiplier = Math.min(3, 1 + Math.floor(gameState.streak / 3) * 0.5).toFixed(1);
    DOM.streakDisplay.classList.remove('hidden');
    DOM.streakCount.textContent = `x${multiplier}`;
    DOM.streakDisplay.classList.remove('streak-fire');
    requestAnimationFrame(() => DOM.streakDisplay.classList.add('streak-fire'));
  } else {
    DOM.streakDisplay.classList.add('hidden');
  }
}

function animateScore(points) {
  const popup = DOM.scorePopup;
  popup.textContent = `+${points}`;

  // Position near score badge
  const badge  = DOM.scoreBadge.getBoundingClientRect();
  popup.style.left = `${badge.left + badge.width / 2}px`;
  popup.style.top  = `${badge.top}px`;
  popup.style.transform = 'translateX(-50%)';
  popup.classList.remove('hidden');

  popup.style.animation = 'none';
  requestAnimationFrame(() => {
    popup.style.animation = 'popupFloat 1.4s ease-out forwards';
  });

  setTimeout(() => popup.classList.add('hidden'), 1500);
}

// ============================================================
// 13. FUN FACT & NEXT QUESTION
// ============================================================
function showFunfact(text) {
  DOM.funfactText.textContent = text;
  DOM.funfactCard.classList.remove('hidden');

  let countdown = 4;
  DOM.funfactCountdown.textContent = `Siguiente en ${countdown}s...`;

  const tick = () => {
    countdown--;
    if (countdown > 0) {
      DOM.funfactCountdown.textContent = `Siguiente en ${countdown}s...`;
      funfactTimeout = setTimeout(tick, 1000);
    } else {
      advanceQuestion();
    }
  };

  funfactTimeout = setTimeout(tick, 1000);
  DOM.btnNext.onclick = () => {
    clearIntervals();
    advanceQuestion();
  };
}

function advanceQuestion() {
  DOM.funfactCard.classList.add('hidden');
  gameState.currentIndex++;

  if (gameState.currentIndex >= gameState.questions.length) {
    endGame();
  } else {
    // Small delay for transition
    nextQuestionTimeout = setTimeout(loadQuestion, 300);
  }
}

// ============================================================
// 14. LIFELINES
// ============================================================
DOM.btnFifty.addEventListener('click', () => {
  if (gameState.answered || gameState.lifelinesFifty <= 0) return;
  gameState.lifelinesFifty--;
  DOM.btnFifty.disabled = true;

  const q = gameState.questions[gameState.currentIndex];
  const optBtns = Array.from(DOM.optionsGrid.querySelectorAll('.option-btn'));

  // Find wrong answers to eliminate (2 of the 3 wrong ones)
  const wrongIndices = [0, 1, 2, 3].filter(i => i !== q.correct);
  const toEliminate = wrongIndices.sort(() => Math.random() - 0.5).slice(0, 2);

  toEliminate.forEach(i => {
    optBtns[i].classList.add('eliminated');
    optBtns[i].disabled = true;
  });

  playTone({ frequency: 440, type: 'sine', duration: 0.1, gain: 0.2 });
  playTone({ frequency: 330, type: 'sine', duration: 0.1, gain: 0.2, delay: 0.12 });
});

DOM.btnTime.addEventListener('click', () => {
  if (gameState.answered || gameState.lifelinesTime <= 0) return;
  gameState.lifelinesTime--;
  DOM.btnTime.disabled = true;

  gameState.timeLeft = Math.min(gameState.timeLeft + 5, gameState.diff.seconds + 5);
  updateTimerUI(gameState.timeLeft, gameState.diff.seconds);

  playTone({ frequency: 660, type: 'sine', duration: 0.15, gain: 0.2 });
  playTone({ frequency: 880, type: 'sine', duration: 0.2,  gain: 0.2, delay: 0.15 });
});

// ============================================================
// 15. END GAME & RESULTS
// ============================================================
function buildEntry(incomplete = false) {
  const totalQ   = gameState.questions.length;
  const answered = gameState.correct + gameState.wrong;
  const accuracy = answered > 0 ? Math.round((gameState.correct / answered) * 100) : 0;
  return {
    name:       gameState.player,
    avatar:     gameState.avatar,
    score:      gameState.score,
    accuracy:   accuracy,
    streak:     gameState.maxStreak,
    diff:       gameState.diff.label,
    date:       new Date().toLocaleDateString('es-ES'),
    incomplete: incomplete,
  };
}

function endGame(incomplete = false) {
  clearIntervals();
  if (!incomplete) playFanfare();

  // Progress bar to 100%
  DOM.progressBar.style.width = '100%';

  // Calculate stats
  const entry    = buildEntry(incomplete);
  const avgTime  = gameState.timePerQ.length
    ? Math.round(gameState.timePerQ.reduce((a, b) => a + b, 0) / gameState.timePerQ.length)
    : 0;
  const rank = getRank(gameState.score);

  // Save to leaderboard
  saveToLeaderboard(entry);

  // Update results screen
  DOM.rankTitle.textContent   = incomplete ? '🏃 Partida Interrumpida' : rank;
  DOM.resScore.textContent    = gameState.score.toLocaleString();
  DOM.resAccuracy.textContent = `${entry.accuracy}%`;
  DOM.resStreak.textContent   = gameState.maxStreak;
  DOM.resTime.textContent     = `${avgTime}s`;

  renderLeaderboard(DOM.leaderboardResults, gameState.score, gameState.player);

  showScreen('results');

  // Confetti (only full game)
  if (!incomplete) setTimeout(() => fireConfetti(), 400);
  else {
    // Small confetti for partial
    setTimeout(() => confetti({ particleCount: 40, spread: 70, origin: { y: 0.5 }, colors: ['#ffd700','#00f5ff'], zIndex: 9999 }), 400);
  }

  // Share button
  DOM.btnShare.onclick = () => shareResult(rank, entry.accuracy);
  DOM.btnReplay.onclick = () => {
    showScreen('start');
    renderLeaderboard(DOM.leaderboardStart);
  };
}

function getRank(score) {
  let rank = RANKS[0].title;
  for (const r of RANKS) {
    if (score >= r.min) rank = r.title;
  }
  return rank;
}

function shareResult(rank, accuracy) {
  const text = `🎮 ¡Acabo de jugar CULTURA GENERAL PRO!\n\n` +
    `🏆 Rango: ${rank}\n` +
    `⭐ Puntos: ${gameState.score.toLocaleString()} PTS\n` +
    `🎯 Precisión: ${accuracy}%\n` +
    `🔥 Racha máx.: ${gameState.maxStreak}\n` +
    `💪 Dificultad: ${gameState.diff.label}\n\n` +
    `¿Puedes superarme? 🧠`;

  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      DOM.btnShare.innerHTML = '<i class="fa-solid fa-check mr-2 text-neon-green"></i>¡Copiado!';
      setTimeout(() => {
        DOM.btnShare.innerHTML = '<i class="fa-solid fa-share-nodes mr-2"></i>Compartir';
      }, 2500);
    }).catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity  = '0';
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
  alert('Resultado copiado al portapapeles');
}

// ============================================================
// 16. CONFETTI
// ============================================================
function fireConfetti() {
  const duration = 3500;
  const end = Date.now() + duration;

  const colors = ['#00f5ff', '#ffd700', '#39ff14', '#ff073a', '#ffffff'];

  (function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      colors,
      zIndex: 9999,
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      colors,
      zIndex: 9999,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

function fireSmallConfetti() {
  const badge = DOM.scoreBadge.getBoundingClientRect();
  confetti({
    particleCount: 20,
    spread: 50,
    origin: {
      x: (badge.left + badge.width / 2) / window.innerWidth,
      y: (badge.top + badge.height / 2) / window.innerHeight,
    },
    colors: ['#00f5ff', '#ffd700', '#39ff14'],
    scalar: 0.7,
    zIndex: 9999,
  });
}

// ============================================================
// 17. MUTE BUTTON
// ============================================================
DOM.btnMute.addEventListener('click', toggleMute);

// ============================================================
// 17b. EXIT MODAL
// ============================================================
function openExitModal() {
  if (!gameState.diff) return; // not in game
  DOM.exitScorePreview.textContent = `${gameState.score.toLocaleString()} PTS`;
  DOM.exitModal.classList.remove('hidden');
}

function closeExitModal() {
  DOM.exitModal.classList.add('hidden');
}

DOM.btnExitGame.addEventListener('click', openExitModal);
DOM.btnExitCancel.addEventListener('click', closeExitModal);
DOM.exitModalOverlay.addEventListener('click', closeExitModal);

DOM.btnExitConfirm.addEventListener('click', () => {
  closeExitModal();
  endGame(true); // incomplete = true
});

// ============================================================
// 18. SCREEN MANAGEMENT
// ============================================================
function showScreen(name) {
  DOM.screenStart.classList.add('hidden');
  DOM.screenGame.classList.add('hidden');
  DOM.screenResults.classList.add('hidden');

  const screenMap = {
    start:   DOM.screenStart,
    game:    DOM.screenGame,
    results: DOM.screenResults,
  };

  const el = screenMap[name];
  if (el) {
    el.classList.remove('hidden');
    // Re-trigger animation
    el.style.animation = 'none';
    requestAnimationFrame(() => { el.style.animation = ''; });
    window.scrollTo(0, 0);
  }
}

// ============================================================
// 19. UTILITY FUNCTIONS
// ============================================================
function escapeHtml(str) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return str.replace(/[&<>"']/g, m => map[m]);
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ============================================================
// 20. BOOT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initStartScreen();
  initRealtimeLeaderboard();

  // Unlock AudioContext on first interaction
  document.addEventListener('pointerdown', ensureAudioCtx, { once: true });
});
