const container = document.getElementById("container");
const input = document.getElementById("input");
input.style.width = "100%";
input.style.height = "30px";
input.style.fontSize = "20px";
input.style.marginBottom = "20px";
input.style.padding = "10px";
const table = document.createElement("table");
container.appendChild(table);
const tableHead = document.createElement("thead");
table.appendChild(tableHead);
const tableHeadRow = document.createElement("tr");
tableHead.appendChild(tableHeadRow);
const headers = ["id", "title", "price", "category", "createdAt"];

headers.forEach((header) => {
  const th = document.createElement("th");
  th.innerHTML = header;
  th.addEventListener("click", () => sortData(header));
  tableHeadRow.appendChild(th);
  th.style.cursor = "pointer";
});
const tbody = document.createElement("tbody");
table.appendChild(tbody);

function renderProducts(products) {
  tbody.innerHTML = "";
  products.forEach(({ id, title, price, category, creationAt }) => {
    const row = `<tr>
      <td>${id}</td>
      <td>${title}</td>
      <td>${price}</td>
      <td>${category.name}</td>
      <td>${creationAt}</td>
    </tr>`;
    tbody.innerHTML += row;
  });
}

async function fetchProducts(url) {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (err) {
    console.log("error", err);
  }
}
let products = [];

async function fetchAndRenderData(filter = "") {
  const url = `https://api.escuelajs.co/api/v1/products?title=${filter}`;
  products = await fetchProducts(url);
  renderProducts(products);
}

function debouncer(delay, cb) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => cb(...args), delay);
  };
}

let order = "asc";
function sortData(header) {
  if (header === "category") {
    products.sort((a, b) => {
      if (a[header].name < b[header].name) return order === "asc" ? -1 : 1;
      if (a[header].name > b[header].name) return order === "asc" ? 1 : -1;
      return 0;
    });
  }
  products.sort((a, b) => {
    if (a[header] < b[header]) return order === "asc" ? -1 : 1;
    if (a[header] > b[header]) return order === "asc" ? 1 : -1;
    return 0;
  });

  order = order === "asc" ? "desc" : "asc";
  renderProducts(products);
}

function main() {
  fetchAndRenderData();
  const fetchWithDebounce = debouncer(1000, fetchAndRenderData);
  input.addEventListener("input", (e) => {
    fetchWithDebounce(e.target.value);
  });
}

main();
