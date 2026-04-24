const STORAGE_KEY = "neuroweb-v1";

const elements = {
  thoughtForm: document.getElementById("thoughtForm"),
  connectionForm: document.getElementById("connectionForm"),
  titleInput: document.getElementById("titleInput"),
  contentInput: document.getElementById("contentInput"),
  tagInput: document.getElementById("tagInput"),
  fromSelect: document.getElementById("fromSelect"),
  toSelect: document.getElementById("toSelect"),
  detailsContent: document.getElementById("detailsContent"),
  randomThoughtBtn: document.getElementById("randomThoughtBtn"),
  statusMessage: document.getElementById("statusMessage"),
  network: document.getElementById("network"),
};

const state = loadState();
const nodes = new vis.DataSet();
const edges = new vis.DataSet();
let network;

bootstrap();

function bootstrap() {
  if (state.thoughts.length === 0) {
    seedStarterThoughts();
  }

  initNetwork();
  wireEvents();
  syncGraph();
  renderSelectOptions();
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return { thoughts: [], connections: [] };
  }

  try {
    const parsed = JSON.parse(raw);
    return {
      thoughts: Array.isArray(parsed.thoughts) ? parsed.thoughts : [],
      connections: Array.isArray(parsed.connections) ? parsed.connections : [],
    };
  } catch {
    return { thoughts: [], connections: [] };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function seedStarterThoughts() {
  const starter = [
    {
      id: makeId(),
      title: "Why consistency beats motivation",
      content: "Progress compounds when actions stay steady and simple.",
      tag: "habits",
    },
    {
      id: makeId(),
      title: "Discipline as freedom",
      content: "Constraints reduce chaos and create room for creative focus.",
      tag: "discipline",
    },
  ];

  state.thoughts.push(...starter);
  state.connections.push({ from: starter[0].id, to: starter[1].id });
  saveState();
}

function initNetwork() {
  network = new vis.Network(
    elements.network,
    { nodes, edges },
    {
      autoResize: true,
      interaction: {
        hover: true,
        navigationButtons: false,
        keyboard: true,
      },
      physics: {
        enabled: true,
        barnesHut: {
          springLength: 160,
          springConstant: 0.03,
          damping: 0.2,
          gravitationalConstant: -3200,
        },
      },
      edges: {
        color: { color: "#4f8bd6", highlight: "#8fd6ff" },
        smooth: {
          enabled: true,
          type: "dynamic",
          roundness: 0.35,
        },
        width: 1.4,
      },
      nodes: {
        shape: "dot",
        size: 18,
        color: {
          border: "#9ed9ff",
          background: "#2f5ec9",
          highlight: { border: "#ffffff", background: "#67b7ff" },
        },
        font: {
          color: "#d9edff",
          size: 14,
          face: "Inter",
        },
        shadow: {
          enabled: true,
          color: "rgba(102, 212, 255, 0.45)",
          size: 18,
          x: 0,
          y: 0,
        },
      },
    }
  );

  network.on("click", ({ nodes: selected }) => {
    if (selected.length > 0) {
      showThoughtDetails(selected[0]);
    }
  });
}

function wireEvents() {
  elements.thoughtForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = elements.titleInput.value.trim();
    const content = elements.contentInput.value.trim();
    const tag = elements.tagInput.value.trim();

    if (!title || !content) {
      setStatus("Title and description are required.");
      return;
    }

    const thought = {
      id: makeId(),
      title,
      content,
      tag,
    };

    state.thoughts.push(thought);
    saveState();
    syncGraph();
    renderSelectOptions();
    elements.thoughtForm.reset();
    setStatus("Thought added.");
  });

  elements.connectionForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const from = elements.fromSelect.value;
    const to = elements.toSelect.value;

    if (!from || !to || from === to) {
      setStatus("Choose two different thoughts to connect.");
      return;
    }

    const exists = state.connections.some(
      (connection) =>
        (connection.from === from && connection.to === to) ||
        (connection.from === to && connection.to === from)
    );

    if (exists) {
      setStatus("Those thoughts are already connected.");
      return;
    }

    state.connections.push({ from, to });
    saveState();
    syncGraph();
    setStatus("Connection created.");
  });

  elements.randomThoughtBtn.addEventListener("click", () => {
    if (state.thoughts.length === 0) {
      setStatus("Add thoughts to explore the graph.");
      return;
    }

    const randomThought = state.thoughts[Math.floor(Math.random() * state.thoughts.length)];
    focusNode(randomThought.id);
    showThoughtDetails(randomThought.id);
    setStatus("Exploring random thought.");
  });
}

function syncGraph() {
  nodes.clear();
  edges.clear();

  state.thoughts.forEach((thought) => {
    nodes.add({
      id: thought.id,
      label: thought.title,
      title: thought.content,
      value: 16,
    });
  });

  state.connections.forEach((connection, index) => {
    edges.add({
      id: `${connection.from}-${connection.to}-${index}`,
      from: connection.from,
      to: connection.to,
    });
  });
}

function renderSelectOptions() {
  const options = state.thoughts
    .map((thought) => `<option value="${thought.id}">${escapeHtml(thought.title)}</option>`)
    .join("");

  const placeholder = '<option value="" disabled selected>Select thought</option>';
  elements.fromSelect.innerHTML = placeholder + options;
  elements.toSelect.innerHTML = placeholder + options;

  const disabled = state.thoughts.length < 2;
  elements.fromSelect.disabled = disabled;
  elements.toSelect.disabled = disabled;
}

function showThoughtDetails(id) {
  const thought = state.thoughts.find((item) => item.id === id);

  if (!thought) {
    elements.detailsContent.innerHTML = "<p>Thought not found.</p>";
    return;
  }

  const connectedCount = state.connections.filter(
    (connection) => connection.from === id || connection.to === id
  ).length;

  elements.detailsContent.innerHTML = `
    <h3 class="thought-title">${escapeHtml(thought.title)}</h3>
    <p>${escapeHtml(thought.content)}</p>
    ${thought.tag ? `<p><span class="tag-pill">#${escapeHtml(thought.tag)}</span></p>` : ""}
    <p>Connections: ${connectedCount}</p>
  `;
}

function focusNode(id) {
  network.selectNodes([id]);
  network.focus(id, {
    scale: 1.1,
    animation: {
      duration: 650,
      easingFunction: "easeInOutCubic",
    },
  });
}

function setStatus(message) {
  elements.statusMessage.textContent = message;
}

function makeId() {
  return crypto.randomUUID();
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
