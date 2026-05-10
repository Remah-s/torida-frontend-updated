const fs = require('fs');
const path = require('path');

const servicesDir = path.join(__dirname, 'src', 'services');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  // Match `const response = await api.get<PaginatedData<TYPE>>(URL); return response.data;`
  const regex = /const response = await api\.get<PaginatedData<([^>]+)>>\(([^)]+)\);\s*return response\.data;/g;
  if (regex.test(content)) {
    content = content.replace(regex, 'return await api.getPaginated<$1>($2);');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file.endsWith('.ts')) {
      processFile(path.join(dir, file));
    }
  }
}

processDirectory(servicesDir);
