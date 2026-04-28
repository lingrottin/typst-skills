---
name: typst-author
description: Generate idiomatic Typst (.typ) code, edit and troubleshoot Typst documents and projects, and answer Typst syntax/reference questions. Use when working with .typ files or when the user explicitly asks for Typst document creation, editing, debugging, compilation, formatting, template work, or package usage.
---

# typst-author skill

## Overview

This skill helps agents generate, edit, and reason about Typst documents. It provides quick-start examples, detailed workflows, and links to the full Typst documentation.

## Minimal document example

```typst
#set document(title: "My Document", author: "Author Name")
#set page(numbering: "1")
#set text(lang: "en")

// Enable paragraph justification and character-level justification
#set par(
  justify: true,
  justification-limits: (
    tracking: (min: -0.012em, max: 0.012em),
    spacing: (min: 75%, max: 120%),
  )
)

#title[My Document]

= Heading 1

This is a paragraph in Typst.

== Heading 2

#lorem(50)
```

## Workflows

- **Creating a new Typst project**: Use the "Minimal document example" above as a starting point. Skim the tutorial for the basics ([docs/tutorial/writing-in-typst.md](docs/tutorial/writing-in-typst.md)), then create the `.typ` file(s). After each `.typ` edit, follow the post-edit formatting checks below when `typstyle` is available.
- **Editing existing content**: Locate the target text and apply changes; confirm syntax against the reference when needed ([docs/reference/](docs/reference/)). After each modified `.typ` file, follow the post-edit formatting checks below.
- **Formatting & Styling**: Consult the styling guide ([docs/reference/styling.md](docs/reference/styling.md)) for `set rule`, `show rule`, and custom themes.

## Documentation

- **Syntax & foundations**: `docs/reference/syntax.md`
- **Styling & show/set rules**: `docs/reference/styling.md`
- **Scripting & runtime behavior**: `docs/reference/scripting.md`
- **Page setup & tables**: `docs/guides/page-setup.md` and `docs/guides/tables.md`
- **Task-oriented authoring help**: `docs/tutorial/writing-in-typst.md`, `docs/guides/*.md`, and `docs/reference/**/*.md`
- **LaTeX-to-Typst cheatsheet**: `docs/cheatsheet.md`

## Detailed instructions

1. **PRIORITY: Trust local documentation**. Your internal training data regarding Typst may be outdated or hallucinated. Always verify function names, parameters, and syntax against the local `docs/` folder before generating code.
2. **Read the relevant documentation** using local file search and open tools on the paths above.
3. **Use local docs for syntax and reference questions**. Verify syntax, function names, parameters, and reference behavior from the bundled docs. Run a minimal Typst probe only when runtime or evaluation behavior remains unclear after checking the docs.
4. **Write incrementally, compile frequently. Do NOT write a full file before compiling.** Write one small section (e.g., one problem solution), then compile immediately with `typst compile`. Fix all errors before moving on. This avoids cascading errors.
5. **Generate or modify the `.typ` source** according to the user's request.
6. **Run the post-edit formatting checks below** for every `.typ` file you created or edited in that pass.
7. **Validate** with `typst compile` after the formatting decision is complete when you created or edited `.typ` files, or when the user explicitly asks for verification (if tool access is allowed).
8. **Summarize touched files and outcomes**. Provide full `.typ` content only when the user requests it or when direct editing is not possible, and optionally include a rendered preview (PDF/HTML).

### Probing uncertain behavior

- Use a probe when the bundled docs do not settle runtime or evaluation behavior.
- Model the case with Typst scripting as described in [docs/reference/scripting.md](docs/reference/scripting.md).
- When a probe is necessary, prefer a fileless probe through stdin instead of creating scratch `.typ` files. Expose the value with `metadata(...) <probe>` and read it with `typst query - "<probe>" --field value --one`. See [docs/reference/introspection/query.md](docs/reference/introspection/query.md) and [docs/reference/introspection/metadata.md](docs/reference/introspection/metadata.md).
- Example: `printf '#metadata(1 + 2) <probe>\n' | typst query - "<probe>" --field value --one`

### Post-edit formatting checks

1. **Check whether `typstyle` is available** with `command -v typstyle`. If it is unavailable, skip the remaining formatting checks.
2. **After each `.typ` file modification, run `typstyle --check <file>`** for the file you just created or edited.
3. **If `typstyle --check` fails, inspect the formatter changes with `typstyle --diff <file>`** before deciding what to do.
4. **Apply formatting with `typstyle -i <file>`** only when the formatter changes are limited to a newly created file or to code you created or edited in the current task.
5. **Stop and ask the user when formatting would change untouched pre-existing code**. If the diff reaches outside your own edits, or if you cannot confidently prove that every formatter change is limited to your edits, ask instead of formatting.

## Using `replace_all` safely

When using `edit` with `replace_all: true`, the replacement affects EVERY match in the file, including pre-existing user code (problem statements, templates, etc.).

**BEFORE running `replace_all`**:
1. Use `grep_search` first to list ALL matches.
2. Visually inspect the list. If ANY match occurs in user-written problem statements or template code that should NOT be changed, do NOT use `replace_all`.
3. Instead, use targeted per-line `edit` calls or rewrite the specific sections.

**Examples of `replace_all` DANGER**:
- Replacing `cov` with `"cov"` will also change `cov(X,Y)` in problem statements where the user wrote it correctly.
- Replacing `cap` with `inter` will also change `caption` or `capability` if those appear.

## Quick syntax reference

### Critical distinctions

- **Arrays**: `(item1, item2)` (parentheses). See [docs/reference/foundations/array.md](docs/reference/foundations/array.md).
- **Dictionaries**: `(key: value, key2: value2)` (parentheses with colons). See [docs/reference/foundations/dictionary.md](docs/reference/foundations/dictionary.md).
- **Content blocks**: `[markup content]` (square brackets). See [docs/reference/foundations/content.md](docs/reference/foundations/content.md).
- **NO tuples**: Typst only has arrays.

### Hash usage (markup vs code)

- Use `#` to start a code expression inside markup or content blocks; it disambiguates code from text. This is required for content-producing function calls and field access in markup: `#figure[...]`, `#image("file.png")`, `text(...)[#numbering(...)]`.
- Do not use `#` inside code contexts (argument lists, code blocks, show-rule bodies). Example: `#figure(image("file.png"))` (no `#` before `image`).
- Reference: [docs/reference/scripting.md](docs/reference/scripting.md), [docs/tutorial/writing-in-typst.md](docs/tutorial/writing-in-typst.md)

```typst
// Incorrect (missing # inside content block)
text(...)[(numbering(...))]

// Correct
text(...)[(#numbering(...))]
```

### Styling rules: set vs show

- `set`: Set rule to configure optional parameters on element functions (style defaults scoped to the current block or file).
- `show`: Show rule to target selected elements and apply a set rule or transform/replace the element output.
- Use `set` for common styling; use `show` for selective or structural changes (e.g., `heading.where(level: 1)`, labels, text, regex).

```typst
// Set rule: configure optional parameters for an element type
#set heading(numbering: "I.")
#set text(font: "New Computer Modern")

// Show-set rule: apply a set rule only to selected elements
#show heading: set text(navy)

// Show transform rule: replace/reshape element output
#show heading: it => block[#emph(it.body)]
```

### Function calling with contents

When a function accepts exactly one content block as a parameter, that content block should be placed OUTSIDE the parentheses.

- If other parameters (other than content blocks) are passed, the content block should be placed AFTER the parentheses. Example: `#text(blue)[content here]`.
- If no other parameters are passed, the content block should be placed right after the function name, and the parentheses should be omitted. Example: `#text[content here]`.

NOTE: If the function accepts MORE THAN ONE content blocks, the brackets should be placed INSIDE the parentheses. Example: `#table(columns:2, [content 1], [content 2])`. If the function accepts NO content block, the brackets should NOT appear. Example: `#line(length:100%)`.

## LaTeX to Typst quick reference (MUST READ before writing math)

Math mode in Typst uses different symbol names than LaTeX. Always verify symbol names in local docs before use.

The content in this section only covers a small part. For full reference on conversion from LaTeX to Typst, please check the [cheatsheet](docs/cheatsheet.md) or read the included Typst docs. DO NOT READ ADDITIONAL FILES UNLESS NEEDED.

### Spacing in math mode

| LaTeX | Typst | Note |
|-------|-------|------|
| `\,` | `h(0.33em)` | thin space |
| `\:` | `quad` | medium space |
| `\;` | `quad` | medium space (same as above) |
| `\quad` | `quad` | semicolons DOES NOT work |
| `\qquad` | `quad quad` | semicolons DOES NOT work |
| `\!` | none needed | Typst has auto-kerning |

NOTE: semicolons DOES NOT work. Use multiple `quad`s or `#h` function instead. `quad` is equal to `#h(1em)`. Note that `#h` is a function call, so please follow the hash sign rules below.

### Operators

| LaTeX | Typst | Note |
|-------|-------|------|
| `\cdot` | `dot` | multiplication dot (center dot) |
| `\times` | `times` | multiplication cross |
| `\text{...}` | `"..."` | plain text inside math |
| `\mathrm{...}` | `upright(...)` | roman text inside math |

Note: contents inside `upright(...)` are parsed as math expressions, therefore you should follow the math variable spacing rules, as described below.

### Infinities and limits

| LaTeX | Typst |
|-------|-------|
| `\infty` | `oo` |
| `\to` | `->` |
| `\rightarrow` | `->` |
| `\sum` | `sum` |
| `\prod` | `prod` |
| `\int` | `integral` |
| `\int_{a}^{b}` | `integral_a^b` |
| `\partial` | `partial` |
| `\mathrm{d}` | `dif` |
| `\,\mathrm{d}x` | `dif x` |
| `\lim\limits_{...}` | `limits(lim)_(...)` |

### Set theory

| LaTeX | Typst |
|-------|-------|
| `\cap` | `inter` | DO NOT use `cap` |
| `\cup` | `union` | DO NOT use `cup` |
| `\subset` | `subset` |  |
| `\supset` | `supset` |  |
| `\overline{A}` | `overline(A)` |  |
| `\emptyset` | `emptyset` |  |

### Greek letters

Most Greek letters are the same (`alpha`, `beta`, `sigma`, `pi`, `mu`, etc.). Example: `\pi` in LaTeX becomes `pi` in Typst.
Also, most variant Greek letters are the same as `letter.alt` in Typst. Example: `\varpi` becomes `pi.alt`.
But note the following letters, whose "standard" and "variant" versions are inverted in Typst:

| LaTeX | Typst |
|-------|-------|
| `\epsilon` | `epsilon.alt` |
| `\varepsilon` | `epsilon` |
| `\phi` | `phi.alt` |
| `\varphi` | `phi` |

### Dots

| LaTeX | Typst |
|-------|-------|
| `\dots` or `\ldots` | `dots` or `...` (Note that Typst does not apply the correct form of dots smartly. Use a specific variant instead) |
| `\cdots` | `dots.c` |
| `\vdots` | `dots.v` |
| `\adots` | `dots.up` |
| `\ddots` | `dots.down` |

### Case / piecewise definitions

| LaTeX | Typst |
|-------|-------|
| `\begin{cases} ... \end{cases}` | `cases( ... )` |
| `\\` (line break in cases) | `,` (comma separates cases) |
| `&` (alignment) | `&` (same) |

Note:

- If you want to display a comma inside `cases()`, use `\,`, otherwise Typst will treat it as a linebreak.
- `&`(alignment) in Typst works in any math block. There's no need of wrapping it in `\align` etc.

Example:

```typst
// LaTeX: f(x) = \begin{cases} x^2 & x > 0 \\ 0 & x \le 0 \end{cases}
// Typst:
$
f(x) = cases(
  x^2\, &x > 0,
  0\, &x <= 0,
)
$
```

### Helper from TeX to Typst

This skill bundles a script at [scripts/index.js](scripts/index.js) that converts LaTeX formulas into Typst format.

**Usage**: `node scripts/index.js <LaTeX formulas>`
**Example**: `node scripts/index.js "\\frac{a}{b}"` makes an output of `a/b`.
**Note**: Dependency might be installed first: `pnpm install -C "path/to/scripts/"`.

Call this script when you know the LaTeX name of a symbol, but not the Typst version.

## Math mode variable spacing rule (CRITICAL)

Typst math mode treats **consecutive letters as a single variable name**. To multiply two single-letter variables, you MUST insert a space between them.

```typst
// WRONG: E(XY) is treated as a single variable named "XY"
E(XY)  // error: unknown variable "XY"

// CORRECT: space between X and Y indicates multiplication
E(X Y)

// Also correct when the intent is clear:
E(X) E(Y)
D(X Y)

// Correct but not recommended
E("XY")
// This treats "XY" as a string, not math symbols, preventing them to be displayed in Math font.
```

**Rule of thumb**: Any time you write two or more single-letter variables in a row (including in function arguments like `E(XY)`), put a space between each letter.

```typst
// Common patterns:
E(X Y)        // expectation of product X*Y
rho_(X Y)     // rho with subscript X*Y
E(X^2 Y^2)    // expectation of X^2 * Y^2, still fine because operators separate them
E(X) E(Y)     // E(X) times E(Y)
2x + 2y       // Fine because no symbol would start with numbers
```


## Styling constraints

In order to keep documents neat and organized, please follow the following rules when authoring Typst docs.

```typst
// When writing numbered lists, always prefer `+` over specific numbers.
// DO NOT:
1. List item 1
2. List item 2
// DO:
+ List item 1
+ List item 2

// Always wrap mathematical symbols in dollar signs. Note that Units and specific numbers should NOT be considered as mathematical symbols.
// DO:
Given $5x=10$. Find the value of $x$.
Billy is 1.7m tall.
// DO NOT:
Given $5x=10$. Find the value of x.
Billy is $1.7$ $m$ tall. // 1.7 is a specific number, and m is a unit.

// Always add spaces after punctuation.
// DO:
To be, or not to be, that is the question.
// DO NOT:
To be,or not to be,that is the question.

// If you're writing Chinese document about Mathematics, Science, and Engineering (they often come with equations and formulas), please use English punctuation ONLY. If the article does NOT contain equations and formulas, please use Chinese full-width punctuations.
// DO:
记 $x=g(y)$. 因为 $g$ 是 $f$ 的反函数, 所以 $f(g(y))=y$. // This is mathematics so use English punctuation here.
莎士比亚最脍炙人口的句子，应该就是《哈姆雷特》中的那一句：“生存还是毁灭，这是个值得思考的问题。” // This does not contain equations and formulas so use Chinese punctuation here.

// If you're writing Chinese documents, please ALWAYS put spaces between Chinese characters, and other characters. (i.e. English words, math blocks, and numbers)
// DO:
我们一致认为 Python 在这个场景中不适用, 因为我们只找到一个 $O(n^2)$ 的已有实现, 这太慢了.
我觉得小明的身高不可能是 10m, 没有任何一个正常人能长到那个高度.
// DO NOT:
我现在一听到“AIGC内容”就尴尬。这里的C本身就是内容的意思了，为什么还要在后面加个“内容”？ // There should be spaces between "AIGC" and "内容", and between "C" and "这里的"/"本身".
```

<!-- Agent 请忽略此段注释：通常来说，不建议在专业渲染系统中（如 msword）为中英文间加入空格。因为一般来说手动加上的空格会比规范的 0.25em 宽。但 Typst 中，加不加在结果上都是 0.25em。所以最好加上，因为这样让源文件更好阅读。 -->

## Common mistakes to avoid

### General Typst mistakes

- Calling things "tuples" (Typst only has arrays).
- Using `[]` for arrays (use `()` instead).
- Accessing array elements with `arr[0]` (use `arr.at(0)`).
- Omitting `#` in markup/content blocks (e.g., `text(...)[numbering(...)]` should be `text(...)[#numbering(...)]`).
- Using `#` inside code contexts (e.g., `figure(#image("x.png"))` in an argument list).
- Mixing up content blocks `[]` with code blocks `{}`.
- Forgetting to include the namespace when accessing imported variables/functions (e.g., use `color.hsl` instead of just `hsl`).
- Using LaTeX syntax (do **NOT** use `\begin{...}`, `\section`, or other LaTeX commands).
- Hallucinating environments (e.g., `tabular` does not exist; use `table`).

### LaTeX-to-Typst migration mistakes

- Using `\cap` or `\cup` in math mode. Use `inter` and `union` instead.
- Using `\infty` in math mode. Use `oo` or `infinity` instead.
- Using `\cdot` in math mode. Use `dot` instead.
- Using `\times` in math mode. Use `times` instead. (Note: `times` in Typst is just a symbol, use `A times B` directly.)
- Using `\text{...}` in math mode. Use `"..."` instead.
- Using `\quad`, `\;`, `\,` for spacing in math mode. Use `quad` for medium space, `#h(0.33em)`(this is a function call; please follow the rules above) for thin space, or just rely on Typst's auto-spacing.
- Concatenating variable names without spaces in math mode (writing `XY` instead of `X Y`).

## Troubleshooting

### "unknown variable" errors

If compilation fails with a "unknown variable" error, the most likely cause is that you used a LaTeX symbol name. **Do not guess the Typst equivalent from memory.**

1. First, run the TeX-to-Typst conversion script: `node scripts/index.js "\\yourLaTeXcommand"`
2. If the script doesn't cover it, Check the cheatsheet at [docs/cheatsheet.md](docs/cheatsheet.md)
3. If those didn't work, search the local math docs: `docs/reference/math/`
4. Only as a last resort, try a probe or iterate.

### Missing font warnings

If you see "unknown font family" warnings, remove the font specification to use system defaults. Note: Font warnings don't prevent compilation; the document will use fallback fonts.

### Template/Package not found

If import fails with "package not found":

- Verify exact package name and version on Typst Universe.
- Check for typos in `@preview/package:version` syntax.

### Compilation errors

Common fixes:

- **"expected content, found ..."**: You're using code where markup is expected - wrap in `#{ }` or use proper syntax.
- **"expected expression, found ..."**: Missing `#` (or `#(...)`) in markup/content blocks.
- **"unknown variable"**: See the diagnosis table above. Check spelling, ensure imports are correct, and if the name looks like LaTeX, assume it is wrong and use the conversion script or local docs.
- **Array/dictionary errors**: Review syntax - use `()` for both, dictionaries need `key: value`, singleton arrays are `(elem,)`.
