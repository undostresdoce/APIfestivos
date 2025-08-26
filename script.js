$(document).ready(function () {
  const url = "https://api.boostr.cl/holidays.json";
  let feriados = [];

  // feriados en la tabla
  function renderFeriados(mes = "todos") {
    const tbody = $("#feriados-table tbody");
    tbody.empty();

    const filtrados = feriados.filter(({ date }) => {
      if (mes === "todos") return true;
      const mesFeriado = date.split("-")[1]; 
      return mesFeriado === mes;
    });

    // cantidad festivos
    console.log(`Feriados mostrados (${mes}): ${filtrados.length}`);

    if (filtrados.length === 0) {
      tbody.append(`<tr><td colspan="3">No hay feriados para este mes, pucha oh :c </td></tr>`);
      return;
    }

    filtrados.forEach(({ title, date, extra }) => {
      const tipo = extra || "Oficial";
      const row = `
        <tr>
          <td>${date}</td>
          <td>${title}</td>
          <td>${tipo}</td>
        </tr>
      `;
      tbody.append(row);
    });
  }

  // Conexión con ajax
  $.ajax({
    url: url,
    type: "GET",
    dataType: "json",
    success: function (respuesta) {
      if (!respuesta || !Array.isArray(respuesta.data)) {
        console.error("Formato inesperado de respuesta");
        $("#feriados-table tbody").html(
          `<tr><td colspan="3" class="text-danger">Error: formato inesperado de datos.</td></tr>`
        );
        return;
      }

      feriados = respuesta.data;
      renderFeriados(); 
    },
    error: function (xhr, status, error) {
      console.error("Error:", error);
      console.error("Detalles:", xhr.responseText);
      $("#feriados-table tbody").html(
        `<tr><td colspan="3" class="text-danger">Error al conectar con la API.</td></tr>`
      );
    }
  });

  // Evento
  $("#mes-select").on("change", function () {
    const mesSeleccionado = $(this).val();

    console.log("Mes seleccionado:", mesSeleccionado);

    renderFeriados(mesSeleccionado);
  });
});
