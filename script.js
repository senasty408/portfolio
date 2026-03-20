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
            { src: 'img/sora_mockup.webp', width: 1600, height: 1334 }
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


// ---------- 追加: スライドショーの画像切り替え（重なる時に前の画像を消す） ----------
document.addEventListener('DOMContentLoaded', () => {
    const slideshow = document.getElementById('js-slideshow');
    if (!slideshow) return;

    // スクロール時に各カード（li）がストップ位置（上から10vh付近）に来たかを監視
    const slideObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentLi = entry.target;
                const allLis = Array.from(slideshow.querySelectorAll('li'));
                const currentIndex = allLis.indexOf(currentLi);

                allLis.forEach((li, index) => {
                    const img = li.querySelector('img');
                    if (img) {
                        if (index < currentIndex) {
                            // 過去（上にある）画像はフワッと消す
                            img.classList.add('hide-prev');
                        } else {
                            // 現在およびこれからの画像は表示しておく
                            img.classList.remove('hide-prev');
                        }
                    }
                });
            }
        });
    }, {
        // 画面の上から15%〜50%付近（ストップ位置の少し下）を通過したかを判定
        rootMargin: "-15% 0px -70% 0px"
    });

    // 動的にJSで追加されるliもすべて監視対象にするため、MutationObserverを使用
    const mutationObserver = new MutationObserver(() => {
        slideshow.querySelectorAll('li').forEach(li => slideObserver.observe(li));
    });

    // 最初からあるliを監視＆追加を監視
    slideshow.querySelectorAll('li').forEach(li => slideObserver.observe(li));
    mutationObserver.observe(slideshow, { childList: true });
});