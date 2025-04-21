#!/bin/bash
echo "🔧 Iniciando setup profesional para Code Server..."

EXTENSIONS=(
  esbenp.prettier-vscode
  dbaeumer.vscode-eslint
  formulahendry.auto-close-tag
  formulahendry.auto-rename-tag
  dsznajder.es7-react-js-snippets
  vscode-icons-team.vscode-icons
  ms-vsliveshare.vsliveshare
  gruntfuggly.todo-tree
  github.copilot
  eamodio.gitlens
)

for extension in "${EXTENSIONS[@]}"; do
  code-server --install-extension "$extension" --force
done

mkdir -p ~/.local/share/code-server/User
cat > ~/.local/share/code-server/User/settings.json <<EOF
{
  "workbench.colorTheme": "One Dark Pro",
  "editor.fontFamily": "Fira Code, monospace",
  "editor.fontLigatures": true,
  "editor.formatOnSave": true,
  "editor.tabSize": 2,
  "files.autoSave": "onFocusChange",
  "terminal.integrated.fontSize": 14,
  "todo-tree.general.tags": ["TODO", "FIXME", "NOTE", "HACK"],
  "vsicons.presets.folders": true,
  "vsicons.dontShowNewVersionMessage": true
}
EOF

echo "✅ Setup completado. Reinicia Code Server para aplicar todos los cambios."
