# Web Inspector — picoCTF Writeup

## Challenge Info

| Field       | Details                                        |
|-------------|------------------------------------------------|
| Name        | Web Inspector                                  |
| Category    | Web Exploitation                               |
| Platform    | picoCTF                                        |
| URL         | `http://titan.picoctf.net:59634/`              |

**Description:**
Do you know how to use the web inspector? Start searching here to find the flag.

---

## Solution

### Step 1: Explore the Main Page

The homepage greets us with "Ha!!!!!! You looking for a flag?" and "Keep Navigating". There is nothing hidden on this page, but the navigation bar has three links:

- **Home** (`index.html`)
- **About** (`about.html`)
- **Contact** (`contact.html`)

The page is telling us to keep navigating, so let's check the other pages.

---

### Step 2: Check Each Page

**Contact page** (`contact.html`) — Nothing useful. Just says "Keep searching page. Don't give up!!!"

**About page** (`about.html`) — The page says "Try inspecting the page!! You might find it there". This is our hint to look at the HTML source code.

```bash
curl -s http://titan.picoctf.net:59634/about.html
```

Inspecting the source reveals a custom HTML attribute on the `<section>` tag:

```html
<section class="about" notify_true="cGljb0NURnt3ZWJfc3VjYzNzc2Z1bGx5X2QzYzBkZWRfZGYwZGE3Mjd9">
```

The attribute `notify_true` contains a suspicious string that is not visible on the rendered page — you can only see it by inspecting the HTML source or using browser DevTools (right-click → Inspect Element).

---

### Step 3: Decode the Hidden Value

The string `cGljb0NURnt3ZWJfc3VjYzNzc2Z1bGx5X2QzYzBkZWRfZGYwZGE3Mjd9` is **Base64** encoded. Decode it:

```bash
echo "cGljb0NURnt3ZWJfc3VjYzNzc2Z1bGx5X2QzYzBkZWRfZGYwZGE3Mjd9" | base64 -d
```

**Result:**

```
picoCTF{web_succ3ssfully_d3c0ded_df0da727}
```

---

## Flag

```
picoCTF{web_succ3ssfully_d3c0ded_df0da727}
```

---

## Key Takeaways

1. **Follow the breadcrumbs.** CTF challenges often guide you through hints. The homepage said "Keep Navigating", the about page said "Try inspecting the page" — each clue points you to the next step.

2. **Inspect all HTML attributes.** Data can be hidden in custom HTML attributes (like `notify_true`) that don't affect how the page looks but are fully visible in the source code. Browser DevTools (Elements tab) or "View Page Source" will reveal these.

3. **Custom attributes are not secure.** HTML allows any custom attribute on elements. Developers sometimes use these to store data (like `data-*` attributes), but anything in the HTML is visible to anyone who inspects the page.

4. **Check all pages, not just the homepage.** The flag was on the about page, not the main page. Always explore every linked page, and don't forget to check CSS files, JavaScript files, and other linked resources too.
