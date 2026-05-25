---
name: typst-author
description: Generate idiomatic Typst (.typ) code, edit and troubleshoot Typst documents and projects (templates, packages, styling, math), and answer Typst syntax/reference questions. Use when working with .typ files, when the user mentions Typst/Typst Universe packages/templates, when they ask about compiling/querying Typst, or when converting LaTeX math to Typst.
---

# typst-author skill

## Overview

This skill helps agents generate, edit, and reason about Typst documents. It includes a detailed, **in-skill** syntax & math reference section because many models struggle with Typst (especially math).

## Operating mode (required)

Pick the mode up-front:

- **Fix mode (debug/minimal change):** focus on the smallest diff to make it compile or implement the requested change. Do **not** rewrite unrelated prose or reformat entire files for “style”.
- **Author mode (write/polish):** you can apply the house style rules in the “Styling constraints” section, and you may proactively improve consistency.

If unsure, assume **Fix mode**.

## Minimal document example (quick start)

```typst
#set page(paper: "a4", margin: (x: 1.8cm, y: 1.5cm))

= Typst Example

Hello, Typst!

An inline equation: $a^2 + b^2 = c^2$.
```

For deeper syntax (markup vs scripting vs math), jump to **“Quick syntax reference”** below (it is part of this skill).

## Workflows

- **Creating a new Typst project**: Skim the tutorial for the basics ([docs/tutorial/writing-in-typst.md](docs/tutorial/writing-in-typst.md)), then create the `.typ` file(s). After each `.typ` edit, follow the post-edit formatting checks below when `typstyle` is available.
- **Editing existing content**: Locate the target text and apply changes; confirm syntax against the reference when needed ([docs/reference/](docs/reference/)). After each modified `.typ` file, follow the post-edit formatting checks below.
- **Formatting & Styling**: Consult the styling guide ([docs/reference/styling.md](docs/reference/styling.md)) for `set rule`, `show rule`, and custom themes.

## Documentation (bundled)

- **Syntax & foundations**: `docs/reference/syntax.md`
- **Styling & show/set rules**: `docs/reference/styling.md`
- **Scripting & runtime behavior**: `docs/reference/scripting.md`
- **Page setup & tables**: `docs/guides/page-setup.md` and `docs/guides/tables.md`
- **Task-oriented authoring help**: `docs/tutorial/writing-in-typst.md`, `docs/guides/*.md`, and `docs/reference/**/*.md`
- **LaTeX-to-Typst cheatsheet**: `docs/cheatsheet.md`

## Detailed instructions

Before changing files, decide Fix vs Author mode (see above). In Fix mode, keep edits minimal and avoid applying style rules to untouched text.

1. **PRIORITY: Trust local documentation**. Your internal training data regarding Typst may be outdated or hallucinated. Always verify function names, parameters, and syntax against the local `docs/` folder before generating code.
2. **Read the relevant documentation** using local file search and open tools on the paths above.
3. **Use local docs for syntax and reference questions**. Verify syntax, function names, parameters, and reference behavior from the bundled docs. Run a minimal Typst probe only when runtime or evaluation behavior remains unclear after checking the docs.
4. **Write incrementally, compile frequently. Do NOT write a full file before compiling.** Write one small section (e.g., one problem solution), then compile immediately with `typst compile`. Fix all errors before moving on. This avoids cascading errors.
5. Generate or modify the `.typ` source **according to the user's request**.
6. Run the post-edit formatting checks below for EVERY `.typ` file you created or edited in that pass.
7. Validate with `typst compile` after the formatting decision is complete when you created or edited `.typ` files, or when the user explicitly asks for verification (if tool access is allowed).
8. Summarize touched files and outcomes. Provide full `.typ` content only when the user requests it or when direct editing is not possible, and optionally include a rendered preview (PDF/HTML).

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

## Quick syntax reference

A Typst document has three distinct contexts, and syntax is interpreted differently in each:

- **Content (markup)**: The rendered document content. Content blocks are wrapped in square brackets `[]`, and any Typst file is itself a content context.
- **Scripting**: Control flow, function calls, variable definitions, etc. A scripting expression inside a content block (and in the document body) typically starts with `#`; otherwise it is interpreted as plain text.
- **Math (equation)**: A sub-context that only works inside content. Math blocks start and end with dollar signs `$`.
- **Comments**: C-style comments (`//` and `/* */`).

### Minimal document example

```typst
// Setting page size

#set page( // scripting block starts
  paper: "a4",
  margin: (x: 1.8cm, y: 1.5cm),
) // scripting block ends

// first-level headings
= Typst Example

The *Pythagorean Theorem* is one of the earliest math theories. Its formula is $a^2+b^2=c^2$. // inline math blocks

Taylor's Formula:

// math blocks with their own paragraph
$
	f(x)=f(x_0)+f'(x_0)(x-x_0)+(f''(x_0))/(2!) (x-x_0)^2+...+(f^((n))(x_0))/(n!) (x-x_0)^n + R_n(x)
$
```

### Content (markup) blocks

A Typst file itself, or things inside a square bracket `[]`, are content blocks.

For basic markup, here are some quick examples:

```typst
*Bold* uses asterisks. _Italic_ uses underscores. `Code` uses backticks. Multi-line code blocks (raw text) use triple backticks, and you can set a highlighting language like in Markdown.

#set heading(numbering:"1.")

= Headings start with equal signs // shown as "1. Headings start..."
== Lower-level headings start with multiple equal signs // "1.1. Lower level..."
=== A heading may be given an <anchor> // "1.1.1. A heading..."
...and you can refer to it with @anchor. (@anchor is rendered as "Section 1.1.1" by default; this is customizable—see the `set heading` above.)

- Unordered lists start with an en dash
- but not an asterisk. Typst would treat it as bold text, and warn you that you are missing the matching asterisk.

1. Ordered lists start with a number and a period
+ A plus sign also creates an ordered list
+ Plus signs are preferred over specific numbers
114514. Unlike Markdown, Typst preserves the item number, so this item is rendered as "114514. Unlike..."

This is an inline math equation: $1+1=2$.

And here is a math block within its own paragraph.
$ 1+2=3 $

// The next two lines intentionally contain a hard wrap (a newline in the source), and are rendered as one line.
Typst can handle hard wraps
well. If you want, you can also wrap manually \ // backslashes are rendered as a line wrap.
with a backslash. 

但是别在中文/日语里使用
硬换行。 // “使用”和“硬”之间会出现空格——这不符合中文和日语的书写习惯。

Backslashes are also used for escaping, e.g. `\*`.
```

### Scripting

The Typst scripting language is relatively complex, and this file will not cover it fully. Please read the full Typst docs before writing large scripting blocks. Here are a few important points.

A scripting block can be put inside content blocks (described above) for function calling, control flows, variables rendering, etc. To start a scripting block, use a hash.

```typst
// Layout is mostly done with set rules (also scripting).
#set page( // scripting block starts
  paper: "a4",
  margin: (x: 1.8cm, y: 1.5cm),
) // scripting block ends
```

#### Critical distinctions

These types are part of the Typst Scripting language and differ a lot from LaTeX.

- **Arrays**: `(item1, item2)` (parentheses). See [docs/reference/foundations/array.md](docs/reference/foundations/array.md).
- **Dictionaries**: `(key: value, key2: value2)` (parentheses with colons). See [docs/reference/foundations/dictionary.md](docs/reference/foundations/dictionary.md).
- **Content blocks**: `[markup content]` (square brackets). See [docs/reference/foundations/content.md](docs/reference/foundations/content.md).

#### Styling rules: set vs show

- `set`: Set rule to configure optional parameters on element functions (style defaults scoped to the current block or file).
- `show`: Show rule to target selected elements and apply a set rule or transform/replace the element output.
- Use `set` for common styling; use `show` for selective or structural changes (e.g., `heading.where(level: 1)`, labels, text, regex).

```typst
// Set rule: configure optional parameters for an element type
#set heading(numbering: "I.")
#set text(font: "Inter")

// Show-set rule: apply a set rule only to selected elements
#show heading: set text(navy)

// Show transform rule: replace/reshape element output
#show heading: it => block[#emph(it.body)]
```


#### Hash usage (markup vs code)

- Use `#` to start a code expression inside markup or content blocks; it disambiguates code from text. This is required for content-producing function calls and field access in markup: `#figure[...]`, `#image("file.png")`, `text(...)[#numbering(...)]`.
- Do not use `#` inside code contexts (argument lists, code blocks, show-rule bodies). Example: `#figure(image("file.png"))` (no `#` before `image`).
- Reference: [docs/reference/scripting.md](docs/reference/scripting.md), [docs/tutorial/writing-in-typst.md](docs/tutorial/writing-in-typst.md)

```typst
// Incorrect (missing # inside content block)
#text(...)[(numbering(...))]

// Correct
#text(...)[(#numbering(...))]
```

#### Function calling with contents

When a function accepts exactly one content block as a parameter, that content block should be placed OUTSIDE the parentheses.

- If other parameters (other than content blocks) are passed, the content block should be placed AFTER the parentheses. Example: `#text(blue)[content here]`.
- If no other parameters are passed, the content block should be placed right after the function name, and the parentheses should be omitted. Example: `#text[content here]`.

NOTE: If the function accepts MORE THAN ONE content blocks, the brackets should be placed INSIDE the parentheses. Example: `#table(columns:2, [content 1], [content 2])`. If the function accepts NO content block, the brackets should NOT appear. Example: `#line(length:100%)`.

### Math

**Please read this section before you write any math equations.**

Math in Typst differs ***a lot*** from LaTeX. Backslashes and braces are not part of Typst math syntax.

Here are the details.

```typst
// 1. Any word made only of letters is treated as an identifier (a symbol/variable/function) in the built-in `math` namespace. For example, `$integral$` is equivalent to `#math.integral`.
//     1.1. For this reason, we have the spacing rules (described below).
//     1.2. Exception: a single letter is shown as a variable in math font; you usually won’t find it under `math` (i.e., as `#math.a`).
$ a b c $ // -> abc
$ abc $ // -> error: identifier "abc" not found
//     1.3. If a local variable exists, Typst will use it instead of `math.<name>`. However, rule 1.2 has higher priority: for single-letter variables like `a`, you must write `#a` to refer to the local variable. 
#let a="1234"
#let bbb="5678"
#let integral="fake integral"
$ integral, bbb, a, #a $ // -> fake integral, 5678, a, 1234
#let integral=math.integral // restore "integral" to reuse below
// 2. To write multiple symbols/letters in a row, you often need spaces; otherwise they may be treated as a single identifier.
// 3. Typst uses slashes (/), underscores (_), and carets (^) for fractions, subscripts, and superscripts.
$ integral_0^1 $ // -> Definite integrals from 0 to 1
$ x^114514 $ // -> x power 114514
$ x^integral $ // -> x to the power of an integral sign :)
// 4. Typst uses **parentheses** `()` in math for both delimiter and displayed parentheses. Typst decides whether to show parentheses used as delimiters smartly according to math typography conventions. If you want to force to show parentheses where a delimiter pair already exists, write them twice.
$ x^(1+2) $ // -> x power "1+2"
$ (x y)^2 $ // -> "(xy)" power 2
$ (x y)/(z a) $ // -> "xy" divided by "za", shown in fractions
$ ((x y))/(z a) $ // -> "(xy)" divided by "za", shown in fractions
$ sum_i=1^10 $ // -> Counterexample: an uppercase sigma, with an i under it, equals to 1 power 10
$ sum_(i=1)^10 $ // -> add up the things after this, where `i` starts from 1, ends to 10
// 5. Some symbols have different variants. You can typically access them via `$symbol.variant$`, which is equivalent to `#math.symbol.variant`.
$ gt, gt.eq $ //  >, ≥
// 6. Some frequently used symbols have convenient forms. For example: `=` = `#math.eq`, `!=` = `#math.eq.not`, `>=` = `#math.gt.eq`.
// 7. To put a line wrap, use `\`. To align things in multiple lines, use `&`. Note that `&` works in any math blocks - no environments are required.
$ (a+b)^2 &= (a+b)(a+b) \
          &= (a a + a b + b a + b b) \
          &= a^2 + 2 a b + b^2
$
// 8. If there are spaces (or other blank characters like `\n`) between dollar signs and the equation expression, the math is treated as a *block* and has its own paragraph. Otherwise it is treated inline.
Given $ 5x = 10, $ // has own paragraph
find the value of $x$. //inline
// 9. This only covers a small part of Typst math syntax, but it should be enough for day-to-day writing. If you run into problems, please read the docs for more details.
```

## LaTeX to Typst quick reference (MUST READ before writing math)

Math mode in Typst uses different symbol names than LaTeX. Always verify symbol names in local docs before use.

This section only covers a small subset. For full reference on conversion from LaTeX to Typst, please check the [cheatsheet](docs/cheatsheet.md) or read the included Typst docs. Avoid reading additional files unless needed.

### Spacing in math mode

| LaTeX | Typst | Note |
|-------|-------|------|
| `\,` | `h(0.33em)` | thin space |
| `\:` | `quad` | medium space |
| `\;` | `quad` | medium space (same as above) |
| `\quad` | `quad` | |
| `\qquad` | `wide` | |
| `\!` | none needed | Typst has auto-kerning |

NOTE: `quad` is equal to `#h(1em)`. Note that `#h` is a function call, so please follow the hash sign rules.

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
| `\cap` | `inter` |
| `\cup` | `union` |
| `\subset` | `subset` |
| `\supset` | `supset` |
| `\overline{A}` | `overline(A)` |
| `\emptyset` | `emptyset` |

### Greek letters

Greek letters are the same in Typst (`alpha`, `beta`, `sigma`, `pi`, `mu`, etc.), and simply removing backslashes will work. Example: `\pi` in LaTeX becomes `pi` in Typst.
Also, most "variant" (`var-`) Greek letters are the same as `letter.alt` in Typst. Example: `\varpi` becomes `pi.alt`.
However, note the following letters, whose "standard" and "variant" versions are inverted in Typst:

| LaTeX | Typst |
|-------|-------|
| `\epsilon` | `epsilon.alt` |
| `\varepsilon` | `epsilon` |
| `\phi` | `phi.alt` |
| `\varphi` | `phi` |

### Ellipsis

"Dots" is the ellipsis used to omit. Typst does not automatically choose the typographically correct dots variant, so please pick a specific one.

| LaTeX | Typst |
|-------|-------|
| `\dots` or `\ldots` | `dots` or `...`|
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

- If you want to display a comma inside `cases()`, escape it with `\,`, otherwise Typst will treat it as a linebreak.
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

- **Usage**: `node scripts/index.js <LaTeX formulas>`
- **Example**: `node scripts/index.js "e \\overset{\\text{def}}{=} \\lim_{{n \\to \\infty}} \left(1 + \\frac{1}{n}\\right)^n"` makes an output of `e eq.def lim_(n -> infinity) (1 + 1/n)^n`. (Complicated LaTeX formulas is also OK!)
- **Install deps** (once): from `typst-author/`, run `pnpm -C scripts install`.
  - Alternative (from repo root): `pnpm -C typst-author/scripts install`.

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

These are self-use defaults. Apply them by default when you are **authoring/polishing**.
When you are in **Fix mode** (debug/minimal change), do not rewrite untouched content just to enforce style.

In order to keep documents neat and organized, please follow the following rules when authoring Typst docs.

```typst
// When writing numbered lists, always prefer `+` over specific numbers.
// DO NOT:
1. List item 1
2. List item 2
// DO:
+ List item 1
+ List item 2

// Always wrap mathematical symbols in dollar signs. Note that Units should be wrapped in quotes "" to make them upright.
// DO:
Given $5x=10$. Find the value of $x$.
Mount Everest is approximately $8849"m"$ high.
// DO NOT:
Given $5x=10$. Find the value of x.
Mount Everest is approximately $8849m$ high. // absence of quotes will make them displayed in italic

// Always add spaces after punctuation.
// DO:
To be, or not to be, that is the question.
// DO NOT:
To be,or not to be,that is the question.

// Always add Oxford commas when writing English
// DO:
I invited my parents, Taylor Swift, and Tom Hiddleston.
// DO NOT:
I invited my parents, Taylor Swift and Tom Hiddleston.

// If you're writing Chinese document about Mathematics, Science, and Engineering (they often come with equations and formulas), please use English punctuation ONLY. If the article does NOT contain equations and formulas, please use Chinese full-width punctuation.
// DO:
记 $x=g(y)$. 因为 $g$ 是 $f$ 的反函数, 所以 $f(g(y))=y$. // This is mathematics so use English punctuation here.
莎士比亚最脍炙人口的句子，应该就是《哈姆雷特》中的那一句：“生存还是毁灭，这是个值得思考的问题。” // This does not contain equations and formulas so use Chinese punctuation here.

// If you're writing Chinese documents, please ALWAYS put spaces between Chinese characters and other characters. (i.e. English words, math blocks, and numbers)
// DO:
说实话我觉得在目前这个 AI 主导的环境下使用 Typst 简直是个灾难，因为没有多少 AI 专门为它训练过。
我觉得小明的身高不可能是 $10"m"$, 没有任何一个正常人能长到那个高度.
// DO NOT:
我现在一听到“AIGC内容”就尴尬。这里的C本身就是内容的意思了，为什么还要在后面加个“内容”？ // There should be spaces between "AIGC" and "内容", etc.
```

<!-- Agent 请忽略此段注释：通常来说，不建议在专业渲染系统中（如 msword）为中英文间加入空格。因为手动加上的空格有可能会比规范的 0.25em 宽。但 Typst 中，加和不加都会产生规范的 0.25em 间隔，所以可以加上：这会让源文件看起来更舒服。 -->

## Common mistakes to avoid

### General Typst mistakes

- Calling things "tuples" (Typst only has arrays).
- Using `[]` for arrays (use `()` instead).
- Accessing array elements with `arr[0]` (use `arr.at(0)`).
- Omitting `#` in markup/content blocks (e.g., `text(...)[numbering(...)]` should be `text(...)[#numbering(...)]`).
- Using `#` inside code contexts (e.g., `figure(#image("x.png"))` in an argument list; hash is not needed here).
- Mixing up content blocks `[]` with code blocks `{}`.
- Forgetting to include the namespace when accessing imported variables/functions (e.g., use `color.hsl` instead of just `hsl`).
- Using LaTeX syntax (do **NOT** use `\begin{...}`, `\section`, or other LaTeX commands).
- Hallucinating environments (e.g., `tabular` does not exist; use `table`).

## Troubleshooting

### "unknown variable" errors

If compilation fails with a "unknown variable" error, the most likely cause is that you used a LaTeX symbol name. **Do not guess the Typst equivalent from memory.**

1. First, run the TeX-to-Typst conversion script: `node scripts/index.js "\\yourLaTeXcommand"`
2. If the script doesn't cover it, Check the cheatsheet at [docs/cheatsheet.md](docs/cheatsheet.md)
3. If those didn't work, search the local math docs: `docs/reference/math/`
4. Only as a last resort, try a probe or iterate.

### Missing font warnings

If you see "unknown font family" warnings, ask the user for further instructions. Note: Font warnings don't prevent compilation; the document will use fallback fonts.

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
