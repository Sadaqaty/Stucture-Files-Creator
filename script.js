document.getElementById("fileStructureInput").addEventListener("input", (event) => {
  const input = event.target.value.trim();
  const preview = document.getElementById("structurePreview");
  if (!input) {
    preview.innerHTML = "<em>Preview will appear here...</em>";
    return;
  }
  const lines = input.split("\n").map((line) => line.trim()).filter((line) => line.length > 0);
  const fileStructure = parseFileStructure(lines);
  preview.innerHTML = renderPreview(fileStructure);
});

function renderPreview(structure, indent = "") {
  let html = "<ul>";
  for (const key in structure) {
    if (structure[key] === null) {
      html += `<li><span class="file-icon">📄</span> ${key}</li>`;
    } else {
      html += `<li><span class="folder-icon">📁</span> <strong>${key}</strong>${renderPreview(structure[key], indent + "&nbsp;&nbsp;")}</li>`;
    }
  }
  html += "</ul>";
  return html;
}

document.getElementById("resetBtn").addEventListener("click", () => {
  document.getElementById("fileStructureForm").style.display = "flex";
  document.getElementById("downloadLinkContainer").style.display = "none";
  document.getElementById("fileStructureInput").value = "";
  document.getElementById("structurePreview").innerHTML = "<em>Preview will appear here...</em>";
  document.getElementById("feedback").textContent = "";
});

document
  .getElementById("fileStructureForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const input = document.getElementById("fileStructureInput").value.trim();
    if (!input) {
      document.getElementById("feedback").textContent = "Please enter a structure!";
      return;
    }

    const lines = input
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    const fileStructure = parseFileStructure(lines);

    try {
      const zipBlob = await generateZip(fileStructure);
      const url = URL.createObjectURL(zipBlob);
      const downloadLink = document.getElementById("downloadLink");
      downloadLink.href = url;
      downloadLink.style.display = "block";
      document.getElementById("downloadLinkContainer").style.display = "block";
      document.getElementById("fileStructureForm").style.display = "none";
      document.getElementById("feedback").textContent = "ZIP file created successfully!";
    } catch (error) {
      document.getElementById("feedback").textContent = "Error generating ZIP file!";
      console.error("Error generating ZIP file:", error);
    }
  });

function parseFileStructure(lines) {
  const root = {};
  const stack = [root];
  const symbols = {
    directory: "├── ",
    lastDirectory: "└── ",
    branch: "│   ",
    spacing: "    ",
  };

  lines.forEach((line) => {
    let level = 0;
    while (line.startsWith(symbols.branch)) {
      level++;
      line = line.substring(symbols.branch.length);
    }
    if (line.startsWith(symbols.spacing)) {
      line = line.substring(symbols.spacing.length);
    }

    const trimmedLine = line.replace(/^[\s├─└]*\s*/, "").trim();
    if (trimmedLine === "") return;

    // Adjust the stack based on the level
    if (level >= stack.length) {
      stack.push({});
    } else if (level < stack.length - 1) {
      stack.length = level + 1;
    }

    if (trimmedLine.endsWith("/")) {
      // Directory
      const folder = {};
      stack[level][trimmedLine.slice(0, -1)] = folder;
      stack[level + 1] = folder;
    } else {
      // File
      stack[level][trimmedLine] = null;
    }
  });

  return root;
}

async function generateZip(fileStructure) {
  const zip = new JSZip();

  function addFiles(folder, path = "") {
    Object.keys(folder).forEach((key) => {
      const value = folder[key];
      if (value === null) {
        zip.file(path + key, ""); // Create an empty file
      } else {
        const newFolder = zip.folder(path + key + "/"); // Create a new folder
        addFiles(value, path + key + "/"); // Recursively add files to the new folder
      }
    });
  }

  addFiles(fileStructure);

  return zip.generateAsync({ type: "blob" });
}
