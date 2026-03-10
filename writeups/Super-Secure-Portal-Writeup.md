# Super Secure Portal — picoCTF Writeup

## Challenge Info

| Field       | Details                                        |
|-------------|------------------------------------------------|
| Name        | Super Secure Portal                            |
| Category    | Web Exploitation                               |
| Platform    | picoCTF                                        |
| URL         | `http://fickle-tempest.picoctf.net:60335/`     |

**Description:**
Can you break into this super secure portal?

---

## Solution

### Step 1: View the Page Source

The website shows a simple login portal with a password field. Viewing the source:

```bash
curl -s http://fickle-tempest.picoctf.net:60335/
```

The password verification is done entirely in client-side JavaScript:

```javascript
function verify() {
    checkpass = document.getElementById("pass").value;
    split = 4;
    if (checkpass.substring(0, split) == 'pico') {
      if (checkpass.substring(split*6, split*7) == 'eb02') {
        if (checkpass.substring(split, split*2) == 'CTF{') {
         if (checkpass.substring(split*4, split*5) == 'ts_p') {
          if (checkpass.substring(split*3, split*4) == 'lien') {
            if (checkpass.substring(split*5, split*6) == 'lz_2') {
              if (checkpass.substring(split*2, split*3) == 'no_c') {
                if (checkpass.substring(split*7, split*8) == 'b45}') {
                  alert("Password Verified")
                }
              }
            }
          }
        }
      }
    }
  }
}
```

---

### Step 2: Reassemble the Password

The code splits the password into 4-character chunks (`split = 4`) and checks each chunk in a scrambled order using nested `if` statements. We just need to sort them by their index:

| Index        | Characters (start:end) | Value  |
|--------------|------------------------|--------|
| `[0:4]`      | `substring(0, 4)`      | `pico` |
| `[4:8]`      | `substring(4, 8)`      | `CTF{` |
| `[8:12]`     | `substring(8, 12)`     | `no_c` |
| `[12:16]`    | `substring(12, 16)`    | `lien` |
| `[16:20]`    | `substring(16, 20)`    | `ts_p` |
| `[20:24]`    | `substring(20, 24)`    | `lz_2` |
| `[24:28]`    | `substring(24, 28)`    | `eb02` |
| `[28:32]`    | `substring(28, 32)`    | `b45}` |

Concatenated in order:

```
pico + CTF{ + no_c + lien + ts_p + lz_2 + eb02 + b45}
```

---

## Flag

```
picoCTF{no_clients_plz_2eb02b45}
```

---

## Key Takeaways

1. **Client-side verification is no verification.** The password check runs in the browser — all the logic and the answer are visible to anyone who reads the source. Authentication must always be done on the server.

2. **Scrambled order doesn't add security.** The developer checked the password chunks in a random order (0, 6, 1, 4, 3, 5, 2, 7) hoping to make it confusing. But since each `substring()` call explicitly states its start and end index, reassembling is trivial.

3. **The flag says it all.** `no_clients_plz` — don't trust the client. Any code running in the browser (JavaScript, WebAssembly, etc.) can be read, modified, and bypassed by the user. This is a fundamental rule of web security.
