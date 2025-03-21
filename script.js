const themeToggle = document.getElementById("theme-toggle");
const modeLabel = document.getElementById("mode-label");
let allRepos = [];

if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark");
    themeToggle.checked = true;
    modeLabel.textContent = "Dark Mode";
}

themeToggle.addEventListener("change", () => {
    document.body.classList.toggle("dark");
    const mode = document.body.classList.contains("dark") ? "enabled" : "disabled";
    localStorage.setItem("darkMode", mode);
    modeLabel.textContent = mode === "enabled" ? "Dark Mode" : "Light Mode";
});

async function getUser() {
    const username = document.getElementById('username').value;
    if (!username) return alert("Enter a GitHub username");

    document.getElementById('loading').classList.remove('hidden');
    document.getElementById('profile').classList.add('hidden');
    document.querySelector('.repo-title').classList.add('hidden');
    document.getElementById('repoList').innerHTML = '';

    const url = `https://api.github.com/users/${username}`;
    const repoUrl = `https://api.github.com/users/${username}/repos?per_page=100`;

    try {
        const [userRes, repoRes] = await Promise.all([fetch(url), fetch(repoUrl)]);
        if (!userRes.ok) throw new Error("User not found");

        const userData = await userRes.json();
        allRepos = await repoRes.json();

        document.getElementById("avatar").src = userData.avatar_url;
        document.getElementById("name").textContent = userData.name || username;
        document.getElementById("bio").textContent = userData.bio || "No bio available";
        document.getElementById("followers").textContent = userData.followers;
        document.getElementById("following").textContent = userData.following;
        document.getElementById("repos").textContent = userData.public_repos;
        
        document.getElementById("profile").classList.remove("hidden");
        document.querySelector(".repo-title").classList.remove("hidden");

        displayRepos();

    } catch (error) {
        alert(error.message);
    } finally {
        document.getElementById('loading').classList.add('hidden');
    }
}

function displayRepos() {
    const repoList = document.getElementById("repoList");
    repoList.innerHTML = "";

    if (allRepos.length === 0) {
        repoList.innerHTML = "<p>No repositories found</p>";
        return;
    }

    allRepos.forEach(repo => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <a href="${repo.html_url}" target="_blank">${repo.name}</a>
            <span class="repo-details">${repo.stargazers_count} ⭐ · ${repo.language || 'N/A'}</span>
        `;
        repoList.appendChild(listItem);
    });
}

document.getElementById('username').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getUser();
    }
});
