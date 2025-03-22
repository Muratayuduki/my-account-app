let registeredEmails = JSON.parse(localStorage.getItem("registeredEmails")) || [];

document.getElementById('emailForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const usage = document.getElementById('usage').value;
    
    registeredEmails.push({ email, password, usage });
    updateEmailList();
    document.getElementById('emailForm').reset();
});

function updateEmailList() {
    const emailList = document.getElementById('emailList');
    emailList.innerHTML = '<h2>登録済みアカウント</h2>';
    
    registeredEmails.forEach((item, index) => {
        const emailItem = document.createElement('div');
        emailItem.className = 'email-item';
        emailItem.innerHTML = `
            <div>
                <strong>${item.email}</strong> (${item.usage})
                <br>パスワード: <span>●●●●●</span>
            </div>
            <div class="button-group">
                <button onclick="copyEmail(${index})" class="action-button">📋 メール</button>
                <button onclick="copyPassword(${index})" class="action-button">🔑 パス</button>
                <button onclick="deleteEmail(${index})" class="delete-button">🗑️ 削除</button>
            </div>
        `;
        emailList.appendChild(emailItem);
    });
    localStorage.setItem("registeredEmails", JSON.stringify(registeredEmails));
}

function copyEmail(index) {
    navigator.clipboard.writeText(registeredEmails[index].email);
    alert('メールをコピーしました');
}

function copyPassword(index) {
    navigator.clipboard.writeText(registeredEmails[index].password);
    alert('パスワードをコピーしました');
}

function deleteEmail(index) {
    if (confirm("削除しますか？")) {
        registeredEmails.splice(index, 1);
        updateEmailList();
    }
}

// 初期表示
document.addEventListener('DOMContentLoaded', function() {
    updateEmailList();
}); 