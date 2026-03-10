# Scavenger Hunt — picoCTF Writeup

## Challenge Info

| Field       | Details                                        |
|-------------|------------------------------------------------|
| Name        | Scavenger Hunt                                 |
| Category    | Web Exploitation                               |
| Platform    | picoCTF                                        |
| URL         | `http://wily-courier.picoctf.net:55537/`       |

**Description:**
There is some interesting information hidden around this site. Can you find it?

---

## Solution

The flag is split across 5 different files on the web server. Each part includes a hint pointing to the next location.

### Part 1: HTML Source

View the page source to find an HTML comment:

```bash
curl -s http://wily-courier.picoctf.net:55537/
```

```html
<!-- Here's the first part of the flag: picoCTF{t -->
```

The page mentions it uses HTML, CSS, and JS — a hint to check those files.

**Part 1:** `picoCTF{t`

---

### Part 2: CSS File

```bash
curl -s http://wily-courier.picoctf.net:55537/mycss.css
```

At the bottom of the stylesheet, there's a CSS comment:

```css
/* CSS makes the page look nice, and yes, it also has part of the flag. Here's part 2: h4ts_4_l0 */
```

**Part 2:** `h4ts_4_l0`

---

### Part 3: JavaScript File → robots.txt

```bash
curl -s http://wily-courier.picoctf.net:55537/myjs.js
```

The JS file has a comment hint:

```javascript
/* How can I keep Google from indexing my website? */
```

The answer is `robots.txt` — a file that tells search engine crawlers which pages to ignore.

```bash
curl -s http://wily-courier.picoctf.net:55537/robots.txt
```

```
User-agent: *
Disallow: /index.html
# Part 3: t_0f_pl4c
# I think this is an apache server... can you Access the next flag?
```

The hint says "apache server" and capitalizes "Access" — pointing to `.htaccess`.

**Part 3:** `t_0f_pl4c`

---

### Part 4: .htaccess

`.htaccess` is an Apache web server configuration file that controls directory-level settings like redirects, access control, and URL rewriting.

```bash
curl -s http://wily-courier.picoctf.net:55537/.htaccess
```

```
# Part 4: 3s_2_lO0k
# I love making websites on my Mac, I can Store a lot of information there.
```

The hint says "Mac" and capitalizes "Store" — pointing to `.DS_Store`.

**Part 4:** `3s_2_lO0k`

---

### Part 5: .DS_Store

`.DS_Store` (Desktop Services Store) is a hidden file automatically created by macOS in every folder. It stores custom folder attributes like icon positions and view settings. Developers often accidentally upload this file to web servers.

```bash
curl -s http://wily-courier.picoctf.net:55537/.DS_Store
```

```
Congrats! You've completed the scavenger hunt! Part 5: _9588550}
```

**Part 5:** `_9588550}`

---

### Combine All Parts

```
Part 1 (HTML comment):  picoCTF{t
Part 2 (CSS comment):   h4ts_4_l0
Part 3 (robots.txt):    t_0f_pl4c
Part 4 (.htaccess):     3s_2_lO0k
Part 5 (.DS_Store):     _9588550}
```

---

## Flag

```
picoCTF{th4ts_4_l0t_0f_pl4c3s_2_lO0k_9588550}
```

---

## Key Takeaways

1. **Check all static files.** A website isn't just its HTML — CSS, JavaScript, images, and other assets can all contain hidden information. Always inspect every file referenced in the HTML.

2. **Common hidden files on web servers:**
   - `robots.txt` — Tells search engines what not to index. Often reveals hidden directories or pages.
   - `.htaccess` — Apache configuration file. Can contain rewrite rules, credentials, or sensitive comments.
   - `.DS_Store` — macOS metadata file. Accidentally uploaded, it can reveal the directory structure of the developer's machine.
   - `.git/` — Exposed Git repositories can leak entire source code history.
   - `.env` — Environment variables, often containing API keys and passwords.

3. **Follow the breadcrumbs.** Each hint pointed to the next location. In CTF challenges (and real-world pentesting), one piece of information often leads to the next discovery. Pay close attention to every word — capitalization, phrasing, and context clues all matter.

4. **Developers leave traces.** Files like `.DS_Store` and `.htaccess` are created automatically and often forgotten during deployment. Always check for these common files when enumerating a web server.
