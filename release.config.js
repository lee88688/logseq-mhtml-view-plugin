module.exports = {
  branches: ["master"],
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "conventionalcommits",
      },
    ],
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    [
      "@semantic-release/npm",
      {
        npmPublish: false,
      },
    ],
    "@semantic-release/git",
    [
      "@semantic-release/exec",
      {
        prepareCmd:
          "zip -qq -r logseq-plugin-mhtml-${nextRelease.version}.zip dist readme.md logo.jpg LICENSE package.json LICENSE",
      },
    ],
    [
      "@semantic-release/github",
      {
        assets: "logseq-plugin-mhtml-*.zip",
      },
    ],
  ],
};
