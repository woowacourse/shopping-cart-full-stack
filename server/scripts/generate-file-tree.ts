import fs from "node:fs";

import { execSync } from "node:child_process";

const filePath = "docs/FILE_TREE.md";

const fileContent = fs.readFileSync(filePath, "utf8");

const tree = execSync("tree src").toString();

const updated = fileContent.replace(
  /<!-- AUTO-GENERATED START -->[\s\S]*<!-- AUTO-GENERATED END -->/,

  `<!-- AUTO-GENERATED START -->\n${tree}\n<!-- AUTO-GENERATED END -->`,
);

fs.writeFileSync(filePath, updated);
