import type { ToolPageCopy } from './registry';

/** 工具页的西班牙语文案。关键词按西语用户的实际搜索习惯选，不是英文直译。 */
export const TOOLS_ES: Record<string, ToolPageCopy> = {
  'pdf-to-mind-map': {
    eyebrow: 'Herramienta de estructuración de documentos con IA',
    title: 'PDF a mapa mental',
    description:
      'Sube un PDF y obtén un mapa mental editable de varios niveles. Las secciones, los temas y los argumentos principales se identifican solos, y cada conclusión conserva la página de la que salió.',
    seoTitle: 'PDF a mapa mental — IA que extrae la estructura y las ideas clave',
    seoDescription:
      'Prueba gratis nuestra herramienta de PDF a mapa mental con IA. Sube un artículo, un informe o un libro y obtén un mapa de varios niveles cuyos nodos conservan su página de origen, con exportación a PNG, SVG y Markdown.',
    primaryKeyword: 'PDF a mapa mental',
    relatedKeywords: ['convertir PDF en mapa mental', 'resumen de PDF con IA', 'artículo científico a mapa mental', 'visualizar contenido de un PDF'],
    benefits: [
      { title: 'Primero la estructura, después los nodos', description: 'En lugar de copiar párrafo a párrafo, identificamos las categorías temáticas y luego colocamos cada dato en la rama que le corresponde.' },
      { title: 'Cada idea se puede comprobar', description: 'Los nodos conservan su número de página, así que verificar una conclusión no obliga a recorrer el documento entero otra vez.' },
      { title: 'Sigue siendo editable', description: 'Añade o quita nodos, pliega niveles y exporta a PNG, SVG o Markdown.' },
    ],
    steps: [
      { title: 'Sube tu PDF', description: 'Elige un PDF con texto seleccionable. Los límites actuales son 20 MB y 200 páginas.' },
      { title: 'Elige profundidad y propósito', description: 'Controla cuántos niveles tendrá el mapa según si vas a hojear, estudiar o analizar la estructura.' },
      { title: 'Comprueba las fuentes y exporta', description: 'Revisa las citas de página, ajusta los nodos y guarda o exporta el resultado.' },
    ],
    useCases: ['Hojear artículos científicos con rapidez', 'Abordar informes y libros blancos del sector', 'Convertir capítulos de un manual en un esquema de repaso', 'Extraer la estructura de contratos y reglamentos'],
    faq: [
      { question: '¿Se pueden convertir PDF escaneados?', answer: 'La versión actual admite PDF cuyo texto se puede seleccionar y copiar. El OCR para documentos escaneados está previsto para una versión futura.' },
      { question: '¿De dónde salen los números de página de los nodos?', answer: 'Se registran mientras se trocea el documento. El modelo solo referencia fragmentos que ya existen, así que cada nodo se puede resolver hasta su página y el número nunca lo inventa el modelo.' },
      { question: '¿Se guarda mi PDF de forma permanente?', answer: 'El proceso de generación lee el archivo únicamente para atender tu solicitud. El resultado estructurado entra en tu biblioteca personal solo cuando decides guardar el mapa.' },
    ],
  },
  'text-to-mind-map': {
    eyebrow: 'Herramienta de organización de contenido con IA',
    title: 'Texto a mapa mental',
    description: 'Pega un artículo, tus apuntes o el acta de una reunión y la IA agrupa los temas por niveles, convirtiendo un texto lineal en una estructura de conocimiento editable.',
    seoTitle: 'Texto a mapa mental — IA que crea mapas de varios niveles',
    seoDescription:
      'Prueba gratis nuestra herramienta de texto a mapa mental. Pega textos largos, apuntes o actas y la IA los organiza en un mapa editable y exportable de varios niveles.',
    primaryKeyword: 'texto a mapa mental',
    relatedKeywords: ['crear mapa mental desde texto', 'generador de mapas mentales con IA', 'apuntes a mapa mental', 'acta de reunión a mapa mental'],
    benefits: [
      { title: 'Temas extraídos solos', description: 'Primero se fijan las categorías principales y después se archivan los detalles, de modo que no se amontone todo en el nodo central.' },
      { title: 'Tres niveles de detalle', description: 'Elige entre conciso, estándar o detallado según vayas a hojear o a estudiar a fondo.' },
      { title: 'No es una imagen fija', description: 'Después de generarlo puedes editar el texto, añadir nodos, plegar niveles y exportar.' },
    ],
    steps: [
      { title: 'Pega tu texto', description: 'Un artículo, una transcripción, una especificación o cualquier texto largo.' },
      { title: 'Elige tu objetivo', description: 'Ajusta el resultado para estudiar, analizar la estructura, tomar actas o comprender en general.' },
      { title: 'Ordena y llévatelo', description: 'Revisa la jerarquía, edítala a mano y exporta o genera un enlace para compartir.' },
    ],
    useCases: ['Convertir apuntes de lectura en un marco de conocimiento', 'Separar un acta en temas y tareas', 'Organizar requisitos de producto y planes de proyecto', 'Hacerse una idea rápida de un artículo largo'],
    faq: [
      { question: '¿Cuánto texto puedo pegar de una vez?', answer: 'El límite depende de tu plan y de la profundidad elegida; encontrarás la cifra exacta en la página de precios. Cuanto más largo sea el contenido, más créditos consume.' },
      { question: '¿Funciona con textos que mezclan idiomas?', answer: 'Sí. Puedes indicar el idioma de salida por separado y el idioma de los nodos quedará unificado.' },
      { question: '¿Puedo añadir nodos hijos después?', answer: 'Sí. Selecciona un nodo y pulsa Tab para un nodo hijo o Intro para uno del mismo nivel.' },
    ],
  },
  'webpage-to-mind-map': {
    eyebrow: 'Herramienta de lectura web con IA',
    title: 'Página web a mapa mental',
    description: 'Pega el enlace de un artículo: extraemos el cuerpo del texto, descartamos la navegación y la publicidad, y ordenamos los argumentos principales en un mapa de varios niveles.',
    seoTitle: 'Página web a mapa mental — la IA extrae el artículo y lo mapea',
    seoDescription:
      'Pega el enlace de una página o un artículo y la IA extrae el cuerpo del texto para construir un mapa mental de estructura clara. Permite editar, compartir y exportar a PNG, SVG y Markdown.',
    primaryKeyword: 'página web a mapa mental',
    relatedKeywords: ['convertir artículo en mapa mental', 'resumir artículo web', 'URL a mapa mental', 'resumen del contenido de una web'],
    benefits: [
      { title: 'Sin el ruido de la página', description: 'La navegación, los anuncios y los módulos de recomendaciones se excluyen en la medida de lo posible, dejando el contenido del artículo.' },
      { title: 'Se conserva la estructura de sentido', description: 'Los temas salen de los encabezados, los párrafos y el hilo argumental, no de trocear la página mecánicamente por orden.' },
      { title: 'De leer a organizar sin pasos intermedios', description: 'Entra un enlace y sale un mapa editable: útil para investigar, guardar referencias y compartir con el equipo.' },
    ],
    steps: [
      { title: 'Pega un enlace público', description: 'Introduce la URL de un artículo o una página accesible sin iniciar sesión.' },
      { title: 'Extracción y análisis', description: 'Identificamos el contenido principal, lo troceamos y construimos la jerarquía de temas.' },
      { title: 'Verifica y exporta', description: 'Comprueba las ideas clave, edítalas y luego guarda o comparte.' },
    ],
    useCases: ['Ordenar artículos del sector y análisis de actualidad', 'Digerir documentación de producto y bases de conocimiento', 'Comparar varias referencias con rapidez', 'Convertir artículos guardados en una estructura de repaso'],
    faq: [
      { question: '¿Se puede extraer cualquier página web?', answer: 'Las páginas públicas accesibles desde un servidor son las que mejor funcionan. Las que exigen iniciar sesión, tienen protección antibot estricta o se renderizan por completo en el cliente pueden no ser extraíbles.' },
      { question: '¿Acabarán los anuncios en el mapa?', answer: 'La detección del cuerpo filtra las zonas habituales de navegación y publicidad, aunque en páginas con una estructura poco común puede quedar algo de ruido.' },
      { question: '¿Sirve con periódicos y blogs?', answer: 'Sí: noticias, blogs, enciclopedias y documentación pública son todos tipos de entrada adecuados.' },
    ],
  },
  'youtube-to-mind-map': {
    eyebrow: 'Herramienta de resumen de vídeo con IA',
    title: 'Vídeo de YouTube a mapa mental',
    description: 'Pega el enlace de un vídeo. Leemos sus subtítulos y trazamos el argumento como un mapa donde cada nodo lleva el momento del que salió: haz clic y el vídeo se abre en ese segundo.',
    seoTitle: 'YouTube a mapa mental — convierte un vídeo en algo que puedes verificar',
    seoDescription:
      'Pega un enlace de YouTube y obtén un mapa mental editable creado a partir de los subtítulos. Cada nodo guarda una marca de tiempo que salta directamente a ese momento.',
    primaryKeyword: 'youtube a mapa mental',
    relatedKeywords: ['resumen de vídeo de youtube', 'vídeo a mapa mental', 'resumir vídeo con ia', 'resumen de subtítulos de youtube'],
    benefits: [
      { title: 'Cada nodo vuelve a su segundo', description: 'Las marcas de tiempo no son decoración: al pulsarlas el vídeo se abre en ese instante y compruebas qué se dijo realmente.' },
      { title: 'Una hora de charla, en una sola vista', description: 'Las clases largas y las ponencias se convierten en una estructura que se recorre de un vistazo, sin arrastrar la barra de reproducción.' },
      { title: 'Mira solo lo que necesitas', description: 'Lee primero el mapa y reproduce después únicamente los tramos que te importan.' },
    ],
    steps: [
      { title: 'Pega el enlace del vídeo', description: 'Sirven los enlaces normales, los cortos de youtu.be y las direcciones de Shorts.' },
      { title: 'Leemos y agrupamos los subtítulos', description: 'Los subtítulos se unen en pasajes cortos para que el sentido no se rompa, y cada uno conserva su hora de inicio.' },
      { title: 'Comprueba pulsando una marca de tiempo', description: 'Cualquier nodo que te genere dudas se contrasta con el vídeo en un solo clic.' },
    ],
    useCases: ['Tomar apuntes de clases y cursos', 'Asimilar ponencias y entrevistas', 'Extraer el argumento de un análisis largo', 'Decidir si un vídeo de una hora merece la pena'],
    faq: [
      { question: '¿Funciona con vídeos sin subtítulos?', answer: 'No. Leemos subtítulos en lugar de escuchar el audio, así que un vídeo sin ningún subtítulo no se puede convertir. Los subtítulos automáticos sí valen.' },
      { question: '¿Son precisas las marcas de tiempo?', answer: 'Los subtítulos se agrupan en pasajes de unos 30 segundos y la marca apunta al principio del pasaje, así que llegas justo antes de la idea y no a mitad de frase.' },
      { question: '¿Y los vídeos en otros idiomas?', answer: 'Sí, siempre que existan subtítulos. Si no están en el idioma que pediste, el mapa se traduce y las notas lo indican.' },
      { question: '¿Y los vídeos muy largos?', answer: 'Funcionan, pero consumen más créditos y se aplican los límites de caracteres de tu plan igual que con los documentos.' },
    ],
  },
  'docx-to-mind-map': {
    eyebrow: 'Herramienta de estructuración de documentos con IA',
    title: 'Documento de Word a mapa mental',
    description: 'Sube un DOCX y extraemos en orden los párrafos del cuerpo y el texto de las tablas para formar una jerarquía editable.',
    seoTitle: 'Word a mapa mental — convierte un DOCX en una jerarquía editable',
    seoDescription:
      'Sube un documento DOCX de Word y la IA extraerá el texto para construir un mapa mental claro y editable. Admite el resumen por secciones de documentos largos y varios formatos de exportación.',
    primaryKeyword: 'Word a mapa mental',
    relatedKeywords: ['docx a mapa mental', 'resumir documento de Word', 'convertir Word en mapa mental', 'doc a mapa mental'],
    benefits: [
      { title: 'Lee el documento, no la maquetación', description: 'Los párrafos del cuerpo se toman en orden, incluido el texto de las tablas, de modo que lo que queda es el argumento y no los adornos de página.' },
      { title: 'Los documentos largos no se desarman', description: 'Los archivos extensos se resumen sección por sección y luego se fusionan, así una especificación de 60 páginas no acaba como una lista plana.' },
      { title: 'Una estructura con la que seguir trabajando', description: 'Renombra nodos, añade ramas, pliega niveles y exporta a PNG, SVG o Markdown para tu siguiente borrador.' },
    ],
    steps: [
      { title: 'Sube tu DOCX', description: 'Archivos de hasta 20 MB. No se admiten el formato antiguo .doc ni los archivos protegidos con contraseña.' },
      { title: 'Elige profundidad y propósito', description: 'Decide cuántos niveles quieres y si vas a estudiar, analizar la estructura u hojear.' },
      { title: 'Edita y exporta', description: 'Ajusta la jerarquía en el lienzo y después guarda, comparte o exporta.' },
    ],
    useCases: ['Convertir una especificación en una estructura revisable', 'Dividir un informe largo en temas', 'Ordenar el borrador de una tesis antes de corregirlo', 'Resumir documentos de normativa y procesos'],
    faq: [
      {
        question: '¿Los nodos de Word llevan número de página como los de PDF?',
        answer: 'No. Un DOCX guarda un flujo de párrafos, no páginas fijas: los saltos solo existen cuando Word maqueta el archivo. Por eso anclamos a la posición en el documento. Si necesitas citas por página, exporta primero a PDF y usa la herramienta de PDF.',
      },
      { question: '¿Se incluye el texto de las tablas?', answer: 'Sí. El texto de las celdas se lee junto con los párrafos normales. Las tablas muy anchas pueden quedar raras al aplanarse en una jerarquía, así que conviene revisar esas ramas.' },
      { question: '¿Y los encabezados, pies, notas al pie y comentarios?', answer: 'No se leen. Extraemos únicamente el cuerpo del documento, lo que mantiene fuera del mapa los elementos que se repiten en cada página. Lo que quieras en el mapa debe estar en el cuerpo del texto.' },
      { question: '¿Puedo subir un archivo .doc antiguo?', answer: 'No. Solo se admite el formato DOCX actual. Abre el archivo en Word o un editor compatible y guárdalo como .docx.' },
    ],
  },
  'epub-to-mind-map': {
    eyebrow: 'Herramienta de estructuración de libros con IA',
    title: 'Libro EPUB a mapa mental',
    description: 'Los capítulos se extraen en el orden de lectura del libro, convirtiendo una obra entera en una estructura única.',
    seoTitle: 'EPUB a mapa mental — mapea un libro entero por capítulos',
    seoDescription:
      'Sube un libro EPUB y la IA extraerá el texto en orden de lectura para construir un mapa mental editable con los capítulos indicados.',
    primaryKeyword: 'EPUB a mapa mental',
    relatedKeywords: ['libro a mapa mental', 'resumir un libro electrónico', 'convertir epub en mapa mental', 'mapa mental por capítulos'],
    benefits: [
      { title: 'Sigue el orden de lectura del libro', description: 'Leemos el spine del EPUB —el orden que definió la editorial— en vez de deducirlo de los nombres de archivo, así los capítulos aparecen como los leerías.' },
      { title: 'Los nodos indican su capítulo', description: 'Cada bloque conserva el título del capítulo del que procede, de modo que una afirmación del mapa se puede rastrear hasta su origen.' },
      { title: 'Un libro, una estructura', description: 'En lugar de resúmenes capítulo a capítulo que nunca se conectan, obtienes una jerarquía única donde los temas recurrentes quedan juntos.' },
    ],
    steps: [
      { title: 'Sube tu EPUB', description: 'Archivos de hasta 20 MB. Los libros protegidos con DRM no se pueden abrir.' },
      { title: 'Elige la profundidad', description: 'Conciso para el esqueleto del argumento, detallado para conservar más material de apoyo.' },
      { title: 'Revisa por capítulos y exporta', description: 'Comprueba las etiquetas de capítulo en las ramas principales, edita y luego exporta o comparte.' },
    ],
    useCases: ['Crear una estructura de repaso a partir de un manual', 'Trazar el argumento de un ensayo', 'Comparar cómo desarrollan un mismo tema los distintos capítulos', 'Preparar notas antes de un club de lectura o un seminario'],
    faq: [
      { question: '¿Se pueden abrir los libros comprados en una tienda?', answer: 'Solo si el archivo no tiene DRM. Las compras protegidas con DRM en la mayoría de tiendas están cifradas y ninguna herramienta externa puede leerlas, tampoco esta.' },
      {
        question: '¿Cómo se enlazan los nodos con el libro?',
        answer: 'Cada bloque extraído conserva el título del capítulo de esa parte del EPUB, así que los nodos van etiquetados por capítulo. El EPUB no tiene páginas fijas —dependen del lector y del tamaño de letra—, por lo que el capítulo es el ancla fiable.',
      },
      { question: '¿Hay un límite de longitud del libro?', answer: 'El archivo debe pesar menos de 20 MB y leemos hasta los primeros 500 documentos del spine, lo que cubre prácticamente cualquier libro normal. Los libros muy extensos pueden alcanzar además el límite de caracteres de tu plan.' },
      { question: '¿Funciona con novelas?', answer: 'Funciona, pero encaja mucho mejor con la no ficción. Los mapas mentales muestran jerarquía y clasificación; la narrativa es cronológica y su mapa suele resultar menos útil que el propio libro.' },
    ],
  },
  'pptx-to-mind-map': {
    eyebrow: 'Herramienta de estructuración de presentaciones con IA',
    title: 'Presentación de PowerPoint a mapa mental',
    description: 'El texto se extrae diapositiva a diapositiva y convierte la estructura de la presentación y sus argumentos en un mapa, con el número de diapositiva en cada nodo.',
    seoTitle: 'PowerPoint a mapa mental — diapositiva a diapositiva y con numeración',
    seoDescription:
      'Sube una presentación PPTX y la IA extraerá el texto de cada diapositiva para construir un mapa mental editable en el que cada nodo indica su diapositiva.',
    primaryKeyword: 'PowerPoint a mapa mental',
    relatedKeywords: ['pptx a mapa mental', 'resumir una presentación', 'diapositivas a mapa mental', 'convertir PowerPoint en mapa mental'],
    benefits: [
      { title: 'Cada nodo lleva su diapositiva', description: 'Los nodos se etiquetan como diapositiva 1, diapositiva 2 y así, de modo que verificar una idea es abrir una diapositiva y no recorrer toda la presentación.' },
      { title: 'Recupera el argumento de las diapositivas', description: 'Una presentación se hace para exponerla, no para leerla. Agrupar el texto en una jerarquía muestra qué defiende realmente y dónde se repite.' },
      { title: 'Compara presentaciones rápido', description: 'Mapea dos presentaciones sobre el mismo tema y las diferencias de cobertura saltan a la vista de un modo que hojear diapositivas no consigue.' },
    ],
    steps: [
      { title: 'Sube tu PPTX', description: 'Archivos de hasta 20 MB. Las diapositivas se leen en el orden de la presentación.' },
      { title: 'Elige profundidad y propósito', description: 'Conciso para el argumento principal, detallado para conservar los puntos de apoyo.' },
      { title: 'Comprueba la numeración y exporta', description: 'Contrasta las ramas principales con sus diapositivas, edita y luego exporta o comparte.' },
    ],
    useCases: ['Digerir una ponencia de congreso', 'Convertir material de formación en una estructura de repaso', 'Revisar si el argumento de una propuesta está completo', 'Comparar la cobertura de varias presentaciones sobre un mismo tema'],
    faq: [
      { question: '¿Se leen las notas del ponente?', answer: 'No. Solo extraemos el texto de las diapositivas. Una presentación que esconde lo esencial en las notas dará un mapa pobre.' },
      { question: '¿Y el texto dentro de imágenes y gráficos?', answer: 'No se puede leer. Las imágenes, el audio, el vídeo y las animaciones no se analizan; solo se extrae el texto de los cuadros de texto y los marcadores de posición.' },
      { question: '¿Es exacta la numeración de las diapositivas?', answer: 'Sí. El número se vincula al trocear el contenido, con el mismo mecanismo que las páginas de un PDF. No lo genera el modelo.' },
    ],
  },
};
