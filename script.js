document
  .getElementById("fileStructureForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const input = document.getElementById("fileStructureInput").value.trim();
    if (!input) return;

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
      downloadLink.style.display = "block"; // Show the download link
      document.getElementById("downloadLinkContainer").style.display = "block"; // Ensure container is visible
      document.getElementById("fileStructureForm").style.display = "none"; // Hide form
    } catch (error) {
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
