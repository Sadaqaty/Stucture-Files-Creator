# Structure File Creator

## Overview

The **Structure File Creator** is a powerful tool designed to generate complex file and folder structures programmatically. It helps developers create extensive project architectures by defining the structure in a simple format. The tool will automatically generate the corresponding directories and files based on the provided input.

This tool is perfect for large projects where creating and organizing hundreds or even thousands of files and directories would otherwise be time-consuming.

## Key Features

- Create complex file and folder structures with ease.
- Accepts input as formatted text to define the hierarchy.
- Handles multiple layers of nesting for files and folders.
- Supports creation of thousands of files and folders in an organized structure.
- Efficient and fast generation of files even for large-scale projects.

## Test Results

During the development of this tool, extensive testing was performed. Below is a summary of the test cases:

### Test Cases

1. **Test 1 - 2:** Failure (incorrect folder hierarchy and file names).
2. **Test 3:** Little Success (File and folder names were correct, but the hierarchy was slightly off).
3. **Test 4 - 8:** Failure (various issues with names and hierarchy).
4. **Test 9:** Success (All files and folders were placed correctly, and names matched).
5. **Test 10:** Success (A complex structure was tested, and it generated as expected).
6. **Test 11:** Success (Used a file structure with over 1000 files. All files were created in their respective folders without issues).
7. **Test 12:** Success (Tested a highly complex structure with over 5000 files. The tool successfully generated the entire structure without errors).

## How It Works

Users provide the desired file and folder structure as formatted text (using symbols like `├──`, `│ ├──`, `└──`, etc.). The tool parses this input and generates the corresponding directories and files in the output directory.

### Example Input

To use the tool, you need to provide the file structure in a specific text format. Here’s an example input:

```plaintext
my-large-project/
├── src/
│   ├── components/
│   │   ├── ComponentA.js
│   │   ├── ComponentB.js
│   ├── utils/
│   │   ├── utilityA.js
│   │   ├── utilityB.js
│   ├── services/
│   │   ├── serviceA.js
│   │   ├── serviceB.js
├── tests/
│   ├── ComponentA.test.js
│   ├── ComponentB.test.js
├── config/
│   ├── webpack.config.js
│   ├── babel.config.js
├── scripts/
│   ├── build.js
│   ├── start.js
├── public/
│   ├── index.html
│   ├── favicon.ico
├── .gitignore
├── README.md
├── package.json
├── package-lock.json
└── LICENSE
