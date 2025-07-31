let postsArr = [];
const STORAGE_KEY = 'my-posts-app';

function savePosts() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(postsArr));
}

function loadPosts() {
    const storedPosts = localStorage.getItem(STORAGE_KEY);
    if (storedPosts) {
        postsArr = JSON.parse(storedPosts);
    }
}
function getCurrentUserName() {
    const user = JSON.parse(localStorage.getItem('skillswap_user'));
    return user ? user.name : 'Guest';
}

function createPost(content) {
    const escapedContent = content.replace(/'/g, "\\'");
    return `
        <div class="post-card card text-white">
            <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                    <div class="bg-info rounded-circle me-3" style="width: 40px; height: 40px;"></div>
                    <div class="fw-bold">'${getCurrentUserName()}'</div>
                    <div class="ms-auto">
                        <button class="btn btn-sm btn-link text-primary p-0 me-2" onclick="editPost('${escapedContent}')">
                            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 640 640" width="20px"><path d="M416.9 85.2L372 130.1L509.9 268L554.8 223.1C568.4 209.6 576 191.2 576 172C576 152.8 568.4 134.4 554.8 120.9L519.1 85.2C505.6 71.6 487.2 64 468 64C448.8 64 430.4 71.6 416.9 85.2zM338.1 164L122.9 379.1C112.2 389.8 104.4 403.2 100.3 417.8L64.9 545.6C62.6 553.9 64.9 562.9 71.1 569C77.3 575.1 86.2 577.5 94.5 575.2L222.3 539.7C236.9 535.6 250.2 527.9 261 517.1L476 301.9L338.1 164z"/></svg>
                        </button>
                        <button class="btn btn-sm btn-link text-danger p-0" onclick="removePost('${escapedContent}')">
                            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 640 640" width="20px"><path d="M232.7 69.9L224 96L128 96C110.3 96 96 110.3 96 128C96 145.7 110.3 160 128 160L512 160C529.7 160 544 145.7 544 128C544 110.3 529.7 96 512 96L416 96L407.3 69.9C402.9 56.8 390.7 48 376.9 48L263.1 48C249.3 48 237.1 56.8 232.7 69.9zM512 208L128 208L149.1 531.1C150.7 556.4 171.7 576 197 576L443 576C468.3 576 489.3 556.4 490.9 531.1L512 208z"/></svg>
                        </button>
                    </div>
                </div>
                <p class="card-text">${content}</p>
                <div class="mt-2">
                    <button class="btn btn-sm btn-link text-success p-0 me-3">
                        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 640 640" width="20px"><path d="M144 224C161.7 224 176 238.3 176 256L176 512C176 529.7 161.7 544 144 544L96 544C78.3 544 64 529.7 64 512L64 256C64 238.3 78.3 224 96 224L144 224zM334.6 80C361.9 80 384 102.1 384 129.4L384 133.6C384 140.4 382.7 147.2 380.2 153.5L352 224L512 224C538.5 224 560 245.5 560 272C560 291.7 548.1 308.6 531.1 316C548.1 323.4 560 340.3 560 360C560 383.4 543.2 402.9 521 407.1C525.4 414.4 528 422.9 528 432C528 454.2 513 472.8 492.6 478.3C494.8 483.8 496 489.8 496 496C496 522.5 474.5 544 448 544L360.1 544C323.8 544 288.5 531.6 260.2 508.9L248 499.2C232.8 487.1 224 468.7 224 449.2L224 262.6C224 247.7 227.5 233 234.1 219.7L290.3 107.3C298.7 90.6 315.8 80 334.6 80z"/></svg>
                    </button>
                    <button class="btn btn-sm btn-link text-danger p-0">
                        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 640 640" width="20px"><path d="M448 96C474.5 96 496 117.5 496 144C496 150.3 494.7 156.2 492.6 161.7C513 167.2 528 185.8 528 208C528 217.1 525.4 225.6 521 232.9C543.2 237.1 560 256.6 560 280C560 299.7 548.1 316.6 531.1 324C548.1 331.4 560 348.3 560 368C560 394.5 538.5 416 512 416L352 416L380.2 486.4C382.7 492.7 384 499.5 384 506.3L384 510.5C384 537.8 361.9 559.9 334.6 559.9C315.9 559.9 298.8 549.3 290.4 532.6L234.1 420.3C227.4 407 224 392.3 224 377.4L224 190.8C224 171.4 232.9 153 248 140.8L260.2 131.1C288.6 108.4 323.8 96 360.1 96L448 96zM144 160C161.7 160 176 174.3 176 192L176 448C176 465.7 161.7 480 144 480L96 480C78.3 480 64 465.7 64 448L64 192C64 174.3 78.3 160 96 160L144 160z"/></svg>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function addPost() {
    let newPostContent = document.getElementById('thought').value;
    if (newPostContent.trim() === "") {
        alert("Please enter some content for your post.");
        return;
    }
    postsArr.push(newPostContent);
    savePosts();
    renderPosts();
    document.getElementById('thought').value = "";
    return false;
}

function removePost(contentToRemove) {
    let n = postsArr.length;
    for(let i = 0; i < n; i++) {
        if(postsArr[i] === contentToRemove) {
            postsArr.splice(i, 1);
            break;
        }
    }
    savePosts();
    renderPosts();
}

function editPost(contentToEdit) {
    let editInput = document.getElementById("edit_post_input");
    let okButton = document.getElementById("ok_post_button");

    if(editInput) {
        editInput.value = contentToEdit;
        editInput.style.visibility = "visible";
    }
    if(okButton) {
        okButton.style.visibility = "visible";
        okButton.onclick = function() {
            final_editPost(contentToEdit);
        };
    }
}

function final_editPost(originalContent) {
    let newContent = document.getElementById("edit_post_input").value;
    document.getElementById("edit_post_input").value = "";
    let n = postsArr.length;
    for(let i = 0; i < n; i++) {
        if(postsArr[i] === originalContent) {
            postsArr[i] = newContent;
            break;
        }
    }
    savePosts();
    renderPosts();
    let editInput = document.getElementById("edit_post_input");
    let okButton = document.getElementById("ok_post_button");
    if(editInput) editInput.style.visibility = "hidden";
    if(okButton) okButton.style.visibility = "hidden";
}

function renderPosts() {
    const postsContainer = document.getElementById('posts');
    if (postsContainer) {
        postsContainer.innerHTML = '';
        postsArr.forEach(postContent => {
            postsContainer.innerHTML += createPost(postContent);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadPosts();
    renderPosts();
});