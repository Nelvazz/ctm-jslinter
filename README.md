# **ctm-jslinter**
A customizable JavaScript linter that runs via a terminal command. Define your own rules and ensure code consistency across your projects.

## **Features**
- Run manually with a terminal command for specific files or folders.
- Lightweight and fast.

## **Installation**
Install globally to use the `ctm-jslinter` command:
```bash
npm install -g ctm-jslinter
```

## **Usage**
### **Manual Mode**
Use the `ctm-jslinter` command to lint specific files or directories.

### **1. Check All Files**
```bash
ctm-jslinter -a, -all
```

### **2. Check Specific File or Folder**
```bash
ctm-jslinter ./src/index.js
```

```bash
ctm-jslinter ./src/
```

### **3. Default Rules**
ctm-jslinter comes with a set of preconfigured rules:

- Disallow unused variables.
- Enforce consistent spacing and indentation.
- Enforce consistent naming convention.

## **Configuration**
You can customize which rules and folders will be ignored by the module by executing the following command to create a config file:
```bash
ctm-jslinter -i, -init
```

### **Example Configuration**
```json
{
    "rules": {
        "noVar": true,
        "noConsoleLog": false,
        "constantCaps": true,
        "enforceSemicolon": true,
        "consistentIndentation": 4,
        "noTrailingWhitespace": true,
        "preferConst": true,
        "noEmptyBlocks": true,
        "useTripleEquals": true,
        "spaceBetweenOperators": true,
        "fileNamingConvention": true,
        "maxLinesPerFunction": 25
    },
    "options": {},
    "ignore": ["node_modules", "dist", "temp"]
}
```

- **`rules`**: List of enabled rules.
- **`options`**: List of enabled options for the module.
- **`ignore`**: Array of folders or files to exclude from linting.

## Contributing
If you'd like to contribute to this module, feel free to submit a pull request or open an issue to discuss improvements.