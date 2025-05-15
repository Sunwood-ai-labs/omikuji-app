// おみくじアプリ JavaScript

// 要素の取得
const omikujiElement = document.getElementById('omikuji');
const drawButton = document.getElementById('draw-button');
const resetButton = document.getElementById('reset-button');
const resultEmoji = document.getElementById('result-emoji');
const resultTitle = document.getElementById('result-title');
const resultDescription = document.getElementById('result-description');
const adviceContainer = document.getElementById('advice-container');
const adviceTabs = document.querySelectorAll('.advice-tab');
const adviceText = document.getElementById('advice-text');
const currentYearElement = document.getElementById('current-year');

// 現在の年を設定
currentYearElement.textContent = new Date().getFullYear();

// RESTful APIのエンドポイント
const API_BASE_URL = window.location.origin;
const OMIKUJI_API = `${API_BASE_URL}/api/omikuji`;
const ADVICE_API = `${API_BASE_URL}/api/advice`;

// 現在選択されているカテゴリ
let currentCategory = 'love';

// おみくじを引く処理
drawButton.addEventListener('click', async () => {
    try {
        // ボタンを無効化してローディング表示
        drawButton.disabled = true;
        drawButton.textContent = 'おみくじ引き中...';
        
        // 演出のためのタイムアウト（実際はAPIレスポンスを待つ）
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // APIからおみくじ結果を取得
        const response = await fetch(OMIKUJI_API);
        if (!response.ok) {
            throw new Error('おみくじの取得に失敗しました');
        }
        
        const omikujiResult = await response.json();
        
        // 結果を表示
        resultEmoji.textContent = omikujiResult.emoji;
        resultTitle.textContent = omikujiResult.result;
        resultDescription.textContent = omikujiResult.description;
        
        // デフォルトカテゴリのアドバイスを取得して表示
        await loadAdvice('love');
        
        // カードをひっくり返すアニメーション
        omikujiElement.classList.add('flipped');
        
    } catch (error) {
        console.error('エラー:', error);
        alert('おみくじの取得中にエラーが発生しました。もう一度お試しください。');
        
        // エラー時にはボタンを元に戻す
        drawButton.disabled = false;
        drawButton.textContent = 'おみくじを引く';
    }
});

// もう一度引くボタンの処理
resetButton.addEventListener('click', () => {
    // カードを元に戻す
    omikujiElement.classList.remove('flipped');
    
    // 少し遅延させてから内容をリセット
    setTimeout(() => {
        resultEmoji.textContent = '';
        resultTitle.textContent = '';
        resultDescription.textContent = '';
        adviceText.textContent = 'アドバイスをロード中...';
        
        // ボタンを元に戻す
        drawButton.disabled = false;
        drawButton.textContent = 'おみくじを引く';
        
        // アドバイスタブをリセット
        adviceTabs.forEach(tab => {
            if (tab.dataset.category === 'love') {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        
        currentCategory = 'love';
    }, 500);
});

// アドバイスタブの切り替え処理
adviceTabs.forEach(tab => {
    tab.addEventListener('click', async () => {
        // すでにアクティブなタブならば何もしない
        if (tab.classList.contains('active')) return;
        
        // 全てのタブから active クラスを削除
        adviceTabs.forEach(t => t.classList.remove('active'));
        
        // クリックされたタブに active クラスを追加
        tab.classList.add('active');
        
        // 選択されたカテゴリを取得してアドバイスをロード
        const category = tab.dataset.category;
        currentCategory = category;
        await loadAdvice(category);
    });
});

// 特定カテゴリのアドバイスを読み込む関数
async function loadAdvice(category) {
    try {
        // ローディング表示
        adviceText.textContent = 'アドバイスをロード中...';
        
        // APIからアドバイスを取得
        const response = await fetch(`${ADVICE_API}/${category}`);
        if (!response.ok) {
            throw new Error(`${category}に関するアドバイスの取得に失敗しました`);
        }
        
        const adviceData = await response.json();
        
        // アドバイステキストを表示
        adviceText.textContent = adviceData.advice;
        
    } catch (error) {
        console.error('アドバイス取得エラー:', error);
        adviceText.textContent = 'アドバイスの取得に失敗しました。';
    }
}

// ページ読み込み完了時のアニメーション
document.addEventListener('DOMContentLoaded', () => {
    // 必要に応じて追加のアニメーションをここに記述
});

// MCP Client モードの場合の処理（拡張機能）
/* この部分は拡張機能として実装予定
async function initMCPClient() {
    try {
        // MCP クライアントの初期化コード
        // ...
    } catch (error) {
        console.error('MCP初期化エラー:', error);
    }
}
*/
