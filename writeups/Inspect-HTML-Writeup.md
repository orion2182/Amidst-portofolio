# Inspect HTML — picoCTF Writeup

## Challenge Info

| Field       | Details                                        |
|-------------|------------------------------------------------|
| Name        | Inspect HTML                                   |
| Category    | Web Exploitation                               |
| Platform    | picoCTF                                        |
| URL         | `http://saturn.picoctf.net:55374/`             |

**Description:**
Can you get the flag?

---

## Solution

### Step 1: View the Page Source

The website displays a short history paragraph about Histiaeus — a historical figure who hid a secret message by tattooing it on a slave's shaved head and waiting for the hair to grow back. This is a thematic hint: the flag is hidden beneath the surface.

```bash
curl -s http://saturn.picoctf.net:55374/
```

At the very bottom of the HTML source, there's an HTML comment:

```html
<!--picoCTF{1n5p3t0r_0f_h7ml_1fd8425b}-->
```

HTML comments (`<!-- -->`) are not rendered by the browser, so they are invisible on the page. But they are fully readable in the source code.

---

### Step 2: That's It

This challenge is straightforward — right-click the page, select "View Page Source" (or press `Ctrl+U`), and scroll to the bottom to find the flag hidden in a comment.

Alternatively, search directly with curl and grep:

```bash
curl -s http://saturn.picoctf.net:55374/ | grep -o 'picoCTF{[^}]*}'
```

**Result:**

```
picoCTF{1n5p3t0r_0f_h7ml_1fd8425b}
```

---

## Flag

```
picoCTF{1n5p3t0r_0f_h7ml_1fd8425b}
```

---

## Key Takeaways

1. **Always view the page source.** HTML comments are invisible on the rendered page but fully present in the source code. This is the most basic web reconnaissance technique and should always be your first step.

2. **The story is the hint.** Histiaeus hid a message under a slave's hair — just like the flag is hidden under the visible content in an HTML comment. CTF challenges often use thematic clues to point you in the right direction.

3. **HTML comments are not private.** Comments in HTML are meant for developers, but they are sent to every visitor's browser. Never put sensitive information (credentials, internal notes, flags) in HTML comments in production applications.
