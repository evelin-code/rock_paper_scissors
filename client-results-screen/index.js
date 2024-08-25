document.getElementById("fetch-button").addEventListener("click", fetchData);

async function fetchData() {
  renderLoadingState();
  try {
    const response = await fetch("http://localhost:5050/users");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    renderData(data);
  } catch (error) {
    console.error(error);
    renderErrorState();
  }
}

function renderErrorState() {
  const container = document.getElementById("data-container");
  container.innerHTML = ""; // Clear previous data
  container.innerHTML = "<p>Failed to load data</p>";
  console.log("Failed to load data");
}

function renderLoadingState() {
  const container = document.getElementById("data-container");
  container.innerHTML = ""; // Clear previous data
  container.innerHTML = "<p>Loading...</p>";
  console.log("Loading...");
}

function renderData(data) {
  const container = document.getElementById("data-container");
  container.innerHTML = ""; // Limpiar datos anteriores

  if (data.players.length > 0) {
    container.style.display = "block"; // Mostrar contenedor
    data.players.forEach((item) => {
      const div = document.createElement("div");
      div.className = "player-item"; // Asegúrate de que la clase sea correcta

      // Agregar la corona si el jugador es el ganador
      const crownHTML = item.position === 1 ? '<img src="./resources/corona.png" class="crown" alt="Winner" />' : '';

      div.innerHTML = `
        <img src="${item.profilePicture}" class="profile-pic" alt="${item.name}" />
        <div>
          <p><strong>${item.name}</strong> chose <strong>${item.choice}</strong> ${crownHTML} (Position: ${item.position})</p>
        </div>
      `;
      container.appendChild(div);
    });

    // Agregar resultado si está disponible
    if (data.result) {
      const resultDiv = document.createElement("div");
      resultDiv.className = "result";
      resultDiv.innerHTML = `<p>${data.result}</p>`;
      container.appendChild(resultDiv);
    }
  } else {
    container.style.display = "block"; // Mostrar contenedor si no hay datos
    container.innerHTML = "<p>No results available</p>";
  }
}
