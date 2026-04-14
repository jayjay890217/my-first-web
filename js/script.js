document.addEventListener('DOMContentLoaded', () => {
    const follower = document.querySelector('.cursor-follower');
    const movingImgs = document.querySelectorAll('.my-moving-png');
    const moveStrength = 40;

    // 1. 偵測是否為「觸控裝置」(手機或平板)
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // 2. 滑鼠跟隨邏輯 (只在「非」觸控螢幕上執行)
    if (!isTouchDevice) {
        window.addEventListener('mousemove', (e) => {
            const x = e.clientX;
            const y = e.clientY;
            const width = window.innerWidth;
            const height = window.innerHeight;

            // 電腦版：顯示並移動紅點
            if (follower) {
                follower.style.display = 'block'; 
                follower.style.left = x + 'px';
                follower.style.top = y + 'px';
            }

            movingImgs.forEach((img) => {
                const mouseX = (x / width) - 0.5;
                const mouseY = (y / height) - 0.5;
                img.style.transform = `translate(${mouseX * moveStrength}px, ${mouseY * moveStrength}px)`;
            });
        });
    } else {
        // 手機版：直接隱藏紅點，避免卡在畫面上
        if (follower) {
            follower.style.display = 'none';
        }
    }

    // 3. 陀螺儀處理邏輯
    function handleOrientation(event) {
        let x = event.gamma; 
        let y = event.beta;

        // 如果抓不到數據就跳出，避免報錯
        if (x === null || y === null) return;

        const xRatio = Math.max(-1, Math.min(1, x / 30));
        const yRatio = Math.max(-1, Math.min(1, (y - 45) / 30));

        movingImgs.forEach((img) => {
            const xMove = xRatio * (moveStrength / 2);
            const yMove = yRatio * (moveStrength / 2);
            img.style.transform = `translate(${xMove}px, ${yMove}px)`;
        });
    }

    // 4. 啟動陀螺儀的函數
    function initGyro() {
        if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
            // iOS 13+ 需要取得使用者授權
            DeviceOrientationEvent.requestPermission()
                .then(response => {
                    if (response === 'granted') {
                        window.addEventListener('deviceorientation', handleOrientation);
                    }
                })
                .catch(console.error);
        } else {
            // Android 不需要授權，直接監聽
            window.addEventListener('deviceorientation', handleOrientation);
        }
    }

    // 5. 針對手機的觸發機制
    if (isTouchDevice) {
        // Android 通常允許直接啟動，我們先嘗試啟動一次
        if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission !== 'function') {
            window.addEventListener('deviceorientation', handleOrientation);
        }

        // iOS 必須要有「人類互動」才能請求權限。
        // 我們綁定 'touchstart'，這樣 iOS 用戶只要手指一摸到螢幕(準備滑動網頁時)，就會自動觸發啟動
        document.body.addEventListener('touchstart', () => {
            initGyro();
        }, { once: true }); // { once: true } 代表只觸發一次，不會浪費效能
    }
});