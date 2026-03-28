module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [2, "always", ["chore", "feat", "fix", "refactor", "docs"]],
    "scope-empty": [2, "never"],
    "subject-empty": [2, "never"],
    "subject-case": [2, "never", ["sentence-case", "start-case", "pascal-case", "upper-case"]],
  },
  parserPreset: {
    parserOpts: {
      noteKeywords: ["BREAKING CHANGE", "BREAKING CHANGES", "docs"],
    },
  },
  // Documentação de referência: https://commitlint.js.org/#/reference-rules
  // Regras esperadas:
  // chore: Atualização de tarefas que não impactam o código de produção.
  // feat: Adições de novas funcionalidades.
  // fix: Correções de bugs.
  // refactor: Mudanças que não alteram a funcionalidade final.
  // docs: Inclusão ou alteração em arquivos de documentação.
};
