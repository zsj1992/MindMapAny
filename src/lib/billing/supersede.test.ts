import assert from 'node:assert/strict';
import { supersededSubscriptionId } from '@/lib/db/repositories/billing';

/*
 * 换套餐在 Waffo 是「开一笔新订阅」，旧那笔不取消就会一直扣下去。
 * 这个判断错了就是真金白银：漏判 → 用户每月被扣两笔；误判 → 把他正在用的订阅取消掉。
 */

// 换套餐：旧订单号必须被交出来，否则它会一直扣钱
assert.equal(supersededSubscriptionId('ORD_old', 'ORD_new'), 'ORD_old', '换套餐必须报出旧订单号');

// 每月续费带的是同一个订单号 —— 这里返回非 null 会把用户刚续费的订阅立刻取消
assert.equal(supersededSubscriptionId('ORD_same', 'ORD_same'), null, '续费不是换挡，不能取消');

// 首次付款之前库里没有订单号
assert.equal(supersededSubscriptionId(null, 'ORD_new'), null, '首次付款没有旧订阅');

// 事件没带订单号时不能拿旧号去猜：取消一笔仍在生效的订阅是不可逆的
assert.equal(supersededSubscriptionId('ORD_old', null), null, '来源不明时宁可不取消');
assert.equal(supersededSubscriptionId(null, null), null);
assert.equal(supersededSubscriptionId('', 'ORD_new'), null, '空字符串不是有效订单号');

console.log('✓ 换套餐取消旧订阅：双扣与误取消两个方向都挡住了');
