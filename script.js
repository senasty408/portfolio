// ハンバーガーメニューの開閉機能
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navi = document.querySelector('.navi');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navi.classList.toggle('active');
    });

    // メニューのリンクをクリックしたら閉じる
    const navLinks = document.querySelectorAll('.navi a');
    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navi.classList.remove('active');
        });
    });
});


// ---------- スクロールフェードイン ----------

// 監視する要素を取得（.fade-inがついているもの全部）
const fadeElements = document.querySelectorAll('.fade-in');

// 監視の設定（画面のどのくらいの位置に来たら発火するか）
const options = {
    root: null,
    rootMargin: "0px",
    threshold: 0.2 // 要素の20%が見えたらアニメーション開始
};

// 監視の実行役（オブザーバー）を作成
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        // 画面に入ったら
        if (entry.isIntersecting) {
            entry.target.classList.add('active'); // activeクラスをつける
            // 一度動いたら監視をやめる場合は下の一行のコメントアウトを外す
            // observer.unobserve(entry.target);
        }
    });
}, options);

// 監視を開始
fadeElements.forEach(el => {
    observer.observe(el);
});

// ---------- スライドショー画像の遅延読み込み（LCP改善対策） ----------
document.addEventListener('DOMContentLoaded', () => {
    // スライドショーのコンテナを取得
    const slideshow = document.getElementById('js-slideshow');

    // index.htmlに存在する場合のみ実行
    if (slideshow) {
        // 追加する画像パスとサイズのリスト（2枚目〜4枚目）
        const images = [
            { src: 'img/sttoke.webp', width: 1600, height: 2000 },
            { src: 'img/mellow.webp', width: 1600, height: 2000 },
            { src: 'img/noir-edge-01.webp', width: 1600, height: 1334 }
        ];

        // ページ読み込み完了後に実行することで、初期表示（LCP）への影響を防ぐ
        window.addEventListener('load', () => {
            // 画像リストをループして、新しいliとimg要素を作成
            images.forEach((data) => {
                const li = document.createElement('li');
                const img = document.createElement('img');
                img.src = data.src;
                img.alt = '';
                img.width = data.width;
                img.height = data.height;
                img.loading = 'lazy'; // 念のため遅延読み込みを設定
                img.decoding = 'async';

                li.appendChild(img);
                slideshow.appendChild(li);
            });
        });
    }
});