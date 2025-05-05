//Input original data to localStorage
// import { users, posts } from './data.js';
// localStorage.setItem('users', JSON.stringify(users));
// localStorage.setItem('posts', JSON.stringify(posts));

// Document elements
//Login
const loginEmailInput = document.getElementById('login-email');
const loginPasswordInput = document.getElementById('login-password');
const loginMessage = document.getElementById('login-message');

//Register
const regFirstNameInput = document.getElementById('reg-first-name');
const regLastNameInput = document.getElementById('reg-last-name');
const regEmailInput = document.getElementById('reg-email');
const regPasswordInput = document.getElementById('reg-password');
const registerMessage = document.getElementById('register-message');

// Search and view posts
const searchKeywordInput = document.getElementById('searchKeyword');

// List of users and posts
const userListDiv = document.getElementById('userList');
const postListDiv = document.getElementById('postList');

// Post detail and posts by user
const postDetailDiv = document.getElementById('postDetail');
const userEmailInput = document.getElementById('userEmail');
const postsByUserDiv = document.getElementById('postsByUser');
const postIdInput = document.getElementById('postId');

// Data from localStorage
let users = JSON.parse(localStorage.getItem('users')) || [];
let posts = JSON.parse(localStorage.getItem('posts')) || [];

// Save data functions
function saveUsersToStorage(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

function savePostsToStorage(posts) {
    localStorage.setItem('posts', JSON.stringify(posts));
}

// Generate new User ID
function getNextUserId(users) {
    if (users.length === 0) return 1;
    return Math.max(...users.map(u => u.id)) + 1;
}

// Functions for user login
function loginUser() {
    const email = loginEmailInput.value.trim();
    const password = loginPasswordInput.value.trim();

    if (!email || !password) {
        loginMessage.textContent = 'Hãy nhập đầy đủ thông tin';
        return;
    }

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        loginMessage.classList.remove('text-danger');
        loginMessage.classList.add('text-success');
        loginMessage.textContent = `Xin chào ${user.first_name} ${user.last_name}`;
    } else {
        loginMessage.classList.remove('text-success');
        loginMessage.classList.add('text-danger');
        loginMessage.textContent = 'Thông tin tài khoản không chính xác';
    }
}

// Functions for user registration
function registerUser() {
    const firstName = regFirstNameInput.value.trim();
    const lastName = regLastNameInput.value.trim();
    const email = regEmailInput.value.trim();
    const password = regPasswordInput.value.trim();

    if (!firstName || !lastName || !email || !password) {
        registerMessage.textContent = 'Hãy nhập đầy đủ thông tin';
        return;
    }

    const existingUser = users.find(u => u.email === email);

    if (existingUser) {
        registerMessage.textContent = 'Email này đã có tài khoản';
        return;
    }

    const newUser = {
        id: getNextUserId(users),
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password
    };

    users.push(newUser);
    saveUsersToStorage(users);

    registerMessage.classList.remove('text-danger');
    registerMessage.classList.add('text-success');
    registerMessage.textContent = 'Đăng ký thành công. Bạn có thể đăng nhập!';
}

// Functions for rendering users
function renderUsers(usersToRender) {
    userListDiv.innerHTML = ''; 

    if (usersToRender.length === 0) {
        userListDiv.innerHTML = '<p>Không tìm thấy người dùng phù hợp.</p>';
        return;
    }

    const table = document.createElement('table');
    table.classList.add('table', 'table-striped');
    table.innerHTML = `
        <thead>
        <tr>
            <th>ID</th>
            <th>Họ và tên</th>
            <th>Email</th>
        </tr>
        </thead>
        <tbody>
        ${usersToRender.map(user => `
            <tr>
            <td>${user.id}</td>
            <td>${user.first_name} ${user.last_name}</td>
            <td>${user.email}</td>
            </tr>
        `).join('')}
        </tbody>
    `;

    userListDiv.appendChild(table);
}

// Search users
function searchUsers() {
    const keyword = searchKeywordInput.value.trim().toLowerCase();

    if (keyword === '') {
        renderUsers(users); 
    } else {
        const filteredUsers = users.filter(user => {
        const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
        return fullName.includes(keyword) || user.email.toLowerCase().includes(keyword);
        });

        renderUsers(filteredUsers); 
    }
}

// Functions for rendering posts
function renderPosts(postsToRender) {
    postListDiv.innerHTML = ''; 
  
    if (postsToRender.length === 0) {
        postListDiv.innerHTML = '<p>Không có bài viết nào.</p>';
        return;
    }
  
    const table = document.createElement('table');
    table.classList.add('table', 'table-striped');
    table.innerHTML = `
      <thead>
        <tr>
          <th>ID</th>
          <th>Tiêu đề</th>
          <th>Ngày tạo</th>
          <th>Họ và tên người tạo</th>
        </tr>
      </thead>
      <tbody>
        ${postsToRender.map(post => `
          <tr>
            <td>${post.id}</td>
            <td>${post.title}</td>
            <td>${post.created_at}</td>
            <td>${getUserNameById(post.user_id)}</td>
          </tr>
        `).join('')}
      </tbody>
    `;
    
    postListDiv.appendChild(table);
}

// Get user name by ID
function getUserNameById(userId) {
    const user = users.find(user => user.id === userId);
    return user ? `${user.first_name} ${user.last_name}` : 'Không tìm thấy';
}

// View post detail
function viewPostDetail() {
    const postId = postIdInput.value.trim();
    
    if (!postId) {
        postDetailDiv.innerHTML = '<p>Vui lòng nhập ID của post.</p>';
        return;
    }

    const post = posts.find(post => post.id == postId);

    if (!post) {
        postDetailDiv.innerHTML = '<p>Post không tồn tại.</p>';
        return;
    }

    const user = users.find(user => user.id === post.user_id);
    const postDetail = `
      <p><strong>ID:</strong> ${post.id}</p>
      <p><strong>Tiêu đề:</strong> ${post.title}</p>
      <p><strong>Nội dung:</strong> ${post.content}</p>
      <p><strong>Link ảnh:</strong> <a href="${post.image}" target="_blank">${post.image}</a></p>
      <p><strong>Người tạo:</strong> ${user.first_name} ${user.last_name}</p>
      <p><strong>Ngày tạo:</strong> ${post.created_at}</p>
      <p><strong>Ngày sửa đổi:</strong> ${post.updated_at}</p>
    `;

    postDetailDiv.innerHTML = postDetail;
}

// Search posts by user
function searchPostsByUser() {
    const userEmail = userEmailInput.value.trim().toLowerCase();

    if (!userEmail) {
        postsByUserDiv.innerHTML = '<p>Vui lòng nhập email của user.</p>';
        return;
    }

    const user = users.find(user => user.email.toLowerCase() === userEmail);

    if (!user) {
        postsByUserDiv.innerHTML = '<p>Không tìm thấy user với email này.</p>';
        return;
    }

    const postsByUser = posts.filter(post => post.user_id === user.id);
    renderPosts(postsByUser);
}

// Event listeners
document.getElementById('login-btn').addEventListener('click', loginUser);
document.getElementById('register-btn').addEventListener('click', registerUser);
document.getElementById('searchBtn').addEventListener('click', searchUsers);
document.getElementById('viewPostBtn').addEventListener('click', viewPostDetail);
document.getElementById('searchByUserBtn').addEventListener('click', searchPostsByUser);

// Initial render
renderUsers(users);
renderPosts(posts);