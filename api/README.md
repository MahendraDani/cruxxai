# Cruxx API
Cruxx API allows you to integrate website summzarization services directly within your application/project. The API provides support for the languages :
- Typescript/Javascript
- Python
- Go
- Rust

## Tech Stack
- [Honojs](https://hono.dev/) : The API is developed in Honojs and Typescript.
- [PostgreSQL](https://aiven.io/) : Database
- [Prisma Accelerate](https://www.prisma.io/accelerate) : ORM
- [Gemini API](https://ai.google.dev/gemini-api/docs) : The Gemini 1.5 Flash model is used to summarize website quickly

## Deployment
The API is deployed on [Cloudflare Workers](https://workers.cloudflare.com/) is live at [https://api.danimahendra0904.workers.dev/cruxx](https://api.danimahendra0904.workers.dev/cruxx).

## API Reference

### 1. Summarize a website
Endpoint : `https://api.danimahendra0904.workers.dev/cruxx/summarize?url={<website_url>}`
Method : `GET`
Returns : Returns an object with url and summary of the website

![Postman Image](/public/images/api/postman2.png)

Examples
1. Nodejs
```js
const requestOptions = {
  method: "GET",
};

fetch("https://api.danimahendra0904.workers.dev/cruxx/summarize?url=<website_url>", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
```

2. Python
```python
import requests

url = "https://api.danimahendra0904.workers.dev/cruxx/summarize?url=<website_url>"

payload = {}
headers = {}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)
```
3. Go
```go
package main

import (
  "fmt"
  "net/http"
  "io"
)

func main() {

  url := "https://api.danimahendra0904.workers.dev/cruxx/summarize?url=<website_url>"
  method := "GET"

  client := &http.Client {
  }
  req, err := http.NewRequest(method, url, nil)

  if err != nil {
    fmt.Println(err)
    return
  }
  res, err := client.Do(req)
  if err != nil {
    fmt.Println(err)
    return
  }
  defer res.Body.Close()

  body, err := io.ReadAll(res.Body)
  if err != nil {
    fmt.Println(err)
    return
  }
  fmt.Println(string(body))
}
```

Response for website [https://mahendradani.vercel.app](https://mahendradani.vercel.app)
```json
{
    "data": {
        "url": "https://mahendradani.vercel.app",
        "summary": "This HTML code represents the website of Mahendra Dani, a developer and programmer passionate about solving problems using computers. The site features information about his work, including his personal projects like Genekriti (a platform for sustainable practices) and Rhymes and Fables (a story-sharing web app). It also showcases his blogs, with articles like \"Are Your React Components Really Reusable?\" and \"Hello World\".  You can find links to his GitHub, LinkedIn and X profiles in the footer for more detailed information. \n"
    },
    "error": null
}
```

### 2. Summarize all external references from a website
Endpoint : `https://api.danimahendra0904.workers.dev/cruxx/summarize/all?url={<website_url>}`
Method : `GET`
Returns : Returns AI generated summaries of all the external refernces of a website

![Postman Image](/public/images/api/postman1.png)

Examples
1. Nodejs
```js
const requestOptions = {
  method: "GET",
};

fetch("http://localhost:8787/cruxx/summarize/all?url=<website_url>", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
```

2. Python
```python
import requests

url = "http://localhost:8787/cruxx/summarize/all?url=https://mahendradani.vercel.app"

payload = {}
headers = {}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)
```

3. Go
```go
package main

import (
  "fmt"
  "net/http"
  "io"
)

func main() {

  url := "http://localhost:8787/cruxx/summarize/all?url=https%3A%2F%2Fmahendradani.vercel.app"
  method := "GET"

  client := &http.Client {
  }
  req, err := http.NewRequest(method, url, nil)

  if err != nil {
    fmt.Println(err)
    return
  }
  res, err := client.Do(req)
  if err != nil {
    fmt.Println(err)
    return
  }
  defer res.Body.Close()

  body, err := io.ReadAll(res.Body)
  if err != nil {
    fmt.Println(err)
    return
  }
  fmt.Println(string(body))
}
```

Response for website [https://mahendradani.vercel.app](https://mahendradani.vercel.app)
```json
{
    "totalLinks": 11,
    "successCount": 11,
    "data": [
        {
            "name": "Mahendra Dani",
            "href": "/",
            "alt": "",
            "target": "blank",
            "url": "https://mahendradani.vercel.app/",
            "baseURL": "https://mahendradani.vercel.app",
            "summary": "This is the portfolio website of Mahendra Dani, a developer and programmer passionate about problem-solving using computers. He shares his journey through blogs and thoughts, and showcases various projects including Genekriti, Rhymes and Fables, and Vector. He aims to achieve widespread recognition through his work and ultimately gain a Wikipedia entry. The website features links to his GitHub, LinkedIn, and X accounts, allowing visitors to connect with him further. \n"
        },
        {
            "name": "blogs",
            "href": "/blogs",
            "alt": "",
            "target": "blank",
            "url": "https://mahendradani.vercel.app/blogs",
            "baseURL": "https://mahendradani.vercel.app",
            "summary": "This HTML code represents the \"Blogs\" page of Mahendra Dani's personal website. It features two blog posts: \"Are Your React Components Really Reusable?\" and \"Hello World\". The site also includes navigation to other pages, social media links, and a footer. The content focuses on sharing Mahendra's experiences and learnings in programming, development, and technology. \n"
        },
        {
            "name": "thoughts",
            "href": "/thoughts",
            "alt": "",
            "target": "blank",
            "url": "https://mahendradani.vercel.app/thoughts",
            "baseURL": "https://mahendradani.vercel.app",
            "summary": "This HTML code represents a personal blog page titled \"Thoughts\" belonging to Mahendra Dani. The page features a blog post titled \"Push Yourself\" about the importance of perseverance and continuous learning. It also includes links to the author's GitHub, LinkedIn, and X profiles. The blog's navigation bar provides links to other sections, \"blogs\" and \"thoughts\". The page is aesthetically designed with a dark color scheme and visually appealing font choices. \n"
        },
        {
            "name": "hello-world  blog?",
            "href": "/blogs/hello-world",
            "alt": "",
            "target": "blank",
            "url": "https://mahendradani.vercel.app/blogs/hello-world",
            "baseURL": "https://mahendradani.vercel.app",
            "summary": "This HTML code represents a blog post titled \"Hello World\" by Mahendra Dani. The post chronicles his journey into programming, starting with his initial lack of knowledge and passion for gaming, to his foray into web development and open source contributions.  He shares his experiences learning various technologies like Next.js, Tailwind CSS, and C++, and highlights projects like \"Rhymes and Fables\" and \"Genekriti\". The post concludes with his rationale for blogging - to reflect and document his learning process, and his aspirations for a future rooted in deep understanding of computer science fundamentals. \n"
        },
        {
            "name": "GenekritiGenekriti is a platform where we the people can contribute to our environment and earn rewards and points for each sustainable practice.",
            "href": "https://genekriti.vercel.app",
            "alt": "",
            "target": "blank",
            "url": "https://genekriti.vercel.app",
            "baseURL": "https://mahendradani.vercel.app",
            "summary": "GeneKriti is a platform promoting sustainable living with features like ReKriti, a waste-to-treasure tool, a marketplace for eco-friendly products, interactive quizzes on sustainability, and curated lists of relevant events.  The website highlights the platform's mission to empower eco-conscious practices and create a greener future. It also emphasizes the importance of community engagement and provides links to relevant resources and contact information. \n"
        },
        {
            "name": "Rhymes and FablesA web app to read, write and share stories, poems and quotes",
            "href": "https://github.com/MahendraDani/supabase-hackathon",
            "alt": "",
            "target": "blank",
            "url": "https://github.com/MahendraDani/supabase-hackathon",
            "baseURL": "https://mahendradani.vercel.app",
            "summary": "This HTML code represents the GitHub repository page for \"supabase-hackathon\" by \"MahendraDani\". The repository contains the source code for \"Rhymes and Fables\", a platform built for the Supabase Launch Week X Hackathon. The platform allows users to read, write, and share stories, poems, and quotes. It features two-factor authentication, personalized feeds, a built-in editor, like/comment functionality, and light/dark mode support. The repository uses Nextjs, Supabase Auth, Supabase Database, shadcn, Tailwind CSS, and Zod for its tech stack. \n"
        },
        {
            "name": "vectorA minimal library to play with Vectors (physics/maths) using C++",
            "href": "https://github.com/MahendraDani/vector",
            "alt": "",
            "target": "blank",
            "url": "https://github.com/MahendraDani/vector",
            "baseURL": "https://mahendradani.vercel.app",
            "summary": "This HTML code represents the GitHub repository page for the \"vector\" project by MahendraDani. It's a C++ library designed for working with vectors in physics and mathematics. The project aims to provide basic vector operations like addition, subtraction, dot product, and cross product. The README provides a detailed description of the library's features, usage examples, and learning objectives. The page also includes information about the repository's language breakdown (C++ and Makefile), star count, and fork count. \n"
        },
        {
            "name": "wc-cliCLI tool to obtain stats of your files.",
            "href": "https://github.com/MahendraDani/wc-cli",
            "alt": "",
            "target": "blank",
            "url": "https://github.com/MahendraDani/wc-cli",
            "baseURL": "https://mahendradani.vercel.app",
            "summary": "This HTML code represents the GitHub repository page for \"wc-cli\" by MahendraDani.  The repository is publicly available and contains a CLI tool that provides file statistics, similar to the \"wc\" command. The repository features a README file that explains the project's purpose, usage instructions, and how to contribute. It also includes a demo video for better understanding.  \n"
        },
        {
            "name": "GitHub",
            "href": "https://github.com/MahendraDani",
            "alt": "",
            "target": "_blank",
            "url": "https://github.com/MahendraDani",
            "baseURL": "https://mahendradani.vercel.app",
            "summary": "This HTML code represents the profile page of GitHub user MahendraDani. The page displays basic information about the user, such as their avatar, name, bio, location, and social media links. It also includes a navigation bar with tabs for Overview, Repositories, Projects, Packages, Stars, and Achievements. The user has 61 repositories, 20 followers, and 50 following. The page also shows the user's pinned repositories. The HTML includes various JavaScript and CSS files for styling and functionality. \n"
        },
        {
            "name": "Linkedin",
            "href": "https://linkedin.com/in/mahendra-dani",
            "alt": "",
            "target": "_blank",
            "url": "https://linkedin.com/in/mahendra-dani",
            "baseURL": "https://mahendradani.vercel.app",
            "summary": "This HTML code redirects users to a LinkedIn authentication page. It reads tracking information from cookies and constructs a URL with the user's referrer, redirecting them to \"https://www.linkedin.com/authwall\" for authentication. It prioritizes HTTPS connections and adjusts the domain name to \"www.linkedin.com\" for international versions. The code ensures only the first 200 characters of the referrer are included in the redirection URL. \n"
        },
        {
            "name": "X",
            "href": "https://x.com/MahendraDani09",
            "alt": "",
            "target": "_blank",
            "url": "https://x.com/MahendraDani09",
            "baseURL": "https://mahendradani.vercel.app",
            "summary": "This HTML code redirects users from x.com to Twitter. It specifically directs them to a migration page on Twitter with a unique token. The code also sets up various meta tags for search engines, social media platforms, and mobile devices, including favicons and icons for different platforms. Notably, the code includes a link to the Tor hidden service for Twitter, suggesting an alternate access point. \n"
        }
    ],
    "error": null
}
```