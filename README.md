🚀 Code to Flowchart Generator

An AI-powered desktop application that converts source code into clean, book-style flowcharts using Mermaid syntax. Built with Electron, React, and Express, this tool helps students, developers, and educators visualize program logic across multiple programming languages.


---

✨ Features

🔍 Automatic Language Detection (C, C++, Java, Python, JavaScript, TypeScript)

🧠 AST-Based Parsing for accurate logic extraction

📊 Mermaid Flowchart Generation (VTU-style formatting)

⚠️ Compiler-like Error Handling with clear messages

🎨 Syntax Highlighting using Monaco Editor

💾 Export Options: SVG / PDF

🖥️ Desktop App using Electron

🔌 Modular Backend APIs using Express



---

🏗️ Tech Stack

Layer	Technology

Frontend	React + Tailwind CSS
Backend	Express.js
Desktop	Electron
Editor	Monaco Editor
Flowcharts	Mermaid.js
Parsing	Custom AST parsers




⚙️ Installation

1️⃣ Clone the repository

git clone https://github.com/karthikc1125/code-to-flowchart-generator.git
cd code-to-flowchart-generator

2️⃣ Install dependencies

> ⚠️ Libraries are not bundled intentionally



# frontend
cd frontend
npm install

# backend
cd ../backend
npm install

# electron
cd ../electron
npm install


---

▶️ Running the Application

Start Backend

cd backend
npm start

Start Frontend

cd frontend
npm run dev

Launch Electron App

cd electron
npm start


---

🔄 Workflow

1. User pastes code into Monaco Editor


2. Language is auto-detected


3. Code is sent to backend API


4. AST parser analyzes structure


5. Logic is converted to Mermaid flowchart


6. Flowchart is rendered visually




---

🧪 Supported Languages

C

C++

Java

Python

JavaScript

TypeScript



---

📌 Example Output (Mermaid)

flowchart TD
A([start]) --> B[/read n/]
B --> C[set i=0]
C --> D{i < n}
D -->|Yes| E[/print i/]
E --> F[i+=1]
F --> D
D -->|No| G([end])


---

⚠️ Error Handling

Detects syntax errors

Shows language-specific error messages

Prevents invalid flowchart generation



---

🎯 Use Cases

📚 Students learning programming logic

👨‍🏫 Teachers creating visual explanations

💻 Developers debugging code flow

🧠 Interview preparation



---

🛠️ Future Improvements

🤖 LLM-based enhancement for complex logic

🌐 Web version deployment

📁 File upload support

🔄 Reverse flowchart → code generation



---

🤝 Contributing

Contributions are welcome!

1. Fork the repo


2. Create a new branch


3. Make your changes


4. Submit a PR

👨‍💻 Author

Karthik C
Web Development Intern | Full Stack Developer



⭐ Support

If you like this project, give it a ⭐ on GitHub!

