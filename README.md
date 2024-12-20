# **ctm-jslinter**
A customizable JavaScript linter that runs on Node.js startup or via a terminal command. Define your own rules and ensure code consistency across your projects.

## **Features**
- Automatically checks files for linting issues when a Node.js process starts.
- Run manually with a terminal command for specific files or folders.
- Lightweight and fast.

## **Installation**
Install globally to use the `ctm-jslinter` command:
```bash
npm install -g ctm-jslinter
```

## **Usage**
### **1. Automatic Mode**
CTM-Check will automatically lint files when your Node.js process starts.

To enable, add the following to your `package.json`:
```json
"scripts": {
  "start": "node -r ctm-jslinter your-app.js"
}
```

### **Manual Mode**
Use the `ctm-jslinter` command to lint specific files or directories.

### **2. Check All Files**
```bash
ctm-jslinter -a, -all
```

### **3. Check Specific File or Folder**
```bash
ctm-jslinter ./src/index.js
```

```bash
ctm-jslinter ./src/
```

### **4. Default Rules**
ctm-jslinter comes with a set of preconfigured rules:

- Disallow unused variables.
- Enforce consistent spacing and indentation.
- Enforce consistent naming convention.

## **Configuration**
You can customize which rules and folders will be ignored by the module by adding a `linter.config.json` to your project:

### **Example Configuration**
```json
{
    "rules": {
        "noVar": true,
        "noUnusedVars": true,
        "noConsoleLog": true,
        "constantCaps": true,
        "consistentIndentation": 4,
        "noTrailingWhitespace": true,
        "noEmptyBlocks": true,
        "useTripleEquals": true,
        "fileNamingConvention": true,
        "maxLinesPerFunction": 25
    },
    "options": {},
    "ignore": ["node_modules", "dist"]
}
```

- **`rules`**: List of enabled rules.
- **`options`**: List of enabled options for the module.
- **`ignore`**: Array of folders or files to exclude from linting.

## Contributing
If you'd like to contribute to this module, feel free to submit a pull request or open an issue to discuss improvements.