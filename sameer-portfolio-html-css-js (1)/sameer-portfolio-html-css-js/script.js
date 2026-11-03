const GITHUB_USERNAME = 'Muhammad-Sameer29';
const GITHUB_API = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`;
const GITHUB_PROFILE = `https://github.com/${GITHUB_USERNAME}`;

// Update these before publishing your portfolio.
const CONTACT_EMAIL = 'your.email@example.com';
const LINKEDIN_URL = 'https://www.linkedin.com/';

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();

  const emailLink = document.getElementById('email-link');
  emailLink.href = `mailto:${CONTACT_EMAIL}`;
  const linkedinLink = document.getElementById('linkedin-link');
  linkedinLink.href = LINKEDIN_URL;

  loadGithubProjects();
});

const fallbackProjects = [
  {
    name: 'Deals-on-Wheels',
    description: 'An Angular-based car marketplace for browsing and exploring vehicles through a responsive interface.',
    html_url: `${GITHUB_PROFILE}/Deals-on-Wheels`,
    language: 'TypeScript',
    topics: ['Angular', 'TypeScript', 'Marketplace'],
    category: 'WEB APPLICATION',
    visual: 'angular'
  },
  {
    name: 'Blaze Shield',
    description: 'An AI-powered fire and smoke detection system combining computer vision, Raspberry Pi, and Android integration.',
    html_url: `${GITHUB_PROFILE}/blaze-shield`,
    language: 'Python',
    topics: ['AI', 'Computer Vision', 'Raspberry Pi'],
    category: 'AI / IOT PROJECT',
    visual: 'ai'
  },
  {
    name: 'SkillForge',
    description: 'A full-stack web development project bringing together frontend and backend technologies.',
    html_url: `${GITHUB_PROFILE}/SkillForge`,
    language: 'Web Development',
    topics: ['Frontend', 'Backend', 'Full Stack'],
    category: 'FULL-STACK PROJECT',
    visual: 'fullstack'
  },
  {
    name: 'Git Practice',
    description: 'A learning repository for practicing Git, GitHub, and version-control workflows.',
    html_url: `${GITHUB_PROFILE}/git-practice`,
    language: 'HTML',
    topics: ['Git', 'GitHub', 'Learning'],
    category: 'LEARNING REPOSITORY',
    visual: 'generic'
  }
];

async function loadGithubProjects() {
  const status = document.getElementById('repo-status');
  const grid = document.getElementById('project-grid');

  try {
    const response = await fetch(GITHUB_API, {
      headers: { Accept: 'application/vnd.github+json' }
    });
    if (!response.ok) throw new Error(`GitHub returned ${response.status}`);

    const repos = await response.json();
    const projects = repos
      .filter(repo => !repo.fork)
      .map(repo => ({
        name: prettifyName(repo.name),
        description: repo.description || 'Explore the source code and implementation details in this repository.',
        html_url: repo.html_url,
        language: repo.language || 'Project',
        topics: repo.topics || [],
        homepage: repo.homepage,
        stars: repo.stargazers_count,
        category: 'GITHUB REPOSITORY',
        visual: chooseVisual(repo.name)
      }));

    if (!projects.length) throw new Error('No public repositories found');
    renderProjects(projects, grid);
    status.textContent = 'Loaded public repositories from GitHub.';
  } catch (error) {
    renderProjects(fallbackProjects, grid);
    status.textContent = 'Showing featured projects. GitHub may be unavailable or rate-limited right now.';
    console.warn('Unable to load GitHub repositories:', error);
  }
}

function prettifyName(name) {
  return name.replace(/[-_]+/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase());
}

function chooseVisual(name) {
  const value = name.toLowerCase();
  if (value.includes('deals') || value.includes('wheel') || value.includes('car')) return 'angular';
  if (value.includes('blaze') || value.includes('fire')) return 'ai';
  if (value.includes('skill') || value.includes('forge')) return 'fullstack';
  return 'generic';
}

function renderProjects(projects, grid) {
  grid.innerHTML = '';
  projects.forEach(project => {
    const card = document.createElement('article');
    card.className = 'project-card';

    const preview = document.createElement('div');
    preview.className = `project-preview preview-${project.visual || 'generic'}`;
    preview.innerHTML = `
      <div class="preview-top">
        <span class="preview-window-dots"><i></i><i></i><i></i></span>
        <span class="preview-label"></span>
      </div>
      <div class="preview-art"></div>`;

    preview.querySelector('.preview-label').textContent = project.category || 'GITHUB REPOSITORY';
    const art = preview.querySelector('.preview-art');

    if (project.visual === 'angular') {
      art.innerHTML = '<span class="art-line line-a"></span><span class="art-line line-b"></span><div class="car-shape"><span></span></div><span class="art-caption">WEB · BUILD · SHIP</span>';
    } else if (project.visual === 'ai') {
      art.innerHTML = '<div class="ai-rings"><span>AI</span></div><span class="art-caption">DETECT · ALERT · RESPOND</span>';
    } else if (project.visual === 'fullstack') {
      art.innerHTML = '<div class="code-window"><span>const</span> <b>build</b> = () =&gt; {<br>&nbsp;&nbsp;ship<span>();</span><br>};</div>';
    } else {
      art.innerHTML = '<span class="generic-code">&lt;/&gt;</span>';
    }

    const content = document.createElement('div');
    content.className = 'project-content';
    const meta = document.createElement('div');
    meta.className = 'project-meta';
    const language = document.createElement('span');
    language.textContent = project.language || 'PROJECT';
    meta.appendChild(language);

    if (project.stars > 0) {
      const stars = document.createElement('span');
      stars.textContent = `☆ ${project.stars}`;
      meta.appendChild(stars);
    }

    const title = document.createElement('h3');
    title.textContent = project.name;
    const description = document.createElement('p');
    description.textContent = project.description || 'Explore the source code and implementation details in this repository.';

    const tags = document.createElement('div');
    tags.className = 'tag-list';
    (project.topics || []).slice(0, 4).forEach(topic => {
      const tag = document.createElement('span');
      tag.textContent = topic;
      tags.appendChild(tag);
    });

    const links = document.createElement('div');
    links.className = 'project-links';
    links.appendChild(makeLink(project.html_url, 'Source code ↗'));

    if (project.homepage) links.appendChild(makeLink(project.homepage, 'Live demo ↗'));

    content.append(meta, title, description);
    if (tags.childElementCount) content.appendChild(tags);
    content.appendChild(links);
    card.append(preview, content);
    grid.appendChild(card);
  });
}

function makeLink(url, label) {
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.rel = 'noreferrer';
  link.textContent = label;
  return link;
}
