export const contacts = {
  email: '',
  whatsapp: '',
  settingsUrl: 'https://rutasec-viajes-sync.cebx3001.chatgpt.site/api/institution/settings',
  applicationUrl: 'https://rutasec-viajes-sync.cebx3001.chatgpt.site/api/institution/applications',
  pwaUrl: 'https://inmersoxr.github.io/Trasporte_interprovincial/',
};

export const chapters = [
  ['ecuador', 'Conecta Ecuador', 'Ecuador conectado'],
  ['red', 'Más rutas. Más oportunidades.'],
  ['empresa', 'Tu empresa. Tus vehículos. Tus tarifas.'],
  ['modalidades', 'Una plataforma. Diferentes formas de viajar.', 'La experiencia del viaje'],
  ['pasajero', 'Viajar nunca fue tan sencillo.'],
  ['standard', 'El control de tu operación.', 'La transformación empresarial'],
  ['premium', 'Tu centro de operaciones digital.'],
  ['seguimiento', 'Viajes conectados.'],
  ['simulador', 'Descubre el potencial de tus rutas.'],
  ['planes', 'Crece con nosotros.'],
  ['asociar', 'Sé parte de la red.'],
];

export const places = [
  ['Guayaquil', 'Negocios y trabajo', 'guayaquil', 'Malecón de Guayaquil'],
  ['Cuenca', 'Estudios y familia', 'cuenca', 'Cúpulas de la Catedral Nueva de Cuenca'],
  ['Manta', 'Escapadas y turismo', 'manta', 'Playa El Murciélago en Manta'],
  ['Quito', 'Conexiones entre ciudades', 'quito', 'Plaza de San Francisco en Quito'],
];

export const modes = [
  ['Viajes compartidos', 'minibus', 'Furgoneta de pasajeros en una carretera de los Andes', 'Publica salidas programadas y vende asientos individuales. Tú defines el horario, el precio por asiento y los cupos que quieres ofrecer. Cada pasajero puede reservar uno o varios lugares en el mismo vehículo.'],
  ['Viajes privados', 'private', 'Familia y conductor preparando el equipaje junto a un SUV', 'Ofrece un vehículo completo para familias, grupos, empresas o pasajeros que prefieren viajar juntos. La tarifa corresponde a la unidad y la capacidad depende del vehículo elegido.'],
  ['Viajes personalizados', 'custom', 'Viajeros conversando sobre un itinerario junto a una furgoneta', 'El pasajero indica su fecha, el número de personas y las paradas de su itinerario. La operadora puede preparar una propuesta con el vehículo, el recorrido y la tarifa del servicio.', 'Flujo ilustrativo'],
];

export const trip = [
  ['Busca su destino', 'Abre RutasEC, elige origen, destino, fecha y cuántas personas viajan.', 'booking', 'search'],
  ['Consulta los servicios', 'Ve las alternativas para ese trayecto, con tipos de vehículo y plazas disponibles.', 'booking', 'results'],
  ['Compara y elige', 'Revisa horarios, vehículos y tarifas antes de elegir el servicio que le conviene.', 'booking', 'results'],
  ['Reserva y paga', 'Selecciona cuántos lugares necesita y revisa el total antes de confirmar. En esta muestra, el pago es simulado.', 'booking', 'checkout'],
  ['Recibe el boleto digital', 'La confirmación reúne los datos del viaje y el código de reserva en su teléfono.', 'welcome', 'ticket'],
  ['Presenta su código QR', 'El conductor comprueba el boleto antes del abordaje. La escena ilustra la validación con QR.', 'qr', ''],
  ['Aborda el vehículo', 'El conductor recibe a la pasajera y registra su abordaje en la salida correspondiente.', 'welcome', ''],
  ['Comparte el seguimiento', 'Envía un enlace a su familia. Quien lo recibe puede consultar el mapa y el tiempo estimado de llegada.', 'cabin', 'tracking'],
  ['Llega y puede valorar', 'Al finalizar el viaje puede contar cómo le fue. La valoración del servicio se muestra como flujo ilustrativo.', 'arrival', ''],
];

export const standard = [
  ['Crea y publica salidas', 'Registra trayectos, fechas, horarios y tarifas. Decide cuántos asientos de cada salida quieres ofrecer.', 'operator'],
  ['Gestiona cupos, reservas y ventas', 'Consulta las reservas recibidas, los lugares disponibles y las ventas registradas por salida.', 'sales'],
  ['Organiza el abordaje', 'Consulta el manifiesto de pasajeros, registra quién abordó y revisa el historial. La validación mediante QR se muestra como demostración.', 'sales'],
];

export const premium = [
  ['Seguimiento vehicular', 'Consulta unidades, recorridos, estados y tiempos estimados desde un mapa de operaciones.', [['En recorrido','2 unidades'],['Programadas','1 salida'],['Ubicación','Simulada']]],
  ['Gestión de conductores', 'Consulta el personal disponible y asigna conductores a los viajes y vehículos de la empresa.', [['Diego Torres','En recorrido'],['Sara Pérez','Asignada'],['Andrés Mora','Disponible']]],
  ['Administración de flota', 'Organiza documentación, disponibilidad de vehículos y fechas de mantenimiento.', [['EC–014 · Furgoneta','En servicio'],['EC–021 · SUV','Disponible'],['EC–036 · Furgoneta','Revisión programada']]],
  ['Centro de operaciones', 'Coordina programación, despachos, asignaciones e incidencias de las salidas.', [['Despacho de la mañana','Confirmado'],['Siguiente salida','10:30'],['Incidencias abiertas','1']]],
  ['Finanzas y facturación', 'Revisa ingresos, gastos, liquidaciones y registros de facturación de la operadora.', [['Ingresos registrados','$1.560,00'],['Gastos operativos','$420,00'],['Liquidaciones pendientes','2']]],
  ['Inteligencia comercial', 'Consulta la ocupación, las ventas y el rendimiento de las rutas para ajustar tu oferta.', [['Ocupación promedio','72 %'],['Asientos vendidos','84'],['Rutas evaluadas','3']]],
];

export const comparison = [
  ['Perfil comercial, viajes y reservas digitales', true, true],
  ['Control de asientos, manifiestos y validación QR', true, true],
  ['Gestión de ventas e historial de viajes', true, true],
  ['Centro de operaciones avanzado y seguimiento de flota', false, true],
  ['Gestión de conductores, flota y mantenimiento', false, true],
  ['Finanzas, facturación y reportes empresariales', false, true],
];

export const photoDescriptions = {
  booking: 'Pasajera consultando un viaje en su teléfono',
  welcome: 'El conductor recibe a una pasajera junto a la furgoneta',
  qr: 'Presentación del boleto digital al conductor',
  cabin: 'Pasajera junto a la ventana durante el viaje',
  arrival: 'Pasajera encontrándose con su familia al llegar',
};
