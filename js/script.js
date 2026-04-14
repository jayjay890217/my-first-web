document.addEventListener('DOMContentLoaded', () => {
    const follower = document.querySelector('.cursor-follower');
    
    // 1. 改成 All，這樣會抓到一個「名單」，而不是一張圖片
    const movingImgs = document.querySelectorAll('.my-moving-png');
    const moveStrength = 40;

    window.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        const width = window.innerWidth;
        const height = window.innerHeight;

        // 處理紅點跟隨 (這部分你原本就寫對了)
        if (follower) {
            follower.style.left = x + 'px';
            follower.style.top = y + 'px';
        }

        // 2. 處理「每一張」圖片的微量移動
        // 我們叫名單裡的「每一張圖片(img)」都要做後面的動作
        movingImgs.forEach((img) => {
            const mouseX = (x / width) - 0.5;
            const mouseY = (y / height) - 0.5;
            const xMove = mouseX * moveStrength;
            const yMove = mouseY * moveStrength;

            // 把移動魔法套用到這張圖片上
            img.style.transform = `translate(${xMove}px, ${yMove}px)`;
        });
    });
});