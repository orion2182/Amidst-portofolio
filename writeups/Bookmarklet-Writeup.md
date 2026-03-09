# Bookmarklet — picoCTF Writeup

## Challenge Info

| Field       | Details                                        |
|-------------|------------------------------------------------|
| Name        | Bookmarklet                                    |
| Category    | Web Exploitation                               |
| Platform    | picoCTF                                        |
| URL         | `http://titan.picoctf.net:60594/`              |

**Description:**
Why search for the flag when I can make a bookmarklet to print it for me? Browse here, and find the flag!

---

## Solution

### Step 1: View the Page Source

The website shows a "Welcome to my flag distribution website!" page with a textarea containing a JavaScript bookmarklet. Viewing the source:

```bash
curl -s http://titan.picoctf.net:60594/
```

Inside the page, there's a `<textarea>` with this JavaScript code:

```javascript
javascript:(function() {
    var encryptedFlag = "àÒÆÞ¦È¬ëÙ£ÖÓÚåÛÑ¢ÕÓÔÅÐÙí";
    var key = "picoctf";
    var decryptedFlag = "";
    for (var i = 0; i < encryptedFlag.length; i++) {
        decryptedFlag += String.fromCharCode(
            (encryptedFlag.charCodeAt(i) - key.charCodeAt(i % key.length) + 256) % 256
        );
    }
    alert(decryptedFlag);
})();
```

---

### Step 2: Understand the Decryption Logic

The bookmarklet performs a simple character-by-character decryption:

1. It takes each character of `encryptedFlag`
2. Subtracts the corresponding character of the `key` (cycling through `"picoctf"`)
3. Adds 256 and takes modulo 256 to handle wraparound
4. Converts the result back to a character

This is essentially a **Vigenère cipher** variant operating on character codes.

---

### Step 3: Run the Decryption

You can get the flag in multiple ways:

**Option A: Browser console**

Open browser DevTools (F12), go to Console, and paste the JavaScript code.

**Option B: Browser bookmarklet**

Copy the code from the textarea, create a new bookmark, and paste it as the URL. Click the bookmark to trigger the alert.

**Option C: Python script**

The important detail is to read the encrypted string directly from the HTML to preserve the correct byte encoding:

```python
import re, urllib.request

html = urllib.request.urlopen("http://titan.picoctf.net:60594/").read().decode()
enc = re.search(r'var encryptedFlag = "(.*?)"', html).group(1)
key = "picoctf"
flag = ""
for i in range(len(enc)):
    flag += chr((ord(enc[i]) - ord(key[i % len(key)]) + 256) % 256)
print(flag)
```

**Result:**

```
picoCTF{p@g3_turn3r_1d1ba7e0}
```

---

## Flag

```
picoCTF{p@g3_turn3r_1d1ba7e0}
```

---

## Key Takeaways

1. **Read the code before running it.** The bookmarklet contained the entire decryption logic in plain sight. Understanding what code does before executing it is a core skill in both CTF and real-world security.

2. **Bookmarklets are just JavaScript.** A bookmarklet is a small piece of JavaScript saved as a browser bookmark. It runs in the context of the current page. The `javascript:` prefix tells the browser to execute the code instead of navigating to a URL.

3. **Encoding matters.** The encrypted flag uses non-ASCII characters (like `à`, `Ò`, `Æ`). When working with these, character encoding (UTF-8, Latin-1, etc.) can affect the result. The safest approach is to extract the string directly from the original HTML source rather than copy-pasting it, which may alter the encoding.

4. **Simple ciphers are easy to reverse.** The decryption here is a subtraction cipher with a repeating key — essentially a Vigenère cipher. Since the key and the algorithm are both provided, no actual "cracking" is needed. In real-world security, never rely on obscurity for encryption.
