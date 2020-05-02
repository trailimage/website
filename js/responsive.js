"use strict";
window.addEventListener('DOMContentLoaded', () => {
    let mobileLoaded = false;
    let desktopLoaded = false;
    let timer = 0;
    const breakAt = 1024;
    const feature = Object.assign({ facebook: false }, pageFeatures);
    window.addEventListener('resize', onResize);
    checkResources();
    function onResize() {
        if (mobileLoaded && desktopLoaded) {
            window.removeEventListener('resize', onResize);
        }
        else {
            if (timer > 0)
                window.clearTimeout(timer);
            timer = window.setTimeout(checkResources, 500);
        }
    }
    function checkResources() {
        const width = window.innerWidth;
        if (width === undefined || width > breakAt) {
            loadDesktop();
        }
        else {
            loadMobile();
        }
    }
    function prepareMenu(menuTag) {
        const onSelect = (e) => {
            const url = e.target.value;
            window.location.assign(url);
        };
        const menus = menuTag.getElementsByTagName('select');
        for (let el of Array.from(menus)) {
            el.addEventListener('select', onSelect);
            el.addEventListener('change', onSelect);
        }
    }
    function loadMobile() {
        if (mobileLoaded)
            return;
        const imageStyle = { width: '100%', height: 'auto' };
        const menu = document.getElementById('mobile-menu');
        const body = document.getElementsByName('body')[0];
        loadHTML(menu, '/mobile-menu').then(() => {
            let visible = false;
            let prepared = false;
            const openButton = document.getElementById('mobile-menu-button');
            const close = () => {
                menu.style.display = "none";
                visible = false;
                body.style.position = "static";
            };
            const prepare = () => {
                visible = true;
                if (prepared)
                    return;
                const closeButton = menu.getElementsByClassName('close')[0];
                closeButton.addEventListener('click', close);
                prepareMenu(menu);
            };
            openButton.addEventListener('click', () => {
                if (visible) {
                    close();
                }
                else {
                    body.style.position = 'fixed';
                    menu.style.display = 'block';
                    prepare();
                }
            });
        });
        mobileLoaded = true;
    }
    function loadDesktop() {
        if (desktopLoaded)
            return;
        const menu = document.getElementById('category-menu');
        loadHTML(menu, '/category-menu').then(prepareMenu);
        if (feature.facebook) {
            loadScript('facebook-jssdk', '//connect.facebook.net/en_US/all.js#xfbml=1&appId=110860435668134', true);
        }
        desktopLoaded = true;
    }
    function loadHTML(target, url) {
        return fetch(url)
            .then(res => res.text())
            .then(html => {
            target.innerHTML = html;
            return target;
        });
    }
    function loadScript(id, url, async = false) {
        let js;
        const firstScript = document.getElementsByTagName('script')[0];
        if (!document.getElementById(id)) {
            if (async === undefined)
                async = false;
            js = document.createElement('script');
            js.id = id;
            js.src = url;
            js.async = async;
            const parent = firstScript.parentNode;
            if (parent === null) {
                console.error('Failed to load script source');
            }
            else {
                parent.insertBefore(js, firstScript);
            }
        }
    }
});
