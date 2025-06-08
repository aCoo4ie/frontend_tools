(function(){
    function init(){
        registerEvents()
    }
    var checkboxList = document.querySelectorAll(".check")
    var checkAll = document.querySelector(".check-all")

    // 多级排序
    var sortStates = []
    // 原始tbody内容
    var tbody = document.querySelector("tbody");
    const originalRows = Array.from(tbody.querySelectorAll("tr"))
    // // 全局记录已选中的 name 顺序
    var selectedNames = [];

    function registerEvents() {
        // 注册全选事件
        checkAll.addEventListener("click", onClickCheckAll)
        // 注册单个选择事件
        checkboxList.forEach(item => {
            item.addEventListener("click", onClickCheck)
        })
        // 注册图标点击事件
        const items = document.querySelectorAll(".sort-icon-asc, .sort-icon-desc")
        items.forEach(item => {
            item.addEventListener("click", onClickSortIcon)
        })
    }

    function onClickCheckAll(){
        // 获取选中状态
        const status = this.checked
        // 点击全选关联所有子项
        checkboxList.forEach(item => {
            item.checked = status
            updateSelectedNames(item, status); // 同步更新全选情况下的记录
        })
        updateCheckedItems();
    }

    function onClickCheck(event){
        // 更新当前被点击行的选中状态（追加或移除相应的 name）
        const cb = event.target;
        updateSelectedNames(cb, cb.checked);
        var checkedNum = 0
        checkboxList.forEach(listItem => {
            listItem.checked && checkedNum++
        })
        // 关联子项状态与表头全选状态
        checkAll.checked = (checkedNum === checkboxList.length)

        updateCheckedItems()
    }
    // 根据 checkbox 状态更新全局记录
    function updateSelectedNames(checkbox, isChecked) {
        const tr = checkbox.closest("tr");
        const name = tr.querySelector("td[data-column='name']").textContent.trim();
        if (isChecked) {
            // 如果未记录，则追加到末尾
            if (selectedNames.indexOf(name) === -1) {
                selectedNames.push(name);
            }
        } else {
            // 取消选中则移除对应 name
            const index = selectedNames.indexOf(name);
            if (index > -1) {
                selectedNames.splice(index, 1);
            }
        }
    }

    function updateCheckedItems() {
        const items = document.querySelector(".checked-items");
        items.innerHTML = `${selectedNames.map(n => `<h4>${n}</h4>`).join("")}`;
        console.log(selectedNames);
    }

    function onClickSortIcon(){
        const column = this.dataset.column
        // 检测是否已经是排序状态
        const isActive = this.classList.contains("active")
        const direction = this.classList.contains("sort-icon-asc") ? "asc": "desc"
        
        // 移除所有列的 active 类
        document.querySelectorAll(`[data-column="${column}"]`).forEach(i => {
            i.classList.remove("active")
        })
        if (!isActive) {
        // 给当前点击的图标添加 active 类
            this.classList.add("active")
            sortStates = sortStates.filter(s => s.column !== column)
            // 添加多列排序
            sortStates.push({column, direction})
            sortTableByMultiColumns()
        } else {
            // 重复点击取消排序
            sortStates = sortStates.filter(s => s.column !== column)
            sortTableByMultiColumns()
        }
    }

    function sortTableByMultiColumns() {
        // 每次排序都从原始行的副本开始
        let rows = originalRows.slice(); // 使用.slice()创建originalRows的浅拷贝，避免修改原始数据

        if (sortStates.length === 0) {
            tbody.innerHTML = ""
            rows.forEach(row => tbody.append(row))
            return
        }
        
        rows.sort((a, b) => {
            for (let i=0; i<sortStates.length; i++) {
                const {column, direction} = sortStates[i]
                const aText = a.querySelector(`td[data-column=${column}]`).textContent.trim()
                const bText = b.querySelector(`td[data-column=${column}]`).textContent.trim()
                const isNum = !isNaN(Number(aText)) && !isNaN(Number(bText))
                let result
                if (isNum) {
                    result = Number(aText) - Number(bText)
                } else {
                    result = aText.localeCompare(bText)
                }
                if (result !== 0) {
                    return direction === 'asc' ? result : -result
                }
            }
            return 0
        })
        tbody.innerHTML = ""
        rows.forEach(row => tbody.append(row))
    }

    // 程序入口
    init();
}
)()