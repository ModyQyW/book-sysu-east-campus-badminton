// ==UserScript==
// @name         book-sysu-east-campus-badminton
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  book sysu east campus badminton
// @match        http://gym.sysu.edu.cn/product/show.html?id=35
// @require      https://cdn.bootcdn.net/ajax/libs/dayjs/1.10.3/dayjs.min.js
// ==/UserScript==

(async function () {
  "use strict";

  // 延时
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // 获取当前时间
  const now = dayjs();
  const nowHourMinute = now.hour() * 100 + now.minute();
  // 根据时间实现不同行为
  if (nowHourMinute >= 600 && nowHourMinute <= 605) {
    // 开始抢场
    // 切换到预订
    $("#content .switch .boxes [rel~=shopping]").click();
    // 切换到第二天的场地
    var element = $("#datesbar .dates-viewport li[data-index=2]");
    element.click();
    // 延迟 1s，等待场地数据请求完毕，理想情况下 1s 已经加载完毕
    await sleep(1000);
    // 找到目标时段未锁定的场地，这里设置 09:00 开始的场地和 20:01 开始的场地，时段越多，效率越低
    const locations = $.merge(
      $('.badminton[data-timer|="09:00"]:not(.lock)'),
      $('.badminton[data-timer|="20:01"]:not(.lock)')
    );
    // 单个时段示例，下面一行设置为 19:01 开始的场地
    // const locations = $('.badminton[data-timer|="19:01"]:not(.lock)');
    // 设置标志，表示是否匹配到优先场地
    let flag = false;
    // 遍历 locations
    locations.each(function (index, location) {
      // 这里设置成 14 号和 4 号场为优先场地，场地越多，效率越低
      if (
        location.dataset.name === "场地4" ||
        location.dataset.name === "场地14"
      ) {
        // 修改标志
        flag = true;
        // 模拟点击
        location.click();
        // 终止遍历
        return false;
      }
    });
    // 检查是否匹配到优先场地
    if (flag === true) {
      // 模拟点击提交，后续操作不明
      $('#reserve').click();
    } else {
      // 抢场失败
      console.log("抢场失败");
    }
  } else if (nowHourMinute > 605) {
    console.log('nowHourMinute > 605');
    // 06:05 之后启动脚本，设置目标时间为第二天的 06:00:00
    const target = now.add(1, "d").hour(6).minute(0).second(0).millisecond(0);
    // 刷新页面抢场，最长 14 分钟刷新一次
    setTimeout(function () {
      location.reload();
    }, target - now > 840000 ? 840000 : target - now);
  } else {
    console.log('nowHourMinute < 600');
    // 06:00 之前启动脚本，设置目标时间为当天的 06:00:00
    const target = now.hour(6).minute(0).second(0).millisecond(0);
    // 刷新页面抢场，最长 14 分钟刷新一次
    setTimeout(function () {
      location.reload();
    }, target - now > 840000 ? 840000 : target - now);
  }
})();