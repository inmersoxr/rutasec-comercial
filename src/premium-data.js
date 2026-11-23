export const corridors = {
  cuenca: { origin: 'Cuenca', destination: 'Guayaquil', distance: 185.8 },
  manta: { origin: 'Guayaquil', destination: 'Manta', distance: 193.8 },
  quito: { origin: 'Quito', destination: 'Ambato', distance: 139.5 },
};

export const employees = [
  ['Diego Torres', 'Conductor', 'Cuenca', '07:00–15:00', 'Licencia profesional vigente', 730, '1 anticipo registrado', 'Vacaciones programadas en diciembre'],
  ['Lucía Mora', 'Conductora', 'Guayaquil', '06:30–14:30', 'Licencia profesional vigente', 730, 'Sin anticipos', 'Sin permisos pendientes'],
  ['Sara Pérez', 'Conductora', 'Cuenca', '08:00–16:00', 'Licencia profesional vigente', 730, 'Rol del mes aprobado', 'Permiso aprobado · 28 nov.'],
  ['María Vera', 'Conductora', 'Quito', '08:00–16:00', 'Licencia profesional vigente', 730, 'Sin anticipos', 'Sin permisos pendientes'],
  ['Andrés Mora', 'Conductor', 'Cuenca', '08:00–16:00', 'Licencia profesional vigente', 730, 'Pago del mes registrado', 'Sin permisos pendientes'],
  ['Daniela Rojas', 'Jefa de despacho', 'Cuenca', '06:00–14:00', 'Identificación y contrato en archivo', 810, 'Rol del mes aprobado', 'Vacaciones pendientes de aprobación'],
  ['Ana Vera', 'Administración y caja', 'Guayaquil', '09:00–17:00', 'Identificación y contrato en archivo', 780, 'Pago del mes registrado', 'Sin permisos pendientes'],
];

export const fleet = [
  { id: 'EC–014', model: 'Mercedes-Benz Sprinter', plate: 'ABC-0140', driver: 'Diego Torres', status: 'En recorrido', location: 'Vía Cuenca–Molleturo', km: 82460, gps: 82524, service: 'Cambio de aceite', next: 85000, position: .26, corridor: 'cuenca', capacity: 15, passengers: 12, eta: '11:46', fuel: 315, upkeep: 95, trips: 18 },
  { id: 'EC–021', model: 'Kia Sorento', plate: 'ABC-0210', driver: 'Lucía Mora', status: 'En recorrido', location: 'Vía a Montecristi', km: 61235, gps: 61338, service: 'Revisión de filtros', next: 65000, position: .89, corridor: 'manta', capacity: 6, passengers: 4, eta: '10:48', fuel: 190, upkeep: 58, trips: 12 },
  { id: 'EC–036', model: 'Hyundai H1', plate: 'ABC-0360', driver: 'Sara Pérez', status: 'En embarque', location: 'Punto de salida · Cuenca', km: 94200, gps: 94430, service: 'Cambio de aceite', next: 94500, position: .02, corridor: 'cuenca', capacity: 12, passengers: 7, eta: '13:50', fuel: 286, upkeep: 120, trips: 16 },
  { id: 'EC–041', model: 'Toyota Hiace', plate: 'ABC-0410', driver: 'María Vera', status: 'En recorrido', location: 'Vía Latacunga–Ambato', km: 70080, gps: 70165, service: 'Revisión de neumáticos', next: 72000, position: .72, corridor: 'quito', capacity: 14, passengers: 10, eta: '11:17', fuel: 246, upkeep: 75, trips: 14 },
  { id: 'EC–052', model: 'Hyundai Staria', plate: 'ABC-0520', driver: 'Por asignar', status: 'En mantenimiento', location: 'Taller · Cuenca', km: 119850, gps: 119850, service: 'Revisión de frenos', next: 120000, position: 0, corridor: 'cuenca', capacity: 10, passengers: 0, eta: '—', fuel: 152, upkeep: 170, trips: 7 },
  { id: 'EC–063', model: 'Toyota Fortuner', plate: 'ABC-0630', driver: 'Por asignar', status: 'Disponible', location: 'Base Guayaquil', km: 43780, gps: 43780, service: 'Revisión mecánica', next: 45000, position: 0, corridor: 'manta', capacity: 6, passengers: 0, eta: '—', fuel: 145, upkeep: 60, trips: 9 },
];

export const departure = { id: 'RE-1030', unit: 'EC–036', time: '10:30', capacity: fleet[2].capacity, reserved: fleet[2].passengers, price: 16 };

export const brands = {
  andes: { name: 'Andes Movilidad', color: '#244d3c', cover: 'fleet', initials: 'AM', offer: 'Salidas compartidas y viajes privados', contact: 'reservas@andes-movilidad.example' },
  costa: { name: 'Costa Vía', color: '#24446d', cover: 'coast', initials: 'CV', offer: 'Viajes privados y traslados a la costa', contact: 'viajes@costa-via.example' },
  sierra: { name: 'Sierra Enlace', color: '#713348', cover: 'minibus', initials: 'SE', offer: 'Salidas interprovinciales y grupos', contact: 'ventas@sierra-enlace.example' },
};
