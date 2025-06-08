(function(){
    // 交互动画
    var titles = document.querySelectorAll(".menu h2")
    titles.forEach(title => {
        // 注册点击事件
        title.addEventListener("click", () =>{
            clickMenu(title)
        })
    })

    function clickMenu(item) {
        // 手风琴效果
        var menuOpened = document.querySelector(".submenu[status=opened")
        if (menuOpened) {
            closeSubMenu(menuOpened)
        }
        // 获取下一个兄弟节点，包含了子菜单
        const list = item.nextElementSibling
        toggleStatus(list)
    }
    // 切换状态
    function toggleStatus(item) {
        const status = item.getAttribute("status")
        if (status === "playing") {
            return
        }
        else if (status == null || status === "closed") {
            openSubmenu(item)
        } else {
            closeSubMenu(item)
        }
    }

    // 关闭子菜单
    function closeSubMenu(item) {
        item.setAttribute("status", "playing")
        const length = item.children.length
        const height = item.children[0].offsetHeight
        // 计算运动总距离
        const distance = length * height
        // 运动总时间
        const total = 500
        // 运动间隔
        const duration = 20
        // 运动控制动画
        menuAnimation({
            from: distance,
            to: 0,
            total: total,
            duration: duration,
            onmove: function(n) {
                item.style.height = n + "px"
            },
            onend: function() {
                item.setAttribute("status", "closed")
            }
        })
    }
    // 打开子菜单
    function openSubmenu(item) {
        item.setAttribute("status", "playing")
        const length = item.children.length
        const height = item.children[0].offsetHeight
        // 计算运动总距离
        const distance = length * height
        // 运动总时间
        const total = 500
        // 运动间隔
        const duration = 20
        // 运动控制动画
        menuAnimation({
            from: 0,
            to: distance,
            total: total,
            duration: duration,
            onmove: function(n) {
                item.style.height = n + "px"
            },
            onend: function() {
                item.setAttribute("status", "opened")
            }
        })
    }

    // 运动控制
    function menuAnimation(options){
        var from = options.from;
        var to = options.to;
        console.log(from, to);
        if (from == null || to == null) {
            console.error("No from or to, can't animate");
            return;
        }
        const total = options.total || 1500
        const duration = options.duration || 10
        // 变化的总次数
        const times = Math.floor(total / duration)
        // 每次动画移动的距离
        const dis = (to - from) / times
        // 当前变化的次数
        var curTimes = 0
        var timerId = setInterval(function(){
            from += dis
            curTimes++
            if (curTimes >= times) {
                from = to
                clearInterval(timerId)
                // 动画运动结束的回调函数
                options.onend && options.onend()
            }
            // 动画移动中的回调函数
            options.onmove && options.onmove(from)
        }, duration)
    }
})()