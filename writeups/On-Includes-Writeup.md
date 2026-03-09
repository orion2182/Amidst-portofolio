# On Includes — picoCTF Writeup

## Challenge Info

| Field       | Details                                        |
|-------------|------------------------------------------------|
| Name        | On Includes                                    |
| Category    | Web Exploitation                               |
| Platform    | picoCTF                                        |
| URL         | `http://saturn.picoctf.net:55357/`             |

**Description:**
Can you get the flag?

---

## Solution

### Step 1: View the Page Source

The page is about "Include directives" — how programming languages use `include`, `import`, or `copy` to insert contents from other files. This is a thematic hint telling us to check the included files.

```bash
curl -s http://saturn.picoctf.net:55357/
```

The HTML references two external files:

```html
<link rel="stylesheet" href="style.css">
<script src="script.js"></script>
```

The HTML itself contains no flag or comments, so the flag must be in the included files.

---

### Step 2: Check the CSS File

```bash
curl -s http://saturn.picoctf.net:55357/style.css
```

```css
body {
  background-color: lightblue;
}

/*  picoCTF{1nclu51v17y_1of2_  */
```

The first half of the flag is hidden in a CSS comment at the bottom: `picoCTF{1nclu51v17y_1of2_`

Note the hint `1of2` — telling us this is part 1 of 2.

---

### Step 3: Check the JavaScript File

```bash
curl -s http://saturn.picoctf.net:55357/script.js
```

```javascript
function greetings() {
  alert("This code is in a separate file!");
}

//  f7w_2of2_b8f4b022}
```

The second half is in a JS comment: `f7w_2of2_b8f4b022}`

---

### Step 4: Combine the Parts

```
Part 1 (CSS):  picoCTF{1nclu51v17y_1of2_
Part 2 (JS):   f7w_2of2_b8f4b022}
```

---

## Flag

```
picoCTF{1nclu51v17y_1of2_f7w_2of2_b8f4b022}
```

---

## Key Takeaways

1. **Check all included files.** A web page is not just the HTML — it loads CSS stylesheets, JavaScript files, images, fonts, and more. Each of these files can contain hidden information. Always inspect every resource referenced in the HTML.

2. **Comments exist in every language.** HTML uses `<!-- -->`, CSS uses `/* */`, and JavaScript uses `//` or `/* */`. Each file type has its own comment syntax, and each is a potential hiding spot for flags.

3. **The theme is the hint.** The page is literally about "include directives" — how files reference other files. The challenge is telling you to look at the files that are included by the HTML page.

4. **Flags can be split across files.** Don't assume the flag is in one place. The `1of2` and `2of2` labels make it obvious here, but in harder challenges, fragments could be scattered without such hints.
