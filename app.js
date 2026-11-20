const csvUrl = "data/college_town_home_sales.csv";
const minimumSalePrice = 10000;

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];

    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
        field += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      row.push(field);
      field = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && text[i + 1] === "\n") {
        i += 1;
      }
      row.push(field);
      if (row.some((value) => value !== "")) {
        rows.push(row);
      }
      row = [];
      field = "";
    } else {
      field += char;
    }
  }

  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  const headers = rows.shift().map((header) => header.trim());
  return rows.map((values) =>
    Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]))
  );
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  return sorted.length % 2
    ? sorted[middle]
    : (sorted[middle - 1] + sorted[middle]) / 2;
}

function calculateCityMedians(rows) {
  const cities = new Map();

  for (const row of rows) {
    const price = Number(row.sale_price);
    if (!Number.isFinite(price) || price < minimumSalePrice) {
      continue;
    }

    const key = `${row.city}|${row.state}`;
    if (!cities.has(key)) {
      cities.set(key, {
        city: row.city,
        state: row.state,
        prices: []
      });
    }
    cities.get(key).prices.push(price);
  }

  return [...cities.values()]
    .map((item) => ({
      city: item.city,
      state: item.state,
      median: median(item.prices),
      count: item.prices.length
    }))
    .sort((a, b) => b.median - a.median || a.city.localeCompare(b.city));
}

function formatPrice(price) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(price);
}

function formatCount(count) {
  return new Intl.NumberFormat("en-US").format(count);
}

function renderRankings(rankings) {
  const list = document.querySelector("#ranking-list");
  const fragment = document.createDocumentFragment();

  rankings.forEach((item, index) => {
    const row = document.createElement("li");
    row.className = "ranking-row";

    const rank = document.createElement("span");
    rank.className = "rank-number";
    rank.textContent = String(index + 1).padStart(2, "0");

    const city = document.createElement("span");
    city.className = "city-name";
    city.append(document.createTextNode(item.city));
    const state = document.createElement("span");
    state.className = "city-state";
    state.textContent = item.state;
    city.append(state);

    const price = document.createElement("span");
    price.className = "median-price";
    price.textContent = formatPrice(item.median);

    const count = document.createElement("span");
    count.className = "sale-count";
    count.textContent = formatCount(item.count);

    row.append(rank, city, price, count);
    fragment.append(row);
  });

  list.append(fragment);
  document.querySelector("#rankings").hidden = false;
  document.querySelector("#status").hidden = true;
}

async function loadRankings() {
  const status = document.querySelector("#status");

  try {
    const response = await fetch(csvUrl);
    if (!response.ok) {
      throw new Error(`Could not load data (${response.status})`);
    }

    const rows = parseCsv(await response.text());
    const rankings = calculateCityMedians(rows);
    if (rankings.length === 0) {
      throw new Error("No qualifying sales were found");
    }
    renderRankings(rankings);
  } catch (error) {
    status.classList.add("error");
    status.textContent = `The rankings could not be loaded. ${error.message}`;
  }
}

loadRankings();
