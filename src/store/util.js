//根据传入的index对应修改其标签页名字
export function tabsName(index) {
  switch (index) {
    case 'main':
      return '主页';
    case "shops/wallPaper":
      return "墙纸";
    case "shops/curtain":
      return "定制窗帘";
    case "shops/softSuit":
      return "软装";
    case "shops/shoppingCurtainDetail":
      return "商品详情";
    case "statement":
      return "对账单";
    case "bankProof":
      return "银行汇款凭证";
    case "painting":
      return "委托喷绘书";
    case "yulanPainting":
      return "委托喷绘书";
    case "deputeBrush":
      return "任务查询";
    case "refundCompensation":
      return "退款赔偿";
    case "detail/detailRefund":
      return "赔偿确认书详情";
    case "design/imageShop":
      return "形象店设计";
    case "design/lanJu":
      return "兰居设计";
    case "marketInfo":
      return "调查表";
    case "downloadSpace":
      return "下载专区";
    case "shoppingCar/shopping":
      return "购物车";
    case "order/myOrder":
      return "我的订单";
    case "order/orderDetail":
      return "订单详情";
    case "order/payment":
      return "待付款";
    case "order/checkOrder":
      return "订单结算";
    case "order/mycomplaint":
      return "投诉";
    case "order/complaintResult":
      return "投诉反馈";
    case "order/logistics":
      return "查看物流";
    case "order/shipment":
      return "出货详情";
    case "detail/detailWallPaper":
      return "墙纸详情";
    case "detail/detailCurtain":
      return "窗帘详情";
    case "detail/detailSoftSuit":
      return "软装详情";
    case "order/examine":
      return "审核订单";
    case "order/examineDetail":
    case "order/examineDetailNew":
      return "审核详情";
    case "order/checkExamine":
      return "订单详情";
    case "myZone/myCoupon":
      return "我的优惠券";
    case "notification/notificationMain":
      return "公告";
    case "complaint":
      return "物流投诉";
    case "complaintReply":
      return "投诉反馈";
    case "query/stockQuery":
      return "库存查询";
    case "query/areaQuery":
      return "区域提货单查询";
    case "query/orderQuery":
      return "区域订单查询";
    case "supplierModule/supplyPort":
      return "采购单确认";
    case "supplierModule/trans":
      return "入库记录查询";
    case "supplierModule/lanJuPort":
      return "采购单确认";
    case "supplierModule/deliveryList":
      return "送货单";
    case "design/ISExamineMarket":
    case "design/ISExamineGM":
      return "形象店设计审核";
    case "design/lanJuGMExamine":
      return "兰居设计审核";
    case "design/lanJuMarketExamine":
      return "兰居设计审核";
    case "supplierModule/payDelegation":
      return "付款委托书";
    case "supplierModule/payDelegationExamine":
      return "付款委托书";
    default:
      return "xxx";
  }
}
