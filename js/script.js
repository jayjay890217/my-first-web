// 這裡合併了你所有的滑鼠動態邏輯
document.addEventListener('DOMContentLoaded', () => {
    const follower = document.querySelector('.cursor-follower');
    const movingImg = document.querySelector('.my-moving-png');
    const moveStrength = 40; 

    window.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        const width = window.innerWidth;
        const height = window.innerHeight;

        // 1. 處理紅點跟隨
        if (follower) {
            follower.style.left = x + 'px';
            follower.style.top = y + 'px';
        }

        // 2. 處理圖片微量移動
        if (movingImg) {
            const mouseX = (x / width) - 0.5;
            const mouseY = (y / height) - 0.5;
            const xMove = mouseX * moveStrength;
            const yMove = mouseY * moveStrength;
            movingImg.style.transform = `translate(${xMove}px, ${yMove}px)`;
        }
    });
});