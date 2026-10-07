
let huffmanCodes = {};
let reverseCodes = {};
let encodedResult = "";

// Huffman Node
class Node {
    constructor(char, frequency) {
        this.char = char;
        this.frequency = frequency;
        this.left = null;
        this.right = null;
    }
}

// Generate Huffman Coding
function generateHuffman() {
    const text = document.getElementById("inputText").value;

    if (text.length === 0) {
        alert("Please enter some text first!");
        return;
    }

    // Count character frequency
    const frequency = {};

    for (let char of text) {
        if (frequency[char]) {
            frequency[char]++;
        } else {
            frequency[char] = 1;
        }
    }

    // Create nodes
    let nodes = [];

    for (let char in frequency) {
        nodes.push(new Node(char, frequency[char]));
    }

    // Build Huffman Tree
    while (nodes.length > 1) {
        nodes.sort(function (a, b) {
            return a.frequency - b.frequency;
        });

        const left = nodes.shift();
        const right = nodes.shift();

        const parent = new Node(
            null,
            left.frequency + right.frequency
        );

        parent.left = left;
        parent.right = right;

        nodes.push(parent);
    }

    const root = nodes[0];

    // Generate Huffman Codes
    huffmanCodes = {};
    generateCodes(root, "");

    // Create reverse codes for decoding
    reverseCodes = {};

    for (let char in huffmanCodes) {
        reverseCodes[huffmanCodes[char]] = char;
    }

    // Display frequency table
    displayFrequency(frequency, text.length);

    // Display code table
    displayCodes();

    // Encode text
    encodedResult = "";

    for (let char of text) {
        encodedResult += huffmanCodes[char];
    }

    document.getElementById("encodedText").innerText = encodedResult;

    // Calculate statistics
    const originalBits = text.length * 8;
    const compressedBits = encodedResult.length;

    let compressionRatio = 0;

    if (originalBits > 0) {
        compressionRatio =
            (1 - compressedBits / originalBits) * 100;
    }

    document.getElementById("originalSize").innerText =
        originalBits + " bits";

    document.getElementById("compressedSize").innerText =
        compressedBits + " bits";

    document.getElementById("compressionRatio").innerText =
        compressionRatio.toFixed(2) + "%";

    document.getElementById("characterCount").innerText =
        Object.keys(frequency).length;
}

// Generate Huffman Codes
function generateCodes(node, code) {
    if (node === null) {
        return;
    }

    // Leaf node
    if (node.left === null && node.right === null) {
        huffmanCodes[node.char] = code || "0";
        return;
    }

    generateCodes(node.left, code + "0");
    generateCodes(node.right, code + "1");
}

// Display Frequency Table
function displayFrequency(frequency, total) {
    const table = document.getElementById("frequencyTable");

    table.innerHTML = "";

    for (let char in frequency) {
        const row = document.createElement("tr");

        const probability =
            (frequency[char] / total).toFixed(3);

        const displayChar =
            char === " " ? "Space" : char;

        row.innerHTML =
            "<td>" + displayChar + "</td>" +
            "<td>" + frequency[char] + "</td>" +
            "<td>" + probability + "</td>";

        table.appendChild(row);
    }
}

// Display Huffman Code Table
function displayCodes() {
    const table = document.getElementById("codeTable");

    table.innerHTML = "";

    for (let char in huffmanCodes) {
        const row = document.createElement("tr");

        const displayChar =
            char === " " ? "Space" : char;

        row.innerHTML =
            "<td>" + displayChar + "</td>" +
            '<td><span class="code">' +
            huffmanCodes[char] +
            "</span></td>";

        table.appendChild(row);
    }
}

// Decode Huffman Data
function decodeHuffman() {
    const encoded = document
        .getElementById("decodeInput")
        .value
        .trim();

    if (encoded.length === 0) {
        alert("Please enter encoded binary data!");
        return;
    }

    let currentCode = "";
    let decoded = "";

    for (let bit of encoded) {
        // Only 0 and 1 are allowed
        if (bit !== "0" && bit !== "1") {
            alert("Encoded data must contain only 0 and 1.");
            return;
        }

        currentCode += bit;

        if (reverseCodes[currentCode] !== undefined) {
            decoded += reverseCodes[currentCode];
            currentCode = "";
        }
    }

    if (currentCode !== "") {
        decoded += "[Invalid Code]";
    }

    document.getElementById("decodedText").innerText =
        decoded;
}

// Clear Everything
function clearAll() {
    document.getElementById("inputText").value = "";
    document.getElementById("decodeInput").value = "";

    document.getElementById("frequencyTable").innerHTML = "";
    document.getElementById("codeTable").innerHTML = "";

    document.getElementById("encodedText").innerText =
        "Your encoded data will appear here...";

    document.getElementById("decodedText").innerText =
        "Decoded text will appear here...";

    document.getElementById("originalSize").innerText =
        "0 bits";

    document.getElementById("compressedSize").innerText =
        "0 bits";

    document.getElementById("compressionRatio").innerText =
        "0%";

    document.getElementById("characterCount").innerText =
        "0";

    huffmanCodes = {};
    reverseCodes = {};
    encodedResult = "";
}