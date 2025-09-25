document.addEventListener("DOMContentLoaded", (event) => {
    const SENSITIVITY = 0.25; // カード回転の感度

    const outOfBoundsThreshold = 50; // カードを捲ると判定する位置パーセント

    gsap.registerPlugin(Draggable)

    // カードをドラッグ可能にする
    Draggable.create(".photo-card-wrapper", {
        type: "x,y",
        inertia: true,
        bounds: ".photos-container",
        edgeResistance: 0.85,

        onDrag: function() {
            // 中心からの移動量を取得

            const card = this.target.querySelector('.photo-card');

            // カードを回転させる
            rotateCard(card, this.x, this.y);
        },
        onRelease: function() {
            const xPercent = (this.x / this.maxX) * 100;
            const yPercent = (this.y / this.maxY) * 100;

            const card = this.target.querySelector('.photo-card');

            // 画面外に出たら
            if (isOutOfBounds(xPercent, yPercent)) {
                alert("Card flipped!");
            }

            // カードを元の位置に戻す
            resetCard(card);
            // ラッパーも元の位置に戻す
            resetCard(this.target);
        }
    });

    function rotateCard(target, x, y) {
        // 回転軸を計算
        const axisX = -y;
        const axisY = x;

        // 回転量を計算
        const distance = Math.hypot(x, y);
        const angle = distance * SENSITIVITY;

        // 前回のアニメーションをキャンセル
        gsap.killTweensOf(target);

        // 回転アニメーションを適用
        gsap.to(target, {
            transform: `rotate3d(${axisX}, ${axisY}, 0, ${angle}deg)`,
            ease: "power1.out",
            duration: 0.05
        });
    }

    function isOutOfBounds(xPercent, yPercent) {
        console.log(xPercent, yPercent);
        return Math.abs(xPercent) > outOfBoundsThreshold || Math.abs(yPercent) > outOfBoundsThreshold;
    }

    function resetCard(target) {
        // カードを元の位置に戻すアニメーション
        gsap.to(target, {
            x: 0,
            y: 0,
            transform: "rotate3d(0, 0, 0, 0deg)",
            ease: "power1.out",
            duration: 0.25
        });
    }
});