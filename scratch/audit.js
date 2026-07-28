import fs from 'fs';
import path from 'path';

const srcDir = 'c:/Users/USER/Documents/Github/Wahala/wahala-game/src';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(srcDir);

// Guidelines Rules implementation
files.forEach((file) => {
  const content = fs.readFileSync(file, 'utf-8');
  const relativePath = path.relative(path.join(srcDir, '..'), file).replace(/\\/g, '/');

  // Let's locate the line number for specific matches
  const getLineNumber = (index) => {
    return content.substring(0, index).split('\n').length;
  };

  // Rule 1: Straight ellipses "..." in text/JSX
  // Look for "..." but ignore: import paths, package versions, spread operators like "...state" or "...props", or markdown docs
  const ellipsisRegex = /[^.]\.\.\.[^.]/g;
  let match;
  while ((match = ellipsisRegex.exec(content)) !== null) {
    const matchedStr = match[0];
    const index = match.index;
    const lineNum = getLineNumber(index);
    // Ignore spread operator
    const substring = content.substring(index - 10, index + 10);
    const isSpread = /\.\.\.\s*[a-zA-Z0-9_{}[\]]/.test(matchedStr) || /\{\s*\.\.\./.test(substring);
    if (!isSpread) {
      console.log(`${relativePath}:${lineNum}: Ellipses '...' found in text. Use '…' instead.`);
    }
  }

  // Rule 2: outline-none without focus replacement
  const outlineRegex = /className="[^"]*outline-none[^"]*"/g;
  while ((match = outlineRegex.exec(content)) !== null) {
    const classVal = match[0];
    const lineNum = getLineNumber(match.index);
    if (!classVal.includes('focus') && !classVal.includes('focus-visible')) {
      console.log(`${relativePath}:${lineNum}: 'outline-none' used without focus-visible styles.`);
    }
  }

  // Rule 3: transition-all
  const transitionAllRegex = /className="[^"]*transition-all[^"]*"/g;
  while ((match = transitionAllRegex.exec(content)) !== null) {
    const lineNum = getLineNumber(match.index);
    console.log(`${relativePath}:${lineNum}: 'transition-all' used. Explicitly list animated properties.`);
  }

  // Rule 4: Buttons missing type attribute
  // Find all <button tags and see if they have type attribute
  const buttonTagRegex = /<button\b([^>]*)(?:\/?>|>)/gi;
  while ((match = buttonTagRegex.exec(content)) !== null) {
    const attributes = match[1];
    const lineNum = getLineNumber(match.index);
    if (!attributes.includes('type=')) {
      console.log(`${relativePath}:${lineNum}: <button> lacks explicit 'type' attribute.`);
    }
  }

  // Rule 5: onClick on non-interactive elements
  const onClickNonSemanticRegex = /<(div|span|section|article|p|h[1-6])\b([^>]*onClick=[^>]*)(?:\/?>|>)/gi;
  while ((match = onClickNonSemanticRegex.exec(content)) !== null) {
    const tag = match[1];
    const attrs = match[2];
    const lineNum = getLineNumber(match.index);
    if (!attrs.includes('role=') || !attrs.includes('onKeyDown')) {
      console.log(`${relativePath}:${lineNum}: onClick on non-semantic <${tag}> without role="button" and onKeyDown.`);
    }
  }

  // Rule 6: Input elements audits
  const inputRegex = /<input\b([^>]*)(?:\/?>|>)/gi;
  while ((match = inputRegex.exec(content)) !== null) {
    const attrs = match[1];
    const lineNum = getLineNumber(match.index);
    if (attrs.includes('type="button"') || attrs.includes('type="submit"') || attrs.includes('type="checkbox"') || attrs.includes('type="radio"')) {
      continue;
    }
    if (!attrs.includes('autocomplete=')) {
      console.log(`${relativePath}:${lineNum}: <input> lacks 'autocomplete' attribute.`);
    }
    const isTextLike = attrs.includes('type="text"') || attrs.includes('type="email"') || attrs.includes('placeholder=') || !attrs.includes('type=');
    if (isTextLike && (attrs.includes('email') || attrs.includes('username') || attrs.includes('code')) && !attrs.includes('spellCheck')) {
      console.log(`${relativePath}:${lineNum}: Text/email input lacks 'spellCheck={false}'.`);
    }
  }

  // Rule 7: SVGs missing accessibility labels/attributes
  const svgRegex = /<svg\b([^>]*)(?:\/?>|>)/gi;
  while ((match = svgRegex.exec(content)) !== null) {
    const attrs = match[1];
    const lineNum = getLineNumber(match.index);
    if (!attrs.includes('aria-hidden=') && !attrs.includes('aria-label=')) {
      console.log(`${relativePath}:${lineNum}: <svg> lacks 'aria-hidden="true"' or 'aria-label'.`);
    }
  }

  // Rule 8: Straight double quotes inside JSX text node (simple heuristic)
  // Look for text nodes in JSX like: <div>"my text"</div>
  // Let's check for standard double quotes in text segments
  const straightQuotesRegex = />\s*[^<]*"[^<]*\s*</gi;
  while ((match = straightQuotesRegex.exec(content)) !== null) {
    const lineNum = getLineNumber(match.index);
    console.log(`${relativePath}:${lineNum}: Straight quotes found in text node. Use curly quotes instead.`);
  }

  // Rule 9: Dynamic viewport height check for mobile feel
  // Check if pages use min-h-screen instead of min-h-dvh / h-dvh
  if (file.includes('src/pages/') || file.includes('src/components/ui/PageShell.tsx')) {
    const minHScreenRegex = /min-h-screen/g;
    while ((match = minHScreenRegex.exec(content)) !== null) {
      const lineNum = getLineNumber(match.index);
      console.log(`${relativePath}:${lineNum}: 'min-h-screen' used. Use 'min-h-[100dvh]' or 'min-h-dvh' to avoid mobile browser address bar layout jumps.`);
    }
  }
});
