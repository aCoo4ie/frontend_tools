(function scrollList() {
    var list = document.querySelector(".list");
    // 增加列表的第一项到最后一项之后
    list = copyFirstItem(list);

    var mainScrollTimer = null; // 控制整体滚动间隔的定时器
    var animationTimer = null;  // 控制单次平滑动画的定时器

    // 获取 CSS 元素的值，确保在 copyFirstItem 之后获取，因为 length 可能会变化
    var height = list.offsetHeight;
    var curIndex = 0; 
    var length = list.children.length; 

    var mainDuration = 1500; // 两次滚动之间的间隔时间 (毫秒)

    // 页面加载之后就启动滚动
    startScroll();

    // 添加鼠标悬停事件监听
    list.addEventListener("mouseenter", pauseScroll);
    list.addEventListener("mouseleave", startScroll);

    function startScroll() {
        if (mainScrollTimer === null) { // 避免重复启动
            mainScrollTimer = setInterval(moveNext, mainDuration);
        }
    }

    function pauseScroll() {
        clearInterval(mainScrollTimer);
        mainScrollTimer = null;
        clearInterval(animationTimer); // 暂停时也要清除正在进行的动画
        animationTimer = null;
    }

    function moveNext() {
        // 在开始新的动画前，清除任何可能正在进行的旧动画
        if (animationTimer !== null) {
            clearInterval(animationTimer);
            animationTimer = null;
        }

        // 计算当前滚动条位置 (from) 和目标位置 (to)
        var from = curIndex * height
        var to = from + height;
        curIndex++;

        // 局部运动的总时间（毫秒）
        var total = 300; 
        // 每次局部运动的间隔（毫秒）
        var duration = 10; 
        // 运动的总次数
        var times = total / duration;
        // 每次步进的距离
        var distance = (to - from) / times; // 每次需要滚动的距离

        // 局部动画，列表平滑过渡
        animationTimer = setInterval(function(){
            from += distance; // 累加滚动距离
            if (from >= to) {
                clearInterval(animationTimer)
                if (curIndex === length - 1) {
                    list.scrollTop = 0;
                    from = 0;
                    curIndex = 0; 
                }
            }
            list.scrollTop = from; // 更新滚动条位置
        }, duration);
    }

    function copyFirstItem(element) {
        if (!element || !element.children || element.children.length === 0) {
            console.warn("No list items to copy. Skipping copyFirstItem.");
            return element;
        }
        var firstItem = element.children[0];
        var newItem = firstItem.cloneNode(true); // 深度克隆
        element.append(newItem);
        return element;
    }
})();