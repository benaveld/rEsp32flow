const prettier = (stagedFiles) =>
  `prettier --list-different --write ${stagedFiles.join(" ")}`;

export default {
  "*.ts*": (stagedFiles) => [
    prettier(stagedFiles),
    "tsc -p tsconfig.json --noEmit --pretty",
    stagedFiles.length > 10 ? 'eslint .' : `eslint ${stagedFiles.join(" ")}`,
  ],
  "*.md": prettier,
  "*.json": prettier
};
