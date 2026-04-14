document.addEventListener('DOMContentLoaded', () => {
    const follower = document.querySelector('.cursor-follower');
    const movingImgs = document.querySelectorAll('.my-moving-png');
    const moveStrength = 40;

    // --- 1. 原有的滑鼠跟隨邏輯 ---
    window.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        const width = window.innerWidth;
        const height = window.innerHeight;

        if (follower) {
            follower.style.left = x + 'px';
            follower.style.top = y + 'px';
        }

        movingImgs.forEach((img) => {
            const mouseX = (x / width) - 0.5;
            const mouseY = (y / height) - 0.5;
            img.style.transform = `translate(${mouseX * moveStrength}px, ${mouseY * moveStrength}px)`;
        });
    });

    // --- 2. 新增：陀螺儀處理邏輯 ---
    function handleOrientation(event) {
        // gamma: 左右傾斜 (-90 到 90) -> 對應 X 軸
        // beta: 前後傾斜 (-180 到 180) -> 對應 Y 軸
        let x = event.gamma; 
        let y = event.beta;

        // 數值優化：讓移動感更自然
        // 限制 gamma 在 -30 到 30 之間，並除以 30 得到 -1 到 1 的比例
        const xRatio = Math.max(-1, Math.min(1, x / 30));
        // 假設使用者拿手機角度是 45 度，所以減去 45
        const yRatio = Math.max(-1, Math.min(1, (y - 45) / 30));

        movingImgs.forEach((img) => {
            const xMove = xRatio * (moveStrength / 2); // 陀螺儀力道稍微減半比較平穩
            const yMove = yRatio * (moveStrength / 2);
            img.style.transform = `translate(${xMove}px, ${yMove}px)`;
        });
    }

    // --- 3. 新增：iOS 授權與啟動監聽 ---
    // 為了相容 iOS，建議在頁面某處加入一個按鈕或點擊事件來觸發此函數
    function initGyro() {
        if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
            // iOS 裝置
            DeviceOrientationEvent.requestPermission()
                .then(response => {
                    if (response === 'granted') {
                        window.addEventListener('deviceorientation', handleOrientation);
                    }
                })
                .catch(console.error);
        } else {
            // 非 iOS (Android 或一般電腦)
            window.addEventListener('deviceorientation', handleOrientation);
        }
    }

    // 這裡示範：點擊網頁任何地方就嘗試啟動陀螺儀 (因為 iOS 必須由使用者觸發)
    document.body.addEventListener('click', () => {
        initGyro();
    }, { once: true }); // 只執行一次
});