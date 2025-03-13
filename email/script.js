let accounts = [];
let masterKey = ""; // 🔑 ユーザー入力のキー

// 🔒 ユーザーにマスターパスワードを要求
function requestMasterKey() {
    masterKey = prompt("マスターパスワードを入力してください:");
    if (!masterKey) {
        alert("マスターパスワードが必要です。");
        return;
    }
    loadAccounts();
}

// 🔒 暗号化関数（ユーザーのマスターパスワードを利用）
function encryptData(data) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), masterKey).toString();
}

// 🔓 復号化関数
function decryptData(encryptedData) {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedData, masterKey);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (e) {
        console.error("復号に失敗しました", e);
        return null;
    }
}

// 📝 フォームの登録処理
document.getElementById('accountForm').addEventListener('submit', function(event) {
    event.preventDefault();
    if (!masterKey) {
        alert("マスターパスワードを入力してください。");
        return;
    }

    const type = document.getElementById('accountType').value;
    const identifier = document.getElementById('identifier').value;
    const password = document.getElementById('password').value;
    const usage = document.getElementById('usage').value;
    const memo = document.getElementById('memo').value;
    const pinned = document.getElementById('pin').checked;

    accounts.push({ type, identifier, password, usage, memo, pinned });
    saveAccounts();
    updateAccountList();
    document.getElementById('accountForm').reset();
});

// 💾 データの保存
function saveAccounts() {
    if (!masterKey) return;
    localStorage.setItem("accounts", encryptData(accounts));
}

// 📂 データの読み込み
function loadAccounts() {
    let storedData = localStorage.getItem("accounts");
    if (storedData) {
        const decrypted = decryptData(storedData);
        if (decrypted) {
            accounts = decrypted;
            updateAccountList();
        } else {
            alert("復号に失敗しました。正しいマスターパスワードを入力してください。");
        }
    }
}

// 📋 アカウント一覧の更新
function updateAccountList() {
    const searchQuery = document.getElementById('search').value.toLowerCase();
    const accountList = document.getElementById('accountList');
    accountList.innerHTML = '<h2>登録済みアカウント</h2>';

    accounts
        .filter(acc => acc.identifier.toLowerCase().includes(searchQuery) || acc.usage.toLowerCase().includes(searchQuery) || acc.memo.toLowerCase().includes(searchQuery))
        .sort((a, b) => b.pinned - a.pinned)
        .forEach((item, index) => {
            const accountItem = document.createElement('div');
            accountItem.className = 'account-item';
            accountItem.innerHTML = `
                <div>
                    <strong>${item.type === "email" ? "メールアドレス:" : "ゲーム名:"}</strong> ${item.identifier} <br>
                    <strong>パスワード:</strong> ${item.password} <br>
                    <strong>用途:</strong> ${item.usage || "なし"}<br>
                    <strong>メモ:</strong> ${item.memo || "なし"}
                </div>
                <button onclick="deleteAccount(${index})">削除</button>
            `;
            accountList.appendChild(accountItem);
        });
}

// 🛠️ インポート機能
function importData() {
    const fileInput = document.getElementById("importFile");
    if (!fileInput.files.length) {
        alert("インポートするファイルを選択してください。");
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        try {
            accounts = JSON.parse(event.target.result);
            saveAccounts();
            updateAccountList();
            alert("データを復元しました！");
        } catch (error) {
            alert("インポートに失敗しました: " + error.message);
        }
    };

    reader.readAsText(file);
}

// 🔄 初期化
requestMasterKey();
