"use strict";
window.addEventListener('DOMContentLoaded', () => {
    const htmlTag = document.getElementsByTagName('html')[0];
    const photos = Array.from(document.querySelectorAll('figure > img'));
    const lb = document.getElementById('light-box');
    class LightBox {
        constructor(photos, el) {
            this.el = el;
            this.bigPhoto = this.el.getElementsByTagName('img')[0];
            photos.forEach(p => p.addEventListener('click', (e) => this.onPhotoClick(e)));
            this.on('click', this.hide.bind(this));
        }
        get isLoaded() {
            return this.data("big_loaded") == "true";
        }
        set isLoaded(value) {
            this.clickedPhoto.dataset["big_loaded"] = value ? 'true' : 'false';
        }
        show() {
            this.el.style.display = 'block';
            htmlTag.style.overflow = 'hidden';
        }
        hide() {
            this.el.style.display = 'none';
            window.removeEventListener('resize', this.updateSize.bind(this));
            htmlTag.style.overflow = 'auto';
        }
        data(key) {
            return this.clickedPhoto.dataset[key];
        }
        on(eventName, handler) {
            this.el.addEventListener(eventName, handler);
        }
        off(eventName, handler) {
            this.el.removeEventListener(eventName, handler);
        }
        onPhotoClick(event) {
            event.preventDefault();
            this.clickedPhoto = event.target;
            this.size = new Size(this.data("big_width"), this.data("big_height"));
            if (this.isLoaded) {
                this.bigPhoto.src = this.data("big");
            }
            else {
                this.bigPhoto.src = this.data("src");
                this.download().then(() => {
                    this.bigPhoto.src = this.data("big");
                    this.isLoaded = true;
                });
            }
            this.bigPhoto.style.height = this.size.height.image.toString();
            this.bigPhoto.style.width = this.size.width.image.toString();
            this.updateSize(event);
            this.show();
            window.addEventListener('resize', this.updateSize.bind(this));
        }
        async download() {
            const loader = document.createElement('img');
            return new Promise(resolve => {
                loader.addEventListener('load', resolve);
                loader.src = this.data("big");
            });
        }
        move(x, y) {
            this.bigPhoto.style.transform = `translate(${x}px, ${y}px)`;
        }
        updateSize(event) {
            let cursor = 'zoom-out';
            this.size.update();
            if (this.size.needsToPan) {
                cursor = 'move';
                this.on('mousemove', this.updateHoverPosition.bind(this));
            }
            else {
                this.off('mousemove', this.updateHoverPosition.bind(this));
            }
            this.updateHoverPosition(event);
            this.bigPhoto.style.cursor = cursor;
        }
        updateHoverPosition(event) {
            const x = event.clientX;
            const y = event.clientY;
            if (x !== undefined && y !== undefined) {
                const dx = this.size.width.offset(x);
                const dy = this.size.height.offset(y);
                this.move(dx, dy);
            }
        }
    }
    class Length {
        constructor(forImage) {
            this.image = parseInt(forImage);
            this.window = 0;
            this.extra = 0;
            this.panRatio = 0;
        }
        update(forWindow) {
            this.window = forWindow;
            this.extra = (this.window - this.image) / 2;
        }
        ratio() {
            return 2 * ((this.window - this.image) / this.window);
        }
        offset(m) {
            const subtract = this.extra > 0 ? 0 : (this.window / 2 - m) * this.panRatio;
            return this.extra - subtract;
        }
        center() {
            return this.extra / 2;
        }
    }
    class Size {
        constructor(imageWidth, imageHeight) {
            this.width = new Length(imageWidth);
            this.height = new Length(imageHeight);
        }
        update() {
            this.height.update(window.innerHeight);
            this.width.update(window.innerWidth);
            this.needsToPan = this.width.extra < 0 || this.height.extra < 0;
            if (this.needsToPan) {
                this.height.panRatio = this.width.panRatio =
                    this.width.extra < this.height.extra && this.width.extra < 0
                        ? this.width.ratio()
                        : this.height.ratio();
            }
        }
    }
    class LazyLoader {
        constructor(images) {
            this.lazyTimer = 'timerid';
            this.options = {
                root: null,
                rootMargin: '0px',
                threshold: 0,
                delayLoad: 300,
            };
            this.images = images;
            if (window.IntersectionObserver) {
                this.observe();
            }
            else {
                console.warn('Browser does not support IntersectionObserver');
                this.images.forEach(this.loadImage);
            }
        }
        getTimer(el) {
            const textID = el.dataset[this.lazyTimer];
            return textID === undefined ? 0 : parseInt(textID);
        }
        clearTimer(el) {
            delete el.dataset[this.lazyTimer];
        }
        setTimer(el, id) {
            el.dataset[this.lazyTimer] = id.toString();
        }
        delayLoad(el) {
            let timerID = this.getTimer(el);
            if (timerID == 0) {
                timerID = setTimeout(() => {
                    this.observer.unobserve(el);
                    this.loadImage(el);
                    this.clearTimer(el);
                }, this.options.delayLoad);
                this.setTimer(el, timerID);
            }
        }
        cancelLoad(el) {
            const timerID = this.getTimer(el);
            if (timerID > 0) {
                clearTimeout(timerID);
                this.clearTimer(el);
            }
        }
        observe() {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach((e) => {
                    const el = e.target;
                    if (e.isIntersecting) {
                        this.delayLoad(el);
                    }
                    else {
                        this.cancelLoad(el);
                    }
                });
            }, {
                root: this.options.root,
                rootMargin: this.options.rootMargin,
                threshold: this.options.threshold,
            });
            this.images.forEach((el) => this.observer.observe(el));
        }
        loadImage(el) {
            el.src = el.dataset["src"];
        }
    }
    new LazyLoader(photos);
    new LightBox(photos, lb);
});
