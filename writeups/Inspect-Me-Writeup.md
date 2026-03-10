# Inspect Me — picoCTF Writeup

## Challenge Info

| Field       | Details                                        |
|-------------|------------------------------------------------|
| Name        | Inspect Me                                     |
| Category    | Web Exploitation                               |
| Platform    | picoCTF                                        |
| URL         | `http://fickle-tempest.picoctf.net:63568/`     |

**Description:**
Kishor Balan tipped us off that the following code may need inspection.

---

## Solution

### Step 1: View the HTML Source

The page is titled "Inspect Me" — a direct hint to view the source code. It references two external files: `mycss.css` and `myjs.js`.

```bash
curl -s http://fickle-tempest.picoctf.net:63568/
```

At the bottom of the HTML, there's a comment:

```html
<!-- Html is neat. Anyways have 1/3 of the flag: picoCTF{tru3_d3 -->
```

**Part 1:** `picoCTF{tru3_d3`

---

### Step 2: Check the CSS File

```bash
curl -s http://fickle-tempest.picoctf.net:63568/mycss.css
```

At the bottom of the stylesheet:

```css
/* You need CSS to make pretty pages. Here's part 2/3 of the flag: t3ct1ve_0r_ju5t */
```

**Part 2:** `t3ct1ve_0r_ju5t`

---

### Step 3: Check the JavaScript File

```bash
curl -s http://fickle-tempest.picoctf.net:63568/myjs.js
```

At the bottom of the script:

```javascript
/* Javascript sure is neat. Anyways part 3/3 of the flag: _lucky?302945a7} */
```

**Part 3:** `_lucky?302945a7}`

---

### Step 4: Combine All Parts

```
Part 1 (HTML comment):  picoCTF{tru3_d3
Part 2 (CSS comment):   t3ct1ve_0r_ju5t
Part 3 (JS comment):    _lucky?302945a7}
```

---

## Flag

```
picoCTF{tru3_d3t3ct1ve_0r_ju5t_lucky?302945a7}
```

---

## Key Takeaways

1. **Inspect all page resources.** A web page is made up of multiple files — HTML, CSS, JavaScript, images, fonts, and more. Each file can contain hidden information in the form of comments or unused code.

2. **Comments are visible to everyone.** HTML comments (`<!-- -->`), CSS comments (`/* */`), and JavaScript comments (`//` or `/* */`) are meant for developers but are sent to every visitor's browser. Never put sensitive information in comments.

3. **Browser DevTools make this easy.** You can use the Sources tab in Chrome/Firefox DevTools to browse all loaded files at once, or simply use "View Page Source" and click through the linked CSS and JS files.
