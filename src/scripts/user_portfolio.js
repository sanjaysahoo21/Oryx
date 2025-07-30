const leetcodeUsername = "example_user";
const gfgUsername = "example_user";
const codechefUsername = "example_user";
const hackerrankUsername = "example_user";
const githubUsername = "example_user";

// LeetCode
fetch(`https://leetcode-stats-api.herokuapp.com/${leetcodeUsername}`)
    .then(res => res.json())
    .then(data => {
        console.log('LeetCode API Response:', data);
        document.getElementById('leetcode-problems').textContent = data.totalSolved || 'N/A';
        document.getElementById('leetcode-ranking').textContent = data.ranking || 'N/A';
        document.getElementById('leetcode-rating').textContent = data.contestRating || 'N/A';
        document.getElementById('leetcode-username').textContent = leetcodeUsername;
    }).catch(error => {
        console.error('LeetCode API Error:', error);
        document.getElementById('leetcode-problems').textContent = 'API Error';
        document.getElementById('leetcode-ranking').textContent = 'API Error';
        document.getElementById('leetcode-rating').textContent = 'API Error';
        document.getElementById('leetcode-username').textContent = leetcodeUsername;
});

// GeeksforGeeks
document.getElementById('gfg-problems').textContent = '150';
document.getElementById('gfg-score').textContent = '1250';
document.getElementById('gfg-stars').textContent = '50';
document.getElementById('gfg-username').textContent = gfgUsername;

// CodeChef
document.getElementById('codechef-problems').textContent = '75';
document.getElementById('codechef-rating').textContent = '1650';
document.getElementById('codechef-rank').textContent = '25000';
document.getElementById('codechef-username').textContent = codechefUsername;

// HackerRank
document.getElementById('hackerrank-problems').textContent = '120';
document.getElementById('hackerrank-rank').textContent = 'Gold';
document.getElementById('hackerrank-badges').textContent = '15';
document.getElementById('hackerrank-username').textContent = hackerrankUsername;

// GitHub
fetch(`https://api.github.com/users/${githubUsername}`)
    .then(res => res.json())
    .then(data => {
        console.log('GitHub API Response:', data);
        document.getElementById('github-repos').textContent = data.public_repos || 'N/A';
        document.getElementById('github-followers').textContent = data.followers || 'N/A';
        document.getElementById('github-username').textContent = githubUsername;
        return fetch(`https://api.github.com/users/${githubUsername}/repos?per_page=100`);
    })
    .then(res => res.json())
    .then(repos => {
        const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
        document.getElementById('github-stars').textContent = totalStars || '0';
    })
    .catch(error => {
        console.error('GitHub API Error:', error);
        document.getElementById('github-repos').textContent = 'API Error';
        document.getElementById('github-followers').textContent = 'API Error';
        document.getElementById('github-stars').textContent = 'API Error';
        document.getElementById('github-username').textContent = githubUsername;
    }
);