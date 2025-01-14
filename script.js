const cargoList = [
    {
        id: "CARGO001",
        name: "Строительные материалы",
        status: "В пути",
        origin: "Москва",
        destination: "Казань",
        departureDate: "2024-11-24"
    },
    {
        id: "CARGO002",
        name: "Хрупкий груз",
        status: "Ожидает отправки",
        origin: "Санкт-Петербург",
        destination: "Екатеринбург",
        departureDate: "2024-11-26"
    }
];

const statusClasses = {
    "Ожидает отправки": "status-awaiting",
    "В пути": "status-in-transit",
    "Доставлен": "status-delivered"
};

// Функция отображения таблицы с грузами
function renderTable(filteredStatus = null) {
    const tableBody = document.getElementById('cargoTable');
    tableBody.innerHTML = '';
    cargoList
        .filter(cargo => !filteredStatus || cargo.status === filteredStatus)
        .forEach((cargo, index) => {
            const row = document.createElement('tr');

            // Применение Bootstrap-классов для статусов
            if (cargo.status === "Ожидает отправки") {
                row.classList.add("table-warning");
            } else if (cargo.status === "В пути") {
                row.classList.add("table-primary");
            } else if (cargo.status === "Доставлен") {
                row.classList.add("table-success");
            }

            row.classList.add(statusClasses[cargo.status]);
            row.innerHTML = `
                <td>${cargo.id}</td>
                <td>${cargo.name}</td>
                <td>
                    <select class="form-select" onchange="updateStatus(${index}, this.value)">
                        <option ${cargo.status === "Ожидает отправки" ? "selected" : ""}>Ожидает отправки</option>
                        <option ${cargo.status === "В пути" ? "selected" : ""}>В пути</option>
                        <option ${cargo.status === "Доставлен" ? "selected" : ""}>Доставлен</option>
                    </select>
                </td>
                <td>${cargo.origin}</td>
                <td>${cargo.destination}</td>
                <td>${cargo.departureDate}</td>
            `;
            tableBody.appendChild(row);
        });
}

// Функция для обновления статуса груза
function updateStatus(index, newStatus) {
    const cargo = cargoList[index];
    const today = new Date().toISOString().split('T')[0];
    if (newStatus === "Доставлен" && cargo.departureDate > today) {
        alert("Ошибка: Дата отправления в будущем. Нельзя установить статус 'Доставлен'.");
        renderTable();
        return;
    }
    cargo.status = newStatus;
    renderTable();
}

// Обработчик для формы добавления нового груза
document.getElementById('addCargoForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('cargoName').value.trim();
    const origin = document.getElementById('origin').value.trim();
    const destination = document.getElementById('destination').value.trim();
    const departureDate = document.getElementById('departureDate').value.trim();

    if (!name || !origin || !destination || !departureDate) {
        alert('Заполните все поля');
        return;
    }

    const newCargo = {
        id: `CARGO${(cargoList.length + 1).toString().padStart(3, '0')}`,
        name,
        status: "Ожидает отправки",
        origin,
        destination,
        departureDate
    };

    cargoList.push(newCargo);
    console.log(cargoList);
    renderTable();
    this.reset();
});

// Фильтрация по статусу
const statusFilter = document.getElementById('statusFilter');
statusFilter.addEventListener('change', function () {
    const selectedStatus = this.value;
    renderTable(selectedStatus);
});

renderTable();