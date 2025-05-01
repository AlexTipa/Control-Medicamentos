document.addEventListener('DOMContentLoaded', () => {
  const hoy = new Date().toISOString().split('T')[0]; // Obtener la fecha actual en formato YYYY-MM-DD

  const fechaInicio = document.getElementById('fechaInicio');
  const fechaFin = document.getElementById('fechaFin');

  if (fechaInicio) {
    fechaInicio.setAttribute('min', hoy); // Establecer la fecha mínima en el campo "Fecha de inicio"
  }

  if (fechaFin) {
    fechaFin.setAttribute('min', hoy); // Establecer la fecha mínima en el campo "Fecha de fin"
  }
});

// Función para guardar medicamentos
function guardarMedicamento(event) {
  event.preventDefault();

  const nombreMedicamento = document.getElementById('nombreMedicamento').value;
  const presentacion = document.getElementById('presentacion').value;
  const dosis = document.getElementById('dosis').value;
  const frecuencia = document.getElementById('frecuencia').value;
  const via = document.getElementById('via').value;
  const instrucciones = document.getElementById('instrucciones').value;
  const fechaInicio = document.getElementById('fechaInicio').value;
  const fechaFin = document.getElementById('fechaFin').value;

  if (!nombreMedicamento || !dosis || !frecuencia || !fechaInicio) {
    Swal.fire({
      title: "Por favor completa los campos obligatorios.",
      icon: "error",
    });
    return;
  }

  const nuevoMedicamento = {
    id: Date.now(),
    nombreMedicamento,
    presentacion,
    dosis,
    frecuencia,
    via,
    instrucciones,
    fechaInicio,
    fechaFin,
  };

  const medicamentos = JSON.parse(localStorage.getItem('medicamentos')) || [];
  medicamentos.push(nuevoMedicamento);
  localStorage.setItem('medicamentos', JSON.stringify(medicamentos));

  Swal.fire({
    title: "¡Medicamento registrado exitosamente!",
    icon: "success",
    draggable: true,
  });

  document.getElementById('formMedicamento').reset();
  mostrarMedicamentos(); // Actualiza la lista de medicamentos
}

// Función para mostrar medicamentos
function mostrarMedicamentos() {
  const contenedor = document.getElementById('listaMedicamentos');
  if (!contenedor) {
    console.error('El contenedor #listaMedicamentos no existe.');
    return;
  }

  const medicamentos = JSON.parse(localStorage.getItem('medicamentos')) || [];
  console.log('Medicamentos cargados desde localStorage:', medicamentos);

  contenedor.innerHTML = medicamentos.length
    ? ''
    : '<p>No hay medicamentos registrados.</p>';

  medicamentos.forEach((med) => {
    const div = document.createElement('div');
    div.className = 'card';

    div.innerHTML = `
      <h3>${med.nombreMedicamento}</h3>
      <p><strong>Presentación:</strong> ${med.presentacion || 'No especificada'}</p>
      <p><strong>Dosis:</strong> ${med.dosis}</p>
      <p><strong>Frecuencia:</strong> ${med.frecuencia}</p>
      <p><strong>Vía:</strong> ${med.via || 'No especificada'}</p>
      <p><strong>Instrucciones:</strong> ${med.instrucciones || 'Ninguna'}</p>
      <p><strong>Fecha de inicio:</strong> ${med.fechaInicio}</p>
      <p><strong>Fecha de fin:</strong> ${med.fechaFin || 'Indefinido'}</p>
      <div class="botones">
        <button class="editar" onclick="editarMedicamento(${med.id})">Editar</button>
        <button class="borrar" onclick="eliminarMedicamento(${med.id})">Borrar</button>
        <button class="marcar" onclick="registrarToma(${med.id})">Marcar como tomado</button>
      </div>
    `;
    contenedor.appendChild(div);
  });
}
function editarMedicamento(id) {
  const medicamentos = JSON.parse(localStorage.getItem('medicamentos')) || [];
  const medicamento = medicamentos.find(m => m.id === id);

  if (!medicamento) {
    Swal.fire({
      title: "Medicamento no encontrado.",
      icon: "error",
    });
    return;
  }

  // Cargar los datos en el formulario de edición
  document.getElementById('editarId').value = medicamento.id;
  document.getElementById('editarNombreMedicamento').value = medicamento.nombreMedicamento;
  document.getElementById('editarPresentacion').value = medicamento.presentacion;
  document.getElementById('editarDosis').value = medicamento.dosis;
  document.getElementById('editarFrecuencia').value = medicamento.frecuencia;
  document.getElementById('editarVia').value = medicamento.via;
  document.getElementById('editarInstrucciones').value = medicamento.instrucciones;
  document.getElementById('editarFechaInicio').value = medicamento.fechaInicio;
  document.getElementById('editarFechaFin').value = medicamento.fechaFin;

  // Mostrar el formulario de edición
  document.getElementById('editarMedicamento').style.display = 'block';
}
function guardarCambios(event) {
  event.preventDefault();

  // Obtener los datos del formulario de edición
  const id = parseInt(document.getElementById('editarId').value, 10);
  const nombreMedicamento = document.getElementById('editarNombreMedicamento').value;
  const presentacion = document.getElementById('editarPresentacion').value;
  const dosis = document.getElementById('editarDosis').value;
  const frecuencia = document.getElementById('editarFrecuencia').value;
  const via = document.getElementById('editarVia').value;
  const instrucciones = document.getElementById('editarInstrucciones').value;
  const fechaInicio = document.getElementById('editarFechaInicio').value;
  const fechaFin = document.getElementById('editarFechaFin').value;

  // Obtener los medicamentos del localStorage
  const medicamentos = JSON.parse(localStorage.getItem('medicamentos')) || [];
  const index = medicamentos.findIndex(m => m.id === id);

  if (index === -1) {
    Swal.fire({
      title: "Medicamento no encontrado.",
      icon: "error",
    });
    return;
  }

  // Actualizar los datos del medicamento
  medicamentos[index] = {
    ...medicamentos[index], // Mantener los datos existentes
    nombreMedicamento,
    presentacion,
    dosis,
    frecuencia,
    via,
    instrucciones,
    fechaInicio,
    fechaFin,
  };

  // Guardar los cambios en localStorage
  localStorage.setItem('medicamentos', JSON.stringify(medicamentos));

  // Mostrar mensaje de éxito
  Swal.fire({
    title: "¡Medicamento actualizado exitosamente!",
    icon: "success",
    draggable: true,
  });

  // Ocultar el formulario de edición y actualizar la lista de medicamentos
  document.getElementById('editarMedicamento').style.display = 'none';
  mostrarMedicamentos();
}

function cancelarEdicion() {
  // Ocultar el formulario de edición
  document.getElementById('editarMedicamento').style.display = 'none';

  // Limpiar los campos del formulario de edición
  document.getElementById('formEditarMedicamento').reset();
}

function registrarToma(id) {
  const medicamentos = JSON.parse(localStorage.getItem('medicamentos')) || [];
  const medicamento = medicamentos.find(m => m.id === id);

  if (!medicamento) {
    Swal.fire({
      title: "Medicamento no encontrado.",
      icon: "error",
    });
    return;
  }

  // Registrar la toma con la fecha y hora actuales
  const ahora = new Date();
  const fechaToma = ahora.toISOString().split('T')[0]; // Fecha en formato YYYY-MM-DD
  const horaToma = ahora.toTimeString().split(' ')[0]; // Hora en formato HH:MM:SS

  if (!medicamento.historial) {
    medicamento.historial = [];
  }

  medicamento.historial.push({ fecha: fechaToma, hora: horaToma });

  // Guardar los cambios en localStorage
  localStorage.setItem('medicamentos', JSON.stringify(medicamentos));

  // Mostrar alerta con el diseño solicitado
  Swal.fire({
    title: `¡Toma registrada!`,
    text: `Fecha: ${fechaToma}, Hora: ${horaToma}`,
    icon: "success",
  });

  mostrarHistorial();
}
function mostrarHistorial() {
  const contenedor = document.getElementById('listaHistorial');
  if (!contenedor) return;

  const medicamentos = JSON.parse(localStorage.getItem('medicamentos')) || [];
  contenedor.innerHTML = '';

  medicamentos.forEach((med) => {
    if (med.historial && med.historial.length > 0) {
      med.historial.forEach((toma, index) => {
        const div = document.createElement('div');
        div.className = 'card';

        div.innerHTML = `
          <h3>${med.nombreMedicamento}</h3>
          <p><strong>Fecha:</strong> ${toma.fecha}</p>
          <p><strong>Hora:</strong> ${toma.hora}</p>
          <button class="borrar-toma" onclick="eliminarToma(${med.id}, ${index})">Borrar</button>
        `;
        contenedor.appendChild(div);
      });
    }
  });

  if (contenedor.innerHTML === '') {
    contenedor.innerHTML = '<p>No hay tomas registradas.</p>';
  }
}

function eliminarToma(medicamentoId, indexToma) {
  const medicamentos = JSON.parse(localStorage.getItem('medicamentos')) || [];
  const medicamento = medicamentos.find(m => m.id === medicamentoId);

  if (!medicamento || !medicamento.historial || !medicamento.historial[indexToma]) {
    Swal.fire({
      title: "Toma no encontrada.",
      icon: "error",
    });
    return;
  }

  // Mostrar alerta de confirmación
  Swal.fire({
    title: "¿Quieres eliminar esta toma?",
    text: "Esta acción no se puede deshacer.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Eliminar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      // Eliminar la toma del historial
      medicamento.historial.splice(indexToma, 1);

      // Guardar los cambios en localStorage
      localStorage.setItem('medicamentos', JSON.stringify(medicamentos));

      // Mostrar mensaje de éxito
      Swal.fire("¡Eliminado!", "La toma ha sido eliminada.", "success");

      // Actualizar el historial en la página
      mostrarHistorial();
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire("Cancelado", "La toma no fue eliminada.", "info");
    }
  });
}

function eliminarMedicamento(id) {
  const medicamentos = JSON.parse(localStorage.getItem('medicamentos')) || [];
  const index = medicamentos.findIndex(m => m.id === id);

  if (index === -1) {
    Swal.fire({
      title: "Medicamento no encontrado.",
      icon: "error",
    });
    return;
  }

  // Mostrar alerta de confirmación
  Swal.fire({
    title: "¿Estás seguro?",
    text: "Este medicamento será eliminado permanentemente.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      // Eliminar el medicamento del array
      medicamentos.splice(index, 1);

      // Guardar los cambios en localStorage
      localStorage.setItem('medicamentos', JSON.stringify(medicamentos));

      // Mostrar mensaje de éxito
      Swal.fire("¡Eliminado!", "El medicamento ha sido eliminado.", "success");

      // Actualizar la lista de medicamentos
      mostrarMedicamentos();
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire("Cancelado", "El medicamento no fue eliminado.", "info");
    }
  });
}
mostrarMedicamentos();
mostrarHistorial();
