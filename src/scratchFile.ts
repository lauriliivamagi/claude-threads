interface RenderScratchFileArgs {
  inquiry: string;
  sourceRelativePath: string;
  startLine: number;
  endLine: number;
  selectedText: string;
  backLinkRelative: string;
}

export function renderScratchFile(args: RenderScratchFileArgs): string {
  const { inquiry, sourceRelativePath, startLine, endLine, selectedText, backLinkRelative } = args;
  const range = startLine === endLine ? `${startLine}` : `${startLine}-${endLine}`;
  const quoted = selectedText
    .split("\n")
    .map((line) => `> ${line}`)
    .join("\n");
  return `# Inquiry\n\n${inquiry}\n\n## Source\n\n[${sourceRelativePath}:${range}](${backLinkRelative})\n\n## Selected excerpt\n\n${quoted}\n\n## Notes\n\n`;
}
