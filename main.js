document.addEventListener("DOMContentLoaded", (event) => {
    const MAX_CARD_ANGLE =  60; // カードの最大回転角度

    // カードの初期回転角度の範囲
    const CARD_DEFAULT_ANGLE_MAX = 20;
    const CARD_DEFAULT_ANGLE_MIN = -20;

    // オーバーレイを消すまでの時間
    const OVERLAY_DISAPPEAR_TIME = 3000;

    const outOfBoundsThreshold = 50; // カードを捲ると判定する位置パーセント

    const wrappers = document.querySelectorAll('.photo-card-wrapper');

    // オーバーレイが消えたか
    let isOverlayRemoved = false;

    // 一定時間経過で、オーバーレイを消す
    setTimeout(removeOverlay, OVERLAY_DISAPPEAR_TIME);

    // 写真を配置する
    setPhotoCard();

    gsap.registerPlugin(Draggable)

    // カードをドラッグ可能にする
    Draggable.create(".photo-card-wrapper", {
        type: "x,y",
        inertia: true,
        bounds: ".photos-container",
        edgeResistance: 0.85,
        zIndexBoost: false,

        onDrag: function() {
            // ドラッグしたらオーバーレイを消す
            if (!isOverlayRemoved) {
                removeOverlay();
            }

            // ドラッグ中の位置を取得
            const {x, y, maxX, maxY} = this;

            const progressX = maxX > 0 ? (x / maxX) : 0;
            const progressY = maxY > 0 ? (y / maxY) : 0;

            const card = this.target.querySelector('.photo-card');

            // カードを回転させる
            rotateCard(card, progressX, progressY);
        },
        onRelease: function() {
            const xPercent = (this.x / this.maxX) * 100;
            const yPercent = (this.y / this.maxY) * 100;

            const card = this.target.querySelector('.photo-card');

            // 画面外に出たら
            if (isOutOfBounds(xPercent, yPercent)) {
                moveCardToBottom(this.target)
            }

            // カードの回転を元に戻す
            resetRotationCard(card);

            // ラッパーを元の位置に戻す
            resetPositionCard(this.target);
        }
    });

    function removeOverlay() {
        const overlay = document.querySelector('.swipe-hint-overlay');
        overlay.style.opacity = 0;

        isOverlayRemoved = true;
    }

    function setPhotoCard() {
        let angle = 0;

        wrappers.forEach((wrapper, index) => {
            if (index === wrappers.length - 1) {
                angle = 0;
            } else {
                angle =  Math.random() * (CARD_DEFAULT_ANGLE_MAX - CARD_DEFAULT_ANGLE_MIN) + CARD_DEFAULT_ANGLE_MIN;
            }

            wrapper.style.zIndex = index;
            wrapper.style.transform = `rotate(${angle}deg)`;
        });
    }

    function rotateCard(target, progressX, progressY) {
        // 回転軸を計算
        const axisX = -progressY;
        const axisY = progressX;

        // 回転量を計算
        const distance = Math.min(Math.hypot(progressX, progressY), 1);
        const angle = distance * MAX_CARD_ANGLE;

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
        return Math.abs(xPercent) > outOfBoundsThreshold || Math.abs(yPercent) > outOfBoundsThreshold;
    }

    // カードを元の位置に戻すアニメーション
    function resetPositionCard(target) {
        gsap.to(target, {
            x: 0,
            y: 0,
            ease: "power1.out",
            duration: 0.3
        });
    }

    // カードの回転を元に戻すアニメーション
    function resetRotationCard(target) {
        gsap.to(target, {
            transform: "rotate3d(0, 0, 0, 0deg)",
            ease: "power1.out",
            duration: 0.3
        });
    }

    function moveCardToBottom(target) {
        wrappers.forEach((wrapper) => {
            if (wrapper === target) {
                // ターゲットを最背面に移動
                wrapper.style.zIndex = 0;
            } else {
                // それ以外は一つ前面に移動
                wrapper.style.zIndex = parseInt(wrapper.style.zIndex) + 1;
            }
        })
    }
});