@echo off
chcp 65001 >nul
setlocal
node -e "const fs=require('fs'),f=process.argv[1],s=fs.readFileSync(f,'utf8'),m='\n//#__ARCHIVE_'+'BUNDLER__';new Function('require','__batFile','__cliOut',s.slice(s.indexOf(m)+m.length))(require,f,process.argv[2]||'')" "%~f0" "%~1"
if errorlevel 1 (
  echo [ERROR] Qua trinh dong goi 1 file HTML that bai!
  pause
  exit /b 1
)
exit /b 0
//#__ARCHIVE_BUNDLER__
'use strict';

const fs = require('fs');
const path = require('path');

const batDir = path.dirname(__batFile);
const projectDir = fs.existsSync(path.join(batDir, 'index.html'))
  ? batDir
  : path.join(batDir, 'sakuga-multiverse');

const entryHtmlPath = path.join(projectDir, 'index.html');
if (!fs.existsSync(entryHtmlPath)) {
  console.error('Khong tim thay index.html tai:', entryHtmlPath);
  process.exit(1);
}

const defaultOutName = 'sakuga-multiverse-single.html';
const outPath = __cliOut
  ? path.resolve(batDir, __cliOut)
  : path.join(projectDir, defaultOutName);

function stripCssComments(css) {
  let out = '';
  let i = 0;
  const n = css.length;
  let mode = 'NORMAL';

  while (i < n) {
    const ch = css[i];
    const next = css[i + 1];

    if (mode === 'NORMAL') {
      if (ch === '/' && next === '*') {
        mode = 'COMMENT';
        i += 2;
        continue;
      }
      if (ch === "'") {
        mode = 'SQ';
        out += ch;
        i++;
        continue;
      }
      if (ch === '"') {
        mode = 'DQ';
        out += ch;
        i++;
        continue;
      }
      out += ch;
      i++;
    } else if (mode === 'COMMENT') {
      if (ch === '*' && next === '/') {
        mode = 'NORMAL';
        i += 2;
      } else {
        i++;
      }
    } else if (mode === 'SQ') {
      if (ch === '\\' && i + 1 < n) {
        out += ch + next;
        i += 2;
      } else {
        if (ch === "'") mode = 'NORMAL';
        out += ch;
        i++;
      }
    } else if (mode === 'DQ') {
      if (ch === '\\' && i + 1 < n) {
        out += ch + next;
        i += 2;
      } else {
        if (ch === '"') mode = 'NORMAL';
        out += ch;
        i++;
      }
    }
  }

  return out
    .split(/\r?\n/)
    .map((line) => line.replace(/[ \t]+$/, ''))
    .filter((line) => line.trim().length > 0)
    .join('\n');
}

const REGEX_KEYWORDS = new Set([
  'return', 'case', 'throw', 'typeof', 'void', 'delete',
  'in', 'of', 'instanceof', 'new', 'yield', 'await', 'else', 'do',
]);

function isIdentStart(ch) {
  if (!ch) return false;
  const c = ch.charCodeAt(0);
  return (c >= 65 && c <= 90) || (c >= 97 && c <= 122) || c === 95 || c === 36 || c > 127;
}

function isIdentPart(ch) {
  if (!ch) return false;
  const c = ch.charCodeAt(0);
  return isIdentStart(ch) || (c >= 48 && c <= 57);
}

function isDigit(ch) {
  if (!ch) return false;
  const c = ch.charCodeAt(0);
  return c >= 48 && c <= 57;
}

function stripJsComments(src) {
  const chunks = [];
  let i = 0;
  const n = src.length;
  let mode = 'CODE';
  let regexAllowed = true;
  let regexInClass = false;
  const tplBraceStack = [];

  const popTrailingSpacesOnCurrentLine = () => {
    while (chunks.length > 0) {
      const top = chunks[chunks.length - 1];
      if (top === ' ' || top === '\t') {
        chunks.pop();
      } else {
        break;
      }
    }
    const last = chunks.length > 0 ? chunks[chunks.length - 1] : '\n';
    return last === '\n';
  };

  while (i < n) {
    const ch = src[i];
    const next = src[i + 1];

    if (mode === 'CODE') {
      if (ch === '\r') {
        i++;
        continue;
      }

      if (ch === '/' && next === '/') {
        const lineWasEmpty = popTrailingSpacesOnCurrentLine();
        i += 2;
        while (i < n && src[i] !== '\n') i++;
        if (lineWasEmpty) {
          if (i < n && src[i] === '\n') i++;
        }
        continue;
      }

      if (ch === '/' && next === '*') {
        const prevChar = chunks.length > 0 ? chunks[chunks.length - 1] : '';
        const lineWasEmpty = popTrailingSpacesOnCurrentLine();
        i += 2;
        let crossedNewline = false;
        while (i < n && !(src[i] === '*' && src[i + 1] === '/')) {
          if (src[i] === '\n') crossedNewline = true;
          i++;
        }
        if (i < n) i += 2;

        let probe = i;
        while (probe < n && (src[probe] === ' ' || src[probe] === '\t' || src[probe] === '\r')) probe++;
        if (lineWasEmpty && (probe >= n || src[probe] === '\n')) {
          i = probe < n ? probe + 1 : probe;
        } else if (crossedNewline) {
          chunks.push('\n');
        } else if (isIdentPart(prevChar) && isIdentPart(src[i])) {
          chunks.push(' ');
        }
        continue;
      }

      if (ch === "'") {
        chunks.push(ch);
        mode = 'SQ';
        regexAllowed = false;
        i++;
        continue;
      }

      if (ch === '"') {
        chunks.push(ch);
        mode = 'DQ';
        regexAllowed = false;
        i++;
        continue;
      }

      if (ch === '`') {
        chunks.push(ch);
        mode = 'TPL';
        regexAllowed = false;
        i++;
        continue;
      }

      if (ch === '/' && regexAllowed) {
        chunks.push(ch);
        mode = 'REGEX';
        regexInClass = false;
        regexAllowed = false;
        i++;
        continue;
      }

      if (isIdentStart(ch)) {
        let word = '';
        while (i < n && isIdentPart(src[i])) {
          word += src[i];
          chunks.push(src[i]);
          i++;
        }
        regexAllowed = REGEX_KEYWORDS.has(word);
        continue;
      }

      if (isDigit(ch)) {
        while (i < n && (isIdentPart(src[i]) || src[i] === '.')) {
          chunks.push(src[i]);
          i++;
        }
        regexAllowed = false;
        continue;
      }

      if (ch === '{') {
        if (tplBraceStack.length > 0) {
          tplBraceStack[tplBraceStack.length - 1]++;
        }
        chunks.push(ch);
        regexAllowed = true;
        i++;
        continue;
      }

      if (ch === '}') {
        if (tplBraceStack.length > 0 && tplBraceStack[tplBraceStack.length - 1] === 0) {
          tplBraceStack.pop();
          chunks.push(ch);
          mode = 'TPL';
          regexAllowed = false;
          i++;
          continue;
        }
        if (tplBraceStack.length > 0) {
          tplBraceStack[tplBraceStack.length - 1]--;
        }
        chunks.push(ch);
        regexAllowed = true;
        i++;
        continue;
      }

      if ((ch === '+' && next === '+') || (ch === '-' && next === '-')) {
        chunks.push(ch, next);
        regexAllowed = false;
        i += 2;
        continue;
      }

      if (ch === ')' || ch === ']') {
        chunks.push(ch);
        regexAllowed = false;
        i++;
        continue;
      }

      if (ch === '\n') {
        popTrailingSpacesOnCurrentLine();
        if (chunks.length > 0 && chunks[chunks.length - 1] !== '\n') {
          chunks.push('\n');
        }
        i++;
        continue;
      }

      if (ch !== ' ' && ch !== '\t') {
        regexAllowed = '=([!&|?:;~+-*%^<>/,'.includes(ch);
      }
      chunks.push(ch);
      i++;
    } else if (mode === 'SQ') {
      if (ch === '\\' && i + 1 < n) {
        chunks.push(ch, next);
        i += 2;
      } else {
        if (ch === "'") mode = 'CODE';
        chunks.push(ch);
        i++;
      }
    } else if (mode === 'DQ') {
      if (ch === '\\' && i + 1 < n) {
        chunks.push(ch, next);
        i += 2;
      } else {
        if (ch === '"') mode = 'CODE';
        chunks.push(ch);
        i++;
      }
    } else if (mode === 'REGEX') {
      if (ch === '\\' && i + 1 < n) {
        chunks.push(ch, next);
        i += 2;
      } else {
        if (ch === '[') regexInClass = true;
        else if (ch === ']') regexInClass = false;
        else if (ch === '/' && !regexInClass) {
          chunks.push(ch);
          i++;
          while (i < n && /[dgimsuvy]/.test(src[i])) {
            chunks.push(src[i]);
            i++;
          }
          mode = 'CODE';
          regexAllowed = false;
          continue;
        }
        chunks.push(ch);
        i++;
      }
    } else if (mode === 'TPL') {
      if (ch === '\r') {
        i++;
        continue;
      }
      if (ch === '\\' && i + 1 < n) {
        chunks.push(ch, next);
        i += 2;
      } else if (ch === '/' && next === '*') {
        i += 2;
        while (i < n && !(src[i] === '*' && src[i + 1] === '/')) i++;
        if (i < n) i += 2;
      } else if (ch === '<' && src.slice(i, i + 4) === '<!--') {
        i += 4;
        while (i < n && src.slice(i, i + 3) !== '-->') i++;
        if (i < n) i += 3;
      } else if (ch === '$' && next === '{') {
        chunks.push('$', '{');
        tplBraceStack.push(0);
        mode = 'CODE';
        regexAllowed = true;
        i += 2;
      } else if (ch === '`') {
        chunks.push(ch);
        mode = 'CODE';
        regexAllowed = false;
        i++;
      } else {
        chunks.push(ch);
        i++;
      }
    }
  }

  return chunks.join('').trim();
}

function stripHtmlComments(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, '')
    .split(/\r?\n/)
    .map((line) => line.replace(/[ \t]+$/, ''))
    .filter((line) => line.trim().length > 0)
    .join('\n');
}

let html = stripHtmlComments(fs.readFileSync(entryHtmlPath, 'utf8'));
let cssCount = 0;
let jsCount = 0;

html = html.replace(/<link\b[^>]*rel=["']stylesheet["'][^>]*>/gi, (tag) => {
  const hrefMatch = tag.match(/\bhref=["']([^"']+)["']/i);
  if (!hrefMatch) return tag;
  const href = hrefMatch[1];
  if (/^(https?:)?\/\//i.test(href)) return tag;
  const cssFile = path.resolve(projectDir, href);
  const rawCss = fs.readFileSync(cssFile, 'utf8');
  const cleanCss = stripCssComments(rawCss);
  cssCount++;
  return `<style>\n${cleanCss}\n</style>`;
});

html = html.replace(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>\s*<\/script>/gi, (tag, srcAttr) => {
  if (/^(https?:)?\/\//i.test(srcAttr)) return tag;
  const jsFile = path.resolve(projectDir, srcAttr);
  const rawJs = fs.readFileSync(jsFile, 'utf8');
  const cleanJs = stripJsComments(rawJs);
  jsCount++;
  return `<script>\n${cleanJs}\n</script>`;
});

const finalHtml = html + '\n';
fs.writeFileSync(outPath, finalHtml, 'utf8');

if (batDir !== projectDir && !__cliOut) {
  const rootCopy = path.join(batDir, defaultOutName);
  fs.writeFileSync(rootCopy, finalHtml, 'utf8');
  console.log(`[OK] Da tao ban sao tai: ${rootCopy}`);
}

const kb = (Buffer.byteLength(finalHtml, 'utf8') / 1024).toFixed(1);
console.log(`[OK] Da gop thanh cong 1 file HTML duy nhat (da xoa 100% comment)!`);
console.log(`     - CSS inline : ${cssCount} file`);
console.log(`     - JS inline  : ${jsCount} file`);
console.log(`     - Dung luong : ${kb} KB`);
console.log(`     - File xuat  : ${outPath}`);
