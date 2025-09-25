document.addEventListener("DOMContentLoaded", (event) => {
    const maxRotation = 85; // カードの最大回転角度

    const outOfBoundsThreshold = 50; // カードを捲ると判定する位置パーセント

    gsap.registerPlugin(Draggable)

    // カードをドラッグ可能にする
    Draggable.create(".photo-card", {
        type: "x,y",
        inertia: true,
        bounds: ".photo-container",
        edgeResistance: 0.65,

        onMove: function() {
            const xPercent = (this.x / this.maxX) * 100;
            const yPercent = (this.y / this.maxY) * 100;

            // カードを回転させる
            rotateCard(this.target, xPercent, yPercent);
        },
        onRelease: function() {
            const xPercent = (this.x / this.maxX) * 100;
            const yPercent = (this.y / this.maxY) * 100;

            // 画面外に出たら
            if (isOutOfBounds(xPercent, yPercent)) {
                alert("Card flipped!");
            }
            resetCard();
        }
    });

    function rotateCard(card, xPercent, yPercent) {
        // カードの回転角度を計算
        let rotateX = -((yPercent - 50) / 100) * maxRotation;
        let rotateY = ((xPercent - 50) / 100) * maxRotation;

        // 回転角を制限する
        rotateX = Math.max(-maxRotation, Math.min(maxRotation, rotateX));
        rotateY = Math.max(-maxRotation, Math.min(maxRotation, rotateY));

        console.log(rotateX, rotateY);

        // 前回のアニメーションをキャンセル
        gsap.killTweensOf(card);

        // 回転アニメーションを適用
        gsap.to(card, {
            rotationX: rotateX,
            rotationY: rotateY,
            ease: "power1.out",
            duration: 0.05
        });
    }

    function isOutOfBounds(xPercent, yPercent) {
        console.log(xPercent, yPercent);
        return Math.abs(xPercent) > outOfBoundsThreshold || Math.abs(yPercent) > outOfBoundsThreshold;
    }

    function resetCard() {
        // カードを元の位置に戻すアニメーション
        gsap.to(".photo-card", {
            x: 0,
            y: 0,
            rotationX: 0,
            rotationY: 0,
            ease: "power1.out",
            duration: 0.25
        });
    }
});