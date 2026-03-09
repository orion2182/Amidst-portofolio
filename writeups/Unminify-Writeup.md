# Unminify — picoCTF Writeup

## Challenge Info

| Field       | Details                                        |
|-------------|------------------------------------------------|
| Name        | Unminify                                       |
| Category    | Web Exploitation                               |
| Platform    | picoCTF                                        |
| URL         | `http://titan.picoctf.net:49241/`              |

**Description:**
I don't like scrolling down to read the code of my website, so I've squished it. As a bonus, my pages load faster! Browse here, and find the flag!

---

## Solution

### Step 1: View the Page Source

The website loads normally in the browser — it shows a "Welcome to my flag distribution website!" page. However, the challenge title "Unminify" and the description ("squished it") tell us the HTML source code has been **minified** (compressed into a single line with all whitespace removed).

```bash
curl -s http://titan.picoctf.net:49241/
```

The entire HTML is one long line:

```html
<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" ...
```

---

### Step 2: Unminify and Read the Code

To make the code readable, you can:

- **Browser:** Right-click → View Page Source, then use Ctrl+F to search
- **CLI:** Pipe through a formatter or just grep for the flag
- **Online:** Paste into an HTML beautifier

Or simply search for the flag format directly:

```bash
curl -s http://titan.picoctf.net:49241/ | grep -o 'picoCTF{[^}]*}'
```

**Result:**

```
picoCTF{pr3tty_c0d3_51d374f0}
```

---

### Step 3: Where Was It Hidden?

The flag was embedded as a **CSS class name** on an empty `<p>` tag. When we prettify the HTML, we can see it clearly:

```html
<p class="picoCTF{pr3tty_c0d3_51d374f0}"></p>
```

The tag has no text content, so nothing is visible on the rendered page. And because the code is minified into one long line, it's easy to miss when glancing at the source. There are also many decoy `class="picoctf{}"` (empty, lowercase) attributes scattered throughout the HTML to add noise.

---

## Flag

```
picoCTF{pr3tty_c0d3_51d374f0}
```

---

## Key Takeaways

1. **Minified code is not hidden code.** Minification removes whitespace and formatting to reduce file size and improve load times. It makes the code harder to read but does NOT hide anything — the content is identical. Use any code formatter or beautifier to restore readability.

2. **Use search instead of reading line by line.** When source code is minified or very large, searching (`Ctrl+F` in browser, `grep` in terminal) is far more efficient than trying to read through it manually.

3. **Check HTML attributes, not just text content.** The flag was hidden in a `class` attribute, not in visible page text. Always inspect the full HTML structure — attributes like `class`, `id`, `data-*`, `name`, and custom attributes can all contain hidden data.

4. **Watch for decoys.** The page had many elements with `class="picoctf{}"` (empty braces, lowercase). The real flag used `picoCTF` (mixed case) with actual content inside the braces. Pay attention to subtle differences.
